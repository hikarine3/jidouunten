#!/usr/bin/env python3
"""Create and configure the dedicated jidouunten.jp GTM container.

Uses the existing company OAuth credential without copying it into this repo.
The script is idempotent by resource name and domain. It never prints tokens.
"""

from __future__ import annotations

import argparse
import json
import pickle
from pathlib import Path

from googleapiclient.discovery import build


REPO_ROOT = Path(__file__).resolve().parents[1]
REFERENCE_REPO = REPO_ROOT.parent / "vpshikaku"
GTM_TOKEN = REFERENCE_REPO / ".cache" / "gtm_token.pickle"
STATE_PATH = REPO_ROOT / ".cache" / "measurement_state.json"
REFERENCE_CONTAINER_PUBLIC_ID = "GTM-W57ZSG"
CONTAINER_NAME = "jidouunten.jp"
DOMAINS = ["jidouunten.jp", "www.jidouunten.jp"]
ALL_PAGES_TRIGGER_ID = "2147479553"

EVENT_PARAMETERS = {
    "select_level": ("level",),
    "filter_results": ("filter_name", "filter_value", "result_count"),
    "filter_empty_results": ("filter_name", "filter_value", "result_count"),
    "filter_relaxation_shown": ("filter_name", "relaxation_count"),
    "filter_relaxation_apply": ("filter_name", "relaxation_filter", "result_count"),
    "compare_vehicles": ("vehicle_ids", "vehicle_count"),
    "compare_complete": ("vehicle_ids", "vehicle_count", "diff_count", "completion_definition"),
    "view_vehicle": ("vehicle_id", "model_year", "grade"),
    "outbound_manufacturer": ("vehicle_id", "manufacturer", "link_url", "link_domain", "link_type", "placement"),
    "outbound_purchase_action": ("vehicle_id", "manufacturer", "action_type", "link_url", "link_domain", "placement"),
    # お気に入りの台数だけを測り、車両ID・検索語・保存内容は送らない。
    "favorites_add": ("favorite_count",),
    "favorites_remove": ("favorite_count",),
    "favorites_open": ("favorite_count",),
}


def service():
    with GTM_TOKEN.open("rb") as stream:
        credentials = pickle.load(stream)
    return build("tagmanager", "v2", credentials=credentials, cache_discovery=False)


def account_and_container(svc):
    selected_account = None
    target = None
    for account in svc.accounts().list().execute().get("account", []):
        containers = svc.accounts().containers().list(parent=account["path"]).execute().get("container", [])
        if any(item.get("publicId") == REFERENCE_CONTAINER_PUBLIC_ID for item in containers):
            selected_account = account
            target = next(
                (
                    item
                    for item in containers
                    if item.get("name") == CONTAINER_NAME
                    or CONTAINER_NAME in item.get("domainName", [])
                ),
                None,
            )
            break
    if selected_account is None:
        raise RuntimeError("Reference company GTM container was not found")
    return selected_account, target


def ensure_container(svc):
    account, container = account_and_container(svc)
    created = False
    if container is None:
        container = svc.accounts().containers().create(
            parent=account["path"],
            body={
                "name": CONTAINER_NAME,
                "usageContext": ["web"],
                "domainName": DOMAINS,
                "notes": "Dedicated web container for jidouunten.jp",
            },
        ).execute()
        created = True
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    state = {
        "gtm_public_id": container["publicId"],
        "gtm_container_path": container["path"],
    }
    STATE_PATH.write_text(json.dumps(state, indent=2) + "\n")
    print(json.dumps({"created": created, "public_id": container["publicId"]}))
    return container


def default_workspace(svc, container):
    workspaces = svc.accounts().containers().workspaces().list(parent=container["path"]).execute().get("workspace", [])
    if not workspaces:
        raise RuntimeError("GTM container has no workspace")
    return next((item for item in workspaces if "Default" in item.get("name", "")), workspaces[0])


def list_named(svc, workspace_path, resource, singular):
    endpoint = getattr(svc.accounts().containers().workspaces(), resource)()
    return {
        item["name"]: item
        for item in endpoint.list(parent=workspace_path).execute().get(singular, [])
    }


def ensure_resource(endpoint, existing, name, body):
    current = existing.get(name)
    if current is not None:
        return current, False
    return endpoint.create(parent=body.pop("_parent"), body=body).execute(), True


def ensure_variable(svc, workspace_path, name, existing):
    endpoint = svc.accounts().containers().workspaces().variables()
    body = {
        "_parent": workspace_path,
        "name": f"DLV - {name}",
        "type": "v",
        "parameter": [
            {"type": "integer", "key": "dataLayerVersion", "value": "2"},
            {"type": "template", "key": "name", "value": name},
        ],
    }
    item, changed = ensure_resource(endpoint, existing, body["name"], body)
    existing[item["name"]] = item
    return changed


def ensure_trigger(svc, workspace_path, event_name, existing):
    endpoint = svc.accounts().containers().workspaces().triggers()
    name = f"Custom Event - {event_name}"
    body = {
        "_parent": workspace_path,
        "name": name,
        "type": "CUSTOM_EVENT",
        "customEventFilter": [
            {
                "type": "EQUALS",
                "parameter": [
                    {"type": "TEMPLATE", "key": "arg0", "value": "{{_event}}"},
                    {"type": "TEMPLATE", "key": "arg1", "value": event_name},
                ],
            }
        ],
    }
    item, changed = ensure_resource(endpoint, existing, name, body)
    existing[item["name"]] = item
    return item, changed


def native_event_parameters(event_name, parameters, measurement_id):
    """Return the GA4 Event built-in tag schema used by GTM API v2."""
    rows = [
        {
            "type": "map",
            "map": [
                {"type": "template", "key": "parameter", "value": parameter},
                {
                    "type": "template",
                    "key": "parameterValue",
                    "value": "{{DLV - " + parameter + "}}",
                },
            ],
        }
        for parameter in parameters
    ]
    return [
        {"type": "list", "key": "eventSettingsTable", "list": rows},
        {"type": "template", "key": "eventName", "value": event_name},
        {
            "type": "template",
            "key": "measurementIdOverride",
            "value": measurement_id,
        },
    ]


def ensure_tag(svc, workspace_path, name, body, existing):
    endpoint = svc.accounts().containers().workspaces().tags()
    current = existing.get(name)
    if current is None:
        body["name"] = name
        item = endpoint.create(parent=workspace_path, body=body).execute()
        existing[item["name"]] = item
        return item, True

    comparable = {
        "type": current.get("type"),
        "parameter": current.get("parameter", []),
        "firingTriggerId": current.get("firingTriggerId", []),
        "paused": current.get("paused", False),
    }
    desired = {
        "type": body.get("type"),
        "parameter": body.get("parameter", []),
        "firingTriggerId": body.get("firingTriggerId", []),
        "paused": body.get("paused", False),
    }
    if comparable == desired:
        return current, False
    update = dict(current)
    update.update(body)
    item = endpoint.update(path=current["path"], body=update).execute()
    existing[item["name"]] = item
    return item, True


def configure(svc, container, measurement_id):
    if not measurement_id.startswith("G-"):
        raise ValueError("GA4 measurement ID must start with G-")
    workspace = default_workspace(svc, container)
    workspace_path = workspace["path"]
    changed = 0
    tags = list_named(svc, workspace_path, "tags", "tag")
    triggers = list_named(svc, workspace_path, "triggers", "trigger")
    variables = list_named(svc, workspace_path, "variables", "variable")

    _, did_change = ensure_tag(
        svc,
        workspace_path,
        "Google tag - jidouunten.jp",
        {
            "type": "googtag",
            "parameter": [{"type": "template", "key": "tagId", "value": measurement_id}],
            "firingTriggerId": [ALL_PAGES_TRIGGER_ID],
        },
        tags,
    )
    changed += did_change

    for parameters in EVENT_PARAMETERS.values():
        for parameter in parameters:
            changed += ensure_variable(svc, workspace_path, parameter, variables)

    for event_name, parameters in EVENT_PARAMETERS.items():
        trigger, did_change = ensure_trigger(svc, workspace_path, event_name, triggers)
        changed += did_change
        _, did_change = ensure_tag(
            svc,
            workspace_path,
            f"GA4 Event - {event_name}",
            {
                "type": "gaawe",
                "parameter": native_event_parameters(event_name, parameters, measurement_id),
                "firingTriggerId": [str(trigger["triggerId"])],
                "tagFiringOption": "oncePerEvent",
                "paused": False,
            },
            tags,
        )
        changed += did_change

    state = json.loads(STATE_PATH.read_text()) if STATE_PATH.exists() else {}
    state["ga4_measurement_id"] = measurement_id
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(state, indent=2) + "\n")
    print(json.dumps({"configured": True, "changes": changed, "events": list(EVENT_PARAMETERS)}))
    return workspace, changed


def publish(svc, workspace, changed):
    status = svc.accounts().containers().workspaces().getStatus(path=workspace["path"]).execute()
    if not changed and not status.get("workspaceChange"):
        print(json.dumps({"published": False, "reason": "no_changes"}))
        return
    result = svc.accounts().containers().workspaces().create_version(
        path=workspace["path"],
        body={
            "name": "jidouunten.jp initial GA4 measurement",
            "notes": "Google tag and selector/purchase decision events",
        },
    ).execute()
    version = result.get("containerVersion", {})
    published = svc.accounts().containers().versions().publish(path=version["path"]).execute()
    if published.get("compilerError"):
        raise RuntimeError("GTM compiler error; container was not published")
    print(json.dumps({"published": True, "version_id": version.get("containerVersionId")}))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--create-container", action="store_true")
    parser.add_argument("--measurement-id")
    parser.add_argument("--publish", action="store_true")
    args = parser.parse_args()
    if not args.create_container and not args.measurement_id:
        parser.error("use --create-container and/or --measurement-id")
    svc = service()
    container = ensure_container(svc)
    if args.measurement_id:
        workspace, changed = configure(svc, container, args.measurement_id)
        if args.publish:
            publish(svc, workspace, changed)


if __name__ == "__main__":
    main()

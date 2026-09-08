#!/usr/bin/env python3
"""Read and update the jidouunten GitHub delivery board.

GitHub Project #5 and its Issues are the live work-state source.  A Phase 0
portfolio is evidence, not a second queue: every candidate is validated before
the first GitHub write, then registration is idempotent through a stable marker.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "docs/pm/github-project.json"
ID_IN_TITLE = re.compile(r"\bJID-[A-Z0-9][A-Z0-9-]*\b", re.IGNORECASE)
ID_FORMAT = re.compile(r"^JID-[A-Z0-9][A-Z0-9-]{0,75}$")
PRIORITY_ORDER = {"P0": 0, "P1": 1, "P2": 2, "P3": 3}
PHASE0_MIN_READY_CANDIDATES = 10


class BoardError(RuntimeError):
    pass


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise BoardError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise BoardError(f"{path} must contain an object")
    return value


def run_gh(args: list[str], *, expect_json: bool = False) -> Any:
    proc = subprocess.run(
        ["gh", *args], cwd=ROOT, text=True, capture_output=True, check=False
    )
    if proc.returncode:
        detail = proc.stderr.strip() or proc.stdout.strip() or f"exit {proc.returncode}"
        raise BoardError(f"gh {' '.join(args)}: {detail}")
    if not expect_json:
        return proc.stdout.strip()
    try:
        return json.loads(proc.stdout or "{}")
    except json.JSONDecodeError as exc:
        raise BoardError(f"gh returned invalid JSON: {exc}") from exc


def candidate_marker(sprint_id: str) -> str:
    return f"<!-- jidouunten-work-item:{sprint_id} -->"


def phase0_minimum(config: dict[str, Any]) -> int:
    value = config.get("minimum_ready_candidates")
    if isinstance(value, bool) or not isinstance(value, int) or value <= 0:
        raise BoardError("minimum_ready_candidates must be a positive integer")
    return max(PHASE0_MIN_READY_CANDIDATES, value)


def is_public_surface(value: str) -> bool:
    return (value.startswith("/") and not value.startswith("//")) or value.startswith("https://jidouunten.jp/")


def validate_evidence(rows: Any) -> list[str]:
    if not isinstance(rows, list) or not rows:
        return ["market_evidence must contain at least one observed source"]
    errors: list[str] = []
    for index, row in enumerate(rows, start=1):
        if not isinstance(row, dict):
            errors.append(f"market_evidence #{index} must be an object")
            continue
        for key in ("url", "observed_at", "finding"):
            if not str(row.get(key) or "").strip():
                errors.append(f"market_evidence #{index} lacks {key}")
        if row.get("url") and not str(row["url"]).startswith("https://"):
            errors.append(f"market_evidence #{index} url must use https")
        if row.get("observed_at"):
            try:
                date.fromisoformat(str(row["observed_at"]))
            except ValueError:
                errors.append(f"market_evidence #{index} observed_at must be a real YYYY-MM-DD date")
    return errors


def validate_candidate(config: dict[str, Any], candidate: Any) -> list[str]:
    if not isinstance(candidate, dict):
        return ["candidate must be an object"]
    required_text = (
        "sprint_id", "title", "user_outcome", "baseline", "market_demand",
        "competitive_gap", "compounding_advantage", "impact_estimate",
        "success_signal", "failure_signal",
    )
    required = set(required_text) | {
        "priority", "rank", "status", "work_type", "primary_value", "lane",
        "effort", "estimated_hours", "public_surfaces", "acceptance_criteria",
        "dependencies", "blocking_dependencies", "non_goals", "market_evidence",
        "drafted_by",
    }
    missing = sorted(required - set(candidate))
    if missing:
        return ["candidate lacks fields: " + ", ".join(missing)]

    errors: list[str] = []
    for key in required_text:
        if not str(candidate.get(key) or "").strip():
            errors.append(f"{key} must not be empty")
    sprint_id = str(candidate.get("sprint_id") or "")
    if not ID_FORMAT.fullmatch(sprint_id):
        errors.append("sprint_id must start with JID- and use uppercase letters, digits, or hyphens")
    if ID_IN_TITLE.search(str(candidate.get("title") or "")):
        errors.append("title must not repeat a JID identifier")

    contracts = config.get("field_contract") or {}
    option_fields = {
        "priority": "Work priority",
        "work_type": "Work type",
        "primary_value": "Primary value",
        "lane": "Lane",
        "effort": "Effort",
    }
    for candidate_key, field_name in option_fields.items():
        if candidate.get(candidate_key) not in contracts.get(field_name, []):
            errors.append(f"{candidate_key} is outside the Project contract")
    if candidate.get("status") not in {"ready", "backlog"}:
        errors.append("status must be ready or backlog")

    rank = candidate.get("rank")
    if isinstance(rank, bool) or not isinstance(rank, (int, float)) or rank <= 0:
        errors.append("rank must be a positive number")
    hours = candidate.get("estimated_hours")
    if isinstance(hours, bool) or not isinstance(hours, (int, float)) or hours <= 0:
        errors.append("estimated_hours must be a positive number")

    surfaces = candidate.get("public_surfaces")
    if not isinstance(surfaces, list) or not surfaces or not all(
        isinstance(value, str) and is_public_surface(value) for value in surfaces
    ):
        errors.append("public_surfaces must contain at least one jidouunten public path or URL")
    for key in ("acceptance_criteria", "dependencies", "blocking_dependencies", "non_goals"):
        rows = candidate.get(key)
        if not isinstance(rows, list) or not all(isinstance(value, str) for value in rows):
            errors.append(f"{key} must be a string array")
    if isinstance(candidate.get("acceptance_criteria"), list) and not candidate["acceptance_criteria"]:
        errors.append("acceptance_criteria must not be empty")
    if candidate.get("status") == "ready" and candidate.get("blocking_dependencies"):
        errors.append("Ready candidate must not have blocking_dependencies")

    drafted = candidate.get("drafted_by")
    if not isinstance(drafted, dict):
        errors.append("drafted_by must be an object")
    else:
        absent = [key for key in ("agent", "model", "effort") if not str(drafted.get(key) or "").strip()]
        if absent:
            errors.append("drafted_by lacks " + ", ".join(absent))
    errors.extend(validate_evidence(candidate.get("market_evidence")))
    return errors


def validate_portfolio(config: dict[str, Any], portfolio: Any) -> list[str]:
    if not isinstance(portfolio, dict) or portfolio.get("schema_version") != 1:
        return ["unsupported Phase 0 portfolio schema"]
    candidates = portfolio.get("candidates")
    if not isinstance(candidates, list):
        return ["Phase 0 portfolio candidates must be an array"]

    errors: list[str] = []
    ready_count = 0
    ids: set[str] = set()
    titles: set[str] = set()
    priority_ranks: set[tuple[str, float]] = set()
    for index, candidate in enumerate(candidates, start=1):
        candidate_errors = validate_candidate(config, candidate)
        sprint_id = str(candidate.get("sprint_id") if isinstance(candidate, dict) else f"#{index}")
        errors.extend(f"{sprint_id}: {error}" for error in candidate_errors)
        if isinstance(candidate, dict) and candidate.get("status") == "ready" and not candidate_errors:
            ready_count += 1
        if not isinstance(candidate, dict):
            continue
        normalized_title = re.sub(r"\s+", " ", str(candidate.get("title") or "").strip()).casefold()
        if sprint_id in ids:
            errors.append(f"duplicate candidate sprint_id: {sprint_id}")
        if normalized_title and normalized_title in titles:
            errors.append(f"duplicate candidate title: {candidate.get('title')}")
        ids.add(sprint_id)
        titles.add(normalized_title)
        priority = candidate.get("priority")
        rank = candidate.get("rank")
        if isinstance(priority, str) and isinstance(rank, (int, float)) and not isinstance(rank, bool):
            key = (priority, float(rank))
            if key in priority_ranks:
                errors.append(f"duplicate candidate priority/rank: {priority} R{rank}")
            priority_ranks.add(key)

    try:
        minimum = phase0_minimum(config)
    except BoardError as exc:
        errors.append(str(exc))
        minimum = PHASE0_MIN_READY_CANDIDATES
    if ready_count < minimum:
        errors.append(
            f"Phase 0 portfolio has {ready_count} valid Ready candidates; at least {minimum} are required"
        )
    return errors


def issue_body(candidate: dict[str, Any]) -> str:
    def bullets(values: list[str]) -> str:
        return "\n".join(f"- {value}" for value in values) or "- なし"

    evidence = "\n".join(
        f"- {row['observed_at']} — {row['finding']} ({row['url']})"
        for row in candidate["market_evidence"]
    )
    acceptance = "\n".join(f"- [ ] {value}" for value in candidate["acceptance_criteria"])
    drafted = candidate["drafted_by"]
    return f"""## Why / 利用者成果
{candidate['user_outcome']}

## Phase 0 evidence
- baseline: {candidate['baseline']}
- market demand: {candidate['market_demand']}
- competitive gap: {candidate['competitive_gap']}
- compounding advantage: {candidate['compounding_advantage']}
- expected impact: {candidate['impact_estimate']}

{evidence}

## Core / 完了条件
{acceptance}

## Public surfaces
{bullets(candidate['public_surfaces'])}

## Measurement
- success: {candidate['success_signal']}
- failure: {candidate['failure_signal']}
- estimated hours: {candidate['estimated_hours']}

## Dependencies
{bullets(candidate['dependencies'])}

## Blocking dependencies
{bullets(candidate['blocking_dependencies'])}

## Non-goals
{bullets(candidate['non_goals'])}

## Draft provenance
- agent: {drafted['agent']}
- model: {drafted['model']}
- effort: {drafted['effort']}

{candidate_marker(candidate['sprint_id'])}
"""


def project_view(config: dict[str, Any]) -> dict[str, Any]:
    return run_gh([
        "project", "view", str(config["project_number"]), "--owner", config["owner"],
        "--format", "json",
    ], expect_json=True)


def project_fields(config: dict[str, Any]) -> dict[str, dict[str, Any]]:
    raw = run_gh([
        "project", "field-list", str(config["project_number"]), "--owner", config["owner"],
        "--format", "json",
    ], expect_json=True)
    return {str(field.get("name")): field for field in raw.get("fields", [])}


def project_items(config: dict[str, Any]) -> list[dict[str, Any]]:
    raw = run_gh([
        "project", "item-list", str(config["project_number"]), "--owner", config["owner"],
        "--format", "json", "--limit", "500",
    ], expect_json=True)
    return [row for row in raw.get("items", []) if isinstance(row, dict)]


def doctor(config: dict[str, Any]) -> tuple[dict[str, Any], dict[str, dict[str, Any]]]:
    phase0_minimum(config)
    run_gh(["auth", "status"])
    view = project_view(config)
    if view.get("title") != config.get("project_title"):
        raise BoardError("configured GitHub Project title does not match")
    fields = project_fields(config)
    missing = sorted(set(config.get("required_fields", [])) - set(fields))
    if missing:
        raise BoardError("GitHub Project lacks fields: " + ", ".join(missing))
    for name, expected in (config.get("field_contract") or {}).items():
        actual = [option.get("name") for option in fields[name].get("options", [])]
        if actual != expected:
            raise BoardError(f"GitHub Project field contract drift: {name}")
    project_items(config)
    return view, fields


def item_summary(row: dict[str, Any]) -> dict[str, Any]:
    content = row.get("content") if isinstance(row.get("content"), dict) else {}
    title = str(content.get("title") or row.get("title") or "")
    match = ID_IN_TITLE.search(title)
    return {
        "item_id": row.get("id"),
        "issue_number": content.get("number"),
        "sprint_id": match.group(0).upper() if match else "",
        "title": title,
        "url": content.get("url"),
        "priority": row.get("work priority"),
        "rank": row.get("rank"),
        "status": row.get("status"),
        "phase": row.get("pM Phase"),
    }


def numeric_rank(value: Any) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return float("inf")


def select_next(items: list[dict[str, Any]]) -> dict[str, Any]:
    active = [item_summary(row) for row in items if row.get("status") == "In progress"]
    if active:
        return {"status": "active", "items": sorted(active, key=lambda row: (PRIORITY_ORDER.get(str(row["priority"]), 99), numeric_rank(row["rank"]), str(row["title"])))}
    ready = [item_summary(row) for row in items if row.get("status") == "Ready"]
    if not ready:
        return {"status": "exhausted", "ready_count": 0}
    ready.sort(key=lambda row: (PRIORITY_ORDER.get(str(row["priority"]), 99), numeric_rank(row["rank"]), str(row["title"])))
    return {"status": "ready", "candidate": ready[0], "ready_count": len(ready)}


def attach_next_action(config: dict[str, Any], result: dict[str, Any]) -> dict[str, Any]:
    if result.get("status") != "exhausted":
        return result
    return {
        **result,
        "next_action": "phase0",
        "phase0_prompt": "docs/pm/prompts/phase_0.md",
        "minimum_ready_candidates": phase0_minimum(config),
    }


def existing_issues(config: dict[str, Any]) -> list[dict[str, Any]]:
    raw = run_gh([
        "issue", "list", "--repo", config["repository"], "--state", "all", "--limit", "500",
        "--json", "number,title,body,url,state",
    ], expect_json=True)
    return [row for row in raw if isinstance(row, dict)]


def preflight_issue_conflicts(candidates: list[dict[str, Any]], issues: list[dict[str, Any]]) -> list[str]:
    errors: list[str] = []
    for candidate in candidates:
        sprint_id = candidate["sprint_id"]
        exact_marker = candidate_marker(sprint_id)
        marked: list[dict[str, Any]] = []
        conflicting: list[dict[str, Any]] = []
        duplicate_titles: list[dict[str, Any]] = []
        candidate_title = re.sub(r"\s+", " ", candidate["title"].strip()).casefold()
        for issue in issues:
            body = str(issue.get("body") or "")
            title = str(issue.get("title") or "")
            if exact_marker in body:
                marked.append(issue)
                continue
            if re.search(rf"\b{re.escape(sprint_id)}\b", title, re.IGNORECASE):
                conflicting.append(issue)
            core_title = re.sub(r"^JID-[A-Z0-9-]+\s*:\s*", "", title, flags=re.IGNORECASE)
            if re.sub(r"\s+", " ", core_title.strip()).casefold() == candidate_title:
                duplicate_titles.append(issue)
        if len(marked) > 1:
            errors.append(f"{sprint_id}: multiple Issues contain the stable marker")
        for issue in marked:
            if issue.get("state") != "OPEN":
                errors.append(f"{sprint_id}: matching marked Issue is closed: {issue.get('url')}")
        for issue in conflicting:
            errors.append(f"{sprint_id}: unmarked Issue already uses this ID: {issue.get('url')}")
        for issue in duplicate_titles:
            errors.append(f"{sprint_id}: existing Issue already has this title: {issue.get('url')}")
    return errors


def ensure_issue(config: dict[str, Any], candidate: dict[str, Any], issues: list[dict[str, Any]]) -> dict[str, Any]:
    marker = candidate_marker(candidate["sprint_id"])
    title = f"{candidate['sprint_id']}: {candidate['title']}"
    body = issue_body(candidate)
    for issue in issues:
        if marker in str(issue.get("body") or ""):
            run_gh(["issue", "edit", str(issue["url"]), "--repo", config["repository"], "--title", title, "--body", body])
            return issue
    url = run_gh(["issue", "create", "--repo", config["repository"], "--title", title, "--body", body])
    issue = {"url": url.strip(), "title": title, "body": body, "state": "OPEN"}
    issues.append(issue)
    return issue


def option_id(fields: dict[str, dict[str, Any]], field_name: str, option_name: str) -> str:
    for option in fields[field_name].get("options", []):
        if option.get("name") == option_name:
            return str(option["id"])
    raise BoardError(f"Project option not found: {field_name}={option_name}")


def edit_item(project_id: str, item_id: str, field_id: str, flag: str, value: str) -> None:
    run_gh([
        "project", "item-edit", "--id", item_id, "--project-id", project_id,
        "--field-id", field_id, flag, value,
    ])


def ensure_project_item(config: dict[str, Any], issue_url: str, items: list[dict[str, Any]]) -> dict[str, Any]:
    for row in items:
        content = row.get("content") if isinstance(row.get("content"), dict) else {}
        if content.get("url") == issue_url:
            return row
    row = run_gh([
        "project", "item-add", str(config["project_number"]), "--owner", config["owner"],
        "--url", issue_url, "--format", "json",
    ], expect_json=True)
    items.append(row)
    return row


def set_candidate_fields(
    project_id: str,
    item_id: str,
    fields: dict[str, dict[str, Any]],
    candidate: dict[str, Any],
) -> None:
    singles = {
        "Work type": candidate["work_type"],
        "Work priority": candidate["priority"],
        "Primary value": candidate["primary_value"],
        "PM Phase": "0",
        "Lane": candidate["lane"],
        "Effort": candidate["effort"],
        "Release status": "NOT_DEPLOYED",
    }
    for name, value in singles.items():
        edit_item(project_id, item_id, str(fields[name]["id"]), "--single-select-option-id", option_id(fields, name, value))
    edit_item(project_id, item_id, str(fields["Target URL"]["id"]), "--text", candidate["public_surfaces"][0])
    edit_item(project_id, item_id, str(fields["Expected impact"]["id"]), "--text", candidate["impact_estimate"])
    edit_item(project_id, item_id, str(fields["Rank"]["id"]), "--number", str(candidate["rank"]))
    status = "Ready" if candidate["status"] == "ready" else "Backlog"
    # Status is intentionally the final write so a partially configured item is never claimable.
    edit_item(project_id, item_id, str(fields["Status"]["id"]), "--single-select-option-id", option_id(fields, "Status", status))


def add_portfolio(config: dict[str, Any], manifest: Path) -> None:
    portfolio = load_json(manifest)
    errors = validate_portfolio(config, portfolio)
    if errors:
        raise BoardError("invalid Phase 0 portfolio: " + "; ".join(errors))
    view, fields = doctor(config)
    issues = existing_issues(config)
    errors = preflight_issue_conflicts(portfolio["candidates"], issues)
    if errors:
        raise BoardError("Phase 0 Issue preflight failed: " + "; ".join(errors))
    items = project_items(config)
    for candidate in portfolio["candidates"]:
        issue = ensure_issue(config, candidate, issues)
        row = ensure_project_item(config, str(issue["url"]), items)
        item_id = str(row.get("id") or "")
        if not item_id:
            raise BoardError(f"Project item ID missing after add: {issue['url']}")
        set_candidate_fields(str(view["id"]), item_id, fields, candidate)
        print(f"ADDED: {candidate['sprint_id']} {issue['url']}")
    print(f"PORTFOLIO_ADDED: ready={sum(row['status'] == 'ready' for row in portfolio['candidates'])} total={len(portfolio['candidates'])}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("doctor")
    next_parser = sub.add_parser("next")
    next_parser.add_argument("--json", action="store_true")
    validate_parser = sub.add_parser("validate-portfolio")
    validate_parser.add_argument("--manifest", type=Path, required=True)
    add_parser = sub.add_parser("add-portfolio")
    add_parser.add_argument("--manifest", type=Path, required=True)
    args = parser.parse_args()

    try:
        config = load_json(CONFIG_PATH)
        if args.command == "doctor":
            view, _ = doctor(config)
            print(f"PASS: GitHub Project {view['title']} is available and matches the field contract")
        elif args.command == "next":
            result = attach_next_action(config, select_next(project_items(config)))
            if args.json:
                print(json.dumps(result, ensure_ascii=False, indent=2))
            else:
                print(result["status"])
        elif args.command == "validate-portfolio":
            errors = validate_portfolio(config, load_json(args.manifest))
            if errors:
                raise BoardError("invalid Phase 0 portfolio: " + "; ".join(errors))
            count = sum(row.get("status") == "ready" for row in load_json(args.manifest)["candidates"])
            print(f"PASS: Phase 0 portfolio has {count} valid Ready candidates")
        elif args.command == "add-portfolio":
            add_portfolio(config, args.manifest)
        return 0
    except BoardError as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

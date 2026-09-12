#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: $0 \"commit message\"" >&2
  exit 2
fi

message=$1
status=$(git status --porcelain)
if [[ -z "$status" ]]; then
  echo "checkpoint: no changes are staged" >&2
  exit 1
fi

# Never sweep up a writer's unfinished or unrelated edits. Every changed path
# must already be staged, and untracked files must be explicitly git-added.
while IFS= read -r line; do
  [[ -z "$line" ]] && continue
  if [[ "${line:0:2}" == "??" || "${line:1:1}" != " " ]]; then
    echo "checkpoint: unstaged or untracked path; classify and git add it explicitly:" >&2
    echo "$line" >&2
    exit 1
  fi
done <<< "$status"

if git diff --cached --quiet; then
  echo "checkpoint: changes exist, but none are staged" >&2
  exit 1
fi

git diff --cached --check
git commit -m "$message"
git push origin HEAD

sha=$(git rev-parse HEAD)
branch=$(git branch --show-current)
upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null || true)
printf 'checkpoint: pushed %s on %s' "$sha" "$branch"
if [[ -n "$upstream" ]]; then printf ' (upstream %s)' "$upstream"; fi
printf '\n'
git status --short --branch

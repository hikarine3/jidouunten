import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts/github_work_board.py"
SPEC = importlib.util.spec_from_file_location("github_work_board", MODULE_PATH)
assert SPEC and SPEC.loader
board = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(board)


CONFIG = {
    "minimum_ready_candidates": 10,
    "field_contract": {
        "Work priority": ["P0", "P1", "P2", "P3"],
        "Work type": ["Sprint"],
        "Primary value": ["Decision utility"],
        "Lane": ["Product"],
        "Effort": ["M"],
    },
}


def candidate(index: int):
    return {
        "sprint_id": f"JID-P0-{index:02d}",
        "title": f"価値候補 {index}",
        "priority": "P1",
        "rank": index,
        "status": "ready",
        "work_type": "Sprint",
        "primary_value": "Decision utility",
        "lane": "Product",
        "effort": "M",
        "estimated_hours": 8,
        "public_surfaces": ["/"],
        "user_outcome": "車選びの判断が速くなる",
        "baseline": "現行画面では判断できない",
        "market_demand": "検索・利用行動に需要がある",
        "competitive_gap": "競合に同じ比較軸がない",
        "compounding_advantage": "利用データと正規化データが蓄積する",
        "impact_estimate": "比較開始率の改善を検証する",
        "success_signal": "compare_vehicles率が改善する",
        "failure_signal": "28日後も改善しない",
        "acceptance_criteria": ["公開画面で操作できる"],
        "dependencies": [],
        "blocking_dependencies": [],
        "non_goals": ["管理文書だけの変更"],
        "market_evidence": [{
            "url": "https://example.com/evidence",
            "observed_at": "2026-09-08",
            "finding": "需要を示す観測",
        }],
        "drafted_by": {"agent": "test", "model": "test-model", "effort": "test"},
    }


class PortfolioValidationTest(unittest.TestCase):
    def test_ten_valid_ready_candidates_pass(self):
        portfolio = {"schema_version": 1, "candidates": [candidate(i) for i in range(1, 11)]}
        self.assertEqual(board.validate_portfolio(CONFIG, portfolio), [])

    def test_nine_candidates_cannot_complete_phase_zero(self):
        portfolio = {"schema_version": 1, "candidates": [candidate(i) for i in range(1, 10)]}
        errors = board.validate_portfolio(CONFIG, portfolio)
        self.assertTrue(any("at least 10" in error for error in errors))

    def test_config_cannot_weaken_the_ten_candidate_floor(self):
        weak_config = {**CONFIG, "minimum_ready_candidates": 1}
        portfolio = {"schema_version": 1, "candidates": [candidate(i) for i in range(1, 10)]}
        errors = board.validate_portfolio(weak_config, portfolio)
        self.assertTrue(any("at least 10" in error for error in errors))

    def test_invalid_minimum_configuration_fails_closed(self):
        invalid_config = {**CONFIG, "minimum_ready_candidates": "ten"}
        portfolio = {"schema_version": 1, "candidates": [candidate(i) for i in range(1, 11)]}
        errors = board.validate_portfolio(invalid_config, portfolio)
        self.assertTrue(any("positive integer" in error for error in errors))

    def test_non_jid_identifier_is_rejected(self):
        row = candidate(1)
        row["sprint_id"] = "PHASE0-01"
        errors = board.validate_candidate(CONFIG, row)
        self.assertTrue(any("start with JID-" in error for error in errors))

    def test_docs_only_candidate_is_not_ready_value(self):
        row = candidate(1)
        row["public_surfaces"] = []
        errors = board.validate_candidate(CONFIG, row)
        self.assertTrue(any("public_surfaces" in error for error in errors))

    def test_blocked_dependency_cannot_be_registered_as_ready(self):
        row = candidate(1)
        row["blocking_dependencies"] = ["契約承認待ち"]
        errors = board.validate_candidate(CONFIG, row)
        self.assertTrue(any("blocking_dependencies" in error for error in errors))

    def test_invalid_evidence_date_and_protocol_relative_surface_are_rejected(self):
        row = candidate(1)
        row["market_evidence"][0]["observed_at"] = "2026-02-31"
        row["public_surfaces"] = ["//example.invalid/not-a-local-surface"]
        errors = board.validate_candidate(CONFIG, row)
        self.assertTrue(any("real YYYY-MM-DD" in error for error in errors))
        self.assertTrue(any("public_surfaces" in error for error in errors))

    def test_duplicate_id_title_and_rank_are_rejected(self):
        rows = [candidate(i) for i in range(1, 11)]
        rows[1]["sprint_id"] = rows[0]["sprint_id"]
        rows[1]["title"] = rows[0]["title"]
        rows[1]["rank"] = rows[0]["rank"]
        errors = board.validate_portfolio(CONFIG, {"schema_version": 1, "candidates": rows})
        self.assertTrue(any("duplicate candidate sprint_id" in error for error in errors))
        self.assertTrue(any("duplicate candidate title" in error for error in errors))
        self.assertTrue(any("duplicate candidate priority/rank" in error for error in errors))

    def test_existing_unmarked_id_and_duplicate_title_are_rejected_before_write(self):
        row = candidate(1)
        issues = [{
            "url": "https://github.com/example/issues/1",
            "title": "JID-P0-01: 価値候補 1",
            "body": "no stable marker",
            "state": "OPEN",
        }]
        errors = board.preflight_issue_conflicts([row], issues)
        self.assertTrue(any("unmarked Issue" in error for error in errors))
        self.assertTrue(any("already has this title" in error for error in errors))

    def test_existing_issue_number_allows_explicit_reuse(self):
        row = candidate(1)
        row["issue_number"] = 28
        issues = [{
            "number": 28,
            "url": "https://github.com/example/issues/28",
            "title": "JID-OLD: 旧候補名",
            "body": "no stable marker",
            "state": "OPEN",
        }]
        self.assertEqual(board.preflight_issue_conflicts([row], issues), [])

    def test_missing_reuse_issue_is_rejected_before_write(self):
        row = candidate(1)
        row["issue_number"] = 999
        errors = board.preflight_issue_conflicts([row], [])
        self.assertTrue(any("issue_number does not match" in error for error in errors))

    def test_invalid_portfolio_stops_before_first_github_read_or_write(self):
        portfolio = {"schema_version": 1, "candidates": [candidate(i) for i in range(1, 10)]}
        with tempfile.TemporaryDirectory() as directory:
            manifest = Path(directory) / "portfolio.json"
            manifest.write_text(json.dumps(portfolio), encoding="utf-8")
            original_doctor = board.doctor
            board.doctor = lambda _config: self.fail("doctor must not run for an invalid portfolio")
            try:
                with self.assertRaises(board.BoardError):
                    board.add_portfolio(CONFIG, manifest)
            finally:
                board.doctor = original_doctor

    def test_project_status_is_the_last_field_write(self):
        fields = {}
        option_fields = {
            "Work type": "Sprint",
            "Work priority": "P1",
            "Primary value": "Decision utility",
            "PM Phase": "0",
            "Lane": "Product",
            "Effort": "M",
            "Release status": "NOT_DEPLOYED",
            "Status": "Ready",
        }
        for name, option in option_fields.items():
            fields[name] = {"id": name, "options": [{"id": option, "name": option}]}
        fields.update({
            "Target URL": {"id": "Target URL"},
            "Expected impact": {"id": "Expected impact"},
            "Rank": {"id": "Rank"},
        })
        calls = []
        original_edit_item = board.edit_item
        board.edit_item = lambda _project, _item, field, flag, value: calls.append((field, flag, value))
        try:
            board.set_candidate_fields("project", "item", fields, candidate(1))
        finally:
            board.edit_item = original_edit_item
        self.assertEqual(calls[-1][0], "Status")


class SelectionTest(unittest.TestCase):
    def test_active_precedes_ready(self):
        result = board.select_next([
            {"status": "Ready", "work priority": "P0", "rank": 1, "content": {"title": "JID-002: ready"}},
            {"status": "In progress", "work priority": "P1", "rank": 2, "content": {"title": "JID-001: active"}},
        ])
        self.assertEqual(result["status"], "active")
        self.assertEqual(result["items"][0]["sprint_id"], "JID-001")

    def test_ready_uses_priority_then_rank(self):
        result = board.select_next([
            {"status": "Ready", "work priority": "P1", "rank": 1, "content": {"title": "JID-001: p1"}},
            {"status": "Ready", "work priority": "P0", "rank": 2, "content": {"title": "JID-002: p0-r2"}},
            {"status": "Ready", "work priority": "P0", "rank": 1, "content": {"title": "JID-003: p0-r1"}},
        ])
        self.assertEqual(result["candidate"]["sprint_id"], "JID-003")

    def test_empty_project_is_exhausted(self):
        self.assertEqual(board.select_next([]), {"status": "exhausted", "ready_count": 0})

    def test_exhausted_state_routes_to_ten_candidate_phase_zero(self):
        result = board.attach_next_action(CONFIG, board.select_next([]))
        self.assertEqual(result["next_action"], "phase0")
        self.assertEqual(result["minimum_ready_candidates"], 10)


class IssueProjectReconciliationTest(unittest.TestCase):
    def test_chat_created_jid_issue_is_selected_even_without_marker(self):
        issues = [
            {"number": 1, "title": "JID-001: selector", "body": "旧本文", "url": "https://github.com/o/r/issues/1"},
            {"number": 2, "title": "運用メモ", "body": "<!-- jidouunten-work-item:JID-002 -->", "url": "https://github.com/o/r/issues/2"},
            {"number": 3, "title": "メモ", "body": "対象外", "url": "https://github.com/o/r/issues/3"},
        ]
        missing, count = board.issue_project_diff(issues, [])
        self.assertEqual(count, 2)
        self.assertEqual([row["number"] for row in missing], [1, 2])

    def test_existing_project_item_is_not_added_again(self):
        issues = [{"number": 1, "title": "JID-001: selector", "url": "https://github.com/o/r/issues/1"}]
        items = [{"content": {"url": "https://github.com/o/r/issues/1"}}]
        missing, count = board.issue_project_diff(issues, items)
        self.assertEqual(count, 1)
        self.assertEqual(missing, [])


if __name__ == "__main__":
    unittest.main()

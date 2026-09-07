# GitHub Work Management

更新: 2026-09-07

## 正本

| 情報 | 正本 |
|---|---|
| 現行Sprint / Todo / Status / Priority / Rank / 担当 / PM Phase / 依存 / Release | [GitHub Project `jidouunten Delivery`](https://github.com/users/hikarine3/projects/5) とIssue |
| 戦略 / 要件 / データ契約 / 根拠 / QA証拠 / 運用ルール | このrepository |
| 公開済みの事実 | Cloudflare Pagesのdeploymentと本番URL |
| 効果 | Analytics/Search Console等の実測 |

KPIの分解と公開時点の実測baselineは [kpi-model.md](kpi-model.md) に記録する。
未計測のシナリオ値は優先順位や完了条件の根拠にせず、`Expected impact` field には
利用者に起きる変化と、公開後に実測する指標を書く。

ローカルにGitHub Projectの状態を複製したtodo/roadmap/stateファイルは作らない。
Issueは成果物へのリンクを持ち、長文仕様を二重に保持しない。

## Project fields

| field | 値 | 用途 |
|---|---|---|
| Status | Backlog / Ready / In progress / Review / Blocked / Done | 現在の作業状態 |
| Work priority | P0 / P1 / P2 / P3 | 利用者・事業上の優先度 |
| Rank | number | 同Priority内の順序。小さい順 |
| PM Phase | N/A / 0 / 1 / 2 / 3 / 3.5 / 4 / 5 / 6 / 7 / Observe | task固有の段階（意味は下記） |
| Effort | S / M / L / XL | 相対工数 |
| Release status | NOT_DEPLOYED / READY / DEPLOYED / OBSERVING / OBSERVED / BLOCKED | 実装完了と公開・観測を分離 |
| Lane | Product / Data / Content / Measurement / Infrastructure | 競合判断の補助 |

## Readyの選び方

1. `Status=Ready` のうちブロックされていないIssueだけを見る。
2. Priorityの高い順、同じならRankの小さい順で選ぶ。
3. Readyが1件でもあれば、新しい候補探索や監査改善を先に始めない。
4. Readyが空になった時だけ、検索需要、競合、利用実測、収益機会を再確認して候補を足す。

## Issueの要件

各delivery Issueに以下を必須とする。

- 誰の何がどう良くなるか
- 完了条件（表示、操作、データ、計測）
- repo内の仕様・根拠・QA計画
- 対象URL
- 本当に開始を止める依存と再開条件
- 公開・観測の状態

Issue本文のチェックボックスを全体Todoの正本にしない。Acceptance criteriaとしてのみ使う。

## PM Phase

- Phase 0: 課題・需要・外部baseline・価値仮説
- Phase 1: 対象 / 非対象 / 完了条件
- Phase 2: 技術・データ・影響範囲
- Phase 3: E2E / 表示 / データ / failureのQA計画
- Phase 3.5: 実装直前のscope lock
- Phase 4: 実装
- Phase 5: 件数付き検証と実ブラウザ確認
- Phase 6: 公開候補、rollback、残リスクを確定
- Phase 7: Cloudflare Pagesへ公開しproduction smoke
- Observe: KPIを観測し、継続/修正/終了を判断

Phaseを進めたこと自体は成果ではない。成果物・QA・deployment・観測をそれぞれリンクする。

## Sprint境界

1 Sprintは、利用者が使える1つの縦切りの成果をPhase 0から公開候補まで進める単位。
初期は1 Sprintのcoreを最大3件にする。基盤だけ、データだけ、監査だけで閉じず、可能な限り
画面・操作・実データを通して価値を届ける。

PlanningとReleaseは別gateにする。ローカル実装済み、preview統合済み、本番公開済み、効果観測済みを
明示的に区別する。

## 並行lane

Product、Data、Content、Measurement、Infrastructureは、所有ファイルと外部資源が重ならなければ
並行できる。同じ車両正本、同じ生成物、同じCloudflare設定を同時に書く場合だけ調整する。
別IssueがIn progressであることだけを停止理由にしない。

## 参照元と採用判断

- 共通規範: `../vpshikaku/docs/claude-rules/sprint-loop-common-contract.md` v1.4以降
- 移植ガイド: `../vpshikaku/docs/claude-rules/cross-project-adoption-guide.md`
- 要件分解の参考: `/Users/hajimekurita/git/compassdata/ailms/docs/pm/templates/sprint-requirement-template.md`
- 参照commit: vpshikaku `541388ba1ec6a8f09b3c937de3a76c57e3d40195`、ailms `3a75a7306b908bf301bc2756217b3051f82eabd6`
- 同期確認日: 2026-09-07

採用したもの: GitHubを作業状態の正本にする、価値優先Ready queue、task別Phase、非重複lane、
planning/release/observation分離、Why/Core/E2E/非対象/rollbackを持つSprint要件。

採用しないもの: vpshikaku固有のFirebase・生成器・監査runner、ailmsのDjango・Docker・LMS向け
release gate、ローカル `todo.md` / `state.yaml` を作業状態の正本にする方式、過剰なPhase別文書分割。

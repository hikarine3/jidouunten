# Phase 0: 価値候補portfolioの再構築

このPhaseは、GitHub Project `jidouunten Delivery`を正常取得でき、`In progress`と`Ready`がともに
0件の場合だけ実行する。通常の候補選定・lane規範はrepo rootから見た
`../vpshikaku/docs/claude-rules/sprint-loop-common-contract.md`、PJ固有値は
[`../goals/sprint-loop.md`](../goals/sprint-loop.md)を正本とする。

## Gate 0: 起動条件

```bash
python3 scripts/github_work_board.py doctor
python3 scripts/github_work_board.py next --json
```

- `active`: 現在のIssueを継続し、Phase 0を実行しない。
- `ready`: Priority、同順位はRank順の先頭を実行し、Phase 0を実行しない。
- `exhausted`: このPhase 0を開始する。
- GitHub取得失敗: `exhausted`ではない。`python3 scripts/github_work_board.py next --json --allow-cache`で
  24時間以内の読み取り専用スナップショットからactive／Readyの確認だけ継続できるが、Phase 0・claim・writeは
  GitHub再接続後まで開始しない。復旧・再試行し、旧todoやローカルqueueへfallbackしない。

## Gate 1: 情報を更新する

同じ日の推測を10個へ分割せず、少なくとも次を現在値で確認する。

1. GA4の一覧絞り込み・比較・詳細・公式遷移、GSC/Bingのquery/page別表示・クリック。未計測は未計測とする。
2. 現行一覧・詳細・比較・発売時期・価格・口コミ・再訪導線の利用者課題とデータ欠落。
3. 日本の車選び需要、購入検討フロー、現行車・運転支援機能の一次情報。
4. 直接競合の公開面と、自動化レベル・ODD・価格・発売時期・口コミ・更新理由の差。
5. 既存Issue（Doneを含む）との重複、依存、権利・個人情報・課金・外部設定の境界。

外部事実にはURL・観測日・候補判断へ使うfindingを残す。検索結果の件数、LLMの一般知識、未確認の
競合機能だけを需要根拠にしない。

## Gate 2: 価値候補を10件以上まで作る

各候補は次の全項目を持つ。

- 公開surfaceと、誰の何がどう良くなるか
- 現状baseline、需要、市場根拠、競合差
- 利用で蓄積するデータ・信頼・再訪・送客などの競争優位
- Core完了条件、対象外、依存、blocking dependency
- 外部で測れるsuccess/failure signal、期待impact、見積時間
- Priority、Rank、Lane、Primary value、Effort
- 起案agent・model・effort

1つの公開成果をファイル、文書、checker、監査へ分割して件数を増やさない。公開surfaceと利用者成果を
持たない内部作業は価値候補にしない。既存Issueと同じ成果、根拠のないニュース量産、未許諾画像、
架空口コミも不採用とする。

有効なReady候補が1〜9件しかない間はPhase 0未完了である。追加調査、異なる利用者課題の確認、または
独立して価値を届けられる縦切りへの分解を続け、10件以上になるまでGitHubへ登録しない。数合わせのために
価値gateを下げてはならない。認証・一次情報・契約などの真正な外部blockerで続行不能なら、候補を捏造せず
不足件数と再開条件を記録し、PJの停止条件に従う。

## Gate 3: 全件検証後に一括登録する

portfolioは `docs/pm/outputs/phase0-portfolio-<YYYYMMDD>.json` へ保存する。これは提案と根拠の証跡であり、
live queueではない。live状態はGitHub Projectだけが持つ。

```bash
python3 scripts/github_work_board.py validate-portfolio \
  --manifest docs/pm/outputs/phase0-portfolio-<YYYYMMDD>.json
python3 scripts/github_work_board.py add-portfolio \
  --manifest docs/pm/outputs/phase0-portfolio-<YYYYMMDD>.json
python3 scripts/github_work_board.py next --json
```

`add-portfolio`は、10件以上の有効なReady候補、ID・title・Priority/Rankの一意性、価値項目、観測根拠、
公開surface、blocking dependencyなしを全件検証してから最初のGitHub writeを行う。途中失敗後の再実行は
stable markerで同じIssueを再利用し、Statusを各itemの最後に書く。

## Phase 0完了条件

- 全件事前検証がPASSした。
- 重複なしの有効なReady候補が10件以上、IssueとProjectへ登録された。
- `next --json`が最上位Ready候補をPriority、同順位はRank順で返した。
- 情報不足・外部blocker・1〜9件の部分portfolioを完了扱いしていない。

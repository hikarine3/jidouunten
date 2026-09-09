# GOAL: jidouunten Value Sprint Loop

このファイルは `jidouunten` の継続Sprintを起動するためのPJ固有overlayです。
候補選定・lane・branch・planning/release分離の共通規範は、repo rootから
`../vpshikaku/docs/claude-rules/sprint-loop-common-contract.md` を直接読みます。共通規範の本文はここへ複製しません。

## 正本

- 現行task、Priority、Rank、Status、PM Phase、依存、Release status:
  [GitHub Project `jidouunten Delivery`](https://github.com/users/hikarine3/projects/5) と各Issue
- Phaseの意味、Readyの選定、Sprint境界: [`../github-work-management.md`](../github-work-management.md)
- PJ境界、QA、公開承認、モデル割当: [`../../../CLAUDE.md`](../../../CLAUDE.md)
- 戦略・KPI: [`../../strategy/product-strategy.md`](../../strategy/product-strategy.md)、
  [`../kpi-model.md`](../kpi-model.md)
- 公開・計測: [`../../operations/deployment.md`](../../operations/deployment.md)、
  [`../../operations/measurement.md`](../../operations/measurement.md)

GitHubの状態を、このファイルや別のtodo/queue JSONへ複製しません。

## 起動時の実行契約

1. `~/.claude/CLAUDE.md`、repo `CLAUDE.md`、共通契約を全文読む。
2. `git status --short --branch`、実行中writer、GitHub Projectの取得成否を確認する。
3. `Status=In progress` があれば、そのIssueを現在Phaseから継続する。
4. activeがなく `Status=Ready` があれば、`Work priority`、同順位は`Rank`昇順の先頭をclaimする。
5. Readyが1件でもある間はPhase 0の候補探索・再採点・内部基盤Sprintを開始しない。
6. GitHub取得失敗をReady 0件として扱わない。activeもReadyも0件と確認できた場合だけ
   [`../prompts/phase_0.md`](../prompts/phase_0.md)を実行する。
7. Phase 0は、価値gateを通過した重複なしのReady候補10件以上をportfolioとして全件事前検証し、
   GitHub Projectへ一括登録するまで完了扱いにしない。1〜9件の部分登録や数合わせの内部作業は禁止する。

## このPJの価値・観測・配信契約

| 項目 | jidouuntenの値 |
|---|---|
| 第一価値 | 日本で選べる販売単位を、自動化レベル・ODD・価格・発売時期・販売状態で比較できること |
| 外部観測 | GA4のselector/compare行動、GSC/Bingのquery・page別表示/クリック、公式遷移。未計測値は仮説として分離 |
| 内部改善上限 | docs・manifest・checkerだけを価値Sprintにしない。active Issueのfailureを閉じる最小範囲に限定 |
| 配信物 | Astro static buildの `dist/`、Cloudflare Pages project `jidouunten`、本体 `https://jidouunten.jp` |
| rollback | Cloudflare Pagesの直前正常deploymentへ戻す。DNS所有権レコードは削除しない |
| release authority | `standing human authorization`。2026-09-10のオーナー継続承認により、exact candidateのPhase 5全QA・Phase 6独立監査がPASSした場合は、変更ごとの再確認なしでpush/deployする |

## Phase運用

Phase 0〜7の意味は `docs/pm/github-work-management.md` を使います。各Issueで、公開surface、利用者成果、
対象・非対象、正本、影響範囲、failure、件数付きQA、rollback、観測指標を固定します。

- Phase 1〜3.5: scopeと検証を固定。未解決の価値判断だけ上位モデルへ渡す。
- Phase 4: repo `CLAUDE.md` のroutingに従い、通常の範囲固定実装はLunaを使う。
- Phase 5: unit/check/buildに加え、一覧・詳細・比較・主要遷移を実ブラウザで確認する。
- Phase 6: 実装者とは別contextで、事実・権利・計測・rollbackをrisk比例で一度確認する。
- Phase 7: exact commit、Production target、直前正常deploymentを固定し、上記継続承認と全gateを満たす候補だけpush/deployする。
  immutable URLと本体URLの両方をsmokeし、Release statusを先、Statusを最後に更新する。

モデル名・effortの正本はrepo `CLAUDE.md` と `../vpshikaku/docs/model-routing.md` であり、ここへ表を複製しません。

## 車両事実を変更するSprint

車両・価格・発売日・機能名を変更する場合は、`entity-public-refresh` の契約に従い、
`docs/entity-public-dependency-registry.json` へentityと全公開surfaceを登録します。正本を先に変更し、
一覧、詳細、比較、sitemap、構造化データ、該当localeを生成し直して、対象件数と成功件数を記録します。
根拠URL・確認日は内部保持とし、通常UIへは出しません。未確認事実を埋めず、未確認候補の内訳を残します。

## 終端・停止条件

件数指定がない起動では、以下のいずれかまで継続します。

- active Issueを完了し、Project取得成功かつReady 0件を確認した場合はPhase 0へ戻り、
  実測根拠を持つ有効なReady候補10件以上を登録して次のSprintへ進む。
- 同一の真正なblockerが3回連続し、安全な代替、再調査、別の非競合Ready Issueのいずれでも進めない。
- R2/R3、課金、DNS/Secret、契約、個人データ、削除など、ユーザーの新しい判断がなければ越えられない。

外部観測窓待ちや一時的なtimeoutだけではloop全体を停止しません。非競合のReady Issueを進めます。
本番公開・効果観測・Issue完了を同じ状態として扱いません。

## Short `/goal` paste

```text
/goal docs/pm/goals/sprint-loop.md を読み、GitHub Project `jidouunten Delivery` のIn progressを継続し、なければStatus=ReadyをWork priority、同順位はRank順に消費する。Readyがある間はPhase 0を再実行しない。activeもReadyも0件ならPhase 0を行い、価値gateを通る重複なしのReady候補10件以上を全件事前検証してProjectへ登録するまで完了扱いにしない。通常実装はrepoのmodel routingで低コストagentへ範囲固定し、親は採択・統合・高risk判断だけを行う。Phase 5まで件数付きQAと実ブラウザ確認、Phase 6で独立レビューを行う。2026-09-10のオーナー継続承認により全gate PASSのexact candidateは再確認なしでpush/deployし、DNS/Secret/課金/削除/別targetは都度承認まで実行しない。GitHub取得失敗をReady 0件扱いせず、本書の終端・停止条件まで継続する。
```

# CLAUDE.md — jidouunten ガードレール

このファイルは本PJ固有ルールの入口。グローバル指示もすべて有効。

## 開始時

1. `git status --short` で既存変更を確認する。
2. Sprint/lane/branch/mergeを判断する前に、
   `../vpshikaku/docs/claude-rules/sprint-loop-common-contract.md` を全文読む。
3. 現行作業は GitHub Project `jidouunten Delivery` とIssueから確認する。
4. 対象仕様、データ契約、公式情報源を読んでから変更する。

## プロダクト境界

- 本体は `jidouunten.jp`。`自動運転.jp` は本体へ301リダイレクトする入口。
- 中核は「自動運転・運転支援レベルから車を選ぶ」機能。ニュース量を成果にしない。
- トップはLPではなく車両一覧・絞り込み・比較の操作画面。大きなヒーローや説明で機能への到達を遅らせない。
- Level 1–2は運転支援、Level 3以上は自動運転として区別する。
- レベルだけで安全性・性能の優劣を断定しない。ODD、対象道路、速度、ドライバー監視、
  ハンズオフ可否、引継ぎ条件を併記する。
- 車種名ではなく販売単位（モデル年・グレード・装備・市場）で機能を記録する。
- メーカー、国土交通省などの一次情報を事実の根拠にする。根拠URL、確認日、対象市場、
  引用範囲をデータに残す。推測で空欄を埋めない。

## 作業状態の正本

- 現行Sprint、Todo、優先順位、担当、PM Phase、依存、公開状態の正本はGitHub ProjectとIssue。
- repoは戦略、要件、データ契約、根拠、QA結果、運用ルールの正本。
- `todo.md`、`roadmap.md`、独自JSON/YAMLへGitHubの状態を複製しない。
- `Status=Ready` を Priority、同順位では Rank の順で着手する。Readyがある間は候補探索を
  繰り返さない。
- activeもReadyも0件の場合だけ `docs/pm/prompts/phase_0.md` を実行する。価値gateを通る
  Ready候補10件以上を `scripts/github_work_board.py` で全件事前検証・一括登録するまでPhase 0を
  完了扱いにしない。1〜9件の部分登録や数合わせの内部作業は禁止する。
- 状態更新は作業の最後に行う。実装、統合、公開、効果観測を同じ「完了」にしない。
- 複数Issueは、同じ正本ファイル・生成物・外部publishを同時に触らない限り並行できる。
- 文書、checker、監査だけを利用者価値Sprintとして水増ししない。

詳細は `docs/pm/github-work-management.md` を正本とする。

## モデル割当

割当の参照正本は `../vpshikaku/CLAUDE.md`「Phase × モデル割当」、根拠は
`../vpshikaku/docs/model-routing.md`。古い履歴表のモデル名を現行割当にしない。
このPJでも通常の範囲固定実装はLuna high、定型処理はLuna medium、価値判断・高riskはSol highを基本とする。
上位モデルは未解決の判断箇所に限定し、同じ成果物の監査や調査を重ねて費用を増やさない。
親モデルを変えられないセッションは、短いtask packetで通常作業を適切なモデルへ委任する。
本番公開前は内容・権利・計測の独立レビューを一度実施する。参照PJ固有runnerや承認tokenは移植しない。
2026-09-10のオーナー継続承認により、exact candidateに対する必要テスト・実ブラウザQA・独立監査が
すべてPASSした場合は、変更ごとの再確認を待たず `main` へのpushと既存Cloudflare Pages project
`jidouunten`へのdeployを進める。監査後のsource変更、target不一致、gate失敗時はfail-closedとする。

## QAと公開

- ユーザー向け変更は、表示、操作、絞り込み結果、主要遷移をブラウザで確認する。
  HTTP 200やbuild成功だけで完了にしない。
- テスト結果は実行件数と成功件数を記録する。0件をPASSとして報告しない。
- 車両の事実更新では、データ検証、対象一覧、詳細、比較、構造化データへの波及を確認する。
- Cloudflare Pagesへの初回接続、custom domain、DNS変更、本番公開は外部操作として対象と
  変更内容を明示して行う。公開済みと効果観測済みを分ける。
- pushと既存Pages projectへの本番deployは上記継続承認と全gateを満たす場合だけ行う。
  DNS変更、Secret追加・変更、課金、データ削除、別targetへの公開は都度ユーザーの明示依頼なしに行わない。

## commit・pushチェックポイント

- 利用者向けの一つの縦切り（表示・操作・計測・focused QAが揃った単位）ごとに、変更を小さなcheckpoint commitへ分け、監査が参照できるremote SHAを早めに作る。未完成の別作業を同じcommitへ混ぜない。
- push前は、対象ファイルだけを明示的に`git add`し、`git diff --cached --check`とfocused QAを通す。作業ツリーに未分類のunstaged/untracked差分がある場合は自動で止める。
- 標準手順は `scripts/commit-push-checkpoint.sh "feat: <利用者に起きる変化>"`。このscriptはstaged差分だけをcommitし、force pushせず、`origin HEAD`へpushしたSHAとbranchを出力する。空commit・未staged差分の巻き込み・`git add -A`は行わない。
- commit後はIssueへSHA、変更前後の公開surface、focused QA、残failureを記録する。監査はそのexact SHAを対象にし、監査後にsourceを変更したら同じgateをやり直して新SHAを作る。
- 本番公開はcheckpointのpushだけでは完了とせず、Phase 5〜7の全gate、immutable URL、本体smoke、rollbackを別途記録する。共有branchのforce-push、履歴の作り直し、無関係な変更のrevertはしない。

## 終了時

- Issueへ成果物、QA、公開URL、残リスクを記録する。
- 長期的な決定・現在地・次の作業だけを `MEMORY.md` に更新する。Issue状態は複製しない。
- 日本語で報告する。

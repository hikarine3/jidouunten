# MEMORY

更新: 2026-09-10

## 長期決定

- `jidouunten.jp` を本体、`自動運転.jp` を301リダイレクト入口にする。
- 中核はニュースではなく、自動運転・運転支援レベルから車を選ぶ機能。
- 2026-09-07ユーザー修正指示: LPトップを廃し、トップを車両一覧・絞り込みにする。機能・情報密度を優先。
- 2026-09-07追加指示: 実装前にGitHub Issuesを整備。国内候補の網羅（Tesla等を含む）を優先し、レベル別即時一覧・発売日順・価格帯・口コミ・再訪機能を進める。
- 根拠URL・最終確認日は内部管理とし、通常の一覧UIには出さない。発売日、価格条件、販売状態、運転者監視など選択に必要な情報とは区別する。素材の必須クレジットは別扱い。
- 網羅性は日本向け現行乗用車のメーカー/モデル/販売単位の母集団と未確認内訳で判断する。初期9レコードの掲載だけを網羅としない。Level 3の過去例・Level 4サービスは現行購入車と分ける。
- 口コミと再訪機能の要件・依存はGitHubで管理し、投稿識別/公開方式、個人データ・外部資源・追加費用は実装前に確定する。架空口コミや無断画像転載で初期の不足を埋めない。
- レベルは入口とし、ODD、道路、速度、監視、ハンズオフ、グレード、販売状態も比較する。
- MVPは Astro + TypeScript + Cloudflare Pagesのstatic-first。
- 現行Sprint/Todo状態はGitHub ProjectとIssue、repoは戦略・仕様・根拠・QAの正本。
- active/Readyがともに0件の場合だけPhase 0へ戻る。価値根拠を持つ重複なしのReady候補10件以上を
  全件事前検証してGitHub Projectへ一括登録するまでPhase 0を閉じず、1〜9件の部分登録や
  docs/checkerだけの数合わせ候補を認めない。

## 外部設定

- Cloudflareに両zoneを追加済み。
- XServerで両ドメインのnameserverをCloudflareへ変更済み。Cloudflare NSの反映を確認。
- `自動運転.jp` apex/wwwから `https://jidouunten.jp` への301 Redirect Ruleを設定済み。
- Pages `jidouunten` をDirect Upload方式で作成し、`jidouunten.jp` custom domainを設定。
- 初回公開: commit `c11c646`、https://e3e3710a.jidouunten.pages.dev 。本体HTTPS 200、実測証拠は `docs/qa/production-20260907.md`。
- 道路表記による候補漏れ修正を `72c36b4` / https://9a7ea6df.jidouunten.pages.dev で配信。
- 一覧トップ・直接2台比較を `513d01c` / https://db94de6b.jidouunten.pages.dev で配信。
  画面・機能・計測回帰の公開証拠は `docs/qa/list-first-home-20260907.md`。
- GitHub pushだけでは自動配信しない。自動化は[JID-008](https://github.com/hikarine3/jidouunten/issues/8)。
- GTM `GTM-PV9QVMJV`、GA4 `G-Q58GM7BVB6`。1stclass側GSC/Bing所有権確認済み。
- 公開・計測検証の証拠は `docs/operations/` とGitHub Issueに記録。

## 最新の本番反映（2026-09-10）

- 後発対策としてToyota シエンタを18販売単位（Z/G/X × HEV/ガソリン × 2WD/E-Four × 5/7人）で追加。
- exact release `f25d91773d90383d3ef5967815a84fbcf829326f`、Immutable `https://e5b923fb.jidouunten.pages.dev`、本体 `https://jidouunten.jp/`。
- 全132販売単位（現行131件）。シエンタ価格は214万6,100円〜339万7,900円。独立価値監査・リリース監査、Vitest34/Python16、build138、ローカル／本番E2E各1/1がPASS。
- 後発の模倣対策は車名や記事数ではなく、販売単位キー、同一モデル内の価格・駆動・定員・ODD・機能差、一次情報の確認履歴、意味のある差分と再訪導線を蓄積する方針。次候補はLexus UX/LM等を公式構成再照合後に追加する。

## 次のdelivery

[GitHub Project `jidouunten Delivery`](https://github.com/users/hikarine3/projects/5) の最上位Ready Issueを
正本として着手する。初回公開Sprintは
[JID-001](https://github.com/hikarine3/jidouunten/issues/1) で、仕様は
`docs/pm/requirements/20260907-level-first-selector-mvp.md`。

## 実装・データ・routing

- Astro 7.3.1。公式根拠付き132販売単位（現行131、過去Level 3例1件）を同一データ契約で生成。
- カタログ掲載は新規受注可能の保証ではない。受注可否未確認はunknownとして表示。
- vpshikakuの現行CLAUDEモデル割当と共通contractを直接参照。Luna=実装/データ/限定レビュー、Sol=調査/外部計測設定、親=採択/統合/公開。
- 別ブラウザprofileに誤作成した同名測定resourceは未削除。本番GTMの送信先から除外済み。詳細はignored `.cache/measurement-mistakes.json`。

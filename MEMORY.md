# MEMORY

更新: 2026-09-11

## 2026-09-11 メーカー横断の公式アクション導線（実装・本番反映済み）

- Honda（ACCORD／VEZEL）、Nissan（アリア／セレナ）、Lexus（LM／UX300h）へ公式見積り・試乗・販売店・カタログの24アクションを追加。アリア／セレナは車種選択ハッシュ、LM／UX300hはシリーズ指定、Hondaは車種固定の一次URLを使い、注文可否unknownへ注文CTAは付けていない。
- `npm test`（39/39、公式導線37モデル/38アクション）、`npm run check`（0 errors / 0 warnings / hint6）、実ID build153、ローカルE2E1/1（ACCORD・セレナ・UX300hの各4導線、GA collect204）を確認。外部URLはブラウザ22/24遷移HTTP200、Lexus PDF2件はダウンロード開始＋curl HTTP200。
- exact app `c2725a994ee222a1634a9b15d786babd4a3342c2`、Production `https://jidouunten.jp/`、immutable `https://befeebfc.jidouunten.pages.dev`。主要URL本体/immutable各9/9 HTTP200、IDN path/query301、未知URL404、E2E各1/1（GA collect204）、独立Luna監査PASS。直前rollbackは `https://aa729982.jidouunten.pages.dev`。
- 後発対策のKPIは導線数ではなく、比較後の公式遷移率・アクション完了率・保存候補の再訪後アクション率。Honda curl 403はbot制限のため、ブラウザ8/8 HTTP200を採用し、定期監視ではブラウザ経路を使う。

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

## 2026-09-11 後発対策・保存判断材料スナップショット（実装・検証済み）

- 保存した検索条件・比較に、販売単位ごとの公開判断材料fingerprintを保持する再訪MVPを追加。価格・機能・作動条件・必要装備・販売状態・グレード識別の差分だけを検出し、確認日・出典URLの変更は通知対象外とした。
- 保存バーで「判断材料の変更 ○件」「掲載終了・非公開 ○件」を表示し、比較再開前に見直し対象を把握できる。保存本文・fingerprint・検索query・車両IDはAnalyticsへ送らない。
- `npm test`（Vitest39/39、価格147/147・現行146/146、公式導線37モデル/14アクション、Python16/16）、`npm run check`（0 errors / 0 warnings / 既知hint6）、実ID build153、ローカルE2E 1/1（GA collect HTTP204）を確認。Astra価値監査・Lunaリリース監査はexact SHAでPASS。
- exact release `6d7657791b63ac16597a3df40bf01c7f7c42c167` をpush・deploy済み。Immutable `https://aa729982.jidouunten.pages.dev`、本体 `https://jidouunten.jp/`。両方でE2E各1/1・GA collect HTTP204、主要7 URL 7/7 HTTP200、未知URL404、IDN path/query301、390/520/768/1280px横overflowなしを確認。直前rollbackは `https://6b4375a4.jidouunten.pages.dev`。

- 後発対策としてToyota主要10モデル（ノア、プリウス、クラウン（クロスオーバー）、bZ4X、RAV4、ハリアー、アルファード、ヴェルファイア、ヴォクシー、シエンタ）へ、公式hrefと同じcase-sensitiveな車種固定見積りURLを追加した。詳細・比較では注文/試乗と検討用見積りを分離し、注文可否未確認の車両にも安全に予算検討へ進める。`outbound_purchase_action` は販売単位ID・メーカー・`estimate`・配置を保持する。bZ4Xは `bZ4X`、クラウンは `CROWN+CROSSOVER` を使用し、小文字化によるToyotaエラーを防いだ。
- exact app release `0448c1bddd54dbfc3236b08df7c7cd87a967299d`、Immutable `https://6b4375a4.jidouunten.pages.dev`、本体 `https://jidouunten.jp/`。全147販売単位（現行146件）、build153、Vitest37/Python16、価格・公式導線checker、Astro check 0 errors、Toyota見積りブラウザ10/10、詳細56/56・比較2、registry14/14、独立Astra/Plato監査、local/production E2E各1/1、GA collect HTTP204、主要URL200、IDN path/query301がPASS。直前rollbackは `https://106e44cd.jidouunten.pages.dev`。

- 後発対策として「参考総額（本体＋確認済み追加パッケージ）」を詳細・比較へ追加。単一のexact本体価格と確認済み追加価格だけを合算し、諸費用・他オプションは除外、レンジ／未確認価格は算出不可のまま表示する。ノアS-Z 2WD（7人乗り）は4,178,900円、S-Xとの比較では算出不可側をunknownとして差分件数から除外。セレナ、CX-30、ヴォクシー6単位にも同じ規則を適用し、13詳細＋2比較の依存selectorをregistryへ登録した。
- exact release `84b6c93e632505dcda1abdbc15a9fb9ee81b5a53`（実装 `a27de8b`、比較分類修正 `dc0bdc6`）、Immutable `https://106e44cd.jidouunten.pages.dev`、本体 `https://jidouunten.jp/`。全147販売単位（現行146件）、build153、Vitest37/Python16、価格・公式導線チェッカー、Astro check 0 errors、独立Astra/Plato監査、ローカル／本番E2E各1/1、GA collect HTTP204、registry required selector15/15・85 markersがPASS。直前rollbackは `https://3ee94155.jidouunten.pages.dev`。

- Toyota ノア現行HEV 8販売単位（S-Z/S-G/S-X、2WD/E-Four、7/8人）を本番反映。S-Z 122,100円／S-G 78,100円のAdvanced Drive等セット、S-Xの設定なしを含む価格・能力差を実装した。Advanced Driveは0〜約40km/h、LCAは約85〜130km/h、T-Connect／コネクティッドナビ契約・地図更新条件を分離表示し、S-XのACC・LTA速度範囲は未確認としている。8単位とも新車注文可否は未確認のまま保持する。
- exact public app commit `07405fca3b13a063a1404c31a900d3a9cb6cb635`、docs commit `5681f4d74036cd16cb270a6e1a5aa6b4643a9999`、Immutable `https://3ee94155.jidouunten.pages.dev`、本体 `https://jidouunten.jp/`。全147販売単位（現行146件）、build153、Vitest36/Python16、独立価値監査・リリース監査、ローカル／本番E2E各1/1、GA collect HTTP204、registry静的13/13・required selector12/12がPASS。直前rollbackは `https://d4b6c8e1.jidouunten.pages.dev`。

- 後発対策としてLexus UX300hをShining Essence／version L／F SPORTの2WD・AWD、6販売単位で追加。価格は521万〜575万7,000円、全車5人乗り。ACC・LTA標準、ステアリングを手放すとLTAの支援が停止するためハンズオフ不可、LCA・独立ドライバーモニターは未付与。2027年2月生産終了予定、受注可否・納期は未確認としてLMとの同一Lexus比較を可能にした。
- exact release `1eb9b9c3acf6b83156d2d06664bbed3c24db9282`、Immutable `https://d4b6c8e1.jidouunten.pages.dev`、本体 `https://jidouunten.jp/`。全140販売単位（現行139件）、build146、Vitest36/Python16、独立価値監査・リリース監査、ローカル／本番E2E各1/1、GA collect HTTP204がPASS。UX registryは静的10面/50 marker、ブラウザ8 selector/32 marker。

- 後発対策としてLexus LMをLM500h EXECUTIVE（4人乗り・AWD）／version L（6人乗り・AWD）の2販売単位で追加。価格は1,520万〜2,030万円、LCA・ドライバーモニター・Advanced Driveを標準として、渋滞時0〜約40km/hの条件付きハンズオフを比較可能にした。Advanced DriveはG-Link契約が必要（初度登録から3年間無料、その後有料）と表示する。
- exact release `4304ef9232ed2e44f8ab1c294590ca594185d39c`、Immutable `https://a050909d.jidouunten.pages.dev`、本体 `https://jidouunten.jp/`。全134販売単位（現行133件）、build140、Vitest35/Python16、独立価値監査・リリース監査、ローカル／本番E2E各1/1、GA collect HTTP204がPASS（UX追加前の履歴）。
- 後発の模倣対策は車名や記事数ではなく、販売単位キー、同一モデル内の価格・駆動・定員・ODD・機能差・継続利用条件、一次情報の確認履歴、意味のある差分と再訪導線を蓄積する方針。ノア8単位でS-Z/S-Gの条件付きハンズオフとS-Xの手保持要求を同一モデル内に固定した。次は未掲載主要モデルの母集団分母と、注文可否・試乗導線の追加確認へ進む。UX300hは本番反映済み。

## 次のdelivery

[GitHub Project `jidouunten Delivery`](https://github.com/users/hikarine3/projects/5) の最上位Ready Issueを
正本として着手する。初回公開Sprintは
[JID-001](https://github.com/hikarine3/jidouunten/issues/1) で、仕様は
`docs/pm/requirements/20260907-level-first-selector-mvp.md`。

## 実装・データ・routing

- Astro 7.3.1。公式根拠付き147販売単位（現行146、過去Level 3例1件）を同一データ契約で生成。
- カタログ掲載は新規受注可能の保証ではない。受注可否未確認はunknownとして表示。
- vpshikakuの現行CLAUDEモデル割当と共通contractを直接参照。Luna=実装/データ/限定レビュー、Sol=調査/外部計測設定、親=採択/統合/公開。
- 別ブラウザprofileに誤作成した同名測定resourceは未削除。本番GTMの送信先から除外済み。詳細はignored `.cache/measurement-mistakes.json`。

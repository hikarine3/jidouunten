# MEMORY

更新: 2026-09-11

## 2026-09-11 注文状態の一次情報追加確認（監査・本番反映済み）

- 独立監査で、SUBARU レイバック Limited EX 1とLexus LM 2は「注文済み車両の工場出荷目処」であり現在の受付導線を直接確認できないため、注文可否を`unknown`へ戻した。Volvo EX30 2027 3とHyundai IONIQ 5 Voyage／Lounge 2のみを`new_order_available`へ更新。全189販売単位の内訳は注文可21／未確認167／現在利用不可1。
- 根拠はVolvo EX30のオンライン契約Q&Aと、ヒョンデ新車在庫ページのVoyage／Lounge「車両注文」。SUBARU／Lexusの出荷目処根拠は各レコードに保持し、現在の受注可否未確認と明記。Voyage L／Lounge AWD、Suzuki e VITARAも`unknown`を維持。
- `scripts/check_availability_evidence.mjs`で注文可21件すべてにメーカー一次情報の注文・出荷根拠があり、未確認167件を保持することを機械検査。registry／research／testsも判定へ同期する。自動運転タクシー領域は [JID-038](https://github.com/hikarine3/jidouunten/issues/38) の後続Sprintで実装する。
- exact app `d75ecee31d92809ecd6c8831106e1bfa0bfb39db`、immutable `https://9d34dc08.jidouunten.pages.dev`、Production `https://jidouunten.jp/`。実ID build195、リリースガード、ローカル／immutable／本番E2E各1/1（GA collect204）、registry321/321、公開HTML漏れ0件、主要URL200、IDN path/query301を確認して配信済み。
- 次の作業: GitHub Issue #38の自動運転タクシー領域（体験地域・日本の進捗）を後続Sprintで設計・実装する。

## 2026-09-11 Toyota アクア／カローラ拡張（実装・本番反映済み）

- トヨタ公式の現行価格・グレード、安全性能、取扱説明書を根拠に、アクア9単位（Z／G／X／Uの2WD・E-Four、GR SPORT 2WD）とカローラ6単位（HYBRID W×B／G／Xの2WD・E-Four）を追加。価格帯はアクア244万3,100円〜323万8,400円、カローラ238万400円〜334万2,900円。全車速追従ACC＋LTA、ステアリング保持を確認し、Level 2相当として比較可能にした。
- 公式見積り導線をアクア／カローラへ追加したが、カタログ掲載・見積り導線は受注可能の証明ではないため、15単位すべて`unknown`を維持。一覧操作盤で新車注文可16／注文可否未確認172／現在利用不可1を可視化し、未確認をそのまま絞り込める。
- exact app `527f4f782fc3eda556928ab0e56011a27d6e5e25`、Production `https://jidouunten.jp/`、immutable `https://4f0e10ee.jidouunten.pages.dev`。Cloudflare Pages production/mainへ反映済み。全189販売単位（現行188件）、公式導線46モデル／62 actions、sitemap-0は194 URL。
- QA: Vitest45/45、価格189/189（現行188/188）、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build195、ローカル・immutable・本番E2E各1/1（GA collect204）、公開面依存レジストリ316/316、独立Lunaリリース監査PASS。内部enum・source/accessedAt等の公開HTML漏れ0件、主要URL HTTP200、IDN path/query 301を確認。
- 根拠は[トヨタ アクア公式](https://toyota.jp/aqua/)、[アクア価格・グレード](https://toyota.jp/aqua/grade/)、[アクア安全性能](https://toyota.jp/aqua/safety/)、[トヨタ カローラ公式](https://toyota.jp/corolla/)、[カローラ価格・グレード](https://toyota.jp/corolla/grade/)、[カローラ安全性能](https://toyota.jp/corolla/safety/)。

## 2026-09-11 日産アリアB6注文受付確認（実装・本番反映済み）

- 日産公式の現行アリアページで「日産各店で注文できるB6」「11/26より注文受付中」を確認。B6（2WD）の参考価格6,675,900円と紐付け、B6だけを`new_order_available`、B6 e-4ORCE／B9／B9 e-4ORCEは`unknown`のまま4販売単位へ反映した。注文受付の明示は在庫・納期・契約成立を保証しないため、制限事項で販売店確認を促している。
- 公式ページへの仕様確認、試乗車、販売店、セルフ見積り、カタログの4導線は維持し、根拠のない注文CTAは追加していない。根拠は[アリア公式](https://www3.nissan.co.jp/vehicles/new/ariya.html)と[日産工場出荷時期](https://www3.nissan.co.jp/siteinfo/product.html)。
- exact app `c6a429b`、Production `https://jidouunten.jp/`、immutable `https://021157cb.jidouunten.pages.dev`。現行173／全174販売単位、公式導線44モデル／60 actions、sitemap-0は179 URL。
- QA: Vitest45/45、価格174/174、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build180、ローカル・immutable・本番E2E各1/1（GA collect204）、公開面依存レジストリ648/648、独立Luna監査PASS。内部enum・source/accessedAt等の公開HTML漏れ0件、主要URL HTTP200、IDN path/query 301を確認。

## 2026-09-11 Mitsubishi OUTLANDER PHEV追加（実装・本番反映済み）

- Mitsubishi Motors公式の2026年6月改良後ラインアップから、BLACK Edition／P Executive Package／P／G／M、5・7人乗りを9販売単位として追加。価格は536万9,100円〜690万1,400円（税込）。全車Level 2のMI-PILOT（ACC＋車線維持支援）として、グレード・駆動・定員・価格で比較できる。
- LCAは死角の車両への注意喚起・衝突回避支援であり自動車線変更ではないため、`lane_change_support`へ分類していない。ステアリング保持が必要で、ドライバーモニター作動は未確認。購入導線は公式の9グレード選択入口（購入予約）だが、在庫・納期・契約確定は販売店確認と明記する。
- exact app `c367aa4`、Production `https://jidouunten.jp/`、immutable `https://2897334d.jidouunten.pages.dev`。現行173／全174販売単位、公式導線44モデル／60 actions、sitemap-0は179 URL。
- QA: Vitest44/44、価格174/174（現行173/173）、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build180、ローカル・immutable・本番E2E各1/1、公開面依存レジストリ640/640、独立価値監査PASS。主要URL HTTP200、IDN path/query 301を確認。
- 根拠は[三菱アウトランダーPHEV公式](https://www.mitsubishi-motors.co.jp/lineup/outlander_phev/)、[購入予約（9グレード選択）](https://try.mitsubishi-motors.co.jp/olm/EGP0002.do?model=274&skp=1)。

## 2026-09-11 Hyundai IONIQ 5追加（実装・本番反映済み）

- Hyundai Mobility Japanの現行価格ページ・2026年6月公式カタログ・2025年モデル告知から、IONIQ 5のVoyage L／Voyage／Lounge／Lounge AWDを4販売単位として追加。価格は499万4,000円〜613万8,000円（税込）。Voyage LはHDA、他3単位はHDA2（車線変更アシスト付）として、同じLevel 2内の車線変更支援の差を一覧のチェックボックスAND・詳細・比較で確認できる。
- HDA/HDA2はいずれもステアリング保持・前方監視が必要な運転支援として扱い、hands-offは不可、driverMonitoringは必須。販売単位ごとの新車注文可否とHDA速度数値は公式根拠が固定できないため`unknown`のまま保持し、価格だけで受注可能とは表示しない。
- exact app `16567f05acc1a3bd7145c5e225abd7c0c91407b4`、Production `https://jidouunten.jp/`、immutable `https://4c2f96d7.jidouunten.pages.dev`。Cloudflare Pages production/mainへ反映済み。現行157／全158販売単位、公式導線39モデル／43 actions。
- QA: Vitest42/42、価格158/158（現行157/157）、Python16/16、Astro check 0 errors/0 warnings/6 hints、実ID build164、ローカル・immutable・本番E2E各1/1、公開面依存レジストリ315/315、独立価値監査PASS。主要URL HTTP200、IDN path/query 301を確認。
- 画像・ロゴ・外部本文の転載は追加していない。根拠は[Hyundai価格・装備](https://www.hyundai.com/jp/ioniq5/price)、[The new IONIQ 5公式](https://www.hyundai.com/jp/ioniq5)、[公式カタログ](https://www.hyundai.com/jp/purchase/downFile/ioniq5)、[2025年モデル告知](https://www.hyundai.com/jp/customer-service/notice/679)。

## 自動運転タクシーの将来領域（Issue化）

- 購入可能車のカタログとは別の「自動運転タクシー／移動サービス」領域を設ける要件を [JID-038](https://github.com/hikarine3/jidouunten/issues/38) に登録。`体験受付中`・`実証中`・`発表／準備中`・`終了`を分け、国・都道府県／市区町村・運行エリア、事業者、利用方法、対象者、料金、運行日時、提供期間、公式根拠・確認日を地域別に比較する。
- 日本の進捗と海外の先行事例を別フィルターで追い、購入車一覧・Level別件数・車両口コミへ混在させない。実装時はJID-007（Level 4サービス分離）とJID-003（鮮度管理）へ接続する。

## 2026-09-11 Volvo EX30注文導線の事実範囲（実装・本番反映済み）

- Volvo公式Q&AでEX30車種がオンライン契約対象であることを確認したが、2027年のPlus P5／Ultra P5 Long Range／Ultra P8 AWD各グレードの受注・在庫条件までは示されない。3販売単位の`availability`は`unknown`を維持し、詳細には「注文可否：未確認」と表示する。
- 詳細の「オンラインで注文」は車種単位の公式導線への参考リンクとして保持。外部ショップは実行環境で403だったため、疎通成功や受注可能の根拠にはしていない。
- exact app `907b7a556b4195634e38dbc4f4271c9eccfd3cc5`、Production `https://jidouunten.jp/`、immutable `https://4a8c18d3.jidouunten.pages.dev`。Cloudflare Pages production/mainへ反映済み。
- QA: Vitest41/41、価格154/154（現行153/153）、公式導線38モデル/40 actions、Python16/16、Astro check 0 errors/0 warnings/6 hints、実ID build160、ローカル・immutable・本番E2E各シナリオ1/1、主要URL HTTP200。独立価値監査・リリース監査PASS。

## 2026-09-11 Level 2用途ガイド・能力AND絞り込み（実装・本番反映済み）

- 一覧トップをLevel 2〜3の比較対象として明示し、Level 1は「対象外」、Level 4/5は「掲載なし」と表示。Level 2の大量候補を用途ガイド（渋滞時ハンズオフ／車線変更支援／300万円未満）から一クリックで縮められるようにした。
- 「できること」はチェックボックスの複数選択をすべて満たすAND条件として適用。URLへ値を保持し、保存した検索の保存・再開・削除も複数能力へ対応。不正な能力値でも画面例外を起こさず0件として扱う。
- exact app release `7e795dc16d4c14874f3bed72103f35e8af5b60a0`（前段 `72cd8bb`）、Production `https://jidouunten.jp/`、immutable `https://978636f5.jidouunten.pages.dev`。Cloudflare Pages deploymentはProduction/mainへ完了。
- QA: npm test 41/41、価格154/154、公式導線38モデル/39 actions、Python16/16、Astro check 0 errors/0 warnings/6 hints、実ID build160ページ、Chrome E2E（ローカル・immutable・本体各1/1）。独立価値監査は `7e795dc` exact SHAでPASS（追加Chrome28/28、JS例外・横overflowなし）。
- AND条件の保存検索は `/?capability=traffic_jam_assist&capability=hands_off_highway` で43件。3用途ガイドは34 / 44 / 14件。計測は同意後のみ既存GTM/GA4へ送信し、保存本文・指紋・車両IDは送信しない。

## 2026-09-11 本体価格帯フィルター（実装・本番反映済み）

- 一覧に「〜300万円 / 300〜500万円 / 500〜800万円 / 800万円〜」の本体価格帯フィルターを追加。車両本体価格の確認済み開始値で分類し、価格未確認はどの帯にも含めない。保存検索URLにも条件を保持する。
- 実データの件数は13 / 59 / 62 / 12（合計147）。300 / 500 / 800万円の境界は次帯側へ分類し、追加パッケージ・諸費用を本体価格へ混ぜていない。
- app exact `805b910034c48a15ecc338e5468471f3417c377c`、docs `05ff21b0de89f012681991a0bcf08ed1f5982ee0`、immutable `https://b07e61a0.jidouunten.pages.dev`、Production `https://jidouunten.jp/`、deployment `b07e61a0-1cef-465c-a126-bdeab9d1c73c`。
- Vitest40/40、価格147/147、公式導線37モデル/38 actions、Python16/16、Astro check 0 errors/0 warnings/7 hints、実ID build153、保存URL復元、E2E本番/immutable各1/1・GA collect204、主要URL200、IDN path/query301、未知URL404、390px overflow0、独立Luna監査PASS。直前rollback `https://218ed369.jidouunten.pages.dev`。

## 2026-09-11 BYD現行カタログ拡張（実装・本番反映済み）

- BYD DOLPHIN（Baseline／Long Range）、ATTO 3、SEAL（RWD／AWD）、SEALION 6（FWD／AWD）の7販売単位を追加。全車Level 2、価格は299万2,000円〜572万円。DOLPHIN／ATTO 3はウインカー操作を合図とする車線変更時の補助、SEALは間接的なドライバー監視、SEALION 6はACC・車線維持を比較できる。同じLevel 2内の能力差をAND絞り込み・比較で確認できる。
- 現行仕様の販売開始日を発売順の基準に統一し、DOLPHINは2026年2月10日、ATTO 3は2023年1月31日、SEALは2025年10月30日、SEALION 6は2025年12月1日。ATTO 3の最高速度は公式資料間の不一致があるため数値を断定せず、受注可否・在庫は全7単位でunknownのまま表示する。
- 公式商品ページ・販売店・試乗・カタログの4系統をBYD 4モデルへ追加。購入判断用の公式導線は55 actions／43モデルとなり、注文可否未確認の車両にも「確認済み」と誤認させる注文CTAは付けない。BYD公式安全説明は[BYD 安全性能](https://byd.co.jp/e-life/safety/)、各モデルの一次URLは`src/data/official-links.json`に固定。
- exact app `681d6939540642953e88af4edd69cd29af70eb0e`、immutable `https://d45dbac4.jidouunten.pages.dev`、Production `https://jidouunten.jp/`。全165販売単位（現行164件）、sitemap-0は170 URL。Vitest43/Python16、価格165/165、公式導線checker、Astro check 0 errors、実ID build171、ローカル・immutable・本番E2E各1/1、registry331/331、独立価値監査PASS。IDN path/query301、主要URL200も確認。直前rollbackは`https://4c2f96d7.jidouunten.pages.dev`。

## 2026-09-11 後発対策・Toyota カローラ クロス（実装・本番反映済み）

- Toyota カローラ クロスをZ／S／GR SPORT／Z“Adventure”の2WD・E-Four 7販売単位へ追加。公式掲載価格は298万1,000円〜407万7,700円（税込、2026年7月基準）。ACC・LTA・渋滞時運転支援・車線変更時の補助を同じ比較キーへ固定し、ステアリング保持を必要条件、Level 2相当、注文可否は`unknown`として表示する。
- 一覧ではメーカー・価格帯・車線変更支援で絞り込み、詳細では価格・ODD・保持条件・平易な機能名・Toyota公式見積り出口、比較では7単位の価格／駆動差を確認できる。確認日・出典URL・内部enumは通常UIへ出さない。
- exact release `5471da3`、immutable `https://6e1e9bad.jidouunten.pages.dev`、Production `https://jidouunten.jp/`、deployment `6e1e9bad`。push済み。ローカルVitest41/41、価格154/154、公式導線38モデル/39 actions、Python16/16、Astro check 0 errors/0 warnings/7 hints、実IDbuild160ページ、実ブラウザE2Eは本番・immutable各1/1（GA collect 204）を確認。主要immutable/本体URL200、未知URL404、IDN path/query301も確認。直前rollback `https://b07e61a0.jidouunten.pages.dev`。
- 根拠は[トヨタ公式グレードJSON](https://toyota.jp/pages/contents/include/carpage_format/carlineup/data/json/grades61.json)、[安全性能](https://toyota.jp/corollacross/safety/)、[取扱説明書](https://manual.toyota.jp/corollacross/2607/hev/ja_JP/contents/vhch04se050409.php)。

## 2026-09-11 保存差分から変更車両へ戻る導線（実装・本番反映済み）

- 保存した検索・比較で意味ある変更を検出したとき、カテゴリ（価格・できること・作動条件・必要装備・販売状態・車両仕様）と対象販売単位の詳細リンクを「変更を確認」から開けるようにした。掲載終了は別表示、確認日・出典URLだけの更新は通知しない。
- 保存本文・fingerprint・検索query・車両IDはAnalyticsへ送信せず、詳細表示は既存 `view_vehicle`、公式遷移は既存 `outbound_purchase_action` で観測する。
- app exact `95f8bbca76b6efd4d5d3e139e09c45c23ad25931`、docs `867ed00`、immutable `https://218ed369.jidouunten.pages.dev`、Production `https://jidouunten.jp/`、deployment `218ed369-a562-4199-9a53-97426d1a97d0`。
- Vitest39/39、価格147/147、公式導線37モデル/38 actions、Python16/16、Astro check 0 errors/0 warnings/6 hints、実ID build153、保存差分→詳細href、390px overflow0、E2E本番/immutable各1/1・GA collect204、独立Luna監査PASS。直前rollback `https://befeebfc.jidouunten.pages.dev`。

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

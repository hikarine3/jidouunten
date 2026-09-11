# 初回公開の実測証拠

## 2026-09-11 価格メタデータ補正（本番実測）

- exact app release commit: `6483639`
- Immutable deployment: https://df93d984.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- Lexus GX550 2販売単位の`priceEffectiveAt`を、一次資料に明示がないため未設定へ補正。公開面は価格と2026年9月カタログ確認月を表示し、推定日付を表示しない。
- `npm test`: 48/48、価格198/198（現行197/197）、公式導線49モデル／62 actions、Python16/16。
- `npm run check`: 0 errors / 0 warnings / 6 hints。実ID build204、release guard PASS。
- immutable・本体E2E各1/1（GA collect HTTP204）、GX550詳細2/2、主要URL HTTP200、IDN path/query 301、独立候補監査PASS。
- 直前正常deployment（rollback候補）: https://7626aae0.jidouunten.pages.dev

## 2026-09-11 候補拡充・SEO／一覧改善（本番実測）

- exact app release commit: `90a7f7db13eae274b7de246fb9960578d3dd5ecc`
- Immutable deployment: https://7626aae0.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- Volkswagen Tiguan 6、Lexus GX550 2、Toyota ランドクルーザー250 1を追加し、全198販売単位（現行197、過去1）へ更新。価格・一次出典・ACC／車線維持・保持条件を販売単位へ紐付け、注文可否は未確認を維持した。
- SEO／UIは一覧トップの用途ガイド全幅・中央配置、0件能力カード抑制、時期確認月フォールバック、title／description、robots、canonical、hreflang、OG/Twitter、WebSite＋WebPage JSON-LDを反映。
- `npm test`: Vitest48/48、価格198/198（現行197/197）、公式導線49モデル／48 URL／62 actions、注文可21・未確認176・現在利用不可1、Python16/16。
- `npm run check`: 0 errors / 0 warnings / 6 hints。実ID build204、release guard（実ID204/204・テストID0）。ローカル・immutable・本体E2E各1/1（GA collect HTTP204）。
- 新規9詳細、一覧、比較、sitemapを実ブラウザ・静的markerで確認。公開面依存レジストリ333/333、公開HTMLの内部enum／内部日付キー漏れ0件。主要URL HTTP200、IDN path/query 301を確認。
- 直前正常deployment（rollback候補）: https://36c737f6.jidouunten.pages.dev

## 2026-09-11 メーカー横断の公式アクション導線（本番実測）

- exact app release commit: `c2725a994ee222a1634a9b15d786babd4a3342c2`。
- Immutable deployment: https://befeebfc.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- `src/data/official-links.json`へHonda（ACCORD／VEZEL）、Nissan（アリア／セレナ）、Lexus（LM／UX300h）の24アクションを追加。車種・シリーズ選択を含む一次URLを公式ページの可視リンクから取得し、推測URLは採用していない。
- 外部URLは実ブラウザで22/24件がHTTP 200遷移、LexusカタログPDF 2/24件はブラウザのダウンロード開始を確認し、curl追跡で2/2 HTTP 200。日産アリア／セレナの見積りは公式モデル画面へリダイレクト後もタイトルと対象車種を確認した。
- `npm test`（Vitest39/39、価格147/147、公式導線37モデル/38アクション、Python16/16）、`npm run check`（22ファイル、0 errors / 0 warnings / 既知hint6）、実ID build153ページを確認。ローカルE2Eは1/1シナリオ（GA collect HTTP204）で、ACCORD・セレナ・UX300hの詳細に各4導線、URLとアクション種別を確認した。
- 公開HTMLへ内部根拠URL・確認日・保存本文を表示せず、注文可否unknownの車両へ注文CTAを追加していない。registryのmanufacturer-official-linksへ6詳細surfaceと6 purchase selectorを追加した。
- immutable／本体E2Eは各1/1（本体GA collect HTTP204）。本番smokeは主要9 URLをimmutable 9/9 HTTP200、本体の主要URL 9/9 HTTP200、未知URL404、日本語ドメインのpath/query 301で確認した。直前rollback候補は https://aa729982.jidouunten.pages.dev（source `6d76577`）。
- 独立Lunaリリース監査はexact SHAでPASS。Hondaのcurl 403はbot制限であり、ブラウザ8/8 HTTP200を採用した。残りはメーカー別の公式遷移率・比較後アクション率の観測で、リンク到達性を送客成果と同一視しない。

## 2026-09-11 後発対策トランシェ（保存判断材料の差分再訪）本番実測

- exact app release commit: `6d7657791b63ac16597a3df40bf01c7f7c42c167`（保存スナップショット実装 `8be6491`、カテゴリ別差分 `6d76577`）。
- Immutable deployment: https://aa729982.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 保存した検索条件・比較へ、販売単位ごとの公開判断材料fingerprintと6カテゴリ（車両仕様・できること・作動条件・必要装備・販売状態・価格）を保持。確認日・出典URLのみの更新は差分にせず、価格等の意味ある変更を再訪バーで「判断材料の変更」と表示する。掲載終了・非公開のIDも区別し、ログインや外部同期は行わない。
- 一覧の保存検索と比較の保存でsnapshotを生成し、保存→離脱→再訪→カテゴリ差分表示→復元→削除を実ブラウザで確認。保存本文、fingerprint、検索query、車両IDをAnalyticsへ送らない。個人情報・内部根拠URL・確認日は通常UIへ表示しない。
- `npm test`（Vitest39/39、価格147/147、公式導線37モデル/14アクション、Python16/16）、`npm run check`（22ファイル、0 errors / 0 warnings / 既知hint6）、実ID build153ページを確認。
- ローカル／immutable／本体のE2Eは各1/1（本体GA collect HTTP204）。本番smokeは主要7 URLを本体・immutableとも7/7 HTTP200、未知URL404、日本語ドメインのpath/query redirectは301を確認。390/520/768/1280px横overflowなし。
- 公開HTML153件で実GTM `GTM-PV9QVMJV` 153/153、`GTM-TEST`/`G-TEST` 0/153、内部根拠キー0/153、NUL0/153。Astra価値監査（6カテゴリ・追加検証7/7・Chrome21/21）とLunaリリース監査（E2E289 assertions）がexact SHAでPASS。
- 直前正常deployment（rollback候補）: https://6b4375a4.jidouunten.pages.dev（source `0448c1b`）。残リスクは既知のinline script hint6と、旧保存データにはカテゴリsnapshotが無いため差分表示しない互換仕様。再訪率・再訪後比較/公式遷移率は公開後観測する。

## 2026-09-10 後発対策トランシェ（Toyota公式見積り出口10モデル）本番実測

- exact app release commit: `0448c1bddd54dbfc3236b08df7c7cd87a967299d`（公式見積り導線 `1f5fb50`、case-sensitive URL修正、registry閉包を含む）。
- Immutable deployment: https://6b4375a4.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- Toyotaのノア、プリウス、クラウン（クロスオーバー）、bZ4X、RAV4、ハリアー、アルファード、ヴェルファイア、ヴォクシー、シエンタへ、公式見積りの車種固定URLを追加。`car_name_en` は公式hrefの値（`NOAH`等、クラウンは`CROWN+CROSSOVER`、bZ4Xは`bZ4X`）を保持した。
- 外部公式画面は実ブラウザで10/10件がHTTP200、エラー表示なし、グレード一覧・価格・選択UIまで到達。詳細56/56、比較2リンクに反映し、注文可否未確認のToyotaには注文CTAを出していない。
- 詳細・比較で「購入・試乗」と「検討用」を分離し、見積りは注文可を示さないと明記。クリックは販売単位ID・メーカー・`estimate`・配置つき `outbound_purchase_action` で計測した。Teslaの注文/試乗4リンクは回帰なし。
- `npm test`（Vitest37/37、価格147/147・現行146/146、公式導線37モデル/14アクション、Python16/16）、`npm run check`（0 errors / 0 warnings / 既知hint5）、実ID build153ページを確認。
- `BASE_URL=https://jidouunten.jp EXPECT_GA_COLLECT=1 node tests/e2e-preview.mjs` は1/1、GA collect HTTP204。本体・immutableとも主要URL（トップ、一覧、ノア詳細、Toyota比較、sitemap、robots）HTTP200。日本語IDNの `/cars/?level=2` は本体へpath/queryを維持した301。
- 依存registryはmanufacturer-official-linksのsurface14/14、required selector14/14（比較の見積りselector含む）、静的marker39、ブラウザrender14/14。390px横overflow0、内部根拠・GTM-TEST漏洩0、リンクはHTTPSかつ `toyota.jp` / `www.tesla.com` のみ。
- Astra価値監査・Platoリリース監査はexact SHAでPASS。直前正常deployment（rollback候補）は https://106e44cd.jidouunten.pages.dev（source `84b6c93`）。専用entity checkerはrepoにないため、静的JSON＋Playwrightで代替検証した。

## 2026-09-10 後発対策トランシェ（確認済み追加パッケージ込み参考総額）本番実測

- exact release commit: `84b6c93e632505dcda1abdbc15a9fb9ee81b5a53`（実装 `a27de8b`、算出不可の比較分類修正 `dc0bdc6`、依存レジストリ閉包を含む）。
- Immutable deployment: https://106e44cd.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 車両本体価格が単一のexact値で、確認済み追加パッケージ価格がある販売単位だけに「参考総額（本体＋確認済み追加パッケージ）」を詳細と比較へ表示。諸費用・他オプションは含めず、価格レンジ／追加価格未確認は「算出不可」として推測しない。
- ノアS-Z 2WD（7人乗り）は4,056,800円＋122,100円＝4,178,900円。S-Xとの比較では算出不可側をunknown扱いにし、「確認済みの差分」件数へ加算しない。ヴォクシー6単位、セレナ、CX-30にも同じ計算規則を適用した。
- `npm test`（Vitest37/37、価格147/147・現行146/146、公式導線37モデル/36 URL、Python16/16）、`npm run check`（0 errors / 0 warnings / 既知hint5）、実ID build153ページを確認。
- 参考総額を表示する詳細13件＋比較2件のrequired selector 15/15・85 markersを実ブラウザ（390px）で確認、横overflow 0。算出可能な14 HTML（詳細13＋比較）とregistryの表示依存を一致させた。
- `BASE_URL=https://jidouunten.jp EXPECT_GA_COLLECT=1 node tests/e2e-preview.mjs` はE2E1/1、GA collect HTTP204。トップ、一覧、ノア詳細2件、比較、sitemap-index、sitemap-0、robotsはHTTP200。`https://xn--hhrp90iveiimb.jp/cars/?level=2` は本体へpath/queryを維持した301。
- Astra価値監査・Platoリリース監査はexact SHAでPASS。公開HTMLの実GTM `GTM-PV9QVMJV`、GTM-TEST、内部根拠キー・根拠URL・確認日・spec PDF名の漏洩チェックは合格。直前正常deploymentは https://3ee94155.jidouunten.pages.dev（rollback候補）。

## 2026-09-10 後発対策トランシェ（Toyota ノア現行HEV 8販売単位）本番実測

- exact public app commit: `07405fca3b13a063a1404c31a900d3a9cb6cb635`
- follow-up docs commit: `5681f4d74036cd16cb270a6e1a5aa6b4643a9999`
- Immutable deployment: https://3ee94155.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 全147販売単位（現行146件）へ更新。ノアをS-Z／S-G／S-X、2WD／E-Four、7/8人の8単位で追加・訂正した。
- S-Zのアドバンスト ドライブ等セット122,100円、S-G 78,100円、S-Xは設定なしを車両本体価格と分離して表示。S-Z/S-GはAdvanced Driveを渋滞時0〜約40km/h、LCAを約85〜130km/hとして分離し、T-Connect／コネクティッドナビ契約・地図更新条件も表示した。S-Xはステアリング保持必須、速度範囲は未確認として比較できる。
- 新車注文可否は8単位とも未確認のまま、公式商品ページへの導線だけを表示。内部根拠URL・確認日は通常UIへ出していない。
- `npm test`（Vitest36/36、価格147/147・現行146/146、公式導線37モデル/36 URL、Python16/16）、`npm run check`（0 errors / 0 warnings / 既知hint5）、実ID build153ページを確認。
- 一覧8/8、詳細8/8、S-Z/S-X比較、sitemap8/8、390px横overflow 0、内部enum・根拠URL漏洩0、GTM実ID153 HTML、local/production E2E各1/1、GA collect HTTP204を確認。
- 公開依存レジストリは静的13/13、required selector 12/12。ノア公式URL（価格JSON・価格ページ・装備PDF・安全ページ・取扱説明書・MLIT）6/6 HTTP200。トップ、一覧、代表詳細2件、比較、sitemap-index、sitemap-0、robotsは本番HTTP200、日本語ドメインのpath/queryは本体へ301。
- 独立価値監査（Astra）・リリース監査（Plato）はexact SHAでともにPASS。直前正常deploymentは https://d4b6c8e1.jidouunten.pages.dev、rollback候補は同URL（親アプリコミット `1eb9b9c3acf6b83156d2d06664bbed3c24db9282`）。

## 2026-09-10 後発対策トランシェ（Lexus UX300h 6販売単位）本番実測

- exact release commit: `1eb9b9c3acf6b83156d2d06664bbed3c24db9282`
- Immutable deployment: https://d4b6c8e1.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 全140販売単位（現行139件）へ更新。Lexus UX300hをShining Essence／version L／F SPORTの2WD・AWD 6単位で追加し、価格521万〜575万7,000円、5人乗り、駆動方式・グレード差を一覧・詳細・比較へ反映した。
- 全車速追従レーダークルーズとLTA、ドライバー異常時対応システムを標準装備として確認。LTAはステアリングを手放すと支援が停止するため、全6単位をLevel 2相当・ハンズオフ不可・運転者常時監視として表示した。LCA・独立ドライバーモニターは根拠がないため付与していない。
- Lexus公式ページの「2027年2月生産終了予定」を制限事項へ明示し、個別の新車注文可否・納期は未確認のままCTAを表示していない。
- 一覧6/6、詳細6/6、LMとの比較、sitemap掲載6/6を確認。UX300h依存レジストリは静的surface 10件・marker50/50、required selector 8件・marker32/32。
- 独立価値監査（Astra）・リリース監査（Plato）は最新SHAでともにPASS。390px横overflow 0、通常UIで内部enum・根拠URL・確認日を表示していない。
- `npm test`（Vitest36/36、Python16/16、全140/140、現行139/139公式価格、公式導線37モデル/36 URL）、`npm run check`（0 errors / 0 warnings、既知hint5）、実ID build146ページ、ローカル／本番E2E各1/1を確認した。GA collectはHTTP204。
- 本番smokeはトップ、一覧、UX詳細6件、比較、sitemap-index、sitemap-0、robotsをHTTP200で確認。`https://xn--hhrp90iveiimb.jp/cars/?level=2` は本体へpath/queryを維持した301。
- rollback候補は親commit `f0bdadcfc7b7506b81a4ed8f5405dbfe69c06e21`、直前Immutable `https://a050909d.jidouunten.pages.dev`。

## 2026-09-10 後発対策トランシェ（Lexus LM 2販売単位）本番実測

- exact release commit: `4304ef9232ed2e44f8ab1c294590ca594185d39c`
- Immutable deployment: https://a050909d.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 全134販売単位（現行133件）へ更新。Lexus LM500h EXECUTIVE（4人乗り・AWD）20,300,000円、version L（6人乗り・AWD）15,200,000円を追加し、価格・定員・駆動方式・能力差を一覧・詳細・比較へ反映した。
- 両単位で全車速追従レーダークルーズ、LTA、LCA、ドライバーモニター、Advanced Drive（渋滞時支援）を確認。高速道路・自動車専用道路本線の渋滞時0〜約40km/hなどの条件内でハンズオフ可、運転者監視・即時操作責任が必要と表示した。
- Advanced Driveの利用にはG-Link契約が必要で、初度登録から3年間は基本利用料無料、その後は有料となる条件を詳細・比較へ明示した。新車の注文可否・納期は一次情報で確定できないため未確認のままにした。
- 一覧2/2、詳細2/2、代表比較、sitemap掲載2/2を確認。分類根拠は日本語表示とし、内部enum・根拠URL・確認日・PDF名は通常の可視本文へ出していない。
- 独立価値監査（Astra）・リリース監査（Plato）は exact SHA でともにPASS。公開依存レジストリは静的25/25 marker、required selector 4/4・複合marker18/18、390px横overflow 0を確認した。
- `npm test`（Vitest35/35、Python16/16、全134/134価格・現行133/133公式価格、公式導線36モデル/35 URL）、`npm run check`（0 errors / 0 warnings、既知hint5）、実ID build140ページ、ローカル／本番E2E各1/1を確認した。GA collectはHTTP204。
- 本番smokeはトップ、一覧、LM詳細2件、LM比較、Level 2絞り込み、sitemap-index、sitemap-0、robotsをHTTP200で確認。`https://xn--hhrp90iveiimb.jp/cars/?level=2` は本体へpath/queryを維持した301。
- rollback候補は親commit `5c2a5bde321afb46039e59387d3ac5f29fcba131`、直前Immutable `https://e5b923fb.jidouunten.pages.dev`。

## 2026-09-10 後発対策トランシェ（Toyota シエンタ18販売単位）本番実測

- exact release commit: `f25d91773d90383d3ef5967815a84fbcf829326f`
- Immutable deployment: https://e5b923fb.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 全132販売単位（現行131件）へ更新。Toyota シエンタをZ/G/X、ハイブリッド／ガソリン、2WD／E-Four、5／7人乗りの18組み合わせで追加し、公式価格214万6,100円〜339万7,900円を一覧・詳細・比較へ反映した。
- 全車速追従ACC・LTAは標準装備として表示し、ステアリング保持が必要なためハンズオフ不可。LCA・ドライバーモニター・個別の新車注文可否は根拠がないため付与せず、CTAも表示していない。
- 一覧18/18、詳細18/18、代表比較、sitemap掲載18/18を確認。価格順ではシエンタX（ガソリン・2WD・5人乗り）が約215万円で先頭となり、5/7人・HEV/ガソリン・2WD/E-Fourで絞り込める。
- 独立の価値監査・リリース監査はともにPASS。公開依存レジストリ22 surface、required selector 20件、生成HTML marker 135/135を確認した。
- `npm test`（Vitest34/34、Python16/16、全132/132価格・現行131/131公式価格）、`npm run check`（0 errors / 0 warnings、既知hint5）、実ID build138ページ、ローカル／本番E2E各1/1を確認した。GA collectはHTTP204。
- 本番smokeはトップ、一覧、シエンタ詳細、シエンタ比較、Level 2絞り込み、sitemap-index、sitemap-0、robotsをHTTP200で確認。`https://xn--hhrp90iveiimb.jp/cars/?level=2` は本体へpath/queryを維持した301。
- 公開HTMLに実GTM `GTM-PV9QVMJV` を確認し、`GTM-TEST`、内部根拠キー、根拠URL、`accessedAt`、spec PDF名の漏洩は0件。

## 2026-09-10 後発対策トランシェ（ヴォクシー6販売単位・オプション差分）本番実測

- exact release commit: `8ff0c03ec5b50ad4f728787a26bbb49c262da324`
- Immutable deployment: https://27d41775.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- ヴォクシーをS-Z/S-Gの2WD・E-Four、7/8人乗り、S-GベースのMULTI UTILITY 5人乗りまで6販売単位で追加。車両本体価格は375万1,000円〜438万200円、Advanced Drive・LCA・ドライバーモニターカメラの追加パッケージはS-Z +122,100円、S-G +78,100円として分離表示した。条件付きハンズオフは装着時のみとし、6単位の注文可否は未確認のままCTAを表示していない。
- 一覧カードで追加価格と「装着時のみ条件内で可」を表示し、詳細6/6・比較（S-Z × S-G）・sitemap掲載6/6を確認した。代表詳細の支援条件はAdvanced Drive 0〜約40km/h、LCA約85〜130km/hで、MULTI UTILITYは専用公式PDFと公式カタログで5人乗り・S-Gベースを確認した。
- 独立監査PASS（価値監査・リリース監査）。registryはVoxyの10 surface / required selector 8件を確認し、詳細6/6、比較、一覧、sitemapへ反映した。
- `npm test`（Vitest33/33、Python16/16、価格114/114、現行113/113、公式導線114/114）、`npm run check`（0 errors / 0 warnings、既知hint5）、実ID build120ページ、`BASE_URL=https://jidouunten.jp EXPECT_GA_COLLECT=1 node tests/e2e-preview.mjs`（E2E1/1、GA collect HTTP204）を確認した。
- 本番smokeはトップ、一覧、ヴォクシー詳細2件、ヴォクシー比較、sitemap-index、sitemap-0、robotsをHTTP200で確認。`https://自動運転.jp/cars/?level=2` は本体へpath/queryを維持した301。公開HTMLの内部根拠キー・根拠URL・`GTM-TEST`漏洩は0件。

## 2026-09-10 後発対策トランシェ（ヴェルファイア7販売単位）本番実測

- exact release commit: `a9627e5abf291b9586d1cde1654776addf726f18`（アプリ・データ実装 `806da5af42e5cdb02d96fe5a1632cf178bf4962e`、比較監査URL修正を含む）
- Immutable deployment: https://a7a6acd6.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- ヴェルファイアをPHEV・HEV・ターボガソリン、2WD・E-Four/4WD、6・7人乗りの7販売単位で追加。価格は674万9,600円〜1,089万9,900円、全単位をLevel 2・条件内ハンズオフ（渋滞時支援0〜約40km/h）・運転者監視必須として表示した。注文可否は未確認のままCTAを推測表示していない。
- 一覧7件、詳細7/7、比較（代表2単位）、sitemap掲載7/7、主要URLは本体でHTTP200。Level 2・高速道路・条件内ハンズオフ絞り込みを本番E2Eで確認した。
- 独立監査は実装者と別の2コンテキストでPASS。registryのVellfire生成surface 11/11、required selector 9/9を確認し、比較URLのids欠落 blockerを修正済み。
- `npm test`（Vitest32/32、Python16/16、価格108/108、公式導線108/108）、`npm run check`（0 errors / 0 warnings）、実ID build114ページ、`BASE_URL=https://jidouunten.jp EXPECT_GA_COLLECT=1 node tests/e2e-preview.mjs`（E2E1/1、GA collect HTTP204）を確認した。
- 本番主要URLの内部根拠キー・根拠URL・`GTM-TEST`漏洩は0件。実GTM `GTM-PV9QVMJV` を配信HTMLで確認した。

## 2026-09-10 比較意思決定・オプション価格・用途フィルター改善の本番実測

- exact source commit: `86dd42a7f9c3d564114bf384b2d1649c3087b354`
- Immutable deployment: https://bd9861e9.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 比較URLは選択フォームを折り畳み、結果を先頭へ表示。変更ボタンでフォームを再表示できることを本番E2Eで確認（390pxの比較結果 `resultY=505px`、横overflowなし）。
- `/levels/` のLevel 3リンクは `availability=all` を付け、過去例1件へ到達するよう修正した。
- CX-5 G（EX Package）は詳細・比較に `EX Package +227,700円` を表示。片側が未確認の追加価格は `compare-row-unknown` とし、既知の差分として強調しない。
- ハリアーG × Tesla Model 3は、ハリアーの「監視条件は不明」を既知の差分として強調しない。MINI Countrymanの条件付きハンズオフ6販売単位は高速道路フィルターに含まれ、Level 2・高速道路・ハンズオフ条件は20件になった。
- 独立監査PASS: `npm test`（Vitest31/31、価格101/101、現行100/100、公式導線32モデル、Python16/16）、`npm run check`（0 errors / 0 warnings）、実ID build107ページ、ローカルE2E1/1、GA collect HTTP204。
- 本番E2E: `BASE_URL=https://jidouunten.jp EXPECT_GA_COLLECT=1 node tests/e2e-preview.mjs` は1/1 PASS。トップ、一覧、Level3、比較、CX-5/MINI詳細、sitemap、robotsを確認した。
- 本番smoke: 上記主要URLはすべてHTTP200。実GTM `GTM-PV9QVMJV` を確認し、`GTM-TEST`・内部時点キー・根拠URLは公開HTMLに残っていない。
- 日本語IDNの `/cars/?level=2&availability=all` は本体へpath/queryを維持した301。

## 2026-09-10 販売単位カバー拡張（アルファード / VEZEL）本番実測

- exact source commit: `d9361b989b6c7e2468b421ebc4207dfe2b6584f2`
- Immutable deployment: https://cff5e52f.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 現行一覧を94→100販売単位へ拡張（全データ101件、過去1件を含む）。アルファードはZ/G HEVの2WD・E-Four、7/8人乗り4単位、VEZELはe:HEV ZのFF/4WD 2単位を追加した。
- 追加単位は価格、ACC/LTAまたはHonda SENSING、道路・速度条件、ハンズオフ不可、公式一次情報を同じ正本へ結び付けた。注文可否を一次情報で固定できないため、両車種ともCTAを推測追加していない。
- 独立監査PASS: `npm test`（Vitest31/31、価格101/101、現行100/100、公式導線32モデル、Python16/16）、`npm run check`（0 errors / 0 warnings）、実ID build107ページ、ローカルE2E1/1。
- 本番E2E: `BASE_URL=https://jidouunten.jp EXPECT_GA_COLLECT=1 node tests/e2e-preview.mjs` はGA collect HTTP 204、1/1 PASS。GTM `GTM-PV9QVMJV`、`GTM-TEST`なし。
- 本番smoke: トップ、一覧、アルファード詳細、VEZEL詳細、両車比較、sitemap-0、robotsはすべてHTTP200。新規IDのsitemap掲載、アルファード価格6,399,800円、VEZEL価格3,268,100円、ハンズオフ不可を確認した。
- 日本語IDNの `/cars/?level=2&availability=all` は本体へpath/queryを維持した301。

## 2026-09-10 購入・試乗アクションの本番実測

- source commit: `06471c0a5afc776300c299c0c22c9bdfc2ca220c`（アプリ実装 `fa36371ac1125948ccb403eccd73de7c848f2b5e`、計測正本更新を含む）
- Immutable deployment: https://d8f9a9b8.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- Tesla Model 3 / Model Yの公式商品ページで一次確認した「今すぐ注文」「試乗を予約する」を、対象6販売単位の詳細画面と2台比較へ表示。詳細は6/6（各2アクション）、比較は4/4のリンクを確認した。その他メーカーには未確認の導線を表示していない。
- 本体・immutableの詳細/比較で、購入・試乗クリック前の `outbound_purchase_action` payload（6項目）を確認。`GTM-PV9QVMJV`、`GTM-TEST`なし、GA collect HTTP 204。
- `BASE_URL=https://jidouunten.jp EXPECT_GA_COLLECT=1 node tests/e2e-preview.mjs` は1/1 PASS。トップ、注文可フィルタ、Tesla詳細、比較、sitemap-index、robotsは200。存在しないパスは404。
- 日本語IDNの `/cars/?level=2&availability=all` は `https://jidouunten.jp/cars/?level=2&availability=all` へpath/queryを維持した301。
- 独立監査はsource commit `06471c0` でPASS。GTM live version 9（6 trigger / 6 GA4 Event tag / 15 dataLayer variable）と運用正本の整合も確認済み。

## 2026-09-10 比較差分トランシェの本番実測

- exact commit: `dac0501228b7651c810c769398302db6c0aad60b`
- Immutable deployment: https://5b59d5a7.jidouunten.pages.dev
- 本体: https://jidouunten.jp/compare/?ids=jp-tesla-model-3-2026-premium&ids=jp-tesla-model-y-2026-premium
- Tesla Model 3 Premium × Model Y Premiumで、価格・Level・道路・速度・ハンズオフ・運転者監視・必要パッケージ・販売状態を同じ軸で比較。既知差分を強調し、未確認は優劣から除外した。
- 比較で「確認できた機能」を日本語ラベル（追従走行（ACC）・車線中央維持・運転者監視）として表示。同値行は「同じ項目を隠す／すべての項目を表示」で切り替え可能。
- 独立監査PASS: 差分1行、同値9行、未確認2行、同値行0→9再表示、機能ラベル3/3、XSS拒否、390px横overflowなし。
- `npm test`（Vitest 29/29、Python 16/16、価格95/95、公式導線95/95）、`npm run check`（0 errors / 0 warnings）、build 101 pages、production E2E 1/1、GA collect HTTP 204。
- 公開比較HTMLに内部metadata/source URL、`GTM-TEST`は残っていない。公式リンク2/2はTesla公式、`noopener noreferrer`付き。

## 2026-09-10 Tesla受注可否トランシェの本番実測

- exact commit: `1dff8d69803c7ff98a036f141730b1b6b82d4796`
- Immutable deployment: https://271972c3.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- Tesla Model 3 / Model Yの6販売単位を、公式商品ページの「今すぐ注文」導線に基づき `新車注文可` と表示。納期・在庫・ソフトウェア条件は個別確認と明示。
- 本体とimmutableのトップ、注文可フィルタ、Tesla詳細で `GTM-PV9QVMJV` を確認し、`GTM-TEST` は残っていない。
- `npm test`（Vitest 29/29、Python 16/16、価格95/95、公式導線95/95）、`npm run check`（0 errors / 0 warnings）、build 101 pages、独立監査PASS。
- `BASE_URL=https://jidouunten.jp EXPECT_GA_COLLECT=1 node tests/e2e-preview.mjs` は新車注文可フィルタ6件、詳細・比較、GA collect HTTP 204を含め1/1 PASS。
- 本体・immutableのTesla詳細、sitemap-index、robotsは200。存在しないパスは404。日本語IDNの `/cars/?level=2&availability=all` は本体URLへpath/queryを維持した301。
- registryのTesla生成surface 10/10、Chrome 390px詳細6/6で横overflowなし。旧注文可否未確認文言・内部metadata/source URLは公開HTMLに残していない。

## 2026-09-10 保存・再開導線の本番実測

- exact commit: `be9a9824b24287d1fb07e8d4d5eaa9e5ac6935e6`
- Immutable deployment: https://2eef602d.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 一覧の検索条件1件・比較中の2台1件を同一ブラウザへ保存し、全ページ共通バーから再開・削除できる機能を反映。
- 本体とimmutableのトップで `GTM-PV9QVMJV` と保存バーを確認し、`GTM-TEST` が残っていないことを確認。
- `npm test`（Vitest 29/29、Python 16/16、価格95/95、公式導線）、`npm run check`（0 errors）、build 101 pages、独立監査PASS。
- `BASE_URL=https://jidouunten.jp EXPECT_GA_COLLECT=1 node tests/e2e-preview.mjs` は保存・復元・削除、既存一覧/比較、GA collect HTTP 204を含め1/1 PASS。
- 本体のトップ、一覧、比較、Harrier詳細・比較は200。存在しないパスは404。日本語IDNの `/cars/?level=2&availability=all` は本体URLへpath/queryを維持した301。
- 監査はexact SHAでPASS。外部URL・未知path/query・不正比較ID・HTML注入を拒否し、390pxで横overflowなしを確認。

## 2026-09-10 後発対策トランシェの本番実測

- exact commit: `93f27ed5b43bb60cb4a8ed346dcbba88c8114753`
- Immutable deployment: https://ac1e8140.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- ハリアーHEV 6販売単位（G/Z/Z“Leather Package”の2WD・E-Four）を本体・一覧・詳細・比較・sitemapへ反映。
- 本体とimmutableのトップで `GTM-PV9QVMJV` を確認し、`GTM-TEST` が残っていないことを確認。
- 本体HTTPS、ハリアー6詳細、比較、sitemap-index、sitemap-0、robotsは200。存在しないパスは404。
- 日本語IDNの `/cars/?level=2&availability=all` は本体URLへpath/queryを維持した301。
- `BASE_URL=https://jidouunten.jp EXPECT_GA_COLLECT=1 node tests/e2e-preview.mjs` はGA collect 204、E2E 1/1。
- 独立監査はexact SHAでPASS。ハリアー公式価格6/6、取説2608/hev、公開レジストリ9/9、sitemap6/6を確認。

実施日: 2026-09-07 JST。初回release `c11c646`、道路フィルター修正 `72c36b4`。

## 配信

- 本体: https://jidouunten.jp/
- Immutable deployment: https://e3e3710a.jidouunten.pages.dev
- 道路修正版: https://9a7ea6df.jidouunten.pages.dev （`72c36b4`）
- Pages project: `jidouunten`、Direct Upload、production branch `main`
- 19 assetsのupload成功。ソースはGitHub `main` へpush済み。
- 本体HTTPS 200、sitemap-index.xml 200、sitemap-0.xml 200、存在しないパス404。
- sitemap掲載14 URLのHTTP検査は14/14が200。
- 日本語apex: `/cars/?level=3&availability=all` → `https://jidouunten.jp/cars/?level=3&availability=all`、301。
- 日本語www: `/compare/?ids=a&ids=b` → `https://jidouunten.jp/compare/?ids=a&ids=b`、301。
- robotsはCloudflare Managed Contentとrepo由来のAllow/Sitemapを配信。検索インデックスを許可。

## 機能・画面

- ローカル: 初版Vitest 3/3、道路表記正規化追加後4/4、Astro check 0 errors / 0 warnings、build 15ページ、Playwright E2E 9チェック。
- 同意前GTM/GA通信なし、拒否時非送信、同意後イベント、撤回後再選択を検証。
- ソースデータ: 9/9検証、3メーカー・5車種。現行カタログ掲載8件、過去Level 3例1件。
- 親統合レーンでも本番トップのdesktop表示とローカルmobile画像、比較画面を目視確認。
- 独立レビュー: [静的公開候補 PASS](launch-review-20260907.md)。実装者と別のLunaが実施。
- production dependencies audit: Astro 7.3.1、0 vulnerabilities。
- 公開後に「高速道路」と「高速道路の本線」の表記揺れで候補が欠落すると判明。詳細ODDを保持したままfilter区分を正規化。
  Level 2 / 高速道路 / 条件内ハンズオフの正しい結果は7件。旧版の2件という期待を訂正し、回帰テストを追加。
- 修正版を本番Chromeでnative select/buttonにより操作し、Level 2・高速道路・条件内ハンズオフ=7件とURL一致を親が確認（計測拒否状態）。
- 実GTM同意後のnative clickにtimeoutが発生したため、TEST GTMのE2E PASSを本番計測PASSとして流用しない。
  計測設定の修正・本番再確認は計測運用へ分離して記録する。
- GTM native GA4 Event版への修正後、本体と修正版immutableの両方で実GTMを使うE2Eを再実行し、各9チェックPASS。
  同意前通信0、5独自イベントのdataLayer発火、正しい測定IDへのGA collect HTTP 204を確認。
  このHTTP確認を個別5イベントすべてのGA管理画面受信・集計成功とは扱わない。
- 正しいGA4 propertyのRealtimeでactive user 1、page_view 3を確認。
  初期Custom HTML版ではselect_level/filter_resultsの重複計測も発生していたため、初回QA期間を利用効果のbaselineへ算入しない。
- 旧タグを読み込んだ検証用Chromeタブ3件は、URL・window/tab IDをread-only確認した後に親が閉じた。
  設定画面・本番表示用タブ・その他のユーザータブは保持。初日全体のKPI除外は維持する。

## Lighthouse baseline

本番home、Lighthouse 12.8.2、headless Chrome、mobile既定条件、同意前。
取得時刻: 2026-09-07 03:48:57 JST。

| 指標 | 初回実測 |
|---|---:|
| Performance | 100 |
| Accessibility | 100 |
| FCP | 1.5秒 |
| LCP | 1.5秒 |
| CLS | 0 |

これは1回のlab測定であり、実利用者のCore Web Vitalsや全ページの品質保証ではない。
元JSONはignored `.cache/lighthouse-production.json`。

## 計測・検索登録

専用resourceと本番の受信・サイトマップ受付状況は
[計測運用](../operations/measurement.md)へ記録する。resource作成、送信、受信、検索反映を区別する。

## 運用の残件

- 自動デプロイは未設定（Issue #8）。今回の配信を自動化済みとは扱わない。
- 初回deploymentには過去版がない。2回目以降のrollbackと初回障害時の対応を公開運用へ記録済み。
- GitHub Project更新APIの一時制限後、直接GraphQLで同期成功。公開状態を記録し、Issue #8をBacklogへ追加。
- 検索反映・28日/100 selector sessions評価は今後の観測対象。

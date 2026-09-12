# Cloudflare Pages公開運用

更新: 2026-09-12

## 最新の配信（2026-09-12 日産リーフ ZE2 5販売単位追加）

- exact release commit: `66cd1459887aad74e106459c2ab504017850faf9`
- immutable: https://18c08aa1.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- Cloudflare Pages: `18c08aa1-24ce-4b69-b19d-2096e3c57ecc`（Production / main / source `66cd145`）
- 内容: 日産リーフ ZE2のB5/B7、S・X・Gを2WD・5人乗りの5販売単位として追加。公式価格は438万9,000円〜599万9,400円（税込）。全車ACC＋車線中央維持のLevel 2相当で、B5 Sはハンズオフ不可、B5/B7 X・GはProPILOT 2.0の条件内ハンズオフ・車線変更支援を比較できるようにした。個別受注可否は一次情報で固定できないため5単位とも`unknown`を維持。
- 公式導線: 商品、価格・グレード、主要装備、先進運転支援、見積り、試乗、販売店、カタログを詳細・比較へ追加。公式掲載は在庫・納期・契約成立を保証しないため、購入前の販売店確認を促す。
- 根拠: [日産リーフ公式](https://www3.nissan.co.jp/vehicles/new/leaf.html)、[価格・グレード](https://www3.nissan.co.jp/vehicles/new/leaf/specifications.html)、[主要装備PDF](https://www.nissan.co.jp/SP/LEAF/DIGITALCATALOG/PDF/leaf_equipment.pdf)、[先進運転支援](https://www3.nissan.co.jp/vehicles/new/leaf/performance_safety/advanced_driving_assistance.html)、[日産EV B5発表](https://ev2.nissan.co.jp/BLOG/874/)（確認日: 2026-09-12）。
- SEO／公開面: 474 HTML、sitemap-0は473 URL、車両詳細468件、トップ／一覧ItemListは2ページ・934項目。GTM実IDは各HTML 1件、テスト計測ID0件、公開HTML内部enum・source・accessedAt漏れ0件。registry closureは546/546。
- QA: `npm test` Vitest82/82＋Python16/16、価格468/468（exact446／range21／未確認1）、公式導線85モデル／82 URL／178 actions、注文可48／未確認419／利用不可1、鮮度確認済み467／要再確認0／競合1、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、独立リリース監査PASS。
- 本番smoke: immutable／本体E2E各1/1（GA collect HTTP204）。本体・immutableのトップ、一覧、リーフ5詳細、リーフ比較、sitemap、robotsはHTTP200、未知URL404。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）の`/cars/?level=1&sort=release_desc`は本体へqueryを維持した301。一覧のWikimedia Commons参考写真はデスクトップ約374×115px・モバイル約360×88pxのWebPサムネイル（`loading=lazy`・`object-fit: cover`）で省スペース表示し、作者・ライセンス帰属リンクとセルフホスト方針を維持。新規画像は追加していない。

## 最新の配信（2026-09-12 Lexus ES 7販売単位追加）

- exact release commit: `1f51944beb2cfadd8ac201661c20a138d2616d55`
- immutable: https://6f98eeaf.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- Cloudflare Pages: `6f98eeaf-8ef5-4e16-89f6-b18d1e9ae13c`（Production / main / source `1f51944`）
- 内容: Lexus ESのES500e／ES350e／ES350hを、グレード・駆動方式ごとの7販売単位で追加。2026年6月発売、税込790万円〜920万円、全車5人乗り、ACC＋LTAのLevel 2相当として掲載した。ES500eの渋滞時支援は0〜40km/hの条件付きハンズオフ、運転者監視必須。車線変更支援（LCA）は販売単位別の差を公式資料で固定できないため能力タグへ付与せず、個別注文可否は未確認を維持した。
- 公式導線: ESの商品、見積り、試乗、販売店を詳細・比較へ追加。公式掲載や工場出荷目処は個別契約・在庫を保証しないため、購入前の販売店確認を促す。
- 根拠: [Lexus ES商品](https://lexus.jp/models/es/)、[Toyota発売リリース](https://global.toyota/jp/newsroom/lexus/44452094.html)、[Lexus安全機能](https://lexus.jp/models/es/features/safety/)、[Lexus納期案内](https://lexus.jp/news/info/delivery/)（確認日: 2026-09-12）。
- SEO／公開面: 469 HTML、sitemap-0は468 URL、車両詳細463件、トップ／一覧ItemListは2ページ・924項目。GTM実IDは各HTML 1件、テスト計測ID0件、公開HTML内部enum・source・accessedAt漏れ0件。ES registryは11/11 surface closure。
- QA: `npm test` Vitest81/81＋Python16/16、価格462/462（exact441／range21／未確認0）、公式導線84モデル／81 URL／174 actions、注文可48／未確認414、鮮度確認済み462／要再確認0／競合1、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、独立リリース監査PASS。ローカル／immutable／本体E2E各1/1（immutable・本体GA collect HTTP204）。
- 本番smoke: 本体・immutableのトップ、一覧、ES詳細、ES比較、sitemap、robotsはHTTP200。未知URL404、`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）の`/cars/?level=1&sort=release_desc`は本体へqueryを維持した301。一覧の既存Wikimedia Commons画像はデスクトップ約374×115px・モバイル約360×88pxのWebPサムネイル（`loading=lazy`・`object-fit: cover`）を維持し、新規画像は権利確認ができないため追加していない。

## 最新の配信（2026-09-12 Land Rover Discovery Sport 3販売単位追加）

- exact release commit: `4c619d6fc7a04bda0b2d59a73582fa40e99fc014`（Discovery Sportの正本・公式導線・依存registry・E2E・KPIを同期）
- immutable: https://2af69c7f.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- Cloudflare Pages: `2af69c7f-8bcf-4d1c-a71e-d46e8f2b73e2`（Production / main / source `4c619d6`）
- 内容: Land Rover Discovery SportのDynamic S／Landmark／Metropolitanを3販売単位で追加。公式仕様・価格表から税込724万円〜／823万円〜／1,071万円〜、ACC＋車線中央維持のLevel 2相当、ステアリング保持・常時監視必須・ハンズオフ不可として登録した。発売日・個別の受注可否・作動道路／速度は一次情報で固定できないため未確認を維持し、同一Level内のグレード価格差を一覧・詳細・比較で確認できるようにした。
- 公式導線: 商品、グレード・価格、コンフィギュレーター、試乗、リテイラー検索をDiscovery Sportの詳細へ追加。公式掲載は受注保証ではないため、購入前に販売店確認を促す。
- 根拠: [Discovery Sport商品](https://www.landrover.co.jp/discovery/discovery-sport/index.html)、[グレード・価格](https://www.landrover.co.jp/discovery/discovery-sport/models-and-specifications.html)、[安全機能](https://www.landrover.co.jp/explore-land-rover/about-suvs/safety-features.html)、[コンフィギュレーター](https://www.landrover.co.jp/build-your-own/index.html)、[試乗予約](https://www.landrover.co.jp/book-a-test-drive/index.html)、[リテイラー検索](https://retailers.landrover.co.jp/search)、[Level 2定義](https://www.mlit.go.jp/common/001343740.pdf)（確認日: 2026-09-12）。
- SEO／公開面: 462 HTML、sitemap-0は461 URL、車両詳細456件、トップ／一覧ItemListは2ページ・910項目。GTM実IDは各HTML 1件、テスト計測ID0件、公開HTML内部enum・source・accessedAt漏れ0件。registry closureは既存546/546＋Discovery 7/7。
- QA: `npm test` Vitest80/80＋Python16/16、価格456/456（exact434／range21／未確認1）、公式導線83モデル／80 URL／171 actions、注文可48／未確認407／利用不可1、鮮度確認済み455／要再確認0／競合1、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、独立リリース監査PASS。ローカル／immutable／本体E2E各1/1（本体・immutable GA collect HTTP204）。
- 本番smoke: 本体・immutableのトップ、一覧、Discovery Sport 3詳細、Discovery比較、sitemap、robotsはHTTP200。未知URL404、`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）の`/cars/?level=1&sort=release_desc`は本体へqueryを維持した301。一覧の既存Wikimedia Commons画像はデスクトップ約374×115px・モバイル約360×88pxのWebPサムネイル（`loading=lazy`・`object-fit: cover`）を維持し、新規画像は権利確認ができないため追加していない。

## 最新の配信（2026-09-12 Jeep Commander／Suzuki FRONX候補追加）

- exact release commit: `b8f2817e1cc8f60fa10dd05fa19bebbf63ab486c`（Jeep Commander 1単位、Suzuki FRONX 2単位、公式導線・台帳・E2Eを同期。registry件数マーカーは後続docs commit `27b8b3872ed4f02f4a0102769d8aeaca158c9824`で452へ同期）
- immutable: https://69ce7e54.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- Cloudflare Pages: `69ce7e54-99a7-47ee-a49e-5cc09d516344`（Production / main / source `b8f2817`）
- 内容: Jeep Commander Limited（4WD・7人乗り、税込619万円〜）とSuzuki FRONX（2WD・6AT 254万1,000円、4WD・6AT 273万9,000円）を日本向け現行候補として追加。いずれもACC＋車線維持支援のLevel 2相当、ハンズオフ不可。CommanderはHighway Assist／Active Lane Management、FRONXは車線変更時の加減速・側方警告を自動車線変更支援と区別し、FRONXのドライバーモニタリングは未確認、個別受注可否は全3単位で未確認とした。公式商品・安全・価格・見積り等の導線を詳細・比較へ反映した。
- 根拠: [Jeep Commander商品](https://www.jeep-japan.com/commander.html)、[Jeep安全性能](https://www.jeep-japan.com/commander/safety-security.html)、[Suzuki FRONX商品](https://www.suzuki.co.jp/car/fronx/)、[FRONX価格](https://www.suzuki.co.jp/car/fronx/detail/)、[FRONX安全](https://www.suzuki.co.jp/car/fronx/safety/)、[FRONX発売発表](https://www.suzuki.co.jp/release/a/2024/1016/)、[Level 2定義](https://www.mlit.go.jp/common/001343740.pdf)（確認日: 2026-09-12）。
- SEO／公開面: 459 HTML、sitemap-0は458 URL、車両詳細453件、トップ／一覧ItemListは2ページ・904項目。GTM実IDは各HTML 1件、テスト計測ID0件、公開HTML内部enum・source・accessedAt漏れ0件。
- QA: `npm test` 79/79＋Python16/16、価格453/453（exact434／range18／未確認1）、公式導線82モデル／79 URL／168 actions、注文可48／未確認404／利用不可1、鮮度確認済み452／要再確認0／競合1、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、registry closure 546/546、独立リリース監査PASS。
- 本番smoke: immutable／本体E2E各1/1（本体GA collect HTTP204）。トップ、一覧、Commander詳細、FRONX詳細、FRONX比較、sitemap、robotsはHTTP200、未知URL404、`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301。既存Wikimedia Commons画像は一覧でデスクトップ約374×115px・モバイル約360×88pxのWebPサムネイル（`loading=lazy`・`object-fit: cover`）を維持し、新規画像は追加していない。

## 最新の配信（2026-09-12 Peugeot E-3008 GT候補追加）

- exact release commit: `9bebe69`（Peugeot E-3008 GTの正本・公式導線・台帳・テストを同期）
- immutable: https://ce08097e.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- Cloudflare Pages: `ce08097e-c61d-4568-9d19-c87f652e8434`（Production / main / source `9bebe69`）
- 内容: Peugeot NEW E-3008 GTを日本向けのLevel 2相当候補として1販売単位追加。日本向け公式商品ページの全車共通ACC（ストップ＆ゴー）・レーンキープアシスト、GTのレーンポジショニングアシストと、購入サポートページの2026年9月現在税込メーカー希望小売価格760万円〜を確認した。発売日・個別受注可否・作動道路／速度・ハンズオフ条件は未確認のまま保持し、ハンズオフ不可・運転者監視必須として一覧／詳細／比較へ反映。公式商品ページと見積もりシミュレーション導線を追加した。
- 根拠: [NEW E-3008商品ページ](https://www.peugeot.co.jp/range/new-peugeot-3008/electric.html)、[購入サポート](https://www.peugeot.co.jp/buy/buy-peugeot/current-offers/peugeot-e-3008.html)、[ADAS説明](https://www.peugeot.co.jp/brand/innovation/driving-experience/adas.html/1000)、[Level 2定義](https://www.mlit.go.jp/common/001343740.pdf)（確認日: 2026-09-12）。調査環境のWAFで商品・購入サポートページの直接HTTP取得は403だったため、HTTP 200や注文可能とは扱わず、公式検索表示と公式説明を照合した。
- SEO／公開面: 456 HTML、sitemap-0は455 URL、車両詳細450件、トップ／一覧ItemListは2ページ・898項目。GTM実IDは各HTML 1件、テスト計測ID0件、公開HTML内部enum・source・accessedAt漏れ0件。
- QA: `npm test` 78/78＋Python16/16、価格450/450（exact432／range17／未確認1）、公式導線80モデル／77 URL／164 actions、注文可48／未確認401／利用不可1、鮮度確認済み449／要再確認0／競合1、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release PASS、registry closure 546/546、独立リリース監査PASS。
- 本番smoke: immutable／本体E2E各1/1（本体GA collect HTTP204）。トップ、一覧、Peugeot詳細、Peugeot＋Tesla比較、sitemap、robotsはHTTP200、未知URL404、`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301。既存Wikimedia Commons画像は一覧でデスクトップ約374×115px・モバイル約360×88pxのWebPサムネイル（`loading=lazy`・`object-fit: cover`）を維持し、Peugeot用画像は権利確認できる素材がないため追加していない。

## 最新の配信（2026-09-12 Cadillac LYRIQ SPORT候補追加）

- exact release commit: `51db9e6`（実装 `10c0310`、依存レジストリ件数同期を含む）
- immutable: https://d25bb67f.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Cadillac LYRIQ SPORTを日本向けの購入候補として1販売単位追加。キャデラック公式の商品・主要諸元・販売開始リリースで、税込1,100万円〜、2025年3月8日販売開始、全車速追従ACC＋レーンキープアシストを確認した。日本向けページから自動運転レベル2、車線中央維持、ハンズオフ、注文可を確認できないため、Level 1相当・ハンズオフ不可・注文可否未確認として登録。モデル年は公式ページに明記がないため未設定。試乗予約・見積り・販売店・カタログの公式導線を詳細ページへ追加した。
- 根拠: [LYRIQ商品ページ](https://www.cadillacjapan.com/electric/lyriq)、[主要諸元](https://www.cadillacjapan.com/electric/lyriq/features-specs/features-specs-1)、[販売開始リリース](https://news.cadillacjapan.com/jp/cadillac/newsroom.detail.html/Pages/news/jp/ja/2025/mar/0307_Cadillac-LYRIQ.html)（確認日: 2026-09-12）。価格の「〜」表記は上限未確認の価格レンジとして扱い、能力・注文可否を価格根拠から推測していない。
- SEO／公開面: 455 HTML、sitemap-0は454 URL、車両詳細449件、トップ／一覧ItemListは2ページ・896項目。GTM実IDは各HTML 1件、テスト計測ID0件。公開HTML内部enum・source・accessedAt漏れ0件。
- QA: `npm test` 77/77＋Python16/16、価格449/449（exact432／range16／未確認1）、公式導線79モデル／76 URL／163 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、鮮度確認済み448／要再確認0／競合1／未確認0、registry closure 546/546、独立リリース監査PASS。
- 本番smoke: immutable／本体E2E各1/1（本体GA collect HTTP204）。トップ、一覧、LYRIQ詳細、比較、sitemap、robotsはHTTP200、未知URL404、`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301。既存Wikimedia Commons画像は一覧でデスクトップ約374×115px・モバイル約360×88pxのWebPサムネイル（`loading=lazy`・`object-fit: cover`）を維持。LYRIQ用の新規画像は権利確認できる素材がないため追加していない。

## 最新の配信（2026-09-12 0件フィルター救済）

- exact release commit: `d923268`
- immutable: https://7f083b08.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 条件を重ねて0件になったとき、市場に存在しないと断定せず、実データで1条件だけ緩めると候補が戻る選択肢を件数付きで提示。Level 3の0件では「Level 3の条件を外す → 447件」を表示し、適用後もURL・戻る・リセットを既存契約で維持。Level／メーカー／道路／ハンズオフ／販売状態／価格帯／能力のうち、候補が戻るものだけを表示し、0件の候補は出さない。
- 計測: `filter_empty_results`／`filter_relaxation_shown`／`filter_relaxation_apply`をdataLayer・GTM/GA4へ追加。個人情報・保存本文・車両IDは送信しない。GTM-PV9QVMJV version 10、Custom Event trigger 9個、GA4 Event tag 9個、variable 17個、compiler error 0。
- SEO／公開面: 454 HTML、sitemap-0は453 URL、車両詳細448件、トップ／一覧ItemListは2ページ・894項目。実ID GTM各HTML 1件、テスト計測ID0件、公開HTML内部情報漏れ0件。
- QA: `npm test` Vitest71/71＋保存再開5（計76/76）＋Python16/16、価格448/448、公式導線78モデル／75 URL／159 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、registry 546/546、独立監査PASS。
- 本番smoke: 本体／immutable E2E各1/1（本体GA collect HTTP204）、0件→緩和候補→447件復帰、トップ／一覧／Level／比較／sitemap／robots HTTP200、未知URL404。既存Wikimedia Commons画像は一覧でデスクトップ約374×115px・モバイル約360×88pxのサムネイル表示を維持。

## 最新の配信（2026-09-12 日産4モデルの工場出荷目処を追加）

- exact release commit: `535b082`
- immutable: https://b63dfcb5.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 日産公式の「各車両の工場出荷時期の目処について」（2026/9/11時点）を一次情報として、日産アリア4、エクストレイル14、キックス12、セレナ1の計31販売単位へモデル単位の出荷目処を追加。アリアは3〜4ヶ月程度、エクストレイル／キックスは1〜2ヶ月程度、セレナは販売店問い合わせとして、一覧は「出荷目処」、詳細・比較は「工場出荷目処」を表示する。仕様・グレードや販売店状況で変動するため、個別注文の根拠とは扱わず、availabilityは注文可48／未確認399を維持。
- 根拠: https://www3.nissan.co.jp/siteinfo/product.html（確認日: 2026-09-12）。`sources[].supports`の出荷目処と注文可否を分離し、内部URL・確認日は公開HTMLへ出していない。
- SEO／公開面: 454 HTML、sitemap-0は453 URL、車両詳細448件、トップ／一覧ItemListは2ページ・894項目。GTM実IDは各HTML 1件、テスト計測ID0件。公開HTML内部enum・source・accessedAt漏れ0件。
- UI: 一覧のWikimedia Commons参考写真は`clamp(88px, 8vw, 118px)`・`object-fit: cover`・`loading=lazy`のWebPサムネイルで省スペース表示（実ブラウザでデスクトップ374×115px、モバイル360×88px）。詳細の大きい画像、作者・ライセンス帰属リンク、セルフホスト方針を維持。
- QA: `npm test` Vitest75/75＋Python16/16、価格448/448（exact432／range15／未確認1）、公式導線78モデル／75 URL／159 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、registry surface marker 546/546、独立リリース監査PASS。
- 本番smoke: immutable／本体のトップ、一覧、X-TRAIL詳細、比較、sitemap、robotsはHTTP200。X-TRAIL詳細で「工場出荷目処 1〜2ヶ月程度」を確認。未知URL404、`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）はpath/queryを本体へ301。本体E2E（GA collect HTTP204）／immutable E2E各1/1。Cloudflare Pages deployment listで`b63dfcb5`をProduction・main・`535b082`として確認。

## 最新の配信（2026-09-12 Honda N-BOX 34販売単位追加）

- exact release commit: `e410abb`
- immutable: https://bf37c947.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Honda N-BOXの現行17タイプをFF・4WD別の34販売単位として追加。N-BOX／ファッションスタイル／N-BOX JOY／CUSTOMの標準・ターボ・BLACK STYLE・コーディネートを、2026年7月カタログ、税込価格176万8,800円〜282万400円、Honda SENSINGの渋滞追従ACC・LKAS、Level 2相当・ステアリング保持必須として一覧／詳細／比較へ反映した。福祉車両スロープ仕様は通常乗用の比較対象から除外。個別発売日・注文可否は未確認のまま保持し、Honda公式の商品・販売店・試乗・見積り・カタログ導線を追加した。
- SEO／公開面: 454 HTML、sitemap-0は453 URL、車両詳細448件、トップ／一覧ItemListは2ページ・894項目。GTM実IDは各HTML 1件、テスト計測ID0件。公開HTML内部enum・source・accessedAt漏れ0件。
- UI: 一覧のWikimedia Commons参考写真は`clamp(88px, 8vw, 118px)`・`object-fit: cover`・`loading=lazy`のWebPサムネイルで省スペース表示（実ブラウザでデスクトップ374×115px、モバイル360×88px）。詳細の大きい画像、作者・ライセンス帰属リンク、セルフホスト方針を維持。
- QA: `npm test` Vitest74/74＋Python16/16、価格448/448（exact432／range15／未確認1）、公式導線78モデル／75 URL／159 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、注文可48件／未確認399件、registry 508/508。
- 本番smoke: immutable／本体のトップ、一覧、N-BOX標準・CUSTOM詳細、sitemap、robotsはHTTP200。未知URL404、`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）はpath/queryを本体へ301。immutable／本体E2E各1/1、本体GA collect HTTP204。Cloudflare Pages deployment listで`bf37c947`をProduction・main・`e410abb`として確認。

## 最新の配信（2026-09-12 三菱4車種の購入予約導線確認）

- exact release commit: `4f9e492`
- immutable: https://4f6fc55b.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 三菱 eKクロス8販売単位、eKクロス EV 3販売単位、デリカミニ12販売単位、eKスペース4販売単位（計27単位）について、三菱公式商品ページの「商談予約・購入予約受付中」を確認し、販売状態を`new_order_available`へ更新した。購入予約は最終契約・個別在庫・納期を保証しないため、販売店確認が必要と明記している。eKクロス／eKクロス EV／デリカミニ／eKスペースの公式購入予約URLを詳細ページのアクションへ同期した。
- SEO／公開面: 420 HTML、sitemap-0は419 URL、車両詳細414件、トップ／一覧ItemListは2ページ・826項目。GTM実IDは各HTML 1件、テスト計測ID0件。公開HTML内部enum・source・accessedAt漏れ0件。
- UI: 一覧のWikimedia Commons参考写真は`clamp(88px, 8vw, 118px)`・`object-fit: cover`・`loading=lazy`のWebPサムネイルで省スペース表示（実ブラウザでデスクトップ374×115px、モバイル360×88px）。詳細の大きい画像、作者・ライセンス帰属リンク、セルフホスト方針を維持。
- QA: `npm test` Vitest73/73＋Python16/16、価格414/414（exact398／range15／未確認1）、公式導線77モデル／74 URL／155 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、注文可48件／未確認365件、registry 508/508、独立リリース監査PASS。
- 本番smoke: immutable／本体のトップ、一覧、eKクロス、eKクロス EV、デリカミニ、eKスペース詳細と購入予約導線、比較、sitemap、robotsはHTTP200。未知URL404、`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）はpath/queryを本体へ301。immutable／本体E2E各1/1、本体GA collect HTTP204。Cloudflare Pages deployment APIでも`4f6fc55b`をproduction・`jidouunten.jp` alias・deploy successとして確認。

## 最新の配信（2026-09-12 Toyota MIRAI追加・一覧サムネイル回帰確認）

- exact release commit: `0e95015`
- immutable: https://50d723bc.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Toyota MIRAIのG／Z（2WD・5人乗り）を2販売単位で追加。価格はG 741万4,000円、Z 821万5,900円（税込）。全車速追従ACC・LTA、LCA、アドバンスト ドライブ（渋滞時支援）を公式資料で確認し、Level 2相当・渋滞時0〜約40km/hの条件内ハンズオフ・常時監視必須として登録した。グレード差・価格差を一覧／詳細／比較／能力フィルターへ反映し、公式商品・販売店・試乗・見積り・カタログ導線を同期。
- SEO／公開面: 420 HTML、sitemap-0は419 URL、車両詳細414件、トップ／一覧ItemListは2ページ・826項目。GTM実IDは各HTML 1件、テスト計測ID0件。公開HTML内部enum・source・accessedAt漏れ0件。
- UI: 一覧のWikimedia Commons参考写真は`clamp(88px, 8vw, 118px)`・`object-fit: cover`・`loading=lazy`のWebPサムネイルで省スペース表示（実ブラウザでデスクトップ374×115px、モバイル360×88px）。詳細の大きい画像、作者・ライセンス帰属リンク、セルフホスト方針を維持。
- QA: `npm test` 73/73＋Python16/16、価格414/414（exact398／range15／未確認1）、公式導線77モデル／74 URL／151 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、registry 508/508、独立監査PASS、ローカル／immutable／本体E2E各1/1（本体GA collect HTTP204）。
- 本番smoke: 本体・immutableのトップ、一覧、MIRAI G/Z詳細、MIRAI比較、sitemap、robots、参考画像WebPはHTTP200。未知URL404、`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）はpath/queryを本体へ301（TLS対応のPunycode URLで確認）。

## 最新の配信（2026-09-12 三菱 デリカミニ／eKスペース追加）

- exact release commit: `af6fc06`
- immutable: https://4f200c90.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 三菱デリカミニ12販売単位（T／GはLevel 1、Premium／DELIMARU PackageはMI-PILOT標準のLevel 2）とeKスペース4販売単位（M／G、全車LDPのみのLevel 1）を追加。価格はデリカミニ1,964,600〜2,907,300円、eKスペース1,749,000〜1,945,900円（税込）。同じLevel内のグレード・駆動方式差を一覧／比較で確認できる。eKスペースは現行2025年カタログにMI-PILOT標準の記載がないためLevel 2を推測していない。
- 公式導線: デリカミニ／eKスペースの商品・試乗・見積り・販売店・カタログURLを`src/data/official-links.json`へ同期。注文可否は16単位とも未確認を維持。
- SEO／公開面: 418 HTML、sitemap-0は417 URL、詳細412件、トップ／一覧ItemListは2ページ・822項目。GTM実IDは各HTML 1件、テスト計測ID0件。内部enum・根拠URL・確認日キーの公開HTML漏れ0件。
- UI: 一覧のWikimedia Commons参考写真は`clamp(88px, 8vw, 118px)`・`object-fit: cover`・`loading=lazy`のWebPサムネイルで省スペース表示（実ブラウザでデスクトップ374×115px、モバイル360×88px）。詳細の大きい画像、作者・ライセンス帰属リンク、セルフホスト方針を維持。
- QA: `npm test` Vitest72/72＋Python16/16、価格412/412（exact396／range15／未確認1）、公式導線76モデル／73 URL／147 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、registry 508/508、独立監査PASS、ローカル／immutable／本体E2E各1/1（GA collect HTTP204）。
- 本番smoke: 本体・immutableのトップ、一覧、デリカミニ Level 1／Level 2詳細、eKスペース詳細、比較、sitemap、robotsはHTTP200。未知URL404、`自動運転.jp`はpath/queryを本体へ301。参考画像WebP 3件はHTTP200。

## 最新の配信（2026-09-12 三菱 eKクロス／eKクロス EV追加）

- exact release commit: `b3fac85`（実装 `1b5bf1a`、レジストリ件数同期を含む）
- immutable: https://d0654d37.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 三菱の現行eKクロス8販売単位（G／G Premium／T／T Premium、2WD・4WD）とeKクロス EV 3販売単位（G／P、先進安全快適パッケージ有無）を追加。LDPのみをLevel 1、MI-PILOT（ACC＋LKA）標準またはメーカーオプション装着をLevel 2として分離し、価格1,856,800円〜3,214,200円、EVパッケージ+110,000円、発売・価格適用日、ハンズオフ不可・常時監視必須を表示する。同じLevel内のグレード／パッケージ差を一覧・比較できる。
- 公式導線: eKクロス／eKクロス EVの商品・試乗・見積り・販売店・カタログURLを`src/data/official-links.json`へ同期。注文可否は一次情報で固定できないため11単位とも未確認を維持。
- SEO／公開面: 402 HTML、sitemap-0は401 URL、詳細396件、トップ／一覧ItemListは2ページ・790項目。GTM実IDは各HTML 1件、テスト計測ID0件。内部enum・根拠URL・確認日キーの公開HTML漏れ0件。
- UI: 一覧のWikimedia Commons参考写真は`clamp(88px, 8vw, 118px)`・`object-fit: cover`・`loading=lazy`のWebPサムネイルで省スペース表示。詳細の大きい画像、作者・ライセンス帰属リンク、セルフホスト方針を維持。
- QA: `npm test` 70/70（Vitest＋保存再開）＋Python16/16、価格396/396、公式導線74モデル／71 URL／139 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、registry 508/508、独立監査PASS、ローカルE2E 1/1、immutable／本体E2EでGA collect HTTP204。
- 本番smoke: immutable／本体のトップ、一覧、eKクロス Level 1／Level 2詳細、eKクロス EVパッケージ詳細、比較、sitemap、robotsはHTTP200。未知URL404、`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）は本体へ301（path/query維持）。
- 直前の正常配信・ロールバック候補: https://19c97f88.jidouunten.pages.dev

## 最新の配信（2026-09-12 BYD公式導線URL刷新）

- exact app release commit: `a716bbf`
- immutable: https://19c97f88.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: BYD DOLPHIN／ATTO 3／SEAL／SEALION 6の商品・試乗・販売店・カタログ導線を、現行BYD公式 (`prod.byd.com`) と公式販売店検索 (`dealer.bydauto.co.jp`) へ更新。車両の価格・能力・注文状態は変更せず、正本の価格根拠URLと研究台帳の対応する商品／カタログURLだけ同期した。
- 公式導線疎通: BYD重複除外9 URL中9 URLがHTTP 200（商品4、販売店1、カタログ4）。更新前の全導線監査は173 URL中163件が2xx/3xx、BYD旧ドメイン等10件はDNS／アクセス制限として分離記録。
- QA: `npm test` 69/69（Vitest）＋Python16/16、価格385/385、公式導線72モデル／69 URL／131 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS（391 HTML、ItemList 768項目）、registry 508/508、公開HTML内部enum・source・accessedAt漏れ0、独立監査PASS、immutable／production E2E 1/1（GA collect HTTP204）、主要URL200、404、IDN path/query301。
- 直前の正常配信・ロールバック候補: https://42ab762a.jidouunten.pages.dev

## 最新の配信（2026-09-12 車両データ鮮度表示）

- exact app release commit: `a13e287`
- immutable: https://42ab762a.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 車両データの確認状態を、一覧・詳細・比較で利用者向けの日本語として表示。販売状態は90日、機能・作動条件（ODD）は180日を目安に再確認し、確認済みの車両には余計な表示を出さない。現在はBYD ATTO 3の競合情報1販売単位だけが「情報が競合」と表示される。内部enum・根拠URL・アクセス日時は公開HTMLへ出さない。
- UI: 一覧のWikimedia Commons参考写真は従来どおりWebPサムネイル（`loading="lazy"`・`object-fit: cover`）で省スペース表示。作者・ライセンス帰属リンクと詳細の大きい画像は維持。
- SEO／公開面: 391 HTML、sitemap-0は390 URL、詳細385件、トップ／一覧ItemListは2ページ・768項目。GTM実IDは各HTML 1件、テスト計測ID0件。
- QA: `npm test` 69/69（Vitest）＋Python16/16、価格385/385（現行384、exact369／range15／未確認1）、公式導線72モデル／69 URL／131 actions、画像3/3、鮮度checker（2026-09-12基準）確認済み384／要再確認0／競合1／未確認0、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、registry 52 entities／508 surfaces／474 required selectors closure、公開HTML内部enum・source・accessedAt漏れ0、独立監査PASS、production E2E 1/1（GA collect HTTP204）、主要URL200、IDN path/query301。
- 直前の正常配信・ロールバック候補: https://a612f40b.jidouunten.pages.dev

## 最新の配信（2026-09-12 Daihatsu タント系20販売単位追加）

- exact app release commit: `6b755d0`
- immutable: https://a612f40b.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: ダイハツのタント／タント カスタム／タント ファンクロスを、グレード×2WD・4WDの20販売単位で追加。L／X系の車線逸脱抑制のみ8単位をLevel 1相当、Xターボ／カスタムRS／ファンクロス ターボとスマートクルーズパック装着を含む12単位をACC＋車線中央維持のLevel 2相当として登録した。価格は149万6,000円〜214万5,000円（税込）。スマートクルーズパックはメーカーオプション55,000円として標準装着と分離し、同一車種・同一Level内の能力差を比較できる。注文可否は20単位とも`unknown`。
- 公式根拠: [タント商品ページ](https://www.daihatsu.co.jp/lineup/tanto/)、[タント グレード・価格](https://www.daihatsu.co.jp/lineup/tanto/02_grade.htm)、[タント 運転支援](https://www.daihatsu.co.jp/lineup/tanto/04_driving.htm)、[タント ファンクロス](https://www.daihatsu.co.jp/lineup/tanto_funcross/)、[U-CATCH カタログ](https://u-catch.daihatsu.co.jp/catalog/TANTO/MODEL__201907/)、[国土交通省 Level定義](https://www.mlit.go.jp/common/001343740.pdf)。販売店・試乗・見積り・カタログ導線を3モデルへ同期。
- SEO／公開面: 391 HTML、sitemap-0は390 URL、詳細385件、トップ／一覧ItemListは2ページ・768項目。GTM実IDは各HTML 1件、テスト計測ID0件。
- UI: 一覧のWikimedia Commons参考写真はWebPサムネイル（デスクトップ約374×102px、モバイル約360×88px、`loading=lazy`・`object-fit: cover`）で省スペース表示。詳細の大きい画像、作者・ライセンス帰属リンク、セルフホスト方針は維持。
- QA: `npm test` 68/68（Vitest）＋Python16/16、価格385/385（現行384、exact369／range15／未確認1）、公式導線72モデル／69 URL／131 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、registry 52 entities／508 surfaces／474 required selectors closure、公開HTML enum/source/accessedAt漏れ0、独立監査PASS、immutable／本体E2E各1/1（GA collect HTTP204）、主要URL200、IDN path/query301。
- 直前の正常配信・ロールバック候補: https://0208588f.jidouunten.pages.dev

## 最新の配信（2026-09-12 Suzuki スペーシア12販売単位追加）

- exact app release commit: `18d708c`
- immutable: https://0208588f.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: スペーシア／スペーシア カスタムのHYBRID G／X／X セーフティプラスパッケージ／GS／XS／XSターボを2WD・4WDの全12販売単位で追加。価格は153万100円〜219万3,400円（税込）。G／Xは車線逸脱抑制のLevel 1相当、セーフティプラス／カスタムはACC全車速追従・停止保持＋車線維持支援のLevel 2相当。同じモデル内で能力差を比較でき、全12単位の注文可否は未確認。
- 公式根拠: [スペーシア グレード・価格](https://www.suzuki.co.jp/car/spacia/detail/)、[安全装備](https://www.suzuki.co.jp/car/spacia/safety/)、[主要装備・主要諸元](https://www.suzuki.co.jp/car/spacia/detail/pdf/detail.pdf)、[発売資料](https://www.suzuki.co.jp/release/a/2023/1109/)。購入相談・試乗・見積り・カタログ導線を追加。
- SEO／公開面: 371 HTML、sitemap-0は366 URL、詳細365件、トップ／一覧ItemListは2ページ・728項目。GTM実IDは各HTML 1件、テスト計測ID0件。
- UI: Level 1に車線逸脱抑制を追加し、Level 2の車線中央維持と別能力としてチェックボックスAND絞り込みできるようにした。一覧のWikimedia Commons参考写真はWebPサムネイル（デスクトップ374×102px、モバイル330×88px、`loading=lazy`）で省スペース表示。
- QA: `npm test` 67/67（Vitest）＋Python16/16、価格365/365（現行364/364、exact349／range15／未確認1）、公式導線69モデル／67 URL／119 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、registry 502/502、公開HTML enum/source/accessedAt漏れ0、独立監査PASS、immutable／本体E2E各1/1（GA collect HTTP204）、主要URL200、IDN path/query301。
- 直前の正常配信・ロールバック候補: https://c9ddc80f.jidouunten.pages.dev

## 最新の配信（2026-09-12 Toyota GRヤリス10販売単位追加）

- exact app release commit: `45f2e3d`
- immutable: https://c9ddc80f.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Toyota GRヤリスのRZ“High performance”／RZ／RCとAero performance package、GR-DAT（8AT・4WD）／6MT（4WD）の全10販売単位を追加。価格は361万7,200円〜588万2,200円（税込、2026年3月仕様）。全車ACC＋LTAのLevel 2相当・ステアリング保持必須で、GR-DATは全車速追従（停止保持なし）、6MTは約30km/h以上から作動。同じLevel 2内でグレード、変速機、Aero packageの価格・作動条件差を比較できる。注文可否は10単位とも`unknown`。
- 公式根拠: [GRヤリス商品](https://toyota.jp/gryaris/)、[価格・グレードJSON](https://toyota.jp/pages/contents/include/carpage_format/carlineup/data/json/grades60.json)、[安全性能](https://toyota.jp/gryaris/safety/)、[主要装備比較表](https://toyota.jp/pages/contents/gryaris/001_p_002/pdf/gryaris_spec_202603.pdf)、[LTA取扱説明書](https://manual.toyota.jp/gr_yaris/2604/cv/ja_JP/contents/vhch04se050404.php)。GRヤリスの販売店・試乗・見積り・カタログ導線を追加。
- SEO／公開面: 359 HTML、sitemap-0は354 URL、詳細353件、トップ／一覧ItemListは2ページ・704項目。GTM実IDは359 HTMLへ各1件、テストID0件。
- UI: 一覧のWikimedia Commons参考写真は`clamp(88px, 8vw, 118px)`・`object-fit: cover`・`loading=lazy`のサムネイルで省スペース表示。詳細の大きい画像、作者・ライセンス帰属リンク、セルフホストWebPは維持。
- QA: `npm test` Vitest61＋保存再開5＝66/66、Python16/16、価格353/353（現行352/352、exact337／range15／未確認1）、公式導線67モデル／65 URL／111 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、registry 50 entities／496 surfaces／466 required selectorsのclosure PASS、独立リリース監査PASS、immutable／本体E2E各1/1（GA collect HTTP204）。
- 本番smoke: 本体・immutableのトップ、一覧、GRヤリスRZ High performance／RC詳細、比較、sitemapはHTTP200。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）はpath/queryを本体へ301。GTM実IDは`GTM-PV9QVMJV`、テストIDは0件。
- 直前の正常配信・ロールバック候補: https://fa2e7583.jidouunten.pages.dev

## 最新の配信（2026-09-12 Honda CIVIC 5販売単位追加）

- exact app release commit: `91b8d6d2baaebeabacb1b0228d2b1d59c7fd402b`
- immutable: https://ab09429b.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Honda CIVIC（11代目）のe:HEV LX／e:HEV EX／e:HEV RS／ガソリンEX／ガソリンRSを5販売単位として追加。2026年6月5日発売、価格は394万6,800円〜465万9,600円（税込）。全車ACC＋LKASのLevel 2相当で、e:HEV 3単位とガソリンEXは渋滞時運転支援（TJA）標準、ガソリンRSは対象外として比較できる。注文可否・在庫・納期は一次情報で固定できないため5単位とも`unknown`を維持。
- 公式導線: [CIVIC商品ページ](https://www.honda.co.jp/CIVIC/)、[タイプデータ](https://www.honda.co.jp/CIVIC/common/data/type.json)、[性能・安全](https://www.honda.co.jp/CIVIC/webcatalog/performance/)、[主要装備表](https://www.honda.co.jp/CIVIC/common/pdf/civic_equipment_list.pdf)、[発売発表](https://global.honda/jp/news/2026/4260604-civic.html)。販売店・試乗・見積り・カタログ導線を保持。
- SEO／公開面: 346 HTML、sitemap-0は341 URL、詳細340件、トップ／一覧ItemListは2ページ・678項目。GTM実IDは346 HTMLへ各1件、テストID0件。
- UI: 一覧のWikimedia Commons参考写真は`clamp(88px, 8vw, 118px)`・`object-fit: cover`・`loading=lazy`のサムネイルで省スペース表示。詳細の大きい画像、作者・ライセンス帰属リンク、セルフホストWebPは維持。
- QA: `npm test` Vitest59＋保存再開5＝64/64、Python16/16、価格340/340（現行339/339、exact324／range15／未確認1）、公式導線66モデル／64 URL／107 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build／release／structured PASS、registry 48 entities／482 surfaces／455 required selectorsのclosure PASS、独立リリース監査PASS、immutable／本体E2E各1/1（GA collect204）。
- 本番smoke: 本体・immutableのトップ、一覧、CIVIC詳細、比較、sitemapはHTTP200、未知URL404。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）はpath/queryを本体へ301。参考画像WebPはHTTP200（163,592 bytes）。
- 直前の正常配信・ロールバック候補: https://4c27b72b.jidouunten.pages.dev

## 最新の配信（2026-09-12 日産 キックス P16 12販売単位追加）

- exact app release commit: `40acdbc65cf1f39db7826c1b412137fece455c83`
- immutable: https://4c27b72b.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 日産キックスP16のG／X+／X／X シンプルパッケージ／ROCK CREEK／ROCK CREEK Utility Specを2WD・4WD（e-4ORCE）別の12販売単位として追加。価格は299万9,700円〜430万9,800円（税込）。プロパイロットの車速30〜135km/h・車線中央付近の操舵支援、ステアリング保持・常時監視が必要なLevel 2相当、ハンズオフ不可として比較できるようにした。個別の受注可否・在庫・納期は一次情報で固定できないため12単位とも`unknown`を維持。
- 公式導線: [キックス商品ページ](https://www3.nissan.co.jp/vehicles/new/kicks.html)、[価格・グレード](https://www3.nissan.co.jp/vehicles/new/kicks/specifications.html)、[走行・安全](https://www3.nissan.co.jp/vehicles/new/kicks/performance_safety.html)、FAQ、販売店・試乗・見積り・カタログ。詳細は[X シンプルパッケージ 2WD](https://jidouunten.jp/cars/jp-nissan-kicks-2026-x-simple-2wd/)、比較は[2WD/e-4ORCE比較](https://jidouunten.jp/compare/?ids=jp-nissan-kicks-2026-x-simple-2wd&ids=jp-nissan-kicks-2026-g-e4orce-4wd)で確認できる。
- SEO／公開面: 341 HTML、車両URL336（詳細335＋トップ）、詳細335件、トップ／一覧ItemListは2ページ・668項目。GTM実IDは341 HTMLへ各1件、テストID0件。
- QA: `npm test` Vitest63/63・Python16/16、価格335/335（現行334/334、exact319／range15／未確認1）、公式導線65モデル／63 URL／103 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build341、release／structured PASS（Breadcrumb341／Car335／ItemList668）、registry47 entities／473 surfaces／2,331 markers失敗0、独立リリース監査PASS。ローカル／immutable／本体E2E各1/1（GA collect HTTP204）。
- 本番smoke: 本体・immutableのトップ、一覧、キックス詳細、キックス比較、sitemap-index、sitemap-0はHTTP200、未知URL404。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）は`/cars/?level=2&sort=price_asc`を本体へpath/query維持の301。一覧の既存Wikimedia Commons参考写真はWebPサムネイル（HTTP200、163,592 bytes）を維持。
- 直前の正常配信・ロールバック候補: https://0ab618f0.jidouunten.pages.dev

## 最新の配信（2026-09-12 Honda フリード CROSSTAR 8販売単位追加）

- exact app release commit: `a919fbc69c78a64b636d483d5cde226520fc25e4`
- immutable: https://0ab618f0.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Honda フリード CROSSTARの通常乗用8販売単位（e:HEV／ガソリン、FF・4WD、5・6人乗り）を追加。価格は292万8,200円〜360万2,500円（税込、2026年9月確認）。Honda SENSING（ACC・車線中央維持・渋滞時運転支援）をLevel 2相当、ステアリング保持・常時監視が必要なハンズオフ不可として登録した。30周年特別仕様・福祉車両・AIRは今回のCROSSTAR比較から分離し、注文可否は8単位とも`unknown`を維持。
- 公式導線: [フリード商品ページ](https://www.honda.co.jp/FREED/)、[タイプ一覧](https://www.honda.co.jp/FREED/webcatalog/type/list/)、[性能・安全](https://www.honda.co.jp/FREED/webcatalog/performance/)、販売店・試乗・見積り・カタログ。公式掲載は受注保証ではないため、購入前に販売店確認を促す。
- SEO／公開面: 329 HTML、車両URL324（詳細323＋トップ）、詳細323件、トップ／一覧ItemListは2ページ・644項目。GTM実IDは329 HTMLへ各1件、テストID0件。
- QA: `npm test` Vitest62/62・Python16/16、価格323/323（現行322/322、exact307／range15／未確認1）、公式導線64モデル／62 URL／99 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build329、release／structured PASS（Breadcrumb329／Car323／ItemList644）、registry46 entities／457 surfaces／2,235 markers失敗0、独立リリース監査PASS。ローカル／immutable／本体E2E各1/1（GA collect HTTP204）。
- 本番smoke: 本体・immutableのトップ、一覧、フリード詳細、比較、sitemapはHTTP200、未知URL404。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）はpath/queryを本体へ301。フリード詳細は[FF・5人乗り](https://jidouunten.jp/cars/jp-honda-freed-2026-ehev-crosstar-ff-5/)、[比較](https://jidouunten.jp/compare/?ids=jp-honda-freed-2026-ehev-crosstar-ff-5%2Cjp-honda-freed-2026-crosstar-ff-5)で確認できる。
- 直前の正常配信・ロールバック候補: https://6a29ce8d.jidouunten.pages.dev

## 最新の配信（2026-09-12 Honda ステップ ワゴン10販売単位追加／一覧サムネイル縮小）

- exact app release commit: `594d7339bf0b32160383233c1cc0a47bcba5834a`
- immutable: https://6a29ce8d.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Honda ステップ ワゴンの通常乗用10販売単位（AIR／SPADA／SPADA PREMIUM LINE、FF・4WD、e:HEVを含む）を追加。価格は334万8,400円〜426万8,000円（税込、2026年9月確認）。Honda SENSING（ACC・車線中央維持・渋滞時運転支援）をLevel 2相当、常時監視・ステアリング保持が必要なハンズオフ不可として登録し、30周年特別仕様・福祉車両・BLACK EDITIONは通常カタログから分離した。公式掲載は受注保証ではないため、注文可否は10単位とも`unknown`を維持。
- UI: Wikimedia Commons参考写真は一覧で`clamp(88px, 8vw, 118px)`の`object-fit: cover`サムネイルへ縮小。実ブラウザはデスクトップ374×102px、モバイルはviewport 360pxでカード330×88px、`loading="lazy"`。詳細の大きい画像、作者・ライセンス帰属リンク、セルフホストWebPは維持。
- SEO／公開面: 321 HTML、車両URL316（詳細315＋トップ）、詳細315件、トップ／一覧ItemListは2ページ・628項目。GTM実IDは321 HTMLへ各1件、テストID0件。
- QA: `npm test` Vitest61/61・Python16/16、価格315/315（現行314/314、exact299／range15／未確認1）、公式導線63モデル／61 URL／95 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build321、release／structured PASS（Breadcrumb321／Car315／ItemList628）、registry45 entities／445 surfaces／2,167 markers失敗0、独立リリース監査PASS、immutable／本体E2E各1/1（GA collect HTTP204）。
- 本番smoke: ステップ ワゴン詳細、比較、sitemap-0はHTTP200、未知URLは404。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）の`/cars/?level=2&sort=price_asc`は本体へ301（query維持）。画像WebPはHTTP200（`content-type: image/webp`、163,592 bytes）。
- 直前の正常配信・ロールバック候補: https://f41ea571.jidouunten.pages.dev

## 最新の配信（2026-09-12 Toyota クラウン スポーツ4販売単位追加）

- exact app release commit: `2b7a9be9e007f3905f0ecb6c34b9461a42f622f3`
- immutable: https://f41ea571.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Toyota クラウン スポーツのSPORT RS／SPORT Z（PHEV）とSPORT Z／SPORT G（HEV）を、駆動方式を含む4販売単位として追加。価格は532万7,300円〜777万7,000円（税込、2026年9月確認）。全車をLevel 2として、RS／ZはAdvanced Driveの条件内ハンズオフ・運転者監視・車線変更支援、Gはハンズオン必須として能力差を比較できるようにした。注文可否は公式カタログ掲載だけでは受注を保証しないため4単位とも`unknown`。個別発売日・価格適用日は推定せず、現行カタログ確認月`2026-09`を保持。
- 公式根拠／導線: [クラウン スポーツ商品ページ](https://toyota.jp/crownsport/)、[グレード一覧](https://toyota.jp/crownsport/grade/)、[安全性能](https://toyota.jp/crownsport/safety/)、[2026年9月仕様表](https://toyota.jp/pages/contents/crownsport/001_p_001/pdf/specifications.pdf)、[国土交通省 自動運転レベル定義](https://www.mlit.go.jp/jidosha/anzen/01asv/jidounten/level.html)。販売店・試乗・見積り・カタログの公式導線を記録。
- SEO／公開面: 311 HTML、sitemap-0は306 URL、詳細305件、トップ／一覧ItemListは2ページ・608項目。GTM実IDは311 HTMLへ各1件、テストID0件。公開HTMLへ内部根拠URL・enumを漏らさないガードを維持。
- QA: `npm test` Vitest60/60・Python16/16、価格305/305（現行304/304、exact289／range15／未確認1）、公式導線62モデル／60 URL／91 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build311、release／structured PASS（Breadcrumb311／Car305／ItemList608）、registry 44 entities／431 surfaces／2,086 markers失敗0。独立リリース監査2件ともexact `2b7a9be9`でPASS。
- 本番smoke: immutable／本体のトップ、一覧、クラウン スポーツ詳細2種、比較、sitemap-0はHTTP200、未知URLは404。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301（query維持）。一覧画像はWikimedia Commons参考写真をサムネイル（デスクトップ374×140.8px、モバイル360×112px、`loading="lazy"`・`object-fit: cover`）で省スペース表示し、詳細の大きい表示・作者／ライセンス帰属を維持。immutable／本体E2E各1/1（GA collect HTTP204）。
- 直前の正常配信・ロールバック候補: https://95cea680.jidouunten.pages.dev

## 最新の配信（2026-09-12 Honda ZR-V 4販売単位追加）

- exact app release commit: `bf2749e`
- immutable: https://95cea680.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Honda ZR-Vの現行e:HEV X／e:HEV ZをFF・4WD各1、計4販売単位として追加。価格は370万7,000円〜452万7,600円（税込、2026年9月確認）。Honda SENSING（ACC・LKAS・トラフィックジャムアシスト）をLevel 2相当として表示し、ステアリング保持・常時監視が必要、ハンズオフ不可、車線変更支援は根拠なしとした。実注文・在庫・納期は確認できないため4単位とも注文可否`unknown`。個別発売日・価格適用日は推定せず未設定、現行カタログ確認月`2026-09`を保持。
- 公式根拠／導線: [ZR-V商品ページ](https://www.honda.co.jp/ZR-V/)、[タイプ一覧](https://www.honda.co.jp/ZR-V/webcatalog/type/list/)、[Xグレード](https://www.honda.co.jp/ZR-V/webcatalog/type/x/)、[Zグレード](https://www.honda.co.jp/ZR-V/webcatalog/type/z/)、[性能・安全](https://www.honda.co.jp/ZR-V/webcatalog/performance/)、[TJA](https://www.honda.co.jp/hondasensing/sensing/tja/)。販売店・試乗・見積り・カタログの公式導線を記録。
- SEO／公開面: 307 HTML、sitemap-0は306 URL、詳細301件、トップ／一覧ItemListは2ページ・600項目。GTM実IDは307 HTMLへ各1件、テストID0件。公開HTMLへ内部根拠URL・enumを漏らさない既存ガードを維持。
- QA: `npm test` Vitest59/59・Python16/16、価格301/301（現行300/300、exact285／range15／未確認1）、公式導線61モデル／59 URL／87 actions、画像3/3、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build307、release／structured PASS（Breadcrumb307／Car301／ItemList600）、registry 43 entities／423 surfaces／2,045 markers失敗0。独立リリース監査2件ともexact `bf2749e`でPASS、ローカル／immutable／本体E2E各1/1（GA collect HTTP204）。
- 本番smoke: immutable／本体のトップ、一覧、ZR-V詳細2種、比較、sitemap-index、sitemap-0、robotsはHTTP200、未知URLは404。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301（query維持）。一覧画像はWikimedia Commons参考写真をサムネイル（デスクトップ374×140.8px、モバイル360×112px、`object-fit: cover`）で省スペース表示し、詳細の大きい表示・作者／ライセンス帰属を維持。
- 直前の正常配信・ロールバック候補: https://6e16f4db.jidouunten.pages.dev

## 最新の配信（2026-09-11 日産エクストレイル14販売単位追加／一覧サムネイル継続）

- exact app release commit: `882c999`
- immutable: https://6e16f4db.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 日産エクストレイルの現行14販売単位（2WD／e-4ORCE、2列／3列、G・X・ROCK CREEK・NISMO・AUTECH）を追加。価格は409万2,000円〜596万2,000円（税込、2026年9月確認）。日産公式ProPILOTの一次情報に基づき全車Level 2相当（ACC＋車線内操舵、ステアリング保持・常時監視、ハンズオフ不可）として表示し、自動車線変更・ハンズオフを付与していない。掲載は注文可能の保証ではないため14単位とも注文可否は未確認。
- 公式根拠: [エクストレイル商品ページ](https://www3.nissan.co.jp/vehicles/new/x-trail.html)、[価格・グレード](https://www3.nissan.co.jp/vehicles/new/x-trail/specifications.html)、[ProPILOT](https://www3.nissan.co.jp/vehicles/new/x-trail/performance_safety/propilot.html)、2026年9月装備表（通常／NISMO／AUTECH）。公式商品・見積り・販売店・試乗・カタログ導線を記録。
- SEO／公開面: 303 HTML、sitemap-0は302 URL、詳細297件、トップ／一覧ItemListは2ページ・592項目。GTM実IDは303 HTMLへ各1件、テストID0件。
- QA: `npm test` 58/58、価格297/297（現行296/296、exact281／range15／未確認1）、公式導線60モデル／58 URL／83 actions、画像3/3、Python16/16、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build303、release guard／構造化データPASS。独立リリース監査2件ともexact `882c999`でPASS、registry 42 entities／415 surfaces／2,002 markers失敗0。ローカル／immutable／本体E2E各1/1（GA collect HTTP204）。
- 本番smoke: immutable／本体のトップ、一覧、X-Trail詳細3種、比較、sitemap-index、sitemap-0、robotsはHTTP200、未知URLは404。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301（query維持）。一覧画像は既存Wikimedia Commons参考写真をサムネイル（デスクトップ374×140.8px、モバイル360×112px、`object-fit: cover`）で維持。
- 直前の正常配信・ロールバック候補: https://f99e6571.jidouunten.pages.dev

## 最新の配信（2026-09-11 SUBARU フォレスター／一覧サムネイル改善）

- exact app release commit: `02bf120`（フォレスター追加 `83ecbf7`、依存レジストリ件数同期 `ad5a076`、一覧画像のサムネイル化を含む）
- immutable: https://f99e6571.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: SUBARU フォレスター現行7販売単位を追加。価格は385万円〜464万2,000円（税込）。全7単位をLevel 2相当として、EyeSight X標準の5単位は条件内ハンズオフ・車線変更支援、コアEyeSightの2単位はハンズオン必須として比較できる。個別発売日・価格適用日・受注可否は一次情報で固定できないため未確認を維持。公式グレード／装備／安全ページと見積り・販売店・試乗導線を記録した。
- UI: Wikimedia Commons参考写真3モデルは詳細ページの大きい表示を維持し、車両一覧では識別用サムネイル（デスクトップ実測374×140.8px、モバイル360×112px、`object-fit: cover`）へ縮小。写真は従来どおりセルフホストWebP・作者／ライセンス帰属リンク付きで、フォレスター画像は追加していない。
- SEO／公開面: 289 HTML、sitemap-0は288 URL、詳細283件、トップ／一覧ItemListは2ページ・564項目。公式導線は59モデル／57 URL／79 actions。GTM実IDは289 HTMLへ各1件、テストID0件。
- QA: `npm test` 57/57、価格283/283、画像3/3、Python16/16、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build289、release guard／構造化データPASS。独立リリース監査2件ともexact `02bf120`でPASS、registry 41 entities／397 surfaces／1,892 markers失敗0。ローカル／immutable／本体E2E各1/1（GA collect HTTP204）、本番サムネイル実測・主要URL200、未知URL404、IDN path/query301。
- 公式根拠: [SUBARUグレード一覧](https://www.subaru.jp/forester/grade/)、[装備表](https://www.subaru.jp/forester/specification/docs/equipment.pdf)、[安全性能](https://www.subaru.jp/forester/safety/)。
- 直前の正常配信・ロールバック候補: https://b8e0e573.jidouunten.pages.dev

## 最新の配信（2026-09-11 Mercedes-Benz GLC／C-Class Sedan追加）

- exact app release commit: `5fb3b70`（Mercedes追加 `4af6086`、依存レジストリ旧件数修正を含む）
- immutable: https://b8e0e573.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Mercedes-Benz GLC 5販売単位、C-Class Sedan 6販売単位を追加。全276販売単位（現行275、過去1）、価格744万円〜1,844万円（税込）。全11単位をLevel 2相当（ACC＋車線中央維持、ステアリング保持・常時監視、ハンズオフ不可）として比較できる。`catalogAsOf=2026-09`、価格適用日・販売単位の正確な発売日は一次情報に明示がないため未設定、注文可否は11単位とも未確認。
- 公式根拠: Mercedes-Benz Japanの価格表、GLC／C-Class Sedan公式ページ、MP202602装備表、安全ページ。価格11/11、公式URL7/7をHTTP200確認。公式ページ掲載は注文可能を意味しないため、販売店確認を促す表示を維持。
- SEO／公開面: 282 HTML、sitemap-0は281 URL、詳細276件にProduct＋Car＋BreadcrumbList、トップ／一覧ItemListは550項目。公式導線は58モデル／56 URL／76 actions。
- QA: `npm test` 56/56（価格276/276、注文可21／未確認254／現在利用不可1、画像3/3、Python16/16）、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build282、release guard／構造化データPASS。独立リリース監査はexact `5fb3b70`でPASS、immutable／本体E2E各1/1（GA collect HTTP204）。registryは40 entities／391 surfaces／1,859 markers、失敗0。
- 本番smoke: immutable／本体のトップ、一覧、GLC詳細、C-Class詳細、比較、sitemap-index、sitemap-0、robotsはHTTP200、未知URLは404。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301（query維持）。既存Wikimedia Commons参考写真3件の帰属リンク・WebP最適化を維持。
- 直前の正常配信・ロールバック候補: https://dc6031c0.jidouunten.pages.dev

## 最新の配信（2026-09-11 Wikimedia Commons参考写真パイロット）

- exact app release commit: `3ac0c48`
- immutable: https://dc6031c0.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 車両一覧・詳細へ、Toyota プリウス／Tesla Model 3／Tesla Model Yの参考写真を追加。写真は車両識別用で、掲載グレード・年式やADAS性能を示すものではない。Commonsのファイルページ、作者、ライセンス名をそれぞれ直接リンクし、CC0 1.0またはCC BY-SA 4.0の条件を記録した。画像はセルフホストWebP（幅1200px以下・各250KB以下）へ最適化し、未登録モデルは従来どおり写真なしのフォールバックとした。
- QA: `npm test` 55/55（価格265/265、公式導線56モデル／76 actions、Python16/16、画像3/3）、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build271、release guard／構造化データ検査PASS（BreadcrumbList271／Car265／ItemList2ページ528項目）。独立リリース監査PASS、ローカルE2E1/1・本番E2E1/1（GA collect HTTP204）。画像はCommons一次URL・ライセンスURL 3/3 HTTP200、一覧12/12・詳細画像／帰属リンクを実ブラウザで確認。
- 本番smoke: immutable／本体のトップ、一覧、Prius詳細、Tesla Model 3詳細、画像2件、sitemap-index、robotsはHTTP200、未知URLは404。`自動運転.jp`の既存path/query 301も維持。
- 直前の正常配信・ロールバック候補: https://a207ad82.jidouunten.pages.dev

## 最新の配信（2026-09-11 Toyota プリウスHEV販売単位拡張）

- exact app release commit: `31a6543`（実装本体 `1e0b7b3`、監査修正を含む）
- immutable: https://a207ad82.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 既存のHEV Z 2WDに、Z E-Four／G 2WD・E-Four／X 2WD・E-Fourを追加し、プリウスを6販売単位で比較可能にした。価格は税込279万6,200円〜425万1,500円。全車Level 2相当（全車速追従ACC＋LTA、ステアリング保持・常時監視が必要、ハンズオフ不可）。Xはトヨタ公式Webカタログの法人向けグレードとして注記し、PHEV／KINTO専用Uは今回の通常HEV価格比較から分離。個別の発売日は確認できないため6単位とも未確認としている。注文可否は全6単位`unknown`。
- SEO／公開面: 全271 HTMLにcanonical／robots／hreflang／OG/Twitter／WebSite＋WebPage。詳細265件にProduct＋Car＋BreadcrumbList、トップ／一覧に可視264件のItemList。sitemap-0は270 URL、構造化データはBreadcrumbList271／Car265／ItemList2ページ528項目。
- QA: `npm test` 54/54、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build271、release guard PASS、ローカルE2E1/1・本番E2E1/1（GA collect HTTP204）。公開面依存registry静的376面、Prius required selector可視12/12、Prius sitemap7/7、独立リリース監査PASS。
- 本番smoke: immutable／本体のトップ、一覧、Prius詳細3件、Prius比較、sitemap-index、sitemap-0、robotsはHTTP200、未知URLは404。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）の`/cars/?level=2&sort=price_asc`を本体へ301（query維持）。外部車両写真は今回も追加せず、Wikimedia Commons再利用ポリシーは`docs/licenses/assets.md`に保持。
- 直前の正常配信・ロールバック候補: https://e194ed52.jidouunten.pages.dev

## 最新の配信（2026-09-11 Lexus LX追加・構造化SEO）

- exact app release commit: `0ecae52`
- immutable: https://e194ed52.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Lexus LX700h／LX600のEXECUTIVE、5人／7人、OVERTRAIL+を計10販売単位で追加。全260販売単位（現行259）、税込1,450万〜2,100万円。全車Level 2相当で、全車速追従ACC・LTA、Advanced Driveの渋滞時0〜約40km/h条件、運転者監視必須を表示。LCA・自動車線変更は根拠がないため付与せず、受注可否は未確認を維持。
- SEO: 266 HTMLにcanonical／robots／hreflang／OG/Twitter、WebSite＋WebPage＋BreadcrumbListを出力。260詳細にProduct＋Car＋BreadcrumbList、トップ／一覧に可視259件のItemListを追加。構造化データ検査はBreadcrumbList266／Car260／ItemList2ページ518項目、内部enum・根拠フィールド漏れ0件。
- QA: `npm test` 54/54、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build266、release guard PASS、ローカル／immutable／本体E2E各1/1（GA collect HTTP204）。LX公式根拠・導線10件相当をHTTP200、registry静的surface14/14・required marker12/12・sitemap10/10、独立監査PASS。
- 本番smoke: immutable／本体で一覧、LX詳細、LX比較、sitemap-index、sitemap-0、robotsをHTTP200、未知URLを404。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）の`/cars/?level=2&sort=price_asc`を本体へ301（query維持）。
- 直前の正常配信・ロールバック候補: https://cf667796.jidouunten.pages.dev

## 最新の配信（2026-09-11 Toyota カローラ スポーツ／ツーリング追加）

- exact app release commit: `6687267`
- immutable: https://cf667796.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: カローラ スポーツ3単位、カローラ ツーリング6単位の計9販売単位を追加。全250販売単位（現行249）、税込244万7,500円〜339万3,500円。全車Level 2相当（追従走行＋車線中央維持）、ステアリング保持が必要でハンズオフ不可。同じLevel 2内の能力差を能力チェックボックスと比較で絞り込める。公式商品・グレード・安全性能・見積り導線を追加し、注文可否は未確認を維持。
- SEO: 詳細250ページのtitle／descriptionを販売単位単位で一意化し、canonical／robots／hreflang／OG/Twitter／Product＋BreadcrumbList JSON-LDを確認。sitemap-0は255 URL、公開HTMLの内部enum・根拠URL漏れ0件。
- QA: `npm test` 52/52、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build256、release guard PASS、ローカル／immutable／本体E2E各1/1（GA collect HTTP204）。カローラ公式根拠11/11 URL HTTP200、registry required selector5/5、独立監査PASS。
- 直前の正常配信・ロールバック候補: https://b4a74e7c.jidouunten.pages.dev

## 最新の配信（2026-09-11 Audi A5／A5 Avant追加・詳細SEO強化）

- exact app release commit: `e1ca12d`（E2E描画待ち補正 `05b9dd2`）
- immutable: https://b4a74e7c.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Audi A5／A5 AvantのTFSI 110kW、TFSI quattro 150kW、TDI quattro 150kWをセダン／Avant各3単位、計6販売単位で追加。税込617万〜760万円、TFSIの日本発売日2025-02-17、TDIの日本発売日2025-06-24、全車Level 2相当（追従走行・車線中央維持・車線変更支援、ハンズオフ不可）として比較できる。注文可否は一次情報不足のため未確認を維持し、Audi公式の見積り・ディーラー・試乗導線を追加。
- SEO: 現行240／全241販売単位。詳細ページのtitle／descriptionを販売単位（メーカー・車種・グレード・Level・価格・能力差）で一意化し、Product＋BreadcrumbList JSON-LDを追加。全247 HTMLでcanonical／robots／hreflang／OG/Twitter／WebSite＋WebPage JSON-LDを確認。sitemap-0は246 URL。
- QA: `npm test` 51/51、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build247、release guard PASS、ローカルE2E1/1、immutable／本体E2E各1/1（GA collect HTTP204）。Audi根拠6/6・公式導線4/4 HTTP応答、registry静的marker6/6・required selector5/5、公開HTML内部情報漏れ0件、独立監査PASS。
- 直前の正常配信・ロールバック候補: https://74a72192.jidouunten.pages.dev

## 最新の配信（2026-09-11 ヤリス クロス20販売単位追加）

## 最新の配信（2026-09-11 Toyota ヤリス17販売単位・Level 1対応・SEO整合）

- exact app: `6f995bb`（実装 `d709dcf`、SEOメタ整合を含む）
- immutable: https://74a72192.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: ヤリスの価格比較可能な17販売単位を追加（169万7,300円〜288万4,200円）。1.0L CVTの2単位をLevel 1（ACCのみ）、その他15単位をLevel 2（ACC＋LTA）、ハイブリッド6単位を渋滞時支援として比較可能にした。Level 1の絞り込みを有効化し、KINTO月額のみのU 2単位は価格比較から保留。
- SEO／導線: トップ・一覧のtitle／descriptionをLevel 1/2表記へ更新。canonical／robots／hreflang／OG/Twitter／WebSite＋WebPage JSON-LD、公式見積り導線、sitemap240 URLを維持。
- QA: Vitest50/50、価格235/235（現行234/234、exact219／range15／未確認1）、公式導線51モデル／50 URL／64 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build241、release guard PASS、ローカル／immutable／production E2E各1/1（GA collect HTTP204）、Yaris source／見積りURL HTTP200、registry静的marker／required selector PASS、公開HTML内部情報漏れ0件、主要URL HTTP200、IDN path/query301、独立候補監査PASS。
- 直前の正常配信・ロールバック候補: https://01434fd9.jidouunten.pages.dev

- exact app: `95b31d5`（実装 `c4b401d`、依存レジストリmarker更新を含む）
- immutable: https://01434fd9.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: トヨタ ヤリス クロスの現行20販売単位（Z“Adventure”／Z／G／X／U／GR SPORT、ハイブリッド・ガソリン、2WD／E-Four）を追加。全218販売単位（現行217、過去1）、価格212万6,300円〜335万5,000円、全車Level 2相当・ハンズオフ不可・ACC／車線中央維持／渋滞時支援で比較可能にした。注文可否は根拠不足のため20単位とも未確認を維持。
- SEO／導線: ヤリス クロスの公式商品・見積り導線を追加。title／descriptionの現行217件、sitemap223 URL、既存のrobots／canonical／hreflang／OG/Twitter／WebSite＋WebPage JSON-LDを維持。
- QA: Vitest49/49、価格218/218（現行217/217、exact202／range15／未確認1）、公式導線50モデル／49 URL／63 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build224、release guard PASS、ローカル／immutable／production E2E各1/1（GA collect HTTP204）、ヤリス クロス代表詳細・比較・公式URL／見積りURL HTTP200、registry静的marker339面・Yaris required selector4/4、公開HTML内部enum・内部日付キー漏れ0件、主要URL HTTP200、IDN path/query 301、独立候補監査PASS。
- 直前の正常配信・ロールバック候補: https://df93d984.jidouunten.pages.dev

## 最新の配信（2026-09-11 価格メタデータ補正）

- exact app: `6483639`（Lexus GX550 2販売単位で、一次資料に明示のない価格適用日を推定せず`priceEffectiveAt`を未設定へ補正）
- immutable: https://df93d984.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 公開表示・SEO・サイトマップの内容は直前配信から不変。GX550は価格と2026年9月のカタログ確認月を表示し、日付の推定値は表示しない。
- QA: Vitest48/48、価格198/198（現行197/197）、公式導線49モデル／62 actions、Astro check 0 errors / 0 warnings / 6 hints、実ID build204、release guard PASS、immutable・production E2E各1/1（GA collect HTTP204）、GX550詳細2/2、主要URL HTTP200、IDN path/query 301、独立候補監査PASS。
- 直前の正常配信・ロールバック候補: https://7626aae0.jidouunten.pages.dev

## 最新の配信（2026-09-11 候補拡充・SEO／一覧改善）

- exact app: `90a7f7db13eae274b7de246fb9960578d3dd5ecc`
- immutable: https://7626aae0.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Volkswagen Tiguan 6、Lexus GX550 2、Toyota ランドクルーザー250 1の計9販売単位を追加。全198販売単位（現行197、過去1）を、Level 2相当・ACC／車線維持・ステアリング保持・価格で比較可能にした。注文可否は一次根拠がないため9単位とも未確認を維持。
- SEO／UI: 一覧トップの用途ガイドを全幅・中央基準へ修正、0件の能力カードを非表示、発売日不明カードは確認月フォールバックまたは項目省略。title／description、robots、canonical、hreflang、OG/Twitter、WebSite＋WebPage JSON-LDを各静的ページへ出力。
- QA: Vitest48/48、価格198/198（現行197/197）、公式導線49モデル／62 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build204、release guard、ローカルE2E1/1、immutable・production E2E各1/1（GA collect HTTP204）、registry333/333、公開HTML内部enum・内部日付キー漏れ0件。主要URL HTTP200、IDN path/query 301を確認。
- 直前の正常配信・ロールバック候補: https://36c737f6.jidouunten.pages.dev

## 最新の配信（2026-09-11 注文状態の一次情報更新）

- exact app: `d75ecee`（メーカー一次情報を再確認し、Volvo EX30 3グレードとヒョンデ IONIQ 5 Voyage／Lounge 2グレードを新車注文可へ更新。SUBARU レイバックとLexus LMは注文後の工場出荷目処のみのため注文可否未確認を維持。注文可否チェッカー・研究台帳・依存レジストリを同期）
- immutable: https://9d34dc08.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 全189販売単位（現行188、過去1）の注文状態を注文可21／注文可否未確認167／現在利用不可1へ更新。Volvo EX30は公式オンライン契約、ヒョンデ IONIQ 5 Voyage／Loungeは公式在庫車両の「車両注文」導線を根拠とする。各仕様・在庫・納期・契約成立は保証せず、詳細に注意書きを表示する。自動運転タクシー領域は後続Issue #38で実装予定。
- QA: Vitest46/46、価格189/189（現行188/188）、公式導線46モデル/62 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build195、リリースガード（実ID1件/HTML・テストID0件）、ローカルE2E1/1、immutable・production E2E各1/1（GA collect HTTP204）、公開面依存レジストリ321/321、公開HTML内部enum・source/accessedAt等の漏れ0件。
- immutable／本体で主要10 URL（`/`、`/cars/`、Volvo詳細、Hyundai詳細、SUBARU詳細、Lexus LM詳細、`/levels/`、sitemap-index、sitemap-0、robots）をHTTP200確認。`sitemap-0.xml`は194 URL。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301で維持される。直前の正常配信・ロールバック候補は https://4f0e10ee.jidouunten.pages.dev。

## 最新の配信（2026-09-11 Toyota アクア／カローラ）

- exact app: `527f4f7`（Toyota アクア9／カローラ6の現行15販売単位、販売状態クイック絞り込み、公開面依存レジストリ更新）
- immutable: https://4f0e10ee.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Toyota アクア（Z／G／X／U・GR SPORT）9単位とカローラ（HYBRID W×B／G／X）6単位を追加。価格・駆動方式・Level 2相当のACC／LTA・ステアリング保持条件を販売単位で比較できる。公式見積り導線は追加したが、注文可否は15単位とも未確認のまま表示する。一覧操作盤から「新車注文可16／注文可否 未確認172／現在利用不可1」をクリックして絞り込める。
- QA: Vitest45/45、価格189/189（現行188/188）、公式導線46モデル/62 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build195、ローカルE2E1/1、immutable・production E2E各1/1（GA collect HTTP204）、公開面依存レジストリ316/316、独立Lunaリリース監査PASS
- immutable／本体でHTTP 200を確認（`/`、`/cars/`、アクア詳細・カローラ詳細、Toyota 2台比較、`/levels/`、`/sitemap-index.xml`、`/sitemap-0.xml`、`/robots.txt`）。`sitemap-0.xml`は194 URL。公開HTMLの内部enum・source/accessedAt等の漏れは0件。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301で維持される。直前の正常配信は https://021157cb.jidouunten.pages.dev（途中の実ID再配信前URL https://6c520966.jidouunten.pages.dev はロールバック対象にしない）。

## 最新の配信（2026-09-11 日産アリアB6）

- exact app: `c6a429b`（日産アリアB6の注文状態確認、公開HTMLの内部enum除去）
- immutable: https://021157cb.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 日産アリアのB6／B6 e-4ORCE／B9／B9 e-4ORCEを4販売単位で保持し、現行ページの「日産各店で注文できるB6」「11/26より注文受付中」を根拠にB6だけを新車注文可として表示。B6の参考価格は6,675,900円。残り3単位は注文可否未確認のままにし、在庫・納期・契約成立を保証しない。公式サイト・試乗・販売店・見積り・カタログの既存導線は維持し、注文確定を示すCTAは追加していない。
- QA: Vitest45/45、価格174/174（現行173/173）、公式導線44モデル/60 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build180、ローカルE2E1/1、immutable・production E2E各1/1（GA collect HTTP204）、公開面依存レジストリ648/648、独立Luna監査PASS
- immutable／本体でHTTP 200を確認（`/`、`/cars/`、アリアB6詳細・比較、`/levels/`、`/sitemap-index.xml`、`/sitemap-0.xml`、`/robots.txt`）。公開HTMLの内部enum・source/accessedAt等の漏れは0件。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301で維持される。`sitemap-0.xml`は179 URL。直前rollback: https://2897334d.jidouunten.pages.dev

## 2026-09-11 Mitsubishi OUTLANDER PHEV

- exact app: `c367aa4`（Mitsubishi OUTLANDER PHEVの現行9販売単位を追加）
- immutable: https://2897334d.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 三菱アウトランダーPHEVのBLACK Edition／P Executive Package／P／G／Mを、5・7人乗りと価格差を含む9販売単位で追加。全車Level 2のMI-PILOT（ACC＋車線維持支援）として比較できる。LCAは車線変更支援ではなく死角の車両への注意喚起・衝突回避支援のため、車線変更支援タグには含めない。ステアリング保持が必要で、ドライバーモニター作動は未確認。購入導線は公式の9グレード選択入口であり、在庫・納期・契約確定を保証しない。
- QA: Vitest44/44、価格174/174（現行173/173）、公式導線44モデル/60 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build180、ローカル・immutable・production E2E各1/1、公開面依存レジストリ640/640、独立価値監査PASS
- immutable／本体でHTTP 200を確認（`/`、`/cars/`、Mitsubishi詳細・比較、`/sitemap-index.xml`、`/sitemap-0.xml`、`/robots.txt`）。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301で維持される。`sitemap-0.xml`は179 URL。直前rollback: https://d45dbac4.jidouunten.pages.dev

- exact app: `681d6939540642953e88af4edd69cd29af70eb0e`（BYD DOLPHIN／ATTO 3／SEAL／SEALION 6の7販売単位を追加）
- immutable: https://d45dbac4.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: BYDの現行7販売単位を追加。DOLPHIN Baseline／Long Range、ATTO 3、SEAL RWD／AWD、SEALION 6 FWD／AWDをLevel 2として価格・駆動・定員・能力差で比較できる。DOLPHIN／ATTO 3は車線変更支援（ウインカー操作を合図とする車線変更時の補助）、SEALはドライバー監視を含むが、いずれもハンズオフ不可。新車注文可否・在庫は未確認のまま表示し、カタログ掲載や見積り導線だけで受注可能とは表示しない。
- QA: Vitest43/43、価格165/165（現行164/164）、公式導線43モデル/55 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build171、ローカル・immutable・production E2E各1/1、公開面依存レジストリ331/331、独立価値監査PASS
- immutable／本体でHTTP 200を確認（`/`、BYD詳細、BYD比較、`/sitemap-index.xml`、`/sitemap-0.xml`、`/robots.txt`）。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301で維持される。`sitemap-0.xml`は170 URL。直前rollback: https://4c2f96d7.jidouunten.pages.dev

- exact app: `16567f05acc1a3bd7145c5e225abd7c0c91407b4`（Hyundai IONIQ 5 4販売単位を追加、Volvo根拠表の配置を修正）
- immutable: https://4c2f96d7.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 現行157販売単位（全158件）へHyundai IONIQ 5のVoyage L／Voyage／Lounge／Lounge AWDを追加。Voyage LはHDA、他3グレードはHDA2（車線変更アシスト付）として同じLevel 2内の差をAND絞り込み・比較できる。新車注文可否とHDA速度数値は未確認のまま表示し、価格だけで受注可能とは表示しない。
- QA: Vitest42/42、価格158/158（現行157/157）、公式導線39モデル/43 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build164、ローカル・immutable・production E2E各1/1、公開面依存レジストリ315/315、独立価値監査PASS
- immutable／本体でHTTP 200を確認（`/`、`/sitemap-index.xml`、`/sitemap-0.xml`、`/robots.txt`、Hyundai詳細、Hyundai比較）。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301で維持される。直前rollback: https://4a8c18d3.jidouunten.pages.dev

- exact app: `907b7a556b4195634e38dbc4f4271c9eccfd3cc5`（前段 `da4170a`）
- immutable: https://4a8c18d3.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Level 2用途ガイド・能力チェックボックスANDに加え、Volvo EX30のモデル単位オンライン注文導線を参考表示。2027年各グレードの受注・在庫条件は未確認のまま表示し、注文可能と誤認させない。
- QA: npm test 41/41、価格154/154、公式導線38モデル/40 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build160、Chrome E2E local/immutable/production各1/1、独立価値監査PASS
- productionとimmutableはともにHTTP 200。固定URLと本体でAND条件、保存→再開、ガイド、異常URL、390/1280px横overflowを実ブラウザ確認。

## 配信方式

- Project: `jidouunten` / production branch: `main`
- Pages URL: `https://jidouunten.pages.dev`
- 本体: `https://jidouunten.jp`
- 日本語入口: `https://自動運転.jp` → 本体へ301、path/query維持
- Build: Astro static、出力 `dist/`
- 初回は認証済みWrangler OAuthによるDirect Upload。GitHub pushのみでは配信されない。

GitHub Appの追加認証待ちを避けて初回公開するため、この方式を採用。
Direct UploadからGit integrationへの同一project内切替は不可。
自動化はGitHub Actions + Wrangler + このproject専用の最小権限tokenで構築できる。
その設定が済むまでは手動配信と明示する。

仕様: [Cloudflare Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)

## 継続承認と配信gate

2026-09-10のオーナー指示「監査PASSしたらどんどんdeployしてよ」を、このPJの継続承認として扱う。
次の全条件を満たすexact candidateは、変更ごとの追加確認を待たず `main` へpushし、既存Pages projectへ配信する。

- worktreeがcleanで、候補commitと対象Issueを固定済み
- `npm test`、`npm run check`、実IDbuild、実ブラウザE2EがPASS
- desktop/mobileの一覧・主要操作・非対象を確認済み
- 実装者と別contextの独立監査が `VERDICT: PASS`
- Production target `jidouunten` と直前正常deployment、rollback先を固定済み

監査後のsource変更、gate失敗、target不一致、rollback不明は停止する。DNS、Secret、課金、削除、別targetは
この継続承認に含めず、都度確認する。

## 配信手順

1. `npm ci`、`npm test`、`npm run check`を実行する。
2. `.env.example`と計測運用に従い公開IDを設定して `npm run build`。配信前に `npm run check:release` を実行し、テスト計測IDを含むdistを止める。
3. `npm run preview`でクエリ復元・2台比較・GTM通常読み込み・同意バナー非表示・モバイルを確認。
4. 対象差分をcommit/pushし、次を実行する。

```bash
npx wrangler@4.121.0 pages deploy dist --project-name jidouunten --branch main
```

5. deployment URL、commit SHA、本体HTTPS、sitemap、robots、404、日本語domainのpath/queryを確認し、Issueへ証拠を記録。

## Rollback

2回目以降はCloudflare Pages dashboardのproduction deployment履歴から、直前の正常deploymentをrollback対象に選ぶ。
初回には過去deploymentがない。初回障害時は修正buildを再配信するか、公開停止の判断をユーザーへ確認する。
DB migration・ユーザー保存データはない。DNSの所有権確認TXTはrollbackで削除しない。

## 未完の運用

- GitHub Actions自動配信とPR preview
- 初回公開後の検索・コンバージョン実測（28日またはselector開始100セッションを初回評価の目安）

現行状態・担当・完了判定の正本はGitHub Issue/Project。

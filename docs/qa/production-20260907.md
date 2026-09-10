# 初回公開の実測証拠

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

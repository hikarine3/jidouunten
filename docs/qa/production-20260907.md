# 初回公開の実測証拠

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

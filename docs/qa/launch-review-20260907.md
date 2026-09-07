# 初回公開 独立ローンチレビュー（2026-09-07）

対象は現在の作業ツリー。実装・データ・設定は変更せず、報告済み指摘の修正と既存QA証跡だけを再確認した。

## Verdict

**PASS（コード／静的公開候補）**。本番公開後のGA4実イベント受信、GSC/Bing sitemap取得、Cloudflare production smokeは未実施であり、公開完了とは扱わない（`docs/operations/measurement.md:78-82`）。

## 修正確認

- **計測ID・同意:** `PUBLIC_GTM_ID=GTM-PV9QVMJV` / `PUBLIC_GA_ID=G-Q58GM7BVB6` が `.env.example:1-2` と計測正本 `docs/operations/measurement.md:9-10,62,72` で一致。GTMは同意後だけ動的読込（`src/components/ConsentBanner.astro:16-24,30-34`）、イベントpushも granted 限定（同:37-40）、撤回はGA disable設定・localStorage削除・再選択（同:42-45）。詳細表示の初期inline実行は同意状態を確認し、必要時だけpending queueへ入れ、ConsentBannerが同意後にdrainする（`src/pages/cars/[id].astro:23-30`, `src/components/ConsentBanner.astro:30-33,38-40`）。
- **既定カタログ:** 未確認の `currentCatalogListed` を掲載扱いしない判定が純関数・HTML初期状態・client filterで一致（`src/data/loader.ts:41-43,141`, `src/pages/cars/index.astro:7,23,40-41`）。現データは9件中8件が現行掲載、LEGEND 1件が非掲載・unavailable（`src/data/vehicles.json:501-506`）。
- **URL復元／比較:** filter submitはqueryを更新し、popstateで再適用（`src/pages/cars/index.astro:31-57`）。比較はqueryの最大2 IDを復元し、同一軸（Level、道路、速度、ハンズオフ、監視、装備、販売状態）を出す（`src/pages/compare/index.astro:20-36`）。
- **安全表現・根拠:** Level 2は運転支援・常時監視、Level 3はODD内のシステム運転と引継ぎを表示（`src/data/loader.ts:188-193`, `src/pages/cars/[id].astro:12,17`）。分類根拠と「メーカー認証・安全保証ではない」注意を詳細へ表示（同:17）。発行元、URL、確認日、対象事実は車両レコードと内部台帳に保持し、通常UIには表示しない。
- **構造化データ:** 共通 `WebPage` JSON-LDを全ページへ生成（`src/layouts/Layout.astro:6-14,27`）。
- **権利・アクセシビリティ:** 外部画像・ロゴ・フォントなし、自作CSSと依存ライセンスを台帳化（`docs/licenses/assets.md:3-16`）。`lang="ja"`、ナビゲーションラベル、フォームのネイティブラベル、装飾イラストの代替ラベルを確認（`src/layouts/Layout.astro:17,34`, `src/pages/index.astro:14`）。

## 既存実行証跡

- `npm test`: 1 test file / 3 tests中3件正常（`tests/vehicles.test.ts:13-33`）。
- `npm run check`: 16ファイル、0 errors（3 hintsのみ）。
- `npm run build`: 15ページ生成成功。既存E2Eは9 checks PASS（親統合レーン提供証跡）。
- 依存監査: Astro `7.3.1`（`package.json:16`, `package-lock.json:2921-2922`）、production dependency auditは0 vulnerabilities（親統合レーン提供証跡）。

## 公開前境界

上記PASSはローカルのコード・生成候補に対するもの。本番のGA4受信、GSC/Bing sitemap送信・取得、production domain smokeは、計測運用の未完了境界に従い別途記録する（`docs/operations/measurement.md:69-82`）。

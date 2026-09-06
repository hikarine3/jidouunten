# 一覧トップへの修正 QA

対象: [JID-009](https://github.com/hikarine3/jidouunten/issues/9)。2026-09-07 JST。
実装者: Luna。独立レビュー・公開確認: 親統合担当（実装ソースは編集しない）。

## 変更範囲

- `/` のLPを削除し、一覧・絞り込み・2台比較を直接操作できる画面へ変更。
- `/cars/` は共有一覧コンポーネントを利用して互換性を保持。
- 車両詳細の戻るリンク、比較の一覧リンク、共通ナビをトップへ統一。
- 車両データ、同意処理、GTM/GA4の外部設定、DNS、依存ライブラリは変更しない。
- 写真・メーカーのロゴ・外部素材の追加は0件。今回の表示変更で画像転載は行わない。

## レビュー指摘と受入

初回画面レビューで以下を指摘。修正後の再確認を公開ゲートとする。

1. スマホ初期画面で同意バナーより上に車名が見えない: 見出し・説明・余白を圧縮。
2. デスクトップの詳細リンクが改行する: カード操作行の整理。
3. 絞り込みで選択車が隠れると比較選択を解除できない: 非表示車両の選択解除。
4. 詳細リンクの改行防止後、390pxでscrollWidth=396、768pxで845となる横はみ出しを親ブラウザで検出。
   カード操作行を折り返せる構造にし、390/520/768/1280pxの横幅回帰検査を追加。

## 証拠

最終候補を親が独立確認し、上記4指摘の修正を確認して公開候補PASS。

- `src/pages/index.astro:6` / `src/pages/cars/index.astro:6`: 共有一覧を各ルートのactionで使用。
- `src/components/VehicleList.astro:23`: 4条件のフォーム、URL・popstate・空結果・リセット。
- 同ファイル53行以降: 最大2台、非表示選択解除、比較URLを生成。
- `src/components/VehicleCard.astro:9`: モデル年・グレード、受注不明、監視・道路、詳細導線を確認。
- 親が390px/1280px画像を目視。スマホ初期カード上端446.27px、同意バナーより上に車名・条件を表示。
- `npm test`: 1 test file、4/4テストPASS。
- `npm run check`: 17 files、0 errors / 0 warnings / 5 inline-script hints。
- 本番GTM/GA公開IDを明示して `npm run build`: 15ページ生成。
- `EXPECT_GA_COLLECT=1 node tests/e2e-preview.mjs`: ローカル最終候補1/1シナリオPASS。
  既定8件・全9件・L2高速ハンズオフ7件、履歴/空結果/リセット、2台比較、3台目不可、非表示選択解除、
  詳細、同意/拒否/撤回、5イベントのdataLayer、GA collect 204を確認。
- 390/520/768/1280pxの4/4幅でdocument.scrollWidthがviewport以下。
- outboundイベントの既存テストは遷移を抑止して発火のみを検証。メーカー外部ページの表示保証とはしない。
  一覧フィルター・比較・詳細の主要遷移は実際のブラウザ操作で確認。
- `git diff --check`: PASS。車両正本、ConsentBanner、package-lockへの差分0件。

スクリーンショットはignored `.cache/list-home/`。利用効果や個別イベントのGA管理画面集計を達成したとは扱わない。

## 公開

- 配信ソース: `513d01cbfd5a24a834443446c3df15d2ae40c47a`、GitHub mainへpush済み。
- 本体: https://jidouunten.jp/ 。固定配信版: https://db94de6b.jidouunten.pages.dev/ 。
- 既存Pages project `jidouunten` / mainへ19 assets中16件upload、3件再利用、配信完了。
- 本体と固定配信版の両方で `EXPECT_GA_COLLECT=1` のE2Eを再実行し各1/1シナリオPASS。
  本番GTM、正しいGA測定IDへのcollect 204を確認。上記4幅、件数、比較、同意回帰を含む。
- 本体のdesktop/mobileスクリーンショットを親が再確認。
- `/`, `/cars/`, `/compare/`, sitemap-index/0 の5/5リクエスト200、sitemap掲載14/14 URLが200。
- root canonicalは `https://jidouunten.jp/`、LP heroなし、一覧DOMあり。
- 日本語apex/wwwの2/2入口で `/?level=3&availability=all` が本体の同じpath/queryへ301。
- rollback先は変更前の `9a7ea6df-db5a-4405-a06e-fddd0942d9a0`。
- 配信確認後のこの文書追記はアプリ生成物を変えないため、文書commitのみで重複deployしない。

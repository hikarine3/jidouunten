# 初回公開の素材と依存

確認日: 2026-09-07。車両の写真、メーカーのロゴ、外部フォントは使用しない。

| 素材 | 取得元・作者 | 許諾・扱い | 商用 / 改変 / 表示 |
|---|---|---|---|
| 画面、文章、CSSによる道路・車の装飾 | 本PJで作成 | 自社作成。既存サイトの表現・レイアウトを複製しない | 可 / 可 / 外部credit不要 |
| `public/og.png` | OpenAI ImageGenで2026-09-10に本PJ向け生成 | 本PJの指示による独自生成。外部写真・車両画像・ロゴ・商標素材・外部フォントを入力に使用していない | 本PJで利用・改変可 / 外部credit不要 |
| 車両仕様の事実 | src/data/vehicles.json内sources | 公式の事実を独自要約。画像・原文転載なし。出典URLと確認日は内部管理 | データ事実のみ利用、公式テキストの再利用許諾を主張しない |
| レベル定義 | 国土交通省、docs/research/official-sources.md | 定義の独自要約、出典リンク | 原文・図表転載なし |
| Astro 7.3.1 | https://github.com/withastro/astro | MIT、node_modules/astro/LICENSE本文確認 | 可 / 可 / 配布に含まれるライセンス通知を保持 |
| @astrojs/sitemap 3.7.4 | https://github.com/withastro/astro/tree/main/packages/integrations/sitemap | MIT、package LICENSE確認 | 可 / 可 / 同上 |
| TypeScript 5.9.3 | https://github.com/microsoft/TypeScript | Apache-2.0、LICENSE.txt確認（開発用） | 可 / 可 / ライセンス通知を保持 |
| Vitest / @types/node | 各package.jsonとLICENSE | MIT（開発・試験用、サイト配信対象外） | npm配布物内の通知を保持 |

実際の依存バージョンはpackage-lock.jsonを正本とする。車両データの出典検証は
vehicle validationとブラウザで行い、公開前の独立レビューで表現・引用・未登録素材を確認する。

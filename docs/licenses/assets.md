# 初回公開の素材と依存

確認日: 2026-09-11。車種識別用に、Wikimedia Commonsでファイル単位のライセンスを確認した参考写真を3モデルへ追加した。メーカーのロゴ・外部フォントは使用しない。

| 素材 | 取得元・作者 | 許諾・扱い | 商用 / 改変 / 表示 |
|---|---|---|---|
| 画面、文章、CSSによる道路・車の装飾 | 本PJで作成 | 自社作成。既存サイトの表現・レイアウトを複製しない | 可 / 可 / 外部credit不要 |
| `public/og.png` | OpenAI ImageGenで2026-09-10に本PJ向け生成 | 本PJの指示による独自生成。外部写真・車両画像・ロゴ・商標素材・外部フォントを入力に使用していない | 本PJで利用・改変可 / 外部credit不要 |
| `public/vehicles/toyota-prius.webp` | [2023 Toyota Prius Z HEV](https://commons.wikimedia.org/wiki/File:2023_Toyota_Prius_Z_HEV.jpg) / TTTNIS | CC0 1.0。原寸から幅1200pxのWebPへ変換。車種識別用の参考写真で、掲載グレード・年式との一致を保証しない | 可 / 可 / CC0表示（出典リンク） |
| `public/vehicles/tesla-model-3.webp` | [Tesla Model 3 Front View](https://commons.wikimedia.org/wiki/File:Tesla_Model_3_Front_View.jpg) / Ominae | CC BY-SA 4.0。原寸から幅1200pxのWebPへ変換。車種識別用の参考写真で、掲載グレード・年式との一致を保証しない | 可 / 可（同一ライセンス） / 作者・ライセンス表示 |
| `public/vehicles/tesla-model-y.webp` | [Tesla Model Y](https://commons.wikimedia.org/wiki/File:Tesla_Model_Y.jpg) / Lekhaki | CC BY-SA 4.0。原寸から幅1200pxのWebPへ変換。車種識別用の参考写真で、掲載グレード・年式との一致を保証しない | 可 / 可（同一ライセンス） / 作者・ライセンス表示 |
| 車両仕様の事実 | src/data/vehicles.json内sources | 公式の事実を独自要約。画像・原文転載なし。出典URLと確認日は内部管理 | データ事実のみ利用、公式テキストの再利用許諾を主張しない |
| レベル定義 | 国土交通省、docs/research/official-sources.md | 定義の独自要約、出典リンク | 原文・図表転載なし |
| Astro 7.3.1 | https://github.com/withastro/astro | MIT、node_modules/astro/LICENSE本文確認 | 可 / 可 / 配布に含まれるライセンス通知を保持 |
| @astrojs/sitemap 3.7.4 | https://github.com/withastro/astro/tree/main/packages/integrations/sitemap | MIT、package LICENSE確認 | 可 / 可 / 同上 |
| TypeScript 5.9.3 | https://github.com/microsoft/TypeScript | Apache-2.0、LICENSE.txt確認（開発用） | 可 / 可 / ライセンス通知を保持 |
| Vitest / @types/node | 各package.jsonとLICENSE | MIT（開発・試験用、サイト配信対象外） | npm配布物内の通知を保持 |

実際の依存バージョンはpackage-lock.jsonを正本とする。車両データの出典検証は
vehicle validationとブラウザで行い、公開前の独立レビューで表現・引用・未登録素材を確認する。

## 外部車両画像を追加する場合

Wikipediaの記事画像を直接「Wikipediaの画像」として扱わず、画像をクリックして遷移する
[Wikimedia Commonsのファイル説明ページ](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)を一枚ずつ確認する。
作者、ファイルURL、ライセンス、改変の有無を記録し、CC BYなら作者・ライセンスリンクを表示、
CC BY-SAなら同ライセンス条件を維持する。CC BY-NC／CC BY-NDやライセンス不明、メーカー公式写真、
ロゴ・人物・ナンバープレートを含む素材は、別途許諾と商標・肖像・プライバシー確認がない限り採用しない。
採用時は原寸を配信せず、幅1200px以下・250KB以下を目安にWebPへ最適化してセルフホストし、画像キャプションから作者・元ファイル・ライセンスへリンクする。
画像は「車種識別用の参考写真」と明示し、掲載グレード・年式や運転支援機能の根拠には使わない。現在の登録はプリウス、Tesla Model 3、Tesla Model Yのみで、未登録モデルは従来の写真なし表示を維持する。

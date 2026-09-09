# メーカー公式導線の到達性監査

確認日: 2026-09-10

`src/data/official-links.json` の20モデル・19ユニークURLを、各メーカーの日本向け商品ページまたは
過去車両の公式アーカイブに限定して確認した。全77販売単位に `maker + model` で解決でき、
現行76件は `product`、現在利用不可のHonda LEGEND 1件だけは `archive` とした。

## 到達性

- 18 URL: redirect追従後 HTTP 200
- Renault ARKANA 1 URL: 自動HTTP clientは403（bot対策）だが、通常のChromeで
  `Renault Japon | ルノー アルカナ` の商品ページ、対象4グレード、運転支援欄を表示確認
- リンク切れ、メーカートップへの代替、別車種への誤遷移: 0

公開UIでは確認日を表示せず、詳細と比較の判断材料の後にのみ配置する。注文可否が未確認の車両では
「新車注文できることを示すリンクではない」と明記する。過去車両には見積・注文の表現を使わない。

## 回帰gate

`npm test` の `scripts/check_official_links.mjs` で、モデルキー重複、HTTPS、種別、全販売単位への解決、
現行/過去の種別不整合をreleaseごとに検査する。実URLの到達性は鮮度監査時に再確認する。

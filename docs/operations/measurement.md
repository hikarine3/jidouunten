# 計測・検索登録

更新: 2026-09-07

## 専用resource

| サービス | resource | 状態 |
|---|---|---|
| Google Analytics 4 | account `1st` / property `jidouunten.jp` (`552960231`) / web stream `https://jidouunten.jp` / `G-Q58GM7BVB6` | 日本時間・JPY、拡張計測有効 |
| Google Tag Manager | web container `jidouunten.jp` / `GTM-PV9QVMJV` | version 7公開済み |
| Google Search Console | domain property `sc-domain:jidouunten.jp` | DNS TXT確認済み、sitemap取得成功 |
| Bing Webmaster Tools | `https://jidouunten.jp/` | DNS CNAME確認済み、sitemap送信済み・処理中 |

他サイトの既存resource、タグ、権限は変更していない。GSCの所有権維持に使うDNS TXTは削除しない。
初回に別ブラウザprofileで作ったGA4/GSC/Bingの同名resourceは削除せず残置しているが、公開GTMからは
送信しない。誤作成resourceの識別情報はcommit対象外の`.cache`に記録する。

## dataLayer契約

ページ側は、個人情報や自由入力値を含めず、次の形で送る。`vehicle_id` はGit管理データの安定ID、
`vehicle_ids` は安定IDを区切った文字列とする。

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ event: "select_level", level: "2" });
window.dataLayer.push({
  event: "filter_results",
  filter_name: "hands_off",
  filter_value: "true",
  result_count: 3,
});
window.dataLayer.push({
  event: "compare_vehicles",
  vehicle_ids: "vehicle-a,vehicle-b",
  vehicle_count: 2,
});
window.dataLayer.push({
  event: "view_vehicle",
  vehicle_id: "vehicle-a",
  model_year: "2026",
  grade: "grade-a",
});
window.dataLayer.push({
  event: "outbound_manufacturer",
  vehicle_id: "vehicle-a",
  manufacturer: "maker-a",
  link_url: "https://example.invalid/official",
  link_domain: "example.invalid",
  link_type: "product",
  placement: "vehicle_detail",
});
```

`filter_results` は、初期表示や同じ値の再選択ではなく、利用者の操作で結果集合が変わった時だけ送る。
`view_vehicle` は詳細画面表示時に1回、`outbound_manufacturer` は公式リンク遷移直前に送る。
`link_type` は `product` / `archive`、`placement` は `vehicle_detail` / `comparison` とし、
メーカー公式の商品情報と過去資料を区別する。見積・試乗導線は実装時に別種別を追加する。

## GTM設定

`scripts/setup_measurement.py` は、同じ会社アカウント内の既存参照コンテナから対象アカウントを特定し、
`jidouunten.jp` 専用コンテナだけを冪等に設定する。OAuth tokenは隣接repoから読み、コピーも出力もしない。

```bash
python3 scripts/setup_measurement.py --create-container
python3 scripts/setup_measurement.py --measurement-id G-Q58GM7BVB6 --publish
```

公開version 7にはGoogle tag、5個のCustom Event trigger、対応する5個のネイティブGA4 Event tag、
14個のdataLayer variableがある。初期版のCustom HTML event tagは同名イベントをdataLayerへ再投入する
構成だったため停止・除去した。API取得した公開版で、ネイティブevent tag 5個（pause 0）、HTML tag 0個、
正しい測定ID6箇所、旧ID0箇所、compiler errorなしを確認済み。再実行時は同名resourceを再作成せず、
workspaceに差分がなければpublishしない。

## 読み込み方針

GTM/GA4は通常読み込みとし、初回表示を遮る同意・拒否バナーは置かない。独自イベントには個人情報や
自由入力値を含めない。計測内容とGoogleのプライバシーポリシー、Google Analyticsオプトアウト
アドオン、ブラウザ側のCookie・トラッキング防止設定を`/privacy/`で案内する。

## 公開後QA

1. 全ページで同意・拒否バナーが表示されないことを確認する。
2. GTM scriptが1つだけ追加され、IDが `GTM-PV9QVMJV` であることを確認する。
3. ブラウザのnetworkで `G-Q58GM7BVB6` 宛ての`collect`を確認し、別にGA4 Realtimeまたは
   DebugViewで受信を確認する。
4. 5操作を各1回実施し、イベント名と上記parameterを確認する。
5. 自動離脱クリックと `outbound_manufacturer` を混同せず、独自KPIは後者で集計する。
6. GSCとBingへ `/sitemap-index.xml` を送信し、取得成功を確認する。

GA4/GSCはresource作成直後にデータがないのが正常。公開・実イベント受信前に「計測正常」とは判定しない。

2026-09-07の初回公開後、トップと`/sitemap-index.xml`がHTTP 200、GSCが同sitemapを
「成功しました」と取得したことを確認した。Bingも同URLを正常に受理し、現在は処理中である。

公開version 7反映後の初回本番QAでは、当時の同意方式で同意前のGTM/GA4通信0件、5イベントのdataLayer投入、
正しい測定ID宛て`collect` HTTP 204、本番とimmutable deploymentのE2E各9件正常を確認した。
GA4 Realtimeでもactive user 1、正しいページタイトルと`page_view`を確認し、本番からの受信を
分けて確認した。ただし、5イベントそれぞれの`collect`受理まではこのQAで断定しない。

## 初回QAデータの除外

初期のCustom HTML tagによる再帰イベントが発生し、Realtimeで`select_level` 780件、
`filter_results` 637件を観測した。30秒後に前者は780件のまま、後者は897件に更新された。
これらは実利用ではなく、旧タグとQA操作による異常値である。Realtimeには取得・集計遅延があり、
旧タグを読み込んだQAタブが公開更新後も送信し続ける可能性もある。この短時間比較だけで
version 7の継続ループとは判定しない。現行公開版にはイベントを再投入するHTML tagがなく、
反映後のfreshタブによるE2Eと`collect`は正常である。
旧タグを読み込んだ検証用タブ3件は、親がURLとIDを確認した上で閉じた。他のタブは保持した。

2026-09-07 JSTの全データを初期KPIのbaselineから除外し、翌日以降の本番hostname
`jidouunten.jp`だけを評価する。preview hostnameとlocalhostは除外する。GA4のデータ削除は
行っていない。

## 未完了境界

- GA4で5イベントそれぞれのparameterを個別に受信確認。
- GSC/Bingで検出URL数が反映されるまでの非同期処理確認。

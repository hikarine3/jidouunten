# 計測・検索登録

## 2026-09-10 購入・試乗アクションの計測確認

`fa36371ac1125948ccb403eccd73de7c848f2b5e` のTesla Model 3 / Model Y詳細・比較に、一次情報で確認した「今すぐ注文」「試乗を予約する」導線を追加した。
遷移直前に `outbound_purchase_action` を1回だけ送信し、購入判断の出口を `outbound_manufacturer`（単なる公式情報遷移）と分離する。
送信項目は `vehicle_id`、`manufacturer`、`action_type`、`link_url`、`link_domain`、`placement` の6項目で、個人情報・自由入力・保存本文は含めない。

公開GTM APIのread-only取得で、`GTM-PV9QVMJV` の **version 9** を確認した。Google tag 1個、Custom Event trigger 6個、ネイティブGA4 Event tag 6個（すべて pause 0）、dataLayer variable 15個、正しい測定ID `G-Q58GM7BVB6`、compiler error 0、HTML tag 0である。新イベント専用trigger/tagも公開版で有効になっている。
`python3 scripts/setup_measurement.py --measurement-id G-Q58GM7BVB6 --publish` の公開receiptは `public_id=GTM-PV9QVMJV`、version 9。アプリの独立監査では詳細アクション6/6（各2）、比較アクション4/4、イベントpayload、Tesla公式ドメイン、390px表示、GA collect HTTP 204を確認した。

## 2026-09-10 比較差分トランシェの計測確認

`dac0501228b7651c810c769398302db6c0aad60b` を実IDでビルドし、
`https://5b59d5a7.jidouunten.pages.dev` と本体へ配信した。比較画面の差分強調・同値行切り替えは表示上の補助機能であり、
新しい個人情報や保存本文を送信しない。既存の `compare_vehicles` と公式遷移 `outbound_manufacturer` の契約を維持し、
production E2EでGA collect HTTP 204を確認した。

## 2026-09-10 Tesla受注可否トランシェの計測確認

`1dff8d69803c7ff98a036f141730b1b6b82d4796` を実IDでビルドし、
`https://271972c3.jidouunten.pages.dev` と `https://jidouunten.jp/` へ配信した。Tesla Model 3 / Model Yの6販売単位は、
公式商品ページの「今すぐ注文」導線を根拠に `new_order_available` とし、注文後の納期・在庫・ソフトウェア条件は個別確認と表示する。
production E2Eで新車注文可フィルタ、Tesla詳細・比較、GA collect HTTP 204を確認した。保存・再開のlocalStorage本文や検索query・車両IDをGAへ送信しない契約も維持している。

## 2026-09-10 保存・再開導線の計測確認

`be9a9824b24287d1fb07e8d4d5eaa9e5ac6935e6` を実IDでビルドし、
`https://2eef602d.jidouunten.pages.dev` と `https://jidouunten.jp/` へ配信した。保存・再開機能は
localStorageのみを使い、保存本文・検索query・車両ID・表示名をGAへ送信しない。既存GTM/GAの
初期page_view・一覧/比較イベントに回帰はなく、production E2EでGA collect HTTP 204を確認した。

## 2026-09-10 本番再確認

ハリアー6販売単位を含む `93f27ed5b43bb60cb4a8ed346dcbba88c8114753` を、実IDでビルドした
`https://ac1e8140.jidouunten.pages.dev` と `https://jidouunten.jp/` へ配信した。両方で
`GTM-PV9QVMJV` を確認し、`GTM-TEST` は含まれない。production E2EはGA collect HTTP 204、1/1 scenario。

更新: 2026-09-07

## 専用resource

| サービス | resource | 状態 |
|---|---|---|
| Google Analytics 4 | account `1st` / property `jidouunten.jp` (`552960231`) / web stream `https://jidouunten.jp` / `G-Q58GM7BVB6` | 日本時間・JPY、拡張計測有効 |
| Google Tag Manager | web container `jidouunten.jp` / `GTM-PV9QVMJV` | version 9公開済み |
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
window.dataLayer.push({
  event: "outbound_purchase_action",
  vehicle_id: "vehicle-a",
  manufacturer: "maker-a",
  action_type: "order",
  link_url: "https://example.invalid/official-order",
  link_domain: "example.invalid",
  placement: "vehicle_detail",
});
```

`filter_results` は、初期表示や同じ値の再選択ではなく、利用者の操作で結果集合が変わった時だけ送る。
`view_vehicle` は詳細画面表示時に1回、`outbound_manufacturer` は公式リンク遷移直前に送る。
`link_type` は `product` / `archive`、`placement` は `vehicle_detail` / `comparison` とし、
メーカー公式の商品情報と過去資料を区別する。`outbound_purchase_action` の `action_type` は
`order` / `test_drive` / `dealer` / `catalog` のいずれかとし、確認済みのアクションだけを表示・送信する。

## GTM設定

`scripts/setup_measurement.py` は、同じ会社アカウント内の既存参照コンテナから対象アカウントを特定し、
`jidouunten.jp` 専用コンテナだけを冪等に設定する。OAuth tokenは隣接repoから読み、コピーも出力もしない。

```bash
python3 scripts/setup_measurement.py --create-container
python3 scripts/setup_measurement.py --measurement-id G-Q58GM7BVB6 --publish
```

公開version 9にはGoogle tag、6個のCustom Event trigger、対応する6個のネイティブGA4 Event tag、
15個のdataLayer variableがある。初期版のCustom HTML event tagは同名イベントをdataLayerへ再投入する
構成だったため停止・除去した。API取得した公開版で、ネイティブevent tag 6個（pause 0）、HTML tag 0個、
6個すべて正しい測定ID `G-Q58GM7BVB6`、旧ID0箇所、compiler errorなしを確認済み。再実行時は同名resourceを再作成せず、
workspaceに差分がなければpublishしない。

2026-09-10にversion 8で `outbound_manufacturer` の分類項目を反映した後、version 9で
`outbound_purchase_action` のtrigger、GA4 Event tag、`action_type`等の変数を追加した。公開版の
6イベント構成は、ページ表示・一覧操作・比較・詳細表示・公式情報遷移・購入/試乗アクションを各1契約で扱う。

## 読み込み方針

GTM/GA4は通常読み込みとし、初回表示を遮る同意・拒否バナーは置かない。独自イベントには個人情報や
自由入力値を含めない。計測内容とGoogleのプライバシーポリシー、Google Analyticsオプトアウト
アドオン、ブラウザ側のCookie・トラッキング防止設定を`/privacy/`で案内する。

## 公開後QA

1. 全ページで同意・拒否バナーが表示されないことを確認する。
2. GTM scriptが1つだけ追加され、IDが `GTM-PV9QVMJV` であることを確認する。
3. ブラウザのnetworkで `G-Q58GM7BVB6` 宛ての`collect`を確認し、別にGA4 Realtimeまたは
   DebugViewで受信を確認する。
4. 6操作を各1回実施し、イベント名と上記parameterを確認する（購入・試乗アクションを含む）。
5. 自動離脱クリックと `outbound_manufacturer` / `outbound_purchase_action` を混同せず、公式情報遷移と購入判断アクションを別KPIで集計する。
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

- GA4で6イベントそれぞれのparameterを個別に受信確認。
- GSC/Bingで検出URL数が反映されるまでの非同期処理確認。

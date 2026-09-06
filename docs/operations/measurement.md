# 計測・検索登録

更新: 2026-09-07

## 専用resource

| サービス | resource | 状態 |
|---|---|---|
| Google Analytics 4 | account `1st` / property `jidouunten.jp` / web stream `https://jidouunten.jp` / `G-Q58GM7BVB6` | 日本時間・JPY、拡張計測有効 |
| Google Tag Manager | web container `jidouunten.jp` / `GTM-PV9QVMJV` | version 4公開済み |
| Google Search Console | domain property `sc-domain:jidouunten.jp` | 1stclass所有者でDNS TXT確認済み |
| Bing Webmaster Tools | `https://jidouunten.jp/` | 1stclass所有者でDNS CNAME確認済み |

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
});
```

`filter_results` は、初期表示や同じ値の再選択ではなく、利用者の操作で結果集合が変わった時だけ送る。
`view_vehicle` は詳細画面表示時に1回、`outbound_manufacturer` は公式リンク遷移直前に送る。

## GTM設定

`scripts/setup_measurement.py` は、同じ会社アカウント内の既存参照コンテナから対象アカウントを特定し、
`jidouunten.jp` 専用コンテナだけを冪等に設定する。OAuth tokenは隣接repoから読み、コピーも出力もしない。

```bash
python3 scripts/setup_measurement.py --create-container
python3 scripts/setup_measurement.py --measurement-id G-Q58GM7BVB6 --publish
```

公開version 4にはGoogle tag、5個のCustom Event trigger、対応する5個のGA4 event tag、12個の
dataLayer variableがある。API取得した公開版で正しい測定IDが6箇所、旧IDが0箇所、compiler errorなしを
確認済み。再実行時は同名resourceを再作成せず、workspaceに差分がなければpublishしない。

## 公開後QA

1. 同意前はGTM/GA4へのnetwork通信が0件で、個別イベントもdataLayerへpushされないことを確認する。
2. 同意後は`<head>`内へGTM scriptが1つだけ追加され、IDが `GTM-PV9QVMJV` であることを確認する。
3. ブラウザのnetworkで `G-Q58GM7BVB6` 宛ての`collect`を確認し、別にGA4 Realtimeまたは
   DebugViewで受信を確認する。
4. 5操作を各1回実施し、イベント名と上記parameterを確認する。
5. 自動離脱クリックと `outbound_manufacturer` を混同せず、独自KPIは後者で集計する。
6. GSCとBingへ `/sitemap-index.xml` を送信し、取得成功を確認する。

GA4/GSCはresource作成直後にデータがないのが正常。公開・実イベント受信前に「計測正常」とは判定しない。

## 未完了境界

- 初回デプロイ後の同意前後network、GA4受信確認、およびGSC/Bingへのsitemap送信。

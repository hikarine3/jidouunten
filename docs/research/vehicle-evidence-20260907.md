# 車両データ根拠（2026-09-07）

## 調査方針

日本向けメーカー公式Webカタログ・公式取扱説明書と国土交通省のレベル定義だけを使用した。転載はせず、`src/data/vehicles.json` の要約は自作文とした。対象は販売単位（モデル年・グレード・必要装備・機能バージョン）で分離している。

今回、一次情報で車両仕様・機能・必要装備を確認できた9レコードを作成した。`modelYear` は「ページを確認した年」ではなく、メーカーが示すモデル／発売年を記録する欄とした。Honda Accordは2025年取扱説明書の年式選択と25モデル表記、日産アリアは公式NissanConnectページの「2026年2月以降発売モデル」表記、セレナは公式FAQの2026年2月マイナーチェンジ、レイバックは公式カタログの2026年6月表記を根拠にした。LEGENDは2021年発売・2022年1月終了の過去例として別枠で記録し、現行候補には含めていない。

`availability` は新車注文可能性、`currentCatalogListed` は公式現行カタログ掲載を別々に表す。カタログ掲載だけでは受注可と断定せず、現行掲載車は `unknown` でも初期一覧に表示できる。`unavailable` の過去モデルは既定一覧から除外する。

## レコード一覧

| ID | 日本公式の販売単位 | 自動化レベル | 機能・必要装備 | 速度根拠 | 販売状態 |
|---|---|---:|---|---|---|
| `jp-honda-accord-2025-ehev-sensing360plus` | Honda ACCORD / 2025 / e:HEV Honda SENSING 360＋ | 2 | Honda SENSING 360＋標準。高速道路等のハンズオフは一定条件 | ACC 0km/h以上、LKAS約65〜120km/h（Honda取説） | `unknown` |
| `jp-honda-accord-2025-ehev` | Honda ACCORD / 2025 / e:HEV | 2 | Honda SENSING 360標準。ハンズオフ機能は360＋側のみ | LKAS約65〜120km/h（Honda取説） | `unknown` |
| `jp-nissan-ariya-2026-b6` | 日産アリア / 2026 / B6 | 2 | プロパイロット2.0メーカーオプション＋NissanConnect有料契約 | 数値範囲は今回の公式確認ページに記載なし（`null`） | `unknown` |
| `jp-nissan-ariya-2026-b6-e4orce` | 日産アリア / 2026 / B6 e-4ORCE | 2 | プロパイロット2.0メーカーオプション＋NissanConnect有料契約 | 数値範囲は今回の公式確認ページに記載なし（`null`） | `unknown` |
| `jp-nissan-ariya-2026-b9` | 日産アリア / 2026 / B9 | 2 | プロパイロット2.0メーカーオプション＋NissanConnect有料契約 | 数値範囲は今回の公式確認ページに記載なし（`null`） | `unknown` |
| `jp-nissan-ariya-2026-b9-e4orce` | 日産アリア / 2026 / B9 e-4ORCE | 2 | プロパイロット2.0メーカーオプション＋NissanConnect有料契約 | 数値範囲は今回の公式確認ページに記載なし（`null`） | `unknown` |
| `jp-nissan-serena-2026-e-power-luxion` | 日産セレナ / 2026 / e-POWER LUXION | 2 | プロパイロット2.0＋NissanConnect有料契約 | ハンズオフは同一車線・高速道路で時速40km/h以上とのメーカー注記。上限は未確認 | `unknown` |
| `jp-subaru-levorg-layback-2023-limited-ex` | SUBARU レヴォーグ レイバック / 2023年10月〜生産中発売モデル（カタログ2026年6月）/ Limited EX | 2 | アイサイトXテクノロジー | 現行安全ページに数値速度なし（`null`） | `unknown` |
| `jp-honda-legend-2021-honda-sensing-elite` | Honda LEGEND / 2021 / Hybrid EX・Honda SENSING Elite（2022年1月終了） | 3 | Traffic Jam Pilot（過去の型式指定例） | 公式機能ページに数値速度なし（`null`） | `unavailable` |

### Level 2の分類根拠

メーカーが「Level 2認証」と直接記述したものとして扱っていない。HondaはACC（車速・車間）とLKAS（車線維持）、日産はプロパイロット2.0（車速・車間、車線内走行、条件付き車線変更）を運転支援として説明している。これらの縦方向・横方向の支援を、国土交通省資料の「Level 2＝限定領域で両方向のサブタスクを実行し、運転者が主体」という定義に照合して、サイト上の分類をLevel 2とした。

レイバックも全車速追従・ツーリングアシスト（縦方向・横方向）を公式に運転支援として説明しているため同じ根拠でLevel 2とした。LEGENDだけはHondaがTraffic Jam Pilotを自動運転レベル3の型式指定取得例として明記しており、Level 3の歴史的な参考レコードとした。いずれもメーカー認証表現を推測で補っていない。

## 公式ソースと確認範囲

| 発行元 | URL | 確認した事実 |
|---|---|---|
| 本田技研工業 | https://www.honda.co.jp/ACCORD/ | 日本向けACCORDの現行タイプ名・25モデルのグレード表示 |
| 本田技研工業 | https://www.honda.co.jp/customer/auto/accord/faq/qa002/ | 25モデルのe:HEV / e:HEV Honda SENSING 360＋、360と360＋の機能差 |
| 本田技研工業 | https://www.honda.co.jp/ACCORD/webcatalog/performance/ | 360＋のハンズオフ、ACC/LKAS、道路条件、ドライバーモニタリングカメラ |
| 本田技研工業 | https://www.honda.co.jp/ownersmanual/webom/jpn/accord/2025/details/136256090-278294.html | 2025年LKASの条件（約65〜120km/h）と操作監視 |
| 本田技研工業 | https://www.honda.co.jp/ownersmanual/webom/jpn/accord/2025/details/136256090-277229.html | ACCの追従・停止、悪天候・道路状態の制限 |
| 日産自動車 | https://www3.nissan.co.jp/vehicles/new/ariya.html | B6、B6 e-4ORCE、B9、B9 e-4ORCEの日本向けグレード、諸元、PP2.0メーカーオプション |
| 日産自動車 | https://www.nissan.co.jp/CONNECT/SERVICE/ariya_2512.html | 「2026年2月以降発売モデル」、PP2.0利用にNissanConnect加入が必要 |
| 日産自動車 | https://www3.nissan.co.jp/vehicles/new/ariya-details/performance_safety.html | 高速道路同一車線内の条件付きハンズオフ、PP2.0の限界・運転者責任 |
| 日産自動車 | https://www.nissan.co.jp/SP/OM/ARIYA/2602/manual_t00um5bp0a.pdf | 2026年仕様のプロパイロット取扱説明書 |
| 日産自動車 | https://www3.nissan.co.jp/vehicles/new/serena/specifications/luxion.html | e-POWER LUXIONのグレード、プロパイロット2.0、同一車線ハンズオフ |
| 日産自動車 | https://www3.nissan.co.jp/content/dam/Nissan/jp/vehicles/serena/2603/pdf/serena_2603_specsheet.pdf | C28の2026年仕様、LUXIONの装備とPP2.0・サービス条件 |
| 日産自動車 | https://faq2.nissan.co.jp/faq/show/60892?category_id=258&site_domain=default | 2026年2月マイナーチェンジ、プロパイロットの速度設定範囲 |
| SUBARU | https://www.subaru.jp/levorg-layback/ | 現行レイバックとアイサイトXの渋滞時ハンズオフ説明 |
| SUBARU | https://www.subaru.jp/levorg-layback/safety/ | 全車速追従・ツーリングアシスト、アイサイトXの作動条件と監視 |
| SUBARU | https://www.subaru.jp/levorg-layback/specification/docs/equipment.pdf | 2026.07装備表、Limited EXのアイサイトX・ドライバーモニタリングシステム |
| SUBARU | https://ucar.subaru.jp/php/catalog/grade.php?cat_id=10163623 | 2026年6月カタログ、Limited EX、日本仕様、生産中発売モデル表記 |
| 本田技研工業 | https://www.honda.co.jp/auto-archive/legend/4door/2022/hondasensing-elite/function/ | 2022年1月終了、Traffic Jam Pilot、Level 3・引継ぎ条件 |
| 本田技研工業 | https://global.honda/jp/news/2021/4210304-legend.html | 2021年発売、Hybrid EX・Honda SENSING Elite、限定生産・リース専用 |
| 国土交通省 | https://www.mlit.go.jp/common/001343740.pdf | Level 0〜5の定義、Level 2の縦・横方向支援と運転者主体 |

## 未確認・公開上の注意

- 日産アリアのプロパイロット2.0について、今回確認した公式ページ・2026年取扱説明書では数値速度範囲を特定できなかったため、`odd.speedKph.min/max` は `null` とした。
- メーカー公式カタログの掲載だけでは新車受注可能性を断定しない方針とし、現行掲載8件の `availability` は `unknown` とした。初期UIでは `currentCatalogListed=true` の `unknown` を「掲載車（受注要確認）」として表示し、受注確認後だけ `new_order_available` に更新する。
- LEGENDは公式アーカイブの終了記載に基づき `unavailable`・`currentCatalogListed=false` とした。過去のLevel 3例を現行購入車として表示しない。
- `factStatus=verified` はモデル／発売年・グレード・機能・ODD根拠が確認済みという意味であり、販売状態まで確認済みという意味ではない。
- 出典のない価格、年式、速度、天候条件は補っていない。販売終了車の現行扱い、画像、転載文は今回の成果物に含めていない。

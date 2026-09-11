# 日本向け現行候補の棚卸し（最終更新: 2026-09-12）

Issue #17の公開候補を、販売単位（市場・メーカー・メーカー明示モデル年または世代・グレード・必要装備・機能版）で管理するための内部台帳。通常一覧には表示しない。確認日は各車両レコードの `sources[].accessedAt` と `lastReviewedAt` に保持し、カタログ適用時点・販売単位導入時点・価格適用時点とは分離する。

## 集計

対象母集団は「日本で正規販売される現行の乗用車のうち、Level 1以上の運転支援／自動運転を持つ販売単位」。一覧ではLevel 1・2・確認できたLevel 3を公開し、Level 4・5は掲載状況を別表示する。今回は公開データと確認待ち候補を分け、未確認を網羅済みとして数えない。ブランド群と販売単位が混在するため、未確認候補群の総数はまだ確定しない。

| 区分 | 件数 | 定義 |
|---|---:|---|
| 公開データ | 343 | `src/data/vehicles.json` の全レコード（現行342 + 過去1） |
| 既定表示 | 342 | `currentCatalogListed=true` かつ新車候補として一覧に出る現行レコード |
| 掲載メーカー数 | 18 | Honda / Nissan / SUBARU / Tesla / Volvo / Suzuki / Renault / BMW / MINI / Mazda / Toyota / Lexus / Hyundai / BYD / Mitsubishi / Volkswagen / Audi / Mercedes-Benz |
| 今回追加（Mazda） | 35 | CX-80 8 / CX-60 11 / 新型CX-5 4 / MAZDA3 7 / CX-30 4 / MX-30 ROTARY-EV Natural Monotone 1。日本向け現行価格・主要諸元・装備表・安全ページで販売単位とMRCC/CTS・監視条件を確認 |
| 今回追加（MINI） | 8 | Countrymanの2026年7月以降生産の通常8販売単位。日本向け装備・価格表と公式導入資料で確認 |
| 今回追加（Volvo） | 3 | EX30 2027年モデルの3グレード。日本向け諸元・価格表と取扱説明書で確認 |
| 今回追加（Suzuki） | 3 | e VITARA X 2WD / Z 2WD / Z 4WD。日本向け現行価格・発売資料・安全装備表で確認 |
| 今回追加（Renault） | 4 | ARKANAのesprit Alpine / techno、FULL HYBRID E-TECH / MILD HYBRID。価格表・機能説明・装備資料で確認 |
| 今回追加（BMW） | 9 | 3シリーズ通常カタログのSedan G20 5単位 / Touring G21 4単位。2026年7月以降生産の装備・価格表で確認 |
| 今回追加（Toyota / Lexus） | 2 | プリウス Z（2WD）とNX350h “version L” 2WD。現行商品・価格・安全・取扱説明書を販売単位へ固定 |
| 今回追加（Toyota / Lexus / 後発対策） | 3 | クラウン（クロスオーバー）CROSSOVER RS “THE LIMITED-MATTE METAL” 4WD、LBX “Bespoke Build” 2WD、RX500h “F SPORT Performance” AWD。渋滞時支援・車線変更・監視条件と公式価格を販売単位へ固定 |
| 今回追加（Toyota bZ4X） | 1 | bZ4X Z（FWD）。全車速ACC・LTA・LCAと渋滞時支援の条件、公式価格を販売単位へ固定 |
| 今回追加（Toyota RAV4 / 後発対策） | 4 | Z HEV E-Four / Z PHEV E-Four / Adventure HEV E-Four / GR SPORT PHEV E-Four。公式価格、ACC・LTA、グレード別のAdvanced Drive・LCA・ドライバーモニターの標準／オプション差を販売単位へ固定 |
| 今回追加（Toyota ハリアー / 後発対策） | 6 | G・Z・Z“Leather Package”の2WD/E-Four。2026年8月価格、ACC・LTA・停止保持・ハンドル保持要求を販売単位へ固定し、根拠がないLCA・ドライバーモニターは付与しない |
| 今回追加（Toyota アルファード / 後発対策） | 4 | Z/G HEVの2WD/E-Four・7/8人乗り。2026年6月価格、ACC・LTA・ステアリング保持要求を販売単位へ固定 |
| 今回追加（Honda VEZEL / 後発対策） | 2 | e:HEV ZのFF/4WD。Honda SENSING（ACC・LKAS・トラフィックジャムアシスト）、約0〜120km/hの条件、公式価格を販売単位へ固定 |
| 今回追加（Honda ZR-V / 後発対策） | 4 | e:HEV X／e:HEV ZのFF・4WD。Honda SENSING（ACC・LKAS・トラフィックジャムアシスト）、約0〜120km/hの条件、公式価格を販売単位へ固定 |
| 今回追加（Toyota クラウン スポーツ / 後発対策） | 4 | SPORT RS／SPORT Z（PHEV・HEV）／SPORT GのE-Four。価格532万7,300円〜777万7,000円、RS/Zはアドバンスト ドライブ（渋滞時支援）・LCA・条件内ハンズオフ、GはACC・LTAのみとして能力差を販売単位へ固定 |
| 今回追加（Honda ステップ ワゴン / 後発対策） | 10 | e:HEV AIR EX／SPADA／SPADA PREMIUM LINEとAIR EX／AIR／SPADA／SPADA PREMIUM LINEのFF・4WD。価格334万8,400円〜426万8,000円、Honda SENSINGのACC・LKAS・トラフィックジャムアシスト、約0〜65km/hの渋滞時支援、ステアリング保持条件を販売単位へ固定 |
| 今回追加（Honda フリード CROSSTAR / 後発対策） | 8 | e:HEV／ガソリン CROSSTARのFF・4WD、5／6人乗り。価格292万8,200円〜360万2,500円、Honda SENSINGのACC・LKAS・トラフィックジャムアシスト、約0〜65km/hの渋滞時支援、ステアリング保持条件を販売単位へ固定 |
| 今回追加（日産 キックス / 後発対策） | 12 | P16のG／X+／X／X シンプルパッケージ／ROCK CREEK／ROCK CREEK Utility Specを2WD・4WD（e-4ORCE）別に登録。価格299万9,700円〜430万9,800円、全車プロパイロット標準（車速30〜135km/h・車線中央付近の操舵支援）、ステアリング保持・常時監視、ハンズオフ不可を公式価格・FAQで確認 |
| 今回追加（Honda CIVIC / 後発対策） | 5 | 2026年6月5日発売のe:HEV LX／EX／RS、ガソリンEX／RSを登録。価格394万6,800円〜465万9,600円、全車ACC＋LKASのLevel 2相当。e:HEV 3単位とガソリンEXはトラフィックジャムアシスト標準、ガソリンRSは対象外として同じLevel 2内の渋滞支援差を比較可能にした |
| 今回追加（Toyota クラウン（クロスオーバー） / 後発対策） | 3 | 通常カタログのCROSSOVER RS／Z／G（いずれもE-Four）を追加。価格517万9,900円〜673万9,700円、RS/Zはアドバンスト ドライブ（渋滞時支援）・LCA・条件内ハンズオフ、GはACC・LTA・渋滞時支援のみとして能力差を販売単位へ固定。特別仕様THE LIMITED-MATTE METALは既存の別単位として保持 |
| 今回追加（Toyota ヴェルファイア / 後発対策） | 7 | Executive Lounge PHEV/HEV、Z Premier HEV/ターボの2WD・E-Four/4WD。ACC・LTA・LCA・アドバンスト ドライブ（渋滞時支援）の標準装備、0〜約40km/hの条件付きハンズオフ、2026年6月価格を販売単位へ固定 |
| 今回追加（Toyota ヴォクシー / 後発対策） | 6 | S-Z/S-Gの2WD・E-Four、7/8人乗りとS-GベースのMULTI UTILITY 5人乗り。ACC・LTA標準、Advanced Drive・LCA・ドライバーモニターのメーカーオプション価格と作動条件を販売単位へ固定 |
| 今回追加（Toyota ノア / 後発対策） | 7 | 既存S-Z 2WDを含む現行HEV 8単位へ拡張。S-Z/S-GのAdvanced Drive等セット（122,100円／78,100円）、LCA・ドライバーモニター、S-Xの設定なし、2WD/E-Four・7/8人を販売単位へ固定。Advanced Driveの0〜約40km/hとLCAの約85〜130km/h、T-Connect／コネクティッドナビ契約・地図条件も単位ごとに保持 |
| 今回追加（Toyota シエンタ / 後発対策） | 18 | Z/G/Xのハイブリッド車・ガソリン車、2WD/E-Four、5/7人乗りを公式グレードJSONの全組み合わせで登録。価格214万6,100円〜339万7,900円、全車速ACC・LTA・手保持条件を販売単位へ固定 |
| 今回追加（Lexus LM / 後発対策） | 2 | LM500h EXECUTIVE（4人）/ version L（6人）のAWD。Advanced Drive・LCA・ドライバーモニター・全車速追従ACCを標準装備として確認し、価格1,520万〜2,030万円、渋滞時0〜約40km/hの条件付きハンズオフを販売単位へ固定 |
| 今回追加（Lexus UX300h / 後発対策） | 6 | Shining Essence / version L / F SPORTの2WD・AWD。全車速追従ACC・LTA・ドライバー異常時対応システム標準、価格521万〜575.7万円、ステアリング保持が必要なハンズオフ不可、2027年2月生産終了予定を販売単位へ固定 |
| 今回追加（Toyota カローラ クロス / 後発対策） | 7 | Z / S / GR SPORT / Z“Adventure”の2WD・E-Four。価格298万1,000円〜407万7,700円、ACC・LTA・渋滞時支援・車線変更時の補助、ステアリング保持要求を販売単位へ固定 |
| 今回追加（Toyota アクア / 後発対策） | 9 | Z / G / X / U（KINTO専用）の2WD・E-Four、GR SPORT 2WD。価格244万3,100円〜323万8,400円、全車速追従ACC・LTA・ステアリング保持を販売単位へ固定 |
| 今回追加（Toyota カローラ / 後発対策） | 6 | HYBRID W×B / G / Xの2WD・E-Four。価格238万400円〜334万2,900円、全車速追従ACC・LTA・停止保持・ステアリング保持を販売単位へ固定 |
| 今回追加（Lexus LX / 後発対策） | 10 | LX700h/LX600のEXECUTIVE、5/7人乗り、OVERTRAIL+ 5/7人乗り。価格1,450万〜2,100万円、全車速追従ACC・LTA、Advanced Drive渋滞時0〜40km/hの条件付き支援、運転者監視を販売単位へ固定。LCA・自動車線変更は付与せず、受注可否は未確認 |
| 今回追加（Volkswagen / Lexus / Toyota） | 9 | Volkswagen Tiguan 6単位、Lexus GX550 2単位、Toyota ランドクルーザー250 VX ガソリン4WD 1単位。価格・ACC／車線維持支援・ステアリング保持を一次資料で確認し、注文可否は未確認のまま掲載 |
| 今回追加（Toyota ヤリス クロス） | 20 | 2026年8月公式グレードJSONのZ“Adventure”／Z／G／X／U／GR SPORT、ハイブリッド・ガソリン、2WD／E-Fourの全20販売単位。価格212万6,300円〜335万5,000円、全車速追従ACC・LTA・渋滞時支援、ステアリング保持条件を一次資料で確認し、注文可否は未確認のまま掲載 |
| 今回追加（Toyota ヤリス） | 17 | 2026年4月公式グレードJSONのZ／G／X、ハイブリッド・ガソリン、1.5L／1.0L、CVT／6MT、2WD／4WD・E-Fourの価格比較可能な17販売単位。価格169万7,300円〜288万4,200円。1.0L CVTの2単位はACCのみでLevel 1、その他15単位はLTA併用のLevel 2、ハイブリッド6単位は渋滞時停止・発進支援を確認。U（KINTO専用）2単位は月額のみのため車両本体価格比較から保留 |
| 今回追加（Toyota プリウス） | 5 | 既存のHEV Z 2WDに、HEV Z E-Four／G 2WD・E-Four／X 2WD・E-Fourを追加。2026年7月公式価格表の279万6,200円〜425万1,500円、全車速ACC＋LTA・渋滞時支援（ハンズオフ不可）を販売単位へ固定。Xは法人向けチャネルのため法人向け注記と公式Webカタログ根拠を保持し、発売日は未確認・注文可否は未確認のまま表示 |
| 注文状態更新（2026-09-11） | 5 | Volvo EX30 3、Hyundai IONIQ 5 Voyage／Lounge 2は、メーカー公式のオンライン契約・在庫車両「車両注文」を確認し、`new_order_available`へ更新。SUBARU レイバック1とLexus LM 2は注文済み車両の出荷目処のみで現在の受付導線を直接確認できず、`unknown`を維持 |
| 今回追加（BYD / 後発対策） | 7 | DOLPHIN Baseline / Long Range、ATTO 3、SEAL RWD / AWD、SEALION 6 FWD / AWD。価格299万2,000円〜572万円、ACC・車線内支援・車線変更支援の装備差、間接式ドライバーモニタリング、運転者の手保持条件を販売単位へ固定 |
| 今回追加（Mitsubishi / 後発対策） | 9 | OUTLANDER PHEV BLACK Edition / P Executive Package / P / G / M × 5・7人乗り。価格536万9,100円〜690万1,400円、MI-PILOT（全車速ACC・LKA）とLCAの警告・支援、ハンドル保持、公式の商談・購入予約導線を販売単位へ固定 |
| 今回追加（Audi / 後発対策） | 6 | A5 / A5 AvantのTFSI 110kW、TFSI quattro 150kW、TDI quattro 150kW。2026年4月価格表の617万〜760万円、アダプティブクルーズアシストプラス・レーンガイダンス・レーンチェンジアシスト、常時監視とステアリング保持を販売単位へ固定 |
| 今回追加（Toyota カローラ スポーツ／ツーリング） | 9 | カローラ スポーツ G“Z” / G / G“X” 2WDの3単位、カローラ ツーリング W×B / G / Xの2WD・E-Four 6単位。価格244万7,500円〜339万3,500円、全車速追従レーダークルーズコントロール・LTA・ステアリング保持を公式グレード／安全性能／カタログ資料から固定。特別仕様車3単位は販売終了時期の確認待ちで保留 |
| 今回追加（Mercedes-Benz GLC／C-Class Sedan） | 11 | GLC 5単位、C-Class Sedan 6単位。MP202602価格表の744万〜1,844万円、アクティブディスタンスアシスト・アクティブステアリングアシスト・レーンキーピング・自動再発進の標準装備を確認。Level 2相当・ステアリング保持・注文可否未確認として掲載 |
| 今回追加（SUBARU フォレスター） | 7 | Premium S:HEV EX、X-BREAK S:HEV EX、Touring EX、SPORT EX、X-BREAK S:HEV、Touring、SPORT EX Black Selection。現行グレード価格385万〜464万2,000円、EyeSightコアとEyeSight X（5単位）の装備差、渋滞時ハンズオフ0〜約50km/h・車線変更支援・運転者監視条件を公式装備表／安全ページで確認。全7単位をLevel 2相当・注文可否未確認として掲載 |
| 今回追加（日産 エクストレイル） | 14 | X/G 2WD、X/G e-4ORCE、ROCK CREEK、NISMO、AUTECH（2列・3列）の現行14販売単位。2026年9月価格409万2,000円〜596万2,000円、プロパイロット（ナビリンク機能付）全車標準、車速・車間＋車線内操舵のLevel 2相当、ハンズオフ不可として公式価格・装備表・安全説明を確認。注文可否は未確認 |
| 未掲載・確認継続候補群 | 件数未確定 | Tesla Model S / X と、下記のブランド／モデル群。一次確認済みでも販売単位への展開・レビュー未完なら含める |
| Mazda掲載対象外 | 6 | MAZDA3 FASTBACK 15C / 15S、SEDAN 20S、CX-30 20C / 20S、MX-30 ROTARY-EV（ROTARY-EVグレード）。主要諸元・装備表でMRCCとCTSの同時支援を確定できない |

未確認候補群の調査が終わるまで、サイト全体の国内候補を「網羅」と主張しない。Honda LEGEND（2021、Level 3）は過去車両のため現行母集団の外にあり、公開データには含むが既定一覧には表示しない。

## 調査済み・掲載単位

| メーカー | モデル / 販売単位 | 状態 | Level | 確認日 |
|---|---|---|---:|---|
| Honda | ACCORD 2025 e:HEV Honda SENSING 360＋ | 掲載 | 2 | 2026-09-07 |
| Honda | ACCORD 2025 e:HEV | 掲載 | 2 | 2026-09-07 |
| Nissan | 日産アリア（現行仕様）B6 / B6 e-4ORCE / B9 / B9 e-4ORCE | 掲載（4単位、B6のみ注文受付確認） | 2 | 2026-09-11 |
| Nissan | セレナ C28 e-POWER LUXION | 掲載 | 2 | 2026-09-07 |
| Nissan | エクストレイル X/G 2WD、X/G e-4ORCE、ROCK CREEK、NISMO、AUTECH（2列・3列） | 掲載（現行14単位、プロパイロット標準・ハンズオフ不可）／注文可否 未確認 | 2相当 | 2026-09-11 |
| Nissan | キックス P16 G / X+ / X / X シンプルパッケージ / ROCK CREEK / ROCK CREEK Utility Spec（2WD・4WD/e-4ORCE） | 掲載（現行12単位、プロパイロット標準・ハンズオフ不可）／注文可否 未確認 | 2相当 | 2026-09-12 |
| SUBARU | レヴォーグ レイバック（現行仕様）Limited EX | 注文可否 未確認（注文済み1.8Lグレードの工場出荷目処のみ確認） | 2 | 2026-09-11 |
| SUBARU | フォレスター Premium S:HEV EX / X-BREAK S:HEV EX / Touring EX / SPORT EX / X-BREAK S:HEV / Touring / SPORT EX Black Selection | 掲載（現行7単位、EyeSight X 5単位は条件内ハンズオフ・車線変更支援）／注文可否 未確認 | 2相当 | 2026-09-11 |
| Tesla | Model 3 Premium RWD / Premium ロングレンジAWD / Performance、Model Y Premium RWD / Premium ロングレンジAWD / L | 新車注文可（6単位） | 2相当 | 2026-09-10 |
| Audi | A5 / A5 Avant TFSI 110kW / TFSI quattro 150kW / TDI quattro 150kW | 掲載（6単位、注文可否 未確認） | 2相当 | 2026-09-11 |
| Volvo | EX30 2027 Plus P5 / Ultra P5 Long Range / Ultra P8 AWD Electric | 新車注文可（3単位、オンライン契約） | 2相当 | 2026-09-11 |
| Suzuki | e VITARA X 2WD / Z 2WD / Z 4WD（現行仕様） | 掲載（3単位） | 2相当 | 2026-09-07 |
| Renault | ARKANA esprit Alpine FULL HYBRID E-TECH / MILD HYBRID、techno FULL HYBRID E-TECH / MILD HYBRID | 掲載（4単位） | 2相当 | 2026-09-07 |
| BMW | 3シリーズ セダン G20 318i / 320i / 320d xDrive / 330e M Sport、M340i xDrive | 掲載（通常カタログ5単位） | 2相当 | 2026-09-07 |
| BMW | 3シリーズ ツーリング G21 318i / 320i / 320d xDrive M Sport、M340i xDrive | 掲載（通常カタログ4単位） | 2相当 | 2026-09-07 |
| MINI | Countryman C SELECT / C / D / S ALL4 SELECT / S ALL4 / JOHN COOPER WORKS COUNTRYMAN ALL4 / E / SE ALL4 | 掲載（通常8単位） | 2相当 | 2026-09-07 |
| Mazda | CX-80 XD系 / XD-HYBRID系 / PHEV系 | 掲載（8単位） | 2相当 | 2026-09-08 |
| Mazda | CX-60 25S / XD / XD-HYBRID / PHEV系 | 掲載（11単位） | 2相当 | 2026-09-08 |
| Mazda | 新型CX-5 S / G標準 / G EX Package / L | 掲載（4単位） | 2相当 | 2026-09-08 |
| Mazda | MAZDA3 Fastback 25S / 25L / X Touring（各6EC-AT / 6MT）、Sedan 25L | 掲載（7単位） | 2相当 | 2026-09-08 |
| Mazda | CX-30 20G / 20 Air Edition / 25L / 25 Air Edition | 掲載（4単位） | 2相当 | 2026-09-08 |
| Mazda | MX-30 ROTARY-EV Natural Monotone | 掲載（1単位） | 2相当 | 2026-09-08 |
| Toyota | プリウス 2026 Z（2WD） | 掲載 | 2相当 | 2026-09-10 |
| Lexus | NX350h “version L” 2WD | 掲載 | 2相当 | 2026-09-10 |
| Toyota | クラウン（クロスオーバー）CROSSOVER RS “THE LIMITED-MATTE METAL” 4WD | 掲載 | 2相当 | 2026-09-10 |
| Lexus | LBX “Bespoke Build” 2WD（FF） | 掲載 | 2相当 | 2026-09-10 |
| Lexus | RX500h “F SPORT Performance” AWD | 掲載 | 2相当 | 2026-09-10 |
| Toyota | bZ4X Z（FWD） | 掲載 | 2相当 | 2026-09-10 |
| Toyota | クラウン スポーツ SPORT RS／SPORT Z（PHEV・HEV）／SPORT G E-Four | 掲載（現行4単位、RS/Zは条件内ハンズオフ・車線変更支援、Gはハンドル保持）／注文可否 未確認 | 2相当 | 2026-09-12 |
| Toyota | RAV4 Z（ハイブリッド車 E-Four） / Z（プラグインハイブリッド車 E-Four） / Adventure（ハイブリッド車 E-Four） / GR SPORT（プラグインハイブリッド車 E-Four） | 掲載（4単位） | 2相当 | 2026-09-10 |
| Toyota | ハリアー G（2WD/E-Four） / Z（2WD/E-Four） / Z“Leather Package”（2WD/E-Four） | 掲載（6単位） | 2相当 | 2026-09-10 |
| Toyota | アルファード Z HEV 2WD / E-Four（7人乗り）、G HEV 2WD / E-Four（8人乗り） | 掲載（4単位） | 2相当 | 2026-09-10 |
| Honda | VEZEL e:HEV Z FF / 4WD | 掲載（2単位） | 2相当 | 2026-09-10 |
| Honda | ZR-V e:HEV X／e:HEV Z FF / 4WD | 掲載（現行4単位、Honda SENSING標準・ハンズオフ不可）／注文可否 未確認 | 2相当 | 2026-09-11 |
| Honda | フリード e:HEV CROSSTAR／CROSSTAR FF・4WD（5／6人乗り） | 掲載（現行8単位、Honda SENSING標準・ハンズオフ不可）／注文可否 未確認 | 2相当 | 2026-09-12 |
| Toyota | ヴェルファイア Executive Lounge PHEV E-Four（6人）、Executive Lounge HEV 2WD/E-Four（7人）、Z Premier HEV 2WD/E-Four、Z Premier ターボガソリン 2WD/4WD（7人） | 掲載（7単位） | 2相当 | 2026-09-10 |
| Toyota | ヴォクシー S-Z/S-G 2WD・E-Four（7人）、S-G 2WD（8人）、S-G マルチユーティリティ（2WD・5人） | 掲載（6単位） | 2相当 | 2026-09-10 |
| Toyota | ノア HYBRID S-Z/S-G/S-X 2WD・E-Four（7人）、S-G/S-X 2WD（8人） | 掲載（8単位） | 2相当 | 2026-09-10 |
| Toyota | シエンタ Z/G/X ハイブリッド車・ガソリン車、2WD/E-Four、5/7人乗り | 掲載（18単位） | 2相当 | 2026-09-10 |
| Lexus | LM500h EXECUTIVE AWD（4人乗り） / version L AWD（6人乗り） | 注文可否 未確認（注文後工場出荷目処のみ確認） | 2相当 | 2026-09-11 |
| Lexus | UX300h “Shining Essence” / “version L” / “F SPORT” 2WD・AWD | 掲載（6単位） | 2相当 | 2026-09-10 |
| Mitsubishi | OUTLANDER PHEV BLACK Edition / P Executive Package / P / G / M 4WD（5・7人乗り） | 掲載（9単位） | 2相当 | 2026-09-11 |
| Toyota | アクア Z / G / X / U（KINTO専用）の2WD・E-Four、GR SPORT 2WD | 掲載（9単位） | 2相当 | 2026-09-11 |
| Toyota | カローラ HYBRID W×B / G / Xの2WD・E-Four | 掲載（6単位） | 2相当 | 2026-09-11 |
| Toyota | カローラ スポーツ G“Z” / G / G“X” 2WD | 掲載（3単位、注文可否 未確認） | 2相当 | 2026-09-11 |
| Toyota | カローラ ツーリング W×B / G / X 2WD・E-Four | 掲載（6単位、注文可否 未確認） | 2相当 | 2026-09-11 |
| Volkswagen | Tiguan eTSI Active / Elegance / R-Line、TDI 4MOTION Active / Elegance / R-Line | 掲載（6単位） | 2相当 | 2026-09-11 |
| Lexus | GX550 version L / OVERTRAIL+ | 掲載（2単位） | 2相当 | 2026-09-11 |
| Toyota | ランドクルーザー250 VX ガソリン 4WD | 掲載（1単位） | 2相当 | 2026-09-11 |

Teslaは日本向け公式のModel別情報とサポートFAQに加え、2026年6月26日現在の公式ベースプライスを根拠にModel 3 / Model Yを各3販売仕様へ分けて登録した。2026-09-10確認時点で両モデルの日本向け公式商品ページに「今すぐ注文」導線が表示され、公式FAQも注文後の手続きと注文可能なトリム・納車予定時期をDesign Studioで確認する流れを案内しているため、6販売単位の`availability`を`new_order_available`へ更新した。ただし注文後の在庫・納車時期・ソフトウェア提供条件は個別確認が必要。Tesla自身がドライブアシスト機能を完全自動運転ではないと説明しているため、FSD等の名称だけでLevel 3以上とは判定していない。Model S / Model Xは公式サポート情報で存在と支援機能の説明を確認できるが、現行カタログのモデル年・グレード・注文可否を確認できないため、内部の未確認候補に残し、公開データへ追加しない。

## 2026-09-11 Toyota カローラ スポーツ／ツーリング追加トランシェ

トヨタ公式の現行商品ページ、価格・グレードページ、安全性能ページ、主要装備・価格表を照合し、カローラ スポーツ3単位とカローラ ツーリング6単位を登録した。カローラ スポーツはG“Z” 2WD（322万200円）、G 2WD（283万1,900円）、G“X” 2WD（253万1,600円）、カローラ ツーリングはW×B 2WD（317万9,000円）／E-Four（339万3,500円）、G 2WD（281万2,700円）／E-Four（302万7,200円）、X 2WD（244万7,500円）／E-Four（266万2,000円）である。適用資料はスポーツが2026年7月、ツーリングが2026年5月。販売単位ごとの発売日・現在の受注受付は公式資料で固定できないため、\`salesUnitIntroducedAt=null\`、\`availability=unknown\`とした。

安全性能ページと装備表で、全車速追従レーダークルーズコントロール（縦方向）とLTA（横方向）の標準装備、運転者のステアリング保持・周囲監視を確認した。国土交通省の定義に照合してサイト上はLevel 2相当、全9単位の\`handsOff=not_allowed\`、\`driverMonitoring=required\`、能力は\`adaptive_cruise_control\`と\`lane_centering\`に限定した。トヨタが車両をLevel 2認証したという意味ではなく、ハンズオフや自動車線変更の機能として表示しない。カローラ スポーツ G“Z・ACTIVE ELEGANCE”とカローラ ツーリング ACTIVE SPORTの特別仕様3単位は掲載ページを確認できるが、販売終了時期が明記されていないため次回確認へ保留した。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| カローラ スポーツ現行商品ページ | トヨタ自動車 | https://toyota.jp/corollasport/ | 2026-09-11 |
| カローラ スポーツ3単位の価格・装備（2026年7月） | トヨタ自動車 | https://toyota.jp/corollasport/grade/ | 2026-09-11 |
| カローラ スポーツ全車速追従ACC・LTA・手保持条件 | トヨタ自動車 | https://toyota.jp/corollasport/safety/ | 2026-09-11 |
| カローラ スポーツ主要装備・価格表 | トヨタ自動車 | https://toyota.jp/pages/contents/corollasport/001_p_001/pdf/corollasport_equipment_compare_202607.pdf | 2026-09-11 |
| カローラ ツーリング現行商品・価格ページ | トヨタ自動車 | https://toyota.jp/corollatouring/ ／ https://toyota.jp/corollatouring/grade/ | 2026-09-11 |
| カローラ ツーリング全車速追従ACC・LTA・手保持条件 | トヨタ自動車 | https://toyota.jp/corollatouring/safety/ | 2026-09-11 |
| カローラ ツーリング主要装備・価格表（2026年5月） | トヨタ自動車 | https://toyota.jp/pages/contents/request/webcatalog/corollatouring/corollatouring_main.pdf | 2026-09-11 |
| Level 2の定義（運転者主体の前後・左右支援） | 国土交通省 | https://www.mlit.go.jp/common/001343740.pdf | 2026-09-11 |

公式見積り導線は\`https://toyota.jp/service/estimate/grades?car_name_en=COROLLA%20SPORT\`および\`COROLLA%20TOURING\`をモデル単位の検討出口として保持する。個別販売単位の注文可否・納期は販売店確認が必要で、注文可能とは表示しない。

## 2026-09-11 Volkswagen／Lexus／Toyota追加トランシェ

Volkswagen Tiguanは日本公式の現行モデルページ、2026年1月価格表、主要装備表を照合し、eTSI 3単位とTDI 4MOTION 3単位の計6販売単位を登録した。価格は494万9,000円〜666万4,000円（税込）。全単位でTravel Assist、Lane Assist、全車速ACCの標準装備を確認したが、メーカーがLevel 2認証と明記したものではないため、ACCと車線維持の同時支援を国土交通省定義へ照合した「Level 2相当」として表示する。価格表・装備表の確認月を`catalogAsOf`へ保持し、個別の受注可否は`unknown`とした。

Lexus GX550は現行モデル、安全装備、価格・パッケージページを照合し、version L（1,270万円）とOVERTRAIL+（1,195万円）の2販売単位を登録した。両単位でLTAと全車速追従レーダークルーズを確認し、ステアリング保持が必要なLevel 2相当として扱う。価格・仕様の確認月は2026年9月、受注可否は販売店・時期で変動するため`unknown`を維持した。

Toyota ランドクルーザー250は、2026年4月の公式グレード・主要装備資料と取扱説明書からVXガソリン4WD（570万円）を登録した。全車速追従ACCとLTAの同時支援を確認し、ハンドル保持・常時監視が必要なLevel 2相当として表示する。公式掲載は確認できるが販売単位の受注可否は固定できないため`unknown`とした。

## 2026-09-11 Toyota ヤリス クロス追加トランシェ

トヨタ公式の現行ヤリス クロス商品ページ（modelId 59）とグレードJSONを照合し、Z“Adventure”／Z／G／X／U／GR SPORTのハイブリッド車・ガソリン車、2WD／E-Fourを含む全20販売単位を登録した。税込メーカー希望小売価格は212万6,300円〜335万5,000円で、グレードJSONの価格を各販売単位へ直接結び付けた。2026年8月の主要諸元・装備表を`catalogAsOf`・`priceEffectiveAt`へ保持し、個別の発売日・受注可否は一次資料で固定できないため`salesUnitIntroducedAt=null`、`availability=unknown`とした。

安全ページ・主要装備表・取扱説明書で、全車速追従レーダークルーズコントロール（縦方向）とレーントレーシングアシスト（LTA、横方向）の組合せ、渋滞時の停止・発進支援、ステアリング保持要求を確認した。したがって国土交通省の定義へ照合したサイト上の分類は全20単位でLevel 2相当、handsOffは`not_allowed`、driverMonitoringは`required`とした。LTAはステアリングを保持しないと停止する運転支援であり、自動運転や自動車線変更とは表示していない。ウインカー操作に伴う予備加減速の記載は、車線変更支援として誤解されるため能力キーには追加していない。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| ヤリス クロス現行商品ページとmodelId 59 | トヨタ自動車 | https://toyota.jp/yariscross/ | 2026-09-11 |
| Z“Adventure”／Z／G／X／U／GR SPORT、ハイブリッド・ガソリン、2WD／E-Fourの20単位と税込価格 | トヨタ自動車 | https://toyota.jp/pages/contents/include/carpage_format/carlineup/data/json/grades59.json | 2026-09-11 |
| 全車速追従ACC、LTA、渋滞時支援、ステアリング保持条件 | トヨタ自動車 | https://toyota.jp/yariscross/safety/ | 2026-09-11 |
| 2026年8月の主要諸元・装備表、Toyota Safety SenseのLTA・LDA・全車速追従ACC | トヨタ自動車 | https://toyota.jp/pages/contents/yariscross/001_p_001/pdf/yariscross_spec_202608.pdf | 2026-09-11 |
| LTAはレーダークルーズと併用し運転者がステアリングを保持 | トヨタ自動車 | https://manual.toyota.jp/yariscross/2401/cv/ja_JP/contents/vhch04se050404.php | 2026-09-11 |
| Level 2の定義（運転者主体の前後・左右支援） | 国土交通省 | https://www.mlit.go.jp/common/001343740.pdf | 2026-09-11 |

ヤリス クロスは公式の商品ページと見積り導線を保持するが、個別販売単位の現在の注文受付を確認できないため、注文可能とは表示しない。Toyotaの他モデルと同じLevel 2ラベルでも、ヤリス クロスはハンズオフ不可・車線変更支援なしとして絞り込み比較できる。

## 2026-09-11 Toyota プリウス追加トランシェ

トヨタ公式の現行プリウス価格・グレードページと2026年7月主要諸元・装備表を照合し、既存のHEV Z（2WD）にHEV Z（E-Four）、G（2WD／E-Four）、X（2WD／E-Four）の5販売単位を追加した。価格は税込279万6,200円〜425万1,500円で、公式価格表の「2026年7月現在」の参考価格を`catalogAsOf`／`priceEffectiveAt`へ反映した。Xは公式Webカタログで法人向けグレードとして掲載されるため、通常小売との販売チャネル差をグレード名・公式カタログ根拠に残した。個別の発売日は確認できないため6単位の`salesUnitIntroducedAt`はnull、注文可否は全6単位とも`unknown`とした。

全6単位で全車速追従レーダークルーズコントロール（前後方向）とLTA（左右方向）を確認し、国土交通省の定義に照合したサイト上のLevel 2相当として登録した。ZのLCAは標準記載があるが、既存レコードとの能力比較契約を変更しないため今回の共通能力タグには付与していない。全車でステアリング保持・常時監視が必要で、ハンズオフ不可。PHEV G／ZとKINTO専用Uは、価格の性質と販売チャネルが異なるため今回の通常HEVトランシェから分離して確認継続とする。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| プリウス現行価格・グレード、HEV Z/G/Xの2WD・E-Four価格 | トヨタ自動車 | https://toyota.jp/prius/grade/ | 2026-09-11 |
| 2026年7月主要諸元・装備表 | トヨタ自動車 | https://toyota.jp/pages/contents/prius/005_p_001/pdf/prius_spec_202607.pdf | 2026-09-11 |
| ACC・LTA・手放し継続時の警告と解除 | トヨタ自動車 | https://toyota.jp/prius/safety/ / https://manual.toyota.jp/prius/3066/hev/ja_JP/contents/vhch04se050404.php | 2026-09-11 |
| Level 2の定義 | 国土交通省 | https://www.mlit.go.jp/common/001343740.pdf | 2026-09-11 |

## 2026-09-11 Toyota ヤリス追加トランシェ

トヨタ公式の現行ヤリス商品ページ（modelId 53）とグレードJSON（19エントリ）を照合した。Uグレード2単位（ハイブリッド車 2WD／E-Four）は公式ページがKINTO月額のみを案内し、他グレードの車両本体価格表に含まれないため、価格比較可能な17単位を公開カタログへ登録した。Uの月額料金を車両本体価格へ換算する推測は行わず、確認継続候補として内部に残す。公開17単位の税込メーカー希望小売価格は169万7,300円〜288万4,200円で、グレードJSONの価格を各販売単位へ直接結び付けた。主要諸元・装備表の適用月を`catalogAsOf=2026-04`へ保持し、ページで販売単位別の発売日・価格適用日・注文受付を固定できないため、`salesUnitIntroducedAt`／`priceEffectiveAt`はnull、`availability=unknown`とした。

安全ページのグレード別装備を能力差として分離した。ハイブリッド全6単位と1.5LガソリンCVTの6単位は全車速追従ACCとLTA（車線中央維持支援）が標準で、国土交通省のLevel 2定義へ照合したサイト上の分類をLevel 2相当とした。ハイブリッド6単位は停止保持・先行車／第二先行車検知を伴う渋滞時支援を追加した。1.0LガソリンCVTのG／X 2単位はブレーキ制御付ACCを確認できる一方、LTA標準装備の公式根拠を確認できないためLevel 1（前後方向の支援）とした。1.5L 6MTはLTAとACCの同時支援を確認できるためLevel 2相当だが、停止後はシステムが解除される。安全ページにあるウインカー操作時の予備加減速は自動車線変更ではないため、`lane_change_support`能力には含めていない。全17単位でステアリング保持と運転者の常時監視が必要なため、ハンズオフは不可とした。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| ヤリス現行商品ページとmodelId 53 | トヨタ自動車 | https://toyota.jp/yaris/ | 2026-09-11 |
| Z／G／X、Uを含む19エントリと17単位の税込車両本体価格 | トヨタ自動車 | https://toyota.jp/pages/contents/include/carpage_format/carlineup/data/json/grades53.json | 2026-09-11 |
| ACC・LTA・渋滞時支援のグレード別標準装備、車線変更時の予備加減速 | トヨタ自動車 | https://toyota.jp/yaris/safety/ | 2026-09-11 |
| 2026年4月の主要諸元・装備表 | トヨタ自動車 | https://toyota.jp/pages/contents/yaris/001_p_001/pdf/yaris_spec_202604.pdf | 2026-09-11 |
| LTAはレーダークルーズと併用し運転者がステアリングを保持 | トヨタ自動車 | https://manual.toyota.jp/yaris/2603/hev/ja_JP/contents/vhch04se050404.php | 2026-09-11 |
| Level 2の定義（運転者主体の前後・左右支援） | 国土交通省 | https://www.mlit.go.jp/common/001343740.pdf | 2026-09-11 |

ヤリス17単位は公式商品ページと見積り導線を保持するが、個別販売単位の現在の注文受付を確認できないため注文可能とは表示しない。Level 1の2単位を一覧へ含めたことで、これまで「対象外」としていたLevel 1を実データで絞り込めるようにした。Level 2内でもハイブリッドの渋滞時支援、1.5LガソリンのLTA、1.0LのACCのみを別能力として比較できる。

Volvo EX30は、日本向け2027年モデルの2026年第29週生産分以降の諸元・価格表で3グレードとPilot Assist、全車速追従ACC、ドライバーモニタリングを確認した。Pilot Assistは速度・車間と操舵を支援する一方、取扱説明書が運転者に両手保持と即時介入を求めるため、Level 2相当の運転支援として登録した。税込車両本体価格は479万〜629万円で、価格適用時点は2026年7月、確認日は2026-09-07。価格根拠は内部保持し、価格表示機能はIssue #16で一貫した価格契約を実装してから公開する。

Suzuki e VITARAは、現行価格ページと2025年9月16日付の日本発売資料でX 2WD / Z 2WD / Z 4WDの3販売単位、発売日2026-01-16、価格399万3000円 / 448万8000円 / 492万8000円を確認した。公式取扱説明書で車線維持支援中もステアリング保持が必要で、操作がないと警告後に機能を一時停止するため、全3単位のhandsOffを`not_allowed`と確定した。価格適用開始日は公式情報で確認できないため `priceEffectiveAt=null` とした。

Renault ARKANAは、現行価格表でesprit AlpineとtechnoのFULL HYBRID E-TECH / MILD HYBRIDを4販売単位として確認した。価格は順に514万9000円、474万9000円、484万円、444万円で、価格の適用開始日は公式資料から確認できないため `priceEffectiveAt=null` とした。2025年7月のesprit Alpine資料と2025年9月のtechno資料をカタログ適用時点として保持し、資料年をモデル年にはしない。公式機能説明・装備資料でACC（ストップ＆ゴー機能付）とレーンセンタリングアシストの標準装備を確認し、国土交通省のLevel 2定義に照合してLevel 2相当と分類した。ACCはおおむね0〜170km/h、レーンセンタリングアシストは先行車ありでおおむね0〜160km/h、先行車なしでおおむね60〜160km/hと記載されるが、車線・先行車認識等の条件がある。公式取扱説明書は常にハンドルを握ることを求め、反応がない場合は警告後にレーンセンタリングを解除するため、全4単位のhandsOffを`not_allowed`と確定した。

BMW 3シリーズは、2026年7月以降生産の日本向け装備・価格表から通常カタログのセダンG20 5単位とツーリングG21 4単位を登録した。メーカー希望小売価格はセダン688万〜992万円、ツーリング716万〜1027万円で、同資料の適用月を `catalogAsOf` と `priceEffectiveAt` に保持した。全9単位でドライビング・アシスト・プロフェッショナルを標準装備し、ACCとステアリング＆レーン・コントロール・アシストをLevel 2相当と分類した。速度域は現行資料がオーナーズ・ハンドブック参照としているため数値を転用せず不明とした。高速道路渋滞時は条件付きハンズオフに対応するが、通常支援は少なくとも片手保持、運転者の常時注意と即時操作責任が必要。Edition Shadow、M3、50周年限定車は別販売単位として受注・在庫状況の確認待ちに残し、BMW全仕様の網羅とは扱わない。

MINI Countrymanは、2026年7月以降生産の日本向け装備・価格表から通常8販売単位を登録した。税込車両本体価格はC SELECT 480万円、C 518万円、D 526万円、S ALL4 SELECT 553万円、S ALL4 592万円、JOHN COOPER WORKS COUNTRYMAN ALL4 683万円、E 604万円、SE ALL4 678万円。全車でドライビング・アシスタント・プラス（ACC Stop & Go＋ステアリング＆レーン・コントロール）を標準装備として確認した。C SELECT / S ALL4 SELECTはドライビング・アシスタント・プロフェッショナルの標準装備記載がなく条件付きハンズオフには非対応、残り6単位は同機能を標準装備し高速道路渋滞時0〜約60km/hの条件付きハンズオフとして分類した。残り6単位は一覧フィルターでも `roadTypes=["高速道路"]` として扱い、C SELECT / S ALL4 SELECTの対象道路は引き続き不明とした。通常支援の数値速度・ハンズオン要件と、能動ドライバーモニタリング機能は公式資料で確認できないため推定せず、`speedKph`はnull、`driverMonitoring=required`のみ保持した。C SELECTは2026-03-03、S ALL4 SELECTは2026-07-13に販売開始。C / S ALL4は2026-03-03に48Vマイルド・ハイブリッド仕様へ改定、D / JOHN COOPER WORKSは2023-11-21発表、E / SE ALL4は2024-03-01販売開始。Shadow Editionは限定車候補、Slate Blueは特別企画のため通常8単位へ含めず保留とした。

## 時系列の正規化

資料の発行年・確認日をモデル年として公開しない。メーカーがモデル年を明示したHonda ACCORD（2025）、Honda LEGEND（2021）、Volvo EX30（2027）だけ `modelYear` を設定し、日産アリア、セレナ、SUBARUレイバック、Teslaは `modelYear=null` とした。セレナは一次資料の型式世代呼称 `C28` を `generation` に保持する。カタログ適用時点、販売単位導入時点、価格適用時点は月精度を含めて独立フィールドに保持し、日付がないものはnullとする。

## 日産アリア B6 の注文可否根拠（2026-09-11確認）

日産アリアの現行日本向けページに、B6（2WD）を「日産各店で注文できる」対象として掲載し、「11/26より注文受付中」と明記している。現行グレード表と価格データにもB6（2WD）6,675,900円が存在するため、B6販売単位だけ `availability=new_order_available`、`availabilityCheckedAt=2026-09-11` とした。B6 e-4ORCE、B9、B9 e-4ORCEは同ページに現行価格・グレードがあるものの、注文受付中の明示がB6に限定されるため `unknown` のまま残す。

この判定は日産各店での注文受付を示すもので、在庫・工場出荷後の納期・販売店ごとの受注継続・契約成立を保証しない。「WEB予約受付中」の限定仕様は既存4販売単位と一致しないため、通常販売単位の注文可否へ流用していない。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| 現行ページに「日産各店で注文できるB6」「11/26より注文受付中」、B6（2WD）の掲載 | 日産自動車 | https://www3.nissan.co.jp/vehicles/new/ariya.html | 2026-09-11 |
| B6（2WD）を含む各車の注文後の工場出荷時期目処 | 日産自動車 | https://www3.nissan.co.jp/siteinfo/product.html | 2026-09-11 |

## Audi A5 / A5 Avantの根拠（2026-09-11確認）

Audi Japanの2026年4月価格表とA5 / A5 Avant公式商品ページ、装備説明・Product Informationを突き合わせ、セダンとAvantの各パワートレーンを6販売単位として登録した。TFSIは2025年2月17日、TDIは2025年6月24日の日本発売日を公式プレスリリースで確認し、販売単位の導入時点へ反映した。価格は税込メーカー希望小売価格で、販売店の値引き・諸費用・オプションは含まない。現行商品ページの掲載は確認できたが、販売単位ごとの現在の注文受付を一次情報で固定できなかったため、`availability=unknown`を維持した。

| 販売単位 | 価格（税込） | Level | 同じLevel 2内で比較できる差分 |
|---|---:|---:|---|
| A5 TFSI 110kW | 617万円 | 2相当 | セダンの価格下限。アダプティブクルーズアシストプラス標準 |
| A5 TFSI quattro 150kW | 700万円 | 2相当 | quattro 4WD。価格表上位の150kW仕様 |
| A5 TDI quattro 150kW | 735万円 | 2相当 | quattro 4WDディーゼル。価格表上位の150kW仕様 |
| A5 Avant TFSI 110kW | 642万円 | 2相当 | Avantの価格下限。アダプティブクルーズアシストプラス標準 |
| A5 Avant TFSI quattro 150kW | 725万円 | 2相当 | quattro 4WD。セダン同出力仕様より25万円高い |
| A5 Avant TDI quattro 150kW | 760万円 | 2相当 | quattro 4WDディーゼル。6単位中の価格上限 |

公式説明のアダプティブクルーズアシストプラス（車間・車速）とレーンガイダンス（車線中央維持）の同時支援を、国土交通省のLevel 2定義に照合してサイト上はLevel 2相当と分類した。レーンチェンジアシストはウインカー操作と周囲確認を前提に車線変更を支援する機能であり、自動運転や無人走行を意味しない。全6単位でステアリング保持・前方監視・必要時の操作が必要なため、ハンズオフは不可とした。販売単位別の作動速度上限は公式資料で固定できないため未設定とし、天候・道路・車線認識条件による制限を明記している。

| 対象事実 | 一次ソース |
|---|---|
| A5 / A5 Avantのモデル掲載 | [Audi A5 Press Center](https://www.audi-press.jp/models/a5/index.html) |
| A5 / A5 Avantのアダプティブクルーズアシストプラス、車線中央維持、レーンチェンジアシスト、6販売単位の税込メーカー希望小売価格（2026年4月） | [Audi Japan 2026年4月更新プレスリリース](https://www.audi-press.jp/press-releases/2026/s5n52g00000061vq.html) |
| A5 / A5 Avant TFSIの日本発売日（2025年2月17日） | [Audi Japan Press Center](https://www.audi-press.jp/press-releases/2025/s5n52g0000002avz.html) |
| A5 / A5 Avant TDIの日本発売日（2025年6月24日） | [Audi Japan Press Center](https://www.audi-press.jp/press-releases/2025/s5n52g0000003ck6.html) |
| A5 / A5 Avantの装備仕様、レーンガイダンス・レーンチェンジアシスト | [Audi Japan 2026年4月更新プレスリリース](https://www.audi-press.jp/press-releases/2026/s5n52g00000061vq.html)、[Product Information PDF](https://productinfo.audi.co.jp/related_link/197/top/460/pdf/A5_S5_Product_Information.pdf) |
| Level 2の定義との照合 | [国土交通省 自動走行レベルの定義](https://www.mlit.go.jp/common/001343740.pdf) |

## 2026-09-11 注文状態の追加確認

注文可否は「公式商品ページがある」だけでは更新せず、メーカー一次情報に注文・出荷・在庫車両の注文導線がある販売単位だけを更新した。販売店ブログや検索結果スニペットは根拠に採用していない。

| 販売単位 | 判定 | 一次情報と判定範囲 |
|---|---|---|
| SUBARU レイバック Limited EX | `unknown` | SUBARU公式で注文済み新車のレイバック1.8Lグレード（2ヵ月程度）の工場出荷目処を掲載。ただし現在の受注可否・納期は販売店確認 |
| Volvo EX30 2027 3グレード | `new_order_available` | Volvo公式Q&AがEX30について車両選択から契約・申込金支払いまでのオンライン手順を明記。仕様・在庫・納車時期は個別変動 |
| Lexus LM500h EXECUTIVE / version L | `unknown` | Lexus公式の「ご注文から納車までの流れ」に両グレードの注文後工場出荷目処5.5〜6.0ヶ月を掲載。ただし現在の受付導線を直接確認できず、輸送・販売店準備・受注状況で変動 |
| Hyundai IONIQ 5 Voyage / Lounge | `new_order_available` | ヒョンデ公式新車在庫ページの掲載車両に「車両注文」ボタンを確認。在庫・色・仕様が変動し、グレード全体の常時受注を保証しない |
| Hyundai IONIQ 5 Voyage L / Lounge AWD | `unknown` | 公式価格・装備は確認できるが、同じ新車在庫ページで該当グレードの注文導線を固定できなかったため昇格しない |
| Suzuki e VITARA 3グレード | `unknown` | メーカー公式商品ページは現行掲載・価格まで。販売店ブログの注文記載は全国受注の根拠に採用しない |

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| レイバック1.8Lグレードの注文済み新車・工場出荷目処 | SUBARU | https://www.subaru.jp/news/delivery/ | 2026-09-11 |
| EX30のオンライン車両選択・契約・申込金支払い、EX30のみオンライン契約可能 | ボルボ・カー・ジャパン | https://www.volvocars.com/jp/l/electric-qa/ | 2026-09-11 |
| LM500h EXECUTIVE / version Lの注文後工場出荷目処 | Lexus | https://lexus.jp/news/info/delivery/index.html | 2026-09-11 |
| IONIQ 5 Voyage / Lounge掲載車両の「車両注文」導線 | Hyundai Mobility Japan | https://www.hyundai.com/jp/stock/new | 2026-09-11 |

この更新後の内訳は、全265販売単位（現行264、過去1）のうち`new_order_available` 21、`unknown` 243、`unavailable` 1。未確認は現在の注文受付を直接確認できないものを含み、国内全候補の網羅を意味しない。


## 未掲載・確認継続候補（内訳）

| 候補 | 未確認の理由 | 次回確認先 |
|---|---|---|
| Tesla Model S / Model X | 2026-09-11再確認。日本向け現行価格表・グレード・注文導線がなく、Model Xの商品URLはTesla Japanトップへ遷移。公式マニュアルにACC／Autosteer／Auto Lane Changeはあるが、既存車両・アフターサービス情報から国内新車販売単位へは解決できないため対象外・保留 | Tesla Japanの現行デザインスタジオ・日本向け価格表・注文導線（再掲載時に再調査） |
| Toyota / Lexusの現行Toyota Safety Sense / Lexus Safety System+搭載車 | Toyota 20モデル、Lexus 12モデルをモデル候補まで確認。販売単位ごとの標準／オプション、仕様期、価格、取説の照合は未完 | 各ブランド日本公式カタログ・主要装備表・取扱説明書 |
| Mercedes-Benzの現行運転支援搭載車 | 日本仕様の販売単位と監視条件を未確認 | Mercedes-Benz Japan公式モデルページ・取扱説明書 |
| BMWの3シリーズ以外の現行Driving Assistant搭載車 | 日本仕様のグレード別装備を未確認 | BMW Japan公式モデルページ・取扱説明書 |
| Volvo EX30 2026年モデル4グレード | 公式ラインナップには残るが、2027年モデルへの切替後の新規受注／在庫販売区分を未確認 | Volvo Cars Japan公式ラインナップ・販売店注文条件 |
| VolvoのEX30以外の現行Pilot Assist搭載車 | 日本仕様のモデル年・必要装備を未確認 | Volvo Cars Japan公式モデルページ・取扱説明書 |
| Volkswagenの現行IQ.DRIVE搭載車 | 日本仕様のモデル年・販売状態を未確認 | Volkswagen Japan公式モデルページ・取扱説明書 |
| Hyundaiの現行HDA搭載車 | 日本向け販売単位・現行掲載を未確認 | Hyundai Mobility Japan公式モデルページ |
| Mitsubishi / Suzuki / Daihatsuの一次確認候補 | OUTLANDER PHEV 9単位とe VITARA 3単位は掲載済み。ECLIPSE CROSS、eKクロス、eKクロス EV、eKスペース、デリカミニ等はMI-PILOTの標準／メーカーオプションと現行価格の販売単位展開を継続中 | 各社日本公式グレード表・装備表・取扱説明書 |
| BMW限定車 / Mモデル・MINIの一次確認候補 | BMW通常3シリーズ9単位とMINI Countryman通常8単位は掲載済み。BMW限定車・M3、MINI Countryman Shadow Edition / Slate Blueは通常単位と分けて確認待ち | 各社日本公式装備価格表・取扱説明書 |
| Audi / Mercedes-Benz / Porsche等 | モデル単位の支援機能は確認できるが、グレード別の標準／オプションと販売状態の確認が未完 | 各社日本公式装備価格表・コンフィギュレーター |

## 2026-09-11 Tesla Model S / Model X再確認

Tesla Model S／Model Xは、日本向けの現行新車販売単位として追加できる一次根拠がないため、2車種とも登録可能な販売単位を0件とした。Model Sの日本向け商品ページは確認できず、Model Xの`https://www.tesla.com/ja_JP/modelx`はTesla Japanトップへ遷移する。Tesla Japanの[補助金・エコカー減税ページ](https://www.tesla.com/ja_JP/support/incentives)に現行販売価格・注文リンクとして掲載されるのはModel 3、Model Y、Model Y Lで、S／Xは含まれない。

日本向けの[Model Sオーナーズマニュアル](https://www.tesla.com/ownersmanual/models/en_jp/)と[Model Xオーナーズマニュアル](https://www.tesla.com/ownersmanual/modelx/ja_jp/)にはTraffic-Aware Cruise Control、Autosteer、Auto Lane Changeの説明がある。しかしこれは既存車両やソフトウェアのサポート情報であり、現行国内の価格・グレード・注文可能性を証明しない。手放し不可・運転者監視が必要な組合せはLevel 2相当の暫定分類材料にはなるが、販売単位へ紐付ける根拠がないため公開データへ流用しない。

注文・納車サポートや延長保証ページにS／Xの名称が残る場合も、既存車両・アフターサービス対象を示すだけで現行新車販売の証拠とは扱わない。Tesla JapanがS／Xの国内価格表または注文可能なデザインスタジオを再掲載した時点で、価格・グレード・hardware／software・注文状態を再調査する。確認日: 2026-09-11。

この台帳の未確認ブランド／モデル群を確認するまでは、サイト全体の国内候補を「網羅」と主張しない。L1のみ、発売予定、過去車両、Level 4サービスは別区分として追加調査する。

### Toyota / Lexusの次回販売単位化候補（2026-09-08確認）

Toyotaの日本向け現行ラインアップと公式安全・主要装備資料から、レーダークルーズコントロール（全車速追従）とLTAの同時設定候補として、アクア、ヤリス、ヤリス クロス、カローラ、カローラ スポーツ、カローラ ツーリング、プリウス、シエンタ、ノア、ヴォクシー、アルファード、ヴェルファイア、クラウン、bZ4X、GRヤリス、RAV4、ハリアー、カローラ クロス、ランドクルーザー250、MIRAIの20モデルを抽出した。Lexus公式のLexus Safety System+対応車種比較では、LX、GX、RX、RZ、NX、UX、LBX、LS、ES、IS、LM、LCの12モデルにレーダークルーズコントロール（全車速追従）とLTAの設定がある。

これはモデル候補の棚卸しであり、公開済みのToyota／Lexus販売単位113件全体を網羅したという意味ではない。比較表の「設定あり」はメーカーオプションを含み得るため、グレード・パワートレーン・駆動方式ごとの標準／オプション、現行販売状態、価格、仕様期、作動条件を個別資料で照合するまで公開データへ追加しない。Toyota Roomy / Raize / Hilux / Land Cruiser 70 / GR86は両機能の現行販売単位を確定できず、クラウン スポーツ／エステート、GRカローラ、ランドクルーザー300も資料一式が不足するため保留する。

公式母集団入口: https://toyota.jp/carlineup/ 、https://toyota.jp/safety/scene/highway/index2.html 、https://lexus.jp/models/ 、https://lexus.jp/safety/compare/ 、https://lexus.jp/safety/highway1/ 。確認日2026-09-08。

## 一次確認済み・公開レコード化待ち

下表は公式日本サイトで縦方向と横方向の同時支援を確認した候補。ただし、販売単位ごとのモデル年、
資料適用期間、標準／オプション、価格適用日の正規化と独立レビューが未完のため、まだ公開件数へ含めない。

| メーカー | 確認済み候補 | 残作業 |
|---|---|---|
| Mazda | 掲載済み35単位（CX-80 8、CX-60 11、新型CX-5 4、MAZDA3 7、CX-30 4、MX-30 Natural Monotone 1） | MAZDA3 FASTBACK 15C / 15S・SEDAN 20S、CX-30 20C / 20S、MX-30 ROTARY-EVグレードはMRCCとCTSの同時支援を確定できず対象外。ROTARY-EV以外の限定仕様は別途確認 |
| Mitsubishi | OUTLANDER PHEV 9単位（掲載済み）、ECLIPSE CROSS、eKクロス、eKクロス EV、eKスペース、デリカミニ | OUTLANDER PHEV以外はMI-PILOTの標準／メーカーオプションとグレード別価格を固定 |
| Suzuki | FRONX、SOLIO/BANDIT、SWIFT CVT、SPACIA系（e VITARA 3単位は掲載済み） | ACC＋車線中央維持の対象グレードとパッケージを販売単位へ展開 |
| Daihatsu | MOVE、MOVE CANBUS、TANTO系、TAFT、ROCKY | Smart Cruise Packを含む標準／オプション差を販売単位へ展開 |
| BMW | 3シリーズ Sedan 5グレード、Touring 4グレード | 掲載済み。Edition Shadow、M3、50周年限定車は受注・在庫確認待ち |
| MINI | Countryman 8グレード | 2026年7月生産装備価格表から8販売単位を登録 |
| Renault | ARKANA 4グレード | 掲載済み。2025年7月 / 9月の資料適用時点をモデル年と分離して保持 |

MINI Countrymanの限定仕様は通常カタログ8単位へ混在させない。MINI COUNTRYMAN SHADOW EDITIONは限定車候補、MINI COUNTRYMAN SLATE BLUEは特別企画として、受注・仕様適用を別途確認する。

## 対象外・証拠不足として確認した例

| 候補 | 現時点の区分 | 理由 |
|---|---|---|
| Mazda2 / CX-3 | 対象外候補 | 車線中央維持を公式情報で確認できず、今回のLevel 2操作定義を満たさない |
| Mitsubishi デリカD:5 | 対象外候補 | 現行MI-PILOTのACC＋LKAの組合せを確認できない |
| Daihatsu Atrai | 対象外 | 商用車であり、今回の乗用車母集団外 |
| Daihatsu Thor / Mira e:S | 証拠不足 | ACCとLKCの同時作動を確認できない |
| Mazda MX-30 EV | 現行掲載未確認 | 現行ラインアップ掲載を確認できず、ROTARY-EVと混ぜない |
| Mazda MX-30 ROTARY-EV（ROTARY-EVグレード） | 対象外 | 2026年7月主要諸元・装備表でMRCCは標準だがCTSは「—」。縦横同時支援を確定できないため、Natural Monotoneのみ公開 |
| Toyota Roomy / Raize / Hilux / Land Cruiser 70 / GR86 | 証拠不足 | LTA＋全車速ACCの現行グレード根拠が不足 |
| Hyundai IONIQ 5 | 掲載済み（4販売単位） | 価格ページ・2026年6月公式カタログでVoyage L／Voyage／Lounge／Lounge AWDとHDA/HDA2を照合。日本向け販売単位別の新車注文可否・HDA速度は未確認のため、availabilityと速度範囲はunknown |

## Mazdaの根拠（今回追加、内部保持）

確認日は2026-09-08。以下はすべてMazda Japanの現行モデル／グレード・価格／安全ページと主要諸元・装備表で、販売単位、MRCC（縦方向）とCTS（横方向）、運転者監視・即時介入、標準／メーカーオプション、価格を照合した。販売単位導入日と価格適用日は資料に明記がないためnullまたは不明で保持し、推測していない。

| 対象 | 現行ページ | グレード・価格 | 主要諸元・装備表 | セーフティ |
|---|---|---|---|---|
| CX-80 | https://www.mazda.co.jp/cars/passenger/cx-80/ | https://www.mazda.co.jp/cars/passenger/cx-80/grade/ | https://www.mazda.co.jp/content/dam/mazda/official/mazda-co-jp/cars/cx-80/common/pdf/cx-80_specification_202603.pdf | https://www.mazda.co.jp/cars/passenger/cx-80/safety/ |
| CX-60 | https://www.mazda.co.jp/cars/passenger/cx-60/ | https://www.mazda.co.jp/cars/passenger/cx-60/grade/ | https://www.mazda.co.jp/content/dam/mazda/official/mazda-co-jp/cars/cx-60/common/pdf/cx-60_specification_202603.pdf | https://www.mazda.co.jp/cars/passenger/cx-60/safety/ |
| 新型CX-5 | https://www.mazda.co.jp/cars/passenger/cx-5/ | https://www.mazda.co.jp/cars/passenger/cx-5/grade/ | https://www.mazda.co.jp/content/dam/mazda/official/mazda-co-jp/cars/cx-5/common/pdf/cx-5_specification_202605.pdf | https://www.mazda.co.jp/cars/passenger/cx-5/safety/ |
| MAZDA3 | https://www.mazda.co.jp/cars/passenger/mazda3/ | https://www.mazda.co.jp/cars/passenger/mazda3/grade/ | https://www.mazda.co.jp/content/dam/mazda/official/mazda-co-jp/cars/mazda3/common/pdf/mazda3_specification_202607.pdf | https://www.mazda.co.jp/cars/passenger/mazda3/safety/ |
| CX-30 | https://www.mazda.co.jp/cars/passenger/cx-30/ | https://www.mazda.co.jp/cars/passenger/cx-30/grade/ | https://www.mazda.co.jp/content/dam/mazda/official/mazda-co-jp/cars/cx-30/common/pdf/cx-30_specification_202607.pdf | https://www.mazda.co.jp/cars/passenger/cx-30/safety/ |
| MX-30 ROTARY-EV | https://www.mazda.co.jp/cars/passenger/mx-30/ | https://www.mazda.co.jp/cars/passenger/mx-30/grade/ | https://www.mazda.co.jp/content/dam/mazda/official/mazda-co-jp/cars/mx-30/common/pdf/mx-30_specification_202607.pdf | https://www.mazda.co.jp/cars/passenger/mx-30/safety/ |

CX-80 8単位とCX-60 11単位はMRCC・CTS・ドライバー・モニタリングを標準装備として確認した。新型CX-5はS、G標準、G EX Package、Lの4単位を掲載した。G標準は基本CTSでハンズオフ不可、G EX PackageとLはドライバー・モニタリング連動CTS、車線変更アシスト、高速道路・自動車専用道路の渋滞時ハンズオフアシストを備える。MAZDA3はFastback 25S / 25L / X Touringを6EC-ATと6MTに分け、Sedan 25Lと合わせて7単位とした。6EC-ATは全車速追従機能付MRCC、6MTは通常MRCCとして区別した。CX-30は20G / 20 Air Edition / 25L / 25 Air Editionを掲載した（20GのCTS等はメーカーオプション、他3単位は標準）。MX-30はNatural MonotoneだけがCTS標準で、ROTARY-EVグレードは装備表でCTS「—」のため対象外とした。全掲載単位で運転者の常時監視と必要時の即時介入を明記し、CX-5 G EX Package / L以外はハンズオフ不可とした。道路条件・速度上限が公式資料で確定できない場合は不明のまま保持した。

## Teslaの根拠（内部保持）

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| Model 3の日本向け現行ページ、「今すぐ注文」導線、オートパイロットは同一車線の操舵・加速・ブレーキを支援しドライバー監視が必要 | Tesla Japan | https://www.tesla.com/ja_jp/model3 | 2026-09-10 |
| Model Yの日本向け現行ページ、「今すぐ注文」導線、ドライバー監視下のドライビングアシスト | Tesla Japan | https://www.tesla.com/ja_JP/modely | 2026-09-10 |
| Model 3 / Model Y各3販売仕様の公式ベースプライス（2026年6月26日現在） | Tesla Japan | https://www.tesla.com/ja_JP/support/incentives | 2026-09-10 |
| Model S / Xの日本向け車両情報・オートパイロット導線 | Tesla Japan | https://www.tesla.com/ja_jp/support/meet-your-tesla/model-s / https://www.tesla.com/ja_jp/support/meet-your-tesla/model-x | 2026-09-07 |
| Teslaの注文後の手続き、各モデルの注文可能なトリムと納車予定時期はDesign Studioで確認 | Tesla Japan | https://www.tesla.com/ja_jp/support/faq | 2026-09-10 |
| Teslaの機能は完全自動運転ではなく、常に注意し直ちに運転を代われる準備が必要 | Tesla Japan | https://www.tesla.com/ja_jp/support/meet-your-future-tesla-faq | 2026-09-07 |

## Suzuki e VITARAの根拠（内部保持）

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| 現行3販売単位と価格（X 2WD 3,993,000円、Z 2WD 4,488,000円、Z 4WD 4,928,000円） | スズキ株式会社 | https://www.suzuki.co.jp/car/evitara/detail/ | 2026-09-07 |
| e VITARAを2026年1月16日より日本で発売、3販売単位の価格表 | スズキ株式会社 | https://www.suzuki.co.jp/release/a/2025/0916/index.html | 2026-09-07 |
| ACC全車速追従・停止保持、ACC作動中の車線維持支援、高速道路・自動車専用道路、0km/h以上のACC作動条件、運転支援・安全運転注意、ドライバーモニタリング | スズキ株式会社 | https://www.suzuki.co.jp/car/evitara/safety/ | 2026-09-07 |
| 車線維持支援・ACC全車速追従／停止保持・ドライバーモニタリングシステムの全車標準装備 | スズキ株式会社 | https://www.suzuki.co.jp/car/evitara/detail/pdf/detail.pdf?2026040706= | 2026-09-07 |

## Renault ARKANAの根拠（内部保持）

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| 現行4販売単位と価格（esprit Alpine FULL HYBRID E-TECH 5,149,000円、esprit Alpine MILD HYBRID 4,749,000円、techno FULL HYBRID E-TECH 4,840,000円、techno MILD HYBRID 4,440,000円） | ルノー・ジャポン | https://dcms.renault.jp/car_lineup/pricelist.php | 2026-09-07 |
| ARKANAのハイウェイ＆トラフィックジャムアシスト、ACC（ストップ＆ゴー機能付）とレーンセンタリングアシストの作動条件・注意事項 | ルノー・ジャポン | https://www.renault.jp/car_lineup/arkana/ | 2026-09-07 |
| esprit Alpineの仕様・装備適用時点、ACC・レーンセンタリングアシスト標準装備 | ルノー・ジャポン | https://www.renault.jp/car_lineup/arkana/gps_pdf/ARKANA_ea_webspec.pdf | 2026-09-07 |
| technoの仕様・装備適用時点、ACC・レーンセンタリングアシスト標準装備 | ルノー・ジャポン | https://www.renault.jp/car_lineup/arkana/gps_pdf/ARKANA_techno_webspec.pdf | 2026-09-07 |

## BMW 3シリーズの根拠（内部保持）

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| セダンG20の通常5販売単位、税込688万〜992万円、全モデルのドライビング・アシスト・プロフェッショナル標準装備、運転者責任・片手保持・高速道路渋滞時ハンズオフ、2026年7月以降生産 | ビー・エム・ダブリュー株式会社 | https://www.bmw.co.jp/content/dam/bmw/marketJP/bmw_co_jp/pdf/all-models/3/3series_Sedan_EPL_202607V1.pdf.asset.1784184000307.pdf | 2026-09-07 |
| ツーリングG21の通常4販売単位、税込716万〜1027万円、全モデルのドライビング・アシスト・プロフェッショナル標準装備、運転者責任・片手保持・高速道路渋滞時ハンズオフ、2026年7月以降生産 | ビー・エム・ダブリュー株式会社 | https://www.bmw.co.jp/content/dam/bmw/marketJP/bmw_co_jp/pdf/all-models/3/3series_Touring_EPL_202607V1.pdf.asset.1784183994213.pdf | 2026-09-07 |
| セダンG20 / ツーリングG21の日本向け現行モデルページ | ビー・エム・ダブリュー株式会社 | https://www.bmw.co.jp/ja/all-models/3-series/bmw-3-series-sedan/bmw-3-series-sedan.html / https://www.bmw.co.jp/ja/all-models/3-series/3-series-touring/bmw-3-series-touring.html | 2026-09-07 |
| ACCの車速・車間支援と、高速道路渋滞時ハンズオフの機能概要・運転者責任 | ビー・エム・ダブリュー株式会社 | https://www.bmw.co.jp/ja/topics/brand-and-technology/technology/visionary_safety/scene.html | 2026-09-07 |

## MINI Countrymanの根拠（内部保持）

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| 通常8販売単位、税込480万〜683万円、全車共通のドライビング・アシスタント・プラス、販売単位別のプロフェッショナル標準装備、2026年7月以降生産 | ビー・エム・ダブリュー株式会社 / MINI Japan | https://www.mini.jp/content/dam/MINI/marketJP/mini_jp/home/catalog/MINI_COUNTRYMAN_EPL_2607_seisankaitei.pdf.asset.1786065168368.pdf | 2026-09-07 |
| 第3世代Countrymanの現行モデル、通常モデルと電気自動車のラインアップ | MINI Japan | https://www.mini.jp/ja_JP/home/range/new-mini-countryman.html | 2026-09-07 |
| ACC、ステアリング＆レーン・コントロール、0〜約60km/hの高速道路渋滞時ハンズオフ、運転者責任と気象・道路条件による限界 | MINI Japan | https://www.mini.jp/ja_JP/home/function_performance/safety_security.html | 2026-09-07 |
| C SELECT / C / S ALL4の48Vマイルド・ハイブリッド仕様を2026年3月3日から販売開始 | ビー・エム・ダブリュー株式会社 / MINI Japan | https://www.mini.jp/ja_JP/home/news_events/articles/press_release/20260303_The_MINI_Countryman_C_Select_MINI_Countryman_C_and_MINI_Countryman_S_ALL4_feature_a_48V_mild_hybrid_system_detail.html | 2026-09-07 |
| S ALL4 SELECTを2026年7月13日から販売開始、同年9月以降納車予定、プラス標準装備 | ビー・エム・ダブリュー株式会社 / MINI Japan | https://www.mini.jp/ja_JP/home/news_events/articles/press_release/20260713_add_mini_countryman_s_all4_select.html | 2026-09-07 |
| D / S ALL4 / JOHN COOPER WORKSを含む第3世代を2023年11月21日に発表・予約開始 | ビー・エム・ダブリュー株式会社 / MINI Japan | https://www.mini.jp/ja_JP/home/news_events/articles/press_release/20231121_The_new_MINI_Countryman_is_launched_detail.html | 2026-09-07 |
| E / SE ALL4を2024年3月1日から販売開始 | ビー・エム・ダブリュー株式会社 / MINI Japan | https://www.mini.jp/ja_JP/home/news_events/articles/press_release/20240301_the_new_mini_countryman_electric_car_is_born_detail.html | 2026-09-07 |

## Toyota ノア / Lexus RZの根拠（内部保持）

確認日は2026-09-10。ノアは公式の現行グレードJSONで確認できるHEV 8販売単位へ展開した。
S-Z／S-Gはアドバンスト ドライブ等セット、LCA、ドライバーモニターカメラの有無と価格を分け、
S-Xは設定なしとしている。新車注文可否・発売日は公式ページで販売単位に固定できないため、8単位とも
`unknown` / null のまま保持し、推測していない。RZは引き続き1単位で、ハンズオフ条件は未確認のままとした。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| ノア現行HEV 8単位（S-Z/S-G/S-X、2WD/E-Four、7/8人）の名称・税込価格 | トヨタ自動車 | https://toyota.jp/pages/contents/include/carpage_format/carlineup/data/json/grades16.json | 2026-09-10 |
| ノアのアドバンスト ドライブ等セット：S-Z 122,100円／S-G 78,100円（税込）、LCA・ドライバーモニターカメラを含む設定、S-Xは設定なし | トヨタ自動車 | https://toyota.jp/pages/contents/noah/004_p_001/pdf/noah_spec_202609.pdf | 2026-09-10 |
| ノアのレーダークルーズコントロール、LTA、対象道路・速度・ステアリング保持条件 | トヨタ自動車 | https://toyota.jp/noah/safety/ | 2026-09-10 |
| ノアHEVのアドバンスト ドライブ作動条件、運転者監視、手放し継続時の制限 | トヨタ自動車 | https://manual.toyota.jp/noah/2509/hev/ja_JP/contents/vhch04se050415.php | 2026-09-10 |
| RZ500e “version L” AWD 8,500,000円（税込） | Lexus | https://lexus.jp/models/rz/features/price_package/ | 2026-09-10 |
| RZ現行ラインアップとRZ500e “version L”の掲載 | Lexus | https://lexus.jp/models/rz/ | 2026-09-10 |
| RZのLexus Safety System＋、全車速追従機能付DRCC・LTA、ドライバーモニター連携 | Lexus | https://lexus.jp/models/rz/features/safety/ | 2026-09-10 |
| RZのLTA作動条件・運転者監視・操作責任 | Lexus | https://manual.lexus.jp/rz/3079/bev/ja_JP/contents/owx1740487964005.php | 2026-09-10 |

ノアのS-Z/S-GはAdvanced Drive等セットの対象条件（高速道路本線の渋滞時・約40km/h以下等）では
ハンズオフが可能だが、運転者の前方監視と必要時の操作が必要なため `allowed_in_conditions` とした。
LCA（レーンチェンジアシスト）は別の速度域（約85〜130km/h）で作動するため、Advanced Driveの渋滞時支援と同じ機能として扱わない。
また、非PlusディスプレイオーディオではT-Connect／コネクティッドナビ契約終了後に地図情報が使えず、Plusは継続使用できる場合があるが地図更新は停止するため、契約・地図条件を必要パッケージと制限事項へ明記した。
汎用LTAの手保持要求とAdvanced Driveの条件付きハンズオフを混同しない。S-XはAdvanced Drive設定がなく、渋滞時支援の0〜約40km/hを適用せず速度範囲を未確認として `not_allowed` とした。価格は任意オプションを車両本体へ加算せず、追加パッケージとして別表示する。

## Toyota プリウス / Lexus NXの根拠（内部保持）

確認日は2026-09-10。Toyotaの現行プリウスから2026年7月仕様のZ（2WD）、Lexusの現行NXからNX350h “version L” 2WDを、価格・グレードページ、安全ページ、取扱説明書で販売単位化した。どちらも全車速追従ACCと車線中央維持支援の組合せを確認できるため、国土交通省の定義へ照合してサイト上はLevel 2相当とした。公式の現行掲載と見積り導線は確認できるが、販売単位ごとの新車注文可否を明文で固定できないため `availability=unknown` のまま保持する。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| プリウス日本向け現行商品ページ、安全運転支援装置が運転支援である旨 | トヨタ自動車 | https://toyota.jp/prius/ | 2026-09-10 |
| プリウス Z（2WD）3,998,500円、2026年7月現在の参考価格、WEB見積り・販売店導線 | トヨタ自動車 | https://toyota.jp/prius/grade/ | 2026-09-10 |
| プリウス Toyota Safety Sense、全車速追従レーダークルーズコントロール、LTA、ステアリング保持条件 | トヨタ自動車 | https://toyota.jp/prius/safety/ | 2026-09-10 |
| プリウス HEV 2026.07～ LTAの作動条件、高速道路・自動車専用道路、手放し継続時の警告・解除 | トヨタ自動車 | https://manual.toyota.jp/prius/3066/hev/ja_JP/contents/vhch04se050404.php | 2026-09-10 |
| NX日本向け現行ラインアップとNX350h “version L” | Lexus | https://lexus.jp/models/nx/ | 2026-09-10 |
| NX350h “version L” 2WD（FF）6,376,000円、見積りシミュレーション | Lexus | https://lexus.jp/models/nx/features/price_grade/ | 2026-09-10 |
| NX Lexus Safety System＋、全車速追従レーダークルーズコントロール・LTA、ステアリング保持条件 | Lexus | https://lexus.jp/models/nx/features/safety/ | 2026-09-10 |
| NX350h LTAの作動条件、高速道路・自動車専用道路、手放し継続時の警告・解除 | Lexus | https://manual.lexus.jp/nx/3050/hev/ja_JP/contents/reb1668054515740.php#yaw1609986159221 | 2026-09-10 |

プリウスはToyota公式安全ページに「ステアリングを持ち続ける必要」が明記されているため `handsOff=not_allowed` とした。NXもLexus公式安全ページ・取扱説明書の同様の注意から `handsOff=not_allowed`、運転者監視を `required` とした。速度の数値範囲や販売単位別の注文可否は、確認できたページで固定できないため未確認のままにし、資料発行年をモデル年へ流用していない。プリウスは公式ページが2026年7月仕様を明示するため `modelYear=2026`、`catalogAsOf=2026-07`、`priceEffectiveAt=2026-07` とし、個別の発売日・導入日は確認できないため `salesUnitIntroducedAt=null` とした。NXは適用時点を公式ページで固定できないためnullとした。

## Toyota クラウン（クロスオーバー） / Lexus LBX・RXの根拠（後発対策トランシェ）

確認日は2026-09-10。後発サービスが「Level 2」というラベルだけを模倣しても比較価値が残るよう、渋滞時にどこまで支援するか、車線変更支援、ドライバーモニター、車両本体価格を同じ販売単位へ結び付けた。いずれも公式商品ページの掲載は確認できるが、販売単位ごとの新車注文可否を明文で固定できないため `availability=unknown` とした。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| クラウン（クロスオーバー）CROSSOVER RS “THE LIMITED-MATTE METAL” 4WD 7,590,000円（税込、2026年9月現在） | トヨタ自動車 | https://toyota.jp/info/crowncrossover/special/ | 2026-09-10 |
| クラウンの全車速追従レーダークルーズ、LTA、LCA、ドライバーモニター、Advanced Drive（渋滞時支援）のRS標準装備 | トヨタ自動車 | https://toyota.jp/crowncrossover/safety/ | 2026-09-10 |
| クラウン 2026.09～のAdvanced Drive（0〜約40km/h、監視下の渋滞時支援） | トヨタ自動車 | https://manual.toyota.jp/crowncrossover/3143/hev/ja_JP/contents/vhch04se050415.php | 2026-09-10 |
| bZ4X Z（FWD）5,500,000円（税込） | トヨタ自動車 | https://toyota.jp/bz4x/specification/index.html | 2026-09-10 |
| bZ4Xの全車速追従レーダークルーズ、LTA、ZのLCA・Advanced Drive標準装備 | トヨタ自動車 | https://toyota.jp/bz4x/safety/ | 2026-09-10 |
| bZ4X 2026.07～のLTA/LCA作動条件とステアリング保持責任 | トヨタ自動車 | https://manual.toyota.jp/bz4x/2607/bev/ja_JP/contents/vhch05se040405.php | 2026-09-10 |
| LBX “Bespoke Build” 2WD 5,500,000円（税込、’26年5月現在） | Lexus | https://lexus.jp/models/lbx/features/price_package/ | 2026-09-10 |
| LBXの全車速追従レーダークルーズ、LTA、Advanced Drive、Bespoke BuildのLCA・ドライバーモニター標準装備 | Lexus | https://lexus.jp/models/lbx/features/safety/ | 2026-09-10 |
| LBX 2026.05～のLTA作動条件とステアリング保持責任 | Lexus | https://manual.lexus.jp/lbx/3091/cv/ja_JP/contents/vhch04se050405.php | 2026-09-10 |
| RX500h “F SPORT Performance” AWD 9,030,000円（税込） | Lexus | https://lexus.jp/models/rx/features/price_package/ | 2026-09-10 |
| RXの全車速追従レーダークルーズ、LTA、LCA、ドライバーモニター、Advanced Drive（渋滞時支援）全車標準 | Lexus | https://lexus.jp/models/rx/features/safety/ | 2026-09-10 |
| RXのLCA作動範囲（約70〜130km/h）とドライバーモニター、Advanced Drive 0〜40km/h | Lexus | https://lexus.jp/models/rx/pdf/rx_safety.pdf | 2026-09-10 |
| RX500hのLTA作動条件とステアリング保持責任 | Lexus | https://manual.lexus.jp/rx/2212/hev/ja_JP/contents/vhch04se050405.php | 2026-09-10 |

クラウン、LBX、RXは全車速追従ACCとLTAの同時支援を国土交通省のLevel 2定義へ照合し、サイト上はLevel 2相当とした。Advanced Driveは一部高速道路・自動車専用道路の渋滞時に限る条件付き支援で、運転者の常時監視と必要時の操作が必要。LCAは車線変更を自動化する機能ではなく、道路・速度・周辺車両などの条件がある。価格はオプションや諸費用を加算しない車両本体の税込参考価格として保持する。

## Toyota RAV4の根拠（後発対策トランシェ）

確認日は2026-09-10。RAV4は同じLevel 2でも、パワートレーン・グレードごとにAdvanced Drive、LCA、ドライバーモニターの標準／オプションが異なるため、ベース価格と能力差を4販売単位へ分離した。ベース車両にオプションを混ぜず、ハンズオフはすべて `not_allowed` としている。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| RAV4 Z（PHEV E-Four）6,000,000円、Z（HEV E-Four）4,900,000円、Adventure（HEV E-Four）4,500,000円、GR SPORT（PHEV E-Four）6,300,000円 | トヨタ自動車 | https://toyota.jp/rav4/grade/ | 2026-09-10 |
| RAV4現行商品・グレードの公式掲載 | トヨタ自動車 | https://toyota.jp/rav4/ | 2026-09-10 |
| 全車速追従レーダークルーズとLTA、Z/GR SPORTのLCA・Advanced Drive・ドライバーモニターはメーカーオプション、Adventureはドライバーモニター標準 | トヨタ自動車 | https://toyota.jp/rav4/safety/ | 2026-09-10 |
| RAV4 HEV 2025.12～のLTA作動条件・ステアリング保持責任 | トヨタ自動車 | https://manual.toyota.jp/rav4/3097/hev/ja_JP/contents/vhch04se050405.php | 2026-09-10 |
| RAV4 HEV 2025.12～のLCA作動条件 | トヨタ自動車 | https://manual.toyota.jp/rav4/3097/hev/ja_JP/contents/vhch04se050406.php | 2026-09-10 |
| RAV4 PHEV 2026.02～のLTA・全車速追従レーダークルーズ作動条件 | トヨタ自動車 | https://manual.toyota.jp/rav4/3098/phev/ja_JP/contents/vhch05se050405.php / https://manual.toyota.jp/rav4/3098/phev/ja_JP/contents/vhch05se050412.php | 2026-09-10 |

ZとGR SPORTはAdvanced Drive等をメーカーオプションとして表示し、オプション価格が販売単位に固定できるまで「掲載価格に含めない」と明記した。Adventureだけはドライバーモニター標準を反映したが、LCA・Advanced Driveはオプションのためハンズオフ可能車とは数えていない。全4単位はACC（縦方向）とLTA（横方向）の同時支援を国土交通省のLevel 2定義へ照合し、サイト上はLevel 2相当とした。新車注文可否は公式商品ページの掲載以上に販売単位へ固定できないため `availability=unknown` としている。

## Toyota ハリアーの根拠（後発対策トランシェ）

確認日は2026-09-10。ハリアー現行HEVの価格・グレードJSONと2026年8月主要装備表から、G・Z・Z“Leather Package”の2WD/E-Fourを6販売単位として登録した。公式安全ページと現行取扱説明書で全車速追従ACC、LTA、停止保持・再発進条件、ハンドル保持要求を確認し、同じLevel 2でも価格と駆動方式を分けて比較できるようにした。LCA、Advanced Drive、独立したドライバーモニターの販売単位別標準／オプション記載は確認できないため、能力を推測して付与していない。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| ハリアー G（2WD）4,396,700円、G（E-Four）4,616,700円、Z（2WD）4,866,400円、Z（E-Four）5,086,400円、Z“Leather Package”（2WD）5,186,500円、同（E-Four）5,406,500円（税込、2026年8月価格基準） | トヨタ自動車 | https://toyota.jp/pages/contents/include/carpage_format/carlineup/data/json/grades34.json | 2026-09-10 |
| ハリアーのLTA・LDA・全車速追従レーダークルーズコントロール標準装備 | トヨタ自動車 | https://toyota.jp/pages/contents/harrier/004_p_001/pdf/harrier_spec_202608.pdf | 2026-09-10 |
| LTAの車線中央支援、ACCの停止保持・先行車追従、ハンドル保持要求 | トヨタ自動車 | https://toyota.jp/harrier/safety/ | 2026-09-10 |
| HARRIER HEV 2026.08～のLTA作動条件、渋滞時支援、無操作時の警告 | トヨタ自動車 | https://manual.toyota.jp/harrier/2608/hev/ja_JP/contents/vhch04se050404.php | 2026-09-10 |
| HARRIER HEV 2026.08～の全車速追従ACC、停止保持・再発進条件 | トヨタ自動車 | https://manual.toyota.jp/harrier/2608/hev/ja_JP/contents/vhch04se050409.php | 2026-09-10 |

6単位はACC（縦方向）とLTA（横方向）の同時支援を国土交通省のLevel 2定義へ照合してサイト上はLevel 2相当とした。公式安全ページが「安全性の観点からドライバーはステアリングを持ち続ける必要」と明記するため、handsOffは`not_allowed`。公式商品ページへの掲載は確認済みだが、販売単位ごとの新車注文可否を明文で固定できないためavailabilityは`unknown`のまま保持する。

## Toyota アルファードの根拠（後発対策トランシェ）

確認日は2026-09-10。アルファードHEVの価格・グレード表から、Z/Gの駆動方式と乗車定員を販売単位へ分離した。同じLevel 2でも価格・人数・駆動方式で候補を絞れるようにし、ACCとLTAは全単位で共通、ステアリング保持要求も共通として比較する。公式商品ページへの掲載は確認できるが、販売単位ごとの新車注文可否は明文で固定できないため`availability=unknown`とした。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| Z HEV 2WD（7人乗り）6,399,800円、Z HEV E-Four（7人乗り）6,619,800円、G HEV 2WD（8人乗り）5,599,000円、G HEV E-Four（8人乗り）5,819,000円（税込、2026年6月価格基準） | トヨタ自動車 | https://toyota.jp/alphard/grade/ | 2026-09-10 |
| アルファード現行商品・安全性能、全車速追従ACC・LTA標準装備とステアリング保持要求 | トヨタ自動車 | https://toyota.jp/alphard/ / https://toyota.jp/alphard/safety/ | 2026-09-10 |
| HEV各販売単位の主要諸元・装備 | トヨタ自動車 | https://toyota.jp/pages/contents/alphard/004_p_001/pdf/alphard_spec_202606.pdf | 2026-09-10 |
| LTAの車線維持支援・高速道路／自動車専用道路の作動条件と保持要求 | トヨタ自動車 | https://manual.toyota.jp/alphard/3084/hev/ja_JP/contents/vhch04se050405.php | 2026-09-10 |
| 全車速追従ACCの停止保持・先行車追従 | トヨタ自動車 | https://manual.toyota.jp/alphard/3084/hev/ja_JP/contents/vhch04se050412.php | 2026-09-10 |

4単位はACC（縦方向）とLTA（横方向）の同時支援を国土交通省のLevel 2定義へ照合し、サイト上はLevel 2相当とした。LTAはステアリング保持が必要なためhandsOffは`not_allowed`、新車注文可否は未確認のまま保持する。

## Toyota ヴェルファイアの根拠（後発対策トランシェ）

確認日は2026-09-10。トヨタ公式の2026年6月価格・グレードJSONと主要装備一覧から、Executive LoungeのPHEV E-Four（6人）・HEV 2WD/E-Four（7人）、Z PremierのHEV 2WD/E-Four・ターボガソリン2WD/4WD（7人）を7販売単位へ分離した。価格・電動化方式・駆動方式・乗車定員を比較軸として保持し、同じLevel 2でも選択理由が残るようにした。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| 2026年6月の7グレードと税込価格（674万9,600円〜1,089万9,900円） | トヨタ自動車 | https://toyota.jp/vellfire/grade/ | 2026-09-10 |
| Executive Lounge / Z PremierのPHEV・HEV・ターボガソリン、駆動方式・乗車定員 | トヨタ自動車 | https://toyota.jp/pages/contents/vellfire/003_p_001/pdf/vellfire_spec_202606.pdf | 2026-09-10 |
| 全車速追従ACC、LTA、LCA、アドバンスト ドライブ（渋滞時支援）、ドライバーモニターカメラ | トヨタ自動車 | https://toyota.jp/vellfire/safety/ | 2026-09-10 |
| アドバンスト ドライブの高速道路・自動車専用道路本線、渋滞時0〜約40km/h、運転者の状況確認 | トヨタ自動車 | https://manual.toyota.jp/vellfire/3085/hev/ja_JP/contents/vhch04se050415.php | 2026-09-10 |

主要装備一覧では7販売単位にACC・LTA・LCA・アドバンスト ドライブ・ドライバーモニターカメラが標準装備として示されるため、全単位を `handsOff=allowed_in_conditions`、`driverMonitoring=required` とした。アドバンスト ドライブは高速道路・自動車専用道路の渋滞時0〜約40km/hに限る条件付き支援であり、通常のACC/LTAの作動条件とは区別する。新車注文可否は販売単位へ明文で固定できないため `availability=unknown` とした。

## Toyota ヴォクシーの根拠（後発対策トランシェ）

確認日は2026-09-10。ヴォクシーは同じLevel 2でも、グレード、駆動方式、乗車定員、MULTI UTILITY架装、メーカーオプションで購入判断が分かれるため、標準5単位とS-GベースのMULTI UTILITY 1単位を別販売単位へ展開した。車両本体価格は375万1,000円〜438万200円（税込）で、Advanced Drive等セットの追加費用はS-Zが12万2,100円、S-Gが7万8,100円。車両本体価格にオプションを混ぜず、同じ比較画面で差を確認できるようにした。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| S-Z 2WD（7人）4,127,200円、S-Z E-Four（7人）4,380,200円、S-G 2WD（7人/8人）3,751,000円、S-G E-Four（7人）4,004,000円 | トヨタ自動車 | https://toyota.jp/voxy/grade/ | 2026-09-10 |
| S-G マルチユーティリティ（2WD・5人）4,120,600円、S-Gベースの架装 | トヨタ自動車 | https://toyota.jp/ucar/catalog/brand-TOYOTA/car-VOXY/ | 2026-09-10 |
| MULTI UTILITY専用のS-Gベース・5人乗り仕様、Advanced Drive・LCA・ドライバーモニターカメラのセットメーカーオプション78,100円 | トヨタ自動車 | https://toyota.jp/pages/contents/request/webcatalog/voxy/noah_voxy_special1.pdf | 2026-09-10 |
| ヴォクシー現行カタログ2026年9月、MULTI UTILITYカタログ2026年5月 | トヨタ自動車 | https://toyota.jp/request/webcatalog/voxy/?padid=from_voxy_top_bottomdoc_webcatalog | 2026-09-10 |
| Toyota Safety SenseのACC・LTA標準、Advanced Driveの自動車専用道路・渋滞時0〜約40km/h、LCA約85〜130km/h、運転者責任 | トヨタ自動車 | https://toyota.jp/voxy/safety/ | 2026-09-10 |
| S-ZはAdvanced Drive・LCA・ドライバーモニターカメラのセット122,100円、S-Gは同セット78,100円（メーカーオプション） | トヨタ自動車 | https://toyota.jp/pages/contents/voxy/004_p_001/pdf/voxy_spec_202609.pdf | 2026-09-10 |

6単位はACC（縦方向）とLTA（横方向）の同時支援を国土交通省のLevel 2定義へ照合し、サイト上はLevel 2相当とした。Advanced Drive等セットを装着した構成では渋滞時0〜約40km/hの条件付きハンズオフとLCAを利用できるため、`handsOff=allowed_in_conditions`、`driverMonitoring=required` とした。通常のLTA・LCAはステアリング保持が必要であり、オプション装着可否を車両本体価格へ混ぜていない。公式掲載は確認できるが、販売単位ごとの新車注文可否を明文で固定できないため、6単位とも`availability=unknown`でCTAは表示しない。MULTI UTILITYは5人乗り架装車のため、標準車の7/8人定員と混同しない。

## Honda VEZELの根拠（後発対策トランシェ）

確認日は2026-09-10。Honda公式のe:HEV ZページでFF/4WDの価格とHonda SENSING装備を確認し、駆動方式を別販売単位にした。ACCは停車追従、トラフィックジャムアシストは約0〜65km/h、LKASは約65〜120km/hの条件付き支援として、単に「Level 2」と表示するだけでは分からない作動範囲を保持する。新車注文可否を販売単位へ固定できないため`availability=unknown`とした。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| e:HEV Z FF 3,268,100円、e:HEV Z 4WD 3,488,100円（税込）と標準Honda SENSING | 本田技研工業 | https://www.honda.co.jp/VEZEL/webcatalog/type/ehev_z/ | 2026-09-10 |
| VEZEL現行商品・装備一覧、Honda SENSINGが運転支援で運転者の監視を前提とする旨 | 本田技研工業 | https://www.honda.co.jp/VEZEL/ / https://www.honda.co.jp/VEZEL/common/pdf/vezel_equipment_list.pdf / https://www.honda.co.jp/VEZEL/webcatalog/performance/ | 2026-09-10 |
| ACCの停車追従・再発進条件 | 本田技研工業 | https://www.honda.co.jp/ownersmanual/webom/jpn/vezel/2026/details/136265090-85520.html | 2026-09-10 |
| LKASの車線中央維持、約65〜120km/h、ステアリング保持と操作責任 | 本田技研工業 | https://www.honda.co.jp/ownersmanual/webom/jpn/vezelehev/2026/details/136262090-86768.html | 2026-09-10 |
| トラフィックジャムアシストの渋滞時支援 | 本田技研工業 | https://www.honda.co.jp/ownersmanual/webom/jpn/vezel/2026/details/136265090-222537.html | 2026-09-10 |

2単位はACC（縦方向）とLKAS／トラフィックジャムアシスト（横方向）の同時支援を国土交通省のLevel 2定義へ照合し、サイト上はLevel 2相当とした。Hondaの取扱説明書は運転者の常時監視とステアリング保持を求めるためhandsOffは`not_allowed`。価格は車両本体の税込参考価格で、注文可否や適用日を推測していない。

## Toyota シエンタの根拠（後発対策トランシェ）

確認日は2026-09-10。トヨタ公式の現行グレードJSON（`grades15.json`）で、Z/G/Xそれぞれのハイブリッド車・ガソリン車、2WD/E-Four、5人乗り/7人乗りの18組み合わせと価格を確認した。価格は214万6,100円〜339万7,900円（税込、2026年8月現在のメーカー希望小売価格・参考価格）で、同じシエンタでも動力・駆動方式・定員を一覧と比較のキーにした。資料の発行月をモデル年へ置き換えず、`modelYear=null`、`catalogAsOf=2026-08`、`priceEffectiveAt=2026-08`、販売単位の導入日は未確認のためnullとしている。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| Z/G/Xのハイブリッド車・ガソリン車、2WD/E-Four、5/7人乗り18販売単位と税込価格 | トヨタ自動車 | https://toyota.jp/pages/contents/include/carpage_format/carlineup/data/json/grades15.json | 2026-09-10 |
| シエンタ現行グレードへの導線と価格表示 | トヨタ自動車 | https://toyota.jp/sienta/grade/ | 2026-09-10 |
| 全車速追従レーダークルーズコントロール、LTAによる高速道路クルージング支援 | トヨタ自動車 | https://toyota.jp/sienta/safety/ | 2026-09-10 |
| LTA・全車速追従ACCの装備区分、2026年8月現在の税込参考価格 | トヨタ自動車 | https://toyota.jp/pages/contents/sienta/003_p_001/pdf/sienta_spec_202608.pdf | 2026-09-10 |
| LTAはステアリング保持が必要で、手を放すと停止。LDAは約50km/h以上（LTA支援中は50km/h未満でも警報） | トヨタ自動車 | https://toyota.jp/sienta/safety/ | 2026-09-10 |

18単位は全車速ACC（縦方向）とLTA（横方向）の同時支援を国土交通省のLevel 2定義へ照合し、サイト上はLevel 2相当とした。公式安全ページは「ドライバーはステアリングを持ち続ける必要があり、手を放すとLTAが停止」と明記するため、全単位を`handsOff=not_allowed`、`driverMonitoring=required`とした。ドライバー異常時対応システムは無操作時の減速停車・救護支援であり、運転者を監視するカメラ機能の根拠とは別なので、`driver_monitoring`能力は付与していない。LCA、条件付きハンズオフ、独立したドライバーモニターの販売単位別設定も公式資料で確認できないため、能力差を推測していない。公式掲載は確認できるが、18単位ごとの新車注文可否は明文で固定できないため`availability=unknown`とし、注文CTAは表示しない。

## Lexus LMの根拠（後発対策トランシェ）

確認日は2026-09-11。Lexus公式の価格・パッケージページと主要装備一覧から、LM500h EXECUTIVE（AWD・4人乗り）とversion L（AWD・6人乗り）の2販売単位を確認した。価格は1,520万円〜2,030万円（税込）。主要装備一覧では両単位に全車速追従レーダークルーズ、LTA、LCA、ドライバーモニター連携、Lexus Teammate Advanced Drive（渋滞時支援）が標準装備として示されるため、同じLevel 2でも「条件付きハンズオフ＋車線変更支援＋定員差」を比較できるようにした。さらにLexus公式の「ご注文から納車までの流れ」に両グレードの注文後工場出荷目処（5.5〜6.0ヶ月）が掲載されているが、現在の注文受付導線を直接確認できないため、両単位の注文可否は`unknown`を維持する。実際の受注・納車時期は販売店、受注状況、仕様で変動するため断定しない。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| LM500h EXECUTIVE（4人乗り・AWD）20,300,000円、version L（6人乗り・AWD）15,200,000円（税込） | Lexus | https://lexus.jp/models/lm/features/price_package/ | 2026-09-10 |
| 全車速追従レーダークルーズ、LTA、LCA、Advanced Drive（渋滞時支援）、ドライバーモニター連携の標準装備 | Lexus | https://lexus.jp/models/lm/features/safety/ | 2026-09-10 |
| EXECUTIVE（4人）/ version L（6人）の両単位でAdvanced Drive・LTA・LCA・全車速追従レーダークルーズ・ドライバーモニター連携が標準。Advanced Driveの利用にはG-Link契約が必要（初度登録から3年間無料、その後有料） | Lexus | https://lexus.jp/models/lm/pdf/equipmentlist.pdf | 2026-09-10 |
| AWD、4人/6人乗り、2026年3月現在の主要諸元 | Lexus | https://lexus.jp/models/lm/pdf/specificationslist.pdf | 2026-09-10 |
| 一部を除く高速道路・自動車専用道路本線で車線維持・加減速・停車・発進を支援。渋滞時は約40km/h以下などの条件で作動し、作動中はハンドルから手を離せるが、運転者の状況確認と安全確保が必要 | Lexus | https://manual.lexus.jp/lm/3004/hev/ja_JP/contents/vhch04se050415.php | 2026-09-10 |

2単位はACC（縦方向）とLTA/LCA（横方向）の同時支援を国土交通省のLevel 2定義へ照合し、サイト上はLevel 2相当とした。Advanced Driveは渋滞時の条件付き支援で、運転者監視のもとハンドルから手を離せるため、サイト上のハンズオフ表示は「条件内で可」、ドライバーモニターは必須とした。対象道路は一部を除く高速道路・自動車専用道路本線、速度上限は約40km/h（渋滞時）として表示し、渋滞解消・車線変更・条件外では運転者操作が必要と明記した。Advanced Driveの利用にはG-Link契約が必要で、初度登録から3年間は基本利用料無料、その後は有料となる。価格ページへの掲載は確認済みだが、新車注文可否と納期は未確認のままCTAを表示しない。高価格帯の4人/6人・LCA標準・条件付きハンズオフという差分は、価格だけでなく「どの条件で任せられるか」を比較する後発耐性になる。

## Lexus UX300hの根拠（同一ブランド差分トランシェ）

確認日は2026-09-10。Lexus公式の価格ページでShining Essence、version L、F SPORTの2WD・AWDを6販売単位として確認した。価格は521万円〜575万7,000円（税込）、全単位5人乗り。全車速追従レーダークルーズ、LTA、ドライバー異常時対応システムは主要装備表で標準と確認できるが、ステアリングを手放すとLTAの支援が停止する。したがって6単位ともLevel 2相当・`handsOff=not_allowed`・`driverMonitoring=required`とし、LCAや独立したドライバーモニター機能は根拠がないため付与していない。公式商品ページには2027年2月生産終了予定とあるが、個別の新車注文可否・納期は固定できないため`availability=unknown`とした。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| UX300h Shining Essence / version L / F SPORTの2WD・AWD、価格521万〜575万7,000円、5人乗り | Lexus | https://lexus.jp/models/ux/features/price_package/ | 2026-09-10 |
| UX300h現行掲載と2027年2月生産終了予定 | Lexus | https://lexus.jp/models/ux/ | 2026-09-10 |
| 全車速追従レーダークルーズ、LTA、ドライバー異常時対応システム | Lexus | https://lexus.jp/models/ux/features/safety/ | 2026-09-10 |
| 6グレードでACC・LTA・ドライバー異常時対応システム標準 | Lexus | https://lexus.jp/models/ux/pdf/equipmentlist.pdf | 2026-09-10 |
| UX300h 5人乗り・2WD/E-Fourの主要諸元 | Lexus | https://lexus.jp/models/ux/pdf/specificationslist.pdf | 2026-09-10 |
| 高速道路・自動車専用道路でのLTA条件、ステアリング保持、ハンズオフ時の停止 | Lexus | https://manual.lexus.jp/ux/2312/hev/ja_JP/contents/vhch04se050404.php | 2026-09-10 |

LMと同じLexusでも、UX300hはハンズオフ不可・LCAなし・521万〜575.7万円、LMは条件付きハンズオフ・LCA標準・1,520万〜2,030万円となる。この同一ブランド内の「価格だけではない能力差」を、2WD/AWD・グレード・定員・作動条件とともに比較できることが後発耐性になる。

## Toyota アクア／カローラの根拠（後発対策トランシェ）

確認日は2026-09-11。トヨタ公式の現行価格・グレード、WEBカタログ、安全性能ページ、取扱説明書から、アクア9販売単位（Z/G/X/Uの2WD・E-Four、GR SPORT 2WD）とカローラ6販売単位（HYBRID W×B/G/Xの2WD・E-Four）を追加した。価格はアクア244万3,100円〜323万8,400円、カローラ238万400円〜334万2,900円（税込）。全単位で全車速追従ACCとLTAの同時支援、ステアリング保持を確認し、国土交通省定義へ照合してLevel 2相当とした。注文可否は販売単位の明文根拠を確認できないため`unknown`を維持する。

| 対象 | 価格・グレード | 支援根拠 | 公式入口 |
|---|---|---|---|
| アクア | Z/G/X/U（KINTO専用）の2WD・E-Four、GR SPORT 2WD | 全車速追従レーダークルーズ、LTA、高速道路中心の支援、ステアリング保持 | https://toyota.jp/aqua/grade/ / https://toyota.jp/aqua/safety/ |
| カローラ | HYBRID W×B/G/Xの2WD・E-Four | 全車速追従レーダークルーズ、LTA、停止保持、高速道路の車線中央支援、ステアリング保持 | https://toyota.jp/corolla/grade/ / https://toyota.jp/corolla/safety/ |

価格の適用時点はアクア2026-07、カローラ2026-05の公式掲載基準を保持し、確認日と混同しない。公開一覧では同じモデル名に駆動方式・グレードを混ぜず、各販売単位の価格・能力・販売状態・公式見積り導線へ接続した。

## Toyota カローラ クロスの根拠（後発対策トランシェ）

確認日は2026-09-11。トヨタ公式の現行グレードJSON（`grades61.json`）から、カローラ クロスのZ/S/GR SPORT/Z“Adventure”と2WD・E-Fourの7販売単位を登録した。価格は298万1,000円〜407万7,700円（税込、2026年7月掲載基準）。Toyota Safety Senseのレーダークルーズコントロール、LTA、渋滞時の先々行車検知、ウインカー操作を前提にした車線変更時の補助を、各販売単位に同じ比較キーで結び付けた。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| Z（2WD）3,613,500円、Z（E-Four）3,872,000円、S（2WD）2,981,000円、S（E-Four）3,239,500円、GR SPORT 4,077,700円、Z“Adventure”（2WD）3,663,000円、同（E-Four）3,921,500円（税込） | トヨタ自動車 | https://toyota.jp/pages/contents/include/carpage_format/carlineup/data/json/grades61.json | 2026-09-11 |
| 現行7グレードへの価格・グレード導線 | トヨタ自動車 | https://toyota.jp/corollacross/grade/ | 2026-09-11 |
| Toyota Safety Sense、全車速追従レーダークルーズ、LTA、渋滞時の先々行車検知、車線変更時の補助。LTAは高速道路の車線中央を支援し、ステアリング保持が必要 | トヨタ自動車 | https://toyota.jp/corollacross/safety/ | 2026-09-11 |
| 高速道路・自動車専用道路で使用するACC、先行車追従・停止保持・発進操作、運転者の安全確認 | トヨタ自動車 | https://manual.toyota.jp/corollacross/2607/hev/ja_JP/contents/vhch04se050409.php | 2026-09-11 |

7単位はACC（縦方向）とLTA（横方向）の同時支援を国土交通省のLevel 2定義へ照合し、サイト上はLevel 2相当とした。車線変更時の補助は自動車線変更ではなく、ウインカー操作時の予備加減速である。安全性の観点からステアリング保持が必要なためhandsOffは`not_allowed`、運転者監視は`required`、新車注文可否は公式掲載だけでは固定できないため`unknown`とした。後発が車名とLevelラベルだけを追加しても、7組み合わせの価格・駆動方式・同じ支援機能・保持条件を再現するには、公式JSON・安全ページ・取扱説明書を販売単位へ結び付けた台帳が必要になる。

## Volvo EX30の根拠（内部保持）

2026-09-11にVolvo Cars Japanの公式Q&Aで、オンライン上で車両選択から契約・申込金支払いまで進められる車種がEX30のみであることを確認した。同社の2027年モデル公式ラインアップにはPlus P5、Ultra P5 Long Range、Ultra P8 AWDの3グレードが掲載されているため、3販売単位を`new_order_available`へ更新した。選択する仕様、在庫、納車時期は個別に変動するため、注文可の表示はオンライン契約導線があることを示す範囲に限定する。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| 2027年モデル3グレードと税込479万〜629万円 | ボルボ・カー・ジャパン | https://www.volvocars.com/jp/l/ex30/ | 2026-09-07 |
| EX30のみオンラインで車両選択・契約・申込金支払いまで可能 | ボルボ・カー・ジャパン | https://www.volvocars.com/jp/l/electric-qa/ | 2026-09-11 |
| 3グレードにPilot Assist、全車速追従ACC、ドライバーモニタリングカメラ付DACを標準装備。内容は2026年7月現在 | ボルボ・カー・ジャパン | https://azure-eu-assets.contentstack.com/v3/assets/blt84e01a6904dbd2e8/blt65613ad142855bdf/6a466a78035de07c64d4cca5/MY27_EX30_Ver2_W29%E4%BB%A5%E9%99%8D.pdf | 2026-09-07 |
| Pilot Assistは速度・車間・操舵を支援し、運転者は両手保持と即時介入が必要 | Volvo Support JP | https://www.volvocars.com/jp/support/car/ex30/24w17/article/47d2c97fd33effd3c0a8cc3718c999b7-85596e53922f2e19c0a8cc42679c08ea-8664b2fa77a7e089c0a8296870d1a409/47d2c97fd33effd3c0a8cc3718c999b7-835992c35a0096eec0a8b0971dfcc685-8664b2fa77a7e089c0a8296870d1a409/47d2c97fd33effd3c0a8b0970ac5ed2e-8664b2fa77a7e089c0a8296870d1a409/54f1934e3fd57300c0a8b0c1194a56be-69b1d5f35a03429ac0a8b0970ac5ed2e-8664b2fa77a7e089c0a8296870d1a409/ | 2026-09-07 |

## Hyundai IONIQ 5の根拠（後発対策トランシェ）

確認日は2026-09-11。Hyundai Mobility Japanの現行価格ページと2026年6月カタログから、The new IONIQ 5のVoyage L／Voyage／Lounge／Lounge AWDを4販売単位として登録した。価格は499万4,000円〜613万8,000円（税込）。Voyage LはHDA、他3グレードはHDA2（車線変更アシスト付）と公式表で区別されるため、同じLevel 2内の車線変更支援の有無を比較できるようにした。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| Voyage L／Voyage／Lounge／Lounge AWDの価格4,994,000円〜6,138,000円、HDA/HDA2のグレード別装備 | Hyundai Mobility Japan | https://www.hyundai.com/jp/ioniq5/price | 2026-09-11 |
| 現行IONIQ 5のラインアップ、HDAによる高速道路の速度・車間・車線維持支援、ステアリング保持の感知 | Hyundai Mobility Japan | https://www.hyundai.com/jp/ioniq5 | 2026-09-11 |
| 2026年6月現在のカタログ、Voyage LはHDA、Voyage/Lounge/Lounge AWDはHDA2（車線変更アシスト付） | Hyundai Mobility Japan | https://www.hyundai.com/jp/purchase/downFile/ioniq5 | 2026-09-11 |
| The new IONIQ 5を2025年モデル以降として掲載 | Hyundai Mobility Japan | https://www.hyundai.com/jp/customer-service/notice/679 | 2026-09-11 |
| HDA2は高速道路で車間・速度・車線中央維持を支援し、ウインカー操作時に車線変更をアシスト | Hyundai Mobility Japan | https://www.hyundai.com/jp/ioniq5 | 2026-09-11 |

4単位はスマートクルーズコントロール（縦方向）とHDA/LFA（横方向）の同時支援を国土交通省のLevel 2定義へ照合し、サイト上はLevel 2相当とした。HDA/HDA2は高速道路の運転支援であり、ステアリング保持・前方監視・必要時の即時操作が必要なためhandsOffは`not_allowed`、driverMonitoringは`required`とした。2026-09-11にヒョンデ公式の新車在庫ページでVoyage／Loungeの掲載車両に「車両注文」導線を確認したため、この2販売単位のみ`new_order_available`へ更新した。掲載車両・色・仕様は変動し、Voyage L／Lounge AWDはグレード単位の注文導線を確認できないため`unknown`を維持する。HDAの速度数値は引き続き未確認で、価格だけで受注可能とは表示しない。

## BYD DOLPHIN / ATTO 3 / SEAL / SEALION 6の根拠（後発対策トランシェ）

確認日は2026-09-11。BYD Auto Japanの現行商品ページ、価格改定・発売発表、主要諸元／装備表、取扱説明書を突き合わせ、4車種7販売単位を登録した。価格は299万2,000円〜572万円（税込）。DOLPHINはBaseline／Long Range、SEALはRWD／AWD、SEALION 6はFWD／AWDを別販売単位とし、ATTO 3は単一グレードで保持した。発売・導入時期は「その販売単位が現在掲載している仕様として販売開始された日」に統一し、DOLPHIN Baseline／Long Rangeは2026年2月10日装備更新版、SEAL RWD／AWDは2025年10月30日更新モデル、SEALION 6は2025年12月1日国内販売開始として記録した。Baselineの初回新規設定（2025年4月1日）とLong Rangeの初回導入（2023年9月20日）は履歴根拠としてsourcesに保持する。すべて日本公式サイトへの掲載は確認できるが、販売単位ごとの新車注文可否・在庫は明文で固定できないため`availability=unknown`とした。

| メーカー | モデル / 販売単位 | 価格（税込） | Level | 同じLevel 2内で比較できる差分 |
|---|---|---:|---:|---|
| BYD | DOLPHIN Baseline | 2,992,000円 | 2 | 2026-02-10装備更新版の販売開始（2025-04-01に新規設定）。Navigation Pilot（ACC・ELKA）0〜120km/h、LKA/LDP/LCA表記。手保持が必要でハンズオフ不可。 |
| BYD | DOLPHIN Long Range | 3,740,000円 | 2 | 2026-02-10装備更新版の販売開始（2023-09-20に初回導入）。Baselineと同じ運転支援構成。航続距離グレード差と価格を分離。 |
| BYD | ATTO 3 | 4,180,000円 | 2 | LKA/LCC/ELK/LCA表記。Navigation Pilot／ICC速度は公式資料間で120・130・135km/hが不一致のため上限を断定しない。 |
| BYD | SEAL RWD | 4,950,000円 | 2 | 2025-10-30更新モデルの販売開始。ACC/LDP/ELKA/ICC、間接式ドライバーモニタリング。LCA・自動車線変更は確認できず、手保持が必要。 |
| BYD | SEAL AWD | 5,720,000円 | 2 | 2025-10-30更新モデルの販売開始。RWDと同じ運転支援構成。駆動方式・価格差を分離。 |
| BYD | SEALION 6 FWD | 3,982,000円 | 2 | 3R1V ADAS（ACC設定30〜150km/h・追従0〜150km/h、LDW/LDP/ELKA/ICC）。車線変更はBSD警告で自動変更ではない。 |
| BYD | SEALION 6 AWD | 4,488,000円 | 2 | FWDと同じ3R1V ADAS構成。駆動方式・価格差を分離。 |

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| DOLPHINのBaseline 2,992,000円／Long Range 3,740,000円、Navigation Pilot（ACC・ELKA）0〜120km/h、現行2グレード | BYD Auto Japan | https://byd.co.jp/e-life/cars/dolphin/ | 2026-09-11 |
| DOLPHIN Baseline／Long RangeのACC・LKA・LCA等の装備表記 | BYD Auto Japan | https://byd.co.jp/news/uploads/BYD_DOLPHIN_specification.pdf | 2026-09-11 |
| DOLPHIN Navigation Pilotは自動運転ではなく、ステアリングから両手を離さないよう要求 | BYD Auto Japan | https://byd.co.jp/e-life/after_support/pdf/manual_DOLPHIN.pdf | 2026-09-11 |
| DOLPHINの2023年9月20日日本発売、2グレード | BYD Auto Japan | https://byd.co.jp/news/2023_0920_146.html | 2026-09-11 |
| DOLPHIN Baselineの2025年4月1日新規設定、Long Rangeの新価格 | BYD Auto Japan | https://byd.co.jp/e-life/news/2025_0401_1.html | 2026-09-11 |
| DOLPHIN Baseline／Long Rangeの2026年2月10日装備アップデート・販売開始 | BYD Auto Japan | https://byd.co.jp/news/2026_0210_301.html | 2026-09-11 |
| DOLPHIN／ATTO 3の車線変更支援はウインカー操作を合図とする公式説明 | BYD Auto Japan | https://byd.co.jp/e-life/safety/ | 2026-09-11 |
| ATTO 3の4,180,000円、現行1グレード、Navigation Pilot（ACC・ELKA）0〜120km/h、LCA表記 | BYD Auto Japan | https://byd.co.jp/e-life/cars/atto3/ | 2026-09-11 |
| ATTO 3カタログのLKA/LCC/ELK/LCA表記 | BYD Auto Japan | https://byd.co.jp/e-life/cars/pdf/BYD_ATTO3_catalog.pdf | 2026-09-11 |
| ATTO 3取扱説明書のステアリング保持要求と135km/h記載、OTA告知の120→130km/h変更 | BYD Auto Japan | https://byd.co.jp/e-life/after_support/pdf/manual_ATTO3_fl-after.pdf | 2026-09-11 |
| ATTO 3のICC作動上限を120km/hから130km/hへ変更するOTA告知 | BYD Auto Japan | https://byd.co.jp/e-life/after_support/ota_update/dolphin/ | 2026-09-11 |
| ATTO 3の2023年1月31日日本発売 | BYD Auto Japan | https://byd.co.jp/news/2023_0131_105.html | 2026-09-11 |
| SEAL RWD 4,950,000円／AWD 5,720,000円、ACC・試乗導線、現行2グレード | BYD Auto Japan | https://byd.co.jp/e-life/cars/seal/ | 2026-09-11 |
| SEALのACC/LDP/ELKA/ICC/DAW等の標準装備 | BYD Auto Japan | https://byd.co.jp/e-life/cars/pdf/BYD_SEAL_catalog.pdf | 2026-09-11 |
| SEALのICCは運転支援で手保持が必要、間接式ドライバーモニタリングシステム | BYD Auto Japan | https://byd.co.jp/e-life/after_support/pdf/manual_SEAL.pdf | 2026-09-11 |
| SEALの2024年6月25日日本発売（初期モデル） | BYD Auto Japan | https://byd.co.jp/news/2024_0625_199.html | 2026-09-11 |
| SEAL RWD／AWDの2025年10月30日更新モデル販売開始と価格 | BYD Auto Japan | https://byd.co.jp/e-life/news/2025_1021_1.html | 2026-09-11 |
| SEALION 6 FWD 3,982,000円／AWD 4,488,000円、3R1V ADAS、ACC設定30〜150km/h・追従0〜150km/h | BYD Auto Japan | https://byd.co.jp/e-life/cars/sealion6/ | 2026-09-11 |
| SEALION 6の2026年3月18日カタログ、ACC・LDW・LDP・ELKA・ICC・DAW、LKA/LCA表記なし | BYD Auto Japan | https://www.byd.com/material/byd-site/jp/lineup/sealion6/catalog/BYD_SEALION6_catalog_260318.pdf | 2026-09-11 |
| SEALION 6の2025年12月1日国内販売開始、FWD／AWD価格 | BYD Auto Japan | https://byd.co.jp/e-life/news/2025_1201_1.html | 2026-09-11 |

7単位はACC（縦方向）と車線維持・車線内支援（横方向）の同時支援を国土交通省のLevel 2定義へ照合し、サイト上はLevel 2相当とした。DOLPHINとATTO 3は公式装備表にLCAがあるため「車線変更支援」を付与するが、手保持・運転者監視が必要で自動車線変更完了やハンズオフを意味しない。SEALは間接式ドライバーモニタリングを`required`として保持する一方、カメラ式とは断定しない。SEALION 6はBSD警告まででLCAの根拠がないため、車線変更支援能力を付与していない。公式資料間で速度が食い違うATTO 3は`factStatus=conflicting`、その他は`verified`とし、根拠のない受注可否・在庫は表示しない。

## Mitsubishi OUTLANDER PHEVの根拠（後発対策トランシェ）

確認日は2026-09-11。三菱自動車の現行商品ページ、各グレード価格ページ、主要装備表、MI-PILOT説明、取扱説明書、2026年6月25日一部改良発表を突き合わせ、9販売単位を登録した。価格はすべて税込のメーカー希望小売価格で、4WD、5人／7人乗りを別単位に分けている。`salesUnitIntroducedAt` と `priceEffectiveAt` は一部改良の販売開始日である2026-06-25、`catalogAsOf` は2026-06とした。モデル年は公式の明示がないためnullである。

| グレード / 販売単位 | 価格（税込） | Level | 同じLevel 2内で比較できる差分 |
|---|---:|---:|---|
| BLACK Edition 4WD（7人） | 6,901,400円 | 2 | 5人乗りより91,300円高い最上位。MI-PILOT・全車速ACC・LKA標準 |
| BLACK Edition 4WD（5人） | 6,810,100円 | 2 | BLACK Editionの5人乗り。MI-PILOT・全車速ACC・LKA標準 |
| P Executive Package 4WD（7人） | 6,791,400円 | 2 | BLACK Editionより110,000円安い上級パッケージ。MI-PILOT・全車速ACC・LKA標準 |
| P Executive Package 4WD（5人） | 6,700,100円 | 2 | 7人乗りより91,300円安い。MI-PILOT・全車速ACC・LKA標準 |
| P 4WD（7人） | 6,510,900円 | 2 | Pの7人乗り。MI-PILOT・全車速ACC・LKA標準 |
| P 4WD（5人） | 6,419,600円 | 2 | 7人乗りより91,300円安い。MI-PILOT・全車速ACC・LKA標準 |
| G 4WD（7人） | 6,076,400円 | 2 | Pより安いG。MI-PILOT・全車速ACC・LKA標準 |
| G 4WD（5人） | 5,985,100円 | 2 | 9単位中の5人乗り価格下限。MI-PILOT・全車速ACC・LKA標準 |
| M 4WD（5人） | 5,369,100円 | 2 | 5人乗りのエントリー。MI-PILOT・全車速ACC・LKA標準 |

公式のMI-PILOTは全車速ACCとLKAを統合し、高速道路・自動車専用道路で先行車追従、渋滞時の停止・発進、同一車線の中央維持を支援する。ACC設定車速は約30km/h以上、停止後およそ30秒以内の発進に対応するが、上限速度は公式ページで数値を固定できないためnullとした。LCAは後側方車両への警告・衝突回避支援であり、自動車線変更を完了する機能ではないため、9単位の`capabilities`には`lane_change_support`を付与していない。取扱説明書が「必ずハンドルを持つ」ことを求めるため全9単位を`handsOff=not_allowed`、カメラ式ドライバーモニタリングは一次資料で確認できないため`driverMonitoring=unknown`とした。

現行商品ページに「商談予約・購入予約受付中」の導線があるため、9単位を`availability=new_order_available`とした。ただしこれは公式の購入予約導線があることを示すもので、販売店ごとの在庫・納期や注文確定を保証しない。購入判断では各地域の販売店へ在庫・納期を確認する必要がある。

| 対象事実 | 一次ソース |
|---|---|
| 現行5グレード、4WD、5／7人乗り、商談・購入予約導線 | [アウトランダーPHEV公式](https://www.mitsubishi-motors.co.jp/lineup/outlander_phev/) |
| 各グレードの価格 | [BLACK Edition](https://www.mitsubishi-motors.co.jp/lineup/outlander_phev/grade/black_edition.html)、[P Executive Package](https://www.mitsubishi-motors.co.jp/lineup/outlander_phev/grade/p_executive_package.html)、[P](https://www.mitsubishi-motors.co.jp/lineup/outlander_phev/grade/p.html)、[G](https://www.mitsubishi-motors.co.jp/lineup/outlander_phev/grade/g.html)、[M](https://www.mitsubishi-motors.co.jp/lineup/outlander_phev/grade/m.html) |
| MI-PILOT、全車速ACC、LKAの標準装備 | [主要装備表](https://www.mitsubishi-motors.co.jp/lineup/outlander_phev/spec/spe_01.html) |
| ACC・LKAの作動条件 | [MI-PILOT説明](https://www.mitsubishi-motors.co.jp/lineup/outlander_phev/usp/usp_02.html) |
| ハンドル保持必須 | [取扱説明書](https://www.mitsubishi-motors.co.jp/afterservice/manual/html/outlander_manual/07-04-13.html) |
| 2026年6月25日一部改良・販売開始 | [三菱自動車ニュースリリース](https://www.mitsubishi-motors.com/jp/newsroom/newsrelease/2026/20260625_1.html) |
| 現行9グレードを選べる購入予約入口（Chromeで可視確認） | [三菱自動車 オンライン見積り・購入予約](https://try.mitsubishi-motors.co.jp/olm/EGP0002.do?model=274&skp=1) |

## 2026-09-11 Lexus LX追加トランシェ

Lexus公式の現行価格・パッケージ、コンフィギュレーター、安全装備、主要装備／諸元／価格PDF、見積り・販売店導線を照合し、LXの10販売単位を追加した。LX700h EXECUTIVE（4人乗り）、5人乗り、7人乗り、OVERTRAIL+の5人／7人乗り、LX600 EXECUTIVE（4人乗り）、5人乗り、7人乗り、OVERTRAIL+の5人／7人乗りを別単位とし、価格は1,450万円〜2,100万円（税込）。`catalogAsOf=2026-09`、`priceEffectiveAt=null`とし、公式ページに現在価格の適用開始日が明記されていないことを保持する。発売リリースは2025-03-06発表、LX700hは2025-03-24発売だが、LX600およびOVERTRAIL+の販売単位導入日は推測せずnullとした。

全10単位で全車速追従レーダークルーズ（縦方向）とLTA（横方向）を確認し、国土交通省の定義へ照合してLevel 2相当とした。Lexus Teammate Advanced Driveは公式安全表の「渋滞時支援のみ」に限定し、0〜40km/hの条件、運転者の前方・周囲監視必須を明記した。条件内のハンズオフは`allowed_in_conditions`としたが、自動運転を意味しない。LCA・自動車線変更は公式根拠がないため付与していない。公式の見積り・販売店導線は到達できるが、個別の受注可否・納期は確認できないため`availability=unknown`とした。限定仕様（HIDEKI MATSUYAMA EDITION等）は含めない。

| 販売単位 | 価格（税込） | salesUnitIntroducedAt |
|---|---:|---|
| LX700h “EXECUTIVE”（4人乗り） | 21,000,000円 | 2025-03-24 |
| LX700h（5人乗り） | 15,900,000円 | 2025-03-24 |
| LX700h（7人乗り） | 15,900,000円 | 2025-03-24 |
| LX700h “OVERTRAIL+”（5人乗り） | 15,900,000円 | 2025-03-24（LX700h発売日。パッケージ個別導入日は未確認） |
| LX700h “OVERTRAIL+”（7人乗り） | 15,900,000円 | 2025-03-24（LX700h発売日。パッケージ個別導入日は未確認） |
| LX600 “EXECUTIVE”（4人乗り） | 20,000,000円 | null |
| LX600（5人乗り） | 14,500,000円 | null |
| LX600（7人乗り） | 14,500,000円 | null |
| LX600 “OVERTRAIL+”（5人乗り） | 14,900,000円 | null |
| LX600 “OVERTRAIL+”（7人乗り） | 14,900,000円 | null |

| 対象事実 | 発行元 | URL | 確認日 / HTTP |
|---|---|---|---|
| 現行LXの10パッケージ・価格 | Lexus | https://lexus.jp/models/lx/spec_price/ | 2026-09-11 / 200 |
| 全車速追従ACC・LTA、Advanced Drive渋滞時支援 | Lexus | https://lexus.jp/models/lx/features/safety/ | 2026-09-11 / 200 |
| 4/5/7人乗り販売単位 | Lexus | https://lexus.jp/models/lx/configurator/index.html | 2026-09-11 / 200 |
| 公式見積り導線 | Lexus | https://lexus.jp/request/estimate_sim/version?car_name_en=LX700h | 2026-09-11 / 200 |
| 公式販売店導線 | Lexus | https://lexus.jp/dealership/ | 2026-09-11 / 200 |
| LX700hの2025-03-24発売、価格、Advanced Drive条件 | トヨタ自動車 | https://global.toyota/jp/newsroom/lexus/42331276.html | 2026-09-11 / 200 |
| 主要装備一覧 | Lexus | https://lexus.jp/models/lx/pdf/equipmentlist.pdf | 2026-09-11 / 200 |
| 主要諸元 | Lexus | https://lexus.jp/models/lx/pdf/detail.pdf | 2026-09-11 / 200 |
| 価格表 | Lexus | https://lexus.jp/models/lx/pdf/pricelist.pdf | 2026-09-11 / 200 |

## 2026-09-11 Mercedes-Benz GLC／C-Class Sedan追加トランシェ

Mercedes-Benz Japanの2026年9月価格表、現行モデルページ、MP202602のData Information装備表、安全ページを突合し、GLC 5販売単位とC-Class Sedan 6販売単位を登録した。価格は税込744万円〜1,844万円。アクティブディスタンスアシスト・ディストロニック（縦方向）とアクティブステアリングアシスト（横方向）が標準装備で、国土交通省の定義へ照合してサイト上はLevel 2相当とした。ステアリングに手を添え、道路・交通を常時監視する必要があるためハンズオフ不可。モデルページ掲載と購入相談導線は販売状態の根拠と分け、個別の新車注文可否・在庫・納期は全11単位で`unknown`を維持する。

| モデル | 販売単位 | 価格（税込） | 同じLevel 2内の比較差分 |
|---|---|---:|---|
| GLC | 220 d 4MATIC Core（ISG） | 8,290,000円 | エントリーのディーゼルSUV |
| GLC | 220 d 4MATIC Sports（ISG） | 9,200,000円 | Coreとの装備・価格差 |
| GLC | 350 e 4MATIC Sports Edition Star | 10,360,000円 | PHEVパワートレーン差 |
| GLC | Mercedes-AMG GLC 43 4MATIC | 12,320,000円 | AMGグレード差 |
| GLC | Mercedes-AMG GLC 63 S E PERFORMANCE | 18,440,000円 | AMG最上位・価格差 |
| C-Class Sedan | C 200 Sports（ISG） | 7,440,000円 | セダンの価格下限 |
| C-Class Sedan | C 200 Luxury（ISG） | 9,150,000円 | Luxury装備・価格差 |
| C-Class Sedan | C 220 d Sports（ISG） | 7,640,000円 | ディーゼルのSports差 |
| C-Class Sedan | C 220 d Luxury（ISG） | 9,310,000円 | ディーゼルのLuxury差 |
| C-Class Sedan | C 350 e Sports | 10,450,000円 | PHEVパワートレーン差 |
| C-Class Sedan | Mercedes-AMG C 43 4MATIC | 13,090,000円 | AMGグレード差 |

| 対象事実 | 発行元 | URL | 確認日 / HTTP |
|---|---|---|---|
| GLC／C-Class Sedanの2026年9月価格表と税込価格 | Mercedes-Benz Japan | https://www.mercedes-benz.co.jp/passengercars/cars-guide/price-list.html | 2026-09-11 / 200 |
| GLC現行MP202602、購入相談・オンラインショールーム | Mercedes-Benz Japan | https://www.mercedes-benz.co.jp/passengercars/models/suv/glc/overview.html | 2026-09-11 / 200 |
| C-Class Sedan現行MP202602、ラインアップ | Mercedes-Benz Japan | https://www.mercedes-benz.co.jp/passengercars/models/saloon/c-class/overview.html | 2026-09-11 / 200 |
| GLC販売単位・標準装備（ACC／アクティブステアリング／レーンキーピング／自動再発進） | Mercedes-Benz Japan | https://www.mercedes-benz.co.jp/content/dam/japan/passengercars/Model/catalog/glc_suv/GLC_DI_MP202602_260330.pdf | 2026-09-11 / 200 |
| C-Class Sedan販売単位・標準装備（ACC／アクティブステアリング／レーンキーピング／自動再発進） | Mercedes-Benz Japan | https://www.mercedes-benz.co.jp/content/dam/japan/passengercars/Model/catalog/c_class_sedan/C-Class_Sedan_DI_MP202602_260423.pdf | 2026-09-11 / 200 |
| ステアリング保持、停止後30秒以内の自動追従再発進、運転者監視 | Mercedes-Benz Japan | https://www.mercedes-benz.co.jp/passengercars/campaigns/safety-innovation.html | 2026-09-11 / 200 |

価格表の掲載月・MP番号は保持するが、販売単位の正確な発売・注文開始日は公式資料で確定できないため`salesUnitIntroducedAt=null`とした。キャンペーン対象外は販売終了の根拠とみなさず、受注可能性を推測表示しない。

## 2026-09-11 SUBARU フォレスター7販売単位追加

SUBARU公式の現行グレード一覧、2026年5月装備表、安全性能ページ、新型発表資料を照合し、フォレスターの7グレードを販売単位として登録した。価格はTouring 385万円からPremium S:HEV EX 464万2,000円まで（AWD・税込、オプション・諸費用別）。個別グレードの販売単位導入日・価格適用日は公式ページで固定できないため、`salesUnitIntroducedAt=null`、`priceEffectiveAt=null`、`catalogAsOf=2026-09`とした。

全7単位にEyeSightコアの全車速追従ACCと車線維持支援を確認し、国土交通省の定義に照合してLevel 2相当とした。Premium S:HEV EX、X-BREAK S:HEV EX、Touring EX、SPORT EX、SPORT EX Black Selectionの5単位はEyeSight Xが標準で、渋滞時ハンズオフアシスト（高速道路等・0〜約50km/h・条件内）、アクティブレーンチェンジアシスト、ドライバーモニタリングを表示する。X-BREAK S:HEVとTouringはEyeSightコアのみで、ハンズオフ不可・車線変更支援なしとした。いずれも自動運転装置ではなく、運転者の常時監視と即時介入が必要である。

新車ページへの掲載は確認できるが、個別グレードの現在の受注可否・納期までは公式ページで確認できないため、7単位の`availability=unknown`を維持した。公式商品ページにはセルフ見積り、販売店検索、試乗予約への導線があり、`src/data/official-links.json`へ記録した。

根拠: [フォレスター グレード一覧](https://www.subaru.jp/forester/grade/)、[装備表（2026.05）](https://www.subaru.jp/forester/specification/docs/equipment.pdf)、[安全性能](https://www.subaru.jp/forester/safety/)、[新型フォレスター発表](https://www.subaru.co.jp/news/2025_04_17_164724/)、[国土交通省 Level 2定義](https://www.mlit.go.jp/common/001343740.pdf)。

## 2026-09-11 日産エクストレイル14販売単位追加

日産公式の現行商品ページ、価格・グレード一覧、プロパイロット説明、2026年8月主要装備表（通常／NISMO／AUTECH）を照合し、エクストレイルの14販売単位を追加した。2WD（2列）のX・G・AUTECH Advanced Package、4WDのX/G e-4ORCE（2列・3列）、ROCK CREEK、NISMO、AUTECH、AUTECH SPORTS SPECを別単位に分けた。価格はすべて税込のメーカー希望小売価格で409万2,000円〜596万2,000円。現行価格ページの確認月を`catalogAsOf=2026-09`・`priceEffectiveAt=2026-09`とし、個別販売単位の発売日は公式資料で固定できないため`salesUnitIntroducedAt=null`とした。

主要装備表でX／G／ROCK CREEK、NISMO、AUTECHの各単位に「プロパイロット」を標準装備として確認した。日産の説明はアクセル・ブレーキ・ステアリング操作を支援する通常のプロパイロットで、高速道路・自動車専用道路で使用する運転支援システム（自動運転ではない）と明記される。したがってACC（縦方向）＋車線内操舵（横方向）を国土交通省の定義へ照合しLevel 2相当と分類した。プロパイロット2.0のような条件内ハンズオフの根拠は確認できないため、全14単位を`handsOff=not_allowed`、`driverMonitoring=required`、能力は`adaptive_cruise_control`＋`lane_centering`に限定した。速度上限や個別の受注可否は公式に一律の根拠がないため推測せず、`speedKph`と`availability`は未確認としている。

| 販売単位 | 価格（税込） | 駆動・座席 | 同じLevel 2内の差分 |
|---|---:|---|---|
| X | 4,092,000円 | 2WD・2列 | エントリー価格。プロパイロット標準 |
| G | 4,653,000円 | 2WD・2列 | 2WD上位グレード |
| AUTECH Advanced Package | 5,365,800円 | 2WD・2列 | AUTECH専用装備 |
| X e-4ORCE | 4,389,000円 | 4WD・2列 | e-4ORCEの価格下限 |
| G e-4ORCE | 4,950,000円 | 4WD・2列 | Gのe-4ORCE |
| ROCK CREEK e-4ORCE | 4,757,500円（2列）／4,889,500円（3列） | 4WD | 専用外装・2列／3列 |
| X e-4ORCE（3列） | 4,521,000円 | 4WD・3列 | 3列シート |
| AUTECH e-4ORCE | 5,480,200円（2列）／5,559,400円（3列） | 4WD | AUTECH専用装備・2列／3列 |
| AUTECH Advanced Package e-4ORCE | 5,662,800円 | 4WD・2列 | AUTECH上位パッケージ |
| AUTECH SPORTS SPEC e-4ORCE | 5,904,800円 | 4WD・2列 | 専用チューニング |
| NISMO e-4ORCE | 5,754,100円 | 4WD・2列 | NISMO専用チューニング |
| NISMO Advanced Package e-4ORCE | 5,962,000円 | 4WD・2列 | NISMO上位パッケージ |

根拠: [エクストレイル現行商品ページ](https://www3.nissan.co.jp/vehicles/new/x-trail.html)、[価格・グレード](https://www3.nissan.co.jp/vehicles/new/x-trail/specifications.html)、[プロパイロット](https://www3.nissan.co.jp/vehicles/new/x-trail/performance_safety/propilot.html)、[通常／ROCK CREEK装備表（2026.08）](https://www-asia.nissan-cdn.net/content/dam/Nissan/jp/vehicles/x-trail/2608/pdf/x-trail_2608_specsheet.pdf)、[NISMO装備表](https://www-asia.nissan-cdn.net/content/dam/Nissan/jp/vehicles/x-trail/2608/pdf/x-trail_2608_nismo_specsheet.pdf)、[AUTECH装備表](https://www-asia.nissan-cdn.net/content/dam/Nissan/jp/vehicles/x-trail/2608/pdf/x-trail_2608_autech_autech_sports_specsheet.pdf)、[国土交通省 Level 2定義](https://www.mlit.go.jp/common/001343740.pdf)。

## 2026-09-11 Honda ZR-V 4販売単位追加

Honda公式の現行商品・タイプ一覧、e:HEV X／Zの価格ページ、性能・安全ページ、トラフィックジャムアシスト説明を照合し、ZR-Vの通常4販売単位を登録した。e:HEV X／e:HEV ZのFF・4WDを別単位とし、価格は370万7,000円〜452万7,600円（税込、メーカー希望小売価格）。個別の販売単位導入日・価格適用日は現行ページで固定できないため、`salesUnitIntroducedAt=null`、`priceEffectiveAt=null`、`catalogAsOf=2026-09`とした。BLACK STYLE／CROSS TOURINGは特別仕様車のため通常グレード束から保留した。

全4単位でHonda SENSINGのACC（縦方向）、LKAS・トラフィックジャムアシスト（横方向）を確認し、国土交通省の定義に照合してサイト上はLevel 2相当とした。TJAは約0〜65km/hの渋滞時支援、LKASは約65〜120km/hの条件付きで、手放しでは作動しない。運転者の常時監視・ステアリング保持が必要なため、`handsOff=not_allowed`、`driverMonitoring=required`とし、自動車線変更・車線変更支援は付与していない。現行商品ページ掲載とセルフ見積り・販売店・試乗・カタログ導線は確認したが、実注文・在庫・納期は確認できないため`availability=unknown`を維持する。

| 販売単位 | 価格（税込） | 駆動・定員 | 同じLevel 2内の差分 |
|---|---:|---|---|
| e:HEV X〈FF〉 | 3,707,000円 | FF・5人 | エントリー価格。Honda SENSING標準 |
| e:HEV X〈4WD〉 | 3,927,000円 | 4WD・5人 | Xの4WD差 |
| e:HEV Z〈FF〉 | 4,307,600円 | FF・5人 | Zの装備差・価格差 |
| e:HEV Z〈4WD〉 | 4,527,600円 | 4WD・5人 | Zの4WD差・価格上限 |

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| ZR-V現行商品・2026年3月26日一部改良掲載 | 本田技研工業株式会社 | https://www.honda.co.jp/ZR-V/ | 2026-09-11 |
| e:HEV X／ZのFF・4WD価格 | 本田技研工業株式会社 | https://www.honda.co.jp/ZR-V/webcatalog/type/list/ ／ https://www.honda.co.jp/ZR-V/webcatalog/type/x/ ／ https://www.honda.co.jp/ZR-V/webcatalog/type/z/ | 2026-09-11 |
| Honda SENSING、ACC・LKAS・トラフィックジャムアシスト、運転者監視 | 本田技研工業株式会社 | https://www.honda.co.jp/ZR-V/webcatalog/performance/ | 2026-09-11 |
| トラフィックジャムアシストの約0〜65km/h条件・手放し不可 | 本田技研工業株式会社 | https://www.honda.co.jp/hondasensing/sensing/tja/ | 2026-09-11 |
| 縦・横方向を運転者主体で支援するLevel 2定義 | 国土交通省 | https://www.mlit.go.jp/common/001343740.pdf | 2026-09-11 |

根拠: [ZR-V商品ページ](https://www.honda.co.jp/ZR-V/)、[タイプ一覧](https://www.honda.co.jp/ZR-V/webcatalog/type/list/)、[性能・安全](https://www.honda.co.jp/ZR-V/webcatalog/performance/)、[Honda TJA説明](https://www.honda.co.jp/hondasensing/sensing/tja/)。Hondaサイトは通常curlで403となる場合があるため、一次URLの確認はブラウザUAで行った。未確認の国内候補群が残るため、全国網羅の完了とは扱わない。

## 2026-09-12 Toyota クラウン スポーツ追加トランシェ

トヨタ公式のクラウン スポーツ商品・価格ページと、`grades64.json`（model id 64）の現行4エントリを照合し、SPORT RS／SPORT ZのPHEV・HEVとSPORT G HEVをE-Four・5人乗りの販売単位として追加した。メーカー希望小売価格は税込532万7,300円（SPORT G）〜777万7,000円（SPORT RS）で、KINTO月額表示は車両本体価格へ換算していない。個別の発売日・受注可否は販売単位に固定できないため、`salesUnitIntroducedAt=null`、`availability=unknown`とした。

安全性能ページでSPORT RS／SPORT Zにアドバンスト ドライブ（渋滞時支援）とレーンチェンジアシストが標準装備、全車に全車速追従レーダークルーズコントロール・LTAが掲載されることを確認した。RS／Zは渋滞時0〜約40km/hの条件内ハンズオフ・運転者監視・車線変更支援を能力タグへ反映し、SPORT Gは同ページでRS／Z限定装備とされる機能を付与せず、ACC・LTA・渋滞時運転支援・ハンドル保持のみとした。全単位を国土交通省の定義に照合したサイト上のLevel 2相当として表示するが、自動運転とは表記しない。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| クラウン スポーツ現行商品ページ | トヨタ自動車株式会社 | https://toyota.jp/crownsport/ | 2026-09-12 |
| SPORT RS／Z（PHEV・HEV）／Gの価格・駆動・定員 | トヨタ自動車株式会社 | https://toyota.jp/pages/contents/include/carpage_format/carlineup/data/json/grades64.json | 2026-09-12 |
| 全車速追従ACC・LTA、RS/Zのアドバンスト ドライブ・LCA、渋滞時0〜約40km/h | トヨタ自動車株式会社 | https://toyota.jp/crownsport/safety/ | 2026-09-12 |
| 2026年9月主要諸元・装備一覧 | トヨタ自動車株式会社 | https://toyota.jp/pages/contents/crownsport/001_p_001/pdf/crownsport_spec_202609.pdf | 2026-09-12 |
| 縦・横方向を運転者主体で支援するLevel 2定義 | 国土交通省 | https://www.mlit.go.jp/common/001343740.pdf | 2026-09-12 |

根拠: [クラウン スポーツ商品ページ](https://toyota.jp/crownsport/)、[価格・グレードJSON](https://toyota.jp/pages/contents/include/carpage_format/carlineup/data/json/grades64.json)、[安全性能](https://toyota.jp/crownsport/safety/)、[主要諸元・装備一覧](https://toyota.jp/pages/contents/crownsport/001_p_001/pdf/crownsport_spec_202609.pdf)。公式サイトに掲載されたグレードと、作動条件・能力差を分離している。受注可否は未確認のため新車注文可とは表示しない。

## 2026-09-12 Toyota クラウン（クロスオーバー）通常グレード追加トランシェ

トヨタ公式のクラウン（クロスオーバー）商品ページ、`grades44.json`（model id 44）、安全性能ページ、2026年9月主要装備比較表を照合し、通常カタログのRS／Z／GをE-Four・5人乗りの販売単位として追加した。メーカー希望小売価格は税込517万9,900円（CROSSOVER G）〜673万9,700円（CROSSOVER RS）で、価格は2026年9月現在の参考価格（オプション・諸費用別）。販売単位ごとの発売日・現在の受注可否は公式資料で固定できないため `salesUnitIntroducedAt=null`、`availability=unknown` とした。

安全性能ページで全車に全車速追従レーダークルーズコントロール・LTA、RS／Zにアドバンスト ドライブ（渋滞時支援）・レーンチェンジアシスト・ドライバーモニターカメラが標準装備とされることを確認した。RS／Zは渋滞時0〜約40km/hの条件内ハンズオフと車線変更支援を能力タグへ反映し、GはRS／Z限定装備を付与せずACC・LTA・渋滞時運転支援・ハンドル保持のみとした。全単位を国土交通省の定義に照合したサイト上のLevel 2相当として表示するが、自動運転とは表記しない。既存の特別仕様THE LIMITED-MATTE METALは通常グレードと価格・販売単位が異なるため別レコードで保持する。

| 販売単位 | 価格（税込） | 駆動・定員 | 同じLevel 2内の差分 |
|---|---:|---|---|
| CROSSOVER RS（ハイブリッド車）・E-Four Advanced | 6,739,700円 | E-Four Advanced・5人 | アドバンスト ドライブ0〜約40km/h、LCA、ドライバーモニター、条件内ハンズオフ |
| CROSSOVER Z（ハイブリッド車）・E-Four | 5,999,400円 | E-Four・5人 | アドバンスト ドライブ0〜約40km/h、LCA、ドライバーモニター、条件内ハンズオフ |
| CROSSOVER G（ハイブリッド車）・E-Four | 5,179,900円 | E-Four・5人 | ACC・LTA・渋滞時運転支援、ハンドル保持。アドバンスト ドライブ／LCAは標準対象外 |

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| クラウン（クロスオーバー）現行商品ページ | トヨタ自動車株式会社 | https://toyota.jp/crowncrossover/ | 2026-09-12 |
| CROSSOVER RS／Z／Gの価格・駆動・定員 | トヨタ自動車株式会社 | https://toyota.jp/pages/contents/include/carpage_format/carlineup/data/json/grades44.json | 2026-09-12 |
| 全車速追従ACC・LTA、RS/Zのアドバンスト ドライブ・LCA・ドライバーモニター、渋滞時0〜約40km/h | トヨタ自動車株式会社 | https://toyota.jp/crowncrossover/safety/ | 2026-09-12 |
| 2026年9月主要装備比較表（価格・標準装備） | トヨタ自動車株式会社 | https://toyota.jp/pages/contents/crowncrossover/001_p_001/pdf/crowncrossover_equipment_compare_202609.pdf | 2026-09-12 |
| 縦・横方向を運転者主体で支援するLevel 2定義 | 国土交通省 | https://www.mlit.go.jp/common/001343740.pdf | 2026-09-12 |

根拠: [クラウン（クロスオーバー）商品ページ](https://toyota.jp/crowncrossover/)、[価格・グレードJSON](https://toyota.jp/pages/contents/include/carpage_format/carlineup/data/json/grades44.json)、[安全性能](https://toyota.jp/crowncrossover/safety/)、[主要装備比較表](https://toyota.jp/pages/contents/crowncrossover/001_p_001/pdf/crowncrossover_equipment_compare_202609.pdf)。通常3グレードと特別仕様を別販売単位へ分け、RS/Zの条件内ハンズオフ・車線変更支援とGのハンドル保持を同じ比較キーへ固定した。受注可否は未確認のため新車注文可とは表示しない。

## 2026-09-12 Honda ステップ ワゴン10販売単位追加

Honda公式のステップ ワゴン現行商品ページ、タイプ一覧、タイプJSON、性能・安全ページを照合し、通常乗用の10販売単位を追加した。e:HEV AIR EX〈FF〉、AIR EX〈FF／4WD〉、AIR〈FF〉、e:HEV SPADA〈FF〉、SPADA〈FF／4WD〉、e:HEV SPADA PREMIUM LINE〈FF〉、SPADA PREMIUM LINE〈FF／4WD〉を、動力・グレード・駆動方式の差が比較できる単位へ分離した。30周年特別仕様車、福祉車両、SPADA PREMIUM LINE BLACK EDITIONは通常10単位から除外し、別候補として扱う。

価格はすべて税込メーカー希望小売価格で、334万8,400円（AIR〈FF〉）〜426万8,000円（e:HEV SPADA PREMIUM LINE〈FF〉）。現行タイプ一覧に掲載されていることは確認したが、個別グレードの現在の受注可否・在庫・納期までは公式ページで確定できないため、10単位とも `availability=unknown`、個別発売日・価格適用日は未設定、カタログ確認月は `catalogAsOf=2026-09` とした。

全10単位でHonda SENSINGのACC（縦方向）とLKAS・トラフィックジャムアシスト（横方向）を確認し、国土交通省の定義に照合してサイト上はLevel 2相当とした。トラフィックジャムアシストは約0〜65km/h、LKASは約65〜120km/hの条件付き支援で、手放しでは作動しない。運転者の常時監視・ステアリング保持が必要なため `handsOff=not_allowed`、`driverMonitoring=required` とし、自動車線変更・車線変更支援は付与していない。

| 販売単位 | 価格（税込） | 駆動・定員 | 同じLevel 2内の差分 |
|---|---:|---|---|
| AIR〈FF〉 | 3,348,400円 | FF・7名 | 価格下限。Honda SENSING標準 |
| AIR EX〈FF／4WD〉 | 3,543,100円／3,763,100円 | FF／4WD・7名 | AIR EXの駆動方式差 |
| e:HEV AIR EX〈FF〉 | 3,938,000円 | FF・7名 | ハイブリッド・AIR EX |
| SPADA〈FF／4WD〉 | 3,603,600円／3,823,600円 | FF／4WD・7名 | SPADAの駆動方式差 |
| e:HEV SPADA〈FF〉 | 3,998,500円 | FF・7名 | ハイブリッド・SPADA |
| SPADA PREMIUM LINE〈FF／4WD〉 | 3,873,100円／4,063,400円 | FF／4WD・7名 | 上位内装・駆動方式差 |
| e:HEV SPADA PREMIUM LINE〈FF〉 | 4,268,000円 | FF・7名 | ハイブリッド・上位グレード |

根拠: [STEP WGN現行商品ページ](https://www.honda.co.jp/STEPWGN/)、[タイプ一覧](https://www.honda.co.jp/STEPWGN/webcatalog/type/list/)、[価格・タイプJSON](https://www.honda.co.jp/STEPWGN/common/data/type.json)、[性能・安全](https://www.honda.co.jp/STEPWGN/webcatalog/performance/)、[Honda TJA説明](https://www.honda.co.jp/hondasensing/sensing/tja/)、[国土交通省 Level 2定義](https://www.mlit.go.jp/common/001343740.pdf)。公式の商品・販売店・試乗・見積り・カタログ導線は `src/data/official-links.json` に記録した。未確認の国内候補群が残るため、全国網羅の完了とは扱わない。

## 2026-09-12 Honda フリード CROSSTAR 8販売単位追加

Honda公式のフリード現行商品ページ、タイプ一覧JSON、性能・安全ページを照合し、通常乗用のCROSSTAR 8販売単位を追加した。e:HEV CROSSTAR／CROSSTARのFF・4WDと5／6人乗りを別単位に分け、福祉車両（スロープ／リフトアップシート）とAIR系は今回のCROSSTARトランシェから除外した。

価格はすべて税込メーカー希望小売価格で、292万8,200円（CROSSTAR〈FF・5人乗り〉）〜360万2,500円（e:HEV CROSSTAR〈4WD・6人乗り〉）。個別販売単位の発売日・価格適用日・受注可否は現行ページで固定できないため、`salesUnitIntroducedAt=null`、`priceEffectiveAt=null`、`availability=unknown`、`catalogAsOf=2026-09`とした。

全8単位でHonda SENSINGのACC（縦方向）とLKAS・トラフィックジャムアシスト（横方向）を確認し、国土交通省の定義に照合してサイト上はLevel 2相当とした。トラフィックジャムアシストは約0〜65km/h、LKASは約65〜120km/hの条件付き支援で、手放しでは作動しない。運転者の常時監視・ステアリング保持が必要なため `handsOff=not_allowed`、`driverMonitoring=required` とし、自動車線変更・車線変更支援は付与していない。

| 販売単位 | 価格（税込） | 駆動・定員 | 同じLevel 2内の差分 |
|---|---:|---|---|
| CROSSTAR〈FF・5人乗り〉 | 2,928,200円 | FF・5人 | ガソリンの価格下限 |
| CROSSTAR〈FF・6人乗り〉 | 2,972,200円 | FF・6人 | 6人乗り差 |
| CROSSTAR〈4WD・5人乗り〉 | 3,159,200円 | 4WD・5人 | 4WD差 |
| CROSSTAR〈4WD・6人乗り〉 | 3,203,200円 | 4WD・6人 | 4WD・6人乗り |
| e:HEV CROSSTAR〈FF・5人乗り〉 | 3,327,500円 | FF・5人 | e:HEVの価格下限 |
| e:HEV CROSSTAR〈FF・6人乗り〉 | 3,371,500円 | FF・6人 | e:HEV・6人乗り |
| e:HEV CROSSTAR〈4WD・5人乗り〉 | 3,558,500円 | 4WD・5人 | e:HEV・4WD |
| e:HEV CROSSTAR〈4WD・6人乗り〉 | 3,602,500円 | 4WD・6人 | 価格上限 |

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| フリード現行商品ページ | 本田技研工業株式会社 | https://www.honda.co.jp/FREED/ | 2026-09-12 |
| CROSSTARのFF／4WD・5／6人乗りと税込価格 | 本田技研工業株式会社 | https://www.honda.co.jp/FREED/common/data/type.json | 2026-09-12 |
| Honda SENSING、ACC・LKAS・トラフィックジャムアシスト、運転者監視 | 本田技研工業株式会社 | https://www.honda.co.jp/FREED/webcatalog/performance/ | 2026-09-12 |
| トラフィックジャムアシストの約0〜65km/h条件・手放し不可 | 本田技研工業株式会社 | https://www.honda.co.jp/hondasensing/sensing/tja/ | 2026-09-12 |
| 縦・横方向を運転者主体で支援するLevel 2定義 | 国土交通省 | https://www.mlit.go.jp/common/001343740.pdf | 2026-09-12 |

根拠: [FREED商品ページ](https://www.honda.co.jp/FREED/)、[タイプ一覧JSON](https://www.honda.co.jp/FREED/common/data/type.json)、[性能・安全](https://www.honda.co.jp/FREED/webcatalog/performance/)、[Honda TJA説明](https://www.honda.co.jp/hondasensing/sensing/tja/)、[国土交通省 Level 2定義](https://www.mlit.go.jp/common/001343740.pdf)。公式の商品・販売店・試乗・見積り・カタログ導線は `src/data/official-links.json` に記録した。未確認の国内候補群が残るため、全国網羅の完了とは扱わない。

## 2026-09-12 日産 キックス P16 12販売単位追加

日産公式のキックス現行商品ページ・価格／グレードページ・走行安全ページと、P16型プロパイロットFAQを照合した。G、X+、X、X シンプルパッケージ、ROCK CREEK、ROCK CREEK Utility Specを2WDと4WD（e-4ORCE）に分け、価格差を比較できる12単位として登録した。日産公式FAQにP16型の2026年6月フルモデルチェンジ、全車プロパイロット標準、車速30〜135km/h設定、車速・車間制御と車線中央付近の操舵支援が記載されている。

価格は税込・東京地区メーカー希望小売価格で、299万9,700円（X シンプルパッケージ 2WD）〜430万9,800円（ROCK CREEK e-4ORCE Utility Spec）。公式ページの掲載・見積り導線は確認したが、個別グレードの現在の受注可否・在庫・納期までは確定できないため、12単位とも `availability=unknown` とした。P16現行仕様の導入月を `salesUnitIntroducedAt=2026-06`、価格適用月を `priceEffectiveAt=2026-06`、カタログ確認月を `catalogAsOf=2026-06` としている。

全12単位でプロパイロットの車速・車間制御（縦方向）と車線中央付近の操舵支援（横方向）を確認し、国土交通省の定義に照合してサイト上はLevel 2相当とした。ステアリング保持と運転者の常時監視が必要で、ハンズオフには対応しない。自動車線変更・車線変更支援、ドライバーモニターの搭載は公式根拠を確認できないため付与していない。

| 販売単位 | 価格（税込） | 駆動方式 | 同じLevel 2内の差分 |
|---|---:|---|---|
| X シンプルパッケージ | 2,999,700円 | 2WD | 価格下限・シンプルパッケージ |
| X | 3,259,300円 | 2WD | 標準X |
| ROCK CREEK | 3,485,900円 | 2WD | 専用外装・装備 |
| X+ | 3,549,700円 | 2WD | 上位X+ |
| G | 3,898,400円 | 2WD | 上位G |
| ROCK CREEK Utility Spec | 3,996,300円 | 2WD | Utility Spec |
| X シンプルパッケージ e-4ORCE | 3,349,500円 | 4WD | 4WD・価格下限 |
| X e-4ORCE | 3,599,200円 | 4WD | 4WD標準X |
| ROCK CREEK e-4ORCE | 3,880,800円 | 4WD | 4WD専用外装 |
| X+ e-4ORCE | 3,899,500円 | 4WD | 4WD上位X+ |
| G e-4ORCE | 4,248,200円 | 4WD | 4WD上位G |
| ROCK CREEK e-4ORCE Utility Spec | 4,309,800円 | 4WD | 4WD Utility Spec・価格上限 |

根拠: [キックス商品ページ](https://www3.nissan.co.jp/vehicles/new/kicks.html)、[価格・グレード](https://www3.nissan.co.jp/vehicles/new/kicks/specifications.html)、[走行・安全](https://www3.nissan.co.jp/vehicles/new/kicks/performance_safety.html)、[P16型プロパイロットFAQ](https://faq2.nissan.co.jp/faq/show/82222?category_id=67&site_domain=default)、[国土交通省 Level 2定義](https://www.mlit.go.jp/common/001343740.pdf)。公式の商品・販売店・試乗・見積り・カタログ導線は `src/data/official-links.json` に記録した。未確認の国内候補群が残るため、全国網羅の完了とは扱わない。

## 2026-09-12 Honda CIVIC 5販売単位追加

Honda公式のCIVIC現行商品ページ、タイプJSON、主要装備表、性能・安全ページ、2026年6月4日発表資料を照合し、e:HEV LX／EX／RSとガソリンEX／RSの5販売単位を追加した。発表資料は2026年6月5日発売を明記しているため、5単位の`salesUnitIntroducedAt`を`2026-06-05`へ設定し、価格適用月とカタログ確認月は`2026-06`として保持した。

税込メーカー希望小売価格は394万6,800円（ガソリンEX）〜465万9,600円（e:HEV RS）。全タイプでACC（縦方向）とLKAS（横方向）の同時支援を確認し、国土交通省の定義へ照合してサイト上はLevel 2相当とした。e:HEV LX／EX／RSとガソリンEXはトラフィックジャムアシスト（0〜約65km/h）を標準装備とし、ガソリンRSは主要装備表で標準対象外のため、渋滞時支援なしとして能力を分離した。全タイプで運転者の常時監視・ステアリング保持が必要で、ハンズオフ不可。車線変更支援は公式根拠がないため付与していない。

| 販売単位 | 価格（税込） | 発売日 | 同じLevel 2内の差分 |
|---|---:|---|---|
| EX（FF） | 3,946,800円 | 2026年6月5日 | ガソリン・トラフィックジャムアシスト標準 |
| e:HEV LX（FF） | 4,132,700円 | 2026年6月5日 | e:HEV・渋滞時支援標準 |
| e:HEV EX（FF） | 4,448,400円 | 2026年6月5日 | e:HEV・上位装備・渋滞時支援標準 |
| RS（FF・6MT） | 4,488,000円 | 2026年6月5日 | ガソリンRS・ACC/LKASのみ、渋滞時支援なし |
| e:HEV RS（FF） | 4,659,600円 | 2026年6月5日 | e:HEV RS・渋滞時支援標準 |

個別タイプの現在の受注可否・在庫・納期は公式ページで固定できないため、5単位とも`availability=unknown`とした。公式の商品・販売店・試乗・見積り・カタログ導線は`src/data/official-links.json`へ記録し、価格・能力差・発売日を一覧／詳細／比較へ反映する。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| CIVIC現行商品ページと価格帯 | 本田技研工業株式会社 | https://www.honda.co.jp/CIVIC/ | 2026-09-12 |
| 5タイプの価格・駆動・トランスミッション | 本田技研工業株式会社 | https://www.honda.co.jp/CIVIC/common/data/type.json | 2026-09-12 |
| ACC・LKAS・トラフィックジャムアシストの作動条件 | 本田技研工業株式会社 | https://www.honda.co.jp/CIVIC/webcatalog/performance/ | 2026-09-12 |
| グレード別Honda SENSING標準装備（ガソリンRSはトラフィックジャムアシスト対象外） | 本田技研工業株式会社 | https://www.honda.co.jp/CIVIC/common/pdf/civic_equipment_list.pdf | 2026-09-12 |
| 2026年6月5日発売と全国メーカー希望小売価格 | 本田技研工業株式会社 | https://global.honda/jp/news/2026/4260604-civic.html | 2026-09-12 |
| 運転者主体で前後・左右を支援するLevel 2定義 | 国土交通省 | https://www.mlit.go.jp/common/001343740.pdf | 2026-09-12 |

根拠: [CIVIC商品ページ](https://www.honda.co.jp/CIVIC/)、[タイプJSON](https://www.honda.co.jp/CIVIC/common/data/type.json)、[性能・安全](https://www.honda.co.jp/CIVIC/webcatalog/performance/)、[主要装備表](https://www.honda.co.jp/CIVIC/common/pdf/civic_equipment_list.pdf)、[Honda発表資料](https://global.honda/jp/news/2026/4260604-civic.html)、[国土交通省 Level 2定義](https://www.mlit.go.jp/common/001343740.pdf)。未確認の国内候補群が残るため、全国網羅の完了とは扱わない。

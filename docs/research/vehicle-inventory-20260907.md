# 日本向け現行候補の棚卸し（最終更新: 2026-09-10）

Issue #17の公開候補を、販売単位（市場・メーカー・メーカー明示モデル年または世代・グレード・必要装備・機能版）で管理するための内部台帳。通常一覧には表示しない。確認日は各車両レコードの `sources[].accessedAt` と `lastReviewedAt` に保持し、カタログ適用時点・販売単位導入時点・価格適用時点とは分離する。

## 集計

対象母集団は「日本で正規販売される現行の乗用車のうち、Level 2以上の支援／自動運転を持つ販売単位」。今回は公開データと確認待ち候補を分け、未確認を網羅済みとして数えない。ブランド群と販売単位が混在するため、未確認候補群の総数はまだ確定しない。

| 区分 | 件数 | 定義 |
|---|---:|---|
| 公開データ | 84 | `src/data/vehicles.json` の全レコード（現行83 + 過去1） |
| 既定表示 | 83 | `currentCatalogListed=true` かつ新車候補として一覧に出る現行レコード |
| 今回追加（Mazda） | 35 | CX-80 8 / CX-60 11 / 新型CX-5 4 / MAZDA3 7 / CX-30 4 / MX-30 ROTARY-EV Natural Monotone 1。日本向け現行価格・主要諸元・装備表・安全ページで販売単位とMRCC/CTS・監視条件を確認 |
| 今回追加（MINI） | 8 | Countrymanの2026年7月以降生産の通常8販売単位。日本向け装備・価格表と公式導入資料で確認 |
| 今回追加（Volvo） | 3 | EX30 2027年モデルの3グレード。日本向け諸元・価格表と取扱説明書で確認 |
| 今回追加（Suzuki） | 3 | e VITARA X 2WD / Z 2WD / Z 4WD。日本向け現行価格・発売資料・安全装備表で確認 |
| 今回追加（Renault） | 4 | ARKANAのesprit Alpine / techno、FULL HYBRID E-TECH / MILD HYBRID。価格表・機能説明・装備資料で確認 |
| 今回追加（BMW） | 9 | 3シリーズ通常カタログのSedan G20 5単位 / Touring G21 4単位。2026年7月以降生産の装備・価格表で確認 |
| 今回追加（Toyota / Lexus） | 2 | プリウス Z（2WD）とNX350h “version L” 2WD。現行商品・価格・安全・取扱説明書を販売単位へ固定 |
| 今回追加（Toyota / Lexus / 後発対策） | 3 | クラウン（クロスオーバー）CROSSOVER RS “THE LIMITED-MATTE METAL” 4WD、LBX “Bespoke Build” 2WD、RX500h “F SPORT Performance” AWD。渋滞時支援・車線変更・監視条件と公式価格を販売単位へ固定 |
| 未掲載・確認継続候補群 | 件数未確定 | Tesla Model S / X と、下記のブランド／モデル群。一次確認済みでも販売単位への展開・レビュー未完なら含める |
| Mazda掲載対象外 | 6 | MAZDA3 FASTBACK 15C / 15S、SEDAN 20S、CX-30 20C / 20S、MX-30 ROTARY-EV（ROTARY-EVグレード）。主要諸元・装備表でMRCCとCTSの同時支援を確定できない |

未確認候補群の調査が終わるまで、サイト全体の国内候補を「網羅」と主張しない。Honda LEGEND（2021、Level 3）は過去車両のため現行母集団の外にあり、公開データには含むが既定一覧には表示しない。

## 調査済み・掲載単位

| メーカー | モデル / 販売単位 | 状態 | Level | 確認日 |
|---|---|---|---:|---|
| Honda | ACCORD 2025 e:HEV Honda SENSING 360＋ | 掲載 | 2 | 2026-09-07 |
| Honda | ACCORD 2025 e:HEV | 掲載 | 2 | 2026-09-07 |
| Nissan | 日産アリア（現行仕様）B6 / B6 e-4ORCE / B9 / B9 e-4ORCE | 掲載（4単位） | 2 | 2026-09-07 |
| Nissan | セレナ C28 e-POWER LUXION | 掲載 | 2 | 2026-09-07 |
| SUBARU | レヴォーグ レイバック（現行仕様）Limited EX | 掲載 | 2 | 2026-09-07 |
| Tesla | Model 3 Premium RWD / Premium ロングレンジAWD / Performance、Model Y Premium RWD / Premium ロングレンジAWD / L | 掲載（6単位） | 2相当 | 2026-09-10 |
| Volvo | EX30 2027 Plus P5 / Ultra P5 Long Range / Ultra P8 AWD Electric | 掲載（3単位） | 2相当 | 2026-09-07 |
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

Teslaは日本向け公式のModel別情報とサポートFAQに加え、2026年6月26日現在の公式ベースプライスを根拠にModel 3 / Model Yを各3販売仕様へ分けて登録した。Tesla自身がドライブアシスト機能を完全自動運転ではないと説明しているため、FSD等の名称だけでLevel 3以上とは判定していない。Model S / Model Xは公式サポート情報で存在と支援機能の説明を確認できるが、現行カタログのモデル年・グレード・注文可否を確認できないため、内部の未確認候補に残し、公開データへ追加しない。

Volvo EX30は、日本向け2027年モデルの2026年第29週生産分以降の諸元・価格表で3グレードとPilot Assist、全車速追従ACC、ドライバーモニタリングを確認した。Pilot Assistは速度・車間と操舵を支援する一方、取扱説明書が運転者に両手保持と即時介入を求めるため、Level 2相当の運転支援として登録した。税込車両本体価格は479万〜629万円で、価格適用時点は2026年7月、確認日は2026-09-07。価格根拠は内部保持し、価格表示機能はIssue #16で一貫した価格契約を実装してから公開する。

Suzuki e VITARAは、現行価格ページと2025年9月16日付の日本発売資料でX 2WD / Z 2WD / Z 4WDの3販売単位、発売日2026-01-16、価格399万3000円 / 448万8000円 / 492万8000円を確認した。公式取扱説明書で車線維持支援中もステアリング保持が必要で、操作がないと警告後に機能を一時停止するため、全3単位のhandsOffを`not_allowed`と確定した。価格適用開始日は公式情報で確認できないため `priceEffectiveAt=null` とした。

Renault ARKANAは、現行価格表でesprit AlpineとtechnoのFULL HYBRID E-TECH / MILD HYBRIDを4販売単位として確認した。価格は順に514万9000円、474万9000円、484万円、444万円で、価格の適用開始日は公式資料から確認できないため `priceEffectiveAt=null` とした。2025年7月のesprit Alpine資料と2025年9月のtechno資料をカタログ適用時点として保持し、資料年をモデル年にはしない。公式機能説明・装備資料でACC（ストップ＆ゴー機能付）とレーンセンタリングアシストの標準装備を確認し、国土交通省のLevel 2定義に照合してLevel 2相当と分類した。ACCはおおむね0〜170km/h、レーンセンタリングアシストは先行車ありでおおむね0〜160km/h、先行車なしでおおむね60〜160km/hと記載されるが、車線・先行車認識等の条件がある。公式取扱説明書は常にハンドルを握ることを求め、反応がない場合は警告後にレーンセンタリングを解除するため、全4単位のhandsOffを`not_allowed`と確定した。

BMW 3シリーズは、2026年7月以降生産の日本向け装備・価格表から通常カタログのセダンG20 5単位とツーリングG21 4単位を登録した。メーカー希望小売価格はセダン688万〜992万円、ツーリング716万〜1027万円で、同資料の適用月を `catalogAsOf` と `priceEffectiveAt` に保持した。全9単位でドライビング・アシスト・プロフェッショナルを標準装備し、ACCとステアリング＆レーン・コントロール・アシストをLevel 2相当と分類した。速度域は現行資料がオーナーズ・ハンドブック参照としているため数値を転用せず不明とした。高速道路渋滞時は条件付きハンズオフに対応するが、通常支援は少なくとも片手保持、運転者の常時注意と即時操作責任が必要。Edition Shadow、M3、50周年限定車は別販売単位として受注・在庫状況の確認待ちに残し、BMW全仕様の網羅とは扱わない。

MINI Countrymanは、2026年7月以降生産の日本向け装備・価格表から通常8販売単位を登録した。税込車両本体価格はC SELECT 480万円、C 518万円、D 526万円、S ALL4 SELECT 553万円、S ALL4 592万円、JOHN COOPER WORKS COUNTRYMAN ALL4 683万円、E 604万円、SE ALL4 678万円。全車でドライビング・アシスタント・プラス（ACC Stop & Go＋ステアリング＆レーン・コントロール）を標準装備として確認した。C SELECT / S ALL4 SELECTはドライビング・アシスタント・プロフェッショナルの標準装備記載がなく条件付きハンズオフには非対応、残り6単位は同機能を標準装備し高速道路渋滞時0〜約60km/hの条件付きハンズオフとして分類した。通常支援の対象道路・数値速度・ハンズオン要件と、能動ドライバーモニタリング機能は公式資料で確認できないため推定せず、`speedKph`はnull、`driverMonitoring=required`のみ保持した。C SELECTは2026-03-03、S ALL4 SELECTは2026-07-13に販売開始。C / S ALL4は2026-03-03に48Vマイルド・ハイブリッド仕様へ改定、D / JOHN COOPER WORKSは2023-11-21発表、E / SE ALL4は2024-03-01販売開始。Shadow Editionは限定車候補、Slate Blueは特別企画のため通常8単位へ含めず保留とした。

## 時系列の正規化

資料の発行年・確認日をモデル年として公開しない。メーカーがモデル年を明示したHonda ACCORD（2025）、Honda LEGEND（2021）、Volvo EX30（2027）だけ `modelYear` を設定し、日産アリア、セレナ、SUBARUレイバック、Teslaは `modelYear=null` とした。セレナは一次資料の型式世代呼称 `C28` を `generation` に保持する。カタログ適用時点、販売単位導入時点、価格適用時点は月精度を含めて独立フィールドに保持し、日付がないものはnullとする。

## 未掲載・確認継続候補（内訳）

| 候補 | 未確認の理由 | 次回確認先 |
|---|---|---|
| Tesla Model S / Model X | 日本向け公式サポート情報は確認できるが、現行カタログのモデル年・グレード・注文可否を一次情報で確認できない | Tesla Japanの現行デザインスタジオ・日本向けカタログ |
| Toyota / Lexusの現行Toyota Safety Sense / Lexus Safety System+搭載車 | Toyota 20モデル、Lexus 12モデルをモデル候補まで確認。販売単位ごとの標準／オプション、仕様期、価格、取説の照合は未完 | 各ブランド日本公式カタログ・主要装備表・取扱説明書 |
| Mercedes-Benzの現行運転支援搭載車 | 日本仕様の販売単位と監視条件を未確認 | Mercedes-Benz Japan公式モデルページ・取扱説明書 |
| BMWの3シリーズ以外の現行Driving Assistant搭載車 | 日本仕様のグレード別装備を未確認 | BMW Japan公式モデルページ・取扱説明書 |
| Volvo EX30 2026年モデル4グレード | 公式ラインナップには残るが、2027年モデルへの切替後の新規受注／在庫販売区分を未確認 | Volvo Cars Japan公式ラインナップ・販売店注文条件 |
| VolvoのEX30以外の現行Pilot Assist搭載車 | 日本仕様のモデル年・必要装備を未確認 | Volvo Cars Japan公式モデルページ・取扱説明書 |
| Volkswagenの現行IQ.DRIVE搭載車 | 日本仕様のモデル年・販売状態を未確認 | Volkswagen Japan公式モデルページ・取扱説明書 |
| Hyundaiの現行HDA搭載車 | 日本向け販売単位・現行掲載を未確認 | Hyundai Mobility Japan公式モデルページ |
| Mitsubishi / Suzuki / Daihatsuの一次確認候補 | 縦横支援を確認済みのモデルがあるが、現行仕様期・全グレード・価格適用日の販売単位展開を継続中（e VITARA 3単位は掲載済み） | 各社日本公式グレード表・装備表・取扱説明書 |
| BMW限定車 / Mモデル・MINIの一次確認候補 | BMW通常3シリーズ9単位とMINI Countryman通常8単位は掲載済み。BMW限定車・M3、MINI Countryman Shadow Edition / Slate Blueは通常単位と分けて確認待ち | 各社日本公式装備価格表・取扱説明書 |
| Audi / Mercedes-Benz / Porsche等 | モデル単位の支援機能は確認できるが、グレード別の標準／オプションと販売状態の確認が未完 | 各社日本公式装備価格表・コンフィギュレーター |

この台帳の未確認ブランド／モデル群を確認するまでは、サイト全体の国内候補を「網羅」と主張しない。L1のみ、発売予定、過去車両、Level 4サービスは別区分として追加調査する。

### Toyota / Lexusの次回販売単位化候補（2026-09-08確認）

Toyotaの日本向け現行ラインアップと公式安全・主要装備資料から、レーダークルーズコントロール（全車速追従）とLTAの同時設定候補として、アクア、ヤリス、ヤリス クロス、カローラ、カローラ スポーツ、カローラ ツーリング、プリウス、シエンタ、ノア、ヴォクシー、アルファード、ヴェルファイア、クラウン、bZ4X、GRヤリス、RAV4、ハリアー、カローラ クロス、ランドクルーザー250、MIRAIの20モデルを抽出した。Lexus公式のLexus Safety System+対応車種比較では、LX、GX、RX、RZ、NX、UX、LBX、LS、ES、IS、LM、LCの12モデルにレーダークルーズコントロール（全車速追従）とLTAの設定がある。

これはモデル候補の棚卸しであり、公開可能な販売単位32件ではない。比較表の「設定あり」はメーカーオプションを含み得るため、グレード・パワートレーン・駆動方式ごとの標準／オプション、現行販売状態、価格、仕様期、作動条件を個別資料で照合するまで公開データへ追加しない。Toyota Roomy / Raize / Hilux / Land Cruiser 70 / GR86は両機能の現行販売単位を確定できず、クラウン スポーツ／エステート、GRカローラ、ランドクルーザー300も資料一式が不足するため保留する。

公式母集団入口: https://toyota.jp/carlineup/ 、https://toyota.jp/safety/scene/highway/index2.html 、https://lexus.jp/models/ 、https://lexus.jp/safety/compare/ 、https://lexus.jp/safety/highway1/ 。確認日2026-09-08。

## 一次確認済み・公開レコード化待ち

下表は公式日本サイトで縦方向と横方向の同時支援を確認した候補。ただし、販売単位ごとのモデル年、
資料適用期間、標準／オプション、価格適用日の正規化と独立レビューが未完のため、まだ公開件数へ含めない。

| メーカー | 確認済み候補 | 残作業 |
|---|---|---|
| Mazda | 掲載済み35単位（CX-80 8、CX-60 11、新型CX-5 4、MAZDA3 7、CX-30 4、MX-30 Natural Monotone 1） | MAZDA3 FASTBACK 15C / 15S・SEDAN 20S、CX-30 20C / 20S、MX-30 ROTARY-EVグレードはMRCCとCTSの同時支援を確定できず対象外。ROTARY-EV以外の限定仕様は別途確認 |
| Mitsubishi | OUTLANDER PHEV、ECLIPSE CROSS、eKクロス、eKクロス EV、eKスペース、デリカミニ | MI-PILOTの標準／メーカーオプションとグレード別価格を固定 |
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
| Hyundai IONIQ 5 | 監視条件の証拠不足 | HDA2等の装備は確認したが、運転者責任・常時監視の日本向け明文が未確認 |

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
| Model 3の日本向け現行ページ、オートパイロットは同一車線の操舵・加速・ブレーキを支援しドライバー監視が必要 | Tesla Japan | https://www.tesla.com/ja_jp/model3 | 2026-09-07 |
| Model Yの日本向け現行ページ、ドライバー監視下のドライビングアシスト | Tesla Japan | https://www.tesla.com/ja_JP/modely | 2026-09-07 |
| Model 3 / Model Y各3販売仕様の公式ベースプライス（2026年6月26日現在） | Tesla Japan | https://www.tesla.com/ja_JP/support/incentives | 2026-09-10 |
| Model S / Xの日本向け車両情報・オートパイロット導線 | Tesla Japan | https://www.tesla.com/ja_jp/support/meet-your-tesla/model-s / https://www.tesla.com/ja_jp/support/meet-your-tesla/model-x | 2026-09-07 |
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

確認日は2026-09-10。今回追加するのは、公式の現行商品ページで販売単位名と価格を確認でき、
前後・左右の運転支援を一次情報へ結び付けられた2単位だけとした。新車注文可否・発売日は公式ページで
販売単位に固定できないため `unknown` / null のまま保持し、推測していない。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| ノア HYBRID S-Z 2WD（7人乗り）4,056,800円（税込） | トヨタ自動車 | https://toyota.jp/noah/specification/ | 2026-09-10 |
| ノアのToyota Teammate アドバンスト ドライブ（渋滞時支援）121,000円（税込）、S-Z設定、ドライバーモニターカメラ | トヨタ自動車 | https://toyota.jp/pages/contents/noah/004_p_001/pdf/noah_spec_202609.pdf | 2026-09-10 |
| ノアのレーダークルーズコントロール、LTA、対象道路・速度・ステアリング保持条件 | トヨタ自動車 | https://toyota.jp/noah/safety/ | 2026-09-10 |
| ノアのアドバンスト ドライブ作動条件、運転者監視、手放し継続時の制限 | トヨタ自動車 | https://manual.toyota.jp/noah/2201/cv/ja_JP/contents/vhch04se050415.php | 2026-09-10 |
| RZ500e “version L” AWD 8,500,000円（税込） | Lexus | https://lexus.jp/models/rz/features/price_package/ | 2026-09-10 |
| RZ現行ラインアップとRZ500e “version L”の掲載 | Lexus | https://lexus.jp/models/rz/ | 2026-09-10 |
| RZのLexus Safety System＋、全車速追従機能付DRCC・LTA、ドライバーモニター連携 | Lexus | https://lexus.jp/models/rz/features/safety/ | 2026-09-10 |
| RZのLTA作動条件・運転者監視・操作責任 | Lexus | https://manual.lexus.jp/rz/3079/bev/ja_JP/contents/owx1740487964005.php | 2026-09-10 |

ノアはAdvanced Driveの対象条件（高速道路本線の渋滞時・約40km/h以下等）ではハンズオフが可能だが、
運転者の前方監視と必要時の操作が必要なため `allowed_in_conditions` とした。汎用LTAの手保持要求と
Advanced Driveの条件付きハンズオフを混同しない。RZは販売単位に固定したハンズオフ・ドライバーモニター
条件を今回の資料だけでは断定せず未確認とした。価格は任意オプションを車両本体へ加算せず、ノアの必要装備
として別表示する。

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

プリウスはToyota公式安全ページに「ステアリングを持ち続ける必要」が明記されているため `handsOff=not_allowed` とした。NXもLexus公式安全ページ・取扱説明書の同様の注意から `handsOff=not_allowed`、運転者監視を `required` とした。速度の数値範囲や販売単位別の注文可否は、確認できたページで固定できないため未確認のままにし、資料発行年をモデル年へ流用していない。プリウスのみ公式ページが2026年7月仕様を明示するため `modelYear=2026`、`catalogAsOf=2026-07`、`salesUnitIntroducedAt=2026-07`、`priceEffectiveAt=2026-07` とした。NXは適用時点を公式ページで固定できないためnullとした。

## Toyota クラウン（クロスオーバー） / Lexus LBX・RXの根拠（後発対策トランシェ）

確認日は2026-09-10。後発サービスが「Level 2」というラベルだけを模倣しても比較価値が残るよう、渋滞時にどこまで支援するか、車線変更支援、ドライバーモニター、車両本体価格を同じ販売単位へ結び付けた。いずれも公式商品ページの掲載は確認できるが、販売単位ごとの新車注文可否を明文で固定できないため `availability=unknown` とした。

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| クラウン（クロスオーバー）CROSSOVER RS “THE LIMITED-MATTE METAL” 4WD 7,590,000円（税込、2026年9月現在） | トヨタ自動車 | https://toyota.jp/info/crowncrossover/special/ | 2026-09-10 |
| クラウンの全車速追従レーダークルーズ、LTA、LCA、ドライバーモニター、Advanced Drive（渋滞時支援）のRS標準装備 | トヨタ自動車 | https://toyota.jp/crowncrossover/safety/ | 2026-09-10 |
| クラウン 2026.09～のAdvanced Drive（0〜約40km/h、監視下の渋滞時支援） | トヨタ自動車 | https://manual.toyota.jp/crowncrossover/3143/hev/ja_JP/contents/vhch04se050415.php | 2026-09-10 |
| LBX “Bespoke Build” 2WD 5,500,000円（税込、’26年5月現在） | Lexus | https://lexus.jp/models/lbx/features/price_package/ | 2026-09-10 |
| LBXの全車速追従レーダークルーズ、LTA、Advanced Drive、Bespoke BuildのLCA・ドライバーモニター標準装備 | Lexus | https://lexus.jp/models/lbx/features/safety/ | 2026-09-10 |
| LBX 2026.05～のLTA作動条件とステアリング保持責任 | Lexus | https://manual.lexus.jp/lbx/3091/cv/ja_JP/contents/vhch04se050405.php | 2026-09-10 |
| RX500h “F SPORT Performance” AWD 9,030,000円（税込） | Lexus | https://lexus.jp/models/rx/features/price_package/ | 2026-09-10 |
| RXの全車速追従レーダークルーズ、LTA、LCA、ドライバーモニター、Advanced Drive（渋滞時支援）全車標準 | Lexus | https://lexus.jp/models/rx/features/safety/ | 2026-09-10 |
| RXのLCA作動範囲（約70〜130km/h）とドライバーモニター、Advanced Drive 0〜40km/h | Lexus | https://lexus.jp/models/rx/pdf/rx_safety.pdf | 2026-09-10 |
| RX500hのLTA作動条件とステアリング保持責任 | Lexus | https://manual.lexus.jp/rx/2212/hev/ja_JP/contents/vhch04se050405.php | 2026-09-10 |

クラウン、LBX、RXは全車速追従ACCとLTAの同時支援を国土交通省のLevel 2定義へ照合し、サイト上はLevel 2相当とした。Advanced Driveは一部高速道路・自動車専用道路の渋滞時に限る条件付き支援で、運転者の常時監視と必要時の操作が必要。LCAは車線変更を自動化する機能ではなく、道路・速度・周辺車両などの条件がある。価格はオプションや諸費用を加算しない車両本体の税込参考価格として保持する。

## Volvo EX30の根拠（内部保持）

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| 2027年モデル3グレードと税込479万〜629万円 | ボルボ・カー・ジャパン | https://www.volvocars.com/jp/l/ex30/ | 2026-09-07 |
| 3グレードにPilot Assist、全車速追従ACC、ドライバーモニタリングカメラ付DACを標準装備。内容は2026年7月現在 | ボルボ・カー・ジャパン | https://azure-eu-assets.contentstack.com/v3/assets/blt84e01a6904dbd2e8/blt65613ad142855bdf/6a466a78035de07c64d4cca5/MY27_EX30_Ver2_W29%E4%BB%A5%E9%99%8D.pdf | 2026-09-07 |
| Pilot Assistは速度・車間・操舵を支援し、運転者は両手保持と即時介入が必要 | Volvo Support JP | https://www.volvocars.com/jp/support/car/ex30/24w17/article/47d2c97fd33effd3c0a8cc3718c999b7-85596e53922f2e19c0a8cc42679c08ea-8664b2fa77a7e089c0a8296870d1a409/47d2c97fd33effd3c0a8cc3718c999b7-835992c35a0096eec0a8b0971dfcc685-8664b2fa77a7e089c0a8296870d1a409/47d2c97fd33effd3c0a8cc3718c999b7-69b1d5f35a03429ac0a8b0970ac5ed2e-8664b2fa77a7e089c0a8296870d1a409/54f1934e3fd57300c0a8b0c1194a56be-69b1d5f35a03429ac0a8b0970ac5ed2e-8664b2fa77a7e089c0a8296870d1a409/ | 2026-09-07 |

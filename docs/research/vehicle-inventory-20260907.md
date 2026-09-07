# 日本向け現行候補の棚卸し（2026-09-07）

Issue #17の公開候補を、販売単位（市場・メーカー・メーカー明示モデル年または世代・グレード・必要装備・機能版）で管理するための内部台帳。通常一覧には表示しない。確認日は各車両レコードの `sources[].accessedAt` と `lastReviewedAt` に保持し、カタログ適用時点・販売単位導入時点・価格適用時点とは分離する。

## 集計

対象母集団は「日本で正規販売される現行の乗用車のうち、Level 2以上の支援／自動運転を持つ販売単位」。今回は公開データと確認待ち候補を分け、未確認を網羅済みとして数えない。ブランド群と販売単位が混在するため、未確認候補群の総数はまだ確定しない。

| 区分 | 件数 | 定義 |
|---|---:|---|
| 公開データ | 21 | `src/data/vehicles.json` の全レコード（現行20 + 過去1） |
| 既定表示 | 20 | `currentCatalogListed=true` かつ新車候補として一覧に出る現行レコード |
| 今回追加（Volvo） | 3 | EX30 2027年モデルの3グレード。日本向け諸元・価格表と取扱説明書で確認 |
| 今回追加（Suzuki） | 3 | e VITARA X 2WD / Z 2WD / Z 4WD。日本向け現行価格・発売資料・安全装備表で確認 |
| 今回追加（Renault） | 4 | ARKANAのesprit Alpine / techno、FULL HYBRID E-TECH / MILD HYBRID。価格表・機能説明・装備資料で確認 |
| 未掲載・確認継続候補群 | 件数未確定 | Tesla Model S / X と、下記のブランド／モデル群。一次確認済みでも販売単位への展開・レビュー未完なら含める |
| 対象外 | 0 | 今回の候補から対象外と断定したものはない |

未確認候補群の調査が終わるまで、サイト全体の国内候補を「網羅」と主張しない。Honda LEGEND（2021、Level 3）は過去車両のため現行母集団の外にあり、公開データには含むが既定一覧には表示しない。

## 調査済み・掲載単位

| メーカー | モデル / 販売単位 | 状態 | Level | 確認日 |
|---|---|---|---:|---|
| Honda | ACCORD 2025 e:HEV Honda SENSING 360＋ | 掲載 | 2 | 2026-09-07 |
| Honda | ACCORD 2025 e:HEV | 掲載 | 2 | 2026-09-07 |
| Nissan | 日産アリア（現行仕様）B6 / B6 e-4ORCE / B9 / B9 e-4ORCE | 掲載（4単位） | 2 | 2026-09-07 |
| Nissan | セレナ C28 e-POWER LUXION | 掲載 | 2 | 2026-09-07 |
| SUBARU | レヴォーグ レイバック（現行仕様）Limited EX | 掲載 | 2 | 2026-09-07 |
| Tesla | Model 3 Premium（現行仕様） / Model Y Premium（現行仕様） | 掲載（2単位） | 2相当 | 2026-09-07 |
| Volvo | EX30 2027 Plus P5 / Ultra P5 Long Range / Ultra P8 AWD Electric | 掲載（3単位） | 2相当 | 2026-09-07 |
| Suzuki | e VITARA X 2WD / Z 2WD / Z 4WD（現行仕様） | 掲載（3単位） | 2相当 | 2026-09-07 |
| Renault | ARKANA esprit Alpine FULL HYBRID E-TECH / MILD HYBRID、techno FULL HYBRID E-TECH / MILD HYBRID | 掲載（4単位） | 2相当 | 2026-09-07 |

Teslaは日本向け公式のModel別情報とサポートFAQを根拠にModel 3 / Model Yを登録した。Tesla自身がドライブアシスト機能を完全自動運転ではないと説明しているため、FSD等の名称だけでLevel 3以上とは判定していない。Model S / Model Xは公式サポート情報で存在と支援機能の説明を確認できるが、現行カタログのモデル年・グレード・注文可否を確認できないため、内部の未確認候補に残し、公開データへ追加しない。

Volvo EX30は、日本向け2027年モデルの2026年第29週生産分以降の諸元・価格表で3グレードとPilot Assist、全車速追従ACC、ドライバーモニタリングを確認した。Pilot Assistは速度・車間と操舵を支援する一方、取扱説明書が運転者に両手保持と即時介入を求めるため、Level 2相当の運転支援として登録した。税込車両本体価格は479万〜629万円で、価格適用時点は2026年7月、確認日は2026-09-07。価格根拠は内部保持し、価格表示機能はIssue #16で一貫した価格契約を実装してから公開する。

Suzuki e VITARAは、現行価格ページと2025年9月16日付の日本発売資料でX 2WD / Z 2WD / Z 4WDの3販売単位、発売日2026-01-16、価格399万3000円 / 448万8000円 / 492万8000円を確認した。安全装備ページと主要装備表で、全車標準のACC（全車速追従・停止保持）、ACC作動中の車線維持支援、ドライバーモニタリングシステムを確認し、Level 2相当として登録した。車線維持支援の数値速度範囲とハンズオフ可否は公式情報で確認できないため、速度条件とhandsOffは不明としている。価格適用開始日は公式情報で確認できないため `priceEffectiveAt=null` とした。

Renault ARKANAは、現行価格表でesprit AlpineとtechnoのFULL HYBRID E-TECH / MILD HYBRIDを4販売単位として確認した。価格は順に514万9000円、474万9000円、484万円、444万円で、価格の適用開始日は公式資料から確認できないため `priceEffectiveAt=null` とした。2025年7月のesprit Alpine資料と2025年9月のtechno資料をカタログ適用時点として保持し、資料年をモデル年にはしない。公式機能説明・装備資料でACC（ストップ＆ゴー機能付）とレーンセンタリングアシストの標準装備を確認し、国土交通省のLevel 2定義に照合してLevel 2相当と分類した。ACCはおおむね0〜170km/h、レーンセンタリングアシストは先行車ありでおおむね0〜160km/h、先行車なしでおおむね60〜160km/hと記載されるが、車線・先行車認識等の条件がある。運転者は常に監視し直ちに操作する必要があり、ハンズオフ可否は公式情報で確認できないため `unknown` とした。

## 時系列の正規化

資料の発行年・確認日をモデル年として公開しない。メーカーがモデル年を明示したHonda ACCORD（2025）、Honda LEGEND（2021）、Volvo EX30（2027）だけ `modelYear` を設定し、日産アリア、セレナ、SUBARUレイバック、Teslaは `modelYear=null` とした。セレナは一次資料の型式世代呼称 `C28` を `generation` に保持する。カタログ適用時点、販売単位導入時点、価格適用時点は月精度を含めて独立フィールドに保持し、日付がないものはnullとする。

## 未掲載・確認継続候補（内訳）

| 候補 | 未確認の理由 | 次回確認先 |
|---|---|---|
| Tesla Model S / Model X | 日本向け公式サポート情報は確認できるが、現行カタログのモデル年・グレード・注文可否を一次情報で確認できない | Tesla Japanの現行デザインスタジオ・日本向けカタログ |
| Toyota / Lexusの現行Toyota Safety Sense搭載車 | モデル年・グレード・装備の組合せを一次情報で未棚卸し | 各ブランド日本公式カタログ・取扱説明書 |
| Mercedes-Benzの現行運転支援搭載車 | 日本仕様の販売単位と監視条件を未確認 | Mercedes-Benz Japan公式モデルページ・取扱説明書 |
| BMWの現行Driving Assistant搭載車 | 日本仕様のグレード別装備を未確認 | BMW Japan公式モデルページ・取扱説明書 |
| Volvo EX30 2026年モデル4グレード | 公式ラインナップには残るが、2027年モデルへの切替後の新規受注／在庫販売区分を未確認 | Volvo Cars Japan公式ラインナップ・販売店注文条件 |
| VolvoのEX30以外の現行Pilot Assist搭載車 | 日本仕様のモデル年・必要装備を未確認 | Volvo Cars Japan公式モデルページ・取扱説明書 |
| Volkswagenの現行IQ.DRIVE搭載車 | 日本仕様のモデル年・販売状態を未確認 | Volkswagen Japan公式モデルページ・取扱説明書 |
| Hyundaiの現行HDA搭載車 | 日本向け販売単位・現行掲載を未確認 | Hyundai Mobility Japan公式モデルページ |
| Mazda / Mitsubishi / Suzuki / Daihatsuの一次確認候補 | 縦横支援を確認済みのモデルがあるが、現行仕様期・全グレード・価格適用日の販売単位展開を継続中 | 各社日本公式グレード表・装備表・取扱説明書 |
| BMW / MINIの一次確認候補 | 現行装備・価格を確認済みの販売単位があるが、公開レコード化と独立レビューが未完 | 各社日本公式装備価格表・取扱説明書 |
| Audi / Mercedes-Benz / Porsche等 | モデル単位の支援機能は確認できるが、グレード別の標準／オプションと販売状態の確認が未完 | 各社日本公式装備価格表・コンフィギュレーター |

この台帳の未確認ブランド／モデル群を確認するまでは、サイト全体の国内候補を「網羅」と主張しない。L1のみ、発売予定、過去車両、Level 4サービスは別区分として追加調査する。

## 一次確認済み・公開レコード化待ち

下表は公式日本サイトで縦方向と横方向の同時支援を確認した候補。ただし、販売単位ごとのモデル年、
資料適用期間、標準／オプション、価格適用日の正規化と独立レビューが未完のため、まだ公開件数へ含めない。

| メーカー | 確認済み候補 | 残作業 |
|---|---|---|
| Mazda | CX-80、CX-60、新型CX-5、MAZDA3、CX-30、MX-30 ROTARY-EV | 全グレード表記を販売単位へ展開し、CTS/MRCCの仕様期を固定 |
| Mitsubishi | OUTLANDER PHEV、ECLIPSE CROSS、eKクロス、eKクロス EV、eKスペース、デリカミニ | MI-PILOTの標準／メーカーオプションとグレード別価格を固定 |
| Suzuki | FRONX、SOLIO/BANDIT、SWIFT CVT、SPACIA系（e VITARA 3単位は掲載済み） | ACC＋車線中央維持の対象グレードとパッケージを販売単位へ展開 |
| Daihatsu | MOVE、MOVE CANBUS、TANTO系、TAFT、ROCKY | Smart Cruise Packを含む標準／オプション差を販売単位へ展開 |
| BMW | 3シリーズ Sedan 5グレード、Touring 4グレード | 2026年7月生産装備価格表から9販売単位を登録 |
| MINI | Countryman 8グレード | 2026年7月生産装備価格表から8販売単位を登録 |
| Renault | ARKANA 4グレード | 掲載済み。2025年7月 / 9月の資料適用時点をモデル年と分離して保持 |

## 対象外・証拠不足として確認した例

| 候補 | 現時点の区分 | 理由 |
|---|---|---|
| Mazda2 / CX-3 | 対象外候補 | 車線中央維持を公式情報で確認できず、今回のLevel 2操作定義を満たさない |
| Mitsubishi デリカD:5 | 対象外候補 | 現行MI-PILOTのACC＋LKAの組合せを確認できない |
| Daihatsu Atrai | 対象外 | 商用車であり、今回の乗用車母集団外 |
| Daihatsu Thor / Mira e:S | 証拠不足 | ACCとLKCの同時作動を確認できない |
| Mazda MX-30 EV | 現行掲載未確認 | 現行ラインアップ掲載を確認できず、ROTARY-EVと混ぜない |
| Toyota Roomy / Raize / Hilux / Land Cruiser 70 / GR86 | 証拠不足 | LTA＋全車速ACCの現行グレード根拠が不足 |
| Hyundai IONIQ 5 | 監視条件の証拠不足 | HDA2等の装備は確認したが、運転者責任・常時監視の日本向け明文が未確認 |

## Teslaの根拠（内部保持）

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| Model 3の日本向け現行ページ、オートパイロットは同一車線の操舵・加速・ブレーキを支援しドライバー監視が必要 | Tesla Japan | https://www.tesla.com/ja_jp/model3 | 2026-09-07 |
| Model Yの日本向け現行ページ、ドライバー監視下のドライビングアシスト | Tesla Japan | https://www.tesla.com/ja_JP/modely | 2026-09-07 |
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

## Volvo EX30の根拠（内部保持）

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| 2027年モデル3グレードと税込479万〜629万円 | ボルボ・カー・ジャパン | https://www.volvocars.com/jp/l/ex30/ | 2026-09-07 |
| 3グレードにPilot Assist、全車速追従ACC、ドライバーモニタリングカメラ付DACを標準装備。内容は2026年7月現在 | ボルボ・カー・ジャパン | https://azure-eu-assets.contentstack.com/v3/assets/blt84e01a6904dbd2e8/blt65613ad142855bdf/6a466a78035de07c64d4cca5/MY27_EX30_Ver2_W29%E4%BB%A5%E9%99%8D.pdf | 2026-09-07 |
| Pilot Assistは速度・車間・操舵を支援し、運転者は両手保持と即時介入が必要 | Volvo Support JP | https://www.volvocars.com/jp/support/car/ex30/24w17/article/47d2c97fd33effd3c0a8cc3718c999b7-85596e53922f2e19c0a8cc42679c08ea-8664b2fa77a7e089c0a8296870d1a409/47d2c97fd33effd3c0a8cc3718c999b7-835992c35a0096eec0a8b0971dfcc685-8664b2fa77a7e089c0a8296870d1a409/47d2c97fd33effd3c0a8cc3718c999b7-69b1d5f35a03429ac0a8b0970ac5ed2e-8664b2fa77a7e089c0a8296870d1a409/54f1934e3fd57300c0a8b0c1194a56be-69b1d5f35a03429ac0a8b0970ac5ed2e-8664b2fa77a7e089c0a8296870d1a409/ | 2026-09-07 |

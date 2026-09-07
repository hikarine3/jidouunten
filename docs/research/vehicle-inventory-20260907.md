# 日本向け現行候補の棚卸し（2026-09-07）

Issue #17の公開候補を、販売単位（市場・メーカー・モデル・モデル年・グレード・必要装備・機能版）で管理するための内部台帳。通常一覧には表示しない。確認日は各車両レコードの `sources[].accessedAt` と `lastReviewedAt` に保持する。

## 集計

対象母集団は「日本で正規販売される現行の乗用車のうち、Level 2以上の支援／自動運転を持つ販売単位」。今回は公開データと確認待ち候補を分け、未確認を網羅済みとして数えない。ブランド群と販売単位が混在するため、未確認候補群の総数はまだ確定しない。

| 区分 | 件数 | 定義 |
|---|---:|---|
| 公開データ | 11 | `src/data/vehicles.json` の全レコード（現行10 + 過去1） |
| 既定表示 | 10 | `currentCatalogListed=true` かつ新車候補として一覧に出る現行レコード |
| 今回追加（Tesla） | 2 | Model 3 Premium / Model Y Premium。日本向け公式ページでモデル・機能を確認 |
| 未確認候補群 | 件数未確定 | Tesla Model S / X と、下記の未確認ブランド／モデル群。公式グレード・装備・現行掲載の確認待ち |
| 対象外 | 0 | 今回の候補から対象外と断定したものはない |

未確認候補群の調査が終わるまで、サイト全体の国内候補を「網羅」と主張しない。Honda LEGEND（2021、Level 3）は過去車両のため現行母集団の外にあり、公開データには含むが既定一覧には表示しない。

## 調査済み・掲載単位

| メーカー | モデル / 販売単位 | 状態 | Level | 確認日 |
|---|---|---|---:|---|
| Honda | ACCORD 2025 e:HEV Honda SENSING 360＋ | 掲載 | 2 | 2026-09-07 |
| Honda | ACCORD 2025 e:HEV | 掲載 | 2 | 2026-09-07 |
| Nissan | 日産アリア 2026 B6 / B6 e-4ORCE / B9 / B9 e-4ORCE | 掲載（4単位） | 2 | 2026-09-07 |
| Nissan | セレナ 2026 e-POWER LUXION | 掲載 | 2 | 2026-09-07 |
| SUBARU | レヴォーグ レイバック 2023 Limited EX | 掲載 | 2 | 2026-09-07 |
| Tesla | Model 3 Premium 2026 / Model Y Premium 2026 | 掲載（2単位） | 2相当 | 2026-09-07 |

Teslaは日本向け公式のModel別情報とサポートFAQを根拠にModel 3 / Model Yを登録した。Tesla自身がドライブアシスト機能を完全自動運転ではないと説明しているため、FSD等の名称だけでLevel 3以上とは判定していない。Model S / Model Xは公式サポート情報で存在と支援機能の説明を確認できるが、現行カタログのモデル年・グレード・注文可否を確認できないため、内部の未確認候補に残し、公開データへ追加しない。

## 未確認候補（内訳）

| 候補 | 未確認の理由 | 次回確認先 |
|---|---|---|
| Tesla Model S / Model X | 日本向け公式サポート情報は確認できるが、現行カタログのモデル年・グレード・注文可否を一次情報で確認できない | Tesla Japanの現行デザインスタジオ・日本向けカタログ |
| Toyota / Lexusの現行Toyota Safety Sense搭載車 | モデル年・グレード・装備の組合せを一次情報で未棚卸し | 各ブランド日本公式カタログ・取扱説明書 |
| Mercedes-Benzの現行運転支援搭載車 | 日本仕様の販売単位と監視条件を未確認 | Mercedes-Benz Japan公式モデルページ・取扱説明書 |
| BMWの現行Driving Assistant搭載車 | 日本仕様のグレード別装備を未確認 | BMW Japan公式モデルページ・取扱説明書 |
| Volvoの現行Pilot Assist搭載車 | 日本仕様のモデル年・必要装備を未確認 | Volvo Cars Japan公式モデルページ・取扱説明書 |
| Volkswagenの現行IQ.DRIVE搭載車 | 日本仕様のモデル年・販売状態を未確認 | Volkswagen Japan公式モデルページ・取扱説明書 |
| Hyundaiの現行HDA搭載車 | 日本向け販売単位・現行掲載を未確認 | Hyundai Mobility Japan公式モデルページ |

この台帳の未確認ブランド／モデル群を確認するまでは、サイト全体の国内候補を「網羅」と主張しない。L1のみ、発売予定、過去車両、Level 4サービスは別区分として追加調査する。

## Teslaの根拠（内部保持）

| 対象事実 | 発行元 | URL | 確認日 |
|---|---|---|---|
| Model 3の日本向け現行ページ、オートパイロットは同一車線の操舵・加速・ブレーキを支援しドライバー監視が必要 | Tesla Japan | https://www.tesla.com/ja_jp/model3 | 2026-09-07 |
| Model Yの日本向け現行ページ、ドライバー監視下のドライビングアシスト | Tesla Japan | https://www.tesla.com/ja_JP/modely | 2026-09-07 |
| Model S / Xの日本向け車両情報・オートパイロット導線 | Tesla Japan | https://www.tesla.com/ja_jp/support/meet-your-tesla/model-s / https://www.tesla.com/ja_jp/support/meet-your-tesla/model-x | 2026-09-07 |
| Teslaの機能は完全自動運転ではなく、常に注意し直ちに運転を代われる準備が必要 | Tesla Japan | https://www.tesla.com/ja_jp/support/meet-your-future-tesla-faq | 2026-09-07 |

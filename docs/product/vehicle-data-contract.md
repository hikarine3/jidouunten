# 車両・自動化レベル データ契約

更新: 2026-09-07

## 目的

比較画面、車両詳細、解説、構造化データが同じ事実を参照するための契約。
公開面を直接書き分けず、1つの車両レコードから生成する。

## レベルの表示規則

| Level | サイト上の分類 | 周囲の監視・運転主体の要点 |
|---|---|---|
| 0 | 運転自動化なし | 運転者がすべて実施 |
| 1 | 運転支援 | システムが前後または左右の一方を支援。運転者が監視 |
| 2 | 運転支援 | システムが前後・左右を支援。運転者が監視 |
| 3 | 条件付自動運転 | ODD内ではシステムが運転。引継ぎ要求時は運転者が対応 |
| 4 | 高度自動運転 | 限定領域内ではシステムが対応。主にサービス/実証として別区分 |
| 5 | 完全自動運転 | 条件限定なし。現時点の購入可能車一覧とは別区分 |

`level` は優劣点数として使わない。Level 2の機能名称に「自動運転」とだけ表示しない。

## 公開単位

1レコードは次の組合せを表す。

```text
market + maker + model + model_year + generation + grade + required_package + feature_version
```

同じ車名でも、グレード、年式、ソフトウェア、オプションで条件が異なれば別レコードにする。

## 必須フィールド

| field | 型 / 例 | 規則 |
|---|---|---|
| `id` | string | 安定ID。表示名変更で変えない |
| `market` | `JP` | 初期は日本のみ |
| `maker`, `model` | string | 日本公式名称 |
| `modelYear` | string/null | メーカーが明示したモデル年のみ。資料発行年・カタログ確認年を代入しない |
| `generation` | string/null | メーカーが明示した世代・型式呼称。モデル年の代替推定には使わない |
| `grade` | string | 日本公式の販売単位名 |
| `catalogAsOf` | `YYYY-MM`/null | 現行カタログ・公式ラインアップの適用時点。確認日とは別 |
| `salesUnitIntroducedAt` | `YYYY-MM-DD` または `YYYY-MM`/null | 当該販売単位の発売・導入時点。資料年から推定しない |
| `priceEffectiveAt` | `YYYY-MM-DD` または `YYYY-MM`/null | 掲載価格の適用時点。価格確認日とは別 |
| `price` | object/null | 公式金額、駆動方式などの条件、税区分、任意オプションを分離して保持。金額を確認できない場合はnull |
| `requiredPackage` | string/null | 標準、オプション、必要契約を明示 |
| `automationLevel` | 0–5 | 一次情報で確認。メーカー認証とサイト分類を区別 |
| `category` | `driver_assistance` / `automated_driving` | Level 0–2 / 3–5に対応 |
| `availability` | 下記enum | 販売・利用状態 |
| `availabilityCheckedAt` | date | 日本での状態確認日 |
| `odd` | object | 道路、速度、天候、時間、地理条件など |
| `driverMonitoring` | enum | `required` / `takeover_ready` / `not_required_in_odd` / `unknown` |
| `handsOff` | enum | `allowed_in_conditions` / `not_allowed` / `unknown` |
| `capabilities` | string[] | 定義済みIDだけを使用 |
| `limitations` | string[] | 利用者判断に必要な制約 |
| `sources` | object[] | URL、発行元、確認日、対象事実、種別 |
| `factStatus` | enum | `verified` / `stale` / `conflicting` / `unknown` |
| `lastReviewedAt` | date | レコード全体の最終レビュー日 |

## 販売・利用状態

- `new_order_available`: 日本で新車注文可能と公式に確認
- `inventory_only`: 新規生産/受注終了だが在庫販売の可能性
- `used_only`: 中古流通のみ
- `service_available`: 個人購入ではなく移動サービスとして利用可能
- `trial_or_research`: 実証・研究段階
- `announced`: 発表済みだが提供前
- `unavailable`: 日本で現在利用不可
- `unknown`: 一次情報で確認できない

一覧の既定はメーカー公式サイトに掲載を確認できた候補。注文可否の未確認は `unknown` として
「注文可否：未確認」を表示し、新車注文可能とは断定しない。
`used_only`、実証・サービス・発表段階は別の選択肢に分離する。
現行掲載を確認できないunknownは既定表示に入れない。対象年式は表示するが、
根拠URL・確認日・最終確認日は内部のデータ正本と棚卸し台帳で管理し、通常UIには表示しない。

### 時系列の意味

`modelYear` はメーカーがモデル年として明示した場合だけ設定する。公式資料の発行年、
カタログの確認年、発売年をモデル年へ流用しない。明示がない場合は `null` とし、
表示時は `generation`、それもなければ「現行仕様」とする。
`catalogAsOf`、`salesUnitIntroducedAt`、`priceEffectiveAt` はそれぞれ独立した時点であり、
確認日（`sources[].accessedAt` / `lastReviewedAt`）と混同しない。精度が月までしかない
一次情報は `YYYY-MM` のまま保持し、日を捏造しない。

## ODD

最低限、次を独立フィールドとして持つ。

- `roadTypes`: 高速道路、自動車専用道路、一般道、限定ルートなど
- `speedKph`: 最小/最大/条件文
- `trafficConditions`: 渋滞時、追従対象車あり等
- `weather`: 雨、雪、視界等の制限
- `geoRestriction`: 高精度地図区間、指定エリア等
- `driverConditions`: 着座、視線、引継ぎ可能性等
- `manufacturerSummary`: 公式説明の短い要約（転載ではなく自作文）

値がないことと、条件がないことを区別する。未確認は `unknown` とする。

## 価格

- `price.kind` は、公式に構成別金額を確認できた `exact` と、「○円〜」の下限だけが明示された `range` を分ける。
- 価格順は車両本体の最小公式金額で並べ、価格未確認は末尾に置く。任意オプションは加算しない。
- 「〜」の上限、税込・税別、価格適用日は公式に明示された場合だけ保持する。取得日から推定しない。
- 補助金適用後、ローン月額、塗装・パッケージ込みの見積総額を車両本体価格として保持しない。
- 一覧は万円単位の概算、詳細・比較は公式金額を表示する。根拠URL・確認日は内部正本に保持し、通常UIを管理情報で埋めない。

## 根拠と鮮度

- レベル、販売状態、機能、ODDはメーカー公式、取扱説明書、国土交通省などの一次情報で確認する。
- メーカーがレベルを明記しない運転支援は、公式の前後・左右制御と常時監視の説明を
  国土交通省定義に照合した「サイト分類」と明示する。メーカーがLevel 2認証を得たとは記述しない。
  根拠のない機能・レベル推測はしない。Level 3は認可等の直接根拠を必須とする。
- 速度域は対象機能（通常ACC/LKASかハンズオフか）を明記する。別機能の速度をハンズオフ範囲へ転用しない。
- 検索結果スニペット、販売店ブログ、まとめ記事だけで `verified` にしない。
- sourceごとに `publisher`, `url`, `title`, `accessedAt`, `supports` を保存する。
- 販売状態は90日、機能・ODDは180日を暫定レビュー期限とする。期限超過は削除せず `stale` 表示。
- 情報が競合する場合は公開上も断定せず `conflicting` としてレビューIssueへつなぐ。

## 波及契約

車両事実を変更した場合は、少なくとも次を同じ変更で検証する。

1. レベル別一覧の件数とカード
2. 車両詳細
3. 2台比較
4. 関連する解説・ニュースのリンク
5. sitemap / canonical / JSON-LD
6. 日本語の注意表示と出典リンク

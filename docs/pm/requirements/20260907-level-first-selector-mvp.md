# JID-001 Level-first selector MVP

更新: 2026-09-07

## 1. Sprint meta

- 種別: code + data + content + infrastructure
- 採択日: 2026-09-07
- Status: GitHub Projectを参照
- 対象URL: `/`, `/levels/`, `/cars/`, `/cars/[slug]/`, `/compare/`

## 2. Why

自動運転に関心がある購入検討者が、名称や広告表現ではなく、自動化レベルと実際の作動条件から
日本で選べる候補を見つけられるようにする。最初に動かす指標はselector開始率、絞り込み完了率、
比較開始率、メーカー公式への遷移率。

## 3. Core（最大3件）

1. 利用者がLevel 1/2/3の違いを理解し、対象レベルの購入候補だけを表示できる。
2. 道路、ハンズオフ、販売状態で絞り込み、根拠付きの車両詳細を確認できる。
3. 2台を並べ、利用条件と必要装備の違いを比較できる。

## 4. 対象

- Astro + TypeScriptのstatic-firstサイト
- Cloudflare Pages向けbuildとpreview
- schema validation済みの日本向け車両レコード最低6件
- Level 1/2/3の説明とLevel 2の運転者監視注意
- level-first一覧、絞り込み、詳細、2台比較
- mobile/desktopの主要導線
- canonical、OG、基本JSON-LD、sitemap、robots
- selector・filter完了・compare・outbound clickの計測イベント設計

## 5. 非対象

- ログイン、保存、通知、口コミ
- D1、管理画面、ユーザー投稿
- Level 4/5サービスの網羅
- 車両安全性ランキングや事故回避保証
- ニュース量産、広告最適化、販売先との商用契約
- `自動運転.jp` のリダイレクト再設定（すでに別途設定済み）

## 6. 技術・データ要件

- 車両データは `docs/product/vehicle-data-contract.md` に適合する。
- 表示面は同じ構造化レコードから生成し、一覧・詳細・比較へ事実を複製しない。
- filteringはURL queryへ反映し、戻る/共有で同じ状態を復元できる。
- JavaScript無効時もLevel説明と車両詳細へ到達できる。
- 根拠URL、発行元、確認日、販売状態確認日を表示する。
- `unknown`, `stale`, `conflicting` を非表示でごまかさない。
- build outputは `dist/`。Git連携でPR preview、`main` productionを想定する。

## 7. E2Eシナリオ

### A. Level 2から候補を探す

- 起点: anonymous、mobile viewport
- 操作: `/` → Level 2 → 高速道路 → ハンズオフ可
- 確認: URL queryとカード件数、全カードの条件表示をブラウザで確認
- 期待: 条件外の車両が混ざらず、Level 2では運転者監視が必要と表示される
- 環境: local + Cloudflare preview

### B. 車両の根拠を確認する

- 起点: anonymous
- 操作: 結果カード→車両詳細→公式情報
- 確認: モデル年、グレード、必要装備、ODD、確認日、公式URL
- 期待: 表示値がsource recordと一致し、外部リンクが公式一次情報を指す
- 環境: local + Cloudflare preview

### C. 2台を比較する

- 起点: anonymous、desktop viewport
- 操作: 2台を選択→比較
- 確認: レベル、道路、速度、ハンズオフ、監視、装備、販売状態
- 期待: 同じ比較軸で差が表示され、空欄は `不明` と示される
- 環境: local + Cloudflare preview

## 8. 完了条件

- [ ] 上記E2E 3件中3件がlocalとCloudflare previewでPASS
- [ ] 車両schema検証が全レコードPASSし、最低6件すべてに一次情報がある
- [ ] unit/integration/accessibility/link checksを件数付きで記録
- [ ] mobile/desktopで表示、操作、URL復元を確認
- [ ] Level 2の注意表示とLevel 3の引継ぎ条件を確認
- [ ] canonical、sitemap、robots、404を確認
- [ ] performance/accessibilityの初期baselineを記録
- [ ] rollbackがPagesの直前deploymentへの切替で実行可能
- [ ] 本番公開を行った場合は `jidouunten.jp` と `自動運転.jp` のproduction smokeを記録

## 9. QA failure条件

- レベルと運転主体の説明が矛盾する
- 同名車の別グレード・別年式が混ざる
- 販売終了車が既定の購入可能一覧に出る
- 公式一次情報がないレコードをverifiedとして表示する
- フィルター結果とURLが一致しない
- 比較軸の空欄を「対応なし」と誤表示する
- build成功またはHTTP 200だけで完了判定する

## 10. Riskとrollback

- 最大リスクはLevel 2を自動運転と誤認させることと、販売・機能情報の陳腐化。
- auth、個人情報、課金、DB migrationは扱わない。
- 公開不具合時はCloudflare Pagesで直前の正常deploymentへrollbackし、問題のデータレコードは
  削除せず公開対象外にして根拠を修正する。

## 11. 参照

- `docs/strategy/product-strategy.md`
- `docs/product/vehicle-data-contract.md`
- `docs/research/official-sources.md`

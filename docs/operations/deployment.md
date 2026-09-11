# Cloudflare Pages公開運用

更新: 2026-09-11

## 最新の配信（2026-09-11 Toyota カローラ スポーツ／ツーリング追加）

- exact app release commit: `6687267`
- immutable: https://cf667796.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: カローラ スポーツ3単位、カローラ ツーリング6単位の計9販売単位を追加。全250販売単位（現行249）、税込244万7,500円〜339万3,500円。全車Level 2相当（追従走行＋車線中央維持）、ステアリング保持が必要でハンズオフ不可。同じLevel 2内の能力差を能力チェックボックスと比較で絞り込める。公式商品・グレード・安全性能・見積り導線を追加し、注文可否は未確認を維持。
- SEO: 詳細250ページのtitle／descriptionを販売単位単位で一意化し、canonical／robots／hreflang／OG/Twitter／Product＋BreadcrumbList JSON-LDを確認。sitemap-0は255 URL、公開HTMLの内部enum・根拠URL漏れ0件。
- QA: `npm test` 52/52、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build256、release guard PASS、ローカル／immutable／本体E2E各1/1（GA collect HTTP204）。カローラ公式根拠11/11 URL HTTP200、registry required selector5/5、独立監査PASS。
- 直前の正常配信・ロールバック候補: https://b4a74e7c.jidouunten.pages.dev

## 最新の配信（2026-09-11 Audi A5／A5 Avant追加・詳細SEO強化）

- exact app release commit: `e1ca12d`（E2E描画待ち補正 `05b9dd2`）
- immutable: https://b4a74e7c.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Audi A5／A5 AvantのTFSI 110kW、TFSI quattro 150kW、TDI quattro 150kWをセダン／Avant各3単位、計6販売単位で追加。税込617万〜760万円、TFSIの日本発売日2025-02-17、TDIの日本発売日2025-06-24、全車Level 2相当（追従走行・車線中央維持・車線変更支援、ハンズオフ不可）として比較できる。注文可否は一次情報不足のため未確認を維持し、Audi公式の見積り・ディーラー・試乗導線を追加。
- SEO: 現行240／全241販売単位。詳細ページのtitle／descriptionを販売単位（メーカー・車種・グレード・Level・価格・能力差）で一意化し、Product＋BreadcrumbList JSON-LDを追加。全247 HTMLでcanonical／robots／hreflang／OG/Twitter／WebSite＋WebPage JSON-LDを確認。sitemap-0は246 URL。
- QA: `npm test` 51/51、`npm run check` 0 errors / 0 warnings / 6 hints、実ID build247、release guard PASS、ローカルE2E1/1、immutable／本体E2E各1/1（GA collect HTTP204）。Audi根拠6/6・公式導線4/4 HTTP応答、registry静的marker6/6・required selector5/5、公開HTML内部情報漏れ0件、独立監査PASS。
- 直前の正常配信・ロールバック候補: https://74a72192.jidouunten.pages.dev

## 最新の配信（2026-09-11 ヤリス クロス20販売単位追加）

## 最新の配信（2026-09-11 Toyota ヤリス17販売単位・Level 1対応・SEO整合）

- exact app: `6f995bb`（実装 `d709dcf`、SEOメタ整合を含む）
- immutable: https://74a72192.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: ヤリスの価格比較可能な17販売単位を追加（169万7,300円〜288万4,200円）。1.0L CVTの2単位をLevel 1（ACCのみ）、その他15単位をLevel 2（ACC＋LTA）、ハイブリッド6単位を渋滞時支援として比較可能にした。Level 1の絞り込みを有効化し、KINTO月額のみのU 2単位は価格比較から保留。
- SEO／導線: トップ・一覧のtitle／descriptionをLevel 1/2表記へ更新。canonical／robots／hreflang／OG/Twitter／WebSite＋WebPage JSON-LD、公式見積り導線、sitemap240 URLを維持。
- QA: Vitest50/50、価格235/235（現行234/234、exact219／range15／未確認1）、公式導線51モデル／50 URL／64 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build241、release guard PASS、ローカル／immutable／production E2E各1/1（GA collect HTTP204）、Yaris source／見積りURL HTTP200、registry静的marker／required selector PASS、公開HTML内部情報漏れ0件、主要URL HTTP200、IDN path/query301、独立候補監査PASS。
- 直前の正常配信・ロールバック候補: https://01434fd9.jidouunten.pages.dev

- exact app: `95b31d5`（実装 `c4b401d`、依存レジストリmarker更新を含む）
- immutable: https://01434fd9.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: トヨタ ヤリス クロスの現行20販売単位（Z“Adventure”／Z／G／X／U／GR SPORT、ハイブリッド・ガソリン、2WD／E-Four）を追加。全218販売単位（現行217、過去1）、価格212万6,300円〜335万5,000円、全車Level 2相当・ハンズオフ不可・ACC／車線中央維持／渋滞時支援で比較可能にした。注文可否は根拠不足のため20単位とも未確認を維持。
- SEO／導線: ヤリス クロスの公式商品・見積り導線を追加。title／descriptionの現行217件、sitemap223 URL、既存のrobots／canonical／hreflang／OG/Twitter／WebSite＋WebPage JSON-LDを維持。
- QA: Vitest49/49、価格218/218（現行217/217、exact202／range15／未確認1）、公式導線50モデル／49 URL／63 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build224、release guard PASS、ローカル／immutable／production E2E各1/1（GA collect HTTP204）、ヤリス クロス代表詳細・比較・公式URL／見積りURL HTTP200、registry静的marker339面・Yaris required selector4/4、公開HTML内部enum・内部日付キー漏れ0件、主要URL HTTP200、IDN path/query 301、独立候補監査PASS。
- 直前の正常配信・ロールバック候補: https://df93d984.jidouunten.pages.dev

## 最新の配信（2026-09-11 価格メタデータ補正）

- exact app: `6483639`（Lexus GX550 2販売単位で、一次資料に明示のない価格適用日を推定せず`priceEffectiveAt`を未設定へ補正）
- immutable: https://df93d984.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 公開表示・SEO・サイトマップの内容は直前配信から不変。GX550は価格と2026年9月のカタログ確認月を表示し、日付の推定値は表示しない。
- QA: Vitest48/48、価格198/198（現行197/197）、公式導線49モデル／62 actions、Astro check 0 errors / 0 warnings / 6 hints、実ID build204、release guard PASS、immutable・production E2E各1/1（GA collect HTTP204）、GX550詳細2/2、主要URL HTTP200、IDN path/query 301、独立候補監査PASS。
- 直前の正常配信・ロールバック候補: https://7626aae0.jidouunten.pages.dev

## 最新の配信（2026-09-11 候補拡充・SEO／一覧改善）

- exact app: `90a7f7db13eae274b7de246fb9960578d3dd5ecc`
- immutable: https://7626aae0.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Volkswagen Tiguan 6、Lexus GX550 2、Toyota ランドクルーザー250 1の計9販売単位を追加。全198販売単位（現行197、過去1）を、Level 2相当・ACC／車線維持・ステアリング保持・価格で比較可能にした。注文可否は一次根拠がないため9単位とも未確認を維持。
- SEO／UI: 一覧トップの用途ガイドを全幅・中央基準へ修正、0件の能力カードを非表示、発売日不明カードは確認月フォールバックまたは項目省略。title／description、robots、canonical、hreflang、OG/Twitter、WebSite＋WebPage JSON-LDを各静的ページへ出力。
- QA: Vitest48/48、価格198/198（現行197/197）、公式導線49モデル／62 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build204、release guard、ローカルE2E1/1、immutable・production E2E各1/1（GA collect HTTP204）、registry333/333、公開HTML内部enum・内部日付キー漏れ0件。主要URL HTTP200、IDN path/query 301を確認。
- 直前の正常配信・ロールバック候補: https://36c737f6.jidouunten.pages.dev

## 最新の配信（2026-09-11 注文状態の一次情報更新）

- exact app: `d75ecee`（メーカー一次情報を再確認し、Volvo EX30 3グレードとヒョンデ IONIQ 5 Voyage／Lounge 2グレードを新車注文可へ更新。SUBARU レイバックとLexus LMは注文後の工場出荷目処のみのため注文可否未確認を維持。注文可否チェッカー・研究台帳・依存レジストリを同期）
- immutable: https://9d34dc08.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 全189販売単位（現行188、過去1）の注文状態を注文可21／注文可否未確認167／現在利用不可1へ更新。Volvo EX30は公式オンライン契約、ヒョンデ IONIQ 5 Voyage／Loungeは公式在庫車両の「車両注文」導線を根拠とする。各仕様・在庫・納期・契約成立は保証せず、詳細に注意書きを表示する。自動運転タクシー領域は後続Issue #38で実装予定。
- QA: Vitest46/46、価格189/189（現行188/188）、公式導線46モデル/62 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build195、リリースガード（実ID1件/HTML・テストID0件）、ローカルE2E1/1、immutable・production E2E各1/1（GA collect HTTP204）、公開面依存レジストリ321/321、公開HTML内部enum・source/accessedAt等の漏れ0件。
- immutable／本体で主要10 URL（`/`、`/cars/`、Volvo詳細、Hyundai詳細、SUBARU詳細、Lexus LM詳細、`/levels/`、sitemap-index、sitemap-0、robots）をHTTP200確認。`sitemap-0.xml`は194 URL。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301で維持される。直前の正常配信・ロールバック候補は https://4f0e10ee.jidouunten.pages.dev。

## 最新の配信（2026-09-11 Toyota アクア／カローラ）

- exact app: `527f4f7`（Toyota アクア9／カローラ6の現行15販売単位、販売状態クイック絞り込み、公開面依存レジストリ更新）
- immutable: https://4f0e10ee.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Toyota アクア（Z／G／X／U・GR SPORT）9単位とカローラ（HYBRID W×B／G／X）6単位を追加。価格・駆動方式・Level 2相当のACC／LTA・ステアリング保持条件を販売単位で比較できる。公式見積り導線は追加したが、注文可否は15単位とも未確認のまま表示する。一覧操作盤から「新車注文可16／注文可否 未確認172／現在利用不可1」をクリックして絞り込める。
- QA: Vitest45/45、価格189/189（現行188/188）、公式導線46モデル/62 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build195、ローカルE2E1/1、immutable・production E2E各1/1（GA collect HTTP204）、公開面依存レジストリ316/316、独立Lunaリリース監査PASS
- immutable／本体でHTTP 200を確認（`/`、`/cars/`、アクア詳細・カローラ詳細、Toyota 2台比較、`/levels/`、`/sitemap-index.xml`、`/sitemap-0.xml`、`/robots.txt`）。`sitemap-0.xml`は194 URL。公開HTMLの内部enum・source/accessedAt等の漏れは0件。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301で維持される。直前の正常配信は https://021157cb.jidouunten.pages.dev（途中の実ID再配信前URL https://6c520966.jidouunten.pages.dev はロールバック対象にしない）。

## 最新の配信（2026-09-11 日産アリアB6）

- exact app: `c6a429b`（日産アリアB6の注文状態確認、公開HTMLの内部enum除去）
- immutable: https://021157cb.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 日産アリアのB6／B6 e-4ORCE／B9／B9 e-4ORCEを4販売単位で保持し、現行ページの「日産各店で注文できるB6」「11/26より注文受付中」を根拠にB6だけを新車注文可として表示。B6の参考価格は6,675,900円。残り3単位は注文可否未確認のままにし、在庫・納期・契約成立を保証しない。公式サイト・試乗・販売店・見積り・カタログの既存導線は維持し、注文確定を示すCTAは追加していない。
- QA: Vitest45/45、価格174/174（現行173/173）、公式導線44モデル/60 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build180、ローカルE2E1/1、immutable・production E2E各1/1（GA collect HTTP204）、公開面依存レジストリ648/648、独立Luna監査PASS
- immutable／本体でHTTP 200を確認（`/`、`/cars/`、アリアB6詳細・比較、`/levels/`、`/sitemap-index.xml`、`/sitemap-0.xml`、`/robots.txt`）。公開HTMLの内部enum・source/accessedAt等の漏れは0件。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301で維持される。`sitemap-0.xml`は179 URL。直前rollback: https://2897334d.jidouunten.pages.dev

## 2026-09-11 Mitsubishi OUTLANDER PHEV

- exact app: `c367aa4`（Mitsubishi OUTLANDER PHEVの現行9販売単位を追加）
- immutable: https://2897334d.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 三菱アウトランダーPHEVのBLACK Edition／P Executive Package／P／G／Mを、5・7人乗りと価格差を含む9販売単位で追加。全車Level 2のMI-PILOT（ACC＋車線維持支援）として比較できる。LCAは車線変更支援ではなく死角の車両への注意喚起・衝突回避支援のため、車線変更支援タグには含めない。ステアリング保持が必要で、ドライバーモニター作動は未確認。購入導線は公式の9グレード選択入口であり、在庫・納期・契約確定を保証しない。
- QA: Vitest44/44、価格174/174（現行173/173）、公式導線44モデル/60 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build180、ローカル・immutable・production E2E各1/1、公開面依存レジストリ640/640、独立価値監査PASS
- immutable／本体でHTTP 200を確認（`/`、`/cars/`、Mitsubishi詳細・比較、`/sitemap-index.xml`、`/sitemap-0.xml`、`/robots.txt`）。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301で維持される。`sitemap-0.xml`は179 URL。直前rollback: https://d45dbac4.jidouunten.pages.dev

- exact app: `681d6939540642953e88af4edd69cd29af70eb0e`（BYD DOLPHIN／ATTO 3／SEAL／SEALION 6の7販売単位を追加）
- immutable: https://d45dbac4.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: BYDの現行7販売単位を追加。DOLPHIN Baseline／Long Range、ATTO 3、SEAL RWD／AWD、SEALION 6 FWD／AWDをLevel 2として価格・駆動・定員・能力差で比較できる。DOLPHIN／ATTO 3は車線変更支援（ウインカー操作を合図とする車線変更時の補助）、SEALはドライバー監視を含むが、いずれもハンズオフ不可。新車注文可否・在庫は未確認のまま表示し、カタログ掲載や見積り導線だけで受注可能とは表示しない。
- QA: Vitest43/43、価格165/165（現行164/164）、公式導線43モデル/55 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build171、ローカル・immutable・production E2E各1/1、公開面依存レジストリ331/331、独立価値監査PASS
- immutable／本体でHTTP 200を確認（`/`、BYD詳細、BYD比較、`/sitemap-index.xml`、`/sitemap-0.xml`、`/robots.txt`）。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301で維持される。`sitemap-0.xml`は170 URL。直前rollback: https://4c2f96d7.jidouunten.pages.dev

- exact app: `16567f05acc1a3bd7145c5e225abd7c0c91407b4`（Hyundai IONIQ 5 4販売単位を追加、Volvo根拠表の配置を修正）
- immutable: https://4c2f96d7.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: 現行157販売単位（全158件）へHyundai IONIQ 5のVoyage L／Voyage／Lounge／Lounge AWDを追加。Voyage LはHDA、他3グレードはHDA2（車線変更アシスト付）として同じLevel 2内の差をAND絞り込み・比較できる。新車注文可否とHDA速度数値は未確認のまま表示し、価格だけで受注可能とは表示しない。
- QA: Vitest42/42、価格158/158（現行157/157）、公式導線39モデル/43 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build164、ローカル・immutable・production E2E各1/1、公開面依存レジストリ315/315、独立価値監査PASS
- immutable／本体でHTTP 200を確認（`/`、`/sitemap-index.xml`、`/sitemap-0.xml`、`/robots.txt`、Hyundai詳細、Hyundai比較）。`自動運転.jp`（Punycode: `xn--hhrp90iveiimb.jp`）のpath/queryは本体へ301で維持される。直前rollback: https://4a8c18d3.jidouunten.pages.dev

- exact app: `907b7a556b4195634e38dbc4f4271c9eccfd3cc5`（前段 `da4170a`）
- immutable: https://4a8c18d3.jidouunten.pages.dev
- 本体: https://jidouunten.jp/
- 内容: Level 2用途ガイド・能力チェックボックスANDに加え、Volvo EX30のモデル単位オンライン注文導線を参考表示。2027年各グレードの受注・在庫条件は未確認のまま表示し、注文可能と誤認させない。
- QA: npm test 41/41、価格154/154、公式導線38モデル/40 actions、Python16/16、Astro check 0 errors / 0 warnings / 6 hints、実ID build160、Chrome E2E local/immutable/production各1/1、独立価値監査PASS
- productionとimmutableはともにHTTP 200。固定URLと本体でAND条件、保存→再開、ガイド、異常URL、390/1280px横overflowを実ブラウザ確認。

## 配信方式

- Project: `jidouunten` / production branch: `main`
- Pages URL: `https://jidouunten.pages.dev`
- 本体: `https://jidouunten.jp`
- 日本語入口: `https://自動運転.jp` → 本体へ301、path/query維持
- Build: Astro static、出力 `dist/`
- 初回は認証済みWrangler OAuthによるDirect Upload。GitHub pushのみでは配信されない。

GitHub Appの追加認証待ちを避けて初回公開するため、この方式を採用。
Direct UploadからGit integrationへの同一project内切替は不可。
自動化はGitHub Actions + Wrangler + このproject専用の最小権限tokenで構築できる。
その設定が済むまでは手動配信と明示する。

仕様: [Cloudflare Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)

## 継続承認と配信gate

2026-09-10のオーナー指示「監査PASSしたらどんどんdeployしてよ」を、このPJの継続承認として扱う。
次の全条件を満たすexact candidateは、変更ごとの追加確認を待たず `main` へpushし、既存Pages projectへ配信する。

- worktreeがcleanで、候補commitと対象Issueを固定済み
- `npm test`、`npm run check`、実IDbuild、実ブラウザE2EがPASS
- desktop/mobileの一覧・主要操作・非対象を確認済み
- 実装者と別contextの独立監査が `VERDICT: PASS`
- Production target `jidouunten` と直前正常deployment、rollback先を固定済み

監査後のsource変更、gate失敗、target不一致、rollback不明は停止する。DNS、Secret、課金、削除、別targetは
この継続承認に含めず、都度確認する。

## 配信手順

1. `npm ci`、`npm test`、`npm run check`を実行する。
2. `.env.example`と計測運用に従い公開IDを設定して `npm run build`。配信前に `npm run check:release` を実行し、テスト計測IDを含むdistを止める。
3. `npm run preview`でクエリ復元・2台比較・GTM通常読み込み・同意バナー非表示・モバイルを確認。
4. 対象差分をcommit/pushし、次を実行する。

```bash
npx wrangler@4.121.0 pages deploy dist --project-name jidouunten --branch main
```

5. deployment URL、commit SHA、本体HTTPS、sitemap、robots、404、日本語domainのpath/queryを確認し、Issueへ証拠を記録。

## Rollback

2回目以降はCloudflare Pages dashboardのproduction deployment履歴から、直前の正常deploymentをrollback対象に選ぶ。
初回には過去deploymentがない。初回障害時は修正buildを再配信するか、公開停止の判断をユーザーへ確認する。
DB migration・ユーザー保存データはない。DNSの所有権確認TXTはrollbackで削除しない。

## 未完の運用

- GitHub Actions自動配信とPR preview
- 初回公開後の検索・コンバージョン実測（28日またはselector開始100セッションを初回評価の目安）

現行状態・担当・完了判定の正本はGitHub Issue/Project。

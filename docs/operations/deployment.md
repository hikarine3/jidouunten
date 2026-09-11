# Cloudflare Pages公開運用

更新: 2026-09-11

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
2. `.env.example`と計測運用に従い公開IDを設定して `npm run build`。
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

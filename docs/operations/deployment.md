# Cloudflare Pages公開運用

更新: 2026-09-10

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

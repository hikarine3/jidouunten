# Cloudflare Pages公開運用

更新: 2026-09-07

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

## 手動配信

1. `npm ci`、`npm test`、`npm run check`を実行する。
2. `.env.example`と計測運用に従い公開IDを設定して `npm run build`。
3. `npm run preview`でクエリ復元・2台比較・同意/拒否・モバイルを確認。
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

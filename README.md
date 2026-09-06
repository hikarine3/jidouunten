# jidouunten.jp

日本で選べる自動運転・運転支援車を、レベルと利用条件から比較するサイトです。

## Product

- 本体: `https://jidouunten.jp`
- 日本語ドメイン: `https://自動運転.jp` から本体へ恒久リダイレクト
- 中核導線: 自動運転・運転支援レベルから車を選ぶ
- 補助導線: 利用シーン、作動条件（ODD）、道路、速度、ハンズオフ可否などで絞り込む
- ニュース: 集客用の補助コンテンツ。車種・比較データの更新へ接続できる記事だけを扱う

MVPは Astro + TypeScript を Cloudflare Pages へ配信する静的構成です。
戦略は [docs/strategy/product-strategy.md](docs/strategy/product-strategy.md)、車両データの契約は
[docs/product/vehicle-data-contract.md](docs/product/vehicle-data-contract.md) を参照してください。

## Work management

現行Sprint、Todo、優先順位、担当、PM Phase、依存、公開状態は GitHub Project
[`jidouunten Delivery`](https://github.com/users/hikarine3/projects/5) と各Issueを正本にします。
リポジトリは戦略・仕様・根拠・QA証拠を保持し、
ローカルのTodo一覧を状態管理の正本にはしません。

運用ルール: [docs/pm/github-work-management.md](docs/pm/github-work-management.md)

## Development

```bash
npm ci
npm run dev
npm test
npm run check
npm run build
npm run preview
```

`.env.example`を参照し、計測IDを環境変数に設定してbuildします。OAuth tokenなどの秘密情報は置かないでください。
E2Eはインストール済みPlaywrightとChromeを利用します。必要なら `PLAYWRIGHT_PATH` / `CHROME_BIN` を指定し、
`BASE_URL=https://jidouunten.jp EXPECT_GA_COLLECT=1 node tests/e2e-preview.mjs` で公開版を検証できます。
初回は認証済みWranglerによるPages Direct Uploadです。GitHubへのpushだけでは自動配信されません。
再配信・rollbackは [公開運用](docs/operations/deployment.md)、計測・検索登録は
[計測運用](docs/operations/measurement.md) を参照してください。

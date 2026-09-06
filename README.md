# jidouunten.jp

日本で選べる自動運転・運転支援車を、レベルと利用条件から比較するサイトです。

## Product

- 本体: `https://jidouunten.jp`
- 日本語ドメイン: `https://自動運転.jp` から本体へ恒久リダイレクト
- 中核導線: 自動運転・運転支援レベルから車を選ぶ
- 補助導線: 利用シーン、作動条件（ODD）、道路、速度、ハンズオフ可否などで絞り込む
- ニュース: 集客用の補助コンテンツ。車種・比較データの更新へ接続できる記事だけを扱う

MVPは Astro + TypeScript を Cloudflare Pages へ配信する静的構成を想定しています。
戦略は [docs/strategy/product-strategy.md](docs/strategy/product-strategy.md)、車両データの契約は
[docs/product/vehicle-data-contract.md](docs/product/vehicle-data-contract.md) を参照してください。

## Work management

現行Sprint、Todo、優先順位、担当、PM Phase、依存、公開状態は GitHub Project
[`jidouunten Delivery`](https://github.com/users/hikarine3/projects/5) と各Issueを正本にします。
リポジトリは戦略・仕様・根拠・QA証拠を保持し、
ローカルのTodo一覧を状態管理の正本にはしません。

運用ルール: [docs/pm/github-work-management.md](docs/pm/github-work-management.md)

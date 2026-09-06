# MEMORY

更新: 2026-09-07

## 長期決定

- `jidouunten.jp` を本体、`自動運転.jp` を301リダイレクト入口にする。
- 中核はニュースではなく、自動運転・運転支援レベルから車を選ぶ機能。
- レベルは入口とし、ODD、道路、速度、監視、ハンズオフ、グレード、販売状態も比較する。
- MVPは Astro + TypeScript + Cloudflare Pagesのstatic-first。
- 現行Sprint/Todo状態はGitHub ProjectとIssue、repoは戦略・仕様・根拠・QAの正本。

## 外部設定

- Cloudflareに両zoneを追加済み。
- XServerで両ドメインのnameserverをCloudflareへ変更済み。Cloudflare NSの反映を確認。
- `自動運転.jp` apex/wwwから `https://jidouunten.jp` への301 Redirect Ruleを設定済み。
- Pages `jidouunten` をDirect Upload方式で作成し、`jidouunten.jp` custom domainを設定。
- GitHub pushだけでは自動配信しない。自動化は[JID-008](https://github.com/hikarine3/jidouunten/issues/8)。
- GTM `GTM-PV9QVMJV`、GA4 `G-Q58GM7BVB6`。1stclass側GSC/Bing所有権確認済み。
- 公開・計測検証の証拠は `docs/operations/` とGitHub Issueに記録。

## 次のdelivery

[GitHub Project `jidouunten Delivery`](https://github.com/users/hikarine3/projects/5) の最上位Ready Issueを
正本として着手する。初回公開Sprintは
[JID-001](https://github.com/hikarine3/jidouunten/issues/1) で、仕様は
`docs/pm/requirements/20260907-level-first-selector-mvp.md`。

## 実装・データ・routing

- Astro 7.3.1。公式根拠付き9販売単位（3メーカー・5車種）、現行カタログ掲載8件と過去Level 3例1件。
- カタログ掲載は新規受注可能の保証ではない。受注可否未確認はunknownとして表示。
- vpshikakuの現行CLAUDEモデル割当と共通contractを直接参照。Luna=実装/データ/限定レビュー、Sol=調査/外部計測設定、親=採択/統合/公開。
- 別ブラウザprofileに誤作成した同名測定resourceは未削除。本番GTMの送信先から除外済み。詳細はignored `.cache/measurement-mistakes.json`。

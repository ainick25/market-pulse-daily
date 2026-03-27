# Market Pulse Daily — Claude Code 設定

## プロジェクト概要
金融ニュースブログ「Market Pulse Daily」の自動記事生成・サイト管理。

## 記事生成ルール
- `scripts/generate-post.md` に完全なプロンプトがあるので、それに従う
- 生成したHTMLは `posts/YYYYMMDD.html` に保存
- `data/posts.json` を更新（新しい記事のメタデータを追加）
- `index.html` のカード部分を更新（最新4件を表示）

## コマンド
- 記事生成: web検索で最新ニュースを収集 → HTML生成 → posts/に保存
- サイト更新: `bash scripts/update-site.sh`
- メタデータ再構築: `node scripts/build-metadata.js`

## Git操作
- ブランチ: main
- コミットメッセージ: "📰 YYYY-MM-DD マーケットダイジェスト"
- 自動push: 許可

## ファイルパス規則
- 記事HTML: posts/YYYYMMDD.html
- メタデータ: data/posts.json
- トップページ: index.html

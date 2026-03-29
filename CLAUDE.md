# Market Pulse Daily — Claude Code プロジェクト設定

## サイト情報
- URL: https://ainick25.github.io/market-pulse-daily/
- リポジトリ: ainick25/market-pulse-daily
- ホスティング: GitHub Pages (mainブランチ)

## 日次記事生成フロー
1. Web検索で最新ニュースを網羅的に収集（全7カテゴリ）
2. `posts/YYYYMMDD.html` を単一HTMLファイルとして生成
3. `data/posts.json` の `posts` 配列先頭に新記事メタデータを追加
4. `node scripts/build-metadata.js` を実行
5. git add -A → commit → push

## 必須カテゴリ
1. 為替: USD/JPY, AUD/JPY, GBP/JPY
2. コモディティ: Gold(XAU/USD), 原油(Brent/WTI)
3. 暗号資産: Bitcoin(BTC/USD)
4. 株式指数: S&P500, NASDAQ, 日経225
5. 地政学: 中央銀行政策、紛争、貿易
6. 日本テクノロジー: 日本企業のイノベーション
7. 共通ニュース

## 記事HTML必須要件
- `<body>` 直後に固定ロゴヘッダー（後述）
- ダークテーマ: --bg-primary: #0a0a0f
- フォント: Noto Serif JP(見出し), Noto Sans JP(本文,fw400), JetBrains Mono(データ)
- body font-weight: 400（300禁止）
- セクション: 地政学→為替→コモディティ→暗号資産→株式→日本テック→考察→免責
- 考察: USD/JPY, AUD/JPY, NASDAQ, 日経225 の4ペア分析
- 免責事項ボックス（赤枠border: 2px solid #ff4d6a）
- アニメーション: fade-in(IntersectionObserver), gridSlide, pulse, nav highlight
- すべて日本語、出典を全ニュースに明記、著作権遵守

## 固定ロゴHTML（全記事に必須）
```html
<a href="https://ainick25.github.io/market-pulse-daily/" class="site-logo-fixed">
  <span class="logo-mark">MP</span><span class="logo-text">Market Pulse Daily</span>
</a>
```
CSS:
```css
.site-logo-fixed{position:fixed;top:1rem;left:1rem;z-index:9999;display:flex;align-items:center;gap:.5rem;text-decoration:none;padding:.5rem .8rem;background:rgba(10,10,15,.85);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.1);border-radius:6px;transition:all .3s}
.site-logo-fixed:hover{border-color:rgba(255,224,102,.4);background:rgba(10,10,15,.95)}
.logo-mark{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:.9rem;color:#ffe066;background:rgba(255,224,102,.12);padding:.15rem .4rem;border-radius:3px}
.logo-text{font-family:'Noto Sans JP',sans-serif;font-size:.7rem;color:#c4beda;letter-spacing:.05em}
@media(max-width:600px){.logo-text{display:none}}
```

## posts.json メタデータ形式
```json
{
  "date": "2026-03-29",
  "slug": "20260329",
  "dayOfWeek": "SUN",
  "title": "記事タイトル",
  "excerpt": "要約150文字以内",
  "tags": ["タグ1", "タグ2"],
  "prices": { "usdjpy": "160.3", "gold": "4493" }
}
```

## コミットルール
- ブランチ: main
- 日次記事: "📰 YYYY-MM-DD マーケットダイジェスト"
- セットアップ: "🏗️ 自動化基盤構築"

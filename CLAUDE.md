# MARKETZ — Claude Code プロジェクト設定

## サイト情報
- URL: https://marketpulse-daily.com/
- リポジトリ: ainick25/market-pulse-daily
- ホスティング: GitHub Pages (mainブランチ)

## 時間表記ルール
- **全ての時間は日本時間（JST/UTC+9）で記載する**
- 米国市場の時間は日本時間に換算して表記（例: 「日本時間21:30に雇用統計発表」「日本時間22:30に米国市場オープン」）
- 「明日」「本日」等の表現は日本時間基準で使用する
- 米国の祝日（Good Friday等）は日本の日付で表記（例: 米国4/4金→日本では4/4土の早朝まで影響）

## 日次記事生成フロー
1. Web検索で最新ニュースを網羅的に収集（全7カテゴリ）。**全データはWebSearchから正確に抽出し、推測・記憶・補間は絶対禁止**
2. ファクトチェック: 全ての価格・ニュース・数値をWebSearch出典で裏付け確認
3. `posts/YYYYMMDD.html` を単一HTMLファイルとして生成（Editで1セクションずつ差し替え）
4. `index.html` の**ハイライト欄（日付・テキスト・数値バッジ）**と記事カードリストを更新（ニュース記事は**最新2件**、コラム記事は**最新5件**のみ表示、超過分は削除しアーカイブで閲覧）
5. `node scripts/build-metadata.js` を実行（data/posts.json と archive.html の `<noscript>` フォールバックを自動再生成。コラム記事も含む全記事が対象）
6. `node scripts/build-sitemap.js` を実行（sitemap.xml に全記事＋静的ページを自動追加。contact.html・コラム記事も含む）
7. grepで旧テンプレートの数値残留がないことを検証
8. git add -A → commit → push

### SEO自動化（手動作業不要）
- **sitemap.xml**: `build-sitemap.js` が全記事（daily + column）を自動的に含める
- **archive.html**: `build-metadata.js` が `<noscript>` フォールバックを自動再生成（Googlebot がJS実行前でも全記事リンクを検出可能）
- **data/posts.json**: archive.htmlのJavaScriptが参照するデータソース。build-metadata.jsで自動生成
- Google Search Consoleへのサイトマップ送信は**初回のみ手動**で実施。以降は自動クロール・インデックス

## 必須カテゴリ
1. 為替: USD/JPY, EUR/JPY, GBP/JPY, AUD/JPY
2. コモディティ: Gold(XAU/USD), 原油(Brent/WTI)
3. 暗号資産: Bitcoin(BTC/USD)
4. 株式指数: S&P500, NASDAQ, 日経225
5. 地政学: 中央銀行政策、紛争、貿易
6. 日本テクノロジー: 日本企業のイノベーション（※日本語ソースを優先して確認）
7. 共通ニュース

## ブランドカラー
- ゴールド: #f0a500（アクセント・CTA）
- ネイビー: #1a1a2e（見出し・ヒーロー背景）
- 背景: #ededed（SVG背景）/ #f8f7f4（ページ背景）
- シアン: #07e4dd（ポジティブ）
- レッド: #e63946（警告・ネガティブ）

## 記事HTML必須要件
- **ライトテーマ**: --bg-primary: #f8f7f4（ヒーローのみダークグラデーション #1a1a2e → #16213e → #0f3460）
- フォント: Meiryo(本文優先), Yu Gothic UI, Noto Sans JP(フォールバック), Noto Serif JP(見出し), JetBrains Mono(データ)
- SVGフォント: Yu Gothic UI(優先), Meiryo(フォールバック)
- body font-weight: 400（300禁止）
- セクション: 地政学→為替→コモディティ→暗号資産→株式→日本テック→考察→免責
- 考察: USD/JPY, AUD/JPY, NASDAQ, 日経225 の4ペア分析
- 免責事項ボックス（赤枠border: 2px solid var(--accent-red)）
- アニメーション: fade-in(IntersectionObserver), gridSlide, pulse, nav highlight
- すべて日本語、出典を全ニュースに明記、著作権遵守
- **固定ロゴは廃止**。代わりに右下FABボタン（🏠ホーム / ↑トップ）を設置
- GA4タグ（G-KFT35KZZVC）とA8.netリンクマネージャーがheadに必須

## FABボタンHTML（全記事に必須）
```html
<div class="fab-group">
  <a href="https://marketpulse-daily.com/" class="fab-btn fab-home" title="ホームへ戻る">🏠</a>
  <button class="fab-btn fab-top" onclick="window.scrollTo({top:0,behavior:'smooth'})" title="トップへ戻る">↑</button>
</div>
```

## SEO必須要件（全ページ）
- `<link rel="canonical" href="完全URL">`
- `<meta name="description" content="150文字以内">`
- OGPタグ: og:title, og:description, og:url, og:site_name, og:locale, og:type
- Twitter Card: twitter:card, twitter:title, twitter:description
- 構造化データ: JSON-LD (NewsArticle for posts, WebSite for index)

## ビルドコマンド
```bash
node scripts/build-metadata.js   # posts.json 生成
node scripts/build-sitemap.js    # sitemap.xml 生成
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

## 日曜コラム生成フロー（毎月日曜日）
日曜日はニュースダイジェストの代わりに、投資教育・解説コラムを配信する。
これはアフィリエイト収益の主要導線となるエバーグリーンコンテンツ。

### コラム生成手順
1. テーマに応じてWeb検索で最新情報を収集
2. `posts/YYYYMMDD.html` をコラム用テンプレートで生成
3. `data/posts.json` にメタデータを追加（tags にコラムテーマを含める）
4. `node scripts/build-metadata.js` & `node scripts/build-sitemap.js` を実行
5. git add -A → commit → push

### コラムテーマ例（ローテーション）
1. 🏦 FX口座比較ガイド — 主要FX業者の特徴・手数料・スプレッド比較
2. 📊 証券口座の開設方法 — 初心者向け日本のネット証券比較
3. ₿ ビットコインの仕組み — ブロックチェーン・マイニング・ウォレット解説
4. 🥇 ゴールド投資入門 — 現物・ETF・CFDの違いと始め方
5. 💱 FX初心者ガイド — レバレッジ・ロスカット・注文方法の基礎
6. 📈 株式投資の始め方 — NISA・iDeCo活用法
7. 🛢 コモディティ投資入門 — 原油・穀物ETFの仕組み
8. 🔮 テクニカル分析入門 — 移動平均線・RSI・MACDの読み方
9. 🌍 地政学リスクと投資 — 戦争・紛争が市場に与える影響
10. 💰 リスク管理の基本 — ポジションサイズ・分散投資・損切りルール

### コラムHTML要件
- 日次記事と同じライトテーマ・フォント・アニメーション
- hero-subtitle にコラムタイトル
- hero-tag に `📝 コラム` `初心者向け` 等のタグ
- 目次（sticky-nav）をセクションに合わせて設置
- 免責事項ボックスは必須
- FABボタン（🏠ホーム / ↑トップ）は必須
- SEOメタタグ（canonical, OGP, Twitter Card, JSON-LD）は必須
- 関連する日次記事への内部リンクを自然に配置

## コミットルール
- ブランチ: main
- 日次記事: "📰 YYYY-MM-DD マーケットダイジェスト"
- 日曜コラム: "📝 YYYY-MM-DD コラム: タイトル"
- セットアップ: "🏗️ 自動化基盤構築"

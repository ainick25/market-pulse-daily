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
1. **価格データ取得**: TradingViewスクショを最優先ソースとする（ユーザー提供）。スクショがない場合はユーザーに依頼、もしくはWebSearchで補完（信頼性注意）
2. **ニュース本文リサーチ**: WebSearchで並列検索（価格ではなくニュース本文・文脈専用）
3. **ファクトチェック**: 価格の出典、ニュース日付、数値、人名漢字等を検証。**推測・記憶・補間は絶対禁止**
4. `posts/YYYYMMDD.html` を単一HTMLファイルとして生成（Editで1セクションずつ差し替え）
5. `index.html` の**ハイライト欄（日付・テキスト・数値バッジ）**と記事カードリストを更新（ニュース記事は**最新2件**、コラム記事は**最新5件**のみ表示、超過分は削除しアーカイブで閲覧）
6. **`./scripts/publish.sh YYYYMMDD` を実行**（build-metadata.js + build-sitemap.js + 整合性検証を一括実行。個別コマンドは禁止）
7. **grepで検証**: 旧テンプレートの数値残留がないことを確認（publish.shが整合性検証は済ませている）
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

**記事作成後は必ずこの1コマンドを実行:**
```bash
./scripts/publish.sh YYYYMMDD         # 日次ニュース記事の場合
./scripts/publish.sh YYYYMMDD-column  # コラム記事の場合
```

このスクリプトが以下を自動実行します：
- `build-metadata.js`: posts.json + archive.html `<noscript>` 自動再生成
- `build-sitemap.js`: sitemap.xml 自動再生成
- **整合性チェック**: posts/ == posts.json == archive.html == sitemap.xml の件数一致
- **新記事の存在確認**: 全ファイルに含まれているかチェック
- エラーがあれば非ゼロで終了し、コミット前に気付ける

**個別実行も可能（デバッグ時）:**
```bash
node scripts/build-metadata.js   # posts.json + archive.html <noscript> 生成
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
2. `posts/YYYYMMDD-column.html` をコラム用テンプレートで生成
3. index.htmlのコラムセクションに新記事を追加（最新5件のみ表示）
4. **`./scripts/publish.sh YYYYMMDD-column` を実行**（メタデータ・サイトマップ・archive.htmlを自動更新 + 整合性検証）
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

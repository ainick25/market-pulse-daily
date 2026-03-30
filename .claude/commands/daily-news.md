CLAUDE.mdの「日次記事生成フロー」に従って、今日の日付のマーケットニュースダイジェストを作成してください。

## 手順（必ずこの順序で実行）

### Step 1: ニュース収集
WebSearchで以下9件を**並列**で検索:
- "USD/JPY AUD/JPY GBP/JPY exchange rate [今日の日付]"
- "gold price XAU/USD oil Brent WTI [今日の日付]"
- "Bitcoin BTC price [今日の日付]"
- "S&P 500 NASDAQ Nikkei 225 [今日の日付]"
- "Iran war Hormuz strait latest [今日の日付]"
- "Trump tariffs trade war [今日の日付]"
- "Federal Reserve Bank of Japan policy [今月] 2026"
- "Japan technology innovation news [今日の日付]"
- "global markets today [今日の日付]"

### Step 2: テンプレートコピー
直近の記事HTMLをコピーして新ファイルを作成:
```bash
cp posts/[直近の日付].html posts/YYYYMMDD.html
```

### Step 3: Editで各セクションを順番に差し替え
**タイムアウト防止のため、1セクションずつEditで差し替える。**
**絶対にWriteで全体を一括生成しない。**

3-1. **title・meta・hero**: `<title>`、hero-date、hero-subtitle、hero-tagsを更新
  - hero-tagは標準タグのみ使用: 地政学, 為替, USD/JPY, 原油, ゴールド, ビットコイン, 米国株, 日本株, FRB, 日銀, 関税, 日本テック
3-2. **地政学セクション**: ニュースカード2-3枚を差し替え
3-3. **為替セクション**: price-strip数値 + ニュースカードを差し替え
3-4. **コモディティセクション**: price-strip数値 + ニュースカードを差し替え
3-5. **暗号資産セクション**: price-strip数値 + ニュースカードを差し替え
3-6. **株式セクション**: price-strip数値 + ニュースカードを差し替え
3-7. **日本テックセクション**: ニュースカード2-3枚を差し替え
3-8. **考察セクション**: 4ペア分析(USD/JPY, AUD/JPY, NASDAQ, 日経225)を差し替え
3-9. **SEOメタタグ**: 日付・タイトル・descriptionをreplace_allで一括更新

### Step 4: index.htmlのカード追加
- 記事カードリストの**先頭**に新記事カードを追加
- **最新5件のみ**表示、6件目以降は削除
- タグは標準カテゴリタグのみ使用

### Step 5: ビルド
```bash
node scripts/build-metadata.js
node scripts/build-sitemap.js
```
- posts.jsonのdayOfWeekがタイムゾーンバグで間違う場合は手動修正

### Step 6: コミット・プッシュ
```bash
git add -A
git commit -m "📰 YYYY-MM-DD マーケットダイジェスト"
git push -u origin main
```

## 重要な注意事項
- HTMLの一括Write禁止（タイムアウトの原因）
- 必ずEditで1セクションずつ差し替え
- すべて日本語で記述
- 出典を全ニュースに明記
- GA4タグ（G-KFT35KZZVC）がheadにあることを確認

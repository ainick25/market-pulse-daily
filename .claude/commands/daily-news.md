CLAUDE.mdの「日次記事生成フロー」に従って、今日の日付のマーケットニュースダイジェストを作成してください。

## 手順（必ずこの順序で実行）

### Step 1: ニュース収集
WebSearchで以下10件を**並列**で検索し、徹底的にリサーチする:
- "USD/JPY EUR/JPY GBP/JPY AUD/JPY exchange rate [今日の日付]"
- "gold price XAU/USD oil Brent WTI [今日の日付]"
- "Bitcoin BTC price [今日の日付]"
- "S&P 500 NASDAQ Nikkei 225 [今日の日付]"
- "Iran war Hormuz strait latest [今日の日付]"
- "Trump tariffs trade war [今日の日付]"
- "Federal Reserve Bank of Japan policy [今月] 2026"
- "日本 テクノロジー ニュース 最新 [今日の日付]"（※日本語で検索し日本語ソースを優先）
- "Japan technology innovation news [今日の日付]"
- "global markets today [今日の日付]"

**重要**: 全てのデータはハルシネーションを排除するため、検索結果から正確に抽出すること。推測でデータを補完しない。

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
3-3. **為替セクション**: price-strip数値(USD/JPY, EUR/JPY, GBP/JPY, AUD/JPYの4ペア) + ニュースカードを差し替え
3-4. **コモディティセクション**: price-strip数値 + ニュースカードを差し替え
3-5. **暗号資産セクション**: price-strip数値 + ニュースカードを差し替え
3-6. **株式セクション**: price-strip数値 + ニュースカードを差し替え
3-7. **日本テックセクション**: ニュースカード2-3枚を差し替え
3-8. **考察セクション**: 4ペア分析(USD/JPY, AUD/JPY, NASDAQ, 日経225)を差し替え
3-9. **コラムCTAバナー**: 考察セクションの後、PRボックスの前に以下のCTAバナーを配置（既にあればそのまま）:
```html
<!-- ===== コラムCTA ===== -->
<div class="cta-banner fade-in">
  <div class="cta-banner-content">
    <div class="cta-label">📝 COLUMN — 解説記事</div>
    <div class="cta-title">ボラティリティ相場を乗り越える知識を身につけませんか？</div>
    <div class="cta-desc">地政学リスクの読み方、FX口座の選び方、NISAポートフォリオの組み方など、投資判断の基盤となるコラムを公開中。</div>
    <div class="cta-links">
      <a href="20260405-column.html" class="cta-link primary">地政学リスクと投資 →</a>
      <a href="20260330-column.html" class="cta-link secondary">FX口座比較ガイド</a>
      <a href="20260402-column.html" class="cta-link secondary">NISAポートフォリオ</a>
    </div>
  </div>
</div>
```
※ CTAリンク先は最新のコラム記事に都度更新すること
3-10. **PRボックス**: CTAバナーの後、免責事項の前に以下のPRボックスを配置（既にあればそのまま）:
```html
<!-- ===== PR ===== -->
<div class="news-card gold fade-in" style="border-left-color:var(--accent-gold);margin:2rem 0;padding:1.5rem;">
  <div class="news-head"><span class="news-badge badge-commodity" style="background:rgba(255,224,102,0.25);color:var(--accent-gold);border:1px solid rgba(255,224,102,0.4);">PR — 広告</span></div>
  <div class="news-title" style="margin-top:0.5rem;">FX取引を始めるなら</div>
  <div class="news-body">当サイトの為替分析を参考に実際の取引をお考えの方へ。FX取引高3年連続世界第1位のDMM FXなら、最短即日で口座開設が可能です。</div>
  <div style="margin-top:1rem;display:flex;flex-wrap:wrap;gap:0.8rem;">
    <a href="https://px.a8.net/svt/ejp?a8mat=4AZS0T+3B2PRM+1WP2+6BU5U" rel="nofollow sponsored noopener" target="_blank" style="display:inline-block;padding:0.6rem 1.2rem;background:var(--accent-gold);color:#0a0a0f;font-weight:700;border-radius:6px;text-decoration:none;font-size:0.9rem;">【PR】DMM FX の詳細を見る →</a>
    <a href="https://px.a8.net/svt/ejp?a8mat=4AZS0T+9IC9MA+1WP2+NTRMQ" rel="nofollow sponsored noopener" target="_blank" style="display:inline-block;padding:0.6rem 1.2rem;background:transparent;color:var(--accent-gold);font-weight:700;border-radius:6px;text-decoration:none;font-size:0.9rem;border:1px solid var(--accent-gold);">【PR】DMM CFD の詳細を見る →</a>
  </div>
  <img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=4AZS0T+3B2PRM+1WP2+6BU5U" alt="">
  <img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=4AZS0T+9IC9MA+1WP2+NTRMQ" alt="">
  <div class="news-source" style="margin-top:0.8rem;">※ 投資にはリスクが伴います。FX取引は元本を超える損失が発生する可能性があります。</div>
</div>
```
3-11. **著者情報（Author Box）**: 免責事項の直前に以下の著者ボックスを配置（既にあればそのまま）:
```html
<!-- ===== 著者情報 ===== -->
<div class="author-box fade-in">
  <div class="author-avatar">M</div>
  <div class="author-info">
    <div class="author-name">MARKETZ 編集部</div>
    <div class="author-title">IT CONSULTANT × DATA-DRIVEN TRADER</div>
    <div class="author-bio">現役ITコンサルタント・元エンジニアが運営。複雑なグローバル市場をシステム思考で俯瞰し、テクニカル分析とファンダメンタルズ分析を組み合わせたデータドリブンな市場解説をお届けしています。</div>
  </div>
</div>
```
3-12. **SEOメタタグ**: 日付・タイトル・descriptionをreplace_allで一括更新
  - JSON-LDに `"author":{"@type":"Organization","name":"MARKETZ","description":"ITコンサルタント×データドリブントレーダーによるマーケット分析メディア"}` を含めること
  - JSON-LDに `"image":"https://marketpulse-daily.com/images/og-default.svg"` を含めること
  - `<meta property="og:image" content="https://marketpulse-daily.com/images/og-default.svg">` がheadにあることを確認

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
- GA4タグ（G-KFT35KZZVC）とA8.netリンクマネージャーがheadにあることを確認
- **全ての時間は日本時間（JST）で表記する**
  - 米国市場: 「日本時間22:30オープン」「日本時間5:00クローズ」（夏時間）
  - 雇用統計等: 「日本時間21:30発表」
  - Good Friday等の休場: 日本の日付で「本日」「明日」を判断
  - 「明日」「本日」は日本時間基準で使用する

## CSS必須コンポーネント（テンプレートから引き継がれるが、欠落時は追加）
- **cta-banner**: コラム回遊CTAバナー（ダークグラデーション背景）
- **author-box**: 著者情報ボックス（アバター + 肩書き + 経歴）
- **og:image**: `https://marketpulse-daily.com/images/og-default.svg` がheadに必須

## 最終チェックリスト（コミット前に必ず確認）
- [ ] 為替price-stripが4ペア（USD/JPY → EUR/JPY → GBP/JPY → AUD/JPY）の順で存在するか
- [ ] 為替ニュースカードが旧テンプレートの内容ではなく、本日のデータに更新されているか
- [ ] 全てのprice-strip数値が前日のデータと比較して妥当か（特にAUD/JPY）
- [ ] 日本テックセクションが日本語ソースの最新ニュースに更新されているか
- [ ] 考察セクションの4ペア分析が本日のデータと整合しているか
- [ ] OG descriptionが新しい記事の内容に更新されているか
- [ ] ���間表記が全て日本時間になっ��いるか（ET, UTCが残っていないか）
- [ ] コラムCTAバナー（cta-banner）が考察セクションとPRボックスの間にあるか
- [ ] ���者情報（author-box）が免責事項の直前にあるか
- [ ] og:imageメタタグがheadに存在するか
- [ ] JSON-LDにauthor情報が含まれているか

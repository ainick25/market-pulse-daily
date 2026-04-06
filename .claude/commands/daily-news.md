CLAUDE.mdの「日次記事生成フロー」に従って、今日の日付のマーケットニュースダイジェストを作成してください。

## 手順（必ずこの順序で実行）

### Step 1: 徹底リサーチ（価格データ）
WebSearchで以下を**並列**で検索し、**全ての数値を検索結果から正確に抽出する**。推測・記憶・補間は絶対禁止。

**価格データ（8件並列）:**
- "USD/JPY price today [今日の日付] 2026"
- "EUR/JPY GBP/JPY AUD/JPY price [今日の日付] 2026"
- "gold XAU/USD price today [今日の日付] 2026"
- "WTI Brent crude oil price today [今日の日付] 2026"
- "Bitcoin BTC price today [今日の日付] 2026 live"
- "S&P 500 NASDAQ close [直近取引日] 2026"
- "Nikkei 225 close [直近取引日] 2026"
- "VIX volatility index close [今日の日付] 2026"

### Step 2: 徹底リサーチ（ニュース本文）
WebSearchで以下を**並列**で検索。**ニュースの事実・数値・日付は全て検索結果で裏付ける。**

**ニュース（8件並列）:**
- "Iran war latest news [今日の日付] 2026 Trump"
- "Federal Reserve Bank of Japan rate policy [今月] 2026"
- "US jobs report nonfarm payrolls [今月] 2026"（雇用統計発表週は必須）
- "OPEC plus meeting oil production [今月] 2026"
- "Trump tariffs trade war China [今日の日付] 2026"
- "日本 テクノロジー ニュース 最新 [今日の日付]"（※日本語で検索）
- "Japan technology innovation news [今日の日付] 2026"
- "global markets today [今日の日付] 2026"

### Step 3: ファクトチェック
**Step 1-2で取得した全データを以下の基準でチェックする。1つでも不合格なら追加検索を実施。**

- [ ] 全ての価格データに出典URL（WebSearch結果のリンク）があるか
- [ ] ニュースの日付は「今日」または「直近2-3日以内」か（1週間以上前のニュースは不可）
- [ ] ニュース内の数値（雇用統計の人数、関税率、金利等）が出典と完全に一致するか
- [ ] 「〜と発表」「〜に署名」等の事実は出典で直接確認できるか（推測で書かない）
- [ ] 日銀・FRBの金利は最新の決定結果と一致するか
- [ ] OPEC+の最新決定（増産/減産/維持）が正しいか

**ハルシネーション防止の鉄則:**
1. 検索結果に存在しない事実は書かない
2. 数値は検索結果から直接コピーする
3. 「〜と報じられた」「〜と見られる」等の曖昧表現で事実を捏造しない
4. 不明な場合は記載しないか、追加検索を行う

### Step 4: テンプレートコピー
直近の記事HTMLをコピーして新ファイルを作成:
```bash
cp posts/[直近の日付].html posts/YYYYMMDD.html
```

### Step 5: Editで各セクションを順番に差し替え
**タイムアウト防止のため、1セクションずつEditで差し替える。**
**絶対にWriteで全体を一括生成しない。**

5-1. **title・meta・hero**: `<title>`、hero-date、hero-subtitle、hero-tagsを更新
  - hero-tagは標準タグのみ使用: 地政学, 為替, USD/JPY, 原油, ゴールド, ビットコイン, 米国株, 日本株, FRB, 日銀, 関税, 日本テック
5-2. **地政学セクション**: ニュースカード2-3枚を差し替え
5-3. **為替セクション**: price-strip数値(USD/JPY, EUR/JPY, GBP/JPY, AUD/JPYの4ペア) + ニュースカードを差し替え
5-4. **コモディティセクション**: price-strip数値 + ニュースカードを差し替え
5-5. **暗号資産セクション**: price-strip数値 + ニュースカードを差し替え
5-6. **株式セクション**: price-strip数値 + ニュースカードを差し替え
5-7. **日本テックセクション**: ニュースカード2-3枚を差し替え
5-8. **考察セクション**: 4ペア分析(USD/JPY, AUD/JPY, NASDAQ, 日経225)を差し替え
5-9. **コラムCTAバナー**: 既にあればそのまま。なければ追加:
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
5-10. **PRボックス**: 既にあればそのまま
5-11. **著者情報**: 既にあればそのまま
5-12. **SEOメタタグ**: 日付・タイトル・descriptionをreplace_allで一括更新
  - JSON-LDにauthor, image, publisher.logoを含める
  - og:imageメタタグがheadに必須
5-13. **出典のハイパーリンク化**: 全ての出典テキスト（news-source内）をWebSearch結果のURLでハイパーリンク化する
  - 形式: `<a href="URL" target="_blank" rel="noopener">出典名</a>`
  - news-sourceリンクのCSS（`.news-source a`）がなければ追加

### Step 6: index.html更新
- ハイライト欄（📌本日のハイライト）の**日付・テキスト・全数値バッジ**を更新
- 記事カードリストの**先頭**に新記事カードを追加
- **最新5件のみ**表示、6件目以降は削除

### Step 7: 最終検証（コミット前に必ず実行）
以下のgrepを実行して旧データの残留がないことを確認:
```bash
# 旧テンプレートの数値が残っていないか確認
grep -c '[前日の価格値]' posts/YYYYMMDD.html
# index.htmlのハイライトが更新されているか確認
grep 'TODAY.*HIGHLIGHT' -A 10 index.html
```

### Step 8: ビルド
```bash
node scripts/build-metadata.js
node scripts/build-sitemap.js
```
- posts.jsonのdayOfWeekがタイムゾーンバグで間違う場合は手動修正
- コラム記事のメタデータが消えていないか確認（build-metadata.jsは-column.htmlを認識しない）
- sitemap.xmlからcontact.htmlやコラムが消えていないか確認

### Step 9: コミット・プッシュ
```bash
git add -A
git commit -m "📰 YYYY-MM-DD マーケットダイジェスト"
git push -u origin main
```

## 重要な注意事項
- HTMLの一括Write禁止（タイムアウトの原因）
- 必ずEditで1セクションずつ差し替え
- すべて日本語で記述
- **出典を全ニュースにハイパーリンク付きで明記**
- GA4タグ（G-KFT35KZZVC）とA8.netリンクマネージャーがheadにあることを確認
- **全ての時間は日本時間（JST）で表記する**
  - 米国市場: 「日本時間22:30オープン」「日本時間5:00クローズ」（夏時間）
  - 雇用統計等: 「日本時間21:30発表」
  - Good Friday等の休場: 日本の日付で「本日」「明日」を判断

## CSS必須コンポーネント（テンプレートから引き継がれるが、欠落時は追加）
- **cta-banner**: コラム回遊CTAバナー（ダークグラデーション背景）
- **author-box**: 著者情報ボックス（アバター + 肩書き + 経歴）
- **og:image**: `https://marketpulse-daily.com/images/og-default.svg` がheadに必須
- **.news-source a**: 出典リンクのスタイル（color:var(--accent-gold), hover:underline）

## 最終チェックリスト（コミット前に必ず全項目確認）
- [ ] **全price-stripの数値がWebSearch結果と一致するか**（14項目: 為替4, コモディティ3, 暗号資産3, 株式4）
- [ ] **全ニュースカードの事実がWebSearch結果で裏付けられているか**（捏造・推測なし）
- [ ] **ニュース内の数値（雇用統計、金利、関税率等）がWebSearch出典と完全一致するか**
- [ ] **出典が全てハイパーリンク化されているか**
- [ ] 為替price-stripが4ペア（USD/JPY → EUR/JPY → GBP/JPY → AUD/JPY）の順か
- [ ] 日本テックセクションが日本語ソースの最新ニュースに更新されているか
- [ ] 考察セクションの4ペア分析が本日のデータと整合しているか
- [ ] hero subtitle・OG description・index.htmlハイライトが全て新しい内容に更新されているか
- [ ] 時間表記が全て日本時間か（ET, UTCが残っていないか）
- [ ] コラムCTAバナー・著者情報・og:image・JSON-LD authorが存在するか
- [ ] **grepで旧テンプレートの数値が残留していないことを確認したか**
- [ ] **index.htmlのハイライト欄（日付・テキスト・数値バッジ）が更新されているか**

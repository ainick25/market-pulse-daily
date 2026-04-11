CLAUDE.mdの「日次記事生成フロー」に従って、今日の日付のマーケットニュースダイジェストを作成してください。

## 最重要原則（ハルシネーション防止）

1. **価格データは TradingView スクショを最優先ソースとする**。ユーザーがスクショを送った場合、それが唯一の正解。WebSearch結果と食い違ってもスクショを優先。
2. WebSearchは「ニュース本文・文脈」専用。価格取得には使わない（ソースによって数値がバラつき信頼できない）。
3. スクショがない場合はユーザーに依頼する（「TradingViewのスクショをいただけますか」）。
4. 検索結果に存在しない事実は絶対に書かない。数値は出典から直接コピーする。

## 手順（必ずこの順序で実行）

### Step 1: 価格データ取得
**ユーザーからTradingViewスクショが提供されている場合:**
- 12項目の価格を正確に読み取る（USD/JPY, EUR/JPY, GBP/JPY, AUD/JPY, S&P500, NASDAQ, 日経225, Gold, WTI, Brent, BTC, ETH）
- 前日比（+/-%）も忘れず読み取る

**スクショがない場合:**
- ユーザーに「価格データのためTradingViewスクショを送ってください」と依頼
- もしくはWebSearchで取得する（ただし信頼性に注意）

### Step 2: ニュース本文リサーチ
WebSearchで**並列**に検索（ニュース本文専用）：

- "Iran war latest news [今日の日付] 2026 Trump"
- "Federal Reserve Bank of Japan rate policy [今月] 2026"
- "US jobs report nonfarm payrolls [今月] 2026"（雇用統計発表週は必須）
- "US CPI PCE inflation [今月] 2026"（CPI・PCE発表週は必須）
- "OPEC plus meeting oil production [今月] 2026"
- "Trump tariffs trade war China [今日の日付] 2026"
- "日本 テクノロジー ニュース 最新 [今日の日付]"（※日本語）
- "Japan semiconductor technology news [今日の日付] 2026"
- "global markets today [今日の日付] 2026"

**ユーザーからDZH/FISCO/Reuters等のニュースヘッドラインスクショが提供されている場合:**
- それが最も信頼できるソース。ヘッドラインの時系列を整理してナラティブを組み立てる
- 特に日本語ソース（FISCO, DZH）は日本市場の動きを正確に把握できる

### Step 3: ファクトチェック
- [ ] 全ての価格データの出典（スクショ or URL）が特定できるか
- [ ] ニュースの日付は「今日」または「直近2-3日以内」か
- [ ] ニュース内の数値（雇用統計、CPI、関税率、金利等）が出典と完全一致するか
- [ ] 事実（発表・署名・合意等）は出典で直接確認できるか
- [ ] 日銀・FRBの金利・委員名は最新の決定と一致するか
- [ ] OPEC+の最新決定（増産/減産/維持）が正しいか
- [ ] **人名の漢字が正しいか**（例: 高田創 ≠ 田中）

### Step 4: テンプレートコピー
直近の記事HTMLをコピーして新ファイルを作成:
```bash
cp posts/[直近の日付].html posts/YYYYMMDD.html
```

### Step 5: Editで各セクションを順番に差し替え
**タイムアウト防止のため、1セクションずつEditで差し替える。絶対にWriteで全体を一括生成しない。**

5-1. **title・meta・hero**: 日付文字列の一括置換（replace_all）
  - `2026.04.XX`, `20260XXX`, `2026-04-XX` を全て新日付に
  - hero-date、hero-subtitle、hero-tagsを更新
  - **hero-tagは内容に応じて柔軟に設定**（例: 停戦ラリー, CPI, 雇用統計, 地政学, USD/JPY, 原油, ゴールド, ビットコイン, 米国株, 日本株, FRB, 日銀, 関税, 日本テック）
  - **時刻の誤記注意**: 「本日21:00」等は厳禁。JSTで正確に

5-2. **地政学セクション**: ニュースカード2-3枚を差し替え
5-3. **為替セクション**: price-strip(USD/JPY, EUR/JPY, GBP/JPY, AUD/JPY) + ニュースカード
5-4. **コモディティセクション**: price-strip(Gold, Brent, WTI) + ニュースカード
5-5. **暗号資産セクション**: price-strip(BTC, ETH, F&G) + ニュースカード
5-6. **株式セクション**: price-strip(S&P, NASDAQ, 日経, VIX) + ニュースカード
5-7. **日本テックセクション**: ニュースカード2-3枚を差し替え（**日本語ソース優先**）
5-8. **考察セクション**: 4ペア分析(USD/JPY, AUD/JPY, NASDAQ, 日経225)

5-9. **コラムCTAバナー**: テンプレートから引き継がれるが、リンク切れ防止のため最新のコラム記事URLを指定
5-10. **PRボックス**: テンプレートのまま
5-11. **著者情報**: テンプレートのまま
5-12. **SEOメタタグ**: description, og:description, twitter:description を新日付・新内容に
5-13. **出典のハイパーリンク化**: `<a href="URL" target="_blank" rel="noopener">出典名</a>` 形式

### Step 6: index.html更新
- **ハイライト欄**（📌本日のハイライト）の**日付・テキスト・全数値バッジ**を更新
- 記事カードリストの**先頭**に新記事カードを追加
- **ニュース記事は最新2件のみ、コラム記事は最新5件のみ**表示（超過分は削除）
- 超過分はアーカイブ（archive.html）で閲覧できる

### Step 7: 最終検証（コミット前に必ず実行）
```bash
# 旧テンプレートの価格が残っていないか（例: 前回のUSD/JPY値）
grep -n '159\.27\|73,051' posts/YYYYMMDD.html  # ← 旧値で検索して該当なしを確認

# 新記事の価格が正しく反映されているか
grep -n '新しい値' posts/YYYYMMDD.html
```

### Step 8: ビルド
```bash
node scripts/build-metadata.js   # posts.json + archive.html <noscript> を自動再生成（コラムも含む）
node scripts/build-sitemap.js    # sitemap.xml 自動再生成（全記事 + 静的ページ）
```

**自動化済み（手動作業不要）:**
- `data/posts.json`: 全記事（コラム含む）を自動的に抽出
- `archive.html <noscript>`: Googlebot向けフォールバックを自動再生成
- `sitemap.xml`: 全記事 + 静的ページを自動生成
- `dayOfWeek`: UTC基準で正しく計算（TZバグ修正済み）

### Step 9: ビルド後検証
```bash
# 1. posts.jsonに新記事＋全コラムが含まれるか
grep -c '"slug"' data/posts.json   # 記事数確認

# 2. archive.html <noscript> に新記事が含まれるか
grep -c 'posts/YYYYMMDD.html' archive.html   # 新記事URLが存在すること

# 3. sitemap.xml に新記事が含まれるか
grep 'posts/YYYYMMDD.html' sitemap.xml   # 存在確認

# 4. index.html に新記事のハイライト・カードが反映されているか
grep 'YYYY.MM.DD' index.html
```

### Step 10: コミット・プッシュ（main直接）
```bash
git add -A
git commit -m "📰 YYYY-MM-DD マーケットダイジェスト"
git push -u origin main
```

## 重要な注意事項

### 絶対禁止事項
- ❌ HTMLの一括Write禁止（タイムアウト・エラーの原因）
- ❌ WebSearch結果の価格を鵜呑みにする（ソースによってバラつく）
- ❌ 価格の転記ミス（例: S&P 6,593 を 5,593と書く等の桁誤り）
- ❌ 人名の漢字誤り（例: 高田創 を 田中と書く）
- ❌ 時刻の誤記（例: ET 20:00 を 本日21:00と書く）
- ❌ 標準化されていない時間帯表記（ET, UTCでの記載）

### 必須事項
- ✅ **TradingViewスクショを価格の最優先ソース**として使用
- ✅ 全ての時間は日本時間（JST）で統一
  - 米国市場: 「日本時間22:30オープン」「日本時間5:00クローズ」（夏時間）
  - 雇用統計等: 「日本時間21:30発表」
  - Good Friday等の休場: 日本の日付で「本日」「明日」を判断
- ✅ 出典は全て明記 + ハイパーリンク化
- ✅ GA4タグ（G-KFT35KZZVC）とA8.net Link Managerがheadにあることを確認
- ✅ og:image, canonical, JSON-LD structured data が正しいこと
- ✅ すべて日本語で記述

## CSS必須コンポーネント（テンプレートから引き継がれるが、欠落時は追加）
- `.cta-banner`: コラム回遊CTAバナー（ダークグラデーション背景）
- `.author-box`: 著者情報ボックス（アバター + 肩書き + 経歴）
- `og:image`: `https://marketpulse-daily.com/images/og-default.svg` がheadに必須
- `.news-source a`: 出典リンクのスタイル（color:var(--accent-gold), hover:underline）
- `.fab-group`: 右下のホームボタン・トップボタン

## 最終チェックリスト（コミット前に必ず全項目確認）

### データ精度
- [ ] **12項目の価格がTradingViewスクショと完全一致**（USD/JPY, EUR/JPY, GBP/JPY, AUD/JPY, Gold, WTI, Brent, BTC, ETH, S&P, NASDAQ, 日経）
- [ ] 各価格の前日比（+/-%）も正しい
- [ ] ニュース内の全数値（雇用統計、CPI、金利、関税率等）が出典と完全一致
- [ ] 人名（高田創・植田和男等）の漢字が正しい
- [ ] 時刻・曜日の誤記がない（JST統一）

### コンテンツ
- [ ] hero-subtitle・OG description・meta description・index.htmlハイライトが新内容に更新
- [ ] 為替price-stripが4ペア（USD/JPY → EUR/JPY → GBP/JPY → AUD/JPY）の順
- [ ] 日本テックセクションが日本語ソースの最新ニュースを反映
- [ ] 考察セクションの4ペア分析が本日のデータと整合
- [ ] 全出典にハイパーリンクが付いている
- [ ] コラムCTAバナー・著者情報・og:image・JSON-LDが存在

### ファイル整合性（重要）
- [ ] `grep -n '[前日の価格値]' posts/YYYYMMDD.html` で旧値残留なし
- [ ] `grep -c '"slug"' data/posts.json` で記事数が +1 されている
- [ ] `grep 'posts/YYYYMMDD.html' archive.html` で新記事URLが <noscript> に含まれる
- [ ] `grep 'posts/YYYYMMDD.html' sitemap.xml` で新記事URLが含まれる
- [ ] `grep -c '"isColumn": true' data/posts.json` で **コラム記事が7件以上**（消えていない）
- [ ] index.htmlのハイライト欄（日付・テキスト・数値バッジ）が更新
- [ ] index.htmlの記事カードがニュース最新2件・コラム最新5件になっている

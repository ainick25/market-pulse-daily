CLAUDE.mdの「日曜コラム生成フロー」に従って、コラム記事を作成してください。

テーマ: $ARGUMENTS

## 執筆における厳守ルール（最重要）

### 1. 【時代設定ルール — ハルシネーション防止】
本サイトは「2026年4月」時点の相場環境を前提としたメディア。ユーザーから提示されるファクト（政策金利、株価、為替レート、政権情報など）は**絶対的な事実**として扱う。自分の学習データに基づいて「現在は2024年です」「日銀の金利は異なります」等の修正・警告を**絶対に行わない**。

### 2. 【文字数とトーン＆マナー】
- **モバイルユーザーの読了率最大化**が第一優先。文字数は原則 **4,000〜5,000字程度**（長くても6,000字以内）
- 冗長な解説・繰り返し・自明な前置きは排除
- 文体は「**ITコンサルタント×現役トレーダー**」としての論理的でプロフェッショナルなトーン
- 結論を先に示し、根拠を後で述べる「PREP法」を基本

### 3. 【ビジュアルの最適化 — リソース節約】
- **SVG図解は真に視覚化が必要な2〜3点のみ**（1記事最大3点を目安）
- 以下は**原則SVG不要、HTML tableや箇条書きで代替**:
  - 比較表（日米、複数商品の比較など）
  - 推移データ
  - スペック一覧
- SVGが必要な典型例:
  - 概念のループ図・フロー図
  - 相関マトリクス
  - 構造図（しくみの可視化）

### 4. 【内部リンク設計 — 回遊性】
- 多部構成（前編/後編）の場合、**前編末尾に後編予告バナー**を必ず設置
- 関連する既存コラムへの内部リンクを1〜2箇所に自然に配置
- 記事末尾のCTAバナー経由で他コラム・日次ニュース記事への導線を確保

## 手順（必ずこの順序で実行）

### Step 1: テーマに関する調査
WebSearchで最低10件を**並列**で検索し、最新の情報を収集。
具体的な数値（手数料、金利、価格等）を必ず取得する。
**ユーザーから提示されたファクトがある場合、それらを最優先で使用する**。

### Step 2: テンプレートコピー
直近のコラムHTMLをコピーして新ファイルを作成:
```bash
cp posts/20260330-column.html posts/YYYYMMDD-column.html
```
※ 日付は本日の日付を使用

### Step 3: Editで各セクションを順番に差し替え
**タイムアウト防止のため、1セクションずつEditで差し替える。**
**絶対にWriteで全体を一括生成しない。**

3-1. **head・hero**: title、hero-date（YYYY.MM.DD — COLUMN）、hero-title、hero-subtitle、hero-tagsを更新
  - hero-tagには `📝 コラム` `初心者向け` + テーマに合ったタグを設定
3-2. **導入文**: 「📌 この記事でわかること」を3項目で更新（結果のみ、箇条書き）
3-3. **目次**: セクション構成に合わせて目次リンクを更新
3-4〜3-N. **各コンテンツセクション**: 1セクションずつEditで差し替え
  - 各セクションの見出し直後にアイキャッチ画像を挿入（images/column/から適切なものを選択）
  - 図解が必要な箇所にはSVG図解を作成してimages/column/に保存し、imgタグで挿入
  - テーブルにはJSソート機能を付与
  - calloutボックス、バーチャート、数字カード等のビジュアル要素を多用
3-最後-1. **PRボックス**: そのまま維持（DMM FX / DMM CFDリンク）
3-最後-2. **著者情報（Author Box）**: 免責事項の直前に以下を配置（既にあればそのまま）:
```html
<!-- ===== 著者情報 ===== -->
<div class="author-box fade-in">
  <div class="author-avatar">M</div>
  <div class="author-info">
    <div class="author-name">MARKETZ 編集��</div>
    <div class="author-title">IT CONSULTANT × DATA-DRIVEN TRADER</div>
    <div class="author-bio">現役ITコンサルタント・元エンジニアが運営。複雑なグローバル市場をシステム思考で俯瞰���、テクニカル分析とファンダメンタルズ分析を組み合わせ���データドリブンな市場解説をお届けしています。</div>
  </div>
</div>
```
3-最後-3. **免責事項**: そのまま維持

### Step 4: SVG図解の作成
テーマに応じてSVG図解を作成し `images/column/` に保存。
- ブランドカラー: ゴールド #f0a500、ネイビー #1a1a2e、背景 #ededed、シアン #07e4dd、赤 #e63946
- テキストは最小限（数字とラベルのみ）
- 横長（viewBox 800x350〜420）
- 一目でわかるビジュアル重視（てこ、天秤、バー、フロー図等）

### Step 5: アイキャッチ画像の配置
images/column/ にある画像から各セクションに適切なものを選び、見出し直後に挿入。
```html
<img src="../images/column/ファイル名.jpg" alt="説明" style="width:100%;max-width:800px;margin:1rem auto;display:block;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
```

### Step 6: SEOメタタグの更新
- title、meta description、canonical URL、OGP、Twitter Card、JSON-LDを更新
- description は150文字以内
- `<meta property="og:image" content="https://marketpulse-daily.com/images/og-default.svg">` がheadに必須
- JSON-LDに以下を含めること:
  - `"author":{"@type":"Organization","name":"MARKETZ","description":"ITコンサルタント×データドリブントレーダーによるマーケット分析メディア"}`
  - `"image":"https://marketpulse-daily.com/images/og-default.svg"`
  - `"publisher"` に `"logo":{"@type":"ImageObject","url":"https://marketpulse-daily.com/images/og-default.svg"}` を含める

### Step 7: index.htmlの更新
- 「📝 コラム・解説記事」セクションの先頭に新コラムカードを追加
- 最大5件まで（6件目以降は削除）

### Step 8: 【最重要】統合ビルド＆検証（絶対に省略しない）

**必ずこの1コマンドを実行してください。** 個別に `build-metadata.js` や `build-sitemap.js` を実行するのは禁止です。

```bash
./scripts/publish.sh YYYYMMDD-column
```

このスクリプトは以下を**自動で**実行します（1つでも失敗すればエラー終了）:
1. `build-metadata.js` 実行 — data/posts.json + archive.html `<noscript>` 自動再生成（コラム記事も自動検出）
2. `build-sitemap.js` 実行 — sitemap.xml 自動再生成
3. **整合性チェック**:
   - posts/ == posts.json == archive.html `<noscript>` == sitemap.xml の件数一致
   - コラム記事が1件以上存在
4. **新記事の存在確認**:
   - posts/YYYYMMDD-column.html が存在
   - data/posts.json に含まれる
   - archive.html `<noscript>` のコラムセクションに含まれる
   - sitemap.xml に含まれる
   - index.html のコラムカードに含まれる

**成功時の期待出力:**
```
✅ 全ての検証に合格しました
```

エラーが出た場合は修正してから再実行してください。

### Step 9: コミット・プッシュ
```bash
git add -A
git commit -m "📝 YYYY-MM-DD コラム: テーマ名"
git push -u origin main
```

## コラムHTML必須要件
- ライトテーマ（--bg-primary: #f8f7f4）
- hero背景はダークグラデーション（#1a1a2e → #16213e → #0f3460）
- フォント: Meiryo(本文優先), Yu Gothic UI, Noto Sans JP(フォールバック), Noto Serif JP(見出し), JetBrains Mono(データ)
- SVGフォント: Yu Gothic UI(優先), Meiryo(フォールバック)
- 導入文（この記事でわかること3点）→ 目次 → コンテンツセクション → PR → 免責
- 免責事項ボックス（赤枠border: 2px solid var(--accent-red)）
- FABボタン（🏠ホーム / ↑トップ）
- GA4タ��（G-KFT35KZZVC）とA8.netリンクマネージャーがheadにあることを確認
- 著者情報（author-box）が免責事項の直前に必須
- og:imageメタタグとJSON-LD author情報が必須
- SVG画像は `<div class="svg-scroll">` で囲んでモバイル横スクロール対応
- CSSに以下のSVGレスポンシブスタイルを含めること:
  `.svg-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:1rem 0} .svg-scroll img{min-width:500px;display:block;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.08)}`

## ビジュアル要件（最重要）
- **1スクロール内の文字量を最小限にする**
- **各セクション冒頭にアイキャッチ画像を必ず挿入**
- **概念説明にはSVG図解を作成して挿入**
- calloutボックス（金/赤/緑）で結論・注意・推奨を視覚的に区別
- バーチャート（CSSアニメーション付き）で数値比較を視覚化
- 数字カード（num-cards）で重要数値を大きく表示
- フロー図（flow-stepクラス）で手順・選択肢を表現
- テーブルはソート可能（sortTable関数）
- 目的別フィルター（purpose-btn）で該当項目をハイライト

## コラムテーマ例
1. FX口座比較ガイド
2. 証券口座の開設方法
3. ビットコインの仕組み
4. ゴールド投資入門
5. FX初心者ガイド
6. 株式投資の始め方（NISA・iDeCo）
7. コモディティ投資入門
8. テクニカル分析入門
9. 地政学リスクと投資
10. リスク管理の基本

## 重要な注意事項
- HTMLの一括Write禁止（タイムアウトの原因）
- 必ずEditで1セクションずつ差し替え
- すべて日本語で記述
- 出典・参考情報を明記
- 広告表記「PR」を明示
- 投資助言と誤解される表現を避ける
- **全ての時間は日本時間（JST）で表記する**（米国時間はJSTに換算）

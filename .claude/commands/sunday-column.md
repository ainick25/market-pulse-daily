CLAUDE.mdの「日曜コラム生成フロー」に従って、コラム記事を作成してください。

テーマ: $ARGUMENTS

## 手順（必ずこの順序で実行）

### Step 1: テーマに関する調査
WebSearchで最低10件を**並列**で検索し、最新の情報を収集。
具体的な数値（手数料、金利、価格等）を必ず取得する。

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
3-最後. **PRボックス + 免責事項**: そのまま維持（DMM FX / DMM CFDリンク）

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

### Step 7: index.htmlの更新
- 「📝 コラム・解説記事」セクションの先頭に新コラムカードを追加
- 最大5件まで（6件目以降は削除）

### Step 8: ビルド
```bash
node scripts/build-metadata.js
node scripts/build-sitemap.js
```
- posts.jsonにコラムのメタデータを手動追加（build-metadata.jsはYYYYMMDD-column.htmlを認識しないため）
- sitemap.xmlにもコラムURLを手動追加

### Step 9: コミット・プッシュ
```bash
git add -A
git commit -m "📝 YYYY-MM-DD コラム: テーマ名"
git push -u origin main
```

## コラムHTML必須要件
- ライトテーマ（--bg-primary: #f8f7f4）
- hero背景はダークグラデーション（#1a1a2e → #16213e → #0f3460）
- フォント: Noto Serif JP(見出し), Noto Sans JP(本文,fw400), JetBrains Mono(データ)
- 導入文（この記事でわかること3点）→ 目次 → コンテンツセクション → PR → 免責
- 免責事項ボックス（赤枠border: 2px solid var(--accent-red)）
- FABボタン（🏠ホーム / ↑トップ）
- GA4タグ（G-KFT35KZZVC）とA8.netリンクマネージャーがheadにあることを確認

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

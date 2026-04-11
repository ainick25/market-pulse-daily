#!/bin/bash
# ============================================================
# publish.sh — 記事公開のための統合ビルド＆検証スクリプト
# ============================================================
# このスクリプトは記事作成後に必ず実行してください。
# 以下を自動で実行し、1つでも失敗すればエラー終了します:
#   1. build-metadata.js (posts.json + archive.html <noscript> 再生成)
#   2. build-sitemap.js (sitemap.xml 再生成)
#   3. 整合性チェック (全記事がposts.json/archive.html/sitemap.xmlに含まれるか)
#   4. 旧テンプレート残留チェック (オプション: 引数で前日の価格を指定)
#
# 使い方:
#   ./scripts/publish.sh                     # ビルド＋検証
#   ./scripts/publish.sh 20260411            # 特定の新記事の検証も含む
# ============================================================

set -e  # エラー時に即座に停止
cd "$(dirname "$0")/.."

NEW_SLUG="$1"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  MARKETZ Publish Script — 全記事の整合性を保証します${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# ============================================================
# Step 1: ビルド実行
# ============================================================
echo -e "${YELLOW}▶ Step 1: メタデータ再生成${NC}"
node scripts/build-metadata.js
echo ""

echo -e "${YELLOW}▶ Step 2: サイトマップ再生成${NC}"
node scripts/build-sitemap.js
echo ""

# ============================================================
# Step 3: 整合性チェック
# ============================================================
echo -e "${YELLOW}▶ Step 3: 整合性チェック${NC}"

# 3-1. postsディレクトリの記事数
POSTS_COUNT=$(ls posts/*.html 2>/dev/null | wc -l | tr -d ' ')
echo "   📁 posts/ ディレクトリ:       ${POSTS_COUNT} 件"

# 3-2. posts.json の記事数
JSON_COUNT=$(grep -c '"slug"' data/posts.json)
echo "   📄 data/posts.json:           ${JSON_COUNT} 件"

# 3-3. posts.json のコラム数
COLUMN_COUNT=$(grep -c '"isColumn": true' data/posts.json)
echo "   📝 posts.json コラム:         ${COLUMN_COUNT} 件"

# 3-4. posts.json のニュース数
NEWS_COUNT=$((JSON_COUNT - COLUMN_COUNT))
echo "   📰 posts.json ニュース:       ${NEWS_COUNT} 件"

# 3-5. archive.html <noscript> の記事リンク数
NOSCRIPT_COUNT=$(awk '/<noscript>/,/<\/noscript>/' archive.html | grep -c 'posts/')
echo "   📚 archive.html <noscript>:   ${NOSCRIPT_COUNT} 件"

# 3-6. sitemap.xml の記事URL数
SITEMAP_POSTS=$(grep -c 'posts/' sitemap.xml)
echo "   🗺  sitemap.xml 記事URL:       ${SITEMAP_POSTS} 件"

# 3-7. sitemap.xml の全URL数
SITEMAP_TOTAL=$(grep -c '<loc>' sitemap.xml)
echo "   🗺  sitemap.xml 全URL:         ${SITEMAP_TOTAL} 件"

echo ""

# ============================================================
# Step 4: 整合性の最終判定
# ============================================================
ERRORS=0

if [ "$POSTS_COUNT" != "$JSON_COUNT" ]; then
  echo -e "${RED}❌ エラー: posts/ と posts.json の件数が一致しません (${POSTS_COUNT} vs ${JSON_COUNT})${NC}"
  ERRORS=$((ERRORS + 1))
fi

if [ "$POSTS_COUNT" != "$NOSCRIPT_COUNT" ]; then
  echo -e "${RED}❌ エラー: posts/ と archive.html <noscript> の件数が一致しません (${POSTS_COUNT} vs ${NOSCRIPT_COUNT})${NC}"
  ERRORS=$((ERRORS + 1))
fi

if [ "$POSTS_COUNT" != "$SITEMAP_POSTS" ]; then
  echo -e "${RED}❌ エラー: posts/ と sitemap.xml の記事URL数が一致しません (${POSTS_COUNT} vs ${SITEMAP_POSTS})${NC}"
  ERRORS=$((ERRORS + 1))
fi

if [ "$COLUMN_COUNT" -lt 1 ]; then
  echo -e "${RED}❌ エラー: posts.json にコラム記事が1件もありません${NC}"
  ERRORS=$((ERRORS + 1))
fi

# ============================================================
# Step 5: 新記事の存在確認（引数指定時のみ）
# ============================================================
if [ -n "$NEW_SLUG" ]; then
  echo -e "${YELLOW}▶ Step 4: 新記事 ${NEW_SLUG} の存在確認${NC}"

  if [ ! -f "posts/${NEW_SLUG}.html" ]; then
    echo -e "${RED}❌ エラー: posts/${NEW_SLUG}.html が存在しません${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}   ✓ posts/${NEW_SLUG}.html 存在${NC}"
  fi

  if ! grep -q "\"slug\": \"${NEW_SLUG}\"" data/posts.json; then
    echo -e "${RED}❌ エラー: data/posts.json に ${NEW_SLUG} が含まれていません${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}   ✓ data/posts.json に含まれる${NC}"
  fi

  if ! grep -q "posts/${NEW_SLUG}.html" archive.html; then
    echo -e "${RED}❌ エラー: archive.html <noscript> に ${NEW_SLUG} が含まれていません${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}   ✓ archive.html <noscript> に含まれる${NC}"
  fi

  if ! grep -q "posts/${NEW_SLUG}.html" sitemap.xml; then
    echo -e "${RED}❌ エラー: sitemap.xml に ${NEW_SLUG} が含まれていません${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}   ✓ sitemap.xml に含まれる${NC}"
  fi

  if ! grep -q "posts/${NEW_SLUG}.html" index.html; then
    echo -e "${YELLOW}   ⚠ 警告: index.html に ${NEW_SLUG} のカードが見つかりません${NC}"
    echo -e "${YELLOW}     (最新2件枠から外れた場合は正常)${NC}"
  else
    echo -e "${GREEN}   ✓ index.html に含まれる${NC}"
  fi

  echo ""
fi

# ============================================================
# 結果
# ============================================================
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ 全ての検証に合格しました${NC}"
  echo -e "${GREEN}   コミット・プッシュして問題ありません${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
  exit 0
else
  echo -e "${RED}❌ ${ERRORS} 件のエラーがあります${NC}"
  echo -e "${RED}   コミット前に修正してください${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
  exit 1
fi

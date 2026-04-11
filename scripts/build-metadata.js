const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'posts');
const outFile = path.join(__dirname, '..', 'data', 'posts.json');
const archiveFile = path.join(__dirname, '..', 'archive.html');

const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Match both daily news (20260411.html) and column posts (20260405-column.html, 20260406-iran-war.html, etc.)
const files = fs.readdirSync(postsDir)
  .filter(f => /^\d{8}(-[a-z0-9-]+)?\.html$/.test(f))
  .sort()
  .reverse();

const posts = files.map(file => {
  const slug = file.replace('.html', '');
  const dateStr = `${slug.slice(0, 4)}-${slug.slice(4, 6)}-${slug.slice(6, 8)}`;
  const [y, m, dd] = dateStr.split('-').map(Number);
  // UTC基準で曜日を計算（TZ依存を排除）
  const d = new Date(Date.UTC(y, m - 1, dd));
  const dayOfWeek = dayNames[d.getUTCDay()];
  const isColumn = slug.includes('-'); // e.g., 20260405-column, 20260406-iran-war

  const html = fs.readFileSync(path.join(postsDir, file), 'utf-8');

  // title: hero-subtitle or hero-sub の先頭部分を使用
  const subtitleMatch = html.match(/class="hero-sub(?:title)?"[^>]*>([\s\S]*?)<\//);
  let subtitle = subtitleMatch ? subtitleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  let title = subtitle;
  if (title.length > 80) {
    const dashIdx = title.indexOf('—');
    if (dashIdx > 10 && dashIdx < 80) title = title.slice(0, dashIdx).trim();
    else title = title.slice(0, 77) + '...';
  }
  if (!title) title = slug;

  // excerpt from hero-subtitle or hero-sub
  const excerptMatch = html.match(/class="hero-sub(?:title)?"[^>]*>([\s\S]*?)<\//);
  let excerpt = excerptMatch ? excerptMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  if (excerpt.length > 150) excerpt = excerpt.slice(0, 147) + '...';

  // tags from hero-tag
  const tagMatches = [...html.matchAll(/class="hero-tag[^"]*"[^>]*>([^<]+)</g)];
  const tags = tagMatches.map(m =>
    m[1].replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FEFF}]/gu, '').replace(/[🔴🛢💱🥇₿📈📉🔥⚡🏦💰🇯🇵🇺🇸🏗️]/gu, '').trim()
  ).filter(t => t.length > 0);

  // prices from price-label + price-value pairs (daily news only — columns don't have price strips)
  const prices = {};
  const priceBlocks = [...html.matchAll(/class="price-label"[^>]*>([^<]+)<[\s\S]*?class="price-value"[^>]*>([^<]+)</g)];
  priceBlocks.forEach(m => {
    const label = m[1].trim().toLowerCase();
    const value = m[2].replace(/[≈$¥,\s]/g, '').trim();
    if (label.includes('usd/jpy')) prices.usdjpy = value;
    else if (label.includes('aud/jpy')) prices.audjpy = value;
    else if (label.includes('gbp/jpy')) prices.gbpjpy = value;
    else if (label.includes('gold') || label.includes('xau')) prices.gold = value;
    else if (label.includes('brent')) prices.brent = value;
    else if (label.includes('wti')) prices.wti = value;
    else if (label.includes('btc')) prices.btc = value;
    else if (label.includes('s&p') || label.includes('sp500')) prices.sp500 = value;
    else if (label.includes('nasdaq')) prices.nasdaq = value;
    else if (label.includes('nikkei') || label.includes('日経')) prices.nikkei = value;
  });

  return { date: dateStr, slug, dayOfWeek, title, excerpt, tags, prices, isColumn };
});

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ posts }, null, 2), 'utf-8');
console.log(`✅ ${posts.length}件の記事メタデータを生成しました → data/posts.json`);

// ========================================
// archive.html の <noscript> フォールバックを自動生成
// Googlebot が JavaScript を実行しない場合でも全記事を発見できるように
// コラムとニュースを分離して表示
// ========================================
if (fs.existsSync(archiveFile)) {
  const archiveHtml = fs.readFileSync(archiveFile, 'utf-8');

  const newsPosts = posts.filter(p => !p.isColumn);
  const columnPosts = posts.filter(p => p.isColumn);

  const newsItems = newsPosts.map(p =>
    `    <li><a href="posts/${p.slug}.html">${p.date} — マーケットニュースダイジェスト</a></li>`
  ).join('\n');

  const columnItems = columnPosts.map(p =>
    `    <li><a href="posts/${p.slug}.html">${p.date} — 📝 ${p.title}</a></li>`
  ).join('\n');

  const newNoscript = `<noscript>
  <div style="max-width:900px;margin:0 auto;padding:2rem 1.5rem">
  <h2 style="font-size:1.2rem;margin-bottom:1rem">全記事一覧（全${posts.length}件）</h2>
  <h3 style="font-size:1rem;margin:1.5rem 0 0.5rem;color:#d4880f">📝 コラム・解説記事（${columnPosts.length}件）</h3>
  <ul style="list-style:none;padding:0;line-height:2.2">
${columnItems}
  </ul>
  <h3 style="font-size:1rem;margin:1.5rem 0 0.5rem;color:#3d3d56">📰 マーケットレポート（${newsPosts.length}件）</h3>
  <ul style="list-style:none;padding:0;line-height:2.2">
${newsItems}
  </ul>
  </div>
</noscript>`;

  const updatedArchive = archiveHtml.replace(
    /<noscript>[\s\S]*?<\/noscript>/,
    newNoscript
  );

  if (updatedArchive !== archiveHtml) {
    fs.writeFileSync(archiveFile, updatedArchive, 'utf-8');
    console.log(`✅ archive.html の <noscript> を更新しました（コラム${columnPosts.length}件 + ニュース${newsPosts.length}件）`);
  }
}

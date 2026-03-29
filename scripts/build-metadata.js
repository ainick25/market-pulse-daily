const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'posts');
const outFile = path.join(__dirname, '..', 'data', 'posts.json');

const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const files = fs.readdirSync(postsDir)
  .filter(f => /^\d{8}\.html$/.test(f))
  .sort()
  .reverse();

const posts = files.map(file => {
  const slug = file.replace('.html', '');
  const dateStr = `${slug.slice(0,4)}-${slug.slice(4,6)}-${slug.slice(6,8)}`;
  const d = new Date(dateStr + 'T00:00:00+09:00');
  const dayOfWeek = dayNames[d.getDay()];

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

  // prices from price-label + price-value pairs
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

  return { date: dateStr, slug, dayOfWeek, title, excerpt, tags, prices };
});

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ posts }, null, 2), 'utf-8');
console.log(`✅ ${posts.length}件の記事メタデータを生成しました → data/posts.json`);

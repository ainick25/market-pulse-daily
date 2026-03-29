const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://ainick25.github.io/market-pulse-daily';
const postsDir = path.join(__dirname, '..', 'posts');
const outFile = path.join(__dirname, '..', 'sitemap.xml');

// Static pages
const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/archive.html', priority: '0.7', changefreq: 'daily' },
  { loc: '/tags.html', priority: '0.6', changefreq: 'weekly' },
  { loc: '/about.html', priority: '0.4', changefreq: 'monthly' },
  { loc: '/disclaimer.html', priority: '0.3', changefreq: 'monthly' },
  { loc: '/privacy.html', priority: '0.3', changefreq: 'monthly' },
];

// Post pages
const postFiles = fs.readdirSync(postsDir)
  .filter(f => /^\d{8}\.html$/.test(f))
  .sort()
  .reverse();

const today = new Date().toISOString().slice(0, 10);

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Static pages
staticPages.forEach(p => {
  xml += `  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
});

// Post pages
postFiles.forEach(file => {
  const slug = file.replace('.html', '');
  const dateStr = `${slug.slice(0,4)}-${slug.slice(4,6)}-${slug.slice(6,8)}`;
  xml += `  <url>
    <loc>${BASE_URL}/posts/${file}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.8</priority>
  </url>
`;
});

xml += `</urlset>
`;

fs.writeFileSync(outFile, xml, 'utf-8');
console.log(`✅ sitemap.xml を生成しました（${staticPages.length + postFiles.length} URL）`);

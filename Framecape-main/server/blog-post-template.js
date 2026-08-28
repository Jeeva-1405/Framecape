/**
 * blog-post-template.js
 * Renders a full single blog post page for /blog/:slug
 * Shares the same design language as blog-views.js
 */

const navHtml = `
  <nav class="nav3-bar">
    <div class="nav3-inner">
      <a href="/" class="nav3-logo" style="text-decoration:none; color:var(--ink);">FRAME<span>CAPE</span></a>
      <div class="nav3-keys">
        <a href="/#services" class="nav3-key">SERVICES</a>
        <a href="/#work" class="nav3-key">WORK</a>
        <a href="/#pricing" class="nav3-key">PRICING</a>
        <a href="/careers" class="nav3-key">CAREERS</a>
        <a href="/internships" class="nav3-key">INTERNSHIPS</a>
        <a href="/blog" class="nav3-key active">BLOG</a>
        <a href="/#contact" class="nav3-key cta">CONTACT ↵</a>
      </div>
    </div>
  </nav>
`;

const postStyles = `
<style>
  :root {
    --paper: #F8F6F1;
    --ink: #17140F;
    --steel: #6B6660;
    --fog: #A39E96;
    --line: rgba(23, 20, 15, 0.12);
    --red: #E8362A;
    --white: #FFFFFF;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--paper);
    color: var(--ink);
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Article layout ── */
  .article-outer {
    max-width: 720px;
    margin: 0 auto;
    padding: 120px 24px 80px;
  }

  /* Breadcrumb */
  .article-crumb {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--fog);
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .article-crumb a { color: var(--fog); text-decoration: none; }
  .article-crumb a:hover { color: var(--ink); }
  .article-crumb span { color: var(--red); }

  /* Hero */
  .article-cover {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 40px;
    display: block;
  }
  .article-cover-wrap {
    margin-bottom: 40px;
  }
  .article-cover-wrap picture, .article-cover-wrap img {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 4px;
    display: block;
  }

  /* Title block */
  .article-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--red);
    margin-bottom: 16px;
  }
  .article-title {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: clamp(30px, 5vw, 46px);
    line-height: 1.1;
    letter-spacing: -0.01em;
    margin-bottom: 20px;
  }
  .article-title em { color: var(--red); font-style: italic; font-weight: 600; }

  .article-meta {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: var(--fog);
    padding-bottom: 28px;
    border-bottom: 1px solid var(--line);
    margin-bottom: 40px;
  }
  .article-meta .author { color: var(--ink); font-weight: 500; }

  /* Body typography */
  .article-body { font-size: 17px; line-height: 1.75; color: var(--ink); }
  .article-body p { margin-bottom: 24px; }
  .article-body h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(22px, 3vw, 28px);
    font-weight: 700;
    margin: 52px 0 18px;
    line-height: 1.2;
  }
  .article-body h3 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(18px, 2.5vw, 22px);
    font-weight: 600;
    margin: 36px 0 14px;
    line-height: 1.3;
  }
  .article-body ul, .article-body ol {
    margin: 0 0 24px 22px;
  }
  .article-body li { margin-bottom: 10px; line-height: 1.65; }
  .article-body blockquote {
    border-left: 3px solid var(--red);
    padding: 2px 0 2px 24px;
    margin: 36px 0;
    color: var(--steel);
    font-style: italic;
    font-size: 18px;
    line-height: 1.6;
  }
  .article-body strong { font-weight: 700; color: var(--ink); }
  .article-body em { font-style: italic; color: var(--steel); }
  .article-body a { color: var(--red); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.15s; }
  .article-body a:hover { border-bottom-color: var(--red); }

  /* Inline CTA callout */
  .inline-cta {
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 28px 28px 28px 24px;
    margin: 48px 0;
    background: var(--white);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .inline-cta-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--red);
  }
  .inline-cta h4 {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.3;
  }
  .inline-cta p { font-size: 14px; color: var(--steel); margin: 0; }
  .inline-cta a.cta-btn {
    display: inline-block;
    margin-top: 4px;
    font-size: 13px;
    font-weight: 500;
    color: var(--white);
    background: var(--ink);
    border-radius: 6px;
    padding: 10px 20px;
    text-decoration: none;
    width: fit-content;
    transition: background 0.15s;
  }
  .inline-cta a.cta-btn:hover { background: var(--red); border-bottom: none; }

  /* Footer strip */
  .article-footer {
    margin-top: 72px;
    padding-top: 40px;
    border-top: 1px solid var(--line);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }
  .byline { font-size: 13.5px; color: var(--steel); }
  .byline a { color: var(--ink); font-weight: 600; text-decoration: none; }
  .byline a:hover { color: var(--red); }
  .back-btn {
    font-size: 13px;
    font-weight: 500;
    color: var(--ink);
    text-decoration: none;
    border: 1.5px solid var(--ink);
    border-radius: 6px;
    padding: 9px 18px;
    transition: all 0.15s;
  }
  .back-btn:hover { background: var(--ink); color: var(--white); }

  /* More posts strip */
  .more-strip {
    max-width: 720px;
    margin: 0 auto 80px;
    padding: 0 24px;
  }
  .more-strip h3 {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .more-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .more-card {
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 20px;
    text-decoration: none;
    color: var(--ink);
    transition: border-color 0.15s;
  }
  .more-card:hover { border-color: var(--ink); }
  .more-card-date { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--fog); margin-bottom: 8px; }
  .more-card h4 { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 600; line-height: 1.3; }

  @media (max-width: 640px) {
    .article-outer { padding: 100px 20px 60px; }
    .more-grid { grid-template-columns: 1fr; }
  }
</style>
`;

function formatDate(isoStr) {
  const date = new Date(isoStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Generates 1-2 contextual inline CTAs based on post content keywords.
 * Inserts them after approximately the 3rd paragraph.
 */
function injectInlineCTAs(content, post) {
  const isDPDP = /dpdp|compliance|data protection|personal data/i.test(content + post.title);
  const isPricing = /cost|price|pricing|₹|budget|afford/i.test(content + post.title);

  let cta = '';
  if (isDPDP) {
    cta = `
<div class="inline-cta">
  <span class="inline-cta-label">Framecape Service</span>
  <h4>DPDP compliance built into your product from day one.</h4>
  <p>We handle consent flows, data mapping, and policy drafting — so you're not scrambling after a legal notice.</p>
  <a href="/#services" class="cta-btn">See our DPDP service →</a>
</div>`;
  } else if (isPricing) {
    cta = `
<div class="inline-cta">
  <span class="inline-cta-label">Framecape Pricing</span>
  <h4>Transparent, itemized pricing — no surprise line items.</h4>
  <p>See exactly what's built at each tier before you commit. Starting from ₹1,999 for a hand-coded static site.</p>
  <a href="/#pricing" class="cta-btn">View our pricing →</a>
</div>`;
  } else {
    cta = `
<div class="inline-cta">
  <span class="inline-cta-label">Framecape</span>
  <h4>A website that actually works for your business.</h4>
  <p>Hand-coded, fast, and SEO-ready. No templates, no page builders — just clean code shipped by people who care.</p>
  <a href="/#services" class="cta-btn">See what we build →</a>
</div>`;
  }

  // Inject after 3rd closing </p> tag
  let count = 0;
  return content.replace(/<\/p>/g, (match) => {
    count++;
    if (count === 3) return match + cta;
    return match;
  });
}

function renderBlogPost(post, allPosts) {
  const contentWithCTA = injectInlineCTAs(post.content || '<p>Full article coming soon.</p>', post);
  const otherPosts = allPosts.filter(p => p.slug !== post.slug).slice(0, 2);

  const moreCardsHtml = otherPosts.map(p => `
    <a href="/blog/${p.slug}" class="more-card">
      <div class="more-card-date">${formatDate(p.date)}</div>
      <h4>${p.title}</h4>
    </a>
  `).join('');

  const canonicalUrl = `https://framecape.com/blog/${post.slug}`;
  const ogImage = post.image || 'https://framecape.com/ironclad.png';

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://framecape.com/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://framecape.com/blog" },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl }
        ]
      },
      {
        "@type": "Article",
        "headline": post.title,
        "description": post.description,
        "image": ogImage,
        "datePublished": post.date,
        "dateModified": post.updatedAt || post.date,
        "url": canonicalUrl,
        "author": {
          "@type": "Person",
          "name": "Jeeva Elango",
          "url": "https://framecape.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Framecape",
          "url": "https://framecape.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://framecape.com/Favicon.jpg"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        }
      }
    ]
  };

  // Truncate description to 160 chars for meta
  const metaDesc = post.description.length > 160
    ? post.description.slice(0, 157) + '...'
    : post.description;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${post.title} | Framecape Blog</title>
<meta name="description" content="${metaDesc}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="canonical" href="${canonicalUrl}">

<meta property="og:type" content="article">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:title" content="${post.title} | Framecape Blog">
<meta property="og:description" content="${metaDesc}">
<meta property="og:image" content="${ogImage}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="${canonicalUrl}">
<meta name="twitter:title" content="${post.title} | Framecape Blog">
<meta name="twitter:description" content="${metaDesc}">
<meta name="twitter:image" content="${ogImage}">

<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.jpg" type="image/jpeg">
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">

<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
<\/script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://fonts.cdnfonts.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
${postStyles}
</head>
<body>
${navHtml}

<main>
  <div class="article-outer">

    <nav class="article-crumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span>/</span>
      <a href="/blog">Blog</a>
      <span>/</span>
      <span style="color:var(--ink)">${post.title}</span>
    </nav>

    ${post.image ? `
    <div class="article-cover-wrap">
      <picture>
        <img src="${post.image}" alt="Cover image for: ${post.title}" loading="eager">
      </picture>
    </div>` : ''}

    <div class="article-eyebrow">Blog</div>
    <h1 class="article-title">${post.title}</h1>

    <div class="article-meta">
      <span class="author">By <a href="/">Jeeva Elango, Framecape</a></span>
      <span>${formatDate(post.date)}</span>
      <span>${post.readTime || estimateReadTime(post.content)} min read</span>
    </div>

    <article class="article-body">
      ${contentWithCTA}
    </article>

    <footer class="article-footer">
      <p class="byline">Written by <a href="/">Framecape</a> — a two-person hand-coded web studio in Salem, Tamil Nadu. We build websites that build businesses.</p>
      <a href="/blog" class="back-btn">← All articles</a>
    </footer>

  </div>

  ${otherPosts.length > 0 ? `
  <div class="more-strip">
    <h3>More from the blog</h3>
    <div class="more-grid">
      ${moreCardsHtml}
    </div>
  </div>` : ''}
</main>

<script src="/nav.js"></script>
</body>
</html>`;
}

function estimateReadTime(content) {
  if (!content) return 5;
  const wordCount = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(wordCount / 200));
}

module.exports = { renderBlogPost, slugify };

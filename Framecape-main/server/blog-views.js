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
        <a href="/blog" class="nav3-key">BLOG</a>
        <a href="/#contact" class="nav3-key cta">CONTACT ↵</a>
      </div>
    </div>
  </nav>
`;

const styles = `
<style>
  :root{
    --paper:#F8F6F1;
    --ink:#17140F;
    --steel:#6B6660;
    --fog:#A39E96;
    --line:rgba(23,20,15,0.12);
    --red:#E8362A;
    --white:#FFFFFF;
  }
  *{box-sizing:border-box; margin:0; padding:0;}
  body{
    background:var(--paper);
    color:var(--ink);
    font-family:'Inter', sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .nav-bar{
    display:flex; align-items:center; justify-content:space-between;
    padding:24px 8vw;
    border-bottom:1px solid var(--line);
  }
  .nav-logo{ font-family:'Playfair Display', serif; font-weight:700; font-size:19px; text-decoration:none; color:var(--ink); }
  .nav-logo span{ color:var(--red); }
  .nav-keys{ display:flex; gap:10px; }
  .nav-key{
    font-family:'JetBrains Mono', monospace;
    font-size:11px; text-transform:uppercase; letter-spacing:0.02em;
    color:var(--ink); text-decoration:none;
    background:var(--white); border:1.5px solid var(--ink); border-radius:20px;
    padding:9px 15px;
  }
  .nav-key.active{ background:var(--ink); color:var(--white); }
  .nav-key.cta{ background:var(--ink); color:var(--white); border-radius:6px; }

  .wrap{ padding:150px 8vw 110px; }
  .eyebrow{
    font-family:'JetBrains Mono', monospace;
    font-size:12px; letter-spacing:0.14em; text-transform:uppercase;
    color:var(--red); margin-bottom:16px;
  }
  .head h1{
    font-family:'Playfair Display', serif;
    font-weight:700;
    font-size:clamp(36px, 5.6vw, 60px);
    line-height:1.05;
    max-width:16ch;
  }
  .head h1 em{ color:var(--red); font-style:italic; font-weight:600; }
  .head p{
    margin-top:18px;
    color:var(--steel);
    font-size:15.5px;
    line-height:1.65;
    max-width:52ch;
  }

  .post-meta{ display:flex; justify-content:space-between; align-items:center; font-family:'JetBrains Mono', monospace; font-size:11.5px; color:var(--fog); margin-top: auto; }
  .read-btn { font-family:'Inter', sans-serif; font-size:12.5px; font-weight:500; color:var(--ink); border: 1.5px solid var(--ink); padding:6px 14px; border-radius:20px; transition:all 0.2s ease; }
  .card:hover .read-btn { background:var(--ink); color:var(--white); }

  .grid{
    margin-top:50px;
    display:grid;
    grid-template-columns:repeat(3, 1fr);
    gap:20px;
    align-items:stretch;
  }
  .card{
    background:var(--white);
    border:1px solid var(--line);
    border-radius:10px;
    overflow:hidden;
    text-decoration:none;
    color:inherit;
    display:flex;
    flex-direction:column;
    height:100%;
  }
  .card-thumb{
    aspect-ratio:16/10;
    width:100%;
    background:#EDEBE5;
    display:flex; align-items:center; justify-content:center;
    border-bottom:1px solid var(--line);
    overflow:hidden;
    flex-shrink:0;
  }
  .card-thumb img{
    width:100%; height:100%; object-fit:cover; display:block;
  }
  .card-body{ padding:22px 22px 24px; flex:1; display:flex; flex-direction:column; }
  .card-body h3{
    font-family:'Playfair Display', serif;
    font-weight:700;
    font-size:18px;
    line-height:1.3;
    margin-bottom:10px;
  }
  .card-body p{ color:var(--steel); font-size:13px; line-height:1.55; margin-bottom:16px; flex:1; }

  .strip{
    margin-top:64px;
    border-top:1px solid var(--line);
    padding-top:44px;
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:20px;
  }
  .strip h2{
    font-family:'Playfair Display', serif;
    font-weight:700;
    font-size:clamp(22px, 2.8vw, 28px);
  }
  .strip a{
    text-decoration:none;
    font-size:13.5px; font-weight:500;
    color:var(--white); background:var(--ink);
    border-radius:7px; padding:12px 22px;
    flex-shrink:0;
  }

  .article-wrap { max-width: 720px; margin: 0 auto; padding-top: 60px; }
  .article-title { font-family: \'Playfair Display\', serif; font-size: clamp(32px, 5vw, 48px); font-weight: 700; line-height: 1.15; margin-bottom: 20px; }
  .article-meta { font-family: \'JetBrains Mono\', monospace; font-size: 13px; color: var(--fog); margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid var(--line); }
  .article-content { font-size: 17px; line-height: 1.7; color: var(--ink); }
  .article-content p { margin-bottom: 20px; }
  .article-content h2 { font-family: \'Playfair Display\', serif; font-size: 28px; margin: 40px 0 20px; }
  .article-content h3 { font-family: \'Playfair Display\', serif; font-size: 22px; margin: 30px 0 15px; }
  .article-content ul, .article-content ol { margin-bottom: 20px; padding-left: 20px; }
  .article-content li { margin-bottom: 10px; }
  .article-content blockquote { border-left: 3px solid var(--red); padding-left: 20px; margin: 30px 0; font-style: italic; color: var(--steel); }
  .article-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 30px 0; }
  
  .more-section { max-width: 720px; margin: 60px auto 0; padding-top: 40px; border-top: 1px solid var(--line); }
  .more-section h3 { font-family: \'Playfair Display\', serif; font-size: 24px; margin-bottom: 24px; }

  @media (max-width:980px){ .grid{ grid-template-columns:1fr 1fr; } }
  @media (max-width:640px){ .grid{ grid-template-columns:1fr; } .nav-keys{ display:none; } }
</style>
`;

function formatDate(isoStr) {
  const date = new Date(isoStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderBlogList(featured, posts) {
  // Merge featured + rest into a single unified list so all cards are identical
  const allPosts = featured ? [featured, ...posts] : posts;

  const postsHtml = allPosts.map(p => {
    const href = p.slug ? `/blog/${p.slug}` : p.link;
    const isExternal = !p.slug;
    return `
    <a href="${href}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''} class="card">
      <div class="card-thumb">${p.image ? `<img src="${p.image}" alt="Cover image for blog post: ${p.title}" loading="lazy">` : ''}</div>
      <div class="card-body">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="post-meta">
          <span>${formatDate(p.date)}</span>
          <span class="read-btn">Read article →</span>
        </div>
      </div>
    </a>
  `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Web Development Blog | Framecape — Salem, Tamil Nadu</title>
<meta name="description" content="The Framecape blog — DPDP compliance, hand-coded web development, UI/UX, and digital strategy from a studio in Salem, Tamil Nadu that actually builds things.">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="canonical" href="https://framecape.com/blog">

<meta property="og:type" content="website">
<meta property="og:url" content="https://framecape.com/blog">
<meta property="og:title" content="Web Development Blog | Framecape — Salem, Tamil Nadu">
<meta property="og:description" content="Notes on the build — DPDP compliance, hand-coded web development, and what we're learning from real client work.">
<meta property="og:image" content="https://framecape.com/ironclad.png">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://framecape.com/blog">
<meta name="twitter:title" content="Web Development Blog | Framecape — Salem, Tamil Nadu">
<meta name="twitter:description" content="Notes on the build — DPDP compliance, hand-coded web development, and what we're learning from real client work.">
<meta name="twitter:image" content="https://framecape.com/ironclad.png">

<link rel="icon" href="/Favicon.jpg" type="image/jpeg">

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://framecape.com/"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://framecape.com/blog"}]}
<\/script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://fonts.cdnfonts.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
${styles}
</head>
<body>
${navHtml}
<div class="wrap">
  <div class="head">
    <div class="eyebrow">Blog</div>
    <h1>Notes on <em>the build.</em></h1>
    <p>DPDP compliance, hand coded web development, and what we're learning from real client work written by the people actually doing it.</p>
  </div>
  <div class="grid">
    ${postsHtml}
  </div>
  <div class="strip">
    <h2>Want DPDP news as we publish it?</h2>
    <a href="https://framecape.com/#contact">Get in touch →</a>
  </div>
</div>
  <script src="/nav.js"></script>
</body>
</html>`;
}

module.exports = { renderBlogList };

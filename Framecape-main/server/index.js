require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { renderBlogList } = require("./blog-views");
const startKeepAlive = require("./utils/keepAlive");

const app = express();
const PORT = process.env.PORT || 4000;
const API_KEY = process.env.FRAMECAPE_API_KEY || "REPLACE_WITH_YOUR_OWN_SECRET";
const DB_FILE = path.join(__dirname, "interns.json");
const BLOG_DB_FILE = path.join(__dirname, "blogs.json");
const CERT_DIR = path.join(__dirname, "uploads", "certificates");

fs.mkdirSync(CERT_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "[]");
if (!fs.existsSync(BLOG_DB_FILE)) fs.writeFileSync(BLOG_DB_FILE, "[]");

app.use(cors());
app.use(express.json());
app.use("/certificates", express.static(CERT_DIR)); // public PDF viewing
app.use(express.static(path.join(__dirname, "../docs"), { extensions: ['html'] })); // Serve frontend at root

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
});

// ---------- helpers ----------
function readInterns() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}
function writeInterns(list) {
  fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2));
}
function readBlogs() {
  return JSON.parse(fs.readFileSync(BLOG_DB_FILE, "utf-8"));
}
function writeBlogs(list) {
  fs.writeFileSync(BLOG_DB_FILE, JSON.stringify(list, null, 2));
}

// only Jeeva, via Postman with the API key, can create/delete entries
function requireApiKey(req, res, next) {
  const key = req.header("x-api-key");
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: "Invalid or missing x-api-key header." });
  }
  next();
}

// certificate PDF upload — stored under a random filename so URLs can't be guessed
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, CERT_DIR),
  filename: (req, file, cb) => {
    const id = crypto.randomBytes(8).toString("hex");
    cb(null, `${id}${path.extname(file.originalname) || ".pdf"}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are accepted for certificates."));
    }
    cb(null, true);
  },
});

// ---------- public routes ----------

// GET /api/interns  — full list, or filtered with ?q=name-or-certid
app.get("/api/interns", (req, res) => {
  const list = readInterns();
  const q = (req.query.q || "").trim().toLowerCase();
  if (!q) return res.json(list);
  const filtered = list.filter(
    (i) => i.name.toLowerCase().includes(q) || i.certId.toLowerCase().includes(q)
  );
  res.json(filtered);
});

// GET /api/interns/:certId — single-record verification lookup
app.get("/api/interns/:certId", (req, res) => {
  const list = readInterns();
  const record = list.find(
    (i) => i.certId.toLowerCase() === req.params.certId.toLowerCase()
  );
  if (!record) return res.status(404).json({ error: "No certificate found with that ID." });
  res.json(record);
});


// ---------- public blog HTML routes ----------

app.get("/blog", (req, res) => {
  const blogs = readBlogs().sort((a, b) => new Date(b.date) - new Date(a.date));
  const page = parseInt(req.query.page) || 1;
  const limit = 9;
  
  const featured = blogs.length > 0 ? blogs[0] : null;
  const remaining = blogs.length > 1 ? blogs.slice(1) : [];
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginated = remaining.slice(startIndex, endIndex);
  
  const html = renderBlogList(featured, paginated);
  res.send(html);
});

app.get("/sitemap-blog.xml", (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/blog</loc>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n`;
  xml += `</urlset>`;
  res.set('Content-Type', 'text/xml');
  res.send(xml);
});


// ---------- JSON API (public) ----------

app.get("/api/blog", (req, res) => {
  const list = readBlogs().sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(list);
});


// ---------- protected routes (Postman + x-api-key) ----------

app.post("/api/interns", requireApiKey, upload.single("certificate"), (req, res) => {
  const { name, certId, duration, project } = req.body;

  if (!name || !certId || !duration) {
    return res.status(400).json({ error: "name, certId, and duration are required." });
  }

  const list = readInterns();
  const exists = list.some((i) => i.certId.toLowerCase() === certId.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: `Certificate ID "${certId}" is already in use.` });
  }

  const record = {
    certId,
    name,
    duration,
    description: project || "",
    certificateUrl: req.file ? `/certificates/${req.file.filename}` : null,
    addedAt: new Date().toISOString(),
  };

  list.unshift(record); // newest first
  writeInterns(list);
  res.status(201).json(record);
});

app.put("/api/interns/:certId", requireApiKey, upload.single("certificate"), (req, res) => {
  const list = readInterns();
  const idx = list.findIndex(
    (i) => i.certId.toLowerCase() === req.params.certId.toLowerCase()
  );
  if (idx === -1) return res.status(404).json({ error: "No certificate found with that ID." });

  const { name, duration, project } = req.body;
  const record = list[idx];

  if (name) record.name = name;
  if (duration) record.duration = duration;
  if (project !== undefined) record.description = project;

  // if a new PDF was uploaded, replace the old file and delete the old one
  if (req.file) {
    if (record.certificateUrl) {
      const oldPath = path.join(CERT_DIR, path.basename(record.certificateUrl));
      fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
    }
    record.certificateUrl = `/certificates/${req.file.filename}`;
  }

  record.updatedAt = new Date().toISOString();
  list[idx] = record;
  writeInterns(list);
  res.json(record);
});

app.delete("/api/interns/:certId", requireApiKey, (req, res) => {
  const list = readInterns();
  const idx = list.findIndex(
    (i) => i.certId.toLowerCase() === req.params.certId.toLowerCase()
  );
  if (idx === -1) return res.status(404).json({ error: "Not found." });
  const [removed] = list.splice(idx, 1);
  if (removed.certificateUrl) {
    const filePath = path.join(CERT_DIR, path.basename(removed.certificateUrl));
    fs.existsSync(filePath) && fs.unlinkSync(filePath);
  }
  writeInterns(list);
  res.json({ removed });
});

app.post("/api/blog", requireApiKey, (req, res) => {
  const { title, description, date, link, image } = req.body;
  
  if (!title || !description || !date || !link) {
    return res.status(400).json({ error: "title, description, date, and link are required." });
  }

  const list = readBlogs();
  
  const post = {
    id: crypto.randomBytes(8).toString("hex"),
    title,
    description,
    date,
    link,
    image: image || null   // optional: full URL to a cover image
  };

  list.unshift(post);
  writeBlogs(list);
  res.status(201).json(post);
});

app.put("/api/blog/:id", requireApiKey, (req, res) => {
  const list = readBlogs();
  const idx = list.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Blog post not found." });

  let { title, description, date, link, image } = req.body;
  const post = list[idx];

  if (title !== undefined) post.title = title;
  if (description !== undefined) post.description = description;
  if (date !== undefined) post.date = date;
  if (link !== undefined) post.link = link;
  if (image !== undefined) post.image = image;  // pass null to remove, or a URL to set

  list[idx] = post;
  writeBlogs(list);
  res.json(post);
});

app.delete("/api/blog/:id", requireApiKey, (req, res) => {
  const list = readBlogs();
  const idx = list.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Blog post not found." });
  
  const [removed] = list.splice(idx, 1);
  writeBlogs(list);
  res.json({ removed });
});

app.listen(PORT, () => {
  console.log(`Framecape API running on http://localhost:${PORT}`);
  if (API_KEY === "REPLACE_WITH_YOUR_OWN_SECRET") {
    console.log(`⚠️  WARNING: Using the default API key. Set FRAMECAPE_API_KEY in .env and restart.`);
  } else {
    console.log(`✅ API key loaded from .env.`);
  }
  startKeepAlive();
});

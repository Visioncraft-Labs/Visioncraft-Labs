// netlify/functions/server.js
// Express + serverless-http for Netlify Functions
// Your netlify.toml redirects /api/* -> /.netlify/functions/server/:splat
// So we mount routes under "/.netlify/functions/server" and keep clean app paths like "/contact".

const express = require('express');
const serverless = require('serverless-http');
const multer = require('multer');
const nodemailer = require('nodemailer'); // only used if SMTP env vars are present

const app = express();
const router = express.Router();

// ---------- Middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (safe for same-origin too)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // tighten if needed
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ---------- In-memory stores (ephemeral on Netlify) ----------
let contactSubmissions = [];
let imageUploads = [];
let currentContactId = 1;
let currentImageUploadId = 1;

// ---------- Multer (memory) ----------
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype);
    cb(ok ? null : new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), ok);
  },
});

// ---------- Helpers ----------
function escapeHtml(str = '') {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[m]));
}

async function sendEmail({ name, email, phone, message }) {
  const {
    RESEND_API_KEY,
    FROM_EMAIL = 'no-reply@visioncraftlabs.com',
    TO_EMAIL,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  const subject = `New contact form message from ${name}`;
  const html = `
    <h2>Contact Form</h2>
    <p><b>Name:</b> ${escapeHtml(name)}</p>
    <p><b>Email:</b> ${escapeHtml(email)}</p>
    ${phone ? `<p><b>Phone:</b> ${escapeHtml(phone)}</p>` : ''}
    <p><b>Message:</b></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
  `;

  // Prefer Resend if available (simple and reliable on Netlify)
  if (RESEND_API_KEY && TO_EMAIL) {
    // Node 18 has global fetch
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject,
        html,
        reply_to: email, // handy for quick replies
      }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`Resend failed (${resp.status}): ${text}`);
    }
    return;
  }

  // Fallback: SMTP/Nodemailer (requires full SMTP env)
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && TO_EMAIL && FROM_EMAIL) {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject,
      html,
      text: `Name: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ''}\n\n${message}`,
      replyTo: email,
    });
    return;
  }

  throw new Error('No email provider configured: set RESEND_API_KEY + TO_EMAIL (and FROM_EMAIL), or SMTP_* env vars.');
}

// Convenience JSON responder
function ok(res, data) {
  return res.status(200).json(data);
}
function bad(res, msg, code = 400) {
  return res.status(code).json({ success: false, message: msg });
}

// ---------- Routes (mounted under "/.netlify/functions/server") ----------

// POST /.netlify/functions/server/contact
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};
    if (!name || !email || !message) {
      return bad(res, 'All fields are required (name, email, message).', 422);
    }

    // Persist to ephemeral memory (for your /contact-submissions list)
    const submission = {
      id: currentContactId++,
      name,
      email,
      phone: phone || null,
      message,
      createdAt: new Date().toISOString(),
    };
    contactSubmissions.push(submission);

    // Send the actual email
    await sendEmail({ name, email, phone, message });

    return ok(res, { success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact error:', error);
    return bad(res, error.message || 'Failed to submit contact form', 500);
  }
});

// GET /.netlify/functions/server/contact-submissions
router.get('/contact-submissions', async (req, res) => {
  try {
    const list = [...contactSubmissions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return ok(res, list);
  } catch (error) {
    console.error(error);
    return bad(res, 'Failed to fetch contact submissions', 500);
  }
});

// POST /.netlify/functions/server/upload-image
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return bad(res, 'No image file provided', 422);

    const { clientName, clientEmail, clientPhone } = req.body || {};
    const record = {
      id: currentImageUploadId++,
      fileName: `upload_${Date.now()}_${req.file.originalname}`,
      originalName: req.file.originalname,
      fileSize: String(req.file.size),
      mimeType: req.file.mimetype,
      uploadPath: `/tmp/${Date.now()}_${req.file.originalname}`, // placeholder only
      clientName: clientName || null,
      clientEmail: clientEmail || null,
      clientPhone: clientPhone || null,
      status: 'uploaded',
      createdAt: new Date().toISOString(),
    };

    imageUploads.push(record);

    return ok(res, {
      success: true,
      upload: {
        id: record.id,
        originalName: record.originalName,
        status: record.status,
        uploadedAt: record.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    return bad(res, error.message || 'Upload failed', 500);
  }
});

// GET /.netlify/functions/server/uploads
router.get('/uploads', async (req, res) => {
  try {
    const uploads = [...imageUploads]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((u) => ({
        id: u.id,
        fileName: u.fileName,
        originalName: u.originalName,
        fileSize: u.fileSize,
        mimeType: u.mimeType,
        clientName: u.clientName,
        clientEmail: u.clientEmail,
        clientPhone: u.clientPhone,
        status: u.status,
        createdAt: u.createdAt,
      }));
    return ok(res, uploads);
  } catch (error) {
    console.error(error);
    return bad(res, 'Failed to fetch uploads', 500);
  }
});

// Health check
router.get('/', (req, res) => ok(res, { ok: true, message: 'Server function is up' }));

// Mount router at the Netlify function path prefix
app.use('/.netlify/functions/server', router);

// Error handler (last)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  return bad(res, 'Something went wrong!', 500);
});

// Export the Netlify handler
module.exports.handler = serverless(app);

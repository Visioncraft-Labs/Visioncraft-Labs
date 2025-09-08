// netlify/functions/server.js
// ESM + serverless-http for Netlify Functions
// Works at /.netlify/functions/server/* and /api/* (via redirect) and bare /* (dev)

import express from "express";
import serverless from "serverless-http";
import multer from "multer";
import sgMail from "@sendgrid/mail"; // <-- SendGrid

const app = express();

// ---------- Middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ---------- In-memory (ephemeral on Netlify) ----------
let contactSubmissions = [];
let imageUploads = [];
let currentContactId = 1;
let currentImageUploadId = 1;

// ---------- Multer (memory) ----------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"].includes(file.mimetype);
    if (ok) return cb(null, true);
    return cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."));
  },
});

// ---------- Helpers ----------
function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}
const ok = (res, data, code = 200) => res.status(code).json(data);
const bad = (res, msg, code = 400) => res.status(code).json({ success: false, message: msg });

// ---- Resend ----
async function sendViaResend({ from, to, subject, html, replyTo }) {
  const { RESEND_API_KEY } = process.env;
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html, reply_to: replyTo }),
  });
  const text = await resp.text().catch(() => "");
  if (!resp.ok) throw new Error(`Resend (${resp.status}) ${text}`);
  return text;
}

// ---- SendGrid ----
async function sendViaSendgrid({ from, to, subject, html, replyTo }) {
  const { SENDGRID_API_KEY } = process.env;
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not set");
  sgMail.setApiKey(SENDGRID_API_KEY);

  // NOTE: "from" must be a verified sender or from a verified domain in SendGrid.
  const msg = { to, from, subject, html, replyTo };
  try {
    const [resp] = await sgMail.send(msg);
    if (resp?.statusCode && resp.statusCode >= 400) {
      throw new Error(`SendGrid (${resp.statusCode})`);
    }
  } catch (e) {
    // SDK throws with a detailed response body on 4xx/5xx
    const detail = e?.response?.body ? JSON.stringify(e.response.body) : String(e);
    throw new Error(`SendGrid error: ${detail}`);
  }
}

// Unified email function: prefers Resend, else SendGrid
async function sendEmail({ name, email, phone, message }) {
  const {
    RESEND_API_KEY,
    SENDGRID_API_KEY,
    FROM_EMAIL, // optional; see notes below
    TO_EMAIL,
  } = process.env;

  if (!TO_EMAIL) throw new Error("TO_EMAIL not set");

  const subject = `New contact form message from ${name}`;
  const html = `
    <h2>Contact Form</h2>
    <p><b>Name:</b> ${escapeHtml(name)}</p>
    <p><b>Email:</b> ${escapeHtml(email)}</p>
    ${phone ? `<p><b>Phone:</b> ${escapeHtml(phone)}</p>` : ""}
    <p><b>Message:</b></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
  `;

  if (RESEND_API_KEY) {
    // Works for testing without domain verification using onboarding@resend.dev
    const from = FROM_EMAIL || "onboarding@resend.dev";
    return await sendViaResend({ from, to: TO_EMAIL, subject, html, replyTo: email });
  }

  if (SENDGRID_API_KEY) {
    // Must be a verified sender (Single Sender) OR from a verified domain in SendGrid
    const from = FROM_EMAIL || "visioncraftlabs@gmail.com"; // only valid if verified in SendGrid
    return await sendViaSendgrid({ from, to: TO_EMAIL, subject, html, replyTo: email });
  }

  throw new Error("Email not configured: set RESEND_API_KEY or SENDGRID_API_KEY, plus TO_EMAIL (optional FROM_EMAIL).");
}

// ---------- Bind same handlers to 3 prefixes ----------
const FN = "/.netlify/functions/server";
const PREFIXES = ["", "/api", FN];
const bind = (method, path, ...handlers) => PREFIXES.forEach((p) => app[method](`${p}${path}`, ...handlers));

// ---------- Debug ----------
bind("get", "/contact/debug", (req, res) => {
  const present = (v) => typeof v === "string" && v.length > 0;
  return ok(res, {
    env_present: {
      RESEND_API_KEY: present(process.env.RESEND_API_KEY),
      SENDGRID_API_KEY: present(process.env.SENDGRID_API_KEY),
      TO_EMAIL: present(process.env.TO_EMAIL),
      FROM_EMAIL: present(process.env.FROM_EMAIL),
    },
    debug: { originalUrl: req.originalUrl, path: req.path },
  });
});

bind("get", "/contact/test", async (req, res) => {
  try {
    await sendEmail({
      name: "Visioncraft Tester",
      email: "no-reply@visioncraftlabs.com",
      phone: "",
      message: "This is a test from /contact/test route.",
    });
    return ok(res, { success: true, message: "Test email sent." });
  } catch (e) {
    console.error("Test email error:", e);
    return bad(res, e.message || "Failed to send test email", 500);
  }
});

// ---------- API ----------
bind("post", "/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};
    if (!name || !email || !message) return bad(res, "All fields are required (name, email, message).", 422);

    const submission = {
      id: currentContactId++,
      name,
      email,
      phone: phone || null,
      message,
      createdAt: new Date().toISOString(),
    };
    contactSubmissions.push(submission);

    await sendEmail({ name, email, phone, message });
    return ok(res, { success: true, message: "Contact form submitted successfully" }, 201);
  } catch (error) {
    console.error("Contact error:", error);
    return bad(res, error.message || "Failed to submit contact form", 500);
  }
});

bind("get", "/contact-submissions", (req, res) => {
  try {
    const list = [...contactSubmissions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return ok(res, list);
  } catch {
    return bad(res, "Failed to fetch contact submissions", 500);
  }
});

bind("post", "/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) return bad(res, "No image file provided", 422);
    const { clientName, clientEmail, clientPhone } = req.body || {};
    const record = {
      id: currentImageUploadId++,
      fileName: `upload_${Date.now()}_${req.file.originalname}`,
      originalName: req.file.originalname,
      fileSize: String(req.file.size),
      mimeType: req.file.mimetype,
      uploadPath: `/tmp/${Date.now()}_${req.file.originalname}`, // placeholder
      clientName: clientName || null,
      clientEmail: clientEmail || null,
      clientPhone: clientPhone || null,
      status: "uploaded",
      createdAt: new Date().toISOString(),
    };
    imageUploads.push(record);
    return ok(res, {
      success: true,
      upload: { id: record.id, originalName: record.originalName, status: record.status, uploadedAt: record.createdAt },
    });
  } catch (error) {
    console.error(error);
    return bad(res, error.message || "Upload failed", 500);
  }
});

bind("get", "/uploads", (req, res) => {
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
  } catch {
    return bad(res, "Failed to fetch uploads", 500);
  }
});

// Health
bind("get", "/", (req, res) => ok(res, { ok: true, message: "Server function is up" }));

// Fallback
app.all("*", (req, res) => bad(res, `No route matched. originalUrl=${req.originalUrl} path=${req.path}`, 404));

export const handler = serverless(app);

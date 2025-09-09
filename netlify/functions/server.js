// netlify/functions/server.js
// Express + serverless-http (ESM) — Gmail SMTP via Nodemailer

import express from "express";
import serverless from "serverless-http";
import multer from "multer";
import nodemailer from "nodemailer";

const app = express();

// ---------- Middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // tighten for prod if needed
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
const ok = (res, data, code = 200) => res.status(code).json(data);
const bad = (res, msg, code = 400) => res.status(code).json({ success: false, message: msg });

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

// ----- Gmail SMTP via Nodemailer -----
function assertSmtpEnv() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !TO_EMAIL) {
    throw new Error(
      "SMTP not configured: set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and TO_EMAIL. (FROM_EMAIL optional; defaults to SMTP_USER)"
    );
  }
}

function makeTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  return nodemailer.createTransport({
    host: SMTP_HOST,                 // smtp.gmail.com
    port: Number(SMTP_PORT),         // 465
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

async function sendEmail({ name, email, phone, message }) {
  assertSmtpEnv();
  const { TO_EMAIL, FROM_EMAIL, SMTP_USER } = process.env;

  const from = FROM_EMAIL || SMTP_USER; // must be the authenticated Gmail or verified alias
  const subject = `New contact form message from ${name}`;
  const html = `
    <h2>Contact Form</h2>
    <p><b>Name:</b> ${escapeHtml(name)}</p>
    <p><b>Email:</b> ${escapeHtml(email)}</p>
    ${phone ? `<p><b>Phone:</b> ${escapeHtml(phone)}</p>` : ""}
    <p><b>Message:</b></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
  `;

  const transporter = makeTransport();
  await transporter.sendMail({
    from,
    to: TO_EMAIL,
    subject,
    html,
    text: `Name: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ""}\n\n${message}`,
    replyTo: email,
  });

  return { provider: "smtp" };
}

// ---------- Route binder for 3 prefixes ----------
const FN = "/.netlify/functions/server";
const PREFIXES = ["", "/api", FN];
const bind = (method, path, ...handlers) => PREFIXES.forEach((p) => app[method](`${p}${path}`, ...handlers));

// ---------- Debug & Test ----------
bind("get", "/contact/debug", (req, res) => {
  const present = (v) => typeof v === "string" && v.length > 0;
  ok(res, {
    env_present: {
      SMTP_HOST: present(process.env.SMTP_HOST),
      SMTP_PORT: present(process.env.SMTP_PORT),
      SMTP_USER: present(process.env.SMTP_USER),
      SMTP_PASS: present(process.env.SMTP_PASS),
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
    ok(res, { success: true, message: "Test email sent via SMTP." });
  } catch (e) {
    console.error("SMTP test error:", e);
    bad(res, e.message || "Failed to send test email", 500);
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
    ok(res, { success: true, message: "Contact form submitted successfully" }, 201);
  } catch (error) {
    console.error("Contact error:", error);
    bad(res, error.message || "Failed to submit contact form", 500);
  }
});

bind("get", "/contact-submissions", (req, res) => {
  try {
    const list = [...contactSubmissions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    ok(res, list);
  } catch {
    bad(res, "Failed to fetch contact submissions", 500);
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
      uploadPath: `/tmp/${Date.now()}_${req.file.originalname}`, // placeholder only
      clientName: clientName || null,
      clientEmail: clientEmail || null,
      clientPhone: clientPhone || null,
      status: "uploaded",
      createdAt: new Date().toISOString(),
    };
    imageUploads.push(record);
    ok(res, {
      success: true,
      upload: { id: record.id, originalName: record.originalName, status: record.status, uploadedAt: record.createdAt },
    });
  } catch (error) {
    console.error(error);
    bad(res, error.message || "Upload failed", 500);
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
    ok(res, uploads);
  } catch {
    bad(res, "Failed to fetch uploads", 500);
  }
});

// Health
bind("get", "/", (req, res) => ok(res, { ok: true, message: "Server function is up" }));

// Fallback
app.all("*", (req, res) => bad(res, `No route matched. originalUrl=${req.originalUrl} path=${req.path}`, 404));

export const handler = serverless(app);

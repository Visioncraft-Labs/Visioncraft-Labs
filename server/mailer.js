// server/mailer.js
import nodemailer from "nodemailer";

function assertSmtpEnv() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !TO_EMAIL) {
    throw new Error(
      "SMTP not configured: set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and TO_EMAIL. (FROM_EMAIL optional; defaults to SMTP_USER)"
    );
  }
}

export function makeTransport() {
  assertSmtpEnv();
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  return nodemailer.createTransport({
    host: SMTP_HOST,                // e.g. "smtp.gmail.com"
    port: Number(SMTP_PORT),        // 465 for SSL
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendContactEmail({ name, email, phone, message }) {
  assertSmtpEnv();
  const { TO_EMAIL, FROM_EMAIL, SMTP_USER } = process.env;

  const from = FROM_EMAIL || SMTP_USER;
  const subject = `New contact form message from ${name || "Unknown"}`;
  const html = `
    <h2>Contact Form</h2>
    <p><b>Name:</b> ${escapeHtml(name || "")}</p>
    <p><b>Email:</b> ${escapeHtml(email || "")}</p>
    ${phone ? `<p><b>Phone:</b> ${escapeHtml(phone)}</p>` : ""}
    <p><b>Message:</b></p>
    <p>${escapeHtml(message || "").replace(/\n/g, "<br/>")}</p>
  `;

  const transporter = makeTransport();
  await transporter.sendMail({
    from,
    to: TO_EMAIL,
    subject,
    html,
    text:
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      (phone ? `Phone: ${phone}\n` : "") +
      `\n${message || ""}`,
    replyTo: email || undefined,
  });

  return { ok: true };
}

export async function sendTestEmail() {
  const transporter = makeTransport();
  const { TO_EMAIL, FROM_EMAIL, SMTP_USER } = process.env;

  await transporter.sendMail({
    from: FROM_EMAIL || SMTP_USER,
    to: TO_EMAIL,
    subject: "SMTP test from Nodemailer",
    text: "This is a test email sent via Gmail SMTP + Nodemailer.",
  });

  return { ok: true };
}

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[m]));
}

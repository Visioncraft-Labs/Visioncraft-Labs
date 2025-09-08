import sgMail from "@sendgrid/mail";

// Read env once at load time
const { SENDGRID_API_KEY, TO_EMAIL, FROM_EMAIL } = process.env;

// Helpful warnings (won't crash the function at import time)
if (!SENDGRID_API_KEY) console.warn("SENDGRID_API_KEY not set");
if (!TO_EMAIL) console.warn("TO_EMAIL not set");
if (!FROM_EMAIL) console.warn("FROM_EMAIL not set (must be a verified sender in SendGrid)");

// Init SDK (only if key exists to avoid noisy errors on dev)
if (SENDGRID_API_KEY) sgMail.setApiKey(SENDGRID_API_KEY);

// Basic HTML escaping
const escapeHtml = (s = "") =>
  s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

// ---- Public helpers ----
export async function sendContactEmail({ name, email, phone, message }) {
  ensureConfigured(); // throws if vars missing

  const subject = `New Contact Form Submission from ${name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color:#333;border-bottom:2px solid #007bff;padding-bottom:10px;">
        New Contact Form Submission
      </h2>
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="margin-top:0;color:#007bff;">Contact Details</h3>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        ${phone ? `<p><strong>Phone:</strong> <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></p>` : ""}
      </div>
      <div style="background:#fff;border:1px solid #dee2e6;padding:20px;border-radius:8px;">
        <h3 style="margin-top:0;color:#333;">Message</h3>
        <p style="white-space:pre-wrap;line-height:1.6;">${escapeHtml(message)}</p>
      </div>
      <div style="margin-top:30px;padding:15px;background:#e9ecef;border-radius:8px;font-size:12px;color:#6c757d;">
        <p>This email was sent from the VisionCraft Labs website contact form.</p>
        <p>Received at: ${new Date().toISOString()}</p>
      </div>
    </div>
  `;

  return sendEmail({ subject, html, replyTo: email });
}

export async function sendImageUploadNotification({
  clientName,
  clientEmail,
  clientPhone,
  fileName,
  originalName,
}) {
  ensureConfigured(); // throws if vars missing

  const clientBlock =
    clientName || clientEmail || clientPhone
      ? `
        <div style="background:#fff;border:1px solid #dee2e6;padding:20px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#333;">Client Information</h3>
          ${clientName ? `<p><strong>Name:</strong> ${escapeHtml(clientName)}</p>` : ""}
          ${clientEmail ? `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(clientEmail)}">${escapeHtml(clientEmail)}</a></p>` : ""}
          ${clientPhone ? `<p><strong>Phone:</strong> <a href="tel:${escapeHtml(clientPhone)}">${escapeHtml(clientPhone)}</a></p>` : ""}
        </div>`
      : `
        <div style="background:#fff3cd;border:1px solid #ffeaa7;padding:15px;border-radius:8px;margin:20px 0;">
          <p style="margin:0;color:#856404;"><strong>Note:</strong> No client contact information was provided with this upload.</p>
        </div>`;

  const subject = `New Image Upload - ${escapeHtml(originalName)}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color:#333;border-bottom:2px solid #28a745;padding-bottom:10px;">
        New Image Upload for Preview
      </h2>
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="margin-top:0;color:#28a745;">Upload Details</h3>
        <p><strong>Original File Name:</strong> ${escapeHtml(originalName)}</p>
        <p><strong>Server File Name:</strong> ${escapeHtml(fileName)}</p>
        <p><strong>Upload Time:</strong> ${new Date().toISOString()}</p>
      </div>
      ${clientBlock}
      <div style="background:#d1ecf1;border:1px solid #b8daff;padding:15px;border-radius:8px;margin:20px 0;">
        <p style="margin:0;color:#0c5460;"><strong>Next Steps:</strong> Log into the admin panel to view the uploaded image and prepare the preview transformation.</p>
      </div>
    </div>
  `;

  return sendEmail({ subject, html });
}

// ---- Private helpers ----
function ensureConfigured() {
  if (!SENDGRID_API_KEY || !TO_EMAIL || !FROM_EMAIL) {
    throw new Error(
      "Email not configured: set SENDGRID_API_KEY, TO_EMAIL, and FROM_EMAIL (FROM must be a verified sender in SendGrid)."
    );
  }
}

async function sendEmail({ subject, html, replyTo }) {
  try {
    const msg = {
      to: TO_EMAIL,
      from: FROM_EMAIL,      // must be verified in SendGrid (Single Sender or domain-verified)
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    };
    const [resp] = await sgMail.send(msg);
    if (resp?.statusCode >= 400) {
      throw new Error(`SendGrid (${resp.statusCode})`);
    }
    return true;
  } catch (err) {
    const detail = err?.response?.body ? JSON.stringify(err.response.body) : String(err?.message || err);
    throw new Error(`SendGrid error: ${detail}`);
  }
}

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

// server/storage.ts
var MemStorage = class {
  users;
  contactSubmissions;
  imageUploads;
  currentUserId;
  currentContactId;
  currentImageUploadId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.contactSubmissions = /* @__PURE__ */ new Map();
    this.imageUploads = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentImageUploadId = 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createContactSubmission(insertSubmission) {
    const id = this.currentContactId++;
    const submission = {
      ...insertSubmission,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }
  async getContactSubmissions() {
    return Array.from(this.contactSubmissions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
  async createImageUpload(insertUpload) {
    const id = this.currentImageUploadId++;
    const upload2 = {
      id,
      fileName: insertUpload.fileName,
      originalName: insertUpload.originalName,
      fileSize: insertUpload.fileSize,
      mimeType: insertUpload.mimeType,
      uploadPath: insertUpload.uploadPath,
      clientEmail: insertUpload.clientEmail || null,
      clientName: insertUpload.clientName || null,
      clientPhone: insertUpload.clientPhone || null,
      status: insertUpload.status || "uploaded",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.imageUploads.set(id, upload2);
    return upload2;
  }
  async getImageUploads() {
    return Array.from(this.imageUploads.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
  async getImageUpload(id) {
    return this.imageUploads.get(id);
  }
  async updateImageUploadStatus(id, status) {
    const upload2 = this.imageUploads.get(id);
    if (upload2) {
      const updatedUpload = { ...upload2, status };
      this.imageUploads.set(id, updatedUpload);
      return updatedUpload;
    }
    return void 0;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var imageUploads = pgTable("image_uploads", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileSize: text("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadPath: text("upload_path").notNull(),
  clientEmail: text("client_email"),
  clientName: text("client_name"),
  clientPhone: text("client_phone"),
  status: text("status").notNull().default("uploaded"),
  // uploaded, processing, completed
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertContactSubmissionSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  phone: true,
  message: true
});
var insertImageUploadSchema = createInsertSchema(imageUploads).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
import { z } from "zod";

// server/sendgrid.ts
import sgMail from "@sendgrid/mail";
if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
async function sendContactEmail(params) {
  try {
    const msg = {
      to: "visioncraftlabs@gmail.com",
      from: "visioncraftlabs@gmail.com",
      // Must be verified sender
      subject: `New Contact Form Submission from ${params.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #007bff;">Contact Details</h3>
            <p><strong>Name:</strong> ${params.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${params.email}">${params.email}</a></p>
            ${params.phone ? `<p><strong>Phone:</strong> <a href="tel:${params.phone}">${params.phone}</a></p>` : ""}
          </div>
          
          <div style="background: #fff; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #333;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${params.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #e9ecef; border-radius: 8px; font-size: 12px; color: #6c757d;">
            <p>This email was sent from the VisionCraft Labs website contact form.</p>
            <p>Received at: ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
          </div>
        </div>
      `
    };
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error("SendGrid contact email error:", error);
    return false;
  }
}
async function sendImageUploadNotification(params) {
  try {
    const msg = {
      to: "visioncraftlabs@gmail.com",
      from: "visioncraftlabs@gmail.com",
      // Must be verified sender
      subject: `New Image Upload - ${params.originalName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
            New Image Upload for Preview
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #28a745;">Upload Details</h3>
            <p><strong>Original File Name:</strong> ${params.originalName}</p>
            <p><strong>Server File Name:</strong> ${params.fileName}</p>
            <p><strong>Upload Time:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
          </div>
          
          ${params.clientName || params.clientEmail || params.clientPhone ? `
          <div style="background: #fff; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Client Information</h3>
            ${params.clientName ? `<p><strong>Name:</strong> ${params.clientName}</p>` : ""}
            ${params.clientEmail ? `<p><strong>Email:</strong> <a href="mailto:${params.clientEmail}">${params.clientEmail}</a></p>` : ""}
            ${params.clientPhone ? `<p><strong>Phone:</strong> <a href="tel:${params.clientPhone}">${params.clientPhone}</a></p>` : ""}
          </div>
          ` : `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>Note:</strong> No client contact information was provided with this upload.</p>
          </div>
          `}
          
          <div style="background: #d1ecf1; border: 1px solid #b8daff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #0c5460;"><strong>Next Steps:</strong> Log into the admin panel to view the uploaded image and prepare the preview transformation.</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #e9ecef; border-radius: 8px; font-size: 12px; color: #6c757d;">
            <p>This email was sent from the VisionCraft Labs image upload system.</p>
          </div>
        </div>
      `
    };
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error("SendGrid image upload email error:", error);
    return false;
  }
}

// server/routes.ts
var uploadDir = path.join(process.cwd(), "uploads");
var ensureUploadDir = async () => {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
};
var upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});
async function registerRoutes(app2) {
  await ensureUploadDir();
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      const emailSent = await sendContactEmail({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone ?? void 0,
        message: validatedData.message
      });
      res.json({
        success: true,
        id: submission.id,
        emailSent
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid form data",
          errors: error.errors
        });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to submit contact form"
        });
      }
    }
  });
  app2.get("/api/contact-submissions", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch contact submissions"
      });
    }
  });
  app2.post("/api/upload-image", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided"
        });
      }
      const { clientName, clientEmail, clientPhone } = req.body;
      const uploadData = {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size.toString(),
        mimeType: req.file.mimetype,
        uploadPath: req.file.path,
        clientName: clientName || null,
        clientEmail: clientEmail || null,
        clientPhone: clientPhone || null,
        status: "uploaded"
      };
      const imageUpload = await storage.createImageUpload(uploadData);
      const emailSent = await sendImageUploadNotification({
        clientName: clientName || void 0,
        clientEmail: clientEmail || void 0,
        clientPhone: clientPhone || void 0,
        fileName: req.file.filename,
        originalName: req.file.originalname
      });
      res.json({
        success: true,
        upload: {
          id: imageUpload.id,
          originalName: imageUpload.originalName,
          status: imageUpload.status,
          uploadedAt: imageUpload.createdAt
        },
        emailSent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to upload image"
      });
    }
  });
  app2.get("/api/uploads", async (req, res) => {
    try {
      const uploads = await storage.getImageUploads();
      res.json(uploads);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch uploads"
      });
    }
  });
  app2.get("/api/uploads/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const imagePath = path.join(uploadDir, filename);
      await fs.access(imagePath);
      res.sendFile(imagePath);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "Image not found"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertImageUploadSchema } from "@shared/schema";
import { z } from "zod";
import { sendContactEmail, sendImageUploadNotification } from "./sendgrid";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
};

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  await ensureUploadDir();

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      // Send email notification
      const emailSent = await sendContactEmail({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone ?? undefined,
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
        console.error("Email sending failed, but form was saved");
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit contact form",
          error: error.message
        });
    }
  });

  // Get contact submissions (for admin purposes)
  app.get("/api/contact-submissions", async (req, res) => {
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

  // Image upload endpoint
  app.post("/api/upload-image", upload.single('image'), async (req, res) => {
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
      
      // Send email notification for image upload
      const emailSent = await sendImageUploadNotification({
        clientName: clientName || undefined,
        clientEmail: clientEmail || undefined,
        clientPhone: clientPhone || undefined,
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
        } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload image",
        error: error.message
      });
    }
  });

  // Get uploaded images
  app.get("/api/uploads", async (req, res) => {
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

  // Serve uploaded images
  app.get("/api/uploads/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const imagePath = path.join(uploadDir, filename);
      
      // Check if file exists
      await fs.access(imagePath);
      res.sendFile(imagePath);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "Image not found"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

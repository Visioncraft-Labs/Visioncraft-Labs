const express = require('express');
const serverless = require('serverless-http');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// In-memory storage for Netlify (since we can't use persistent file system)
let contactSubmissions = [];
let imageUploads = [];
let currentContactId = 1;
let currentImageUploadId = 1;

// Configure multer for file uploads (using memory storage for Netlify)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const submission = {
      id: currentContactId++,
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };

    contactSubmissions.push(submission);

    res.json({
      success: true,
      message: "Contact form submitted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit contact form"
    });
  }
});

app.get('/api/contact-submissions', async (req, res) => {
  try {
    res.json(contactSubmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact submissions"
    });
  }
});

app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    const { clientName, clientEmail, clientPhone } = req.body;

    // For Netlify, we'll store file info but not the actual file
    // In production, you'd want to upload to a service like Cloudinary or AWS S3
    const upload = {
      id: currentImageUploadId++,
      fileName: `upload_${Date.now()}_${req.file.originalname}`,
      originalName: req.file.originalname,
      fileSize: req.file.size.toString(),
      mimeType: req.file.mimetype,
      uploadPath: `/tmp/${Date.now()}_${req.file.originalname}`, // Placeholder path
      clientName: clientName || null,
      clientEmail: clientEmail || null,
      clientPhone: clientPhone || null,
      status: "uploaded",
      createdAt: new Date().toISOString()
    };

    imageUploads.push(upload);

    res.json({
      success: true,
      upload: {
        id: upload.id,
        originalName: upload.originalName,
        status: upload.status,
        uploadedAt: upload.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Upload failed"
    });
  }
});

app.get('/api/uploads', async (req, res) => {
  try {
    const uploads = imageUploads
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(upload => ({
        id: upload.id,
        fileName: upload.fileName,
        originalName: upload.originalName,
        fileSize: upload.fileSize,
        mimeType: upload.mimeType,
        clientName: upload.clientName,
        clientEmail: upload.clientEmail,
        clientPhone: upload.clientPhone,
        status: upload.status,
        createdAt: upload.createdAt
      }));

    res.json(uploads);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch uploads"
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Export the serverless function
module.exports.handler = serverless(app);
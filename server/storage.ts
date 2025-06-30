import { users, contactSubmissions, imageUploads, type User, type InsertUser, type ContactSubmission, type InsertContactSubmission, type ImageUpload, type InsertImageUpload } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  createImageUpload(upload: InsertImageUpload): Promise<ImageUpload>;
  getImageUploads(): Promise<ImageUpload[]>;
  getImageUpload(id: number): Promise<ImageUpload | undefined>;
  updateImageUploadStatus(id: number, status: string): Promise<ImageUpload | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private imageUploads: Map<number, ImageUpload>;
  private currentUserId: number;
  private currentContactId: number;
  private currentImageUploadId: number;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.imageUploads = new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentImageUploadId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentContactId++;
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      createdAt: new Date(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createImageUpload(insertUpload: InsertImageUpload): Promise<ImageUpload> {
    const id = this.currentImageUploadId++;
    const upload: ImageUpload = {
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
      createdAt: new Date(),
    };
    this.imageUploads.set(id, upload);
    return upload;
  }

  async getImageUploads(): Promise<ImageUpload[]> {
    return Array.from(this.imageUploads.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getImageUpload(id: number): Promise<ImageUpload | undefined> {
    return this.imageUploads.get(id);
  }

  async updateImageUploadStatus(id: number, status: string): Promise<ImageUpload | undefined> {
    const upload = this.imageUploads.get(id);
    if (upload) {
      const updatedUpload = { ...upload, status };
      this.imageUploads.set(id, updatedUpload);
      return updatedUpload;
    }
    return undefined;
  }
}

export const storage = new MemStorage();

export interface Doc {
  _id: string;
  originalName: string;
  size: number;
  mimeType: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
  uploadedBy?: string;
  minioPath?: string;
}

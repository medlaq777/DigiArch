import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  private minioClient: Minio.Client;
  private logger = new Logger(StorageService.name);
  private bucketName = 'documents';

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: this.configService.get<string>('MINIO_ROOT_USER') || 'minioadmin',
      secretKey: this.configService.get<string>('MINIO_ROOT_PASSWORD') || 'minioadmin',
    });
    this.createBucketIfNotExists();
  }

  async createBucketIfNotExists() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Bucket ${this.bucketName} created successfully`);
      }
    } catch (err) {
      this.logger.error(`Error creating bucket: ${err.message}`);
    }
  }

  async uploadFile(objectName: string, buffer: Buffer, contentType: string = 'application/pdf') {
    try {
      return await this.minioClient.putObject(this.bucketName, objectName, buffer, buffer.length, {
        'Content-Type': contentType,
      });
    } catch (error) {
      this.logger.error(`Error uploading file ${objectName}:`, error);
      throw error;
    }
  }

  async getFileStream(objectName: string): Promise<Readable> {
    try {
      return await this.minioClient.getObject(this.bucketName, objectName);
    } catch (error) {
      this.logger.error(`Error getting file ${objectName}:`, error);
      throw error;
    }
  }
}

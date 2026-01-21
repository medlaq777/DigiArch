import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doc, DocDocument } from './schemas/doc.schema';
import { StorageService } from '../storage/storage.service';
import { OcrService } from '../ai/ocr.service';
import { LlmService } from '../ai/llm.service';
import { ClassificationService } from '../ai/classification.service';
import { LogsService } from '../logs/logs.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Doc.name) private docModel: Model<DocDocument>,
    private storageService: StorageService,
    private ocrService: OcrService,
    private llmService: LlmService,
    private classificationService: ClassificationService,
    private logsService: LogsService,
  ) {}

  async uploadDocument(file: Express.Multer.File, userId: string) {
    // 1. OCR Extraction
    const text = await this.ocrService.extractText(file.buffer);

    // 2. LLM Metadata Extraction
    const metadata = await this.llmService.extractMetadata(text);

    // 3. Classification / Path Generation
    const folderPath = this.classificationService.generatePath(metadata);
    const fileName = `${uuidv4()}_${file.originalname}`;
    const minioPath = `${folderPath}/${fileName}`;

    // 4. Upload to MinIO
    await this.storageService.uploadFile(minioPath, file.buffer, file.mimetype);

    // 5. Save Record in MongoDB
    const doc = new this.docModel({
      originalName: file.originalname,
      minioPath,
      mimeType: file.mimetype,
      size: file.size,
      metadata,
      uploadedBy: userId,
    });
    const savedDoc = await doc.save();

    // 6. Log Action
    await this.logsService.createLog(userId, 'UPLOAD', { docId: savedDoc._id, fileName: file.originalname });

    return savedDoc;
  }

  async search(query: any) {
    const filter: any = {};
    if (query.cin) filter['metadata.cin'] = query.cin;
    if (query.nom) filter['metadata.nom'] = { $regex: query.nom, $options: 'i' };
    
    return this.docModel.find(filter).exec();
  }

  async getDocumentStream(id: string, userId: string) {
    const doc = await this.docModel.findById(id).exec();
    if (!doc) throw new NotFoundException('Document not found');

    await this.logsService.createLog(userId, 'VIEW', { docId: id });
    
    const stream = await this.storageService.getFileStream(doc.minioPath);
    return { stream, doc };
  }
}

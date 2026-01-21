import { Injectable, Logger } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  private logger = new Logger(OcrService.name);

  async extractText(buffer: Buffer): Promise<string> {
    try {
      this.logger.log('Starting OCR processing...');
      const { data: { text } } = await Tesseract.recognize(buffer, 'eng'); // Defaulting to English, could be parameterized
      this.logger.log('OCR processing completed.');
      return text;
    } catch (error) {
      this.logger.error('OCR Extraction Failed', error);
      throw new Error('OCR Failed');
    }
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OcrService } from './ocr.service';
import { LlmService } from './llm.service';
import { ClassificationService } from './classification.service';

@Module({
  imports: [ConfigModule],
  providers: [OcrService, LlmService, ClassificationService],
  exports: [OcrService, LlmService, ClassificationService],
})
export class AiModule {}

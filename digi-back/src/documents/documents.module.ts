import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Doc, DocSchema } from './schemas/doc.schema';
import { StorageModule } from '../storage/storage.module';
import { AiModule } from '../ai/ai.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doc.name, schema: DocSchema }]),
    StorageModule,
    AiModule,
    LogsModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}

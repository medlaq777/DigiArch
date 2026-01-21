import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocDocument = Doc & Document;

@Schema({ timestamps: true })
export class Doc {
  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  minioPath: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ type: Object })
  metadata: any; // Extracted by AI

  @Prop({ required: true })
  uploadedBy: string; // User ID
}

export const DocSchema = SchemaFactory.createForClass(Doc);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.MANAGER })
  role: UserRole;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

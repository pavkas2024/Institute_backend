import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class New   extends Document{
  @Prop({ required: true })
  title: string;

  @Prop({ required: false, default: '' })
  photo?: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false, default: '' })
  date?: string;
}

export const NewsSchema = SchemaFactory.createForClass(New);
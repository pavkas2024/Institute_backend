import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Institutedocument extends Document {
  @Prop({
    type: {
      uk: {
        title: { type: String, required: true },
      },
      en: {
        title: { type: String, required: true },
      },
    },
    required: true,
  })
  translates: {
    uk: { title: string };
    en: { title: string };
  };


  @Prop({ required: true })
  link: string; // шлях до файлу, напр.
}

export const InstitutedocumentSchema = SchemaFactory.createForClass(Institutedocument);
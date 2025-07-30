import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Intproject extends Document {
  @Prop({ required: true })
  yearStart: string;

  @Prop({ required: true })
  yearFinish: string;

  @Prop({
    type: {
      uk: {
        context: { type: String, required: false, default: '' },
        head: { type: String, required: true },
        title: { type: String, required: true },
        results: { type: String, required: false, default: '' },
        partners: {
          type: [
            {
              title: { type: String, required: true },
              link: { type: String, required: false, default: '' },
            },
          ],
          required: true,
          default: [],
        },
      },
      en: {
        context: { type: String, required: false, default: '' },
        head: { type: String, required: true },
        title: { type: String, required: true },
        results: { type: String, required: false, default: '' },
        partners: {
          type: [
            {
              title: { type: String, required: true },
              link: { type: String, required: false, default: '' },
            },
          ],
          required: true,
          default: [],
        },
      },
    },
    required: true,
  })
  translates: {
    uk: {
      context?: string;
      head: string;
      title: string;
      results?: string;
      partners: { title: string; link?: string }[];
    };
    en: {
      context?: string;
      head: string;
      title: string;
      results?: string;
      partners: { title: string; link?: string }[];
    };
  };

  @Prop({ required: false, default: '' })
  link?: string;

  @Prop({ required: false, default: '' })
  rk?: string;

  @Prop({ required: false, default: '' })
  funding?: string;

  @Prop({ required: false, default: '' })
  photo?: string;
}

export const IntprojectSchema = SchemaFactory.createForClass(Intproject);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'ssai_sessions' })
export class SsaiSession extends Document {

  // Дата: YYYY-MM або YYYY-MM-DD
  @Prop({ required: true })
  date: string;

  // Порядок засідань у межах одного місяця
  @Prop({ type: Number, default: 1 })
  orderInMonth: number;

  // false — заплановане, true — проведене
  @Prop({ type: Boolean, default: false })
  completed: boolean;

  // Посилання на онлайн-засідання або матеріали
  @Prop({ type: String, default: '' })
  link?: string;

  @Prop({ type: String, default: '' })
  time?: string;

  // Фотографії засідання
  @Prop({ type: [String], default: [] })
  photos: string[];

  // Двомовна інформація
  @Prop({
    type: {
      uk: {
        title: { type: String, required: true },

        speakers: {
          type: [String],
          required: true,
          validate: {
            validator: (value: string[]) =>
              Array.isArray(value) && value.length > 0,
            message: 'At least one speaker is required',
          },
        },

        summary: { type: String, default: '' },
      },

      en: {
        title: { type: String, required: true },

        speakers: {
          type: [String],
          required: true,
          validate: {
            validator: (value: string[]) =>
              Array.isArray(value) && value.length > 0,
            message: 'At least one speaker is required',
          },
        },

        summary: { type: String, default: '' },
      },
    },
    required: true,
  })
  translates: {
    uk: {
      title: string;
      speakers: string[];
      summary?: string;
    };
    en: {
      title: string;
      speakers: string[];
      summary?: string;
    };
  };
}

export const SsaiSessionSchema =
  SchemaFactory.createForClass(SsaiSession);

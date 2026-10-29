
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const PersonSchema = {
  name: { type: String, required: true },
  degree: { type: String, default: '' },
  academicTitle: { type: String, default: '' },
  academyStatus: { type: String, default: '' },
};

const TranslationSchema = {
  title: { type: String, required: true },

  chair: {
    type: PersonSchema,
    required: true,
  },

  deputy1: {
    type: PersonSchema,
    required: true,
  },

  section1: { type: String, required: true },

  deputy2: {
    type: PersonSchema,
    required: true,
  },

  section2: { type: String, required: true },

  description: { type: String, required: true },
};

interface Person {
  name: string;
  degree?: string;
  academicTitle?: string;
  academyStatus?: string;
}

interface Translation {
  title: string;
  chair: Person;
  deputy1: Person;
  section1: string;
  deputy2: Person;
  section2: string;
  description: string;
}

@Schema({ timestamps: true, collection: 'ssai_info' })
export class SsaiInfo extends Document {

  @Prop({
    type: {
      uk: { type: TranslationSchema, required: true },
      en: { type: TranslationSchema, required: true },
    },
    required: true,
  })
  translates: {
    uk: Translation;
    en: Translation;
  };
}

export const SsaiInfoSchema =
  SchemaFactory.createForClass(SsaiInfo);

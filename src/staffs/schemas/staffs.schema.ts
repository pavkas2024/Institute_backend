import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StaffDocument = Staff & Document;

@Schema({ timestamps: true })
export class Staff extends Document {
  @Prop({ required: false, default: '' })
  photo?: string;

  @Prop({ required: false, default: '' })
  link?: string;

  @Prop({ required: true })
  order: string;

  @Prop({ 
    required: true,
    enum: ['так', 'ні'],   // обмеження значень рядка
    type: String
  })
  council: string;

  @Prop({
    type: {
      orcid: { type: String },
      linkedIn: { type: String },
      googleScholar: { type: String },
      scopus: { type: String },
      wos: { type: String },
      academy: { type: String },
      facebook: { type: String },
    },
    required: false,
    default: {} 
  })
  profiles?: {
    orcid?: string;
    linkedIn?: string;
    googleScholar?: string;
    scopus?: string;
    wos?: string;
    academy?: string;
    facebook?: string;
  };

  @Prop({
    type: {
      uk: {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        patronymic: { type: String, required: false, default: '' },
        degree: { type: String, required: false, default: '' },
        acadTitle: { type: String, required: false, default: '' },
        acadTitle2: { type: String, required: false, default: '' },
        info: { type: String, required: false, default: '' },
        position: { type: String, required: true },
        department: { type: String, required: false, default: ''  },
      },
      en: {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        patronymic: { type: String, required: false, default: '' },
        degree: { type: String, required: false, default: '' },
        acadTitle: { type: String, required: false, default: '' },
        acadTitle2: { type: String, required: false, default: '' },
        info: { type: String, required: false, default: '' },
        position: { type: String, required: true },
        department: { type: String, required: false, default: ''  },
      },
    },
    required: true,
  })
  translates: {
    uk: {
      name: string;
      surname: string;
      patronymic?: string;
      degree?: string;
      acadTitle?: string;
      acadTitle2?: string;
      info?: string;
      position: string;
      department?: string;
    };
    en: {
      name: string;
      surname: string;
      patronymic?: string;
      degree?: string;
      acadTitle?: string;
      acadTitle2?: string;
      info?: string;
      position: string;
      department?: string;
    };
  };

  // ---- Додано поле role для категорії співробітника ----
  @Prop({
    required: true,
    enum: ['advisor', 'director', 'dep', 'secr', 'scientific', 'fin'],
    type: String,
  })
  role: 'advisor' | 'director' | 'dep' | 'secr' | 'scientific' | 'fin';
}

export const StaffsSchema = SchemaFactory.createForClass(Staff);

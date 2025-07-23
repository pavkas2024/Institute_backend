import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Staff extends Document {
  @Prop({ required: false })
  photo?: string;

  @Prop({ required: false })
  link?: string;

  @Prop({
    type: [
      {
        orcid: { type: String },
        linkedIn: { type: String },
        googleScholar: { type: String },
        scopus: { type: String },
        wos: { type: String },
        academy: { type: String },
        facebook: { type: String },
      },
    ],
    required: false,
  })
  profiles: Array<{
    orcid?: string;
    linkedIn?: string;
    googleScholar?: string;
    scopus?: string;
    wos?: string;
    academy?: string;
    facebook?: string;
  }>;

  @Prop({
    type: {
      uk: {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        patronymic: { type: String, required: true },
        degree: { type: String, required: false },
        acadTitle: { type: String, required: false },
        acadTitle2: { type: String, required: false },
        info: { type: String, required: false },
        position: { type: String, required: true },
        department: { type: String, required: true },
      },
      en: {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        patronymic: { type: String, required: false },
        degree: { type: String, required: false },
        acadTitle: { type: String, required: false },
        acadTitle2: { type: String, required: false },
        info: { type: String, required: false },
        position: { type: String, required: true },
        department: { type: String, required: true },
      },
    },
    required: true,
  })
  translates: {
    uk: {
      name: string;
      surname: string;
      patronymic: string;
      degree: string;
      acadTitle: string;
      acadTitle2: string;
      info: string;
      position: string;
      department: string;
    };
    en: {
      name: string;
      surname: string;
      patronymic: string;
      degree: string;
      acadTitle: string;
      acadTitle2: string;
      info: string;
      position: string;
      department: string;
    };
  };
}

export const StaffsSchema = SchemaFactory.createForClass(Staff);
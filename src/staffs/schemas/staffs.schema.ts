import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Staff extends Document {
  @Prop({ required: false })
  photo?: string;

  @Prop({ required: false })
  link?: string;

  @Prop({ type: [String], required: true })
  profiles: string[];

  @Prop({
    type: {
      uk: {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        patronymic: { type: String, required: true },
        degree: { type: String, required: false },
        acadTitle: { type: String, required: false },
        position: { type: String, required: true },
        department: { type: String, required: true },
      },
      en: {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        patronymic: { type: String, required: false },
        degree: { type: String, required: false },
        acadTitle: { type: String, required: false },
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
      position: string;
      department: string;
    };
    en: {
      name: string;
      surname: string;
      patronymic: string;
      degree: string;
      acadTitle: string;
      position: string;
      department: string;
    };
  };
}

export const StaffsSchema = SchemaFactory.createForClass(Staff);
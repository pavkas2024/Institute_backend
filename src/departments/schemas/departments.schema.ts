import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Department extends Document {
  @Prop({
    type: {
      uk: {
        title: { type: String, required: true },
        shortTitle: { type: String, required: true },
        head: { type: String, required: true },
        description: { type: String, required: true },
        projects: { type: [String], required: false, default: [] },
      },
      en: {
        title: { type: String, required: true },
        shortTitle: { type: String, required: true },
        head: { type: String, required: true },
        description: { type: String, required: true },
        projects: { type: [String], required: false, default: [] },
      },
    },
    required: true,
  })
  translates: {
    uk: {
      title: string;
      shortTitle: string;
      head: string;
      description: string;
      projects?: string[];
    };
    en: {
      title: string;
      shortTitle: string;
      head: string;
      description: string;
      projects?: string[];
    };
  };

  @Prop({ required: true })
  order: string;

  @Prop({
    required: true,
    enum: ['sci', 'edu', 'pub', 'org', 'fin'],
    type: String,
  })
  role: 'sci' | 'edu' | 'pub' | 'org' | 'fin';
}

export const DepartmentsSchema = SchemaFactory.createForClass(Department);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Journal extends Document{
 
  @Prop({
    type: {
      uk: {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
      en: {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    },
    required: true,
  })
  translates: {
    uk: {
      title: string;
      description: string;
    };
    en: {
      title: string;
      description: string;
    };
  };



  @Prop({ required: true })
  photo: string;

  @Prop({ required: true })
  link: string;
}

export const JournalsSchema = SchemaFactory.createForClass(Journal);
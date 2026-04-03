import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Pagejournal extends Document{
 
  @Prop({
    type: {
      uk: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        editors: { type: String, required: true },
        policy: { type: String, required: true },
        guidelines: { type: String, required: true },
       
      },
      en: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        editors: { type: String, required: true },
        policy: { type: String, required: true },
        guidelines: { type: String, required: true },
      },
    },
    required: true,
  })
  translates: {
    uk: {
        title: string;
        description: string;
        editors: string;
        policy: string;
        guidelines: string;
    };
    en: {
        title: string;
        description: string;
        editors: string;
        policy: string;
        guidelines: string;
    };
  };



  @Prop({ default: '' })
  photo: string;

  @Prop({ required: true })
  link: string;
}

export const PagejournalsSchema = SchemaFactory.createForClass(Pagejournal);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Institutedocument extends Document {
    @Prop({ required: true })
    title: string;
  
    @Prop({ required: true })
    link: string;

}

export const InstitutedocumentsSchema = SchemaFactory.createForClass(Institutedocument);

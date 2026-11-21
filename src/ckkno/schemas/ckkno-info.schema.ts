
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CkknoInfoDocument = HydratedDocument<CkknoInfo>;

@Schema({ _id: false })
export class CkknoTranslation {
  @Prop({ type: String, default: "" })
  description: string;
}

export const CkknoTranslationSchema =
  SchemaFactory.createForClass(CkknoTranslation);

@Schema({ _id: false })
export class CkknoTranslations {
  @Prop({ type: CkknoTranslationSchema, required: true })
  uk: CkknoTranslation;

  @Prop({ type: CkknoTranslationSchema, required: true })
  en: CkknoTranslation;
}

export const CkknoTranslationsSchema =
  SchemaFactory.createForClass(CkknoTranslations);

@Schema({
  collection: "ckkno-info",
  timestamps: true,
})
export class CkknoInfo {
  @Prop({ type: CkknoTranslationsSchema, required: true })
  translates: CkknoTranslations;

  @Prop({ type: String, default: "" })
  orderUrl: string;

  @Prop({ type: String, default: "" })
  regulationsUrl: string;

  @Prop({ type: String, default: "" })
  procedureUrl: string;

  @Prop({ type: String, default: "" })
  developmentPlanUrl: string;

  @Prop({ type: String, default: "" })
  equipmentUrl: string;
}

export const CkknoInfoSchema =
  SchemaFactory.createForClass(CkknoInfo);

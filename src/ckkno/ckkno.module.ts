
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CkknoController } from "./ckkno.controller";
import { CkknoService } from "./ckkno.service";

import {
  CkknoInfo,
  CkknoInfoSchema,
} from "./schemas/ckkno-info.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CkknoInfo.name,
        schema: CkknoInfoSchema,
      },
    ]),
  ],
  controllers: [CkknoController],
  providers: [CkknoService],
})
export class CkknoModule {}

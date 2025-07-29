import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

import { InstitutsController } from './instituts.controller';
import { InstitutsService } from './instituts.service';
import { InstitutsSchema } from './schemas/instituts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Institut', schema: InstitutsSchema }]),
    CloudinaryModule,
  ],
  controllers: [InstitutsController],
  providers: [InstitutsService]
})
export class InstitutsModule {}

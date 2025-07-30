import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

import { IntprojectsController } from './intprojects.controller';
import { IntprojectsService } from './intprojects.service';
import { IntprojectSchema } from './schemas/intprojects.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Intproject', schema: IntprojectSchema }]),
    CloudinaryModule,
  ],
  controllers: [IntprojectsController],
  providers: [IntprojectsService]
})
export class IntprojectsModule {}

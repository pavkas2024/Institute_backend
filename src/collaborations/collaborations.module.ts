import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';


import { CollaborationsController } from './collaborations.controller';
import { CollaborationsService } from './collaborations.service';
import { CollaborationsSchema } from './schemas/collaborations.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Collaboration', schema: CollaborationsSchema }]),
    CloudinaryModule,
  ],
  controllers: [CollaborationsController],
  providers: [CollaborationsService]
})
export class CollaborationsModule {}

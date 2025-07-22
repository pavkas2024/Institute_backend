import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

import { StaffsController } from './staffs.controller';
import { StaffsService } from './staffs.service';
import { StaffsSchema } from './schemas/staffs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Staff', schema: StaffsSchema }]),
    CloudinaryModule,
  ],
  controllers: [StaffsController],
  providers: [StaffsService]
})
export class StaffsModule {}

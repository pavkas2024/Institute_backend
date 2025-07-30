import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

import { NatprojectsController } from './natprojects.controller';
import { NatprojectsService } from './natprojects.service';
import { NatprojectSchema } from './schemas/natprojects.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Natproject', schema: NatprojectSchema }]),
    CloudinaryModule,
  ],
  controllers: [NatprojectsController],
  providers: [NatprojectsService]
})
export class NatprojectsModule {}

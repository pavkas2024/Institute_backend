import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

import { ProcurementsController } from './procurements.controller';
import { ProcurementService } from './procurements.service';
import { ProcurementsSchema } from './schemas/procurements.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Procurement', schema: ProcurementsSchema}]),
    CloudinaryModule,
  ],
  controllers: [ProcurementsController],
  providers: [ProcurementService]
})
export class ProcurementModule {}

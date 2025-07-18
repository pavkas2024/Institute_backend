import { Module } from '@nestjs/common';
import { ProcurementController } from './procurements.controller';
import { ProcurementService } from './procurements.service';

@Module({
  controllers: [ProcurementController],
  providers: [ProcurementService]
})
export class ProcurementModule {}

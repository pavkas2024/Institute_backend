import { Module } from '@nestjs/common';
import { DirectionsController } from './directions.controller';
import { DirectionsService } from './directions.service';

@Module({
  controllers: [DirectionsController],
  providers: [DirectionsService]
})
export class DirectionsModule {}

import { Module } from '@nestjs/common';
import { NatprojectsController } from './natprojects.controller';
import { NatprojectsService } from './natprojects.service';

@Module({
  controllers: [NatprojectsController],
  providers: [NatprojectsService]
})
export class NatprojectsModule {}

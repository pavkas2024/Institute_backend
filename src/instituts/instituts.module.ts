import { Module } from '@nestjs/common';
import { InstitutsController } from './instituts.controller';
import { InstitutsService } from './instituts.service';

@Module({
  controllers: [InstitutsController],
  providers: [InstitutsService]
})
export class InstitutsModule {}

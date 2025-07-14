import { Module } from '@nestjs/common';
import { IntprojectsController } from './intprojects.controller';
import { IntprojectsService } from './intprojects.service';

@Module({
  controllers: [IntprojectsController],
  providers: [IntprojectsService]
})
export class IntprojectsModule {}

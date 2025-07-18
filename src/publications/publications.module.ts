import { Module } from '@nestjs/common';
import { ControllerModule } from './controller/controller.module';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';

@Module({
  imports: [ControllerModule],
  controllers: [PublicationsController],
  providers: [PublicationsService]
})
export class PublicationsModule {}

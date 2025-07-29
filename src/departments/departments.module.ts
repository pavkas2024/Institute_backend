import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { DepartmentsSchema } from './schemas/departments.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Department', schema: DepartmentsSchema}]),
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService]
})
export class DepartmentsModule {}

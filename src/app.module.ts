import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CollaborationsModule } from './collaborations/collaborations.module';
import { ContactsModule } from './contacts/contacts.module';
import { DecisionsModule } from './decisions/decisions.module';
import { DepartmentsModule } from './departments/departments.module';
import { DirectionsModule } from './directions/directions.module';
import { DocumentsModule } from './documents/documents.module';
import { InstitutsModule } from './instituts/instituts.module';
import { IntprojectsModule } from './intprojects/intprojects.module';
import { JournalsModule } from './journals/journals.module';
import { NatprojectsModule } from './natprojects/natprojects.module';
import { NewsModule } from './news/news.module';
import { ProcurementModule } from './procurements/procurements.module';
import { PublicationsModule } from './publications/publications.module';
import { SeminarsModule } from './seminars/seminars.module';
import { StaffsModule } from './staffs/staffs.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    CloudinaryModule,
    CollaborationsModule,
    ContactsModule,
    DecisionsModule,
    DepartmentsModule,
    DirectionsModule,
    DocumentsModule,
    InstitutsModule,
    IntprojectsModule,
    JournalsModule,
    NatprojectsModule,
    NewsModule,
    ProcurementModule,
    PublicationsModule,
    SeminarsModule,
    StaffsModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

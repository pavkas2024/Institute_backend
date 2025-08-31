import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { NotFoundExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  // app.useGlobalFilters(new NotFoundExceptionFilter());

  app.useGlobalPipes(new ValidationPipe());

  // Роздача статичних файлів з папки uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // URL буде починатися з /uploads
  });

  const config = new DocumentBuilder()
    .setTitle('InstituteIASA')
    .setDescription('The InstituteIASA API description')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.getHttpAdapter().get('/', (req, res) => {
    res.send('API is running');
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

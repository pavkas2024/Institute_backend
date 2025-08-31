import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  // Статика
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Middleware для root /
  app.use((req, res, next) => {
    if (req.path === '/') {
      res.send('API is running');
    } else {
      next();
    }
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

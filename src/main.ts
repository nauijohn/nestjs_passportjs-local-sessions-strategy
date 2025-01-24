import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
    }),
  );

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    new Logger('Bootstrap').verbose(`Server is running on port ${PORT}...`);
  });
}
void bootstrap();

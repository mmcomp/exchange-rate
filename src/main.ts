import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('ExchangeRateFinder');
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Exchange Rate Finder Service')
    .setDescription(
      'This is an example project demonstrating how to select an exchange rate provider for a exchanging from one currency to another Service',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  const conf = app.get(ConfigService);
  const port = await conf.get<number>('PORT', 3000);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  logger.log(`RestAPI listening on port [${port}]`);
}
bootstrap();

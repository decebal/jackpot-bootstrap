import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JackpotSDKModule } from './jackpot-sdk.module';

/**
 * Bootstrap the application
 * 
 * This application serves as a demonstration of how to use the
 * Speakeasy-generated SDK for the Jackpot Gateway API
 */
async function bootstrap() {
  const app = await NestFactory.create(JackpotSDKModule);
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Jackpot API SDK Client')
    .setDescription('SDK client for Jackpot Gateway API')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start the server
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Jackpot API SDK Client is running on port ${port}`);
}

bootstrap();

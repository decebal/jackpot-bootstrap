import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { GatewayModule } from './gateway.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  // Following our development standards for validation and error handling
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Add global prefix for API versioning
  app.setGlobalPrefix('api/v1');

  // Configure CORS if needed
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Set up Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Jackpot API')
      .setDescription('The Jackpot B2B platform API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
      .addTag('admin', 'Admin service endpoints')
      .addTag('metrics', 'Metrics service endpoints')
      .addTag('scheduler', 'Scheduler service endpoints')
      .addTag('engine', 'Engine service endpoints')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
    
    console.log('Swagger documentation is available at /api/docs');
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Gateway service is running on port ${port}`);
}

bootstrap();

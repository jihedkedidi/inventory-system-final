import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for the frontend
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization'
  });
  
  app.useGlobalPipes(new ValidationPipe());
  
  const config = new DocumentBuilder()
    .setTitle('Inventory API')
    .setDescription('Inventory Management System API')
    .setVersion('1.0')
    .addTag('products')
    .addTag('variants')
    .addTag('catalogs')
    .addTag('locations')
    .addTag('user-activities')
    .addTag('suppliers')
    .addTag('purchase-orders')
    .addTag('stock-transfers')
    .addTag('users')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Add prefix to all routes
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
}
bootstrap();

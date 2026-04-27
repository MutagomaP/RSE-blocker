import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: process.env.WEB_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('RSE Platform API')
    .setDescription('Rwanda Stock Exchange - Broker to Buyer Platform REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('brokers', 'Broker profiles and management')
    .addTag('securities', 'Listed securities and market data')
    .addTag('orders', 'Buy/sell orders')
    .addTag('trades', 'Executed trades')
    .addTag('portfolio', 'Investor portfolio')
    .addTag('market', 'Market data and statistics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`RSE API running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
  
  // Auto-seed on first run if SEED_ON_START is true
  if (process.env.SEED_ON_START === 'true') {
    console.log('🌱 Running database seed...');
    try {
      const { exec } = require('child_process');
      exec('npm run seed', (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error('Seed error:', error);
          return;
        }
        console.log(stdout);
      });
    } catch (err) {
      console.error('Failed to run seed:', err);
    }
  }
}
bootstrap();

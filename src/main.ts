import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS for specific origins
  app.enableCors({
    origin: ['http://localhost:3000', 'https://your-frontend-domain.com'], // Specify your frontend domain here
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Use Helmet to protect against some well-known web vulnerabilities by setting HTTP headers appropriately
  app.use(helmet());

  // Apply rate limiting to all requests
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //     message: 'Too many requests from this IP, please try again later',
  //   }),
  // );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // ClassSerializerInterceptor : Cet intercepteur transforme automatiquement les objets renvoyés en JSON, en respectant les règles définies par les décorateurs (@Exclude, @Expose, ...)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('The blog API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT', 4000);
  await app.listen(port);
}
bootstrap();

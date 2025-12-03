import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[] = []) => {
        return new BadRequestException({
          message: 'Fill required fields',
          errors: errors.map(err => ({
            field: err.property,
            constraints: err.constraints,
          })),
        });
      },
    }),
  );
  const config = new DocumentBuilder().setTitle('Estate OPS API').setDescription('Real Estate Operations REST API Documentation').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

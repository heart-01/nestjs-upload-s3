import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Test Upload S3')
    .setDescription('example upload file to s3')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('document', app, document);
};

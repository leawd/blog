// swagger.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('API Blog Código Facilito')
    .setDescription('API para implementar CRUD de usuarios y posteos del blog')
    .setVersion('1.0')
    .addTag('api') // Puedes agregar tags para organizar las rutas en la documentación
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();

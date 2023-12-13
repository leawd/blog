import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MyConfigModule } from './config.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Registra el módulo de configuración -----
  app.select(MyConfigModule).get(MyConfigModule);


  // Habilitar Swagger
  const options = new DocumentBuilder()
    .setTitle('Nombre de tu API')
    .setDescription('Descripción de tu API')
    .setVersion('1.0')
    .addTag('api') // Puedes agregar tags para organizar las rutas en la documentación
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);


  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseService } from './infrastructure/db/database.service';
<<<<<<< HEAD
=======
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
>>>>>>> dev

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    const dbService = app.get(DatabaseService);
    await dbService.logStartupConnectionStatus();
  } catch {
    // Ignorar errores de logging de DB en arranque
  }

<<<<<<< HEAD
=======
  const config = new DocumentBuilder()
    .setTitle('HVQ Agendas API')
    .setDescription('Documentación OpenAPI de la API de agendas, catálogos y médicos')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

>>>>>>> dev
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();

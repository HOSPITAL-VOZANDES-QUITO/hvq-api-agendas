import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseService } from './infrastructure/db/database.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { APPVERSION } from './config/version';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    const dbService = app.get(DatabaseService);
    await dbService.logStartupConnectionStatus();
  } catch {
    // Ignorar errores de logging de DB en arranque
  }

  const config = new DocumentBuilder()
    .setTitle('HVQ Agendas API')
    .setDescription('Documentación OpenAPI de la API de agendas, catálogos y médicos')
    .setVersion(APPVERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();

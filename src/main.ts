import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseService } from './infrastructure/db/database.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    const dbService = app.get(DatabaseService);
    await dbService.logStartupConnectionStatus();
  } catch {
    // Ignorar errores de logging de DB en arranque
  }

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();

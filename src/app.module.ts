import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/db/database.module';
import { AgendasModule } from './modules/agendas/agendas.module';
import { CatalogosModule } from './modules/catalogos/catalogos.module';
import { MedicosModule } from './modules/medicos/medicos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    AgendasModule,
    CatalogosModule,
    MedicosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

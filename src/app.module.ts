import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/db/database.module';
import { AgendasModule } from './modules/agendas/agendas.module';
import { CatalogosModule } from './modules/catalogos/catalogos.module';
import { MedicosModule } from './modules/medicos/medicos.module';
<<<<<<< HEAD
=======
import { AgndAgendaModule } from './modules/agnd-agenda/agnd-agenda.module';
>>>>>>> dev

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
<<<<<<< HEAD
=======
    AgndAgendaModule,
>>>>>>> dev
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

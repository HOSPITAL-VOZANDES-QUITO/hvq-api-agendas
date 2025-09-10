import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendasNormalizadasService } from './agendas-normalizadas.service';
import { AgendasNormalizadasController } from './agendas-normalizadas.controller';
import { AgndAgenda } from '../agnd-agenda/agnd-agenda.entity';
import { Consultorio } from '../catalogos/entities/consultorio.entity';
import { Dia } from '../catalogos/entities/dia.entity';
import { Edificio } from '../catalogos/entities/edificio.entity';
import { EdificioPiso } from '../catalogos/entities/edificio-piso.entity';
import { MedicosModule } from '../medicos/medicos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AgndAgenda,
      Consultorio,
      Dia,
      Edificio,
      EdificioPiso,
    ]),
    MedicosModule,
  ],
  controllers: [AgendasNormalizadasController],
  providers: [AgendasNormalizadasService],
})
export class AgendasNormalizadasModule {}

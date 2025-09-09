import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgndAgenda } from './agnd-agenda.entity';
import { AgndAgendaService } from './agnd-agenda.service';
import { AgndAgendaController } from './agnd-agenda.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AgndAgenda])],
  providers: [AgndAgendaService],
  controllers: [AgndAgendaController],
})
export class AgndAgendaModule {}

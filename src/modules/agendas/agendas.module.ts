import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agenda } from './agenda.entity';
import { AgendasService } from './agendas.service';
import { AgendasController } from './agendas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Agenda])],
  providers: [AgendasService],
  controllers: [AgendasController],
})
export class AgendasModule {}

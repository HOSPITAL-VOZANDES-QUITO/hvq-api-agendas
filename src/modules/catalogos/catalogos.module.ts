import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogosController } from './catalogos.controller';
import { CatalogosService } from './catalogos.service';
import { Consultorio } from './entities/consultorio.entity';
import { Dia } from './entities/dia.entity';
import { Edificio } from './entities/edificio.entity';
import { EdificioPiso } from './entities/edificio-piso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultorio, Dia, Edificio, EdificioPiso]),
  ],
  controllers: [CatalogosController],
  providers: [CatalogosService],
})
export class CatalogosModule {}

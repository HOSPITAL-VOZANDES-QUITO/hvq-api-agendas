import { Controller, Get, Query } from '@nestjs/common';
import { AgendasNormalizadasService } from './agendas-normalizadas.service';

@Controller('api/agendas-normalizadas')
export class AgendasNormalizadasController {
  constructor(private readonly service: AgendasNormalizadasService) {}

  @Get()
  findAll(
    @Query('codigo_prestador') codigoPrestador?: number,
    @Query('cd_dia') codigoDia?: number,
  ) {
    return this.service.findAllNormalized({
      codigoPrestador: codigoPrestador ? Number(codigoPrestador) : undefined,
      codigoDia: codigoDia ? Number(codigoDia) : undefined,
    });
  }
}

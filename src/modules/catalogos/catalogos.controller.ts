import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CatalogosService } from './catalogos.service';

@Controller('api/catalogos')
export class CatalogosController {
  constructor(private readonly service: CatalogosService) {}

  @Get('consultorios')
  getConsultorios() {
    return this.service.getConsultorios();
  }

  @Get('dias')
  getDias() {
    return this.service.getDias();
  }

  @Get('edificios')
  getEdificios() {
    return this.service.getEdificios();
  }

  @Get('edificios/:codigo_edificio/pisos')
  getPisosPorEdificio(
    @Param('codigo_edificio', ParseIntPipe) codigoEdificio: number,
  ) {
    return this.service.getPisosPorEdificio(codigoEdificio);
  }
}

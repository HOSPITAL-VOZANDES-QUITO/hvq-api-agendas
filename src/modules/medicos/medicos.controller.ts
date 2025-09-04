import { Controller, Get, Param, Query } from '@nestjs/common';
import { MedicosService } from './medicos.service';

@Controller('api/medicos')
export class MedicosController {
  constructor(private readonly service: MedicosService) {}

  @Get()
  getMedicos(@Query('situationType') situationType?: string) {
    return this.service.getMedicos({
      situationType: situationType || 'ACTIVE',
    });
  }

  @Get('especialidades')
  getEspecialidades() {
    return this.service.getEspecialidades();
  }

  @Get('especialidad/:especialidad')
  getByEspecialidad(@Param('especialidad') especialidad: string) {
    return this.service.getMedicosByEspecialidad(especialidad);
  }

  @Get('item/:codigo_item')
  getByItem(@Param('codigo_item') codigoItem: string) {
    return this.service.getMedicosByCodigoItem(codigoItem);
  }

  @Get('nombre/:nombre')
  getByNombre(@Param('nombre') nombre: string) {
    return this.service.getMedicosByNombre(nombre);
  }

  @Get('estadisticas')
  getEstadisticas() {
    return this.service.getEstadisticasMedicos();
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AgendasService } from './agendas.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';

@Controller('api/agendas')
export class AgendasController {
  constructor(private readonly agendasService: AgendasService) {}

  @Get()
  findAll() {
    return this.agendasService.findAll();
  }

  @Get('estadisticas')
  getStats() {
    return this.agendasService.getStatistics();
  }

  @Get('prestador/:codigo_prestador')
  findByProvider(
    @Param('codigo_prestador', ParseIntPipe)
    codigoPrestador: number,
  ) {
    return this.agendasService.findByProvider(codigoPrestador);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.agendasService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAgendaDto) {
    return this.agendasService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAgendaDto) {
    return this.agendasService.update(id, dto);
  }

  @Put(':id/cancelar')
  cancel() {
    return this.agendasService.cancel();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.agendasService.remove(id);
  }
}

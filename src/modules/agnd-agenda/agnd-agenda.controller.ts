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
import { AgndAgendaService } from './agnd-agenda.service';
import { CreateAgndAgendaDto } from './dto/create-agnd-agenda.dto';
import { UpdateAgndAgendaDto } from './dto/update-agnd-agenda.dto';

@Controller('api/agnd-agenda')
export class AgndAgendaController {
  constructor(private readonly service: AgndAgendaService) {}

  @Get()
  listar() {
    return this.service.findAll();
  }

  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  crear(@Body() dto: CreateAgndAgendaDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAgndAgendaDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgndAgenda } from './agnd-agenda.entity';
import { CreateAgndAgendaDto } from './dto/create-agnd-agenda.dto';
import { UpdateAgndAgendaDto } from './dto/update-agnd-agenda.dto';

@Injectable()
export class AgndAgendaService {
  constructor(
    @InjectRepository(AgndAgenda)
    private readonly repo: Repository<AgndAgenda>,
  ) {}

  private assertPayload(dto: CreateAgndAgendaDto | UpdateAgndAgendaDto, isUpdate = false) {
    const errors: string[] = [];
    const isPositive = (v: unknown) => typeof v === 'number' && v > 0;
    if (!isUpdate) {
      if (!isPositive(dto.codigo_consultorio)) errors.push('CD_CONSULTORIO requerido y positivo');
      if (!isPositive(dto.codigo_prestador)) errors.push('CD_PRESTADOR requerido y positivo');
      if (!isPositive(dto.codigo_item_agendamiento)) errors.push('CD_ITEM_AGENDAMENTO requerido y positivo');
      if (!isPositive(dto.codigo_dia)) errors.push('CD_DIA requerido y positivo');
      if (!dto.hora_inicio) errors.push('HORA_INICIO requerida');
      if (!dto.hora_fin) errors.push('HORA_FIN requerida');
      if (dto.tipo !== undefined && String(dto.tipo).trim() === '') errors.push('TIPO requerido');
    }
    if (errors.length) throw new BadRequestException(errors);
  }

  async findAll() {
    const items = await this.repo.find({ order: { codigoAgenda: 'ASC' } });
    return { data: items, total: items.length, message: 'Agendas personalizadas obtenidas' };
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { codigoAgenda: id } });
    if (!found) throw new NotFoundException('AGND_AGENDA');
    return { data: found };
  }

  async create(dto: CreateAgndAgendaDto) {
    this.assertPayload(dto, false);
    // Obtener NEXTVAL de secuencia si existe, si no, usar MAX+1 como fallback
    let nextId: number | null = null;
    try {
      const schema = this.repo.metadata.schema || undefined;
      const seq = process.env.AGND_AGENDA_SEQUENCE || 'SEQ_AGND_AGENDA';
      const qualified = schema ? `${schema}.${seq}` : seq;
      const res = await this.repo.query(`SELECT ${qualified}.NEXTVAL AS ID FROM DUAL`);
      nextId = Number(res?.[0]?.ID ?? res?.[0]?.id ?? null);
    } catch {
      const table = this.repo.metadata.tableName;
      const res = await this.repo.query(`SELECT NVL(MAX(CD_AGENDA),0)+1 AS ID FROM ${table}`);
      nextId = Number(res?.[0]?.ID ?? res?.[0]?.id ?? 1);
    }

    const entity = this.repo.create({
      codigoAgenda: nextId!,
      codigoConsultorio: dto.codigo_consultorio,
      codigoPrestador: dto.codigo_prestador,
      codigoItemAgendamiento: dto.codigo_item_agendamiento,
      codigoDia: dto.codigo_dia,
      horaInicio: new Date(dto.hora_inicio),
      horaFin: new Date(dto.hora_fin),
      tipo: dto.tipo ? String(dto.tipo).trim().toUpperCase().slice(0, 1) : null,
    });
    await this.repo.save(entity);
    return { message: 'Registro creado en AGND_AGENDA' };
  }

  async update(id: number, dto: UpdateAgndAgendaDto) {
    const existing = await this.repo.findOne({ where: { codigoAgenda: id } });
    if (!existing) throw new NotFoundException('AGND_AGENDA');
    this.assertPayload(dto, true);
    if (dto.codigo_consultorio !== undefined) existing.codigoConsultorio = dto.codigo_consultorio;
    if (dto.codigo_prestador !== undefined) existing.codigoPrestador = dto.codigo_prestador;
    if (dto.codigo_item_agendamiento !== undefined) existing.codigoItemAgendamiento = dto.codigo_item_agendamiento;
    if (dto.codigo_dia !== undefined) existing.codigoDia = dto.codigo_dia;
    if (dto.hora_inicio !== undefined) existing.horaInicio = new Date(dto.hora_inicio);
    if (dto.hora_fin !== undefined) existing.horaFin = new Date(dto.hora_fin);
    if (dto.tipo !== undefined) existing.tipo = String(dto.tipo).trim().toUpperCase().slice(0, 1);
    await this.repo.save(existing);
    return { message: 'Registro actualizado en AGND_AGENDA' };
  }

  async remove(id: number) {
    const existing = await this.repo.findOne({ where: { codigoAgenda: id } });
    if (!existing) throw new NotFoundException('AGND_AGENDA');
    await this.repo.delete({ codigoAgenda: id });
    return { message: 'Registro eliminado de AGND_AGENDA' };
  }
}



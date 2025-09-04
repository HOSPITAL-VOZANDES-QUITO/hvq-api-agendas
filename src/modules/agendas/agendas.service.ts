import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agenda } from './agenda.entity';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';

@Injectable()
export class AgendasService {
  constructor(
    @InjectRepository(Agenda)
    private readonly agendaRepository: Repository<Agenda>,
  ) {}

  async findAll(): Promise<Agenda[]> {
    return this.agendaRepository.find({ order: { startAt: 'ASC' } });
  }

  async findOne(id: number): Promise<Agenda> {
    const agenda = await this.agendaRepository.findOne({ where: { id } });
    if (!agenda) {
      throw new NotFoundException('Agenda no encontrada');
    }
    return agenda;
  }

  async create(dto: CreateAgendaDto): Promise<Agenda> {
    const entity = this.agendaRepository.create({
      providerCode: dto.providerCode,
      startAt: new Date(`${dto.date} ${dto.time}`),
      endAt: new Date(`${dto.date} ${dto.time}`),
    });
    return this.agendaRepository.save(entity);
  }

  async update(id: number, dto: UpdateAgendaDto): Promise<boolean> {
    const agenda = await this.findOne(id);
    if (dto.providerCode !== undefined) agenda.providerCode = dto.providerCode;

    if (dto.date !== undefined || dto.time !== undefined) {
      const date = dto.date ?? agenda.startAt.toISOString().slice(0, 10);
      const time =
        dto.time ?? new Date(agenda.startAt).toISOString().slice(11, 16);
      agenda.startAt = new Date(`${date} ${time}`);
      agenda.endAt = new Date(`${date} ${time}`);
    }

    await this.agendaRepository.save(agenda);
    return true;
  }

  async remove(id: number): Promise<boolean> {
    await this.findOne(id);
    await this.agendaRepository.delete(id);
    return true;
  }

  async findByProvider(providerCode: number): Promise<Agenda[]> {
    return this.agendaRepository.find({
      where: { providerCode },
      order: { startAt: 'ASC' },
    });
  }

  async cancel(): Promise<boolean> {
    // La tabla AGND_AGENDA no tiene campo ESTADO en tu SQL original
    return Promise.resolve(true);
  }

  async getStatistics(): Promise<{
    total_agendas: number;
    por_prestador: Record<string, number>;
    por_fecha: Record<string, number>;
  }> {
    const agendas = await this.findAll();
    const por_prestador: Record<string, number> = {};
    const por_fecha: Record<string, number> = {};

    for (const a of agendas) {
      const prestadorKey = String(a.providerCode);
      por_prestador[prestadorKey] = (por_prestador[prestadorKey] ?? 0) + 1;
      const dateKey = a.startAt.toISOString().slice(0, 10);
      por_fecha[dateKey] = (por_fecha[dateKey] ?? 0) + 1;
    }

    return {
      total_agendas: agendas.length,
      por_prestador,
      por_fecha,
    };
  }
}

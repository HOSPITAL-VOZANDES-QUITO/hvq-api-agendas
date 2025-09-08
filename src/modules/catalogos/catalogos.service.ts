import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultorio } from './entities/consultorio.entity';
import { Dia } from './entities/dia.entity';
import { Edificio } from './entities/edificio.entity';
import { EdificioPiso } from './entities/edificio-piso.entity';

@Injectable()
export class CatalogosService {
  constructor(
    @InjectRepository(Consultorio)
    private readonly consultorioRepo: Repository<Consultorio>,
    @InjectRepository(Dia)
    private readonly diaRepo: Repository<Dia>,
    @InjectRepository(Edificio)
    private readonly edificioRepo: Repository<Edificio>,
    @InjectRepository(EdificioPiso)
    private readonly edificioPisoRepo: Repository<EdificioPiso>,
  ) {}

  async getConsultorios() {
    const list = await this.consultorioRepo.find({
      order: { codigoConsultorio: 'ASC' },
    });
    return list.map((c) => ({
      codigo_consultorio: c.codigoConsultorio,
      descripcion_consultorio: c.descripcionConsultorio,
      codigo_edificio: c.codigoEdificio,
      codigo_piso: c.codigoPiso,
    }));
  }

  async getDias() {
    const list = await this.diaRepo.find({ order: { codigoDia: 'ASC' } });
    return list.map((d) => ({
      codigo_dia: d.codigoDia,
      descripcion_dia: d.descripcionDia,
    }));
  }

  async getEdificios() {
    const list = await this.edificioRepo.find({
      order: { codigoEdificio: 'ASC' },
    });
    return list.map((e) => ({
      codigo_edificio: e.codigoEdificio,
      descripcion_edificio: e.descripcionEdificio,
    }));
  }

  async getPisosPorEdificio(codigoEdificio: number) {
    const list = await this.edificioPisoRepo.find({
      where: { codigoEdificio },
      order: { codigoPiso: 'ASC' },
    });
    return list.map((p) => ({
      codigo_piso: p.codigoPiso,
      codigo_edificio: p.codigoEdificio,
      descripcion_piso: p.descripcionPiso,
    }));
  }
}

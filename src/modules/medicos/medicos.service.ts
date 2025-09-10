import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import { ExternalAuthService } from './external-auth.service';

type StringLike = string | number;

export interface ExternalMedico {
  especialidad?: string;
  especialidadNombre?: string;
  descripcion_agendamiento?: string;
  descripcionEspecialidad?: string;
  specialty?: string;
  codigoPrestador?: StringLike;
  codigo_prestador?: StringLike;
  cd_prestador?: StringLike;
  providerId?: StringLike;
  id?: StringLike;
  nombre?: string;
  nombreMedico?: string;
  nm_prestador?: string;
  nombrePrestador?: string;
  name?: string;
  fullName?: string;
  codigoItem?: StringLike;
  codigo_item?: StringLike;
  cd_item_agendamento?: StringLike;
  codigoItemAgendamiento?: StringLike;
  itemCode?: StringLike;
  retrato?: string;
}

export interface ExternalEspecialidad {
  descripcion?: string;
  nombre?: string;
  name?: string;
  description?: string;o
  iconUrl?: string;
}

@Injectable()
export class MedicosService {
  private readonly http: AxiosInstance;
  private readonly baseUrl: string;
  private readonly medicosPath: string;
  private readonly especialidadesPath: string;

  constructor(
    private readonly config: ConfigService,
    private readonly auth: ExternalAuthService,
  ) {
    this.baseUrl =
      this.config.get<string>('EXTERNAL_API_BASE_URL') ?? '';
    this.medicosPath =
      this.config.get<string>('EXTERNAL_MEDICOS_ENDPOINT') || '/medico';
    this.especialidadesPath = '/especialidades/agenda';
    this.http = axios.create({ baseURL: this.baseUrl, timeout: 10000 });
  }

  private async authHeaders(): Promise<Record<string, string>> {
    const token = await this.auth.getToken();
    return { Authorization: `Bearer ${token}` };
  }

  async getMedicos(
    params?: Record<string, string>,
  ): Promise<ExternalMedico[] | unknown> {
    const response = await this.http.get(this.medicosPath, {
      params: { situationType: 'ACTIVE', ...params },
      headers: await this.authHeaders(),
    });
    return response.data;
  }

  async getEspecialidades(): Promise<ExternalEspecialidad[] | unknown> {
    const response = await this.http.get(this.especialidadesPath, {
      headers: await this.authHeaders(),
    });
    return response.data;
  }

  async getMedicosByEspecialidad(especialidad: string): Promise<unknown> {
    const data = (await this.getMedicos()) as ExternalMedico[];
    return data.filter((m: ExternalMedico) =>
      [
        m.especialidad,
        m.especialidadNombre,
        m.descripcion_agendamiento,
        m.descripcionEspecialidad,
        m.specialty,
      ]
        .filter(Boolean)
        .some((v) =>
          String(v as StringLike)
            .toLowerCase()
            .includes(especialidad.toLowerCase()),
        ),
    );
  }

  async getMedicosByCodigoItem(codigoItem: string): Promise<unknown> {
    const data = (await this.getMedicos()) as ExternalMedico[];
    return data.filter((m: ExternalMedico) =>
      [
        m.codigoItem,
        m.codigo_item,
        m.cd_item_agendamento,
        m.codigoItemAgendamiento,
        m.itemCode,
      ]
        .filter(Boolean)
        .some((v) => String(v as StringLike) === String(codigoItem)),
    );
  }

  async getMedicosByNombre(nombre: string): Promise<unknown> {
    const data = (await this.getMedicos()) as ExternalMedico[];
    return data.filter((m: ExternalMedico) =>
      [
        m.nombre,
        m.nombreMedico,
        m.nm_prestador,
        m.nombrePrestador,
        m.name,
        m.fullName,
      ]
        .filter(Boolean)
        .some((v) =>
          String(v as StringLike)
            .toLowerCase()
            .includes(nombre.toLowerCase()),
        ),
    );
  }

  async getEstadisticasMedicos(): Promise<unknown> {
    const medicos = (await this.getMedicos()) as ExternalMedico[];
    const especialidades =
      (await this.getEspecialidades()) as ExternalEspecialidad[];
    const medicosPorEspecialidad = medicos.reduce<Record<string, number>>(
      (acc, m: ExternalMedico) => {
        const esp =
          m.especialidad ||
          m.especialidadNombre ||
          m.descripcion_agendamiento ||
          m.descripcionEspecialidad ||
          'Sin especialidad';
        acc[esp] = (acc[esp] ?? 0) + 1;
        return acc;
      },
      {},
    );
    const codigos = medicos
      .map(
        (m: ExternalMedico) =>
          m.codigoPrestador ||
          m.codigo_prestador ||
          m.cd_prestador ||
          m.providerId ||
          m.id,
      )
      .filter(Boolean);
    const unicos = new Set(codigos);
    return {
      total_medicos: unicos.size,
      total_especialidades: Array.isArray(especialidades)
        ? especialidades.length
        : 0,
      total_combinaciones: medicos.length,
      medicos_por_especialidad: medicosPorEspecialidad,
      especialidades_disponibles: Array.isArray(especialidades)
        ? especialidades.map(
            (e: ExternalEspecialidad) =>
              e.descripcion || e.nombre || e.name || e.description || '',
          )
        : [],
    };
  }
}

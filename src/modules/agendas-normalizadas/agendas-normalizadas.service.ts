import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AgndAgenda } from '../agnd-agenda/agnd-agenda.entity';
import { Consultorio } from '../catalogos/entities/consultorio.entity';
import { Dia } from '../catalogos/entities/dia.entity';
import { Edificio } from '../catalogos/entities/edificio.entity';
import { EdificioPiso } from '../catalogos/entities/edificio-piso.entity';
import {
  AgendaNormalizadaDto,
  ConsultorioDto,
  DiaDto,
  EspecialidadDto,
  MedicoDto,
} from './dto/agenda-normalizada.dto';
import { MedicosService, ExternalMedico, ExternalEspecialidad } from '../medicos/medicos.service';

type Filters = {
  codigoPrestador?: number;
  codigoDia?: number;
};

@Injectable()
export class AgendasNormalizadasService {
  constructor(
    @InjectRepository(AgndAgenda)
    private readonly agendaRepo: Repository<AgndAgenda>,
    @InjectRepository(Consultorio)
    private readonly consultorioRepo: Repository<Consultorio>,
    @InjectRepository(Dia)
    private readonly diaRepo: Repository<Dia>,
    @InjectRepository(Edificio)
    private readonly edificioRepo: Repository<Edificio>,
    @InjectRepository(EdificioPiso)
    private readonly pisoRepo: Repository<EdificioPiso>,
    private readonly medicosService: MedicosService,
  ) {}

  async findAllNormalized(filters: Filters): Promise<AgendaNormalizadaDto[]> {
    const where: any = {};
    if (filters.codigoPrestador !== undefined) {
      where.codigoPrestador = filters.codigoPrestador;
    }
    if (filters.codigoDia !== undefined) {
      where.codigoDia = filters.codigoDia;
    }

    const agendas = await this.agendaRepo.find({
      where,
      order: { horaInicio: 'ASC' },
    });

    if (agendas.length === 0) return [];

    // Claves únicas para batch fetching
    const consultorioIds = Array.from(
      new Set(agendas.map((a) => a.codigoConsultorio)),
    );
    const diaIds = Array.from(new Set(agendas.map((a) => a.codigoDia)));

    const [consultorios, dias] = await Promise.all([
      this.consultorioRepo.find({ where: { codigoConsultorio: In(consultorioIds) } }),
      this.diaRepo.find({ where: { codigoDia: In(diaIds) } }),
    ]);

    // Mapas de acceso rápido
    const consultorioById = new Map<number, Consultorio>(
      consultorios.map((c) => [c.codigoConsultorio, c]),
    );
    const diaById = new Map<number, Dia>(dias.map((d) => [d.codigoDia, d]));

    // Preparar combos de (edificio, piso) a cargar
    const pisoCombos = Array.from(
      new Set(
        consultorios.map((c) => `${c.codigoEdificio}:${c.codigoPiso}`),
      ),
    ).map((s) => {
      const [e, p] = s.split(':').map((n) => Number(n));
      return { codigoEdificio: e, codigoPiso: p };
    });
    const edificioIds = Array.from(
      new Set(consultorios.map((c) => c.codigoEdificio)),
    );

    // Cargar pisos y edificios
    const [pisos, edificios] = await Promise.all([
      this.pisoRepo.find({
        where: pisoCombos.map((pc) => ({
          codigoEdificio: pc.codigoEdificio,
          codigoPiso: pc.codigoPiso,
        })),
      }),
      this.edificioRepo.find({ where: { codigoEdificio: In(edificioIds) } }),
    ]);
    const pisoKey = (e: number, p: number) => `${e}:${p}`;
    const pisoByKey = new Map<string, EdificioPiso>(
      pisos.map((p) => [pisoKey(p.codigoEdificio, p.codigoPiso), p]),
    );
    const edificioById = new Map<number, Edificio>(
      edificios.map((e) => [e.codigoEdificio, e]),
    );

    // Cargar médicos y especialidades del middleware (una sola vez)
    const [medicos, especialidades] = await Promise.all([
      this.medicosService.getMedicos(),
      this.medicosService.getEspecialidades(),
    ]);

    // Indexar médicos por posibles claves
    const medicoIndex = new Map<string, ExternalMedico[]>();
    if (Array.isArray(medicos)) {
      for (const m of medicos as ExternalMedico[]) {
        const keys = [
          m.codigoPrestador,
          m.codigo_prestador,
          m.cd_prestador,
          m.providerId,
          m.id,
        ]
          .filter((v) => v !== undefined && v !== null)
          .map((v) => String(v));
        for (const k of keys) {
          const arr = medicoIndex.get(k) ?? [];
          arr.push(m);
          medicoIndex.set(k, arr);
        }
      }
    }

    // Indexar especialidades por descripción para matching por texto
    const espeByDescLc = new Map<string, ExternalEspecialidad>();
    const espeList: ExternalEspecialidad[] = Array.isArray(especialidades)
      ? (especialidades as ExternalEspecialidad[])
      : [];
    for (const e of espeList) {
      const d =
        e.descripcion || e.nombre || e.name || e.description || '';
      if (d) espeByDescLc.set(d.toLowerCase(), e);
    }

    const toHHMM = (d: Date) => {
      const iso = new Date(d).toISOString();
      return iso.slice(11, 16);
    };

    const normalizeMedico = (m?: ExternalMedico | null): MedicoDto | null => {
      if (!m) return null;
      const id =
        m.codigoPrestador ??
        m.codigo_prestador ??
        m.cd_prestador ??
        m.providerId ??
        m.id ??
        null;
      const nombres =
        m.nombre ??
        m.nombreMedico ??
        m.nm_prestador ??
        m.nombrePrestador ??
        m.name ??
        m.fullName ??
        null;
        
      const retrato =
        m.retrato ??
        null;

      return { id: id as any, nombres, retrato };
    };

    const normalizeEspecialidad = (
      a: AgndAgenda,
      m?: ExternalMedico | null,
    ): EspecialidadDto | null => {
      const descr =
        (m?.especialidad ||
          m?.especialidadNombre ||
          m?.descripcion_agendamiento ||
          m?.descripcionEspecialidad ||
          m?.specialty ||
          null) ?? null;

      // Buscar objeto de especialidad por descripción para obtener icono
      const eObj = descr ? espeByDescLc.get(String(descr).toLowerCase()) : undefined;
      const especialidadId =
        (eObj as any)?.id ??
        (m?.codigoItem ??
          m?.codigo_item ??
          m?.cd_item_agendamento ??
          m?.codigoItemAgendamiento ??
          m?.itemCode ??
          a.codigoItemAgendamiento ??
          null) ?? null;

      // NUEVO: icono desde el objeto de especialidad 
      const icono = eObj?.iconUrl || null;

      return {
        especialidadId: especialidadId as any,
        descripcion: (descr as any) ?? null,
        icono,
      };
    };

    // Ensamblado final
    const result: AgendaNormalizadaDto[] = agendas.map((a) => {
      const c = consultorioById.get(a.codigoConsultorio);
      const d = diaById.get(a.codigoDia);

      let consultorio: ConsultorioDto | null = null;
      if (c) {
        const piso = pisoByKey.get(pisoKey(c.codigoEdificio, c.codigoPiso));
        const edificio = edificioById.get(c.codigoEdificio);
        consultorio = {
          idConsultorio: c.codigoConsultorio,
          descripcionConsultorio: c.descripcionConsultorio,
          piso: piso
            ? {
                idPiso: piso.codigoPiso,
                descripcionPiso: piso.descripcionPiso,
              }
            : { idPiso: c.codigoPiso, descripcionPiso: '' },
          edificio: edificio
            ? {
                idEdificio: edificio.codigoEdificio,
                descripcionEdificio: edificio.descripcionEdificio,
              }
            : { idEdificio: c.codigoEdificio, descripcionEdificio: '' },
        };
      }

      const dia: DiaDto | null = d
        ? { idDia: d.codigoDia, descripcionDia: d.descripcionDia }
        : null;

      const medicoCandidates =
        medicoIndex.get(String(a.codigoPrestador)) ?? [];
      const medico = normalizeMedico(medicoCandidates[0] ?? null);

      const especialidad = normalizeEspecialidad(
        a,
        medicoCandidates[0] ?? null,
      );

      return {
        agendaId: a.codigoAgenda,
        horaInicio: toHHMM(a.horaInicio),
        horaFin: toHHMM(a.horaFin),
        tipo: a.tipo ?? null,
        consultorio,
        dia,
        medico,
        especialidad,
      };
    });

    return result;
  }
}

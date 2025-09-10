export interface PisoDto {
  idPiso: number;
  descripcionPiso: string;
}

export interface EdificioDto {
  idEdificio: number;
  descripcionEdificio: string;
}

export interface ConsultorioDto {
  idConsultorio: number;
  descripcionConsultorio: string;
  piso: PisoDto;
  edificio: EdificioDto;
}

export interface DiaDto {
  idDia: number;
  descripcionDia: string;
}

export interface MedicoDto {
  id: number | string | null;
  nombres: string | null;
  retrato: string | null;
}

export interface EspecialidadDto {
  especialidadId: number | string | null;
  descripcion: string | null;
  icono: string | null;
}

export interface AgendaNormalizadaDto {
  agendaId: number;
  horaInicio: string; // HH:MM
  horaFin: string;    // HH:MM
  tipo: string | null;
  consultorio: ConsultorioDto | null;
  dia: DiaDto | null;
  medico: MedicoDto | null;
  especialidad: EspecialidadDto | null;
}

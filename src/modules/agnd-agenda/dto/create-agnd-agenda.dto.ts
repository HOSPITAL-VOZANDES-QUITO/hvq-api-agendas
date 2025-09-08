import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CreateAgndAgendaDto {
  @IsNumber()
  codigo_consultorio!: number;

  @IsNumber()
  codigo_prestador!: number;

  @IsNumber()
  codigo_item_agendamiento!: number;

  @IsNumber()
  codigo_dia!: number;

  @IsString()
  @IsNotEmpty()
  // 'YYYY-MM-DD HH:MM'
  @Matches(/^\d{4}-\d{2}-\d{2}\s([0-1]?\d|2[0-3]):[0-5]\d$/)
  hora_inicio!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}\s([0-1]?\d|2[0-3]):[0-5]\d$/)
  hora_fin!: string;

  @IsString()
  @Matches(/^[A-Za-z]?$/)
  tipo?: string;
}



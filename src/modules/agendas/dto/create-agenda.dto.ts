import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
} from 'class-validator';

export enum AgendaStatus {
  DISPONIBLE = 'DISPONIBLE',
  OCUPADO = 'OCUPADO',
  CANCELADO = 'CANCELADO',
}

export class CreateAgendaDto {
  @ApiProperty()
  @IsNumber()
  providerCode!: number;

  @ApiProperty({ description: 'Fecha en formato YYYY-MM-DD' })
  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @ApiProperty({ description: 'Hora en formato HH:MM' })
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  time!: string;

  @ApiProperty({ enum: AgendaStatus, required: false })
  @IsOptional()
  @IsEnum(AgendaStatus)
  status?: AgendaStatus;
}

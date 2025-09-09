import { PartialType } from '@nestjs/mapped-types';
import { CreateAgndAgendaDto } from './create-agnd-agenda.dto';

export class UpdateAgndAgendaDto extends PartialType(CreateAgndAgendaDto) {}



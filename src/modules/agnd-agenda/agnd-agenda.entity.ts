import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'AGND_AGENDA' })
export class AgndAgenda {
  @PrimaryColumn({ name: 'CD_AGENDA', type: 'number' })
  codigoAgenda!: number;

  @Column({ name: 'CD_CONSULTORIO', type: 'number' })
  codigoConsultorio!: number;

  @Column({ name: 'CD_PRESTADOR', type: 'number' })
  codigoPrestador!: number;

  @Column({ name: 'CD_ITEM_AGENDAMENTO', type: 'number' })
  codigoItemAgendamiento!: number;

  @Column({ name: 'CD_DIA', type: 'number' })
  codigoDia!: number;

  @Column({ name: 'HORA_INICIO', type: 'date' })
  horaInicio!: Date;

  @Column({ name: 'HORA_FIN', type: 'date' })
  horaFin!: Date;

  @Column({ name: 'TIPO', type: 'varchar2', length: 1, nullable: true })
  tipo?: string | null;
}



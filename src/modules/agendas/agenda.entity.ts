import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'AGND_AGENDA' })
export class Agenda {
  @PrimaryColumn({ name: 'CD_AGENDA', type: 'number' })
  id!: number;

  @Column({ name: 'CD_PRESTADOR', type: 'number' })
  providerCode!: number;

  @Column({ name: 'HORA_INICIO', type: 'date' })
  startAt!: Date;

  @Column({ name: 'HORA_FIN', type: 'date' })
  endAt!: Date;

  @Column({ name: 'TIPO', type: 'varchar2', length: 1, nullable: true })
  type?: string | null;
}

import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'AGND_DIA' })
export class Dia {
  @PrimaryColumn({ name: 'CD_DIA', type: 'number' })
  codigoDia!: number;

  @Column({ name: 'DES_DIA', type: 'varchar2', length: 100 })
  descripcionDia!: string;
}

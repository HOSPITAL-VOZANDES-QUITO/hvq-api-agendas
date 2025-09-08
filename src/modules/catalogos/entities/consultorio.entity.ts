import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'AGND_CONSULTORIO' })
export class Consultorio {
  @PrimaryColumn({ name: 'CD_CONSULTORIO', type: 'number' })
  codigoConsultorio!: number;

  @Column({ name: 'DES_CONSULTORIO', type: 'varchar2', length: 255 })
  descripcionConsultorio!: string;

  @Column({ name: 'CD_EDIFICIO', type: 'number' })
  codigoEdificio!: number;

  @Column({ name: 'CD_PISO', type: 'number' })
  codigoPiso!: number;
}

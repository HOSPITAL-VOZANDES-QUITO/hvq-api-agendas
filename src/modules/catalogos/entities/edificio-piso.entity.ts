import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'AGND_EDIFICIO_PISO' })
export class EdificioPiso {
  @PrimaryColumn({ name: 'CD_PISO', type: 'number' })
  codigoPiso!: number;

  @Column({ name: 'CD_EDIFICIO', type: 'number' })
  codigoEdificio!: number;

  @Column({ name: 'DES_PISO', type: 'varchar2', length: 255 })
  descripcionPiso!: string;
}

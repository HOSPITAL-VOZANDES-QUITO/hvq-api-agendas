import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'AGND_EDIFICIO' })
export class Edificio {
  @PrimaryColumn({ name: 'CD_EDIFICIO', type: 'number' })
  codigoEdificio!: number;

  @Column({ name: 'DES_EDIFICIO', type: 'varchar2', length: 255 })
  descripcionEdificio!: string;
}

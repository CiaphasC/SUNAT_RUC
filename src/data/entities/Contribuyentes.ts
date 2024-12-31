import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('Contribuyentes')
export class Contribuyentes {
   @PrimaryColumn({ name: 'RUC', length: 15 })
   RUC: string = "";

   @Column({ name: 'NOMBRE_O_RAZON_SOCIAL', length: 300 })
   NOMBRE_O_RAZON_SOCIAL: string = "";

   @Column({ name: 'ESTADO_DEL_CONTRIBUYENTE', length: 50 })
   ESTADO_DEL_CONTRIBUYENTE: string = "";

   @Column({ name: 'CONDICION_DE_DOMICILIO', length: 60 })
   CONDICION_DE_DOMICILIO: string = "";

   @Column({ name: 'UBIGEO', length: 50 })
   UBIGEO: string = "";

   @Column({ name: 'TIPO_DE_VIA', length: 50, nullable: true })
   TIPO_DE_VIA: string = "";

   @Column({ name: 'NOMBRE_DE_VIA', length: 255, nullable: true })
   NOMBRE_DE_VIA: string = "";

   @Column({ name: 'CODIGO_DE_ZONA', length: 50, nullable: true })
   CODIGO_DE_ZONA: string = "";

   @Column({ name: 'TIPO_DE_ZONA', length: 55, nullable: true })
   TIPO_DE_ZONA: string = "";

   @Column({ name: 'NUMERO', length: 20, nullable: true })
   NUMERO: string = "";

   @Column({ name: 'INTERIOR', length: 20, nullable: true })
   INTERIOR: string = "";

   @Column({ name: 'LOTE', length: 20, nullable: true })
   LOTE: string = "";

   @Column({ name: 'DEPARTAMENTO', length: 20, nullable: true })
   DEPARTAMENTO: string = "";

   @Column({ name: 'MANZANA', length: 20, nullable: true })
   MANZANA: string = "";

   @Column({ name: 'KILOMETRO', length: 20, nullable: true })
   KILOMETRO: string = "";
}

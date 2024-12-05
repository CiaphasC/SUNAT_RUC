import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('Contribuyentes')
export class RecordEntity {
   @PrimaryColumn({ name: 'RUC', length: 15 })
   ruc: string = "";

   @Column({ name: 'NOMBRE_O_RAZON_SOCIAL', length: 300 })
   nombreRazonSocial: string = "";

   @Column({ name: 'ESTADO_DEL_CONTRIBUYENTE', length: 50 })
   estadoContribuyente: string = "";

   @Column({ name: 'CONDICION_DE_DOMICILIO', length: 60 })
   condicionDomicilio: string = "";

   @Column({ name: 'UBIGEO', length: 50 })
   ubigeo: string = "";

   @Column({ name: 'TIPO_DE_VIA', length: 50, nullable: true })
   tipoVia: string = "";

   @Column({ name: 'NOMBRE_DE_VIA', length: 255, nullable: true })
   nombreVia: string = "";

   @Column({ name: 'CODIGO_DE_ZONA', length: 50, nullable: true })
   codigoZona: string = "";

   @Column({ name: 'TIPO_DE_ZONA', length: 55, nullable: true })
   tipoZona: string = "";

   @Column({ name: 'NUMERO', length: 20, nullable: true })
   numero: string = "";

   @Column({ name: 'INTERIOR', length: 20, nullable: true })
   interior: string = "";

   @Column({ name: 'LOTE', length: 20, nullable: true })
   lote: string = "";

   @Column({ name: 'DEPARTAMENTO', length: 20, nullable: true })
   departamento: string = "";

   @Column({ name: 'MANZANA', length: 20, nullable: true })
   manzana: string = "";

   @Column({ name: 'KILOMETRO', length: 20, nullable: true })
   kilometro: string = "";
}

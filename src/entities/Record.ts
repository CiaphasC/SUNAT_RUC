// src/entities/Contribuyente.ts
import {Entity, PrimaryColumn, Column} from 'typeorm';
@Entity('Contribuyentes')
export class Record {
   @PrimaryColumn({ length: 11 })
   ruc:string="";

   @Column({ length: 255 })
   nombreRazonSocial:string="";

   @Column({ length: 20 })
   estadoContribuyente:string="";

   @Column({ length: 50 })
   condicionDomicilio:string="";

   @Column({ length: 50 })
   ubigeo:string="";

   @Column({ length: 50, nullable: true })
   tipoVia:string="";

   @Column({ length: 255, nullable: true })
   nombreVia:string="";

   @Column({ length: 50, nullable: true })
   codigoZona:string="";

   @Column({ length: 55, nullable: true })
   tipoZona:string="";

   @Column({ length: 15, nullable: true })
   numero:string="";

   @Column({ length: 15, nullable: true })
   interior:string="";

   @Column({ length: 15, nullable: true })
   lote:string="";

   @Column({ length: 15, nullable: true })
   departamento:string="";

   @Column({ length: 15, nullable: true })
   manzana:string="";

   @Column({ length: 15, nullable: true })
   kilometro:string="";
}
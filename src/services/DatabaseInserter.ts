import { Observable } from 'rxjs';
import { tap, concatMap } from 'rxjs/operators';
import fs from 'fs';
import StreamArray from 'stream-json/streamers/StreamArray';
import { RecordEntity, dataRepository } from '../data'; // Importamos el repositorio

export class DatabaseInserter {
   private batchSize: number = 132;

   /**
   * Procesa archivos emitidos por el observable en orden.
   * @param fileObservable Observable que emite rutas de archivos.
   */
   public processFilesInOrder(fileObservable: Observable<string>) : void {
      fileObservable
         .pipe(
            tap((filePath) => console.log(`[INFO] Procesando archivo ${filePath}`)),
            concatMap((filePath) => this.insertFromJsonStream(filePath)) // Procesamiento secuencial
         )
         .subscribe({
            complete: () => {
               console.log('[INFO] Todos los archivos han sido procesados.');
               dataRepository.cleanup();
            },
            error: (err) => {
               console.error('[ERROR] Error procesando archivos:', err);

            }
         });
   }

   /**
   * Inserta registros desde un archivo JSON usando stream-json.
   * @param filePath Ruta del archivo JSON.
   */
   private async insertFromJsonStream(filePath: string): Promise<void> {
      console.log(`[INFO] Procesando archivo grande: ${filePath}`);

      const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
      const jsonStream = fileStream.pipe(StreamArray.withParser());
      let batch: RecordEntity[] = [];
      let lineNumber = 0;

      for await (const { value: jsonLine } of jsonStream) {
         const record = this.mapJsonToRecord(jsonLine);
         batch.push(record);
         lineNumber++;

         if (batch.length === this.batchSize) {
            await dataRepository.insertData(batch); // Usamos el repositorio para insertar
            console.log(`[INFO] Insertadas ${lineNumber} líneas.`);
         batch = [];
         }
      }
      if (batch.length < this.batchSize) {
         await dataRepository.insertData(batch);
         console.log(`[INFO] Insertadas las últimas ${lineNumber} líneas.`);
      }
   }

   /**
   * Convierte un objeto JSON a la entidad RecordEntity.
   * @param data Objeto JSON.
   */
   private mapJsonToRecord(data: any): RecordEntity {
      const record = new RecordEntity();
      record.ruc = data.RUC;
      record.nombreRazonSocial = data.NOMBRE_O_RAZON_SOCIAL;
      record.estadoContribuyente = data.ESTADO_DEL_CONTRIBUYENTE;
      record.condicionDomicilio = data.CONDICION_DE_DOMICILIO;
      record.ubigeo = data.UBIGEO;
      record.tipoVia = data.TIPO_DE_VIA;
      record.nombreVia = data.NOMBRE_DE_VIA;
      record.codigoZona = data.CODIGO_DE_ZONA;
      record.tipoZona = data.TIPO_DE_ZONA;
      record.numero = data.NUMERO;
      record.interior = data.INTERIOR;
      record.lote = data.LOTE;
      record.departamento = data.DEPARTAMENTO;
      record.manzana = data.MANZANA;
      record.kilometro = data.KILOMETRO;
      return record;
   }
}

export const databaseInserter= new DatabaseInserter();
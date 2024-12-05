import { Observable } from 'rxjs';
import { QueryRunner   } from 'typeorm';
import { tap, mergeMap  } from 'rxjs/operators';
import fs from 'fs';
import StreamArray from 'stream-json/streamers/StreamArray';
import { RecordEntity, dataRepository } from '../data'; // Importamos el repositorio
import { bufferSizeCalculator } from '../utils';
import { appDataSource } from '../config/Database';
/**
 * Clase responsable de insertar datos en la base de datos a partir de archivos procesados.
 * Utiliza streams para manejar grandes volúmenes de datos y realiza inserciones en lotes.
 */
export class DatabaseInserter {
   private batchSize: number = 139;
   private maxConcurrent: number = 7; // Número máximo de procesos paralelos
   /**
   * Procesa archivos emitidos por el observable de forma paralela.
   * @param fileObservable Observable que emite rutas de archivos.
   */
   public processFilesInOrder(fileObservable: Observable<string>) : void {
      fileObservable
         .pipe(
            tap((filePath) => console.log(`[INFO] Procesando archivo ${filePath}`)),
            mergeMap((filePath) => this.insertFromJsonStream(filePath), this.maxConcurrent) // Procesamiento secuencial
         )
         .subscribe({
            complete: () => {
               console.log('[INFO] Todos los archivos han sido procesados.');
               dataRepository.cleanup();
            },
            error: (err) => {
               console.error('[ERROR] Error procesando archivos:', err);
               dataRepository.cleanup();
            }
         });
   }

   /**
   * Inserta registros desde un archivo JSON usando stream-json.
   * @param filePath Ruta del archivo JSON.
   */
   private async insertFromJsonStream(filePath: string): Promise<void> {
      console.log(`[INFO] Procesando archivo grande: ${filePath}`);
      const queryRunner = appDataSource.getInstance().createQueryRunner();

      const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8',highWaterMark: bufferSizeCalculator.calculateBufferSize()});
      const jsonStream = fileStream.pipe(StreamArray.withParser());
      let batch: RecordEntity[] = [];
      let lineNumber = 0;

      for await (const { value: jsonLine } of jsonStream) {
         const record = this.mapJsonToRecord(jsonLine);
         batch.push(record);
         lineNumber++;

         if (batch.length === this.batchSize) {
            await this.safeInsert(batch , queryRunner); // Usamos el repositorio para insertar
            console.log(`[INFO] Insertadas ${lineNumber} líneas.`);
         batch = [];
         }
      }
      if (batch.length < this.batchSize) {
         await this.safeInsert(batch , queryRunner);
         console.log(`[INFO] Insertadas las últimas ${lineNumber} líneas.`);
      }
   }
   private async safeInsert(batch: RecordEntity[] , queryRunner: QueryRunner): Promise<void> {
      try {
         await dataRepository.insertData(batch , queryRunner);
      } catch (error: unknown) {
         if (this.isDatabaseError(error) && error.code === 'ECONNCLOSED') {
            console.log('[INFO] Reconectando a la base de datos...');
            await this.connectToDatabase();
            console.log('[INFO] Reconexión exitosa. Reintentando inserción...');
            await this.safeInsert(batch , queryRunner); // Reintenta la inserción
         } else {
            console.error('[ERROR] Error al insertar datos:', error);
            throw error; // Lanza el error si no es de conexión
         }


      }
   }
   private async connectToDatabase(maxRetries: number = 6, delay: number = 3000): Promise<void>{
      let retries = 0;
      while (retries < maxRetries){
         try {
            console.log(`[INFO] Intentando conectar a la base de datos. Intento ${retries + 1}`);
            await dataRepository.ensureQueryRunner(); // Aquí usamos initialize de DataSource
            console.log('[INFO] Conexión exitosa a la base de datos.');
            return;
         } catch (error) {
            retries++;
            console.error(`[ERROR] Error al conectar: ${error}. Reintentando en ${delay} ms...`);
            if (retries >= maxRetries) {
               console.error('[ERROR] No se pudo establecer conexión después de varios intentos.');
               throw error;
            }
            await new Promise(res => setTimeout(res, delay * retries)); // Retraso exponencial
         }
      }
   }
   private isDatabaseError(error: unknown): error is { code: string } {
      return typeof error === 'object' && error !== null && 'code' in error;
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
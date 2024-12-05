import { Subject, interval } from 'rxjs';
import { filter, switchMap, catchError } from 'rxjs/operators';
import fs from 'fs';
import path from 'path';
import appRoot from 'app-root-path';
import { metadataService } from './MetadataService'; // Servicio para comparar metadatos
import { envConfig } from '../config/envConfig';

class SunatMetadataWatcher {
   private metadataFilePath: string = path.join(
      appRoot.path,`${envConfig.metadataDirectoryPath}`,`sunatFileMetadata.json`
   ); // Ruta del archivo de metadatos

   private metadataDirPath: string = path.join(
      appRoot.path,`${envConfig.metadataDirectoryPath}`); // Ruta de la carpeta de metadatos
   private checkInterval: number = 300000; // Verifica cada 5 minutos (300,000 milisegundos)
   private metadataChanged$ = new Subject<void>(); // Evento que se emite cuando hay un cambio en los metadatos

   constructor() {
      this.startWatching();
      console.log(this.metadataDirPath);
      console.log(this.metadataFilePath);
   }

   /**
    * Inicia el servicio de observación, ejecutándose en segundo plano.
    */
   private startWatching() {
      interval(this.checkInterval)
         .pipe(
            filter(() => {
               const metadataMissing = this.checkMetadataExistence(); // Verifica existencia de archivos
               const inTimeRange = this.isInTimeRange(); // Verifica si está dentro del horario
               console.log('[DEBUG] Evaluando condiciones:', { inTimeRange, metadataMissing });
               return metadataMissing || inTimeRange; // Prioriza la falta de archivos
            }),
            switchMap(() => this.checkForChanges()), // Ejecuta la verificación de cambios
            catchError((error) => {
               console.error('[ERROR] Error durante la verificación:', error);
               return [false];
            })
         )
         .subscribe();
   }

   /**
    * Verifica si los metadatos han cambiado o si el archivo de metadatos no existe.
    * @returns `true` si hay cambios, `false` si no.
    */
   private async checkForChanges(): Promise<boolean> {
      const isDifferent = await this.compareMetadata();
      if (isDifferent) {
         // Si detecta un cambio, emite el evento de cambio
         console.log('[INFO] Cambios detectados en los metadatos. Emitiendo evento...');
         this.metadataChanged$.next(); // Emite el evento de cambio
      }
      return isDifferent;
   }

   /**
    * Verifica si la hora actual está dentro del rango permitido (7:00 a.m. a 10:00 a.m.).
    */
   private isInTimeRange(): boolean {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      return hour >= 7 && (hour < 10 || (hour === 10 && minute === 0)); // Solo dentro de 7-10 a.m.
   }

   /**
    * Verifica si la carpeta de metadatos o el archivo `sunatFileMetadata.json` no existe
    * y necesita que se ejecute el proceso.
    */
   private checkMetadataExistence(): boolean {
      const metadataExists = fs.existsSync(this.metadataDirPath) && fs.existsSync(this.metadataFilePath);
      if (!metadataExists) {
         console.log('[INFO] La carpeta o el archivo de metadatos no existen.');
         this.metadataChanged$.next(); // Emitir evento si no existe
         return true; // Indica que falta la carpeta/archivo
      }
      console.log('[INFO] La carpeta y el archivo de metadatos existen.');
      return false; // Todo está en orden
   }

   /**
    * Llama al servicio `MetadataService` para comparar los metadatos.
    * @returns `true` si los metadatos han cambiado, `false` si no.
    */
   private async compareMetadata(): Promise<boolean> {
      // Llamamos a tu servicio MetadataService para comparar los metadatos
      return await metadataService.compareMetadata();
   }

   /**
    * Devuelve el observable de cambios de metadatos para que otros se suscriban.
    */
   public getMetadataChangesObservable() {
      return this.metadataChanged$.asObservable(); // Devuelve el observable que otros pueden suscribirse
   }
}

// Crea e inicia el servicio
export const sunatMetadataWatcher = new SunatMetadataWatcher();

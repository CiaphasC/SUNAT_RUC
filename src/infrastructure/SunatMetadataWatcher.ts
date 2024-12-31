import { Subject, interval, Subscription  } from 'rxjs';
import { filter, exhaustMap, catchError } from 'rxjs/operators';
import fs from 'fs';
import path from 'path';
import appRoot from 'app-root-path';
import { metadataService } from '../services'; // Servicio para comparar metadatos
import { envConfig } from '../config/envConfig';

class SunatMetadataWatcher {
   private metadataFilePath: string = path.join(
      appRoot.path,`${envConfig.metadataDirectoryPath}`,`sunatFileMetadata.json`
   ); // Ruta del archivo de metadatos

   private metadataDirPath: string = path.join(
      appRoot.path,`${envConfig.metadataDirectoryPath}`); // Ruta de la carpeta de metadatos
   private checkInterval: number = 100000; // Verifica cada 5 minutos (300,000 milisegundos)
   private metadataChanged$ = new Subject<void>(); // Evento que se emite cuando hay un cambio en los metadatos
   private metadataSubscription: Subscription | null = null;
   constructor() {
      this.stopWatching();
      this.startWatching();
   }

   /**
    * Inicia el servicio de observación, ejecutándose en segundo plano.
    */
   private startWatching() {
      interval(this.checkInterval) // Ejecuta la verificación cada 5 minutos
         .pipe(
            // Filtra solo el rango horario de 7:00 a 10:00 a.m. o verifica la existencia de archivos fuera de ese rango
            filter(() => this.isInTimeRange() || this.checkMetadataExistence()), 
            exhaustMap(() => this.checkForChanges()), // Verifica los cambios en los metadatos
            catchError((error) => {
               console.error('[ERROR] Error durante la verificación:', error);
               return [false]; // Devuelve un valor por defecto en caso de error
            })
         )
         .subscribe(); // El ciclo de verificación sigue corriendo cada 5 minutos
   }
   private stopWatching() {
      if (this.metadataSubscription) {
         this.metadataSubscription.unsubscribe();
         console.log('[INFO] Suscripción detenida.');
      }
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
    * Verifica si la hora actual está dentro del rango permitido (8:30 a.m. a 10:00 a.m.).
    */
   private isInTimeRange(): boolean {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      return (hour === 8 && minute >= 40) || (hour === 9) || (hour === 10 && minute === 0); // Solo dentro de 8:40-10:00 a.m.
   }

   /**
    * Verifica si la carpeta de metadatos o el archivo `sunatFileMetadata.json` no existe
    * y necesita que se ejecute el proceso.
    */
   private checkMetadataExistence(): boolean {
      const metadataExists = fs.existsSync(this.metadataDirPath) && fs.existsSync(this.metadataFilePath);
      if (!metadataExists) {
         console.log('[INFO] La carpeta de metadatos o el archivo de metadatos no existen. Iniciando proceso...');
      }
      return !metadataExists; // Si no existe, ejecuta el proceso
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

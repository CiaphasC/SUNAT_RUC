import fs from 'fs/promises';
import { Subject } from 'rxjs';

export class FileWatcher {
   private fileSubject: Subject<string> = new Subject();
   public abortControllers = new Map<string, AbortController>();
   private delay: number = 900; // 1 segundo entre verificaciones
   /**
    * Espera que un archivo se estabilice (su tamaño no cambia).
    * @param filePath Ruta del archivo a verificar.
    */
   public async waitForFileToBeStable(filePath: string): Promise<void> {
      const abortController = new AbortController();
      this.abortControllers.set(filePath, abortController);

      try {
         let lastSize = 0;

         while (!abortController.signal.aborted) {
            const stats = await fs.stat(filePath);

            if (stats.size === lastSize) {
               console.log(`[INFO] Archivo estable: ${filePath}`);
               this.fileSubject.next(filePath);
               break; // Salimos del ciclo si el archivo está estable
            }

            lastSize = stats.size;
            await this.delayPromise(this.delay, abortController.signal);
         }
      } catch (error: unknown) {
         if (error instanceof Error) {
            if (error.name === 'AbortError') {
               console.log(`[INFO] Monitoreo cancelado para: ${filePath}`);
            } else {
               console.error(`[ERROR] Error al verificar el archivo ${filePath}: ${error.message}`);
            }
         } else {
            console.error(`[ERROR] Se lanzó un valor desconocido: ${error}`);
         }
      } finally {
         this.abortControllers.delete(filePath); // Limpiar referencias
      }
   }

   /**
    * Retarda la ejecución por un tiempo determinado.
    * @param ms Tiempo en milisegundos para esperar.
    * @param signal Señal de abortar.
    */
   public delayPromise(ms: number, signal: AbortSignal): Promise<void> {
      return new Promise((resolve, reject) => {
         const timeout = setTimeout(() => resolve(), ms);
         signal.addEventListener('abort', () => {
            clearTimeout(timeout);
            reject(new Error('AbortError'));
         });
      });
   }

   /**
    * Cancela el monitoreo de un archivo.
    * @param filePath Ruta del archivo.
    */
   public cancelFileWatch(filePath: string): void {
      const controller = this.abortControllers.get(filePath);
      if (controller) {
         controller.abort();
      }
   }

   /**
   * Devuelve un observable que emite las rutas de los archivos detectados.
   */
   public getFileObservable() {
      return this.fileSubject.asObservable();
   }
}
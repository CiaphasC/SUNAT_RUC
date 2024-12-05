import chokidar, { FSWatcher } from 'chokidar';
import { FileWatcher } from './FileWatcher'; // Importa FileWatcher

export class FileWatcherApp extends FileWatcher {
   private watcher: FSWatcher;
   private filesInProgress = new Set<string>();
   /**
   * Inicia el observador sobre una carpeta.
   * @param folderPath Ruta de la carpeta a observar.
   */
   constructor(folderPath: string) {
      super(); // Llamamos al constructor de FileWatcher
      this.watcher = chokidar.watch(folderPath, { persistent: true, ignoreInitial: true });
   }

   /**
    * Inicia la observación de la carpeta.
    */
   public startWatching(): void {
      this.watcher
         .on('add', (filePath: string) => {
            console.log(`[INFO] Nuevo archivo detectado: ${filePath}`);
            this.filesInProgress.add(filePath); // Agregar al conjunto de archivos en progreso

            this.waitForFileToBeStable(filePath)
               .then(() =>{
                  console.log(`[INFO] Procesamiento finalizado para: ${filePath}`);
                  if (this.filesInProgress.size === 0) {
                     console.log('[INFO] Todos los archivos han sido procesados.');
                     this.filesInProgress.delete(filePath);
                     this.stopWatching(); // Llamamos a stopWatching
                  }
               })
               .catch((err) => console.error(`[ERROR] Error procesando ${filePath}: ${err.message}`));
         })
         .on('unlink', (filePath: string) => {
            console.log(`[INFO] Archivo eliminado: ${filePath}`);
            this.cancelFileWatch(filePath); // Cancelar monitoreo si el archivo ya no existe
            this.filesInProgress.delete(filePath);
            this.stopWatching();
         });
   }

   /**
    * Detiene la observación de la carpeta.
    */
   public stopWatching(): void {
      this.watcher.close();
      this.abortControllers.forEach((controller) => controller.abort());
      this.fileSubject.complete();
      this.abortControllers.clear();
   }
}
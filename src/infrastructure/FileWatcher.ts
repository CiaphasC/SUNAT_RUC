import chokidar, { FSWatcher } from 'chokidar'; 
import { Subject } from 'rxjs';

export class FileWatcher {
   private watcher: FSWatcher;
   private fileSubject: Subject<string> = new Subject();

   constructor(private folderPath: string) {
      this.watcher = chokidar.watch(this.folderPath, { persistent: true });
   }

   /**
   * Inicia la observación de la carpeta.
   */
   public startWatching(): void {
      this.watcher.on('add', (filePath:string) => {
         console.log(`[INFO] Nuevo archivo detectado: ${filePath}`);
      this.fileSubject.next(filePath); // Emitimos la ruta del archivo al flujo reactivo
      });
   }

   /**
   * Devuelve un observable que emite las rutas de los archivos detectados.
   */
   public getFileObservable() {
      return this.fileSubject.asObservable();
   }

   /**
   * Detiene la observación de la carpeta.
   */
   public stopWatching(): void {
      this.watcher.close();
   }
}
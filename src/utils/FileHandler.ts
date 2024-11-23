import fs from 'fs';
import unzipper from 'unzipper';
import {bufferSizeCalculator} from './'
import path from 'path';
class FileHandler{
   public existsInDataFolder(filename: string):boolean{
      return fs.existsSync(filename);
   }
   public async extractFile(filePath: string, destFolder: string): Promise<void> {
      let extractedFileName='';
      console.log(`\nDescomprimiendo archivo ${path.basename(filePath)}...`);

      // Ajustar el tamaño del buffer del stream

      const readStream = fs.createReadStream(
         filePath,
         {
            highWaterMark: bufferSizeCalculator.calculateBufferSize()
         }); // buffer

      await new Promise<void>((resolve, reject) => {
         readStream
            .pipe(unzipper.Parse())
            .on('entry',entry=>{
               const fullPath = path.join(destFolder, entry.path);
               if (entry.type === 'File') {
                  extractedFileName = entry.path;
                  entry.pipe(fs.createWriteStream(fullPath));
               } else {
                  entry.autodrain(); // Ignorar directorios
               }
            })
            .on('close', () => {
               console.log(`Archivo descomprimido ${extractedFileName} en ${destFolder}\n`);
               readStream.close();
               resolve();
            })
            .on('error', (err) => {
               console.error('Error al descomprimir:', err);
               reject(err);
            });
      });
   }
}

export const fileHandler = new FileHandler();

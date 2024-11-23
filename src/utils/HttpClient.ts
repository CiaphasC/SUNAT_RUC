import {bufferSizeCalculator} from './'
import fs from 'fs';
import axios from 'axios';


class HttpClient {
   /**
    * Descarga un archivo desde una URL y lo guarda en el directorio especificado.
    * @param url - URL del archivo a descargar.
    * @param path - Ruta del directorio donde se guardará el archivo.
    * @param fileName - Nombre del archivo descargado.
    */
   public async download(url: string, path: string, fileName: string) {
      try{
         fs.mkdirSync(path,{ recursive: true });
         const writer = fs.createWriteStream(
            `${path}/${fileName}`,
            { highWaterMark: bufferSizeCalculator.calculateBufferSize() }
         );
         const response = await axios.get(
            url, { responseType: 'stream' }
         );
         if (response.status !== 200) {
            throw new Error(`Error al descargar el archivo. Código HTTP: ${response.status}`);
         }
         console.log('Última modificación:', response.headers['last-modified']);

         await new Promise<void>((resolve, reject) => {

            console.log(`\nIniciando descarga de archivo ${fileName}...`);
            response.data.pipe(writer);
            writer.on('close', () => {
               console.log(`Descarga completada.`);
               writer.close();
               resolve();
            });
            writer.on('error', (err) => {
               console.error(`Error al descargar el archivo \n`, err);
               reject(err);
            });
         });
      }catch(error){
         console.error(`Error durante la descarga del archivo \n`);
         throw error;
      }
   }
}
export const httpClient = new HttpClient();
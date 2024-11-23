import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import { bufferSizeCalculator } from './';


export class SystemUtils{

   public static getOptimalWorkers(): number{
      return Math.max(1, os.cpus().length - 1);
   }

   public static async getLineCountAndHeaders(
      filePath:string
   ): Promise<{ lineCount: number; headers: string[] }>{

      const fileStream = fs.createReadStream(filePath, {highWaterMark: bufferSizeCalculator.calculateBufferSize(), encoding: `${'binary'}` });

      const rl= readline.createInterface(
         {
            input: fileStream,
            crlfDelay: Infinity,
            terminal: false
         });
      let lineCount=0;
      let lineWorker=0;
      let headers:string[] = [];
      try{
         for await (const line of rl) {
            lineCount++;
            lineWorker++
            if (lineCount === 1) {
               
               headers = this.processHeaders(line);
            }
            if(lineCount <= 1537704){
               
            }

         }
      }finally{
         console.log(`${path.basename(filePath)} tiene ${lineCount} lineas`)
         rl.close();
         fileStream.close();
      }
      return {lineCount, headers};
   }


   private static processHeaders(headerLine:string):string[]{
      const headers=headerLine.split('|').map((header) =>{
         return header
            .trim() // Elimina espacios al inicio y final
            .normalize('NFD') // Descompone caracteres con tildes
            .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos (acentos)
            .toUpperCase() // Convierte a mayúsculas
            .replace(/[^A-Z0-9]/g, '_') // Sustituye caracteres no válidos por '_'
            .replace(/_+/g, '_') // Reemplaza múltiples '_' consecutivos por uno solo
            .replace(/^_|_$/g, '') // Elimina '_' al inicio o final
      });
      // Excluir solo el valor vacío al final
      if (headers[headers.length - 1] === '') {
         headers.pop(); // Elimina el último valor vacío
      }
      return headers;
   }
}

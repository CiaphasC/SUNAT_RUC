import { SystemUtils, bufferSizeCalculator } from '../utils';
import {WorkerFactory} from '../workers/WorkerFactory';
import * as os from 'os';
import readline from 'readline';
//import path from 'path';
import fs from 'fs';
export class FileProcessor{
   private processFileLines:number;
   private processFileHeaders:string[];
   private chunkSize:number;
   private workerCount:number;
   constructor(FileSummary:{lineCount: number,headers: string[]}){
      this.processFileLines=FileSummary[`lineCount`];
      this.processFileHeaders=FileSummary[`headers`];
      this.workerCount=SystemUtils.getOptimalWorkers();
      this.chunkSize=Math.ceil( this.processFileLines / this.workerCount );
   }
   public async distributeProcessing(){
      console.log("HEADERS: ",this.processFileHeaders)
      console.log("Numero de nucleos en el procesador:", os.cpus().length);
      console.log("Numero de Workers:",this.workerCount);
      console.log("Numero de lineas por Worker:",this.chunkSize);
   }
   public async process(filePath:string){
      const fileStream = fs.createReadStream(filePath, {highWaterMark: bufferSizeCalculator.calculateBufferSize(), encoding: `${'binary'}` });

      const rl= readline.createInterface(
         {
            input: fileStream,
            crlfDelay: Infinity,
            terminal: false
         });
      let lineWorker=0;
      let countLine=0;
      let workercount=0;

      let results: string[] = [];
      try{
         for await (const line of rl) {
            lineWorker++;
            countLine++;

            if(countLine===1){
               continue;
            }else{
               results.push(line);
            }
            if(lineWorker===this.chunkSize || countLine===this.processFileLines){
               const index=workercount+1;
               this.runWorker(results,index)
               workercount++;
               lineWorker=0;
               results= [];
            }

         }
      }finally{
         rl.close();
         fileStream.close();
      }
   }
   public runWorker(result:string[], index:number){
      const {port1,port2}=WorkerFactory.createMessageChannel();
      const worker=WorkerFactory.createWorker(`workerProcess`);
      port1.on('message', (result) => {
         console.log(result);
         port1.close();
         worker.terminate();
      });
            // Escuchar mensajes del worker

      worker.postMessage({ port: port2, result: result, index }, [port2]);
   }

}

import { Worker, MessageChannel } from 'worker_threads';
import path from 'path';
import appRoot from 'app-root-path';

export class WorkerFactory {
   static createWorker(workerScript: string): Worker {
      return new Worker(
         path.join(appRoot.path, './src/workers/', `worker-thread.js`),
         {
            workerData: {
               path: path.join(appRoot.path, './src/workers/',`${workerScript}.ts`),
            },
         }
      );
   }

   static createMessageChannel() {
      return new MessageChannel();
   }
}
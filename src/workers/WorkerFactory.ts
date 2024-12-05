import { Worker, MessageChannel } from 'worker_threads';
import path from 'path';
import appRoot from 'app-root-path';

export class WorkerFactory {
   static createWorker(workerScript: string): Worker {
      const isProduction = process.env.NODE_ENV === 'production';
      const scriptFile = isProduction
         ? `${workerScript}.js`
         : `${workerScript}.ts`;
      const scriptPath = isProduction
         ? path.join(appRoot.path, './dist/workers/', scriptFile)
         : path.join(appRoot.path, './src/workers/', scriptFile);
      const appPath = isProduction
         ? path.join(appRoot.path, './dist/workers/', `worker-thread.js`)
         : path.join(appRoot.path, './src/workers/', `worker-thread.js`);
      return new Worker(
         appPath,
         {
            workerData: {
               path: scriptPath,
            },
         }
      );
   }

   static createMessageChannel() {
      return new MessageChannel();
   }
}
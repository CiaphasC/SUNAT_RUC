import * as os from 'os';
class BufferSizeCalculator{
   private readonly MIN_BUFFER_SIZE = 64 * 1024; // 64 KB
   private readonly MAX_BUFFER_SIZE = 17 * 1024 * 1024; // 17 MB

   public calculateBufferSize():number{
      const freeMemory=os.freemem(); // Memoria Ram libre en bytes
      // Definir límite máximo del buffer como un porcentaje de la memoria libre
      //9% de la memoria RAM libre
      const maxBufferBasedOnMemory=Math.floor(freeMemory * 0.09);

      const bufferSize=Math.max(
         this.MIN_BUFFER_SIZE,
         Math.min(
            this.MAX_BUFFER_SIZE,
            maxBufferBasedOnMemory
         )
      );
      return bufferSize;
   }
}
export const bufferSizeCalculator=new BufferSizeCalculator();
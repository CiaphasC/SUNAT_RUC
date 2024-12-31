
import "reflect-metadata";
import { sunatController } from '../controllers/SunatController';
import { sunatMetadataWatcher } from "../infrastructure/SunatMetadataWatcher";
import { exhaustMap } from "rxjs";
interface Main{
   eventMenu:()=>Promise<string>;
   eventAction:()=>void;
}
                                        
export const ComponentHandler=(()=>{
   let isProcessing = false;
   let subscription: any = null;
   return{
      logAction:async (element:Main)=>{
         await element.eventMenu().then(console.log);
         element.eventAction();
         if (!subscription) {
            subscription = sunatMetadataWatcher.getMetadataChangesObservable().pipe(
               exhaustMap(async () => {
                  if (isProcessing) return; // No procesamos si ya estamos en ejecución
                  isProcessing = true; // Marcamos que estamos procesando
                  console.log('[INFO] Cambio detectado, manejando evento...');
                  // Aquí se asegura que no se ejecute mientras esté en proceso el anterior
                  await sunatController.checkForUpdates();
                  isProcessing = false; // Restablecemos el estado de procesamiento
                  return Promise.resolve(); // Asegura que el observable termine correctamente
               })
            ).subscribe({
               next: () => console.log('[INFO] Actualización completada'),
               error: (err) => console.error('[ERROR] Error durante la actualización:', err),
               complete: () => console.log('[INFO] Suscripción completada.')
            });
         }
      }
   }
})();
                                        
export const Main:Main=(()=>{
   return{
      eventMenu :async()=>{
         try{
            return `
               ${'==================='}
               ${'SISTEMA FUNCIONANDO'}
               ${'==================='}
            `;
         }catch(err){
            throw err;
         }
      },
      eventAction:()=>{
         console.log("SUNAT");
      }
   }
})();

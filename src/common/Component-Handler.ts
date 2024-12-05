
import "reflect-metadata";
import {sunatController} from '../controllers/SunatController';
import { sunatMetadataWatcher } from "../services/SunatMetadataWatcher ";
import { concatMap } from "rxjs";
interface Main{
   eventMenu:()=>Promise<string>;
   eventAction:()=>void;
}
                                        
export const ComponentHandler=(()=>{
   return{
      logAction:async (element:Main)=>{
         await element.eventMenu().then(console.log);
         element.eventAction();
         sunatMetadataWatcher.getMetadataChangesObservable().pipe(
            concatMap(async () => {
               console.log('[INFO] Detectado cambio en los metadatos, ejecutando actualización...');
               await sunatController.checkForUpdates();
               console.log('[INFO] Actualización completada.');
            })
         ).subscribe({
            error: (err) => console.error('[ERROR] Error en el manejador de cambios de metadatos:', err),
            complete: () => console.log('[INFO] Suscripción completada.')
         });
         //await sunatController.checkForUpdates();
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

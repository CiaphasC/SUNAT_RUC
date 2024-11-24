
import {sunatController} from '../controllers/SunatController';
interface Main{
   eventMenu:()=>Promise<string>;
   eventAction:()=>void;
}
                                        
export const ComponentHandler=(()=>{
   return{
      logAction:async (element:Main)=>{
         await element.eventMenu().then(console.log);
         element.eventAction();
         await sunatController.checkForUpdates();
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

/* validaciones de entrada
a un metodo darle una modularidad para que no todo dependa de el
la logica para leer el archivo se haga en otro metodo
el procesarlo tambien en otro metodo
si el archivo es muy grande 
la logica para leer el archivo en otro metodo
el procesarlo en otro metodo


*/
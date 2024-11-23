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
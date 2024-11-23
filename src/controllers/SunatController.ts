import { sunatService } from "../services/SunatService";
class SunatController{

   public async checkForUpdates(): Promise<void>{
      try{
         await sunatService.checkAndDownloadFile();
      }catch(error){
         console.error("Error en checkForUpdates:", error);
      }
   }

   public async processData(): Promise<void>{

   }
}
export const sunatController = new SunatController();
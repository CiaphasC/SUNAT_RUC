import {FileProcessor,metadataService} from './';
import {envConfig} from '../config/envConfig';
import {fileHandler,httpClient, SystemUtils} from '../utils';
import path from 'path';
import appRoot from 'app-root-path';
export class SunatService{
   private absoluteDownloadedZipFilePath:string = path.join(appRoot.path,`${envConfig.downloadDirectoryPath}`);
   public async checkAndDownloadFile(){
      const isUpdated = await metadataService.compareMetadata();
      if(
         isUpdated || !fileHandler.existsInDataFolder(
            `${this.absoluteDownloadedZipFilePath}`
         )
      ){
         await httpClient.download(
            envConfig.sunatUrl,
            this.absoluteDownloadedZipFilePath,
            `${envConfig.downloadedZipFileName}`
         );
         await fileHandler.extractFile(
            `${this.absoluteDownloadedZipFilePath}/${envConfig.downloadedZipFileName}`,
            this.absoluteDownloadedZipFilePath
         );
         await this.processFile();
      }
   }
   public async processFile(){
      const FileSummary=await SystemUtils.getLineCountAndHeaders(
         `${this.absoluteDownloadedZipFilePath}/padron_reducido_ruc.txt`
      );
      const fileProcessor=new FileProcessor(FileSummary);
      await fileProcessor.distributeProcessing();
      await fileProcessor.process(`${this.absoluteDownloadedZipFilePath}/padron_reducido_ruc.txt`);
   }
}
export const sunatService = new SunatService();
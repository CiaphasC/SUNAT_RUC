import {envConfig} from '../config/envConfig';
import {fileHandler} from '../utils';
import {diff} from 'json-diff';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import appRoot from 'app-root-path';
interface IHeader{
   'last-modified': string,
   etag: string
}
class MetadataService{
   private metadataZipFilePath:string = path.join(
      appRoot.path,`${envConfig.metadataDirectoryPath}`
   );
   private JsonFileName:string=`${envConfig.headerMetadataJsonFileName}`;
   private AuditJsonFileName:string=`${envConfig.headerMetadataAuditJsonFileName}`;

   public async getHeaders(url:string) {
      const response = await axios.head(url);
      return {
         'last-modified': response.headers['last-modified'],
         etag: response.headers['etag']
      };
   }
   public async compareMetadata():Promise<boolean>{
      const headers=await this.getHeaders(envConfig.sunatUrl);
      const pathname=`${this.metadataZipFilePath}/${this.JsonFileName}`
      const storedMetadata = this.readMetadata(pathname);
      const isDifferent = this.logHeaderDifferences(storedMetadata, headers);
      if (isDifferent){
         await this.updateMetadata(pathname, headers);
      }
      return isDifferent;
   }
                                                       
   private readMetadata(path: string):IHeader{
      if(
         !fileHandler.existsInDataFolder(this.metadataZipFilePath) ||
         !fileHandler.existsInDataFolder(
            `${this.metadataZipFilePath}/${this.JsonFileName}`
         )
      ){
         fs.mkdirSync(this.metadataZipFilePath,{ recursive: true });
         fs.writeFileSync(path, JSON.stringify({}));
      }
      return JSON.parse(fs.readFileSync(path, 'utf-8'));
   }
   private async updateMetadata(path: string, data: object){
      fs.writeFileSync(path, JSON.stringify(data, null, 2),'utf-8');
   }
                                                       
   private logHeaderDifferences(
      stored: { 'last-modified': string; etag: string },
      current: { 'last-modified': string; etag: string }
   ):boolean{
      const pathname=this.metadataZipFilePath
      const differences=diff(stored, current);
      if (stored['last-modified'] !== current['last-modified'] && stored['etag'] !== current['etag']){
         //convierte un objeto en una cadena de texto en formato JSON y lo guarda
         fs.writeFileSync(`${pathname}/${this.AuditJsonFileName}`, JSON.stringify(differences, null, 2), 'utf-8');
         console.log(`Diferencias guardadas en ${this.metadataZipFilePath}`);
      } else {
         console.log('No se encontraron diferencias.');
      }
      return stored['last-modified'] !== current['last-modified'] && stored['etag'] !== current['etag'];
   }
}

export const metadataService = new MetadataService();
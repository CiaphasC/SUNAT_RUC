/* import {ComponentHandler, Main as MainApp} from './common';
import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

class Main{
   constructor(){
      this._initialize();
   }
   private _initialize(){

      ComponentHandler.logAction(MainApp);
   }
}
new Main(); */
import axios from 'axios';

axios.head('https://www.sunat.gob.pe/a/txt/tipoCambio.txt')

console.log(axios.head('https://www.sunat.gob.pe/a/txt/tipoCambio.txt'))
console.log(axios.head('http://www2.sunat.gob.pe/padron_reducido_ruc.zip'))


async function getHeaders(url:string) {
   const response = await axios.head(url);
   console.log(response)
   return {
      'last-modified': response.headers['last-modified'],
      etag: response.headers['etag']
   };
}

getHeaders('https://www.sunat.gob.pe/a/txt/tipoCambio.txt');
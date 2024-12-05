import {ComponentHandler, Main as MainApp} from './common';
import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

//import { setMaxListeners } from 'events';
class Main{
   constructor(){
      this._initialize();
   }
   private _initialize(){
      //setMaxListeners(22);
      ComponentHandler.logAction(MainApp);
   }
}
new Main();



import {ComponentHandler, Main as MainApp} from './common';
import { setMaxListeners } from 'events';
class Main{
   constructor(){
      this._initialize();
   }
   private _initialize(){
      setMaxListeners(20);
      ComponentHandler.logAction(MainApp);
   }
}
new Main();



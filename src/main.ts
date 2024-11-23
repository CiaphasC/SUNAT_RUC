import {ComponentHandler, Main as MainApp} from './common';

class Main{
   constructor(){
      this._initialize();
   }
   private _initialize(){
      ComponentHandler.logAction(MainApp);
   }
}
new Main();



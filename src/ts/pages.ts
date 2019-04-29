import { Main as m } from './main';
import { s } from './s';
import {EnterPin} from './pages/enterpin';

export class Pages { //implements Page {
    static splash() : void
    {
        m.getAndLoad("splash.html",  {"title" : "Splash Screen"}, function() {
            m.addBtnListener("insertCard", function(){
               
                Pages.enterpin();
            });    
        });
    }

    static enterpin() : void
    {
        EnterPin.load();
    }
}
    

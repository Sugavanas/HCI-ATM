import { Main as m, Main } from './main';
import { s } from './s';
import {EnterPin} from './pages/enterpin';

export class Pages { //implements Page {
    static splash() : void
    {
        m.getAndLoad("splash.html",  {"title" : "Splash Screen"})
            .then(data => {
                m.addBtnListener("insertCard", function(){
                    m.showLoader("Loading", EnterPin.load());
                });    
            })
            .catch(error => {
                m.loadErrorPage(error);
            });
    }
}
    

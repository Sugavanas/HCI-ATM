import { Main as m, Main } from './main';
import { s } from './data/s';
import {EnterPin} from './pages/enterpin';
import {dummyAccounts, Account} from './data/account';
import { Menu } from './pages/menu';
export class Pages { //implements Page {
    static splash() : void
    {
        
        dummyAccounts.getInstance().loggedInAccount = dummyAccounts.getInstance().getAccountByPin("123456");
        Menu.load().then();
        return; 
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
    

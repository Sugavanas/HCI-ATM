import { Main as m, Main } from './../main';
import { s } from './../data/s';
import { NumPad } from './../numpad'
import {dummyAccounts, Account} from './../data/account';
import { DepositDetails } from './deposit.details';

export class Menu {
    static load() : Promise<object>
    {
        return new Promise(function(resolve, reject){
            m.getAndLoad("menu.html", {"displayName" : dummyAccounts.getInstance().loggedInAccount.displayName})
            .then(() => {
                m.addBtnListener("menu-deposit", function(){
                    m.showLoader("Loading", DepositDetails.load(dummyAccounts.getInstance().loggedInAccount));
                });
                resolve();
            }).catch(reject);
        });
    }
}
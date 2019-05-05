import { Main as m, Main } from './../main';
import { s } from './../data/s';
import { NumPad } from './../numpad'
import {dummyAccounts, Account, AccountTypes} from './../data/account';

import { Pages } from '../pages';
import { DepositDetails } from './deposit.details';
import { DepositAccountNumber } from './deposit.accountnumber';

export class Menu {
    static load() : Promise<object>
    {
        return new Promise(function(resolve, reject){
            m.getAndLoad("menu.html", {"displayName" : dummyAccounts.getInstance().loggedInAccount().displayName})
            .then(() => {
                m.addBtnListener("menu-deposit", function(){
                    Pages.accountSelection(dummyAccounts.getInstance().loggedInAccount()).then(
                        data => {
                            m.showLoader("Loading", DepositDetails.load(dummyAccounts.getInstance().loggedInAccount(), data));
                        });
                });

                m.addBtnListener("menu-transfer", function() {
                    Pages.accountSelection(dummyAccounts.getInstance().loggedInAccount()).then(
                        data => {
                            m.showLoader("Loading", DepositAccountNumber.load(true, data)); 
                        });
                   
                });
                resolve();
            }).catch(reject);
        });
    }
}
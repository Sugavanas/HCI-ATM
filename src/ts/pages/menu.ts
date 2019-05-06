import { Main as m, Main } from './../main';
import { s } from './../data/s';
import { NumPad } from './../numpad'
import {dummyAccounts, Account, AccountTypes} from './../data/account';

import { Pages } from '../pages';
import { DepositDetails } from './deposit.details';
import { DepositAccountNumber } from './deposit.accountnumber';
import { Withdraw } from './withdraw.amount';

export class Menu {
    static load() : Promise<object>
    {
        return new Promise(function(resolve, reject){
            m.getAndLoad("menu.html", {"displayName" : dummyAccounts.getInstance().loggedInAccount().displayName})
            .then(() => {
                var isLoggedIn : boolean = dummyAccounts.getInstance().isLoggedIn();

                if(isLoggedIn)
                {
                    m.addBtnListener("menu-deposit", function(){
                        Pages.depositSelection().then(data => {
                            if(data == "own")
                            {
                                Pages.accountSelection(dummyAccounts.getInstance().loggedInAccount()).then(
                                    selection => {
                                        m.showLoader("Loading", DepositDetails.load(dummyAccounts.getInstance().loggedInAccount(), selection));
                                    }).catch(() => {});
                            }
                            else
                            {
                                DepositAccountNumber.load();
                            }
                        })
                       
                    });

                    m.addBtnListener("menu-transfer", function() {
                        Pages.accountSelection(dummyAccounts.getInstance().loggedInAccount()).then(
                            data => {
                                m.showLoader("Loading", DepositAccountNumber.load(true, data)); 
                            }).catch(() => {});
                    });

                    m.addBtnListener("menu-withdraw", function() {
                        Pages.accountSelection(dummyAccounts.getInstance().loggedInAccount()).then(
                            data => {
                                Pages.withdrawFastCashModal(data).catch(() => {});
                            }).catch(() => {});
                    });

                    m.addBtnListener("menu-balance", function() {
                        Pages.accountSelection(dummyAccounts.getInstance().loggedInAccount()).then(
                            data => {
                                Pages.balanceModal(data);
                            }).catch(() => {});
                    });
                } else {
                    
                }
                resolve();
            }).catch(reject);
        });
    }
}
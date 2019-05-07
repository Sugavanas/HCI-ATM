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
        if(!dummyAccounts.isLoggedIn())
        { 
            m.defaultCancelCallback();
            location.reload();
            return null;
        }
        return new Promise(function(resolve, reject){
            m.getAndLoad("menu.html", {"displayName" : dummyAccounts.i().loggedInAccount().displayName})
            .then(() => {
                var isLoggedIn : boolean = dummyAccounts.i().isLoggedIn();

                if(isLoggedIn)
                {
                    m.addBtnListener("menu-deposit", function(){
                        Pages.depositSelection().then(data => {
                            if(data == "own")
                            {
                                Pages.accountSelectionModal(dummyAccounts.i().loggedInAccount(), "Select account type to deposit").then(
                                    selection => {
                                        m.showLoader("Loading", DepositDetails.load(dummyAccounts.i().loggedInAccount(), selection));
                                    }).catch(() => {});
                            }
                            else
                            {
                                DepositAccountNumber.load();
                            }
                        })
                       
                    });

                    m.addBtnListener("menu-transfer", function() { //TODO: transfer within own accounts
                        Pages.accountSelectionModal(dummyAccounts.i().loggedInAccount(), "Select account type to transfer from").then(
                            data => {
                                m.showLoader("Loading", DepositAccountNumber.load(true, data)); 
                            }).catch(() => {});
                    });

                    m.addBtnListener("menu-withdraw", function() {
                        Pages.accountSelectionModal(dummyAccounts.i().loggedInAccount(), "Select account type to withdraw from").then(
                            data => {
                                Pages.withdrawFastCashModal(data).catch(() => {});
                            }).catch(() => {});
                    });

                    m.addBtnListener("menu-balance", function() {
                        Pages.accountSelectionModal(dummyAccounts.i().loggedInAccount(), "Select account type").then(
                            data => {
                                Pages.balanceModal(data);
                            }).catch(() => {});
                    });

                    m.addBtnListener("menu-logout", function() {
                        m.showLoader("Logging Out", Pages.thankYouPage());
                    });
                } else {
                    reject("This was bad");
                }
                resolve();
            }).catch(reject);
        });
    }
}
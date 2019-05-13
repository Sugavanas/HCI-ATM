import { Main as m, Main } from './../main';
import { s } from './../data/s';
import { NumPad } from './../numpad'
import {dummyAccounts, Account, AccountTypes} from './../data/account';

import { Pages } from '../pages';
import { DepositDetails } from './deposit.details';
import { DepositAccountNumber } from './deposit.accountnumber';
import { Withdraw } from './withdraw.amount';
import { TransferDetails } from './transfer.details';

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
                                m.showLoader("Loading", DepositAccountNumber.load());
                            }
                        })
                       
                    });

                    m.addBtnListener("menu-transfer", function(){
                        if(dummyAccounts.i().loggedInAccount().hasCurrentAccount && dummyAccounts.i().loggedInAccount().hasSavingsAccount)
                        {
                            Pages.depositSelection().then(data => {
                                Pages.accountSelectionModal(dummyAccounts.i().loggedInAccount(), "Select account type to transfer from").then(
                                    type => {
                                        if(data == "own")
                                            m.showLoader("Loading", TransferDetails.load(dummyAccounts.i().loggedInAccount(), (( type === AccountTypes.Current ? AccountTypes.Savings : AccountTypes.Current )), type));
                                        else
                                            m.showLoader("Loading", DepositAccountNumber.load(true, type)); 
                                    }).catch(() => {});
                            });
                        } else {
                            Pages.accountSelectionModal(dummyAccounts.i().loggedInAccount(), "Select account type to transfer from").then(
                                type => {
                                        m.showLoader("Loading", DepositAccountNumber.load(true, type)); 
                                }).catch(() => {});
                        }
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

                    m.addBtnListener("menu-others", function() {
                        $.toast({
                            text: s.functionUnavailable,
                            position: 'bottom-center',
                            stack: false,
                            allowToastClose: true
                        });
                    });

                    m.addBtnListener("menu-loans", function() {
                        $.toast({
                            text: s.functionUnavailable,
                            position: 'bottom-center',
                            stack: false,
                            allowToastClose: true
                        });
                    });

                    m.addDefaultCancelBtn();
                    
                    Menu.updateTIme();
                } else {
                    reject("This was bad");
                }
                resolve();
            }).catch(reject);
        });
    }

    static updateTIme(){
        var now = new Date();
        $("#displayTime").html(Menu.padTime(now.getHours()) + ':' + Menu.padTime(now.getMinutes())  + ':' + Menu.padTime(now.getSeconds()));
        setTimeout(function(){
            Menu.updateTIme(); //recursive
        }, 1000);
    }

    static padTime(value : number){
        var zero = 2 - value.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + value;
    }
}
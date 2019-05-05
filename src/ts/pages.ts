import { Main as m, Main } from './main';
import { s } from './data/s';
import {EnterPin} from './pages/enterpin';
import {dummyAccounts, Account, AccountTypes} from './data/account';
import { Menu } from './pages/menu';
import { DepositDetails } from './pages/deposit.details';
import { TransferDetails } from './pages/transfer,details';

export class Pages { //implements Page {
    static splash() : void
    {
        
        dummyAccounts.getInstance().loggedInAccount(dummyAccounts.getInstance().getAccountByPin("123456"));
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

    static depositConfirm(depositAccount : Account, depositAccountSelection : AccountTypes, depositAmount : string) : Promise<object>
    {
        var intDepositAmount = parseInt(depositAmount);
        var n100, n50, n20, n10, n5, n1;

        n100 = Math.floor((intDepositAmount) / 100);
        intDepositAmount -= (n100 * 100);
        n50 = Math.floor((intDepositAmount) / 50);
        intDepositAmount -= (n50 * 50);
        n20 = Math.floor((intDepositAmount) / 20);
        intDepositAmount -= (n20 * 20);
        n10 = Math.floor((intDepositAmount) / 10);
        intDepositAmount -= (n10 * 10);
        n5 = Math.floor((intDepositAmount) / 5);
        intDepositAmount -= (n5 * 5);
        n1 = Math.floor((intDepositAmount) / 1);


        return new Promise(function(resolve, reject){
            m.getAndLoad("deposit.confirm.html", {"AccountName" : depositAccount.displayName, 
                                                "AccountNumber" : depositAccount.accNumber, 
                                                "AccountObject" : JSON.stringify(depositAccount), 
                                                "depositTotal" : depositAmount, 
                                                "n100" : n100,
                                                "n50" : n50, 
                                                "n20" : n20, 
                                                "n10" : n10, 
                                                "n5" : n5,
                                                "n1" : n1})
            .then(() => {
                m.addDefaultCancelBtn("menu");

                m.addBtnListener("addCash", function() {
                    m.showLoader("Loading", DepositDetails.load(depositAccount, depositAccountSelection, depositAmount));
                });
                
                m.addBtnListener("confirmTransaction", function() {
                    m.showLoader("Processing", new Promise(function(resolve, reject) {

                        dummyAccounts.getInstance().addToBalance(depositAccount, depositAccountSelection, parseFloat(depositAmount));

                        //For Debugging
                        console.log("Deposit", depositAccount.accNumber, depositAccountSelection, depositAmount);
                        
                        Pages.takeReceipt().then(resolve).catch(reject);
                    }));
                });

                if(parseInt(depositAmount) >= 999999)
                    $("#addCash").attr("disabled", "true");

                resolve();
            }).catch(reject);
        });
    }

    static transferConfirm(toAccount : Account, toAccountType : AccountTypes, fromAccountType : AccountTypes, trasnferAmount : string) : Promise<object>
    {
        let fromAccount : Account = dummyAccounts.getInstance().loggedInAccount();
        return new Promise(function(resolve, reject){
            m.getAndLoad("transfer.confirm.html", {"AccountName" : toAccount.displayName, 
                                                "AccountNumber" : toAccount.accNumber, 
                                                "trasnferAmount" : trasnferAmount})
            .then(() => {
                m.addDefaultCancelBtn("menu");

                m.addBtnListener("editAmount", function() {
                    m.showLoader("Loading", TransferDetails.load(toAccount, toAccountType, fromAccountType, trasnferAmount));
                });
                
                m.addBtnListener("confirmTransaction", function() {
                    m.showLoader("Processing", new Promise(function(resolve, reject) {

                        dummyAccounts.getInstance().addToBalance(toAccount, toAccountType, parseFloat(trasnferAmount));
                        dummyAccounts.getInstance().addToBalance(fromAccount, fromAccountType, -parseFloat(trasnferAmount));

                        //For Debugging
                        console.log("Transfer", toAccount.accNumber, toAccountType, fromAccount.accNumber, fromAccountType, trasnferAmount);
                        
                        Pages.takeReceipt().then(resolve).catch(reject);
                    }));
                });

                if(parseInt(trasnferAmount) >= 999999)
                    $("#editAmount").attr("disabled", "true");

                resolve();
            }).catch(reject);
        });
    }

    static takeReceipt() : Promise<object>
    {
        return new Promise(function(resolve, reject){
            m.getAndLoad("result.html", {"Message" : s.takeReceipt})
            .then(() => {
               
                m.addBtnListener("resultNo", function() {
                    Pages.thankYouPage();
                });

                m.addBtnListener("resultYes", function() {
                    m.defaultCancelCallback("menu");
                });

                resolve();
            }).catch(reject);
        });
    }

    static thankYouPage() : void
    {
        console.log("balance", dummyAccounts.getInstance().loggedInAccount());
        m.getAndLoad("result.html", {"Message" : s.thankYou})
        .then(() => {
            setTimeout(() => {
                m.defaultCancelCallback();
            }, 10000);
        }).catch();
    }

    static accountSelection(a : Account) : Promise<AccountTypes>
    {
        return new Promise(function(resolve, reject) {
            if(!a.hasCurrentAccount)
                resolve(AccountTypes.Savings);
            else if(!a.hasSavingsAccount)
                resolve(AccountTypes.Current);
            else
            {
                var modalID = "accountSelectionModal-" + a.accNumber + Math.random().toString(36).substring(7);
                //show selection modal
                m.get("modal.accountselection.html").then(data => {
                    var code = Main.processTpl(data.toString(), {"accountSelectionModalID": modalID, "title" : "Select Savings or Current Account"});
                    $("#footer").append(code);

                    $("#" + modalID).modal('show');

                    $("#" + modalID).on('hidden.bs.modal', function () {
                        reject();
                    })

                    $("#" + modalID).find("#aSavings").on("click", function() {
                        console.log("savings");
                        resolve(AccountTypes.Savings);
                        $("#" + modalID).modal('hide');
                    });

                    $("#" + modalID).find("#aCurrent").on("click", function() {
                        console.log("current");
                        resolve(AccountTypes.Current);
                        $("#" + modalID).modal('hide');
                    });
                }).catch(error => { Main.loadErrorPage(error); reject(); })
            }
        });
       
    }
}
    

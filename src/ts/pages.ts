import { Main as m, Main } from './main';
import { s } from './data/s';
import {EnterPin} from './pages/enterpin';
import {dummyAccounts, Account, AccountTypes} from './data/account';
import { Menu } from './pages/menu';
import { DepositDetails } from './pages/deposit.details';
import { TransferDetails } from './pages/transfer.details';
import { Withdraw } from './pages/withdraw.amount';
import { DepositAccountNumber } from './pages/deposit.accountnumber';
import { CardlessLogin } from './pages/cardless.login';

export class Pages { //implements Page {

    static loadBackground()  : Promise<void>
    {
        return new Promise(function(resolve, reject) { 
            m.get("background.html").then(template => {
                $("body").removeClass("background");
                $("body").addClass("background").html($(template).filter('#tplContent').html());
                m.loadIncludes();
                resolve();
             });
        });
    }


    static splash() : void
    {/*
        dummyAccounts.i().loggedInAccount(dummyAccounts.i().getAccountByPin("123456"));
        Pages.depositConfirm(dummyAccounts.i().getAccount(dummyAccounts.i().getAccountByNumber("222222222")),  AccountTypes.Savings, "100");
        return;
        
        dummyAccounts.i().loggedInAccount(dummyAccounts.i().getAccountByPin("123456"));
        Menu.load().then();
        return; */
        m.getAndLoad("splash.html",  {"title" : "Some Bank"})
            .then(data => {
                m.addBtnListener("insertCard", function(){
                    Pages.languageModal().then(() => {
                        m.showLoader("Loading", EnterPin.load());
                    });
                });    
                m.addBtnListener("clearData", function(){
                    dummyAccounts.i().clear();
                });    
                m.addBtnListener("touchOverlay", function() {
                    Pages.languageModal().then(() => {
                        Pages.cardlessModal().then(data => {
                            if(data === "CDM")
                                m.showLoader("Loading", DepositAccountNumber.load());
                            else if(data === "ATM")
                                m.showLoader("Loading", CardlessLogin.load());   
                        }).catch(() => {});
                    });
                });
            })
            .catch(error => {
                m.loadErrorPage(error);
            });
    }

    static cardlessModal() : Promise<string>
    {
        return new Promise(function(resolve, reject){
            var modalID = "cardlessModal-" + Math.random().toString(36).substring(7);
            //show modal
            m.get("modal.cardless.html").then(data => {
                var code = Main.processTpl(data.toString(), {"cardlessModalID": modalID});
                $("#footer").append(code);

                $("#" + modalID).modal('show');

                $("#" + modalID).on('hidden.bs.modal', function () {
                    reject();
                    $(this).remove();
                })
                
                $("#" + modalID).find("#aATM").on("click", function() {
                    resolve("ATM");
                    $("#" + modalID).modal('hide');
                });
                
                $("#" + modalID).find("#aCDM").on("click", function() {
                    resolve("CDM");
                    $("#" + modalID).modal('hide');
                });
               
            }).catch(error => { Main.loadErrorPage(error); reject(); })
        });
    }

    static languageModal() : Promise<string>
    {
        return new Promise(function(resolve, reject){
            var modalID = "languangeModal-" + Math.random().toString(36).substring(7);
            //show modal
            m.get("modal.language.html").then(data => {
                var code = Main.processTpl(data.toString(), {"languageModalID": modalID});
                $("#footer").append(code);

                $("#" + modalID).modal('show');

                $("#" + modalID).on('hidden.bs.modal', function () {
                    reject();
                    $(this).remove();
                })
                
                $("#" + modalID).find("#aMalay").on("click", function() {
                    $.toast({
                        text: s.languageUnavailable,
                        position: 'bottom-center',
                        stack: false,
                        allowToastClose: true
                    });
                });
                
                $("#" + modalID).find("#aEnglish").on("click", function() {
                    resolve("english");
                    $("#" + modalID).modal('hide');
                });
               
            }).catch(error => { Main.loadErrorPage(error); reject(); })
        });
    }

    static depositSelection() : Promise<string>
    {
        return new Promise(function(resolve, reject){
            var modalID = "depositSelection-" + Math.random().toString(36).substring(7);
            //show modal
            m.get("modal.deposit.selection.html").then(data => {
                var code = Main.processTpl(data.toString(), {"depositSelectionModalID": modalID});
                $("#footer").append(code);

                $("#" + modalID).modal('show');

                $("#" + modalID).on('hidden.bs.modal', function () {
                    reject();
                    $(this).remove();
                })
                
                $("#" + modalID).find("#aOwnAccount").on("click", function() {
                    resolve("own");
                    $("#" + modalID).modal('hide');
                });
                
                $("#" + modalID).find("#aOther").on("click", function() {
                    resolve("other");
                    $("#" + modalID).modal('hide');
                });
               
            }).catch(error => { Main.loadErrorPage(error); reject(); })
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
            m.getAndLoad("deposit.confirm.html", {"AccountName" : depositAccount.fullName, 
                                                "AccountNumber" : dummyAccounts.i().getAccountNumberByType(depositAccount, depositAccountSelection), 
                                                "AccountObject" : JSON.stringify(depositAccount), 
                                                "depositTotal" : depositAmount, 
                                                "n100" : n100,
                                                "n50" : n50, 
                                                "n20" : n20, 
                                                "n10" : n10, 
                                                "n5" : n5,
                                                "n1" : n1,
                                                "t100" : (n100 * 100).toFixed(2),
                                                "t50" : (n50 * 50).toFixed(2),
                                                "t20" : (n20 * 20).toFixed(2),
                                                "t10" : (n10 * 10).toFixed(2),
                                                "t5" : (n5 * 5).toFixed(2),
                                                "t1" : (n1 * 1).toFixed(2)})
            .then(() => {
                m.addDefaultCancelBtn("menu");

                m.addBtnListener("addCash", function() {
                    m.showLoader("Loading", DepositDetails.load(depositAccount, depositAccountSelection, depositAmount));
                });
                
                m.addBtnListener("confirmTransaction", function() {
                    m.showLoader("Processing", new Promise(function(resolve, reject) {

                        dummyAccounts.i().addToBalance(depositAccount, depositAccountSelection, parseFloat(depositAmount));

                        //For Debugging
                        console.log("Deposit", dummyAccounts.i().getAccountNumberByType(depositAccount, depositAccountSelection), depositAccountSelection, depositAmount);
                        
                        Pages.takeReceiptPage().then(resolve).catch(reject);
                    }));
                });

                if(parseInt(depositAmount) >= 999999)
                    $("#addCash").attr("disabled", "true");

                resolve();
            }).catch(reject);
        });
    }

    static transferConfirm(toAccount : Account, toAccountType : AccountTypes, fromAccountType : AccountTypes, transferAmount : string) : Promise<object>
    {
        let fromAccount : Account = dummyAccounts.i().loggedInAccount();
        return new Promise(function(resolve, reject){
            m.getAndLoad("transfer.confirm.html", {"AccountName" : toAccount.fullName, 
                                                "AccountNumber" : dummyAccounts.i().getAccountNumberByType(toAccount, toAccountType), 
                                                "transferAmount" : transferAmount})
            .then(() => {
                m.addDefaultCancelBtn("menu");

                m.addBtnListener("editAmount", function() {
                    m.showLoader("Loading", TransferDetails.load(toAccount, toAccountType, fromAccountType, transferAmount.replace(".", "")));
                });
                
                m.addBtnListener("confirmTransaction", function() {
                    m.showLoader("Processing", new Promise(function(resolve, reject) {

                        dummyAccounts.i().addToBalance(toAccount, toAccountType, parseFloat(transferAmount));
                        dummyAccounts.i().addToBalance(fromAccount, fromAccountType, -parseFloat(transferAmount));

                        //For Debugging
                        console.log("Transfer",  dummyAccounts.i().getAccountNumberByType(toAccount, toAccountType), toAccountType, dummyAccounts.i().getAccountNumberByType(fromAccount, fromAccountType), fromAccountType, transferAmount);
                        
                        Pages.takeReceiptPage().then(resolve).catch(reject);
                    }));
                });

                if(parseInt(transferAmount) >= 999999)
                    $("#editAmount").attr("disabled", "true");

                resolve();
            }).catch(reject);
        });
    }

    static withdrawConfirmation(accountType : AccountTypes, withdrawAmount : string) : Promise<object>
    {
        let fromAccount : Account = dummyAccounts.i().loggedInAccount();
        return new Promise(function(resolve, reject){
             //do we need a confirmation page here? Maybe the MEPS fees thingy?

             dummyAccounts.i().addToBalance(fromAccount, accountType, -parseFloat(withdrawAmount));
            //For Debugging
            console.log("Withdraw", dummyAccounts.i().getAccountNumberByType(fromAccount, accountType), accountType, withdrawAmount);
            setTimeout(function() {
                Pages.askReceiptPage().finally(resolve);
            }, 500)
           
        });
    }

    static withdrawFastCashModal(accountType : AccountTypes) : Promise<number>
    {
        return new Promise(function(resolve, reject){
            var modalID = "fastCashModal-" + Math.random().toString(36).substring(7);
            //show modal
            m.get("modal.withdraw.fastcash.html").then(data => {
                var code = Main.processTpl(data.toString(), {"fastcashModalID": modalID, "title" : "Choose amount to withdraw"});
                $("#footer").append(code);

                $("#" + modalID).modal('show');

                $("#" + modalID).on('hidden.bs.modal', function () {
                    reject();
                    $(this).remove();
                })
                
                $("#" + modalID).find(".fastCash").each(function(){
                    $(this).on("click", function() {
                        var amount : number = parseFloat($(this).data("val"));
                        if(amount == 0)
                        {
                            m.showLoader("Loading", Withdraw.load(accountType)); 
                            $("#" + modalID).modal('hide');
                            resolve(0);
                        }
                        else
                        {
                            if(amount <= dummyAccounts.i().getAccountBalance(accountType))
                            {
                                m.showLoader("Processing", Pages.withdrawConfirmation(accountType, amount.toString()));
                                $("#" + modalID).modal('hide');
                                resolve(amount);
                            }
                            else
                            {
                                $.toast({
                                    text: s.lowBalance +  dummyAccounts.i().getAccountBalance(accountType).toFixed(2),
                                    position: 'bottom-center',
                                    stack: false,
                                    allowToastClose: true
                                });
                            }
                        }
                    });
                });
            }).catch(error => { Main.loadErrorPage(error); reject(); })
        });
    }

    static balanceModal(accountType : AccountTypes) : void
    {
        var modalID = "balanceModal-" + Math.random().toString(36).substring(7);
        var balanceAmount = dummyAccounts.i().getAccountBalance(accountType);
        m.get("modal.balance.html").then(data => {
            var code = Main.processTpl(data.toString(), {"balanceModalID": modalID, "title": "Balance", "balanceAmount" : balanceAmount.toFixed(2)});
            $("#footer").append(code);

            $("#" + modalID).modal('show');

            $("#" + modalID).on('hidden.bs.modal', function () {
                $(this).remove();
            })
            
            $("#" + modalID).find("#close").on("click", function(){
                $("#" + modalID).modal('hide');
            });
        }).catch(error => { Main.loadErrorPage(error);})
    }

    static askReceiptPage()  : Promise<object>
    {
        return new Promise(function(resolve, reject){
            m.getAndLoad("result.printreceipt.html", {})
                .then(() => {
                
                    m.addBtnListener("resultNo", function() {
                        Pages.takeReceiptPage(true);
                    });

                    m.addBtnListener("resultYes", function() {
                        Pages.takeReceiptPage(false);
                    });

                    resolve();
                }).catch(reject);
        });
    }

    static takeReceiptPage(noReceipt : boolean = false) : Promise<object>
    {
        return new Promise(function(resolve, reject){
                m.getAndLoad("result.html", {"hasReceipt" : (!noReceipt), "takeReceiptMessage" : s.takeReceipt, "isLoggedin" : dummyAccounts.isLoggedIn()})
                    .then(() => {
                    
                        m.addBtnListener("resultNo", function() {
                            Pages.thankYouPage();
                        });

                        m.addBtnListener("resultYes", function() {
                            m.defaultCancelCallback("menu");
                        });

                        if(!dummyAccounts.isLoggedIn())
                            setTimeout(function() {
                                Pages.thankYouPage();
                            }, 1000);

                        resolve();
                    }).catch(reject);
        });
    }

    static thankYouPage() : Promise<object>
    {
        return new Promise(function(resolve, reject){
            console.log("Balance", dummyAccounts.i().loggedInAccount());
            m.getAndLoad("logout.html", {"Message" : s.thankYou, "removeCardMessage": s.removeCard, "hasCard" : dummyAccounts.i().loggedInByCard})
            .then(() => {
                resolve();

                setTimeout(() => {                
                    Main.unbindKeyboardListener("");
                    location.reload();
                    Main.initialLoad();
                }, 2000);
            }).catch();
        });
    }

    static accountSelectionModal(a : Account, title : string) : Promise<AccountTypes>
    {
        return new Promise(function(resolve, reject) {
            if(!a.hasCurrentAccount)
                resolve(AccountTypes.Savings);
            else if(!a.hasSavingsAccount)
                resolve(AccountTypes.Current);
            else
            {
                var modalID = "accountSelectionModal-" + a.accNumberSavings + Math.random().toString(36).substring(7);
                //show selection modal
                m.get("modal.accountselection.html").then(data => {
                    var code = Main.processTpl(data.toString(), {"accountSelectionModalID": modalID, "title" : title});
                    $("#footer").append(code);

                    $("#" + modalID).modal('show');

                    $("#" + modalID).on('hidden.bs.modal', function () {
                        reject();
                        $(this).remove();
                    })

                    $("#" + modalID).find("#aSavings").on("click", function() {
                        resolve(AccountTypes.Savings);
                        $("#" + modalID).modal('hide');
                    });

                    $("#" + modalID).find("#aCurrent").on("click", function() {
                        resolve(AccountTypes.Current);
                        $("#" + modalID).modal('hide');
                    });
                }).catch(error => { Main.loadErrorPage(error); reject(); })
            }
        });
       
    }
}
    

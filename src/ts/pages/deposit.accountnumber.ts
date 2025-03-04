import { Main as m } from './../main';
import { s } from './../data/s';
import { NumPad } from './../numpad'
import { dummyAccounts, Account, AccountTypes } from './../data/account';
import { DepositDetails } from './deposit.details';
import { Pages } from '../pages';
import { TransferDetails } from './transfer.details';

export class DepositAccountNumber { //this page is used for both transfer and deposit
    static load(transfer : boolean = false, transferFromAccSelection : AccountTypes = null): Promise<object> {
        return new Promise(function (resolve, reject) {
           m.getAndLoad("deposit.accountnumber.html", 
                        {"transfer" : transfer,
                        "transferFromAccSelection" : JSON.stringify(transferFromAccSelection)})
           .then(() => {
                DepositAccountNumber.bindKeyboardListener();

                $("#accountNumber").on("change", function() {
                    var accNo : string = $(this).val().toString();
                    var i = 1;
                    
                    $(".accountNumberBox").each(function() {
                        $(this).html("");
                        if(i <= accNo.length)
                            $(this).html(accNo.charAt(i - 1));
                        i++
                    });

                    if(accNo.length >= DepositAccountNumber.accountNumber.minChar && accNo.length <= DepositAccountNumber.accountNumber.maxChar)
                        $("#confirmAccountNo").removeAttr("disabled");
                    else
                        $("#confirmAccountNo").attr("disabled", "true");
                });
                
                m.addBtnListener("accountNumberBoxes", function(){
                    m.unbindKeyboardListener("accountNumberBoxes");
                    DepositAccountNumber.accountNumber.openKeyPad();

                    $(".accountNumberBoxes").addClass("focus");

                    $(document).mouseup(function(e) 
                    {
                        $(".accountNumberBoxes").removeClass("focus");
                        $(document).unbind("mouseup");
                    });
                });

                m.addBtnListener("confirmAccountNo", function(){
                    DepositAccountNumber.accountNumber.confirm();
                });

                m.addBtnListener("clearAccountNo", function(){
                    DepositAccountNumber.accountNumber.clear();
                });
                
                if(dummyAccounts.isLoggedIn())
                    m.addDefaultCancelBtn("menu");
                else
                    m.addDefaultCancelBtn();

                m.addNumPadToolTip("accountNumberBoxes");

                resolve();
           });
        });
    }

    static cancel() : void
    {
        m.unbindKeyboardListener("accountNumberBoxes");
        m.defaultCancelCallback();
    }

    static bindKeyboardListener() : void
    {
        m.bindKeyboardListener("accountNumberBoxes", function(key) {
          
            if(key >= 48 &&  key <= 57) //48 is 0 and 57 is 1
                DepositAccountNumber.accountNumber.add(String.fromCharCode(key));
            else if(key === 8)
                DepositAccountNumber.accountNumber.backspace();
            else if(key === 13)
                DepositAccountNumber.accountNumber.confirm();
            else
            {
                $.toast({
                    text: s.eNumbers,
                    position: 'bottom-center',
                    stack: false,
                    allowToastClose: true
                })
            }
        });
    }

    static accountNumber = class
    {
        static minChar = 9;
        static maxChar = 9;

        static openKeyPad() : void
        {
            new NumPad("accountNumberBoxes", "Enter Pin", $("#accountNumber").val().toString(), DepositAccountNumber.accountNumber.minChar, DepositAccountNumber.accountNumber.maxChar, false, false, false, function(){
                DepositAccountNumber.bindKeyboardListener();
            }, true,  DepositAccountNumber.accountNumber.add, DepositAccountNumber.accountNumber.backspace, DepositAccountNumber.accountNumber.clear, DepositAccountNumber.accountNumber.confirm, DepositAccountNumber.cancel);
        }

        static add(val) : void
        {
            var pin : string =  $("#accountNumber").val().toString();
            if(pin.length < DepositAccountNumber.accountNumber.maxChar) // not more than max
                $("#accountNumber").val(pin + val).trigger('change');;
        }

        static backspace() : void
        {
            $("#accountNumber").val(
                function(index, value){
                    return value.substr(0, value.length - 1);
            }).trigger('change');
        }

        static confirm() : void
        {
            $("#error").css("display", "none");
            var accountNumber : string =  $("#accountNumber").val().toString();
            let transfer : boolean = ($("#depositOrTransfer").val().toString() == "true");
            let transferFromAccSelection : AccountTypes =  (transfer ? JSON.parse($("#transferFromAccSelection").val().toString()) : null);
            if(accountNumber.length >= DepositAccountNumber.accountNumber.maxChar)
            {
                m.showLoader("Processing", new Promise(function(resolve, reject) {
                    let a : number = dummyAccounts.i().getAccountByNumber(accountNumber);
                    if(a == -1)
                    {
                        //show error
                        setTimeout(() => {
                            $("#error").html("Invalid Account Number. Please try again.").css("display", "block");
                            DepositAccountNumber.accountNumber.clear();
                            resolve();
                        }, (500));
                    }
                    else
                    {
                        m.unbindKeyboardListener("accountNumberBoxes");
                        let account : Account = dummyAccounts.i().getAccount(a);
                    
                        if(transfer)
                            TransferDetails.load(account, dummyAccounts.i().getTypeByAccountNumber(accountNumber), transferFromAccSelection).finally(resolve);
                        else
                            DepositDetails.load(account, dummyAccounts.i().getTypeByAccountNumber(accountNumber)).finally(resolve);  
                    } 
                }));
            }
        }

        static clear() : void
        {
            $("#accountNumber").val("").trigger('change');
        }
    }
}
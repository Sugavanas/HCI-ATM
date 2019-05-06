import { Main as m } from './../main';
import { s } from './../data/s';
import { NumPad } from './../numpad'
import { dummyAccounts, Account, AccountTypes } from './../data/account';
import { DepositDetails } from './deposit.details';
import { Pages } from '../pages';
import { TransferDetails } from './transfer.details';
import { EnterPin } from './enterpin';

export class CardlessLogin { //this page is used for both transfer and deposit
    static load(): Promise<object> {
        return new Promise(function (resolve, reject) {
           m.getAndLoad("deposit.accountnumber.html", 
                        {})
           .then(() => {
                CardlessLogin.bindKeyboardListener();

                $("#accountNumber").on("change", function() {
                    var accNo : string = $(this).val().toString();
                    var i = 1;
                    
                    $(".accountNumberBox").each(function() {
                        $(this).html("");
                        if(i <= accNo.length)
                            $(this).html(accNo.charAt(i - 1));
                        i++
                    });

                    if(accNo.length >= CardlessLogin.accountNumber.minChar && accNo.length <= CardlessLogin.accountNumber.maxChar)
                        $("#confirmAccountNo").removeAttr("disabled");
                    else
                        $("#confirmAccountNo").attr("disabled", "true");
                });
                
                m.addBtnListener("accountNumberBoxes", function(){
                    m.unbindKeyboardListener("accountNumberBoxes");
                    CardlessLogin.accountNumber.openKeyPad();

                    $(".accountNumberBoxes").addClass("focus");

                    $(document).mouseup(function(e) 
                    {
                        $(".accountNumberBoxes").removeClass("focus");
                        $(document).unbind("mouseup");
                    });
                });

                m.addBtnListener("confirmAccountNo", function(){
                    CardlessLogin.accountNumber.confirm();
                });

                m.addBtnListener("clearAccountNo", function(){
                    CardlessLogin.accountNumber.clear();
                });
                
                m.addDefaultCancelBtn();
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
                CardlessLogin.accountNumber.add(String.fromCharCode(key));
            else if(key === 8)
                CardlessLogin.accountNumber.backspace();
            else if(key === 13)
                CardlessLogin.accountNumber.confirm();
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
            new NumPad("accountNumberBoxes", "Enter Account Number", $("#accountNumber").val().toString(), CardlessLogin.accountNumber.minChar, CardlessLogin.accountNumber.maxChar, false, false, false, function(){
                CardlessLogin.bindKeyboardListener();
            }, true,  CardlessLogin.accountNumber.add, CardlessLogin.accountNumber.backspace, CardlessLogin.accountNumber.clear, CardlessLogin.accountNumber.confirm, CardlessLogin.cancel);
        }

        static add(val) : void
        {
            var pin : string =  $("#accountNumber").val().toString();
            if(pin.length < CardlessLogin.accountNumber.maxChar) // not more than max
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
            m.showLoader("Processing", new Promise(function(resolve, reject) {
                var accountNumber : string =  $("#accountNumber").val().toString();
                if(accountNumber.length >= CardlessLogin.accountNumber.maxChar)
                {
                    let a : number = dummyAccounts.i().getAccountByNumber(accountNumber);
                    if(a == -1)
                    {
                        //show error
                        setTimeout(() => {
                            $("#error").html("Invalid Account Number. Please try again.").css("display", "block");
                            CardlessLogin.accountNumber.clear();
                            resolve();
                        }, (500));
                    }
                    else
                    {
                        m.unbindKeyboardListener("accountNumberBoxes");
                        EnterPin.load(accountNumber).then(resolve).catch(reject);                 
                    }
                }
            }));
           
        }

        static clear() : void
        {
            $("#accountNumber").val("").trigger('change');
        }
    }
}
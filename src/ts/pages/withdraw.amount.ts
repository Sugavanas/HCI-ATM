import { Main as m } from '../main';
import { s } from '../data/s';
import { NumPad } from '../numpad'
import {dummyAccounts, Account, AccountTypes} from '../data/account';
import { Pages } from '../pages';

export class Withdraw {
    static load(accountType : AccountTypes) : Promise<object>
    {
        return new Promise(function(resolve, reject){
            
            m.getAndLoad("withdraw.insertamount.html", { "AccountType" : JSON.stringify(accountType),
                                                        "AccountObject" : dummyAccounts.i().loggedInAccount()})
            .then(() => {
                m.addDefaultCancelBtn("menu");
            
                Withdraw.bindKeyBoardListener();

                $("#inputAmount").on("change", function() {
                    var val = $("#inputAmount").val().toString();
                    var amount = parseFloat(val);

                    if(isNaN(amount))
                        amount = 0;
                                        
                    $("#inputAmountMask").val("RM " + amount.toFixed(2));

                    if((val.length) >= Withdraw.Amount.minChar && (val.length) <= Withdraw.Amount.maxChar)
                        $("#confirmAmount").removeAttr("disabled");
                    else
                        $("#confirmAmount").attr("disabled", "true");
        
                }).trigger("change");

                m.addBtnListener("inputAmountMask", function() {
                    m.unbindKeyboardListener("withdrawAmount");
                    new NumPad("insertWithdrawAmountNumPad", "Enter Amount to withdraw",  $("#inputAmount").val().toString(), Withdraw.Amount.minChar, Withdraw.Amount.maxChar, false, true, false, function(){
                        Withdraw.bindKeyBoardListener();
                    }, true, Withdraw.Amount.add, Withdraw.Amount.backspace, Withdraw.Amount.clear, Withdraw.Amount.confirm, 
                    function() { m.defaultCancelCallback("menu"); });
                });

                m.addBtnListener("confirmAmount", Withdraw.Amount.confirm);
                m.addBtnListener("clearAmount",  Withdraw.Amount.clear);
                resolve();
            }).catch(reject);
        });
    }

    static bindKeyBoardListener()
    {
        m.bindKeyboardListener("withdrawAmount", function(key){
            if(key >= 48 &&  key <= 57) //48 is 0 and 57 is 1
                Withdraw.Amount.add(String.fromCharCode(key));
            else if(key === 8)
                Withdraw.Amount.backspace();
            else if(key === 13)
                Withdraw.Amount.confirm();
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

    static Amount = class
    {
        static minChar = 1;
        static maxChar = 6;

        static add(val) 
        {
            var amount : string = $("#inputAmount").val().toString();
            if(amount.length < Withdraw.Amount.maxChar)
            {
                $("#inputAmount").val(amount + val).trigger("change");
            }
            else
                $.toast({
                    text: s.maxChars,
                    position: 'bottom-center',
                    stack: false,
                    allowToastClose: true
                })
        }

        static clear()
        {
            $("#inputAmount").val("").trigger("change");
        }

        static backspace()
        {
            $("#inputAmount").val(
                function(index, value){
                    return value.substr(0, value.length - 1);
            }).trigger('change');
        }

        static confirm()
        {
            var val = $("#inputAmount").val().toString();    
            let accountType : AccountTypes = JSON.parse($("#withdrawAccountType").val().toString());
            if(val.length >= Withdraw.Amount.minChar && val.length <= Withdraw.Amount.maxChar)
            {
                var total = parseFloat(val);

                if(total < 1000000)
                {
                    if(total <= dummyAccounts.i().getAccountBalance(accountType))
                    {
                        m.unbindKeyboardListener("withdrawAmount");
                        m.showLoader("Processing", Pages.withdrawConfirmation(accountType, total.toString()));
                    }
                    else
                    {
                        $.toast({
                            text: s.lowBalance +  dummyAccounts.i().getAccountBalance(accountType),
                            position: 'bottom-center',
                            stack: false,
                            allowToastClose: true
                        });
                    }
                }
                else
                {
                    $.toast({
                        text: s.maxAmount,
                        position: 'bottom-center',
                        stack: false,
                        allowToastClose: true
                    });
                }
            }
            else
            {
                //Should never come to this but just in case.
                $.toast({
                    text: s.unexpected,
                    position: 'bottom-center',
                    stack: false,
                    allowToastClose: true
                });
                $("#inputAmount").val("").trigger("change");
            }
        }
    }
}
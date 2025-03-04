import { Main as m } from '../main';
import { s } from '../data/s';
import { NumPad } from '../numpad'
import {dummyAccounts, Account, AccountTypes} from '../data/account';
import { Pages } from '../pages';

export class TransferDetails {
    static load(toAccount : Account, toAccountType : AccountTypes, fromAccountType : AccountTypes, oldAmount : any = 0) : Promise<object>
    {
        return new Promise(function(resolve, reject){
            
            m.getAndLoad("transfer.insertamount.html", { "toAccountObject" : toAccount,
                                                        "toAccountObjectJSON" : JSON.stringify(toAccount),
                                                        "toAccountType" : JSON.stringify(toAccountType),
                                                        "fromAccountType" : JSON.stringify(fromAccountType),
                                                        "fromAccountObject" : dummyAccounts.i().loggedInAccount(),
                                                        "toAccountNumber" : dummyAccounts.i().getAccountNumberByType(toAccount, toAccountType)})
            .then(() => {
                if(oldAmount === 0)
                    m.addDefaultCancelBtn("menu");
                else
                    m.addCancelBtn(function() {
                        m.showLoader("Loading", Pages.transferConfirm(toAccount, toAccountType, fromAccountType, parseFloat((oldAmount.substr(0, oldAmount.length - 2) + "." +  oldAmount.substr(oldAmount.length - 2))).toFixed(2).toString()));
                    }, "Go Back");
            
                TransferDetails.bindKeyBoardListener();

                $("#inputAmount").on("change", function() {
                    var val = $("#inputAmount").val().toString();
                  
                    if(val.length <= 2)
                        val = "0" + val;
                    
                    val = val.substr(0, val.length - 2) + "." +  val.substr(val.length - 2);
                    var amount = parseFloat(val);

                    if(isNaN(amount))
                        amount = 0;
                                        
                    $("#inputAmountMask").val("RM " + amount.toFixed(2));

                    if((val.length - 1) >= TransferDetails.transferAmount.minChar && (val.length - 1) <= TransferDetails.transferAmount.maxChar)
                        $("#confirmAmount").removeAttr("disabled");
                    else
                        $("#confirmAmount").attr("disabled", "true");
        
                }).trigger("change"); //.val(oldAmount).trigger("change");

                m.addBtnListener("inputAmountMask", function() {
                    m.unbindKeyboardListener("transferAmount");
                    new NumPad("insertAmountNumPad", "Enter Amount to transfer",  $("#inputAmount").val().toString(), TransferDetails.transferAmount.minChar, TransferDetails.transferAmount.maxChar, false, true, true, function(){
                        TransferDetails.bindKeyBoardListener();
                    }, true, TransferDetails.transferAmount.add, TransferDetails.transferAmount.backspace, TransferDetails.transferAmount.clear, TransferDetails.transferAmount.confirm, 
                    function() { m.defaultCancelCallback("menu"); });
                });

                m.addBtnListener("confirmAmount", TransferDetails.transferAmount.confirm);
                m.addBtnListener("clearAmount",  TransferDetails.transferAmount.clear);

                m.addNumPadToolTip("inputAmountMask");

                resolve();
            }).catch(reject);
        });
    }

    static bindKeyBoardListener()
    {
        m.bindKeyboardListener("transferAmount", function(key){
            if(key >= 48 &&  key <= 57) //48 is 0 and 57 is 1
                TransferDetails.transferAmount.add(String.fromCharCode(key));
            else if(key === 8)
                TransferDetails.transferAmount.backspace();
            else if(key === 13)
                TransferDetails.transferAmount.confirm();
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

    static transferAmount = class
    {
        static minChar = 1;
        static maxChar = 8;

        static add(val) 
        {
            var amount : string = $("#inputAmount").val().toString();
            if(amount.length < TransferDetails.transferAmount.maxChar)
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
            let toAccount : Account = JSON.parse($("#transferToAccount").val().toString());
            let toAccountType : AccountTypes = JSON.parse($("#transferToAccountType").val().toString());            
            let fromAccountType : AccountTypes = JSON.parse($("#transferFromAccountType").val().toString());
            if(val.length >= TransferDetails.transferAmount.minChar && val.length <= TransferDetails.transferAmount.maxChar)
            {

                var total = parseFloat((val.substr(0, val.length - 2) + "." +  val.substr(val.length - 2)));

                if(total < 1000000)
                {
                    if(total <= dummyAccounts.i().getAccountBalance(fromAccountType))
                    {
                        m.unbindKeyboardListener("transferAmount");
                        m.showLoader("Processing", Pages.transferConfirm(toAccount, toAccountType, fromAccountType, total.toFixed(2).toString()));
                    }
                    else
                    {
                        $.toast({
                            text: s.lowBalance +  dummyAccounts.i().getAccountBalance(fromAccountType).toFixed(2),
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
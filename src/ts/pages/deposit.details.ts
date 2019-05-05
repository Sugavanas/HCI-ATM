import { Main as m } from '../main';
import { s } from '../data/s';
import { NumPad } from '../numpad'
import {dummyAccounts, Account, AccountTypes} from '../data/account';
import { Pages } from '../pages';

export class DepositDetails {
    static load(depositAccount : Account, depositAccountSelection : AccountTypes,  transfer : boolean = false, transferFromAccSelection : AccountTypes = null, oldAmount : any = 0) : Promise<object>
    {
        //Don't need to validate depositAccount as it most probably exists.
        return new Promise(function(resolve, reject){
            
            m.getAndLoad("deposit.insertamount.html", {"AccountName" : depositAccount.displayName, 
                                                        "AccountNumber" : depositAccount.accNumber,
                                                        "AccountObject" : JSON.stringify(depositAccount),
                                                        "AccountSelection" : JSON.stringify(depositAccountSelection),
                                                        "OldAmount" : (transfer ? false : oldAmount), //if transfer is true, then there is no old amount, it's used for edit
                                                        "transfer" : transfer,
                                                        "transferFromAccSelection" : JSON.stringify(transferFromAccSelection)})
            .then(() => {
                m.addDefaultCancelBtn("menu");
            
                DepositDetails.bindKeyBoardListener();

                $("#inputAmount").on("change", function() {
                    var val = $("#inputAmount").val().toString();
                    var amount = parseFloat(val);

                    if(isNaN(amount))
                        amount = 0;

                    $("#inputAmountMask").val(amount.toFixed(2));

                    if(val.length >= DepositDetails.depsoitAmount.minChar && val.length <= DepositDetails.depsoitAmount.maxChar)
                        $("#confirmAmount").removeAttr("disabled");
                    else
                        $("#confirmAmount").attr("disabled", "true");
        
                }).trigger("change");

                if(transfer)
                    $("#inputAmount").val(oldAmount).trigger("change");

                m.addBtnListener("inputAmountMask", function() {
                    m.unbindKeyboardListener("depositAmount");
                    new NumPad("insertAmountNumPad", "Enter Amount to deposit/transfer",  $("#inputAmount").val().toString(), DepositDetails.depsoitAmount.minChar, DepositDetails.depsoitAmount.maxChar, false, true, false, function(){
                        DepositDetails.bindKeyBoardListener();
                    }, true, DepositDetails.depsoitAmount.add, DepositDetails.depsoitAmount.backspace, DepositDetails.depsoitAmount.clear, DepositDetails.depsoitAmount.confirm, 
                    function() { m.defaultCancelCallback("menu"); });
                });

                m.addBtnListener("confirmAmount", DepositDetails.depsoitAmount.confirm);
                resolve();
            }).catch(reject);
        });
    }

    static bindKeyBoardListener()
    {
        m.bindKeyboardListener("depositAmount", function(key){
            if(key >= 48 &&  key <= 57) //48 is 0 and 57 is 1
                DepositDetails.depsoitAmount.add(String.fromCharCode(key));
            else if(key === 8)
                DepositDetails.depsoitAmount.backspace();
            else if(key === 13)
                DepositDetails.depsoitAmount.confirm();
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

    static depsoitAmount = class
    {
        static minChar = 1;
        static maxChar = 6;

        static add(val) 
        {
            var amount = $("#inputAmount").val();
            if(amount.toString().length < DepositDetails.depsoitAmount.maxChar)
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
            let account : Account = JSON.parse($("#depositAccountNumber").val().toString());
            let accountSelection : AccountTypes = JSON.parse($("#depositAccountSelection").val().toString());
            let transfer : boolean = ($("#depositOrTransfer").val().toString() == "true");
            let transferFromAccSelection : AccountTypes =  (transfer ? JSON.parse($("#transferFromAccSelection").val().toString()) : null);
            if(val.length >= DepositDetails.depsoitAmount.minChar && val.length <= DepositDetails.depsoitAmount.maxChar)
            {
                var total = parseInt(val);
                if($("#depositOldAmount").length)
                {
                    var oldAmount =$("#depositOldAmount").val().toString();
                    total += parseInt(oldAmount);
                }   

                if(total < 1000000)
                {
                    if(transfer && ( 
                        (transferFromAccSelection == AccountTypes.Savings && dummyAccounts.getInstance().loggedInAccount().savingAccountBalance < total) ||
                        (transferFromAccSelection == AccountTypes.Current && dummyAccounts.getInstance().loggedInAccount().currentAccountBalance < total)))
                    {
                        $.toast({
                            text: s.lowBalance,
                            position: 'bottom-center',
                            stack: false,
                            allowToastClose: true
                        });
                    }
                    else 
                    {
                        m.unbindKeyboardListener("depositAmount");
                        m.showLoader("Processing", Pages.depositConfirm(account, accountSelection, transfer, transferFromAccSelection, total.toString()));
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
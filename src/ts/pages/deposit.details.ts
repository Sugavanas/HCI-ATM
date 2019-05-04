import { Main as m, Main } from '../main';
import { s } from '../data/s';
import { NumPad } from '../numpad'
import {dummyAccounts, Account} from '../data/account';

export class DepositDetails {
    static load(depositAccount : Account) : Promise<object>
    {
        //Don't need to validate depositAccount as it most probably exists.
        return new Promise(function(resolve, reject){
            m.getAndLoad("deposit.insertamount.html", {"AccountName" : depositAccount.displayName, "AccountNumber" : depositAccount.accNumber})
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

                $("#inputAmountMask").on("click", function() {
                    m.unbindKeyboardListener("depositAmount");
                    new NumPad("insertAmountNumPad", "Enter Amount to deposit/transfer",  $("#inputAmount").val().toString(), DepositDetails.depsoitAmount.minChar, DepositDetails.depsoitAmount.maxChar, false, true, false, function(){
                        DepositDetails.bindKeyBoardListener();
                    }, true, DepositDetails.depsoitAmount.add, DepositDetails.depsoitAmount.backspace, DepositDetails.depsoitAmount.clear, DepositDetails.depsoitAmount.confirm);
                });

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
        static maxChar = 10;

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

        }
    }
}
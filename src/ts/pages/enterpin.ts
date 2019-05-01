import { Main as m } from './../main';
import { s } from './../s';
import { NumPad } from './../numpad'

export class EnterPin
{
    static load() : Promise<object>
    {
        return new Promise(function(resolve, reject){
            m.getAndLoad("enterpin.html",  []).then(data => {
                EnterPin.bindKeyboardListener();

                $("#pinNumber").on("change", function() {
                    var pin : string = $(this).val().toString();
                    var i = 1;
                    //looping every time there is a change is not the best way to do it, but who cares
                    $(".pinBox").each(function() {
                        $(this).css("background-image", "");
                        if(i <= pin.length)
                            $(this).css("background-image", "radial-gradient(circle at center, #fff 5px, transparent 6px)");
                        
                        i++
                    });

                    if(pin.length >= EnterPin.pinNumber.minChar && pin.length <= EnterPin.pinNumber.maxChar)
                        $("#confirmPin").removeAttr("disabled");
                    else
                        $("#confirmPin").attr("disabled", "true");
                });
                
                m.addBtnListener("pinBoxes", function(){
                    m.unbindKeyboardListener("pinBoxes");

                EnterPin.pinNumber.openKeyPad();

                    //simple hack to highlight the div
                    $(".pinBoxes").addClass("focus");
                    $(document).mouseup(function(e) 
                    {
                        $(".pinBoxes").removeClass("focus");
                        $(document).unbind("mouseup");
                    });
                });

                m.addBtnListener("confirmPin", function(){
                    EnterPin.pinNumber.confirm();
                });

                m.addBtnListener("clearPin", function(){
                    EnterPin.pinNumber.clear();
                });
                
                m.addCancelBtn(function() {
                    EnterPin.cancel();
                })
               
                     
            }).catch(error => reject(error));
        });
    }

    static cancel() : void
    {
        m.initialLoad();
    }

    static bindKeyboardListener() : void
    {
        m.bindKeyboardListener("pinBoxes", function(key) {
          
            if(key >= 48 &&  key <= 57) //48 is 0 and 57 is 1
                EnterPin.pinNumber.add(String.fromCharCode(key));
            else if(key === 8)
                EnterPin.pinNumber.backspace();
            else if(key === 13)
                EnterPin.pinNumber.confirm();
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

    static pinNumber = class
    {
        static minChar = 6;
        static maxChar = 6;

        static openKeyPad() : void
        {
            new NumPad("pinBoxes", "Enter Pin", $("#pinNumber").val().toString(), EnterPin.pinNumber.minChar, EnterPin.pinNumber.maxChar, true, false, false, function(){
                EnterPin.bindKeyboardListener();
            }, true,  EnterPin.pinNumber.add, EnterPin.pinNumber.backspace, EnterPin.pinNumber.clear, EnterPin.pinNumber.confirm, EnterPin.cancel);
        }

        static add(val) : void
        {
            var pin : string =  $("#pinNumber").val().toString();
            if(pin.length < EnterPin.pinNumber.maxChar) // not more than max
                $("#pinNumber").val(pin + val).trigger('change');;
        }

        static backspace() : void
        {
            $("#pinNumber").val(
                function(index, value){
                    return value.substr(0, value.length - 1);
            }).trigger('change');
        }

        static confirm() : void
        {
            var pin : string =  $("#pinNumber").val().toString();
            if(pin.length >= EnterPin.pinNumber.maxChar)
            {
                if(pin == "123456")
                {
                    console.log("verified");
                }
                else
                {
                    //show error
                }
            }
        }

        static clear() : void
        {
            $("#pinNumber").val("").trigger('change');
        }
    }
}
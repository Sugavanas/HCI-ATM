import { Main as m } from './../main';
import { s } from './../s';
import { NumPad } from './../numpad'

export class EnterPin
{
    static load() : void
    {
        m.getAndLoad("enterpin.html",  [], function() {
            EnterPin.bindKeyboardListener();

            $("#pinNumber").on("change", function() {
                var pin : string = $(this).val().toString();

                var i = 1;
                //looping every time there is a change is not the best way to do it, but who cares
                $(".pinBox").each(function() {
                    $(this).css("background-image", "");

                    if(i <= pin.length)
                    {
                        $(this).css("background-image", "radial-gradient(circle at center, #fff 5px, transparent 6px)");
                    }
                    i++
                });
            });
            
            m.addBtnListener("pinBoxes", function(){
                m.unbindKeyboardListener("pinBoxes");

                NumPad.load("pinBoxes", "Enter Pin", $("#pinNumber").val().toString(), 6, 6, true, false, false, function(){
                    EnterPin.bindKeyboardListener();
                },  EnterPin.pinNumber.add, EnterPin.pinNumber.backspace, EnterPin.pinNumber.clear, EnterPin.pinNumber.confirm );

                //simple hack to highlight the div
                $(".pinBoxes").addClass("focus");
                $(document).mouseup(function(e) 
                {
                    $(".pinBoxes").removeClass("focus");
                    $(document).unbind("mouseup");
                });
            });    
        });
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
        static add(val) : void
        {
            var pin : string =  $("#pinNumber").val().toString();
            if(pin.length < 6) // not more than 5
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
            if(pin.length >= 6)
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

        }
    }
}
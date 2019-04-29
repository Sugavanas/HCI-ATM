import { Main as m } from './../main';
import { s } from './../s';

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
                m.unbindKeyboardListener();
                m.loadNumberPad();



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
        m.bindKeyboardListener(function(key) {
            var pin : string =  $("#pinNumber").val().toString();
            if(key >= 48 &&  key <= 57) //48 is 0 and 57 is 1
            {
                if(pin.length < 6) // not more than 5
                    $("#pinNumber").val( pin + (String.fromCharCode(key))).trigger('change');;
            }
            else if(key === 8)
            {
                $("#pinNumber").val(
                    function(index, value){
                        return value.substr(0, value.length - 1);
                }).trigger('change');
            }
            else if(key === 13)
            {
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
}
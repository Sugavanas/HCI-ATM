import { Main } from './main';
import { s } from './s';

export class NumPad{
    static load(id:string, title : string, initialVal : string = "", min = 0, max = 100, isPassword : boolean = false, 
        decimal : boolean = false, allowCents : boolean = false, close? : Function,
        add? : Function, backspace? : Function, clear? : Function, confirm? : Function, cancel? : Function) : void
    { 
        var modalID = "numPadModal-" + id;
        
        if(add == null)
            add = function() {};
        if(backspace == null)
            backspace = function() {};
        if(clear == null)
            clear = function() {};
        if(confirm == null)
            confirm = function() {};
        if(cancel == null)
            cancel = function() {};
        if(close == null)
            cancel = function() {};

        $.get("/includes/numpad.html", function(template){
            var code = Main.processTpl(template, {"numPadModalID": modalID, "numPadModalTitle" : title});
            
            $("#numPadTemplate").append(code);
          
            //show the modal on screen
            $("#" + modalID).modal('show');

            //remove modal code from body when it goes off screen.
            $("#" + modalID).on('hidden.bs.modal', function () {
                Main.unbindKeyboardListener(id);
                close();
                $(this).remove();
            })

            var numPadInput =  $("#" + modalID).find("#numPadInput");
           
            Main.bindKeyboardListener(id, function(key) {
                    if(key >= 48 &&  key <= 57) //48 is 0 and 57 is 1
                        NumPad.numPadAdd(String.fromCharCode(key), numPadInput, max, add);
                    else if(key === 8)
                        backspace()
                    else if(key === 13)
                        confirm();
                    else if(key === 27)
                        cancel();
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

            if(isPassword)
            {
                numPadInput.on("change", function(){
                    $("#" + modalID).find("#numPadInputMask").val(numPadInput.val().toString().replace(/[\S]/g, "*"));
                });
            }

            numPadInput.on("change", function(){
                var val = $(this).val().toString();

                if(val.length < min || val.length > max)
                {
                    //disable confirm button
                }
                else
                {
                    
                }
            });

            $("#" + modalID).find(".numPadConfirm").on("click", function(){
                confirm();
            });

            $("#" + modalID).find(".numPadClear").on("click", function(){
                confirm();
            });

            $("#" + modalID).find(".numPadCancel").on("click", function(){
                confirm();
            });

            $("#" + modalID).find(".numPadBackSpace").on("click", function(){
                NumPad.numPadBackspace(numPadInput, backspace);
            });

            //When number is pressed, pass number to add function
            $("#" + modalID).find(".numPadKeyNumber").each(function() {
                $(this).on("click", function(){
                    NumPad.numPadAdd($(this).data("val"), numPadInput, max, add);
                });
            });


            numPadInput.val(initialVal).trigger("change");
        });
    }

    private static numPadAdd(val, numPadInput, max, add : Function)
    {
        if(numPadInput.val().toString().length < max) // <= (max - 1)
        {
            $('.numPadKeyNumber[data-val="'+val+'"]').addClass("hovered");
            setTimeout(function() {
                $('.numPadKeyNumber[data-val="'+val+'"]').removeClass("hovered");
            }, 200);

            add(val);
            numPadInput.val(numPadInput.val() + val).trigger("change");
        }
    }

    private static numPadBackspace(numPadInput, backspace : Function)
    {
        numPadInput.val(
            function(index, value){
                return value.substr(0, value.length - 1);
        }).trigger('change');
        backspace();
    }

}
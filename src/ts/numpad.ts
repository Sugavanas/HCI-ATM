import { Main } from './main';
import { s } from './data/s';

export class NumPad{
    private modalID : string;
    private numPadInput;

    constructor(private id:string, private title : string, private initialVal : string = "", private min = 0, private max = 100, private isPassword : boolean = false, 
                private isDecimal : boolean = false, private allowCents : boolean = false, private closeC? : Function, private autoDestruct : boolean = false,
                private addC? : Function, private backspaceC? : Function, private clearC? : Function, private confirmC? : Function, private cancelC? : Function)
    { 
        this.modalID = "numPadModal-" + id;
        var instance = this;

        if(addC == null)
            addC = function() {};
        if(backspaceC == null)
            backspaceC = function() {};
        if(clearC == null)
            clearC = function() {};
        if(confirmC == null)
            confirmC = function() {};
        if(cancelC == null)
            cancelC = function() {};
        if(closeC == null)
            closeC = function() {};

        $.get("/includes/numpad.html", function(template){
            var code = Main.processTpl(template, {"numPadModalID": instance.modalID, "numPadModalTitle" : title});
            
            $("#numPadTemplate").append(code);
          
            //show the modal on screen
            instance.show();

            //remove modal code from body when it goes off screen.
            $("#" + instance.modalID).on('hidden.bs.modal', function () {
                instance.destruct();
            })

            instance.numPadInput =  $("#" + instance.modalID).find("#numPadInput");
           
            Main.bindKeyboardListener(id, function(key) {
                    if(key >= 48 &&  key <= 57) //48 is 0 and 57 is 1
                    {
                        instance.highlightKeysWhileTyping(String.fromCharCode(key));
                        instance.add(String.fromCharCode(key));
                    }
                    else if(key === 8)
                    instance.backspace()
                    else if(key === 13)
                        confirmC();
                    else if(key === 27)
                        cancelC();
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

        
            instance.numPadInput.on("change", function(){
                var val = $(this).val().toString();
                if(isPassword)
                    $("#" + instance.modalID).find("#numPadInputMask").val(val.replace(/[\S]/g, "*"));
                else if(isDecimal && !allowCents)
                    $("#" + instance.modalID).find("#numPadInputMask").val((isNaN(parseFloat(val)) ? parseFloat("0").toFixed(2) : parseFloat(val).toFixed(2)));
                else if(isDecimal && allowCents)
                {alert("need to code this");}
                else
                    $("#" + instance.modalID).find("#numPadInputMask").val(val);

               

                if(val.length < min || val.length > max)
                    $("#" + instance.modalID).find(".numPadConfirm").each(function() { $(this).attr("disabled", "true")});
                else
                    $("#" + instance.modalID).find(".numPadConfirm").each(function() { $(this).removeAttr("disabled")});
            });
            
            $("#" + instance.modalID).find(".numPadConfirm").on("click", function(){
                instance.confirm();
            });

            $("#" + instance.modalID).find(".numPadClear").on("click", function(){
                instance.clear();
            });

            $("#" + instance.modalID).find(".numPadCancel").on("click", function(){
                instance.cancel();
            });

            $("#" + instance.modalID).find(".numPadBackSpace").on("click", function(){
                instance.backspace();
            });

            //When number is pressed, pass number to add function
            $("#" + instance.modalID).find(".numPadKeyNumber").each(function() {
                $(this).on("click", function(){
                    instance.add($(this).data("val"));
                });
            });


            instance.numPadInput.val(initialVal).trigger("change");
        });
    }

    private show()
    {
        $("#" + this.modalID).modal('show');
    }

    private hide()
    {
        $("#" + this.modalID).modal('hide');
    }

    private destruct()
    {
        Main.unbindKeyboardListener(this.id);
        this.closeC();
        $("#" + this.modalID).remove();
    }

    private add(val)
    {
        if(this.numPadInput.val().toString().length < this.max) // <= (max - 1)
        {
            this.numPadInput.val(this.numPadInput.val() + val).trigger("change");
            this.addC(val); 
        }
    }

    private backspace()
    {
        this.numPadInput.val(
            function(index, value){
                return value.substr(0, value.length - 1);
        }).trigger('change');
        this.backspaceC();
    }

    private clear()
    {
        this.numPadInput.val("").trigger("change");
        this.clearC();
    }

    private confirm()
    {
        this.confirmC();
        this.hide();
    }

    private cancel()
    {
        this.cancelC();
        this.hide();
    }

    private highlightKeysWhileTyping(val)
    {
        $('.numPadKeyNumber[data-val="'+val+'"]').addClass("hovered");
            setTimeout(function() {
                $('.numPadKeyNumber[data-val="'+val+'"]').removeClass("hovered");
            }, 200);
    }

}
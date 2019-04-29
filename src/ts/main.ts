//@ts-ignore
//import * as $ from "jquery";

import {Pages} from "./pages";

$(document).ready(function() {
    Main.loadBackground();

    Pages.splash();
  
});

export class Main {
    static get(page, callback) : void
    {
        $.get("/pages/" + page, callback);
    }

    static loadContent(content) 
    {
        $("#content").html(content);
    }

    static processTpl(tpl : string, array)
    {
        //TODO: check if tplContent exist before passing to mustache
        return $.mustache($(tpl).filter("#tplContent").html(), array);
    }

    static getAndLoad(page : string, arrayVal : any = [], callback = function() {}) : void
    {
        Main.get(page, function(template){
            Main.loadContent(Main.processTpl(template, arrayVal));
            
            callback(); 
        });

    }

    static loadBackground() : void
    {
        this.get("background.html", function(template) {
            $("body").removeClass("background");
            $("body").addClass("background").html($(template).filter('#tplContent').html());
            Main.loadIncludes();
         });
    }

    static loadIncludes() : void
    {
        $.get("/includes/numpad.html", function(template){
            $("#numPadTemplate").html(template);
          });
    }
    
    //don't use this for now
    static removeBackground() : void
    {
        $(".cube").remove();
    }

    static loadMain() : void
    {

    }

    static addBtnListener(id, callback, params = []) : void
    {
        let btn = $("#" + id);
        console.log(btn);
        if(btn != null)
            btn.on("click", function(){
                callback(params)
            });
        else
            console.log("ID: " + id + " not found in document");
    }

    static loadNumberPad(title : string, add? : Function, backspace? : Function, clear? : Function, confirm? : Function, cancel? : Function) : void
    { 
        $('#numPadModal').modal('show');
        this.bindKeyboardListener(function(key) {
                        
        });
    }

    static bindKeyboardListener(callback) : void
    {
        $(document).keypress(function(e) {
            var key = e.which;
            
            callback(key);
        });
        //Make sure backspace doesn't redirect back
        $(document).on("keydown", function (e) { 
            if (e.which === 8 && !$(e.target).is("input, textarea")) {
                e.preventDefault();
                callback(e.which);
            }
            else if (e.which === 13 && !$(e.target).is("input, textarea")) {
                e.preventDefault();
                callback(e.which);
            }
        });
    }

    static unbindKeyboardListener() : void
    {
        $(window).unbind("keypress");
        $(window).unbind("keydown");
    }
    
}
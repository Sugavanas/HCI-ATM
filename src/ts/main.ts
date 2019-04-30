//@ts-ignore
//import * as $ from "jquery";

import {Pages} from "./pages";
import { s } from './s';

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
    
    static bindKeyboardListener(id, callback) : void
    {
        $(document).on("keypress." + id, function(e) {
            var key = e.which;
            callback(key);
        });

        //Make sure backspace doesn't redirect back
        $(document).on("keydown." + id, function (e) { //TODO combine the if statements
            if (e.which === 8 && !$(e.target).is("input, textarea")) {
                e.preventDefault();
                callback(e.which);
            }
            else if (e.which === 13 && !$(e.target).is("input, textarea")) {
                e.preventDefault();
                callback(e.which);
            }
            else if (e.which === 27 && !$(e.target).is("input, textarea")) {
                e.preventDefault();
                callback(e.which);
            }
        });
    }

    static unbindKeyboardListener(id : string) : void
    {
        $(document).unbind("keypress." + id);
        $(document).unbind("keydown." + id);
    }
    
}
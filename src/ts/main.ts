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
         });
    }

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
}
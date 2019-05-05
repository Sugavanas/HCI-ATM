//@ts-ignore
//import * as $ from "jquery";

import {Pages} from "./pages";
import {Menu} from "./pages/menu";

$(document).ready(function() {
    Main.initialLoad();
});

export class Main {
    static get(page : string) : Promise<object>
    {
        return new Promise(function(resolve, reject) { 
            $.get("/pages/" + page, function(data){
                resolve(data);
            }).fail(function(){
                reject("Unexpected");
            })
        });
    }

    static loadContent(content : string)  : void
    {
        $("#content").html(content);
    }

    static processTpl(tpl : string, array) : string
    {
        //TODO: check if tplContent exist before passing to mustache
        return $.mustache($(tpl).filter("#tplContent").html(), array);
    }

    static getAndLoad(page : string, arrayVal : any = []) : Promise<object>
    {
        return new Promise(function(resolve, reject) { 
            Main.get(page).then(template => {
                //TODO: resolve after loading content to prevent errors if there is a delay.
                Main.loadContent(Main.processTpl(template.toString(), arrayVal));
                resolve();
            }).catch(error => reject(error));
        });
    }

    static loadErrorPage(error : string)
    {
        this.loadContent("<p class='error-center text-center'>" + error + "</p>");
    }

    static showLoader(text : string, runFunction : Promise<object>, callback? : Function) : void {
        $("#loading-text").html(text);
        $("#loading").css("display", "block");
                
        if(callback == null)
            callback = function() {};

        runFunction.then(data => {
            callback();
        }) 
        .catch(error => { Main.loadErrorPage(error); })
        .finally(function() {
            $("#loading").css("display", "none");
        });

    }

    static initialLoad() : void
    {
        Main.loadBackground();
        Pages.splash();
    }

    static loadBackground() : void
    {
        this.get("background.html").then(template => {
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
            btn.off("click").on("click", function(){
                callback(params)
            });
        else
            console.log("ID: " + id + " not found in document");
    }

    static bindKeyboardListener(id, callback) : void
    {
        $(document).off("keypress." + id).on("keypress." + id, function(e) {
            var key = e.which;
            callback(key);
        });

        //Make sure backspace doesn't redirect back
        $(document).off("keydown." + id).on("keydown." + id, function (e) { //TODO combine the if statements
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

    static addCancelBtn(callback? : Function)
    {
        if($('#btnBottomCancel').length == 0)
            $("#content").append('<button class="btn btn-danger btnBottomLeft" id="btnBottomCancel">Cancel</button>');

        $('#btnBottomCancel').unbind("click");

        Main.addBtnListener("btnBottomCancel", callback); 
    }
    
    static addDefaultCancelBtn(page? : string)
    {
        Main.addCancelBtn(function() {
            Main.defaultCancelCallback(page)
        });
    }


    static defaultCancelCallback(page? : string)
    {
        Main.unbindKeyboardListener("");
        if(page == null)
        {
            Main.showLoader("Quitting?", new Promise(function(resolve, reject) {
                setTimeout(function(){
                    Main.initialLoad();
                    resolve();
                }, 1000);
            }));
        } else if(page == "menu")
        {
            Main.showLoader("Cancelling", Menu.load());
        }
    }
}
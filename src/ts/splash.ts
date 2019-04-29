import { Main } from './main';

export class Splash { //implements Page {
    static load() : void
    {
        console.log("Splash Screen");
        Main.getAndLoad("splash.html",  {"title" : "Splash Screen"}, function() {
            Main.addBtnListener("insertCard", function(){
                Main.getAndLoad("enterpin.html",  [], function() {

                });
            });    
        });
       

          //setTimeout(function () {
         //   Main.loadMain();
        // }, 5000);
    }
}
    

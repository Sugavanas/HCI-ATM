import { Main } from './main';

export class Pages { //implements Page {
    static splash() : void
    {
        Main.getAndLoad("splash.html",  {"title" : "Splash Screen"}, function() {
            Main.addBtnListener("insertCard", function(){
               Pages.enterpin();
            });    
        });
    }

    static enterpin() : void
    {
        Main.getAndLoad("enterpin.html",  [], function() {

        });
    }
}
    

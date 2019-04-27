//@ts-ignore
//import * as $ from "jquery";

import {splash} from "./splash";

$(document).ready(function() {
    //alert("ready");
    var arra1y = {
        "name": "Chris",
        "value": 10000,
        "taxed_value": 10000 - (10000 * 0.4),
        "in_ca": true
      };

      var s : splash = new splash;
      s.load();

    $.get("/pages/splash.html", function(template, textS, jqXhr) {
       $("body").html($.mustache($(template).filter('#tplContent').html(), arra1y));
    });
});
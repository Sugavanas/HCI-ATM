$(document).ready(function() {
    $("#loading").css("display", "none");
});
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.loadErrorPage = function (error) {
        $("#content").html("<p class='error-center text-center'>" + error + "</p>");
    };
    Main.showLoader = function () {
        $("#loading").css("display", "block");
        $(".tooltip").remove();
    };
    Main.hideLoader = function () {
        $("#loading").css("display", "none");
    };
    Main.redirect = function(url) {
        Main.showLoader();
        window.location.href = (Main.baseUrl + url);
    };
    Main.addBtnListener = function (id, callback, params) {
        if (params === void 0) { params = []; }
        var btn = $("#" + id);
        console.log(btn);
        if (btn.length)
            btn.off("click").on("click", function () {
                callback(params);
            });
        else
            console.log("ID: " + id + " not found in document");
    };
    Main.bindKeyboardListener = function (id, callback) {
        $(document).off("keypress." + id).on("keypress." + id, function (e) {
            var key = e.which;
            callback(key);
        });
        //Make sure backspace doesn't redirect back
        $(document).off("keydown." + id).on("keydown." + id, function (e) {
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
    };
    Main.unbindKeyboardListener = function (id) {
        $(document).unbind("keypress." + id);
        $(document).unbind("keydown." + id);
    };
    Main.addCancelBtn = function (callback, text) {
        if ($('#btnBottomCancel').length == 0)
            $("#content").append('<button class="btn btn-danger btnBottomLeft" id="btnBottomCancel">Cancel</button>');
        if (text !== null)
            $("#btnBottomCancel").html(text);
        $('#btnBottomCancel').unbind("click");
        Main.addBtnListener("btnBottomCancel", callback);
    };
    Main.addDefaultCancelBtn = function (page) {
        Main.addCancelBtn(function () {
            Main.defaultCancelCallback(page);
        });
    };
    Main.defaultCancelCallback = function (page) {
        if (page == null || page == undefined || page == "") {
            Main.redirect("index.html");
        }
        else if (page == "menu") {
            Main.redirect("menu.html");
        }
    };
    Main.addNumPadToolTip = function (id) {
        $('#' + id).data("toggle", "tooltip").data("title", s.openNumpad).data("placement", "right").tooltip("show");
        setTimeout(function () {
            $('#' + id).tooltip("hide");
        }, 3000);
    };
    Main.baseUrl = "./"; // "http://159.65.69.18/HCI/";
    return Main;
}());
var s = /** @class */ (function () {
    function s() {
    }
    s.eNumbers = "Only numbers allowed";
    s.maxChars = "Reached maximum allowed characters";
    s.maxAmount = "Only RM 999,999 deposit is allowed per transaction. Please try again.";
    s.unexpected = "Unexpected Error. Please try again.";
    s.lowBalance = "You do not have enough balance. Your balance is RM ";
    s.transactionSuccess = "Transaction Successful.";
    s.transactionFailed = "Transaction Failed.";
    s.takeReceipt = "Please take your receipt.";
    s.thankYou = "Thank you";
    s.removeCard = "Please take your card";
    s.functionUnavailable = "This function is currently unavailable.";
    s.languageUnavailable = "This language is currently unavailable.";
    s.openNumpad = "Tap here to open numpad";
    return s;
}());

var numPad = (function () {
    function numPad() {
    }
    numPad.load = function(confirmC, cancelC, clearC, min = 0, max = 9, isDecimal = false, isPassword = false, allowCents = false) {
        $("#numPadModal").find("#numPadInput").on("change", function(){
            var val = $(this).val().toString();
            if(isPassword)
                $("#numPadModal").find("#numPadInputMask").val(val.replace(/[\S]/g, "*"));
            else if(isDecimal && !allowCents)
                $("#numPadModal").find("#numPadInputMask").val((isNaN(parseFloat(val)) ? parseFloat("0").toFixed(2) : parseFloat(val).toFixed(2)));
            else if(isDecimal && allowCents)
            {
                var amount = parseFloat(("00" + val).substr(0, val.length + 2 - 2) + "." +  ("00" + val).substr(val.length + 2 - 2));
                $("#numPadModal").find("#numPadInputMask").val((isNaN(amount) ? parseFloat("0").toFixed(2) : amount.toFixed(2)));
            }
            else
            {
                $("#numPadModal").find("#numPadInputMask").val(val);
            }

           

            if(val.length < min || val.length > max)
                $("#numPadModal").find(".numPadConfirm").each(function() { $(this).attr("disabled", "true")});
            else
                $("#numPadModal").find(".numPadConfirm").each(function() { $(this).removeAttr("disabled")});
        });

        $("#numPadModal").find(".numPadCancel").each(function() { 
            $(this).on("click", cancelC);
        });
        $("#numPadModal").find(".numPadConfirm").each(function() { 
            $(this).on("click", confirmC);
        });
        $("#numPadModal").find(".numPadClear").each(function() { 
            $(this).on("click", clearC);
        });
    };
    numPad.changeText = function(val)  {
        $("#numPadModal").find("#numPadInput").val(val).trigger("change");
    };
    numPad.highlightKeysWhileTyping = function(val) {
        $('.numPadKeyNumber[data-val="'+val+'"]').addClass("hovered");
            setTimeout(function() {
                $('.numPadKeyNumber[data-val="'+val+'"]').removeClass("hovered");
            }, 200);
    };
    numPad.keyPress = function(callback)  {
        $("#numPadModal").find(".numPadKeyNumber").each(function() {
            $(this).on("click", function(){
                callback($(this).data("val"));
            });
        });
    };
    return numPad;
}());
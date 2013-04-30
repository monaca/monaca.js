/**
 * Monaca Functions
 *  Version 1.4.0
 *  require cordova.js
 *
 * @author Katsuya SAITO <info@monaca.mobi>
 * @author Hajime NAKAJIMA <info@monaca.mobi>
 * @author Hiroki NAKAGAWA <info@monaca.mobi>
 * @author Mitsunori KUBOTA <info@monaca.mobi>
 * @author Masahiro TANAKA <info@monaca.mobi>
 * @date   2013/01/25
 */
window.monaca = window.monaca || {};

(function(PhoneGap) {
    /*
     * monaca api queue.
     */
    monaca.apiQueue = monaca.apiQueue || {};
    monaca.apiQueue.paramsArray = [];
    monaca.apiQueue.exec = function(a,b,c,d,e){
        if (typeof device == 'undefined') {
            monaca.apiQueue.paramsArray.push([a,b,c,d,e]);
        } else {
            PhoneGap.exec(a,b,c,d,e);
        }
    }
    monaca.apiQueue.next = function(){
        var params = monaca.apiQueue.paramsArray.shift();
        if (params) {
            PhoneGap.exec(
                function(r){params[0](r); monaca.apiQueue.next();},
                function(r){params[1](r); monaca.apiQueue.next();},
                params[2],
                params[3],
                params[4]
            );
        }
    }
    document.addEventListener('deviceready', function(){
        monaca.apiQueue.next();
    }, false);

    var isAndroid = (/android/gi).test(navigator.appVersion);

    /**
     * Obtain style property
     */
    monaca.retrieveUIStyle = function() {
        var argsArray = [].slice.apply(arguments);
        monaca.apiQueue.exec(arguments[arguments.length-1], null, "mobi.monaca.nativecomponent", "retrieve", argsArray);
    };

    /**
     * Update style property
     */
    monaca.updateUIStyle = function(id, name, value) {
        if (typeof id == "string") {
            var argsArray = [].slice.apply(arguments);
            monaca.apiQueue.exec(null, null, "mobi.monaca.nativecomponent", "update", argsArray);
        } else {
            for (var i = 0; i < id.length; i++) {
                monaca.apiQueue.exec(null, null, "mobi.monaca.nativecomponent", "update", [id[i], name, value]);
            }
        }
    };
    
    if (isAndroid) {
        monaca.retrieveUIStyle = function(id, name, success, failure) {
            monaca.apiQueue.exec(
                function(style) { success(style[name]); } || function() { }, 
                failure || function() { }, 
                "mobi.monaca.nativecomponent",
                "retrieve", 
                [id]
            );
        };
            
        monaca.updateUIStyle = function(id, name, value, success, failure) {
            var style = {};
            style[name] = value;
            
            monaca.apiQueue.exec(
                success || function() { }, 
                failure || function() { }, 
                "mobi.monaca.nativecomponent",
                "update", 
                [id, style]
            );
        };
    }   

    var transitionPluginName = "Transit";
    
    /**
     * Open new page.
     */
    monaca.pushPage = function(path, options, param) {
        options = options || {};
        var name = options.animation == 'lift' ? 'modal' : 'push';
        monaca.apiQueue.exec(null, null, transitionPluginName, name, [path, options, param]);
    };
    /**
     * Close current page.
     */
    monaca.popPage = function(options) {
        options = options || {};
        var name = options.animation == 'lift' ? 'dismiss' : 'pop';
        monaca.apiQueue.exec(null, null, transitionPluginName, name, [null, options]);
    };

    /**
     * Open in browser.
     */
    monaca.invokeBrowser = function(url) {
        monaca.apiQueue.exec(null, null, transitionPluginName, "browse", [url]);
    };

    /** 
     * Load in current page.
     */
    monaca.load = function(path, options, param) {
        monaca.apiQueue.exec(null, null, transitionPluginName, "link", [path, options, param]);
    };

    /**
     * return to top page.
     */
    monaca.home = function(options) {
        options = options || {};
        monaca.apiQueue.exec(null, null, transitionPluginName, "home", [options]);
    };

    /**
     * Console API from independent PhoneGap.
     */
    window.monaca.console = window.monaca.console || {};

    /**
     * base method for send log.
     */
    monaca.console.sendLog = function(level, arguments) {
        var messages = new Array();

        for (var i=0; i<arguments.length; i++){
            if (typeof arguments[i] == "string") {
                messages[i] = arguments[i];
            } else {
                messages[i] = JSON.stringify(arguments[i]);
            }
        }
        if (isAndroid) {
                // TODO
        } else {
            var xhr = new XMLHttpRequest();
            var path = "monaca://log?level=" + encodeURIComponent(level) + "&message=" + encodeURIComponent(messages.join(" "));
            xhr.open("GET", path);
            xhr.send();
        }
    }

    /**
     * monaca console methods
     */
    var methods = ["debug", "info", "log", "warn", "error"];
    for (var i=0; i<methods.length; i++) {
        var method = methods[i];
        monaca.console[method] = function(method) {
            return function() {
                monaca.console.sendLog(method, arguments);
            };
        }(method);
    }

    window.monaca.splashScreen = window.monaca.splashScreen || {};
    var splashScreenPluginName = "MonacaSplashScreen";

    /**
     * hide SplashScreen.
     */
    monaca.splashScreen.hide = function() {
        if (isAndroid) {
            monaca.apiQueue.exec(null, null, splashScreenPluginName, "hide", []);
        } else {
            navigator.splashscreen.hide();
        }
    };

})(window.cordova ? cordova : (window.Cordova ? Cordova : (window.PhoneGap ? PhoneGap : {})));

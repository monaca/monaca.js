/**
 * Monaca Functions
 *  Version 1.2
 *  require cordova.js
 *
 * @author Katsuya SAITO <info@monaca.mobi>
 * @author Hiroki NAKAGAWA <info@monaca.mobi>
 * @author Mitsunori KUBOTA <info@monaca.mobi>
 * @author Masahiro TANAKA <info@monaca.mobi>
 * @date   2012/09/05
 */
window.monaca = window.monaca || {};

(function(PhoneGap) {
    var isAndroid = (/android/gi).test(navigator.appVersion);
    
    /**
     * Update style property
     */
    monaca.updateUIStyle = function(id, name, value) {
        if (typeof id == "string") {
            var argsArray = [].slice.apply(arguments);
            PhoneGap.exec(null, null, "mobi.monaca.nativecomponent", "update", argsArray);
        } else {
            for (var i = 0; i < id.length; i++) {
                PhoneGap.exec(null, null, "mobi.monaca.nativecomponent", "update", [id[i], name, value]);
            }
        }
    };
    
    /**
     * Obtain style property
     */
    monaca.retrieveUIStyle = function() {
        var argsArray = [].slice.apply(arguments);
        PhoneGap.exec(arguments[arguments.length-1], null, "mobi.monaca.nativecomponent", "retrieve", argsArray);
    };
    
    if (isAndroid) {
        monaca.retrieveUIStyle = function(id, name, success, failure) {
            PhoneGap.exec(
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
            
            PhoneGap.exec(
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

        PhoneGap.exec(null, null, transitionPluginName, name, [path, options, param]);
    };

    /**
     * Close current page.
     */
    monaca.popPage = function(options) {
        options = options || {};

        var name = options.animation == 'lift' ? 'dismiss' : 'pop';

        PhoneGap.exec(null, null, transitionPluginName, name, []);
    };

    /**
     * Open in browser.
     */
    monaca.invokeBrowser = function(url) {
        PhoneGap.exec(null, null, transitionPluginName, "browse", [url]);
    };

    /** 
     * Load in current page.
     */
    monaca.load = function(path, options, param) {
        PhoneGap.exec(null, null, transitionPluginName, "link", [path, options, param]);
    };

    /**
     * return to top page.
     */
    monaca.home = function(options) {
        options = options || {};
        PhoneGap.exec(null, null, transitionPluginName, "home", [options]);
    };

 })(window.cordova ? cordova : (window.Cordova ? Cordova : (window.PhoneGap ? PhoneGap : {})));

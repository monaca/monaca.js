/**
 * Monaca Functions
 * 
 *  require cordova.js
 *
 * @author Hiroki NAKAGAWA <info@monaca.mobi>
 * @author Mitsunori KUBOTA <info@monaca.mobi>
 * @author Masahiro TANAKA <info@monaca.mobi>
 * @date   2011/12/21
 */
window.monaca = window.monaca || {};

(function(PhoneGap) {
    var isAndroid = (/android/gi).test(navigator.appVersion);
    
    /**
     * Update style property
     */
    monaca.updateUIStyle = function(id, name, value) {
        if (typeof id == "string") {
            PhoneGap.exec(function(a) { alert(a); } , function(a) { alert(a); }, "mobi.monaca.nativecomponent", "update", arguments);
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
        PhoneGap.exec(arguments[arguments.length-1], null, "mobi.monaca.nativecomponent", "retrieve", arguments);
    };
    
    if (isAndroid) {
        monaca.retrieveUIStyle = function(id, name, success, failure) {
            PhoneGap.exec(
                function(style) { success(style[name]); } || function() { }, 
                failure || function() { }, 
                "MonacaNativeUI", 
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
                "MonacaNativeUI", 
                "update", 
                [id, style]
            );
        };
    }   

    var transitionPluginName = "Transit";
    
    /**
     * Open new page.
     */
    monaca.pushPage = function(path, options) {
        options = options || {};

        var name = options.animation == 'lift' ? 'modal' : 'push';

        PhoneGap.exec(null, null, transitionPluginName, name, [path, options]);
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
    monaca.load = function(path) {
        PhoneGap.exec(null, null, transitionPluginName, "link", [path]);
    };

 })(window.cordova ? cordova : (window.Cordova ? Cordova : (window.PhoneGap ? PhoneGap : {})));

/**
 * Monaca Native Functions
 * 
 *  require cordova.js
 *
 * @author Hiroki NAKAGAWA <info@monaca.mobi>
 * @author Mitsunori KUBOTA <info@monaca.mobi>
 * @date   2011/12/21
 */
window.monaca = window.monaca || {ui : {}};

(function(PhoneGap) {
    /**
     * Update style property
     */
    monaca.ui.updateStyle = function(id, name, value) {
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
    monaca.ui.retrieveStyle = function() {
        PhoneGap.exec(arguments[arguments.length-1], null, "mobi.monaca.nativecomponent", "retrieve", arguments);
    };
    
    monaca.transit = {
        namespace: "Transit",

        /**
        * Open new view
        */
        push: function(fileName, options) {
            options = options || {};
            options.bg = options.bg || '';

            PhoneGap.exec(null, null, this.namespace, "push", [fileName, options]);
        },
        /**
        * Close pushed view
        */
        pop: function(options) {
            PhoneGap.exec(null, null, this.namespace, "pop", [options]);
        },
        /**
        * Open view in modal
        */
        modal: function(fileName, options) {
            options = options || {};
            options.bg = options.bg || '';

            PhoneGap.exec(null, null, this.namespace, "modal", [fileName, options]);
        },
        /**
        * Close modal screen
        */
        dismiss: function(options) {
            PhoneGap.exec(null, null, this.namespace, "dismiss", [options]);
        },
        /**
        * Open in browser
        */
        browse: function(url) {
            PhoneGap.exec(null, null, this.namespace, "browse", [url]);
        },

        /** 
         * Open page in the same view
         */
        link : function(url, options) {
            PhoneGap.exec(null, null, this.namespace, "link", [url, options]);
        }
    };
 })(window.cordova ? cordova : (window.Cordova ? Cordova : (window.PhoneGap ? PhoneGap : {})));


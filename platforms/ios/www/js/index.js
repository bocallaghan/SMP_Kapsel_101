"use strict";

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    
    /*
     * Callback function for a successful login to the SMP server.
     */
    logonSuccess: function (connection) {
        
        var success = document.getElementById('regSuccess');
        var failure = document.getElementById('regFailed');

        success.setAttribute('style', 'display:block;');
        failure.setAttribute('style', 'display:none;');
    },
    /*
     * Callback function for a failed login to the SMP server.
     */
    logonFailure: function (e) {

        var success = document.getElementById('regSuccess');
        var failure = document.getElementById('regFailed');

        failure.setAttribute('style', 'display:block;');
        success.setAttribute('style', 'display:none;');

    },

    startSMPConnection: function () {
        
        // Setup the defaults for the login template.
        var appId = "com.bf.test",
            context = {
                "serverHost": "smp3Server",
                "serverPort": "8080",
                "https": "false"
            };
        
        // Call the login method passing in a success callback and failure callback along
        // with the application ID as defined in the SMP server.
        sap.Logon.init(this.logonSuccess, this.logonFailure, appId, context);
    }
};

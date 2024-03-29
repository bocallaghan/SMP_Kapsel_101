cordova.define("com.sap.mp.cordova.plugins.logon.LogonCore", function(require, exports, module) {var exec = require("cordova/exec");

/*
 * Handle the background event
 */
document.addEventListener("pause",
                          function(){
                          onEvent(
                                  function() {
                                  console.log("MAFLogonCoreCDVPlugin: Pause event successfully set.");
                                  },
                                  function() {
                                  console.log("MAFLogonCoreCDVPlugin: Pause event could not be set.");
                                  },
                                  "PAUSE"
                                  );
                          },
                          false);


/**
 * Method for initializing the logonCore component.
 * @param successCallback: this method will be called back if initialization succeeds with parameter logoncontext;
 * @param errorCallback: this method will be called back if initialization fails with parameter error
 *   Error structure:
 *       "errorCode":
 *       "errorMessage":
 *       "errorDomain":
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *        -  1 (init failed)
 * @param applicationId: the application to be registered
 */
var initLogon = function(successCallback, errorCallback, applicationId) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
        throw ('Invalid parameters in initLogon:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback);
    }
    
    return exec(
                function(){
                successCallback();
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "initWithApplicationId",
                [applicationId]);
};

/**
 * Method for reading the state of logonCore.
 * @param successCallback: this method will be called back if read succeeds with parameter state
 *      state consists of the following fields:
 *          "applicationId":
 *          "status": new / registered / fullRegistered
 *          "secureStoreOpen":
 *          "defaultPasscodeUsed":
 *          "stateClientHub": notAvailable / skipped / availableNoSSOPin / availableInvalidSSOPin / availableValidSSOPin / error
 *          "stateAfaria": initializationNotStarted / initializationInProgress / initializationFailed / initializationSuccessful / credentialNeeded
 *	 	   "isAfariaCredentialsProvided":
 * @param errorCallback: this method will be called back if initialization fails with parameter error
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *       - 2 (plugin not initialized)
 */
var getState = function(successCallback, errorCallback) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
        throw ('Invalid parameters in getState:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback);
    }
    
    return exec(
                function(success){
                successCallback(success);
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "getState",
                []);
};

/**
 * Method for reading the context of logonCore.
 * @param successCallback: this method will be called back if read succeeds with parameter context and state
 * @param errorCallback: this method will be called back if initialization fails with parameter error
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *       -2 (plugin not initialized)
 *
 * Context structure contains the following fields:
 * "registrationContext": {
 *       "serverHost": Host of the server.
 *       "domain": Domain for server. Can be used in case of SMP communication.
 *       "resourcePath": Resource path on the server. The path is used mainly for path based reverse proxy but can contains custom relay server path as well.
 *       "https": Marks whether the server should be accessed in a secure way.
 *       "serverPort": Port of the server.
 *       "user": Username in the backend.
 *       "password": Password for the backend user.
 *       "farmId": FarmId of the server. Can be nil. Used in case of Relay server or SitMinder.
 *       "communicatorId": Id of the communicator manager which will be used for performing the logon. Possible values: IMO / GATEWAY / REST
 *       "securityConfig": Security configuration. If nil the default configuration will be used.
 *       "mobileUser": Mobile User. Used in case of IMO manual user creation.
 *       "activationCode": Activation Code. Used in case of IMO manual user creation.
 *       "gatewayClient": The key string which identifies the client on the gateway. Used in Gateway only registration mode. The value will be used as adding the parameter: sap-client=<gateway client>
 *       "gatewayPingPath": The custom path of the ping url on the gateway. Used in case of Gateway only registration mode.
 * }
 * "applicationEndpointURL": Contains the application endpoint url after a successful registration.
 * "applicationConnectionId": Id get after a successful SUP REST registration. Needed to be set in the download request header with key X-SUP-APPCID
 * "afariaRegistration": manual / automatic / certificate
 * "policyContext": Contains the password policy for the secure store {
 *      "alwaysOn":
 *      "alwaysOff":
 *      "defaultOn":
 *      "hasDigits":
 *      "hasLowerCaseLetters":
 *      "hasSpecialLetters":
 *      "hasUpperCaseLetters":
 *      "defaultAllowed":
 *      "expirationDays":
 *      "lockTimeout":
 *      "minLength":
 *      "minUniqueChars":
 *      "retryLimit":
 * }
 * "registrationReadOnly": specifies whether context values are coming from clientHub / afaria
 * "policyReadOnly": specifies whether passcode policy is coming from afaria
 * "credentialsByClientHub": specifies whether credentials are coming from clientHub
 *
 *
 */
var getContext = function(successCallback, errorCallback) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
        throw ('Invalid parameters in getContext:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback);
    }
    
    return exec(
                function(success){
                successCallback(success.context, success.state);
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "getContext",
                []);
};

/**
 * Method for registering user.
 * @param successCallback(context,state): this method will be called back if registration succeeds with parameters context and state;
 * @param errorCallback: this method will be called back if registration fails with parameter error
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *       - 2 (plugin not initialized)
 *       - 3 (no input provided)
 * @param context: the context which includes registration parameters as described in getContext method.
 */
var startRegistration = function(successCallback, errorCallback, context) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function' || typeof context !== 'object') {
        throw ('Invalid parameters in startRegistration:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback +
               '\ncontext: ' + typeof context);
    }
    
    var input = JSON.stringify(context);
    
    return exec(
                function(success){
                successCallback(success.context, success.state);
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "registerWithContext",
                [input]);
};

/**
 * Method for cancelling the registration.
 * @param successCallback(context,state): this method will be called back if cancelling succeeds with parameters context and state;
 * @param errorCallback: this method will be called back if cancelling fails with parameter error
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *       - 2 (plugin not initialized)
 */
var cancelRegistration = function(successCallback, errorCallback) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
        throw ('Invalid parameters in cancelRegistration:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback);
    }
    
    return exec(
                function(success){
                successCallback(success.context, success.state);
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "cancelRegistration",
                []);
};

/**
 * Method for persisting the registration. Persisting will create the secure store and store the context.
 * @param successCallback(context,state): this method will be called back if persisting succeeds with parameters context and state;
 * @param errorCallback: this method will be called back if persisting fails with parameter error
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *       - 2 (plugin not initialized)
 *       - 3 (no input provided)
 * @param param: an object which must contain the field "passcode" for the store to be created.
 * Optional field "policyContext" containing the passcode policy parameters described in method getContext.
 */
var persistRegistration = function(successCallback, errorCallback, param) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function' || typeof param !== 'object') {
        throw ('Invalid parameters in persistRegistration:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback +
               '\nparam: ' + typeof param);
    }
    
    var JSONLogonContext = JSON.stringify(param);
    
    return exec(
                function(success){
                successCallback(success.context, success.state);
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "persistRegistration",
                [JSONLogonContext]);
};

/**
 * Method for deleting the registration. It will reset the client and remove the user from the SUP server.
 * @param successCallback(context,state): this method will be called back if deletion succeeds with parameters context and state;
 * @param errorCallback: this method will be called back if persisting fails with parameter error
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *       - 2 (plugin not initialized)
 */
var deleteRegistration = function(successCallback, errorCallback) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
        throw ('Invalid parameters in deleteRegistration:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback);
    }
    
    return exec(
                function(success){
                successCallback(success.context, success.state);
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "deleteRegistration",
                []);
};

/**
 * Method for changing the application passcode.
 * @param successCallback(context,state): this method will be called back if change passcode succeeds with parameters context and state;
 * @param errorCallback: this method will be called back if persisting fails with parameter error
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *       - 2 (plugin not initialized)
 *       - 3 (no input provided)
 * @param param: an object which must contain 2 key-value pairs:
 * - oldPasscode :
 * - passcode :
 */
var changePasscode = function(successCallback, errorCallback, param) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function' || typeof param !== 'object') {
        throw ('Invalid parameters in changePasscode:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback +
               '\nparam: ' + typeof param);
    }
    
    return exec(
                function(success){
                successCallback(success.context, success.state);
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "changePasscode",
                [param.oldPasscode, param.passcode]);
};

/**
 * Method for changing the backend password.
 * @param successCallback(context,state): this method will be called back if change password succeeds with parameters context and state;
 * @param errorCallback: this method will be called back if change password fails with parameter error
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *       - 2 (plugin not initialized)
 *       - 3 (no input provided)
 * @param param: object containing the password for key "newPassword"
 */
var changePassword = function(successCallback, errorCallback, param) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function' || typeof param !== 'object') {
        throw ('Invalid parameters in changePassword:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback +
               '\nparam: ' + typeof param);
    }
    
    return exec(
                function(success){
                successCallback(success.context, success.state);
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "changePassword",
                [param.newPassword]);
};

/**
 * Method for locking the secure store.
 * @param successCallback(bool): this method will be called back if locking succeeds;
 * @param errorCallback: this method will be called back if change password fails with parameter error
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *       - 2 (plugin not initialized)
 */
var lockSecureStore = function(successCallback, errorCallback) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
        throw ('Invalid parameters in lockSecureStore:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback);
    }
    
    return exec(
                function(success){
                successCallback(success);
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "lockSecureStore",
                []);
};

/**
 * Method for unlocking the secure store.
 * @param successCallback(context,state): this method will be called back if unlocking succeeds;
 * @param errorCallback: this method will be called back if unlocking fails with parameter error
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *       - 2 (plugin not initialized)
 *       - 3 (no input provided)
 *
 * @param param: object containing the passcode for key "unlockPasscode"
 */
var unlockSecureStore = function(successCallback, errorCallback, param) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function' || typeof param !== 'object') {
        throw ('Invalid parameters in unlockSecureStore:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback +
               '\nparam: ' + typeof param);
    }
    
    return exec(
                function(success){
                successCallback(success.context, success.state);
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "unlockSecureStore",
                [param.unlockPasscode]);
};

/**
 * Method for getting object from the store.
 * @param successCallback(object): this method will be called back if get succeeds;
 * @param errorCallback: this method will be called back if get fails with parameter error
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *       - 2 (plugin not initialized)
 *       - 3 (no input provided)
 * @param key: the key for the object
 */
var getSecureStoreObject = function(successCallback, errorCallback, key) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
        throw ('Invalid parameters in getSecureStoreObject:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback);
    }
    
    return exec(
                function(success){
                successCallback(JSON.parse(success));
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "getSecureStoreObject",
                [key]);
    
};

/**
 * Method for setting object to the store.
 * @param successCallback(bool): this method will be called back if set succeeds;
 * @param errorCallback: this method will be called back if set fails with parameter error
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *       - 2 (plugin not initialized)
 *       - 3 (no input provided)
 * @param key: the key for the object to be stored
 * @param object: the object to be stored
 */
var setSecureStoreObject = function(successCallback, errorCallback, key, object) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
        throw ('Invalid parameters in setSecureStoreObject:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback);
    }
    
    var JSONObject = JSON.stringify(object);
    
    return exec(
                function(success){
                successCallback(success);
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "setSecureStoreObject",
                [key, JSONObject]);
};

/**
 * Method for setting clientHub sso passcode.
 * @param successCallback(context,state): this method will be called back if setting succeeds;
 * @param errorCallback: this method will be called back if update fails with parameter error
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *       - 2 (plugin not initialized)
 * @param param: object containing the ssopasscode for key "ssoPasscode"
 */
var setSSOPasscode = function(successCallback, errorCallback, param) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function' || typeof param !== 'object') {
        throw ('Invalid parameters in updateContextWithMCIM:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback +
               '\nparam: ' + typeof param);
    }
    
    return exec(
                function(success){
                if (typeof success.context !== 'undfined' && typeof success.state !== 'undefined') {
                successCallback(success.context, success.state);
                }
                else{
                successCallback(success, null);
                }
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "setSSOPasscode",
                [param.ssoPasscode]);
};

/**
 * Method for skipping registration through client hub.
 */
var skipClientHub = function(successCallback, errorCallback) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
        throw ('Invalid parameters in updateContextWithMCIM:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback);
    }
    
    return exec(
                function(success){
                
                if (typeof success.context !== 'undfined' && typeof success.state !== 'undefined') {
                successCallback(success.context, success.state);
                }
                else{
                successCallback(success, null);
                }
                
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "skipClientHub",
                []);
};

/*
 * Method for sending events.
 * @param eventId: the id of event which was fired; possible values: PAUSE, RESUME
 */
var onEvent = function(successCallback, errorCallback, eventId) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
        throw ('Invalid parameters in updateContextWithMCIM:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback);
    }
    
    return exec(
                function(success){
                
                if (typeof success.context !== 'undfined' && typeof success.state !== 'undefined') {
                successCallback(success.context, success.state);
                }
                else{
                successCallback(success, null);
                }
                
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "onEvent",
                [eventId]);
};


/*
 * Method for setting timeoutvalue
 * @param timeout: timeout in minutes; after how many seconds the dataVault should be locked if the app is in the background;
 * makes only difference in case the passcode policy is not readonly; readonly flag is part of the logonContext: policyReadOnly
 */
var setTimeout = function(successCallback, errorCallback, timeout) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
        throw ('Invalid parameters in updateContextWithMCIM:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback);
    }
    
    return exec(
                function(success){
                
                if (typeof success.context !== 'undfined' && typeof success.state !== 'undefined') {
                successCallback(success.context, success.state);
                }
                else{
                successCallback(success, null);
                }
                
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "setTimeout",
                [timeout]);
};

/*
 * Method for getting timeoutvalue
 * Return the timeout value in seconds
 */
var getTimeout = function(successCallback, errorCallback) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
        throw ('Invalid parameters in updateContextWithMCIM:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback);
    }
    
    return exec(
                function(success){
                successCallback(success);
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "getTimeout",
                []);
};

/**
 * Method for setting afaria credentials for retrieving seed data/afaria certificate
 * @param successCallback(context,state): this method will be called back with parameters context and state if afaria credential is valid;
 * @param errorCallback: this method will be called back if registration fails with parameter error
 * Possible error codes for error domains:
 *   Error domain: MAFLogonCoreCDVPlugin
 *       - 2 (plugin not initialized)
 *       - 3 (no input provided)
 * @param context: the context which must contain properties with following parameters:
 *       - afariaUser
 *       - afariaPassword
 */
var setAfariaCredential = function(successCallback, errorCallback, context) {
    
    if (typeof successCallback !== 'function' || typeof errorCallback !== 'function') {
        throw ('Invalid parameters in updateContextWithMCIM:' +
               '\nsuccessCallback: ' + typeof successCallback +
               '\nerrorCallback: ' + typeof errorCallback);
    }
    
    var input = JSON.stringify(context);
    
    return exec(
                function(success){
                if (typeof success.context !== 'undfined' && typeof success.state !== 'undefined') {
                successCallback(success.context, success.state);
                }
                else{
                successCallback(success, null);
                }
                },
                function(error){
                errorCallback(error);
                },
                "MAFLogonCoreCDVPluginJS",
                "setAfariaCredential",
                [input]);
    
};


module.exports = {
initLogon: initLogon,
getState: getState,
getContext: getContext,
startRegistration: startRegistration,
cancelRegistration: cancelRegistration,
persistRegistration: persistRegistration,
deleteRegistration: deleteRegistration,
changePasscode: changePasscode,
changePassword: changePassword,
lockSecureStore: lockSecureStore,
unlockSecureStore: unlockSecureStore,
getSecureStoreObject: getSecureStoreObject,
setSecureStoreObject: setSecureStoreObject,
setSSOPasscode: setSSOPasscode,
skipClientHub: skipClientHub,
onEvent: onEvent,
setTimeout: setTimeout,
getTimeout: getTimeout,
setAfariaCredential: setAfariaCredential
};


});

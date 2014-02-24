var utils = sap.logon.Utils;
var TIMEOUT = 2000;

var _oLogonCore;
var _oLogonView;
var _hasLogonSuccessEventFired = false;

var _providedContext;
var flowqueue;

var init = function (successCallback, errorCallback, applicationId, context, customView) {
    
    document.addEventListener("resume",
                              function(){
                              resume(
                                     function() { fireEvent('onSapResumeSuccess', arguments);},
                                     function() { fireEvent('onSapResumeError', arguments);}
                                     );
                              },
                              false);
    
    // The success callback used for the call to _oLogonCore.initLogon(...)
    var initSuccess = function(){
        utils.log('LogonController: LogonCore successfully initialized.');
        
        // Now that Logon is initialized, registerOrUnlock is automatically called.
        registerOrUnlock( successCallback, errorCallback );
    }
    
    var initError = function(error){
        // If a parameter describing the error is given, pass it along.
        // Otherwise, construct something to call the error callback with.
        if( error ) {
            errorCallback( error );
        } else {
            errorCallback( utils.Error('ERR_INIT_FAILED') );
        }
    }
    
    
    utils.log('LogonController.init enter');
    utils.log(applicationId);
    module.exports.applicationId = applicationId;
    
    // Make note of the context given (if any)
    if( context ){
        _providedContext = context;
    }
    
    _oLogonView = customView;
    if (!_oLogonView) {
        _oLogonView = sap.logon.IabUi;
    }

    flowqueue = new FlowRunnerQueue();
    
    //coLogonCore.cordova.require("com.sap.mp.cordova.plugins.logon.LogonCore");
    _oLogonCore = sap.logon.Core;
    _oLogonCore.initLogon(initSuccess, initError, applicationId);
    
    //update exports definition
    module.exports.core = _oLogonCore;
}

var fireEvent = function (eventId, args) {
    if (typeof eventId === 'string') {
        //var event = document.createEvent('Events');
        //event.initEvent(eventId, false, false);
        
        if (!window.CustomEvent) {
            window.CustomEvent = function(type, eventInitDict) {
                var newEvent = document.createEvent('CustomEvent');
                newEvent.initCustomEvent(
                                         type,
                                         !!(eventInitDict && eventInitDict.bubbles),
                                         !!(eventInitDict && eventInitDict.cancelable),
                                         (eventInitDict ? eventInitDict.detail : null));
                return newEvent;
            };
        }
        
        var event = new CustomEvent(eventId, { 'detail':{ 'id': eventId, 'args': args }});
        
        setTimeout(function() {
                   document.dispatchEvent(event);
                   }, 0);
    } else {
        throw 'Invalid eventId: ' + JSON.stringify(event);
    }
}

var FlowRunner = function(callbacks, pLogonView, pLogonCore, flowClass) {
    
    var onFlowSuccess;
    var onFlowError;
    var onFlowCancel;
    
    var logonView;
    var logonCore;
    var flow;
    
    var onsuccess = callbacks.onsuccess;
    var onerror = callbacks.onerror;
    
    
    
    logonView = pLogonView;
    logonCore = pLogonCore;
    
    onFlowSuccess = function onFlowSuccess() {
        utils.logJSON('onFlowSuccess');
        logonView.close();
        onsuccess.apply(this, arguments);
    }
    
    onFlowError = function onFlowError() {
        utils.logJSON('onFlowError');
        logonView.close();
        onerror.apply(this, arguments);
    }
    
    onFlowCancel = function onFlowCancel(){
        utils.logJSON('onFlowCancel');
        //logonView.close();
        onFlowError(new utils.Error('ERR_USER_CANCELLED'));
    }
    
    var handleCoreStateOnly = function(currentState){
        handleCoreResult(null, currentState);
    }
    
    var handleCoreResult = function (currentContext, currentState) {
        if (typeof currentContext === undefined) currentContext = null;
        
        //workaround for defaultPasscodeAllowed
        if (currentState) {
            if (currentContext && currentContext.policyContext && currentContext.policyContext.defaultAllowed){
                currentState.defaultPasscodeAllowed = true;
            }
            else {
                currentState.defaultPasscodeAllowed = false;
            }
        }
        
        utils.logJSON(currentContext, 'handleCoreResult currentContext');
        utils.logJSON(currentState, 'handleCoreResult currentState');
        
        
        utils.logJSON(flow.name);
        var matchFound = false;
        var rules = flow.stateTransitions;
        
        
    ruleMatching:
        for (key in rules){
            
            var rule = flow.stateTransitions[key];
            //utils.logJSON(rule, 'rule');
            
            //utils.logJSON(rule.condition, 'rule.condition');
            if (typeof rule.condition === 'undefined') {
                throw 'undefined condition in state transition rule';
            }
            
            
            if (rule.condition.state === null) {
                if (currentState)
                {
                    continue ruleMatching; // non-null state (and rule) mismatch
                }
                //else {
                //	// match:
                //	// rule.condition.state === null &&
                //	// (typeof currentState === 'undefined') // null or undefined
                //}
            }
            else if (rule.condition.state !== 'undefined' && currentState){
                utils.log('stateMatching');
                
            stateMatching:
                for (field in rule.condition.state) {
                    utils.log(field);
                    if (rule.condition.state[field] === currentState[field])
                    {
                        utils.log('field matching ' + field);
                        continue stateMatching; // state field match
                    }
                    else {
                        utils.log('field mismatching ' + field);
                        continue ruleMatching; // state field (and rule) mismatch
                    };
                }
            }
            
            if (rule.condition.context === null) {
                if (currentContext)
                {
                    continue ruleMatching; // non-null context (and rule) mismatch
                }
                //else {
                //	// match:
                //	// rule.condition.context === null &&
                //	// (typeof currentContext === 'undefined') // null or undefined
                //}
            }
            else if (rule.condition.context !== 'undefined' && currentContext){
                
                utils.log('contextMatching');
            contextMatching:
                for (field in rule.condition.context) {
                    utils.log(field);
                    if (rule.condition.context[field] === currentContext[field])
                    {
                        utils.log('field matching ' + field);
                        continue contextMatching;  // context field match
                    }
                    else {
                        utils.log('field mismatching ' + field);
                        continue ruleMatching;  // context field (and rule) mismatch
                    };
                }
            }
            utils.log('match found');
            utils.logJSON(rule, 'rule');
            
            if (typeof rule.action === 'function') {
                rule.action(currentContext);
            }
            else if (typeof rule.action === 'string') {
                // the action is a screenId
                var screenId = rule.action;
                utils.log('handleCoreResult: ' + screenId);
                utils.logKeys(flow.screenEvents[screenId]);
                if(!currentContext){
                    currentContext = {};
                }
                
                if( !currentContext.registrationContext && _providedContext ){
                    // The current registrationContext is null, and we have been given a context when initialized,
                    // so use the one we were given.
                    currentContext.registrationContext = _providedContext;
                } else if (currentContext.registrationContext && _providedContext && !currentContext.registrationReadOnly && !(currentState.stateAfaria=='initializationSuccessful')){
                    for (key in _providedContext) {
                        //if (!currentContext.registrationContext[key]){
                        currentContext.registrationContext[key] = _providedContext[key];
                        //}
                    }
                }
                
                logonView.showScreen(screenId, flow.screenEvents[screenId], currentContext);
                
            }
            else {
                onFlowError(new utils.Error('ERR_INVALID_ACTION'));
            }
            
            matchFound = true;
            break ruleMatching;
        }
        
        if (!matchFound) {
            onFlowError(new utils.Error('ERR_INVALID_STATE'));
        }
    }
    
    flow = new flowClass(logonCore, logonView, handleCoreResult, onFlowSuccess, onFlowError, onFlowCancel);
    
    this.run = function() {
        utils.log('FlowRunner.run '  + flowClass.name);
        utils.logKeys(flow , 'new flow ');
        logonCore.getState(handleCoreStateOnly, onFlowError);
    }
}

var FlowRunnerQueue = function() {
    var isRunning = false;
    var innerQueue = [];
    
    this.add = function(flowRunner) {
        innerQueue.push(flowRunner);
        if (isRunning == false) {
            isRunning = true;
            process();
        }
    }
    
   this.runNextFlow = function() {
    	innerQueue.shift();
        if (innerQueue.length == 0) {
            isRunning = false;
        }
        else {
            process();
        }
    }
    
    var process = function() {
        if (innerQueue.length > 0) {
            var flowRunner = innerQueue[0];
            flowRunner.run();
        }
        else {
            isRunning = false;
        }
    }
}


var MockFlow = function MockFlow(logonCore, logonView, onCoreResult, onFlowSuccess, onFlowError, onFlowCancel) {
    //wrapped into a function to defer evaluation of the references to flow callbacks
    //var flow = {};
    
    this.name = 'mockFlowBuilder';
    
    this.stateTransitions = [
                             {
                             condition: {
                             state: {
                             secureStoreOpen: false,
                             }
                             },
                             action: 'SCR_MOCKSCREEN'
                             },
                             {
                             condition: {
                             state: {
                             secureStoreOpen: true,
                             }
                             },
                             action: 'SCR_MOCKSCREEN'
                             },
                             
                             ];
    
    this.screenEvents = {
        'SCR_TURN_PASSCODE_ON': {
        onsubmit: onFlowSuccess,
        oncancel: onFlowCancel,
        onerror: onFlowError,
        }
    };
    
    utils.log('flow constructor return');
    //return flow;
}

var RegistrationFlow = function RegistrationFlow(logonCore, logonView, onCoreResult, onFlowSuccess, onFlowError, onFlowCancel) {
    //wrapped into a function to defer evaluation of the references to flow callbacks
    
    this.name = 'registrationFlowBuilder';
    
    var registrationInProgress = false;
    
    var onCancelSSOPin = function() {
        onFlowError(errorWithDomainCodeDescription("MAFLogon","0","SSO Passcode set screen was cancelled"));
    }
    
    var onCancelRegistration = function() {
        onFlowError(errorWithDomainCodeDescription("MAFLogon","1","Registration screen was cancelled"));
    }
    
    // internal methods
    var showScreen = function(screenId) {
        return function(coreContext) {
            logonView.showScreen(screenId, this.screenEvents[screenId], coreContext);
        }.bind(this);
    }.bind(this);
    
    var onUnlockSubmit = function(context){
        utils.logJSON(context, 'logonCore.unlockSecureStore');
        logonCore.unlockSecureStore(onCoreResult, onUnlockError, context)
    }
    
    var onUnlockError = function(error) {
        utils.logJSON("onUnlockError: " + JSON.stringify(error));
        
        // TODO switch case according to the error codes
        if (error 
                && error.errorDomain && error.errorDomain === "MAFSecureStoreManagerErrorDomain"
                && error.errorCode && error.errorCode === "16") {
                // Too many attempts --> DV deleted
                logonView.showNotification("ERR_TOO_MANY_ATTEMPTS_APP_PASSCODE")
        }
        else {
                logonView.showNotification("ERR_UNLOCK_FAILED");
        }

    }
    
    var onSetAfariaCredentialError = function(error) {
        utils.logJSON("onSetAfariaCredentialError: " + JSON.stringify(error));
        
        logonView.showNotification("ERR_SET_AFARIA_CREDENTIAL_FAILED");
    }
    
    var noOp = function() { }

    var onErrorAck = function(ack) {
        if (ack.key === 'ERR_TOO_MANY_ATTEMPTS_APP_PASSCODE') {
            	onFlowError(new utils.Error('ERR_TOO_MANY_ATTEMPTS_APP_PASSCODE'));
        }
    }

    
    var onRegistrationBackButton = function() {
        if (registrationInProgress == true) {
            utils.log('back button pushed, no operation is required as registration is running');
        }
        else {
            onCancelRegistration();
        }
    }
    
    var onUnlockVaultWithDefaultPasscode = function(){
        utils.log('logonCore.unlockSecureStore - default passcode');
        var unlockContext = {"unlockPasscode":null};
        logonCore.unlockSecureStore(onCoreResult, onFlowError, unlockContext)
    }
    
    var onRegSucceeded = function(context, state) {
        onCoreResult(context, state);
        registrationInProgress = false;
    }
    
    var onRegError = function(error){
        utils.logJSON(error, 'registration failed');
        logonView.showNotification(getRegistrationErrorText(error));
        registrationInProgress = false;
    }
    
    var onRegSubmit = function(context){
        utils.logJSON(context, 'logonCore.startRegistration');
        registrationInProgress = true;
        logonCore.startRegistration(onRegSucceeded, onRegError, context)
    }
    
    var onCreatePasscodeSubmit = function(context){
        utils.logJSON(context, 'logonCore.persistRegistration');
        logonCore.persistRegistration(onCoreResult, onCreatePasscodeError, context);
    }
    
    var onCancelRegistrationError = function(error){
        utils.logJSON("onCancelRegistrationError: " + JSON.stringify(error));
        logonView.showNotification(getRegistrationCancelError(error));
    }
    
    var onCreatePasscodeError = function(error) {
        utils.logJSON("onCreatePasscodeError: " + JSON.stringify(error));
        logonView.showNotification(getSecureStoreErrorText(error));
    }
    
    var onSSOPasscodeSetError = function(error) {
        utils.logJSON("onSSOPasscodeSetError: " + JSON.stringify(error));
        logonView.showNotification(getSSOPasscodeSetErrorText(error));
    }
    
    var callGetContext = function(){
        utils.log('logonCore.getContext');
        logonCore.getContext(onCoreResult, onFlowError);
    }
    
    var onFullRegistered = function()
    {
        var getContextSuccessCallback = function(result){
            
            if(!_hasLogonSuccessEventFired) {
                fireEvent("onSapLogonSuccess", arguments);
                _hasLogonSuccessEventFired = true;
            }
            
            onFlowSuccess(result);
        }
        utils.log('logonCore.getContext');
        logonCore.getContext(getContextSuccessCallback, onFlowError);
    }
    
    var onForgotAppPasscode = function(){
        utils.log('logonCore.deleteRegistration');
        logonCore.deleteRegistration(onFlowError, onFlowError);
    }
    
    var onForgotSsoPin = function(){
        utils.log('forgotSSOPin');
        logonView.showNotification("ERR_FORGOT_SSO_PIN");
    }
    
    var onSkipSsoPin = function(){
        utils.logJSON('logonCore.skipClientHub');
        logonCore.skipClientHub(onCoreResult, onFlowError);
    }
    
    var callPersistWithDefaultPasscode = function(context){
        utils.logJSON(context, 'logonCore.persistRegistration');
        context.passcode = null;
        logonCore.persistRegistration(
                                      onCoreResult,
                                      onFlowError,
                                      context)
    }
    
    // exported properties
    this.stateTransitions = [
                             {
                             condition: {
                             state: {
                             secureStoreOpen: false,
                             status: 'fullRegistered',
                             defaultPasscodeUsed: true
                             }
                             },
                             action: onUnlockVaultWithDefaultPasscode
                             },
                             
                             {
                             condition: {
                             state: {
                             secureStoreOpen: false,
                             status: 'fullRegistered'
                             }
                             },
                             action: 'SCR_UNLOCK'
                             },
                             
                             
                             {
                             condition: {
                             state: {
                             //secureStoreOpen: false, //TODO clarify
                             status: 'fullRegistered',
                             stateClientHub: 'availableNoSSOPin'
                             }
                             },
                             action: 'SCR_SSOPIN_SET'
                             },
                             {
                             condition: {
                             state: {
                             status: 'new'
                             },
                             context: null
                             },
                             action: callGetContext
                             },
                             
                             {
                             condition: {
                             state: {
                             status: 'new',
                             stateClientHub: 'availableNoSSOPin'
                             }
                             },
                             action: 'SCR_SSOPIN_SET'
                             },
                             
                             {
                             condition: {
                             state: {
                             status: 'new',
                             stateClientHub: 'availableInvalidSSOPin'
                             }
                             },
                             action: 'SCR_SSOPIN_SET'
                             },
                             {
                             condition: {
                             state: {
                             status: 'new',
                             stateClientHub: 'availableValidSSOPin',
                             stateAfaria: 'credentialNeeded'
                             },
                             context : {
                             afariaRegistration: 'certificate'
                             }
                             },
                             action: 'SCR_ENTER_AFARIA_CREDENTIAL'
                             },
                             {
                             condition: {
                             state: {
                             status: 'new',
                             stateClientHub: 'notAvailable',
                             stateAfaria: 'credentialNeeded'
                             }
                             },
                             action: 'SCR_ENTER_AFARIA_CREDENTIAL'
                             },
                             {
                             condition: {
                             state: {
                             status: 'new',
                             isAfariaCredentialsProvided: false
                             },
                             context : {
                             afariaRegistration: 'certificate'
                             }
                             },
                             action: 'SCR_ENTER_AFARIA_CREDENTIAL'
                             },
                             {
                             condition: {
                             state: {
                             status: 'new',
                             stateClientHub: 'availableValidSSOPin'
                             },
                             context : {
                             credentialsByClientHub : true,
                             registrationReadOnly : true
                             }
                             },
                             action: function(context){
                             utils.logJSON(context, 'logonCore.startRegistration');
                             logonCore.startRegistration(onCoreResult, onRegError, context.registrationContext);
                             }
                             },
                             {
                             condition: {
                             state: {
                             status: 'new',
                             stateClientHub: 'availableValidSSOPin',
                             isAfariaCredentialsProvided: true
                             },
                             context : {
                             afariaRegistration: 'certificate',
                             registrationReadOnly : true
                             }
                             },
                             action: function(context){
                             utils.logJSON(context, 'logonCore.startRegistration');
                             logonCore.startRegistration(onCoreResult, onRegError, context.registrationContext);
                             }
                             },
                             {
                             condition: {
                             state: {
                             status: 'new',
                             stateClientHub: 'availableValidSSOPin',
                             stateAfaria: 'initializationSuccessful'
                             },
                             context : {
                             registrationReadOnly : true,
                             afariaRegistration: 'certificate'
                             }
                             },
                             action: function(context){
                             utils.logJSON(context, 'logonCore.startRegistration');
                             logonCore.startRegistration(onCoreResult, onRegError, context.registrationContext);
                             }
                             },
                             {
                             condition: {
                             state: {
                             status: 'new',
                             stateClientHub: 'notAvailable',
                             stateAfaria: 'initializationSuccessful'
                             },
                             context : {
                             afariaRegistration: 'certificate'
                             }
                             },
                             action: function(context){
                             utils.logJSON(context, 'logonCore.startRegistration');
                             logonCore.startRegistration(onCoreResult, onRegError, context.registrationContext);
                             }
                             },
                             {
                             condition: {
                             state: {
                             status: 'new',
                             stateAfaria: 'initializationSuccessful'
                             }
                             },
                             action: 'SCR_ENTER_CREDENTIALS'
                             },
                             {
                             condition: {
                             state: {
                             status: 'new',
                             stateClientHub: 'availableValidSSOPin'
                             },
                             context : {
                             registrationReadOnly :true,
                             credentialsByClientHub : false
                             }
                             },
                             action: 'SCR_ENTER_CREDENTIALS'
                             },
                             
                             
                             {
                             condition: {
                             state: {
                             status: 'new',
                             //stateClientHub: 'notAvailable' | 'availableValidSSOPin' | 'skipped' | 'error'
                             stateAfaria: 'initializationFailed'
                             }
                             },
                             action: 'SCR_REGISTRATION'
                             },
                             
                             {
                             condition: {
                             state: {
                             status: 'new',
                             //stateClientHub: 'notAvailable' | 'availableValidSSOPin' | 'skipped' | 'error'
                             }
                             },
                             action: 'SCR_REGISTRATION'
                             },
                             
                             {
                             condition: {
                             state: {
                             status: 'new',
                             //stateClientHub: 'notAvailable' | 'availableValidSSOPin' | 'skipped' | 'error'
                             stateAfaria: 'initializationFailed'
                             }
                             },
                             action: 'SCR_REGISTRATION'
                             },
                             
                             {
                             condition: {
                             state: {
                             secureStoreOpen: false,
                             status: 'registered',
                             defaultPasscodeUsed: true,
                             //                        defaultPasscodeAllowed: true,
                             }
                             },
                             action: 'SCR_SET_PASSCODE_OPT_OFF'
                             },
                             {
                             condition: {
                             state: {
                             secureStoreOpen: false,
                             status: 'registered',
                             defaultPasscodeUsed: false,
                             defaultPasscodeAllowed: true,
                             }
                             },
                             action: 'SCR_SET_PASSCODE_OPT_ON'
                             },
                             {
                             condition: {
                             state: {
                             secureStoreOpen: false,
                             status: 'registered',
                             //                        defaultPasscodeAllowed: false,
                             }
                             },
                             action: 'SCR_SET_PASSCODE_MANDATORY'
                             },
                             
                             
                             {
                             condition: {
                             state: {
                             //secureStoreOpen: false, //TODO clarify
                             status: 'fullRegistered',
                             stateClientHub: 'availableInvalidSSOPin'
                             }
                             },
                             action: 'SCR_SSOPIN_CHANGE'
                             },
                             {
                             condition: {
                             state: {
                             secureStoreOpen: true,
                             status: 'fullRegistered',
                             stateClientHub: 'notAvailable'
                             }
                             },
                             action: onFullRegistered
                             },
                             {
                             condition: {
                             state: {
                             secureStoreOpen: true,
                             status: 'fullRegistered',
                             stateClientHub: 'availableValidSSOPin'
                             }
                             },
                             action: onFullRegistered
                             },
                             {
                             condition: {
                             state: {
                             secureStoreOpen: true,
                             status: 'fullRegistered',
                             stateClientHub: 'skipped'
                             }
                             },
                             action: onFullRegistered
                             },
                             
                             
                             
                             ];
    
    this.screenEvents = {
        'SCR_SSOPIN_SET': {
        onsubmit: function(context){
            utils.logJSON(context, 'logonCore.setSSOPasscode');
            logonCore.setSSOPasscode(onCoreResult, onSSOPasscodeSetError, context);
        },
        oncancel: onCancelSSOPin,
        onerror: onFlowError,
        onforgot: onForgotSsoPin,
        onskip: onSkipSsoPin
        },
        
        'SCR_ENTER_AFARIA_CREDENTIAL' : {
        onsubmit: function(context){
            utils.logJSON(context, 'logonCore.setAfariaCredential');
            logonCore.setAfariaCredential(onCoreResult, onSetAfariaCredentialError, context);
        }
        },
        
        'SCR_SSOPIN_CHANGE': {
        onsubmit: function(context){
            utils.logJSON(context, 'logonCore.setSSOPasscode');
            logonCore.setSSOPasscode(onCoreResult, onSSOPasscodeSetError, context);
        },
        oncancel: onSkipSsoPin,
        onerror: onFlowError,
        onforgot: onForgotSsoPin
        },
        
        'SCR_UNLOCK': {
        onsubmit: onUnlockSubmit,
        oncancel: noOp,
        onerror: onFlowError,
        onforgot: onForgotAppPasscode,
        onerrorack: onErrorAck
        },
        
        'SCR_REGISTRATION':  {
        onsubmit: onRegSubmit,
        oncancel: onCancelRegistration,
        onerror: onFlowError,
        onbackbutton: onRegistrationBackButton
        },
        
        'SCR_ENTER_CREDENTIALS' : {
        onsubmit: onRegSubmit,
        oncancel: onCancelRegistration,
        onerror: onFlowError
        },
        'SCR_SET_PASSCODE_OPT_ON': {
        onsubmit: onCreatePasscodeSubmit,
        oncancel: noOp,
        onerror: onFlowError,
        ondisable: showScreen('SCR_SET_PASSCODE_OPT_OFF'),
        onerrorack: noOp
        },
        'SCR_SET_PASSCODE_OPT_OFF': {
        onsubmit: callPersistWithDefaultPasscode,
        oncancel: noOp,
        onerror: onFlowError,
        onenable: showScreen('SCR_SET_PASSCODE_OPT_ON'),
        onerrorack: noOp
        },
        'SCR_SET_PASSCODE_MANDATORY': {
        onsubmit: onCreatePasscodeSubmit,
        oncancel: noOp,
        onerror: onFlowError,
        onerrorack: noOp
        },
        
        
        
    };
    
    
    utils.log('flow constructor return');
}



var ChangePasswordFlow = function ChangePasswordFlow(logonCore, logonView, onCoreResult, onFlowSuccess, onFlowError, onFlowCancel) {
    //wrapped into a function to defer evaluation of the references to flow callbacks
    
    this.name = 'changePasswordFlowBuilder';
    
    
    // internal methods
    
    var callUnlockFlow = function(){
        utils.log(this.name + ' triggered unlock');
        registerOrUnlock(onCoreResult,onFlowError);
    }
    
    var onChangePasswordSubmit = function(context){
        utils.logJSON(context, 'logonCore.changePassword');
        // this logonCore call does not return with context
        logonCore.changePassword(onPasswordChanged, onFlowError, context);
    }
    
    
    var onPasswordChanged = function(){
        utils.log('onPasswordChanged');
        logonCore.getContext(onFlowSuccess, onFlowError);
    }
    
    // exported properties
    this.stateTransitions = [
                             {
                             condition: {
                             state: {
                             secureStoreOpen: false,
                             }
                             },
                             action: callUnlockFlow,
                             },
                             {
                             condition: {
                             state: {
                             secureStoreOpen: true,
                             }
                             },
                             action: 'SCR_CHANGE_PASSWORD'
                             },
                             
                             ];
    
    this.screenEvents = {
        'SCR_CHANGE_PASSWORD': {
        onsubmit: onChangePasswordSubmit,
        oncancel: onFlowCancel,
        onerror: onFlowError
        }
    };
    
    
    utils.log('flow constructor return');
}

var ManagePasscodeFlow = function ManagePasscodeFlow(logonCore, logonView, onCoreResult, onFlowSuccess, onFlowError, onFlowCancel) {
    //wrapped into a function to defer evaluation of the references to flow callbacks
    
    this.name = 'managePasscodeFlowBuilder';
    
    // internal methods
    var showScreen = function(screenId) {
        return function(coreContext) {
            logonView.showScreen(screenId, this.screenEvents[screenId], coreContext);
        }.bind(this);
    }.bind(this);
    
 
    var callSetPasscode = function(context){
        utils.logJSON(context, 'logonCore.changePasscode');
        logonCore.changePasscode(
                                 onCoreResult,
                                 onChangePasscodeError,
                                 context)
    }
    
    var callChangePasscode = function(context){
        utils.logJSON(context, 'logonCore.changePasscode');
        context.passcode = context.newPasscode;
        logonCore.changePasscode(
                                 onCoreResult,
                                 onChangePasscodeError,
                                 context)
    }
    
    var onChangePasscodeError = function(error) {
        utils.logJSON("onChangePasscodeError: " + JSON.stringify(error));
        logonView.showNotification(getSecureStoreErrorText(error));
    }
    
    var noOp = function() { }
    
    var callDisablePasscode = function(context){
        utils.logJSON(context, 'logonCore.disablePasscode');
        context.passcode = null;
        logonCore.changePasscode(
                                 onCoreResult,
                                 onFlowError,
                                 context)
    }
    
    var callGetContext = function(){
        utils.log('logonCore.getContext');
        logonCore.getContext(onCoreResult, onFlowError);
    }
    
    var onPasscodeEnable = function(context){
        utils.logJSON(context, this.name + ' onPasscodeEnable: ');
        //logonCore.changePasscode(onFlowSuccess, onFlowError, context);
        onFlowError();
    }
    
    // exported properties
    this.stateTransitions = [
                             {
                             condition: {
                             state: {
                             secureStoreOpen: true,
                             },
                             context: null
                             },
                             action: callGetContext
                             },
                             {
                             condition: {
                             state: {
                             secureStoreOpen: false,
                             }
                             },
                             action: onFlowError
                             },
                             {
                             condition: {
                             state: {
                             secureStoreOpen: true,
                             defaultPasscodeUsed: true,
                             //                        defaultPasscodeAllowed: true,
                             }
                             },
                             action: 'SCR_MANAGE_PASSCODE_OPT_OFF'
                             },
                             {
                             condition: {
                             state: {
                             secureStoreOpen: true,
                             defaultPasscodeUsed: false,
                             defaultPasscodeAllowed: true,
                             }
                             },
                             action: 'SCR_MANAGE_PASSCODE_OPT_ON'
                             },
                             {
                             condition: {
                             state: {
                             secureStoreOpen: true,
                             //defaultPasscodeUsed: [DONTCARE],
                             defaultPasscodeAllowed: false,
                             }
                             },
                             action: 'SCR_MANAGE_PASSCODE_MANDATORY'
                             },
                             
                             
                             ];
    
    this.screenEvents = {
        'SCR_MANAGE_PASSCODE_OPT_ON': {
        onsubmit: onFlowSuccess,
        oncancel: onFlowSuccess,
        onerror: onFlowError,
        ondisable: showScreen('SCR_CHANGE_PASSCODE_OPT_OFF'),
        onchange: showScreen('SCR_CHANGE_PASSCODE_OPT_ON')
        },
        'SCR_MANAGE_PASSCODE_OPT_OFF': {
        onsubmit: onFlowSuccess,
        oncancel: onFlowSuccess,
        onerror: onFlowError,
        onenable: showScreen('SCR_SET_PASSCODE_OPT_ON')
        },
        'SCR_MANAGE_PASSCODE_MANDATORY': {
        onsubmit: onFlowSuccess,
        oncancel: onFlowSuccess,
        onerror: onFlowError,
        onchange: showScreen('SCR_CHANGE_PASSCODE_MANDATORY')
        },
        
        
        'SCR_SET_PASSCODE_OPT_ON': {
        onsubmit: callSetPasscode,
        oncancel: onFlowCancel,
        onerror: onFlowError,
        ondisable: showScreen('SCR_SET_PASSCODE_OPT_OFF'),
        onerrorack: noOp
        },
        'SCR_SET_PASSCODE_OPT_OFF': {
        onsubmit: callDisablePasscode,
        oncancel: onFlowCancel,
        onerror: onFlowError,
        onenable: showScreen('SCR_SET_PASSCODE_OPT_ON'),
        onerrorack: noOp
        },
        'SCR_CHANGE_PASSCODE_OPT_ON': {
        onsubmit: callChangePasscode,
        oncancel: onFlowCancel,
        onerror: onFlowError,
        ondisable: showScreen('SCR_CHANGE_PASSCODE_OPT_OFF'),
        onerrorack: noOp
        },
        'SCR_CHANGE_PASSCODE_OPT_OFF': {
        onsubmit: callDisablePasscode,
        oncancel: onFlowCancel,
        onerror: onFlowError,
        onenable: showScreen('SCR_CHANGE_PASSCODE_OPT_ON'),
        onerrorack: noOp
        },
        'SCR_CHANGE_PASSCODE_MANDATORY': {
        onsubmit: callChangePasscode,
        oncancel: onFlowCancel,
        onerror: onFlowError,
        onerrorack: noOp
        },
        
    };
    
    
    utils.log('flow constructor return');
}

var ShowRegistrationFlow = function ShowRegistrationFlow(logonCore, logonView, onCoreResult, onFlowSuccess, onFlowError, onFlowCancel) {
    //wrapped into a function to defer evaluation of the references to flow callbacks
    
    this.name = 'showRegistrationFlowBuilder';
    
    var showRegistrationInfo = function(context) {
        logonView.showScreen('SCR_SHOW_REGISTRATION', this.screenEvents['SCR_SHOW_REGISTRATION'], context);
    }.bind(this);
    
    var callGetContext = function(){
        utils.log('logonCore.getContext');
        logonCore.getContext(onCoreResult, onFlowError);
    }
    
    // exported properties
    this.stateTransitions = [
                             {
                             condition: {
                             state: {
                             secureStoreOpen: true,
                             
                             },
                             context: null
                             },
                             action: callGetContext
                             },
                             {
                             condition: {
                             secureStoreOpen: true,
                             },
                             action: showRegistrationInfo
                             }
                             
                             ];
    
    this.screenEvents = {
        'SCR_SHOW_REGISTRATION': {
        oncancel: onFlowSuccess,
        onerror: onFlowError
        }
    };
    
    
    utils.log('flow constructor return');
}

// === flow launcher methods =====================================


var resume = function (onsuccess, onerror) {
    
    if(!_oLogonCore) {
        utils.log('FlowRunner.run MAFLogon is not initialized');
        onerror(errorWithDomainCodeDescription("MAFLogon","2","MAFLogon is not initialized"));
        return;
    }
    
    var onUnlockSuccess = function(){
        _oLogonCore.onEvent(onsuccess, onerror, 'RESUME');
    }
    
    var onGetStateSuccess = function(state) {
        //call registration flow only if the status is fullregistered in case of resume, so logon screen will not loose its input values
        if (state.status == 'fullRegistered') {
            registerOrUnlock(onUnlockSuccess, onerror);
        }
    }
    
    getState(onGetStateSuccess, onerror);
}


var get = function (onsuccess, onerror, key) {
    
    if(!_oLogonCore) {
        utils.log('FlowRunner.run MAFLogon is not initialized');
        onerror(errorWithDomainCodeDescription("MAFLogon","2","MAFLogon is not initialized"));
        return;
    }
    
    var onUnlockSuccess = function(){
        _oLogonCore.getSecureStoreObject(onsuccess, onerror, key);
    }
    
    registerOrUnlock(onUnlockSuccess, onerror);
}



var set = function (onsuccess, onerror, key, value) {
    
    if(!_oLogonCore) {
        utils.log('FlowRunner.run MAFLogon is not initialized');
        onerror(errorWithDomainCodeDescription("MAFLogon","2","MAFLogon is not initialized"));
        return;
    }
    
    var onUnlockSuccess = function(){
        _oLogonCore.setSecureStoreObject(onsuccess, onerror, key, value);
    }
    
    registerOrUnlock(onUnlockSuccess, onerror);
}



var lock = function (onsuccess, onerror) {
    if(!_oLogonCore) {
        utils.log('FlowRunner.run MAFLogon is not initialized');
        onerror(errorWithDomainCodeDescription("MAFLogon","2","MAFLogon is not initialized"));
        return;
    }
    
    _oLogonCore.lockSecureStore(onsuccess, onerror);
}

var getState = function (onsuccess, onerror) {
    if(!_oLogonCore) {
        utils.log('FlowRunner.run MAFLogon is not initialized');
        onerror(errorWithDomainCodeDescription("MAFLogon","2","MAFLogon is not initialized"));
        return;
    }
    
    _oLogonCore.getState(onsuccess, onerror);
}

var wrapCallbackWithQueueNext = function(callback) {
    return function() { 
        callback.apply(this, arguments);
     	if (flowqueue) {
            flowqueue.runNextFlow();
        }
    }
}


var registerOrUnlock = function(onsuccess, onerror) {
    if(!_oLogonCore) {
        utils.log('FlowRunner.run MAFLogon is not initialized');
        onerror(errorWithDomainCodeDescription("MAFLogon","2","MAFLogon is not initialized"));
        return;
    }
    
    var callbacks = {
        "onsuccess" : wrapCallbackWithQueueNext(onsuccess),
        "onerror" : wrapCallbackWithQueueNext(onerror)
    }
    var flowRunner = new FlowRunner(callbacks, _oLogonView, _oLogonCore, RegistrationFlow);

    
    if (flowqueue) {
        flowqueue.add(flowRunner);
    }
    else {
        flowRunner.run();
    }
}

var changePassword = function(onsuccess, onerror) {
    if(!_oLogonCore) {
        utils.log('FlowRunner.run MAFLogon is not initialized');
        onerror(errorWithDomainCodeDescription("MAFLogon","2","MAFLogon is not initialized"));
        return;
    }
    
    var onUnlockSuccess = function(){
        var callbacks = {
            "onsuccess" : wrapCallbackWithQueueNext(onsuccess),
            "onerror" : wrapCallbackWithQueueNext(onerror)
        }
        var innerFlowRunner = new FlowRunner(callbacks, _oLogonView, _oLogonCore, ChangePasswordFlow);

        if (flowqueue) {
            flowqueue.add(innerFlowRunner);
        }
        else {
            innerFlowRunner.run();
        }
    }
    
    registerOrUnlock(onUnlockSuccess, onerror);
}


var forgottenPasscode = function(onsuccess, onerror) {
    if(!_oLogonCore) {
        utils.log('FlowRunner.run MAFLogon is not initialized');
        onerror(errorWithDomainCodeDescription("MAFLogon","2","MAFLogon is not initialized"));
        return;
    }
    
    var onUnlockSuccess = function(){
	var callbacks = {
            "onsuccess" : wrapCallbackWithQueueNext(onsuccess),
            "onerror" : wrapCallbackWithQueueNext(onerror)
        }
        var innerFlowRunner = new FlowRunner(callbacks, _oLogonView, _oLogonCore, MockFlow);
        if (flowqueue) {
            flowqueue.add(innerFlowRunner);
        }
        else {
            innerFlowRunner.run();
        }
    }
    
    registerOrUnlock(onUnlockSuccess, onerror);
}

var managePasscode = function(onsuccess, onerror) {
    if(!_oLogonCore) {
        utils.log('FlowRunner.run MAFLogon is not initialized');
        onerror(errorWithDomainCodeDescription("MAFLogon","2","MAFLogon is not initialized"));
        return;
    }
    
    var onUnlockSuccess = function(){
	var callbacks = {
            "onsuccess" : wrapCallbackWithQueueNext(onsuccess),
            "onerror" : wrapCallbackWithQueueNext(onerror)
        }
        var innerFlowRunner = new FlowRunner(callbacks, _oLogonView, _oLogonCore, ManagePasscodeFlow);
        if (flowqueue) {
            flowqueue.add(innerFlowRunner);
        }
        else {
            innerFlowRunner.run();
        }
    }
    
    registerOrUnlock(onUnlockSuccess, onerror);
}

var showRegistrationData = function(onsuccess, onerror) {
    if(!_oLogonCore) {
        utils.log('FlowRunner.run MAFLogon is not initialized');
        onerror(errorWithDomainCodeDescription("MAFLogon","2","MAFLogon is not initialized"));
        return;
    }
    
    var onUnlockSuccess = function(){
	var callbacks = {
            "onsuccess" : wrapCallbackWithQueueNext(onsuccess),
            "onerror" : wrapCallbackWithQueueNext(onerror)
        }
        var innerFlowRunner = new FlowRunner(callbacks, _oLogonView, _oLogonCore, ShowRegistrationFlow);
        if (flowqueue) {
            flowqueue.add(innerFlowRunner);
        }
        else {
            innerFlowRunner.run();
        }
    }
    
    registerOrUnlock(onUnlockSuccess, onerror);
}

var getSecureStoreErrorText = function(error) {
    utils.logJSON('LogonController.getSecureStoreErrorText: ' + JSON.stringify(error));
    
    var errorText;
    
    if(error.errorCode === '14' && error.errorDomain === 'MAFSecureStoreManagerErrorDomain')
        errorText = "ERR_PASSCODE_TOO_SHORT";
    else if(error.errorCode === '10' && error.errorDomain === 'MAFSecureStoreManagerErrorDomain')
        errorText = "ERR_PASSCODE_REQUIRES_DIGIT";
    else if(error.errorCode === '13' && error.errorDomain === 'MAFSecureStoreManagerErrorDomain')
        errorText = "ERR_PASSCODE_REQUIRES_UPPER";
    else if(error.errorCode === '11' && error.errorDomain === 'MAFSecureStoreManagerErrorDomain')
        errorText = "ERR_PASSCODE_REQUIRES_LOWER";
    else if(error.errorCode === '12' && error.errorDomain === 'MAFSecureStoreManagerErrorDomain')
        errorText = "ERR_PASSCODE_REQUIRES_SPECIAL";
    else if(error.errorCode === '15' && error.errorDomain === 'MAFSecureStoreManagerErrorDomain')
        errorText = "ERR_PASSCODE_UNDER_MIN_UNIQUE_CHARS";
    else {
        errorText = "ERR_SETPASSCODE_FAILED";
    }
    
    return errorText;
}

var getSSOPasscodeSetErrorText = function(error) {
    utils.logJSON('LogonController.getSSOPasscodeSetErrorText: ' + JSON.stringify(error));
    
    var errorText;
    
    if (error.errorDomain === 'MAFLogonCoreErrorDomain') {
        if (error.errorCode === '16') {
            errorText = "ERR_SSO_PASSCODE_SET_ERROR";
        }
    }
    
    return errorText;
}

var getRegistrationErrorText = function(error) {
    utils.logJSON('LogonController.getRegistrationErrorText: ' + JSON.stringify(error));
    
    var errorText;
    
    if (error.errorDomain === 'MAFLogonCoreErrorDomain') {
        if (error.errorCode === '80003') {
            errorText = "ERR_REG_FAILED_WRONG_SERVER";
        }
        //in case of wrong application id
        else if (error.errorCode === '404') {
            errorText = "ERR_REG_FAILED";
        }
        else if (error.errorCode === '401') {
            errorText = "ERR_REG_FAILED_UNATHORIZED";
        }
        else if (error.errorCode === '22') {
            errorText = "ERR_REG_FAILED_WHITELIST_ERROR";
        }
        else {
            errorText = "ERR_REG_FAILED";
        }
    }
    
    return errorText;
}

var getRegistrationCancelError = function(error) {
    utils.logJSON('LogonController.getRegistrationCancelError: ' + JSON.stringify(error));
    
    var errorText;
    
    errorText = "ERR_REGISTRATION_CANCEL";
    
    return errorText;
}

var errorWithDomainCodeDescription = function(domain, code, description) {
    var error = {
    errorDomain: domain,
    errorCode: code,
    errorMessage: description
    };
    
    return error;
}


// =================== exported (public) members ====================

/**
 * The Logon plugin provides screen flows to register an app with an SAP Mobile Platform server.<br/>
 * <br/>
 * The logon plugin is a component of the SAP Mobile Application Framework (MAF), exposed as a Cordova plugin. The basic
 * idea is that it provides screen flows where the user can enter the values needed to connect to an SAP Mobile Platform 3.0 server and
 * stores those values in its own secure data vault. This data vault is separate from the one provided with the
 * encrypted storage plugin. In an OData based SAP Mobile Platform 3.0 application, a client must onboard or register with the SAP Mobile Platform 3.0
 * server to receive an application connection ID for a particular app. The application connection ID must be sent
 * along with each request that is proxied through the SAP Mobile Platform 3.0 server to the OData producer.<br/>
 * <br/>
 * <b>Adding and Removing the Logon Plugin</b><br/>
 * The Logon plugin is added and removed using the
 * <a href="http://cordova.apache.org/docs/en/edge/guide_cli_index.md.html#The%20Command-line%20Interface">Cordova CLI</a>.<br/>
 * <br/>
 * To add the Logon plugin to your project, use the following command:<br/>
 * cordova plugin add <full path to directory containing Kapsel plugins>\logon<br/>
 * <br/>
 * To remove the Logon plugin from your project, use the following command:<br/>
 * cordova plugin rm com.sap.mp.cordova.plugins.logon
 *
 * @namespace
 * @alias Logon
 * @memberof sap
 */
module.exports = {
    
    /**
     * Initialization method to set up the Logon plugin.  This will register the application with the SMP server and also authenticate the user
     * with servers on the network.  This step must be done first prior to any attempt to communicate with the SMP server.
     *
     * @method
     * @param {sap.Logon~successCallback} successCallback The function that is invoked if initialization is successful.  The current
     * context is passed to this function as the parameter.
     * @param {sap.Logon~errorCallback} errorCallback The function that is invoked in case of an error.
     * @param {string} applicationId The unique ID of the application.  Must match the application ID on the SAP Mobile Platform server.
     * @param {object} [context] The context with default values for application registration.  See {@link sap.Logon~successCallback} for the structure
     * of the context object.  Note that all properties of the context object are optional, and you only need to specify the properties
     * for which you want to provide default values for.  The values will be presented to the application users during the registration process and given them
     * a chance to override these values during runtime.
     * @param {string} [logonView="com/sap/mp/logon/iabui"] The cordova module ID of a custom renderer for the logon,
     * implementing the [showScreen(), close()] interface.  Please use the defaul module unless you are absolutely sure that you can provide your own
     * custom implementation.  Please refer to JavaScript files inside your Kapsel project's plugins\logon\www\common\modules\ folder as example.
     * @example
     * // a custom UI can be loaded here
     * var logonView = sap.logon.IabUi;
     *
     * // The app ID
     * var applicationId = "someAppID";
     *
     * // You only need to specify the fields for which you want to set the default.   These values are optional because they will be
     * // used to prefill the fields on Logon's UI screen.
     * var defaultContext = {
     *  "serverHost" : "defaultServerHost.com"
     *	"https" : false,
     *	"serverPort" : "8080",
     *	"user" : "user1",
     *	"password" : "Zzzzzz123",
     *	"communicatorId" : "REST",
     *	"securityConfig" : "sec1",
     *	"passcode" : "Aaaaaa123",
     *	"unlockPasscode" : "Aaaaaa123"
     * };
     *
     * var app_context;
     *
     * var successCallback = function(context){
     *     app_context = context;
     * }
     *
     * var errorCallback = function(errorInfo){
     *     alert("error: " + JSON.stringify(errorInfo));
     * }
     * sap.Logon.init(successCallback, errorCallback, applicationId, defaultContext, logonView);
     */
init: init,
    
    /**
     * The application ID with which {@link sap.Logon.init} was called.  It is available here so it is easy to access later.
     * @example
     * // After calling the init function
     * alert("The app ID for this app is: " + sap.Logon.applicationId);
     */
applicationId: null,
    /**
     * Direct reference to the logon core object used by the Logon plugin.  This is needed to perform more complex operations that
     * are not generally needed by applications. <br/>
     * There are several functions that can be accessed on the core object:<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; getState(successCallback,errorCallback) returns the state object of the application to the success callback in the form of a JavaScript object.<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; getContext(successCallback,errorCallback) returns the context object of the application to the success callback in the form of a JavaScript object.<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; deleteRegistration(successCallback,errorCallback) deletes the application's registration from the SAP Mobile Platform server and removes<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; application data on device.<br/>
     * @example
     * var successCallback = function(result){
     *     alert("Result: " + JSON.stringify(result));
     * }
     * var errorCallback = function(errorInfo){
     *     alert("Error: " + JSON.stringify(errorInfo));
     * }
     * sap.Logon.core.getState(successCallback,errorCallback);
     * sap.Logon.core.getContext(successCallback,errorCallback);
     * sap.Logon.core.deleteRegistration(successCallback,errorCallback);
     */
core: _oLogonCore, //Must be updated after init
    
    /**
     * Get an  (JSON serializable) object from the DataVault for a given key.
     * @method
     * @param {sap.Logon~getSuccessCallback} onsuccess The function that is invoked
     * upon success.  It is called with the resulting object as a single parameter.
     * This can be null or undefined, if no object is defined for the given key.
     * @param {sap.Logon~errorCallback} onerror The function to invoke in case of error.
     * @param {string} key The key with which to query the DataVault.
     * @example
     * var errorCallback = function(errorInfo){
     *     alert("Error: " + JSON.stringify(errorInfo));
     * }
     * var getSuccess = function(value){
     *     alert("value retrieved from the store: " + JSON.stringify(value));
     * }
     * var setSuccess = function(){
     *     sap.Logon.get(getSuccess,errorCallback,'someKey');
     * }
     * sap.Logon.set(setSuccess,errorCallback,'someKey', 'some string (could also be an object).');
     */
get: get,
    
    /**
     * Set an (JSON serializable) object in the DataVault.
     * @method
     * @param {sap.Logon~successCallbackNoParameters} onsuccess The function to invoke upon success.
     * onsuccess will be called without parameters for this method.
     * @param {sap.Logon~errorCallback} onerror The function to invoke in case of error.
     * @param {string} key The key to store the provided object on.
     * @param {object} value The object to be set on the given key.  Must be JSON serializable (ie:
     * cannot contain circular references).
     * @example
     * var errorCallback = function(errorInfo){
     *     alert("Error: " + JSON.stringify(errorInfo));
     * }
     * var getSuccess = function(value){
     *     alert("value retrieved from the store: " + JSON.stringify(value));
     * }
     * var setSuccess = function(){
     *     sap.Logon.get(getSuccess,errorCallback,'someKey');
     * }
     * sap.Logon.set(setSuccess,errorCallback,'someKey', 'some string (could also be an object).');
     */
set: set,
    
    /**
     * Locks the Logon plugin's secure data vault.
     * @method
     * @param {sap.Logon~successCallbackNoParameters} onsuccess The function to invoke upon success.
     * @param {sap.Logon~errorCallback} onerror The function to invoke in case of error.
     * @example
     * var errorCallback = function(errorInfo){
     *     alert("Error: " + JSON.stringify(errorInfo));
     * }
     * var successCallback = function(){
     *     alert("Locked!");
     * }
     * sap.Logon.lock(successCallback,errorCallback);
     */
lock: lock,
    
    /**
     * Unlock the Logon plugin's secure data vault if it has been locked (due to being inactive, or
     * {@link sap.Logon.lock} being called), then the user is prompted for the passcode to unlock the
     * application.<br/>
     * If the application is already unlocked, then nothing will be done.<br/>
     * If the application has passcode disabled, then passcode prompt will not be necessary.
     * In all cases if an error does not occur, the success callback is invoked with the current logon context
     * as the parameter.
     * @method
     * @param {sap.Logon~successCallback} onsuccess - The callback to call if the screen flow succeeds.
     * onsuccess will be called with the current logon context as a single parameter.
     * @param {sap.Logon~errorCallback} onerror - The callback to call if the screen flow fails.
     * @example
     * var errorCallback = function(errorInfo){
     *     alert("Error: " + JSON.stringify(errorInfo));
     * }
     * var successCallback = function(context){
     *     alert("Registered and unlocked.  Context: " + JSON.stringify(context));
     * }
     * sap.Logon.unlock(successCallback,errorCallback);
     */
unlock: registerOrUnlock,
    
    /**
     * This is an alias for registerOrUnlock.  Calling this function is equivalent
     * to calling {@link sap.Logon.unlock} since both of them are alias to registerOrUnlock.
     * @method
     * @private
     */
registerUser: registerOrUnlock,
    
    /**
     * This function registers the user and creates a new unlocked DataVault to store the registration
     * information.<br/>
     * If the user has already been registered, but the application is locked (due to being inactive, or
     * {@link sap.Logon.lock} being called), then the user is prompted for the passcode to unlock the
     * application.<br/>
     * If the application is already unlocked, then nothing will be done.<br/>
     * In all cases if an error does not occur, the success callback is invoked with the current logon context
     * as the parameter.
     * @method
     * @param {sap.Logon~successCallback} onsuccess - The callback to call if the screen flow succeeds.
     * onsuccess will be called with the current logon context as a single parameter.
     * @param {sap.Logon~errorCallback} onerror - The callback to call if the screen flow fails.
     * @example
     * var errorCallback = function(errorInfo){
     *     alert("Error: " + JSON.stringify(errorInfo));
     * }
     * var successCallback = function(context){
     *     alert("Registered and unlocked.  Context: " + JSON.stringify(context));
     * }
     * sap.Logon.registerOrUnlock(successCallback,errorCallback);
     * @private
     */
registerOrUnlock: registerOrUnlock,
    
    /**
     * This method will launch the UI screen for application users to manage and update the data vault passcode or,
     * if the SMP server's Client Passcode Policy allows it, enable or disable the passcode to the data vault.
     *
     * @method
     * @param {sap.Logon~successCallbackNoParameters} onsuccess - The function to invoke upon success.
     * @param {sap.Logon~errorCallback} onerror - The function to invoke in case of error.
     * @example
     * var errorCallback = function(errorInfo){
     *     alert("Error: " + JSON.stringify(errorInfo));
     * }
     * var successCallback = function(context){
     *     alert("Passcode successfully managed.");
     * }
     * sap.Logon.managePasscode(successCallback,errorCallback);
     */
managePasscode: managePasscode,
    
    /**
     * This method will launch the UI screen for application users to manage and update the back-end passcode that Logon stores in the
     * data vault that is used to authenticate the client to the server.
     *
     * @method
     * @param {sap.Logon~successCallbackNoParameters} onsuccess - The callback to call if the screen flow succeeds.
     * onsuccess will be called without parameters for this method.
     * @param {sap.Logon~errorCallback} onerror The function that is invoked in case of an error.
     * @example
     * var errorCallback = function(errorInfo){
     *     alert("Error: " + JSON.stringify(errorInfo));
     * }
     * var successCallback = function(context){
     *     alert("Password successfully changed.");
     * }
     * sap.Logon.changePassword(successCallback,errorCallback);
     */
changePassword: changePassword,
    
    /**
     * Calling this method will show a screen which displays the current registration settings for the application.
     * @method
     * @param {sap.Logon~successCallbackNoParameters} onsuccess - The callback to call if the screen flow succeeds.
     * onsuccess will be called without parameters for this method.
     * @param {sap.Logon~errorCallback} onerror The function that is invoked in case of an error.
     * @example
     * var errorCallback = function(errorInfo){
     *     alert("Error: " + JSON.stringify(errorInfo));
     * }
     * var successCallback = function(context){
     *     alert("The showRegistrationData screenflow was successful.");
     * }
     * sap.Logon.showRegistrationData(successCallback,errorCallback);
     */
showRegistrationData: showRegistrationData
};

/**
 * Callback function that is invoked in case of an error.
 *
 * @callback sap.Logon~errorCallback
 *
 * @param {Object} errorObject Depending on the origin of the error the object can take several forms.
 * (Unfortunately the error object structure and content is not uniform among the platforms, this will
 * probably change in the future.)
 *
 * Errors originating from the logon plugin have only an 'errorKey' property.
 * The possible values for 'errorKey':
 *
 * ERR_CHANGE_TIMEOUT_FAILED
 * ERR_FORGOT_SSO_PIN
 * ERR_INIT_FAILED
 * ERR_INVALID_ACTION
 * ERR_INVALID_STATE
 * ERR_PASSCODE_REQUIRES_DIGIT
 * ERR_PASSCODE_REQUIRES_LOWER
 * ERR_PASSCODE_REQUIRES_SPECIAL
 * ERR_PASSCODE_REQUIRES_UPPER
 * ERR_PASSCODE_TOO_SHORT
 * ERR_PASSCODE_UNDER_MIN_UNIQUE_CHARS
 * ERR_REGISTRATION_CANCEL
 * ERR_REG_FAILED
 * ERR_REG_FAILED_UNATHORIZED
 * ERR_REG_FAILED_WRONG_SERVER
 * ERR_SETPASSCODE_FAILED
 * ERR_SET_AFARIA_CREDENTIAL_FAILED
 * ERR_SSO_PASSCODE_SET_ERROR
 * ERR_UNKNOWN_SCREEN_ID
 * ERR_UNLOCK_FAILED
 * ERR_USER_CANCELLED
 *
 * Errors originating in the logon core (either iOS or Android) have the following properties: 'errorCode',
 * 'errorMessage', and 'errorDomain'.
 * The 'errorCode' is just a number uniquely identifying the error.  The 'errorMessage'
 * property is a string with more detailed information of what went wrong.  The 'errorDomain' property specifies
 * the domain that the error occurred in.
 *
 * On iOS the 'errorDomain' property of the core errors can take the following values: MAFLogonCoreErrorDomain, MAFSecureStoreManagerErrorDomain, and MAFLogonCoreCDVPluginErrorDomain.
 *
 * In the MAFLogonCoreErrorDomain the following errors are thrown (throwing methods in paren):
 *
 *  3   errMAFLogonErrorCommunicationManagerError       (register, update settings, delete, change backend password)
 *  9   errMAFLogonErrorCouldNotDecideCommunicator      (register)
 *  11  errMAFLogonErrorOperationNotAllowed             (all)
 *  12  errMAFLogonErrorInvalidServerHost               (register)
 *  13  errMAFLogonErrorInvalidBackendPassword          (changeBackendPassword)
 *  15  errMAFLogonErrorUploadTraceFailed               (uploadTrace)
 *  16  errMAFLogonErrorInvalidMCIMSSOPin               (setMCIMSSOPin)
 *  18  errMAFLogonErrorCertificateKeyError             (register)
 *  19  errMAFLogonErrorCertificateError                (register)
 *  20  errMAFLogonErrorAfariaInvalidCredentials        (setAfariaCredentialWithUser)
 *
 * In the MAFSecureStoreManagerErrorDomain the following errors are thrown (throwing methods in paren):
 *
 *  0   errMAFSecureStoreManagerErrorUnknown    (persist, unlock, changePasscode, delete, getContext)
 *  1   errMAFSecureStoreManagerErrorAlreadyExists  (persist)
 *  2   errMAFSecureStoreManagerErrorDataTypeError  (unlock, getContext)
 *  3   errMAFSecureStoreManagerErrorDoesNotExist   (unlock, persist, getContext)
 *  4   errMAFSecureStoreManagerErrorInvalidArg unlock, (persist, getContext)
 *  5   errMAFSecureStoreManagerErrorInvalidPassword    (unlock)
 *  6   errMAFSecureStoreManagerErrorLocked     (getContext)
 *  7   errMAFSecureStoreManagerErrorOutOfMemory    (persist, unlock, changePasscode, delete, getContext)
 *  8   errMAFSecureStoreManagerErrorPasswordExpired    (unlock, getContext)
 *  9   errMAFSecureStoreManagerErrorPasswordRequired   (persist, changePasscode)
 *  10  errMAFSecureStoreManagerErrorPasswordRequiresDigit  (persist, changePasscode)
 *  11  errMAFSecureStoreManagerErrorPasswordRequiresLower  (persist, changePasscode)
 *  12  errMAFSecureStoreManagerErrorPasswordRequiresSpecial    (persist, changePasscode)
 *  13  errMAFSecureStoreManagerErrorPasswordRequiresUpper  (persist, changePasscode)
 *  14  errMAFSecureStoreManagerErrorPasswordUnderMinLength (persist, changePasscode)
 *  15  errMAFSecureStoreManagerErrorPasswordUnderMinUniqueChars    (persist, changePasscode)
 *  16  errMAFSecureStoreManagerErrorDeleted    (unlock)
 *
 * In the MAFLogonCoreCDVPluginErrorDomain the following errors are thrown:
 *
 *  1 (init failed)
 *  2 (plugin not initialized)
 *  3 (no input provided)
 *
 * On Android the 'errorDomain' property of the core errors can take the following values: MAFLogonCoreErrorDomain and MAFLogonCoreCDVPluginErrorDomain.
 * There are no logon specific error codes, the 'errorCode' property only wraps the error values from the underlying libraries.
 */

/**
 * Callback function that is invoked upon successfully registering or unlocking or retrieving the context.
 *
 * @callback sap.Logon~successCallback
 *
 * @param {Object} context An object containing the current logon context.  Two properties of particular importance
 * are applicationEndpointURL, and applicationConnectionId.
 * The context object contains the following properties:<br/>
 * "registrationContext": {<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"serverHost": Host of the server.<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"domain": Domain for server. Can be used in case of SAP Mobile Platform communication.<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"resourcePath": Resource path on the server. The path is used mainly for path based reverse proxy but can contain a custom relay server path as well.<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"https": Marks whether the server should be accessed in a secure way.<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"serverPort": Port of the server.<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"user": Username in the backend.<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"password": Password for the backend user.<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"farmId": FarmId of the server. Can be nil. Used in case of Relay server or SiteMinder.<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"communicatorId": Id of the communicator manager that will be used for performing the logon. Possible values: IMO / GATEWAY / REST<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"securityConfig": Security configuration. If nil, the default configuration is used.<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"mobileUser": Mobile User. Used in case of IMO manual user creation.<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"activationCode": Activation Code. Used in case of IMO manual user creation.<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"gatewayClient": The key string that identifies the client on the gateway. Used in Gateway only registration mode. The value will be used as adding the parameter: sap-client=<gateway client><br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"gatewayPingPath": The custom path of the ping URL on the gateway. Used in case of Gateway only registration mode.<br/>
 * }<br/>
 * "applicationEndpointURL": Contains the application endpoint URL after a successful registration.<br/>
 * "applicationConnectionId": ID to get after a successful SUP REST registration. Needs to be set in the download request header with key X-SUP-APPCID<br/>
 * "afariaRegistration": manual / automatic / certificate<br/>
 * "policyContext": Contains the password policy for the secure store {<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"alwaysOn":<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"alwaysOff":<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"defaultOn":<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hasDigits":<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hasLowerCaseLetters":<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hasSpecialLetters":<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hasUpperCaseLetters":<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"defaultAllowed":<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"expirationDays":<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"lockTimeout":<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"minLength":<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"minUniqueChars":<br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"retryLimit":<br/>
 * }<br/>
 * "registrationReadOnly": specifies whether context values are coming from clientHub / afaria<br/>
 * "policyReadOnly": specifies whether passcode policy is coming from afaria<br/>
 * "credentialsByClientHub": specifies whether credentials are coming from clientHub
 */

/**
 * Callback function that will be invoked with no parameters.
 *
 * @callback sap.Logon~successCallbackNoParameters
 */

/**
 * Callback function that is invoked upon successfully retrieving an object from the DataVault.
 *
 * @callback sap.Logon~getSuccessCallback
 *
 * @param {Object} value The object that was stored with the given key.  Can be null or undefined if no object was stored
 * with the given key.
 */


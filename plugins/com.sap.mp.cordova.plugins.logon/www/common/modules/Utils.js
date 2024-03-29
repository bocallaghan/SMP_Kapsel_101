
var log = function(message) {
    if (typeof cordova === 'undefined' || typeof cordova.logger === 'undefined') {
        console.log(message);
	} else if (cordova.logger){
        cordova.logger.log(message);
    } else {
        alert(message);
    }
}

var logJSON = function(obj, msg){
	if (typeof msg === 'string') {
		log(msg);
	}
		var secureContext = removeSecureDataForLoggingFromContext(obj);
		log(JSON.stringify(secureContext));
	}

	var removeSecureDataForLoggingFromContext = function(obj) {

		var copy = clone(obj);
        var replacement = '>>> FILTERED <<<'

		if (copy) {
			if (copy.passcode) {
				copy.passcode = replacement;
			}
            if (copy.afariaPassword) {
                copy.afariaPassword = replacement;
            }
			if (copy.ssoPasscode) {
				copy.ssoPasscode = replacement;
			}
			if (copy.oldPasscode) {
				copy.oldPasscode = replacement;
			}
			if (copy.passcode_CONFIRM) {
				copy.passcode_CONFIRM = replacement;
			}
            if (copy.unlockPasscode) {
				copy.unlockPasscode = replacement;
			}
            if (copy.password) {
				copy.password = replacement;
			}
            if (copy.newPassword) {
				copy.newPassword = replacement;
			}
			if (copy.registrationContext && copy.registrationContext.password) {
				copy.registrationContext.password = replacement;
			}
			if (copy.registrationContext && copy.registrationContext.newPassword) {
				copy.registrationContext.newPassword = replacement;
			}
			if (copy.registrationContext && copy.registrationContext.passcode) {
				copy.registrationContext.passcode = replacement;
			}
			if (copy.registrationContext && copy.registrationContext.unlockPasscode) {
				copy.registrationContext.unlockPasscode = replacement;
			}
		}

		return copy;
}

var logArgs = function(args){
	var argArray = Array.prototype.slice.call(args);
	log(argArray);
//	for (idx in argArray) {
//		log(JSON.stringfy(argArray[idx]));
//	}
}

var logKeys = function(obj, msg){
	if (typeof msg === 'string') {
		log(msg);
	}
	
	if (typeof obj !== 'object' || obj == null){
		log(obj + "");
		} else {
		log('own:   ' + Object.getOwnPropertyNames(obj));
		log('proto: ' + Object.getOwnPropertyNames(Object.getPrototypeOf(obj)));
	}
}

var clone = function(obj){
		if (null == obj || "object" != typeof obj) {
			return obj;
		}
	//return Object.create(obj); // 'clone' by setting obj as prototype	
	return JSON.parse(JSON.stringify(obj)); //deep copy
}

var forceEval = function(expr){
	return expr;
}

var Error = function(key, param) {
	this.errorKey = key;
    this.errorMessage = sap.logon.i18n.getLocalizedString(key);
		if (param)
			this.errorMessage = this.errorMessage + ' ' + param;
}

var onError = function(msg, url, line) {
	//                     var idx = url.lastIndexOf("/");
	//                     if(idx > -1)
	//                         url = url.substring(idx+1);
		log("ERROR in " + url + " (line #" + line + "): " + msg);

	return false; //suppressErrorAlert;
};

var regOnerror = function() {
    window.onerror = onError;
	log('regOnerror finished');
}
               
module.exports = {
    log: log,
    logJSON: logJSON,
    logArgs: logArgs,
    logKeys: logKeys,
    clone: clone,
    forceEval: forceEval,
    Error: Error,
    onError: onError,
    regOnerror: regOnerror
};
               

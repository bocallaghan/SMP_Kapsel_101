


    var utils = sap.logon.Utils;
    var staticScreens = sap.logon.StaticScreens;
    var dynamicScreens = sap.logon.DynamicScreens;
    
    var windowRef;
   
	var events;
	
	var onWindowReady;
    var lastOperation;
    
    var state = 'NO_WINDOW';
	
	var showScreenWithCheck = function(screenId, screenEvents, currentContext) { 
		
		if (state === 'NO_WINDOW') {
			utils.log('IAB showScreenWithCheck, NO_WINDOW');
			state = 'INIT_IN_PROGRESS';
			lastOperation = function() {
				showScreen(screenId, screenEvents, currentContext);
			}
			onWindowReady = function(){
				state = 'READY';
				if (lastOperation) {
				    lastOperation();
			      }

            };
			windowRef = newScreen();
		}
		else if (state === 'INIT_IN_PROGRESS') {
			utils.log('IAB showScreenWithCheck, INIT_IN_PROGRESS');
			lastOperation = function() {
				showScreen(screenId, screenEvents, currentContext);
			}
		}
		else if (state === 'READY') {
			utils.log('IAB showScreenWithCheck, READY');
			showScreen(screenId, screenEvents, currentContext);
		}
		
	};

	var showNotification = function(notificationKey) {
		
		utils.log('iabui showNotification');
        if (!windowRef) {
        	// TODO check whether we need to handle the case if there is no windowref
        	throw 'No windowref';
        }
        
		var payload = "showNotification(\"" + notificationKey +"\");";
		//utils.log('payload: ' + payload); -> do not log payload as it may contain sensitive information
        windowRef.executeScript(
				{code:payload},
				function(param){
					utils.log('executeScript returned:' + JSON.stringify(param));
				});
	};
	
	var showScreen = function(screenId, screenEvents, currentContext) {
		utils.log('IAB iabui showScreen');
        utils.log(screenId);
        utils.log(screenEvents);
        if (currentContext) {
        	utils.logJSON(currentContext);
        }
		// saving event callbacks (by-id map)
		events = screenEvents;
		
        var uiDescriptor = staticScreens.getScreen(screenId);
        if (!uiDescriptor) {
            uiDescriptor = dynamicScreens.getScreen(screenId);
        }
        if (!uiDescriptor) {
            screenEvents.onerror(new utils.Error('ERR_UNKNOWN_SCREEN_ID', screenId));
        }
        
        
		var uiDescriptorJSON = JSON.stringify(uiDescriptor);
		utils.log('InAppBrowserUI.showScreen(): ' + uiDescriptorJSON);
		utils.log('windowRef: ' + windowRef);
		
        
		var defaultContextJSON = '""';
        if (currentContext){
            defaultContextJSON = JSON.stringify(currentContext.registrationContext);
        }
        
        		
		var payload = "showScreen(" + uiDescriptorJSON + "," + defaultContextJSON + ");";
		//utils.log('payload: ' + payload);-> do not log payload as it may dontain sensitive information
       	windowRef.executeScript(
				{code:payload},
				function(param){
					utils.log('executeScript returned:' + JSON.stringify(param));
				});
               
	}
    
    var evalIabEvent = function (event) {
        var url = document.createElement('a');
		url.href = event.url;
		var hash = unescape(url.hash.toString());
		
		var fragments = hash.match(/#([A-Z]+)(\+.*)?/);
        if (fragments) {
            var eventId = 'on' + fragments[1].toLowerCase();
            var resultContext;
            if (fragments[2]) {
                // TODO Pass on as a string, or deserialize ?
                resultContext = JSON.parse(fragments[2].substring(1));
                //resultContext = fragments[2].substring(1);
            }

            if (typeof eventId === 'string' && eventId !== null ) {
                utils.log('event: "' + eventId + '"');
                //utils.logKeys(events[eventId] + '');
                if (eventId === 'onready' && state === 'INIT_IN_PROGRESS') {
                    utils.log('IAB calling onwindowready');
                    onWindowReady();
                } else if (eventId === 'onlog') {
                    utils.log('IAB CHILDWINDOW:' + resultContext.msg);;
                }
                else if (events[eventId]) {
                    utils.log('calling parent callback');
                    utils.logJSON(resultContext);
                    
                    events[eventId](resultContext);
                }
                else {
                    utils.log('invalid event: ' + eventId);
                }
            }
            else {
                utils.log('invalid event');
            }
        }
        else {
            utils.log('no events to process');
        }
    }
	
	var iabLoadStart = function(event) {
		utils.log('IAB loadstart: ' + device.platform);
        //for iOS (iabLoadStop is not fired for READY on iOS)
        if (device.platform == 'iOS') {
            evalIabEvent(event);
        }
	};
	var iabLoadError = function(event) {
		utils.log('IAB loaderror: ' + event.url);
	};
	var iabExit = function(event) {
		utils.log('IAB exit: ' + event.url);
		//close();
		state = 'NO_WINDOW';
		lastOperation = null;
		
		setTimeout(events['oncancel'], 30);
	};
	
	var iabLoadStop = function(event) {
		
		//utils.log('IAB loadstop: ' + event.url); -> do not log url as it may contain sensitive information
		utils.log('IAB loadstop ' + device.platform);        
        //for android (iabLoadStart is not fired after a hash change in android) (?)
        if (device.platform == 'Android') {
            evalIabEvent(event);
        }
	};
	
	
	var newScreen = function () {
		utils.log("IAB create newScreen");
		var windowRef = window.open('smp/logon/ui/iab.html', '_blank', 'location=no,toolbar=no,overridebackbutton=yes,allowfileaccessfromfile=yes');
		windowRef.addEventListener('loadstart', iabLoadStart);
		windowRef.addEventListener('loadstop', iabLoadStop);
		windowRef.addEventListener('loaderror', iabLoadError);
		windowRef.addEventListener('exit', iabExit);
		windowRef.addEventListener('backbutton', function(){
			if (events['onbackbutton']) {
				utils.log('IABUI onbackbutton');
				events['onbackbutton']();
			}
			else if (events['oncancel']) {
				utils.log('IABUI onbackbutton oncancel');
				events['oncancel']();
			}
		});
		return windowRef;
	}
	
    
    
	var close = function() {
        
		if (state === 'NO_WINDOW') {
			utils.log('IAB close, NO_WINDOW');
		}
		else if (state === 'INIT_IN_PROGRESS') {
			utils.log('IAB close, INIT_IN_PROGRESS');
			lastOperation = clearWindow;			
		}
		else if (state === 'READY') {
			utils.log('IAB close, READY');
			clearWindow();
		}
    }
	
	var clearWindow = function() {
		utils.log('IAB clear window');
		windowRef.removeEventListener('loadstart', iabLoadStart);
		windowRef.removeEventListener('loadstop', iabLoadStop);
		windowRef.removeEventListener('loaderror', iabLoadError);
		windowRef.removeEventListener('exit', iabExit);
		windowRef.close();
		windowRef = null;
		state = 'NO_WINDOW';
	}
    

	
//=================== Export with cordova ====================

    module.exports = {
    		showScreen: showScreenWithCheck,
			close: close,
			showNotification: showNotification
        };


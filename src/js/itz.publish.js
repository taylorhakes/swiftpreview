(function() {
	'use strict';
	if(!window.itz) window.itz = {};
	window.itz.publish = function() {
		var events = {};
		this.publish = function(event,data) {
			if(events.hasOwnProperty(event)) {
				Object.keys(events[event]).forEach(function(a) {
					events[event][a](data);
				});
			}
		};
		this.subscribe = function(event, fn) {
			if(!events.hasOwnProperty(event)) {
				events[event] = [];
			}
			events[event].push(fn);
		};
		this.unsubscribe = function(event,fn) {
			if(!events.hasOwnProperty(event)) {
				for(var a in events[event]) {
					if(events[event][a] === fn) {
						delete events[event][a];
						break;
					}
				}
			}
		};
	};
})();
(function () {
	'use strict';
	var _gaq = _gaq || [], _manifestVersion = chrome.app.getDetails().version;

	function _init() {
		// Setup Google analytics
		_gaq.push(['_setAccount', 'UA-34255046-1']);
		var ga = document.createElement('script');
		ga.type = 'text/javascript';
		ga.async = true;
		ga.src = 'https://ssl.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(ga, s);

		// If this is a new install, show the welcome page
		if (!localStorage["installed"]) {
			chrome.tabs.create({ url: "/options.html?showWelcome" });
			_gaq.push(["_trackEvent", "app", "Installed"]);
			localStorage["installed"] = true;
		}
		// Tell google analytics the version of SwiftPreview the user is using
		_gaq.push(["_trackEvent", "app", "Used", _manifestVersion]);
		setInterval(function () {
			_gaq.push(["_trackEvent", "app", "Used", _manifestVersion]);
		}, 86400000);

		_bindEvents();
	}

	function _bindEvents() {
		chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
			switch (request.method) {
				case "getLocalStorage":
					// if the user specifies keys, return an array
					if (request.key) {
						sendResponse({data: localStorage[request.key]});
					} else {
						var values = [];
						Object.keys(request.keys).forEach(function (k) {
							values.push(localStorage[request.keys[k]]);
						});
						sendResponse({data: values});
					}
					break;
				case "analytics":
					_analytics(request.values);
					break;
				case "youtube_stop":
					chrome.tabs.executeScript(sender.tab.id,
						{code: "if(document.getElementsByTagName('embed')) {" +
							" document.getElementsByTagName('embed')[0].pauseVideo() }", allFrames: true});
					break;
				default:
					sendResponse({}); // snub them.
					break;
			}
		});

		chrome.tabs.onActivated.addListener(function (tab) {
			chrome.tabs.getSelected(null, function (tab) {
				var blockedDomains = _getBlockedDomains();
				var state = 'On';
				if (tab.url && blockedDomains[_getDomain(tab.url)]) {
					state = 'Blocked';
				}
				_sendScriptState(tab.id, state);

				_setupState(state);
			});
		});

		chrome.tabs.onUpdated.addListener(function (id, change) {
			chrome.tabs.getSelected(null, function (tab) {
				var blockedDomains = _getBlockedDomains();
				var state = 'On';
				if (tab.url && blockedDomains[_getDomain(tab.url)]) {
					state = 'Blocked';
				}
				_sendScriptState(tab.id, state);
				_setupState(state);
			});
		});

		chrome.webRequest.onHeadersReceived.addListener(function (details) {
				for (var i = 0; i < details.responseHeaders.length; ++i) {
					if (details.responseHeaders[i].name.toLowerCase() === 'x-frame-options') {
						details.responseHeaders.splice(i, 1);
					}
				}
				return {responseHeaders: details.responseHeaders};

			}, {urls: ["<all_urls>"], types: ['sub_frame']}, ["blocking", "responseHeaders"]);

		chrome.browserAction.onClicked.addListener(function (tab) {
			var domain = _getDomain(tab.url);
			var blockedDomains = _getBlockedDomains();
			var state;
			if (blockedDomains[domain]) {
				state = 'Blocked';
			} else {
				state = 'On';
			}

			var new_state = 'On';
			var notification = null;
			switch (state) {
				case 'On':
					new_state = 'Blocked';
					blockedDomains[domain] = true;
					// icon url - can be relative
					notification = webkitNotifications.createNotification('img/icon128_blocked.png',
						domain + ' Blocked', // notification title
						'Previews will no longer be available on ' + domain  // notification body text
					);
					break;
				default:
					new_state = 'On';
					delete blockedDomains[domain];
					// icon url - can be relative
					notification = webkitNotifications.createNotification('img/icon128_on.png',
						domain + ' Available', // notification title
						'Previews will now show on ' + domain  // notification body text
					);
			}
			if (notification) {
				notification.show();
				setTimeout(function () {
					notification.cancel();
				}, 3000);
			}

			localStorage['blocked_domains'] = JSON.stringify(blockedDomains);

			_setupState(new_state);
			_sendScriptState(tab.id, new_state);

		});
	}

	function _getBlockedDomains() {
		var blockedDomains = null;
		try {
			blockedDomains = JSON.parse(localStorage['blocked_domains']);
		} catch (e) {

		}
		if (!blockedDomains || typeof blockedDomains !== 'object') {
			blockedDomains = {};
		}
		return blockedDomains;
	}

	// Send anyaltics to google analytics
	function _analytics(values_arr) {
		Object.keys(values_arr).forEach(function (v) {
			if (!values_arr[v]) {
				values_arr[v] = 'UNKNOWN';
			}
		});
		_gaq.push(values_arr);
	}

	function _setupState(state) {
		if (state === 'Blocked') {
			chrome.browserAction.setIcon({path: "img/icon48_blocked.png"});
		} else {
			chrome.browserAction.setIcon({path: "img/icon48_on.png"});
		}
	}

	// Tell a single script that it is enabled or disabled
	function _sendScriptState(id, state) {
		chrome.tabs.sendMessage(id, {msg: 'state', value: state}, function () {

		});
	}

	function _getDomain(url) {
		var parts = /:\/\/(.*?)\//.exec(url);
		var domain = parts ? parts[1] : url.substr(url.indexOf('://') + 3);
		return domain;
	}

	_init();

})();
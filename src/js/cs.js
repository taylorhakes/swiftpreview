/* global SwiftPreview */
(function($, SwiftPreview) {
	'use strict';
	function Controller() {
		var enabled = true;
		var previewSettings = null;
		var sp = null;

		var _init = function() {
			if(window.top && window.top.location === window.location) {
				chrome.extension.sendRequest({method:"analytics", values : ["_trackEvent","page","loaded"]});
			}
			sp = new SwiftPreview(previewSettings);
			if(!enabled) {
				sp.disable();
			}

			_bindEvents();
		};

		var _bindEvents = function() {
			sp.subscribe('preview_created', function() {
				chrome.extension.sendRequest({method:"analytics", values : ["_trackEvent","preview","create"]});
			});

			sp.subscribe('preview_clicked', function() {
				chrome.extension.sendRequest({method:"analytics", values : ["_trackEvent","preview","click"]});
			});

			sp.subscribe('preview_ctrl_key', function() {
				chrome.extension.sendRequest({method:"analytics", values : ["_trackEvent","preview","ctrl_key"]});
			});

			sp.subscribe('close_youtube', function() {
				chrome.extension.sendRequest({method:"youtube_stop"});
			});

			sp.subscribe('close_vimeo', function() {
				chrome.extension.sendRequest({method:"vimeo_stop"});
			});

			chrome.extension.onMessage.addListener(function(request) {
				if(request.msg === 'state') {
					if(request.value === 'On') {
						if(sp) {
							sp.enable();
						} else {
							enabled = true;
						}
					} else if(request.value === 'Off') {
						if(sp) {
							sp.disable();
						} else {
							enabled = false;
						}


					} else if(request.value === 'Blocked') {
						if(sp) {
							sp.disable();
						} else {
							enabled = false;
						}

					}
				} else if(request.msg === 'options') {
					sp.updateOptions(convertSettings(request.value));
				}
			});
		};


		function _getSettings() {
			chrome.extension.sendRequest({method:"getLocalStorage", keys:["previewSettings", "state"]},
				function(response) {

					if(response && response.data && response.data[0]) {
						previewSettings = convertSettings(JSON.parse(response.data[0]));
					}

					$(function() {
						if(!previewSettings) {
							tryUpdateOptions();
						}
						_init();
					});
				}
			);
		}


		var tryUpdateOptions = function() {
			chrome.extension.sendRequest({method:"getLocalStorage", keys:["previewSettings", "state"]},
				function(response) {

					if(response && response.data && response.data[0]) {
						sp.updateOptions(convertSettings(JSON.parse(response.data[0])));
					}
				});
		};

		var convertSettings = function(settings) {
			if(settings.prev_height_max) {
				settings.prev_height = Infinity;
			}
			if(settings.prev_width_max) {
				settings.prev_width = Infinity;
			}
			return settings;
		};

		_getSettings();

	}

	new Controller();
})(jQuery, SwiftPreview);
(function (w, chrome) {
	'use strict';
	var ls = w.localStorage;
	var $ = w.jQuery;
	var itz = w.itz;

	function PageController() {
		var _form = null;
		var _tour = null;

		function _init() {
			_form = new Form();
			_tour = new Tour();
			_bindEvents();
			_loadRoutes();
			_load();
		}

		function _bindEvents() {
			_form.subscribe('save', function (info) {
				dataStore.saveState(info.state);
				dataStore.saveDomains(info.domains);
				scriptUpdater.update(info.state, info.domains);
			});
		}

		function _loadRoutes() {
			if (window.location.search.replace("?", "") === 'showWelcome') $("#upgrade_welcome").show();
		}

		/**
		 * Load the initial state saved in storage
		 * @private
		 */
		function _load() {
			_form.update(dataStore.getState(), dataStore.getDomains());
		}

		_init();
	}

	/**
	 * Everything to do with manipulation of the settings form
	 * @constructor
	 */
	function Form() {
		var _self = this;
		var _defaults = {
			prev_width: 600,
			prev_height: 400,
			prev_delay: 1000,
			prev_width_max: false,
			prev_height_max: false,
			ctrl_enlarge: true,
			prerender: true,
			shift: false
		};

		function _init() {
			itz.extend(_self, new itz.publish());
			_restoreDefaults();
			_bindEvents();
		}

		function _bindEvents() {
			$('#saveOptions').click(_saveOptions);
			$('#restoreDefaults').click(_restoreDefaults);
			$('#domain-add').click(_onAddDomain);
			$('#domain-delete').click(_onDeleteDomain);
			$('.height-type').on('change', _heightTypeChange);
			$('.width-type').on('change', _widthTypeChange);
		}

		function _saveOptions() {
			_self.publish('save', _self.get());
			_showStatusMsg('Settings Updated');
		}

		function _restoreDefaults() {
			_update(_defaults);
		}

		function _onAddDomain(e) {
			var domain = $('#domain-name').val();
			var blockedDomains = _getDomains();
			if (domain && !/^\s*$/.test(domain) && !blockedDomains[domain]) {
				$('#blocked').append('<option value="' + domain + '">' + domain + '</option>');
			}
			$('#domain-add').val('');
			e.preventDefault();
			return false;
		}

		function _onDeleteDomain(e) {
			$('#blocked').find('option:selected').remove();
			e.preventDefault();
			return false;
		}

		function _heightTypeChange(e) {
			if ($('.height-type:checked').val() === 'max') {
				$('#prev_height').attr('disabled', 'disabled');
			} else {
				$('#prev_height').removeAttr('disabled');
			}
		}

		function _widthTypeChange(e) {
			if ($('.width-type:checked').val() === 'max') {
				$('#prev_width').attr('disabled', 'disabled');
			} else {
				$('#prev_width').removeAttr('disabled');
			}
		}

		function _showStatusMsg(message) {
			var $currentStatus = $("#status");
			var $status = $('<div id="status" class="alert alert-success"></div>');
			$status.text(message);
			$currentStatus.remove();
			$("#content").prepend($status);
			setTimeout(function () {
				$("#status").remove();
			}, 2000);
		}

		function _getDomains() {
			var domains = {};
			$('#blocked').find('option').each(function () {
				domains[$(this).val()] = true;
			});
			return domains;
		}

		function _update(state, domains) {
			if (state) {
				$("#prev_delay").val(state.prev_delay);
				$("#prev_width").val(state.prev_width);
				$("#prev_height").val(state.prev_height);
				$("#control").prop('checked', state.ctrl_enlarge);
				$("#shift").prop('checked', state.shift);
				$("#prerender").prop('checked', state.prerender);
				$(".width-type").removeAttr('checked');
				$('.width-type[value="' + (state.prev_width_max ? 'max' : 'height') + '"]').attr('checked', 'checked');
				_widthTypeChange();
				$(".height-type").removeAttr('checked');
				$('.height-type[value="' + (state.prev_height_max ? 'max' : 'height') + '"]').attr('checked',
					'checked');
				_heightTypeChange();

				if (domains) {
					$('#blocked').empty();
					Object.keys(domains).forEach(function (d) {
						$('#blocked').append('<option value="' + d + '">' + d + '</option>');
					});
				}
			}
		}

		_init();

		this.update = _update;
		this.get = function get() {
			return {
				state: {
					prev_delay: +$("#prev_delay").val(),
					prev_width: +$("#prev_width").val(),
					prev_height: +$("#prev_height").val(),
					ctrl_enlarge: $("#control").prop('checked'),
					shift: $("#shift").prop('checked'),
					prerender: $("#prerender").prop('checked'),
					prev_width_max: $(".width-type:checked").val() === 'max',
					prev_height_max: $(".height-type:checked").val() === 'max'
				},
				domains: _getDomains()
			};
		};
	}

	/**
	 * The tour when the user first install the extension
	 * @constructor
	 */
	function Tour() {
		function _init() {
			$("#options_title").popover({
				trigger: 'manual',
				placement: 'left',
				title: 'Options',
				content: 'Customize options in this section.	'
			});
			$("#shift_label_cg").popover({
				trigger: 'manual',
				placement: 'left',
				title: 'Shift key option',
				content: 'Check to limit previews to appearing only when holding shift key.'
			});

			_bindEvents();
		}

		function _bindEvents() {
			$('#closeWindow').click(function () {
				window.close();
			});
			$('#closeWindow1').click(function () {
				window.close();
			});

			$('#go_to_options').click(function () {
				$("#shift_label_cg").popover('hide');
				$('#options_title').popover('show');
				var left = +$("#options_title").popover('show').offset()["left"];
				var top = +$("#options_title").popover('show').offset()["top"] -
					$("#options_title").popover('show').height() - 10;
				w.scrollTo(left, top);
			});
			$('#go_to_options1').click(function () {
				$("#shift_label_cg").popover('hide');
				$('#options_title').popover('show');
				var left = +$("#options_title").popover('show').offset()["left"];
				var top = +$("#options_title").popover('show').offset()["top"] -
					$("#options_title").popover('show').height() - 10;
				w.scrollTo(left, top);
			});
			$('#go_to_shift').click(function () {
				$('#options_title').popover('hide');
				$("#shift_label_cg").popover('show');
				var left = +$("#shift_label_cg").popover('show').offset()["left"];
				var top = +$("#shift_label_cg").popover('show').offset()["top"] -
					$("#shift_label_cg").popover('show').height() - 10;
				w.scrollTo(left, top);
			});
			$('#go_to_shift1').click(function () {
				$('#options_title').popover('hide');
				$("#shift_label_cg").popover('show');
				var left = +$("#shift_label_cg").popover('show').offset()["left"];
				var top = +$("#shift_label_cg").popover('show').offset()["top"] -
					$("#shift_label_cg").popover('show').height() - 10;
				w.scrollTo(left, top);
			});
		}

		_init();
	}

	/**
	 * Save the settings to local storage (This should be change to use chrome extension storage)
	 * @type {{getState: Function, saveState: Function, getDomains: Function, saveDomains: Function}}
	 */
	var dataStore = {
		getState: function getState() {
			var state = null, stateJSON = ls["previewSettings"];
			if (stateJSON == null) {
				return null;
			}

			// If the JSON fails to parse, just return null
			try {
				state = JSON.parse(stateJSON);
				return state;
			} catch (e) {
				return null;
			}
		},
		saveState: function saveState(state) {
			if (!state.prev_delay || state.prev_delay < 500) {
				state.prev_delay = 500;
			}
			if (!state.prev_width || state.prev_width < 1) {
				state.prev_width = 1;
			}
			if (!state.prev_height || state.prev_height < 1) {
				state.prev_height = 1;
			}
			ls['previewSettings'] = JSON.stringify(state);
		},
		getDomains: function getDomains() {
			var blockedDomains = null;
			try {
				blockedDomains = JSON.parse(ls['blocked_domains']);
			} catch (e) {

			}
			if (!blockedDomains || typeof blockedDomains !== 'object') {
				blockedDomains = null;
			}
			return blockedDomains;
		},
		saveDomains: function saveDomains(domains) {
			ls['blocked_domains'] = JSON.stringify(domains);
		}
	};

	/**
	 * Send message to other parts of the extension
	 * @type {{update: Function}}
	 */
	var scriptUpdater = {
		update: function (state, domains) {
			// Tell the background script to update the domains
			chrome.extension.sendRequest({method: "domains", domains: domains});

			// Tell all the tabs that the settings have changed
			chrome.tabs.query({}, function (tabs) {
				Object.keys(tabs).forEach(function (t) {
					chrome.tabs.sendMessage(tabs[t].id, {msg: 'options', value: state});
				});
			});
		}
	};

	var pc = new PageController();
})(window, chrome);

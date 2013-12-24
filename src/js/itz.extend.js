(function() {
	'use strict';
	if(!window.itz) window.itz = {};
	/* jshint -W089 */
	itz.extend = function(orig_obj, obj) {
		if(!orig_obj || !obj) return;

		for (var prop in obj) {
			orig_obj[prop] = obj[prop];
		}
	};
	/* jshint +W089 */

})();



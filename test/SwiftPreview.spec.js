describe('SwiftPreview', function() {
	var sp;
	var url = 'http://localhost/';
	function showSwiftPreview(params) {
		jasmine.Clock.installMock();
		var $a = $('<a href="'+url+'">test</a>');
		var $b = $('body');
		$b.append($a);
		sp = new SwiftPreview(params);
		$a.trigger('mouseenter');
		jasmine.Clock.tick(501);
	}
	beforeEach(function() {
		$('body').empty();
	});
	afterEach(function() {
		sp.disable();
	});
	describe('Valid Params', function() {
		it('element param by default body', function() {
			var $test = $('<div class="test"></div>');
			$('body').append($test);
			sp = new SwiftPreview({});
			expect($test.children().length).toBe(0);
			expect($('body').children().length).toBeGreaterThan(0);
		});
		it('element param', function() {
			var $test = $('<div class="test"></div>');
			$('body').append($test);
			sp = new SwiftPreview({
				element: $test
			});
			expect($test.children().length).toBeGreaterThan(0);
		});
		it('prev_delay param default', function() {
			jasmine.Clock.installMock();
			var $a = $('<a href="http://localhost">test</a>');
			var $b = $('body');
			$b.append($a);
			sp = new SwiftPreview({});
			$a.trigger('mouseenter');
			jasmine.Clock.tick(450);
			expect($b.children(':visible').length).toBe(1);
			jasmine.Clock.tick(100);
			expect($b.children(':visible').length).toBe(2);
		});
		it('prev_delay param', function() {
			jasmine.Clock.installMock();
			var $a = $('<a href="http://localhost">test</a>');
			var $b = $('body');
			$b.append($a);
			sp = new SwiftPreview({
				prev_delay: 1500
			});
			$a.trigger('mouseenter');
			jasmine.Clock.tick(1400);
			expect($b.children(':visible').length).toBe(1);
			jasmine.Clock.tick(120);
			expect($b.children(':visible').length).toBe(2);
		});

	});

	describe('More params', function() {
		it('prev_height param', function() {
			showSwiftPreview({
				prev_height: 103
			});
			expect($("div[class*='SwiftPreview-content']").height()).toBe(103);
		});
		it('prev_width param', function() {
			showSwiftPreview({
				prev_width: 188
			});
			expect($("div[class*='SwiftPreview-content']").width()).toBe(188);
		});
		it('default prerender param', function() {
			showSwiftPreview({});
			expect($("[class*='SwiftPreview-prerender']").length).toBe(1);
		});
		it('prerender param', function() {
			showSwiftPreview({
				prerender: false
			});
			expect($("[class*='SwiftPreview-prerender']").length).toBe(0);
		});
		it('shift param', function() {
			showSwiftPreview({
				shift: true
			});
			expect($("body").children(':visible').length).toBe(1);
		});
		it('shift param shown on shift', function() {
			showSwiftPreview({
				shift: true
			});
			var e = jQuery.Event( 'keydown', { which: 16 } ); // Shift key
			$("body").trigger(e);
			jasmine.Clock.tick(501);
			expect($("body").children(':visible').length).toBe(2);
		});
		// This could be brittle, need to make sure its correct
		it('ctrl_enlarge param', function() {
			showSwiftPreview({
				prev_height: 10,
				prev_width: 10
			});
			expect($("div[class*='SwiftPreview-content']").height()).toBe(10);
			expect($("div[class*='SwiftPreview-content']").width()).toBe(10);
			var e = jQuery.Event( 'keydown', { ctrlKey: true } ); // Shift key
			$("body").trigger(e);
			expect($("div[class*='SwiftPreview-content']").height()).toBeGreaterThan(10);
			expect($("div[class*='SwiftPreview-content']").width()).toBeGreaterThan(10);
		});
		it('class_suffix param', function() {
			showSwiftPreview({
				class_suffix: 'test'
			});
			expect($(".SwiftPreview-contenttest").length).toBe(1);
		});
	});
	describe('Check various components of SwiftPreview', function() {
		it('Check to make sure the iframe URL is correct', function() {
			showSwiftPreview({
				class_suffix: ''
			});
			expect($(".SwiftPreview-iframe").prop('src')).toBe(url);
		});
		it('Check to make sure the styles are present', function() {
			showSwiftPreview({
				class_suffix: ''
			});
			expect($("body style").length).toBe(1);
		});
		it('Make sure the preview_created event works', function() {
			jasmine.Clock.installMock();
			var $a = $('<a href="'+url+'">test</a>');
			var $b = $('body');
			$b.append($a);
			sp = new SwiftPreview({});
			var called = false;
			sp.subscribe('preview_created', function() {
				called = true;
			});
			$a.trigger('mouseenter');
			jasmine.Clock.tick(501);
			expect(called).toBe(true);
		});
	});
});

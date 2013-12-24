(function($) {
	'use strict';
	window.SwiftPreview = function(custom_options) {
		var me = this;
		// Extend the defaults
		var _options = {
			element:     $('body'),
			prev_delay:  500,
			prev_height: 400,
			prev_width:  600,
			ctrl_enlarge:true,
			prerender:   true,
			shift:       false,
			class_suffix:Math.floor(Math.random() * 100000)
		};

		itz.extend(_options, custom_options);
		// Calculate the frame size
		_options.ifr_height = Math.floor(_options.prev_height);
		_options.ifr_width = Math.floor(_options.prev_width);

		itz.extend(me, new itz.publish());

		// Get a reference to the element containing links
		var _$e = $(_options.element);

		// The object attached to links
		/* jshint -W101 */
		var _$base = $(
			'<div pointer-events="none" class="SwiftPreview' + _options.class_suffix + ' SwiftPreview-container' + _options.class_suffix + '">' +
				'<div class="SwiftPreview' + _options.class_suffix + ' SwiftPreview-arrow' + _options.class_suffix + '"></div>' +
				'<div class="SwiftPreview' + _options.class_suffix + ' SwiftPreview-content' + _options.class_suffix + '">' +
					'<iframe class="SwiftPreview-iframe' + _options.class_suffix + '" sandbox="allow-same-origin"></iframe>' +
					'<img class="SwiftPreviewImg' + _options.class_suffix + ' SwiftPreview-img' + _options.class_suffix + '"/>' +
					'<div class="SwiftPreview' + _options.class_suffix + ' SwiftPreview-cover' + _options.class_suffix + '">' +
						'<img class="SwiftPreviewImg' + _options.class_suffix + ' SwiftPreview-loading' + _options.class_suffix +
						'"  src="data:image/gif;base64,R0lGODlhKwALAPEAAP///wAAAIKCggAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAKwALAAACMoSOCMuW2diD88UKG95W88uF4DaGWFmhZid93pq+pwxnLUnXh8ou+sSz+T64oCAyTBUAACH5BAkKAAAALAAAAAArAAsAAAI9xI4IyyAPYWOxmoTHrHzzmGHe94xkmJifyqFKQ0pwLLgHa82xrekkDrIBZRQab1jyfY7KTtPimixiUsevAAAh+QQJCgAAACwAAAAAKwALAAACPYSOCMswD2FjqZpqW9xv4g8KE7d54XmMpNSgqLoOpgvC60xjNonnyc7p+VKamKw1zDCMR8rp8pksYlKorgAAIfkECQoAAAAsAAAAACsACwAAAkCEjgjLltnYmJS6Bxt+sfq5ZUyoNJ9HHlEqdCfFrqn7DrE2m7Wdj/2y45FkQ13t5itKdshFExC8YCLOEBX6AhQAADsAAAAAAAAAAAA=" />' +
					'</div>' +
				'</div>' +
			'</div>'
		);
		/* jshint +W101 */

		var _$prerenderLink = $('<link rel="prerender" class="SwiftPreview-prerender' + _options.class_suffix +'">');

		// Style to insert into the page
		var _style = '<style type="text/css">' +
			'.SwiftPreview' + _options.class_suffix + '{' +
				'width: auto;' +
				'height: auto;' +
				'display: block;' +
				'position: static;' +
				'background-color: transparent;' +
				'border: 0;' +
				'margin: 0;' +
				'padding: 0;' +
				'overflow: hidden;' +
				'visibility: visible;' +
			'}'  +
			'.SwiftPreviewImg' + _options.class_suffix + '{' +
				'width: auto;' +
				'height: auto;' +
				'display: inline;' +
				'position: static;' +
				'background-color: transparent;' +
				'border: 0;' +
				'margin: 0;' +
				'padding: 0;' +
				'overflow: auto;' +
				'visibility: visible;' +
			'}' +
			'div.SwiftPreview-container' + _options.class_suffix + '{' +
				'pointer-events: none;' +
				'position:absolute;' +
				'overflow: hidden;' +
				'display: none;' +
				'top:0;' +
				'left:0;' +
				'z-index:99999;' +
			'}' +
			'div.SwiftPreview-content' + _options.class_suffix + '{' +
				'padding:7px;' +
				'background-color:black;' +
				'border-radius:3px;' +
				'-webkit-border-radius:3px;' +
				'overflow: hidden;' +
			'}' +
			'img.SwiftPreview-img' + _options.class_suffix + '{' +
				'left: 7px;' +
				'top: 7px;' +
				'position:absolute;' +
				'overflow: hidden;' +
				'-webkit-transform-origin: left top;' +
			'}' +
			'div.SwiftPreview-cover' + _options.class_suffix + '{' +
				'pointer-events: none;' +
				'top:5px;' +
				'position:absolute;' +
				'z-index: 999' +
			'}' +
			'img.SwiftPreview-loading' + _options.class_suffix + '{' +
				'display:none;' +
				'position:absolute;' +
			'}' +
			'iframe.SwiftPreview-iframe' + _options.class_suffix + '{' +
				'display: block;' +
				'overflow: auto;' +
				'visibility: visible;' +
				'border: 0;' +
				'padding: 0px;' +
				'margin: 0px' +
				'width: auto;' +
				'height: auto;' +
				'position: absolute;' +
				'left: 7px;' +
				'top: 7px;' +
				'-webkit-transform-origin: left top;' +
				'background-color: white;' +
			'}' +
			'</style>';

		// jQuery objects
		var _$cont = _$base.filter('.SwiftPreview-container' + _options.class_suffix);
		var _$content = _$cont.find('.SwiftPreview-content' + _options.class_suffix);
		var _$iframe = _$cont.find('.SwiftPreview-iframe' + _options.class_suffix);
		var _$img = _$cont.find('.SwiftPreview-img' + _options.class_suffix);
		var _$cover = _$cont.find('.SwiftPreview-cover' + _options.class_suffix);
		var _$loading = _$cont.find('.SwiftPreview-loading' + _options.class_suffix);

		/* Private variables  */
		// The currrent AJAX call
		var _$hoverLink = null;
		// The current setTimeout running
		var _linkTimer = null;
		var _preRenderTimer = null;
		var _previewVisible = false;
		var _shiftKey = false;
		var _fileType = null;
		var _isImg = false;
		var _ctrlKey = false;
		var _url = null;
		var _isAsync = false;
		var _isYoutube = false;
		var _isVimeo = false;
		var _mousePos = {
			pageX:1,
			pageY:1
		};

		// JavaScript setting
		var _allowJS = false;

		var _blockedTypes = {
			'3gp':    true,
			'7z':     true,
			'avi':    true,
			'bin':    true,
			'bz2':    true,
			'doc':    true,
			'docx':   true,
			'dmg':    true,
			'exe':    true,
			'img':    true,
			'iso':    true,
			'gz':     true,
			'gzip':   true,
			'jar':    true,
			'mid':    true,
			'midi':   true,
			'mov':    true,
			'mp3':    true,
			'mp4':    true,
			'mpg':    true,
			'mpeg':   true,
			'msi':    true,
			'ogg':    true,
			'qt':     true,
			'pdf':    true,
			'ppt':    true,
			'pptx':   true,
			'ram':    true,
			'rar':    true,
			'rss':    true,
			'sql':    true,
			'tar':    true,
			'torrent':true,
			'vbs':    true,
			'wav':    true,
			'xls':    true,
			'xlsx':   true,
			'zip':    true
		};

		var _imageTypes = {
			'png': true,
			'jpg': true,
			'jpeg':true,
			'gif': true,
			'tif': true,
			'tiff':true
		};

		var _init = function() {
			_$e.append(_style);
			_$e.append(_$cont);
			_bindEvents();
		};

		var _bindEvents = function() {
			_$e.on('mouseenter', 'a', null, _onLinkHover);

			_$e.on('mouseleave', 'a', null, _onLinkUnhover);

			$('body').bind('keydown', _onKeyDown).bind('keyup', _onKeyUp);
		};

		var _onLinkHover = function(a) {
			var that = this;

			_$hoverLink = $(that);
			_getMousePos(a);
			if(_options.shift && !_shiftKey) {
				return;
			}
			_setTimer();
		};

		var _onLinkUnhover = function() {
			$('body').unbind('mousemove', _getMousePos);
			$(this).unbind('mousemove', _onMouseMoveImage);
			$(this).unbind('mousemove', _onMouseMoveIframe);
			_$hoverLink = null;
			if(_preRenderTimer) {
				clearTimeout(_preRenderTimer);
			}

			if(_linkTimer) {
				clearTimeout(_linkTimer);
			}
			_$cont.fadeOut(200);

			_previewVisible = false;
		};

		var _getMousePos = function(event) {
			_mousePos = {
				pageX:event.pageX,
				pageY:event.pageY
			};
		};

		var _onKeyDown = function(e) {
			if(e.which === 16) {
				_shiftKey = true;
				if(_options.shift && _$hoverLink) {
					_setTimer();
				}
			} else if(e.ctrlKey) {
				if(_ctrlKey) {
					_restoreHover();
				} else if(_previewVisible) {
					_ctrlKey = true;
					_$e.off('mouseenter', 'a', _onLinkHover);
					_$e.off('mouseleave', 'a', _onLinkUnhover);
					_$hoverLink.unbind('mousemove', _onMouseMoveImage);
					_$hoverLink.unbind('mousemove', _onMouseMoveIframe);
					_$cont.css('pointer-events', 'all');
					_$cover.hide();
					if(_options.ctrl_enlarge && !_isImg) {
						_positionIframe(_mousePos, 10000, 10000);
					}
					$('body').click(_restoreHover);
				}
			}
		};

		var _onKeyUp = function(e) {
			if(e.which === 16) {
				_shiftKey = false;
			}
		};

		var _onMouseMoveIframe = function(a) {
			_getMousePos(a);
			_positionIframe(a, _options.prev_width, _options.prev_height);
		};

		var _onMouseMoveImage = function(a) {
			_getMousePos(a);
			_positionImage(a);
		};

		var _restoreHover = function() {
			_ctrlKey = false;
			if(_isYoutube) {
				me.publish('close_youtube');
			} else if(_isVimeo) {
				//hack to kill vimeo videos
				_$iframe.attr('src','');
				me.publish('close_vimeo');
			}
			_onLinkUnhover();
			_$e.on('mouseenter', 'a', null, _onLinkHover);
			_$e.on('mouseleave', 'a', null, _onLinkUnhover);
			_$cont.css('pointer-events', 'none');
			_$cover.show();
			$('body').unbind('click', _restoreHover);
		};

		var _setTimer = function() {
			if(_options.prerender) {
				_preRenderTimer = setTimeout(function() {
					_$prerenderLink.remove();
					_$prerenderLink.attr('href', _$hoverLink[0].href);
					_$e.append(_$prerenderLink);
				}, 500);
			}
			_$hoverLink.bind('mousemove', _getMousePos);

			_linkTimer = setTimeout(function() {
				_$hoverLink.unbind('mousemove', _getMousePos);
				_manipulateUrl();
			}, _options.prev_delay);
		};

		var _enableJS = function() {
			_allowJS = true;
			_$iframe.removeAttr('sandbox');
		};

		var _disableJS = function() {
			_allowJS = false;
			_$iframe.attr('sandbox', 'allow-same-origin');
		};

		var _manipulateUrl = function() {
			var url_host = _$hoverLink[0].host.toLowerCase();
			_isImg = false;
			_fileType = null;
			_isYoutube = false;
			_isVimeo = false;
			_isAsync = false;
			_url = _$hoverLink[0]['href'];
			_allowJS = false; // Sandbox the URL by default
			var tweetId = null;

			// Twitter Code
			if(url_host === 't.co') {
				if(_$hoverLink.text().indexOf('pic.twitter.com') > -1){
					tweetId = _$hoverLink.closest('.stream-item').attr('data-item-id');
					url_host = 'pic.twitter.com';
				} else {
					var expandedUrl = _$hoverLink.attr('data-expanded-url');
					if(expandedUrl) {
						_url = expandedUrl;
						url_host = _url.match(/:\/\/(.[^/]+)/)[1];
					}
				}
			}

			var $img;
			var apiRequest;
			if(url_host.indexOf('facebook.com') !== -1) {
				$img = _$hoverLink.find('img');
				if($img.length === 1) {
					_url = $img[0].src;
					_url = _url.replace(/\/c[^\/]+\//, '/');
					_url = _url.replace(/\/[p,s][^\/]{2,4}x[^\/]{2,4}\//, '/');
					_url = _url.replace(/_.\./, '_n.');
				} else {
					var $i = _$hoverLink.find('i');
					if($i.length === 1) {
						_url = $i[0].style.backgroundImage.replace('url(', '');
						_url = _url.replace(')', '');
						_url = _url.replace(/_.\./, '_n.');
					} else {
						return;
					}
				}
			} else if(url_host === 'plus.google.com') {
				$img = _$hoverLink.find('img');
				if($img.length === 1) {
					_url = $img[0].src;
					if(_url.indexOf('googleusercontent') !== -1) {
						_isImg = true;
					}
					_url = _url.replace(/\/w\d{1,4}-h\d{1,4}[\w-]*\//, '/w2048/');
				}
			} else if(url_host === 'maps.google.com' ||
				_url.match(/[a-zA-Z]{3,5}:\/\/(?:[a-zA-Z\-1-9]+\.)+?google(?:\.[a-zA-Z]{2,6}){1,2}(?:\/maps)/i)) {
				_url += '&output=embed';
				_allowJS = true;
			} else if(url_host.match(/(www\.)?(youtube\.com|youtu\.be)/)) {
				var youtube_id = _url.split(/v\/|v=|youtu\.be\//);
				if(youtube_id[1]) {
					youtube_id = youtube_id[1].split(/[?&]/)[0];
					_url = 'http://www.youtube.com/embed/' + youtube_id + '?version=3&enablejsapi=1';
					_isYoutube = true;
					_allowJS = true;
				}
			} else if(url_host.match(/(www\.)?vimeo\.com/)) {
				var vimeo_id = /\/(\d+)/i.exec(_url);
				if(vimeo_id[1]) {
					_url = 'http://player.vimeo.com/video/' + vimeo_id[1] + '?api=1';
					_isVimeo  = true;
					_allowJS = true;
				}
			} else if(url_host.match(/(www\.)?imgur\.com/)) {
				if (!_url.match('\/a\/')) {
					_url = _url.replace('www.','').replace('imgur','i.imgur').replace(/\.com\/.*\//,'.com/') + '.jpg';
				}
			} else if(url_host.match(/(www\.)?qkme\.me/)) {
				_url = _url.replace('www.','').replace('qkme','i.qkme').replace(/(\?|#).*$/,'') + '.jpg';
			} else if(url_host.match(/(www\.)?quickmeme\.com/)) {
				var id = _url.match(/\/meme\/(\w+)\b/);
				if (id){
					_url = 'http://i.qkme.me/' + id[1] + '.jpg';
				}
			} else if(url_host.match(/(www\.)?instagram\.com|(www\.)?instagr\.am/)) {
				_isAsync = true;
				var instagramApi = 'http://api.instagram.com/oembed?url=';
				apiRequest = instagramApi + encodeURIComponent(_url);
				$.getJSON(apiRequest, function(data) {
					if(data.url != null) {
						_isImg = true;
						_url = data.url;
						_addPreview();
					} else {
						_isAsync = false; // Couldn't find Instagram image URL. Fail to regular preview.
					}
				});
			} else if(url_host.match(/pic.twitter.com/)) {
				_isAsync = true;
				var twitterApi = 'http://api.twitter.com/1/statuses/show/TWEET_ID.json?include_entities=true';
				if(tweetId != null) {
					apiRequest = twitterApi.replace('TWEET_ID',tweetId);
					$.getJSON(apiRequest, function(data) {
						if (data.entities.media[0].media_url != null) {
							_isImg = true;
							_url = data.entities.media[0].media_url;
							_addPreview();
						} else {
							_isAsync = false;
						}
					});
				}
			}

			var relative_url = _url.replace(document.location.href.split('#')[0], '');
			if(!relative_url || /^\s*$/.test(relative_url) || relative_url.indexOf('#') === 0 ||
				_url.indexOf('http') !== 0) {
				return;
			}

			// Figure out if we're dealing with a file instead of regular URL
			var fileType = /\.([0-9A-Za-z]+)$/i.exec(_url.split('?')[0]);
			if(fileType) {
				_fileType = fileType[1];
			}
			if(fileType && _blockedTypes[fileType]) {
				return;
			}

			if(_$iframe.attr('src') !== _url) {
				_$iframe.remove();
				_$iframe.removeAttr('src');
			}

			if(_allowJS) {
				_enableJS();
			} else {
				_disableJS();
			}


			if(!_isAsync) {
				_addPreview();
			}
		};

		var _addPreview = function() {

			_previewVisible = true;
			var previewLoaded = false;
			me.publish('preview_created', _url);

			// If we are dealing with https, load a default iframe, otherwise make an ajax call
			_$loading.hide();
			setTimeout(function() {
				if(!previewLoaded) {
					_$loading.show();
				}
			}, 500);

			if(_fileType && _imageTypes[_fileType] || _isImg) {
				_isImg = true;
				_$iframe.hide();
				_$img.css({height:'auto', width:'auto'});
				_$img.show();
				_$img.unbind('load').load(function() {
					previewLoaded = true;
					_$loading.hide();
					_positionImage(_mousePos);
					_$img.css({visibility:'visible'});
					_$cont.css({visibility:'visible'});
				});
				if(_$img.attr('src') !== _url) {
					_$img.attr('src', _url);
					_$img.css({visibility:'hidden'});
					_$cont.css({visibility:'hidden'});
				} else {
					_$img.css({visibility:'visible'});
					_$cont.css({visibility:'visible'});
					previewLoaded = true;
					_positionImage(_mousePos);
				}
				_$hoverLink.unbind('mousemove', _onMouseMoveImage).bind('mousemove', _onMouseMoveImage);

			} else {
				_isImg = false;
				_$img.hide();
				_$iframe.show();
				_$iframe.unbind('load').load(function() {
					previewLoaded = true;
					_$loading.hide();
					_$img.css({visibility:'visible'});
				});
				if(_$iframe.attr('src') !== _url) {
					_$iframe.attr('src', _url);
					_$content.append(_$iframe);
				} else {
					previewLoaded = true;
				}
				_positionIframe(_mousePos, _options.prev_width, _options.prev_height);
				_$hoverLink.unbind('mousemove', _onMouseMoveIframe).bind('mousemove', _onMouseMoveIframe);
			}
			_$cont.show();
		};

		var _positionImage = function(a) {
			var window_width = $(window).width();
			var window_height = window.innerHeight;
			var top_margin = a.pageY - $(window).scrollTop();
			var image_width = _$img[0].naturalWidth;
			var image_height = _$img[0].naturalHeight;
			var contentWidth = 0;
			var contentHeight = $(window).height() - 40;

			if(a.pageX <= window_width / 2) {
				_$cont.css({"left":a.pageX + 80 + "px"});
				contentWidth = window_width - a.pageX - $(window).scrollLeft() - 110;
			} else {
				contentWidth = a.pageX - $(window).scrollLeft() - 90;
			}

			var width_scale = contentWidth / image_width;
			var height_scale = contentHeight / image_height;

			if(width_scale < 1 || height_scale < 1) {
				if(width_scale < height_scale) {
					_$img.css({height:'auto', width:contentWidth});
					contentHeight = image_height * width_scale;
				} else {
					_$img.css({height:contentHeight, width:'auto'});
					contentWidth = image_width * height_scale;
				}
			} else {
				contentWidth = image_width;
				contentHeight = image_height;
			}
			_$content.height(contentHeight).width(contentWidth);
			_$cover.height(contentHeight).width(contentWidth);
			_$loading.css('margin-top', (contentHeight - 11) / 2).css('margin-left', (contentWidth - 43) / 2);

			if(a.pageX > window_width / 2) {
				_$cont.css({"left":a.pageX - contentWidth - 80});
			}

			if(contentHeight / 2 > top_margin - 10) {
				_$cont.css({top:$(window).scrollTop() + 10 + "px"});
			} else if(contentHeight / 2 > window_height - top_margin - 10) {
				_$cont.css({top:$(window).scrollTop() + window_height - contentHeight - 30 + "px"});
			} else {
				_$cont.css({top:a.pageY - (contentHeight / 2)});
			}

		};

		var _positionIframe = function(a, width, height) {
			var window_width = $(window).width();
			var window_height = window.innerHeight;
			var contentWidth = 0;
			var iframeWidth = 0;
			var iframeHeight = 0;
			var contentHeight = window.innerHeight - 40;
			contentHeight = contentHeight < height ? contentHeight : height;
			var top_margin = a.pageY - $(window).scrollTop();
			var possible_width = 0;

			if(a.pageX <= window_width / 2) {
				possible_width = window_width - a.pageX - $(window).scrollLeft() - 110;
				contentWidth = possible_width < width ? possible_width : width;
				_$cont.css({"left":a.pageX + 80 + "px"});
				_$cont.css({"-webkit-box-shadow":"10px 10px 30px black", "box-shadow":"10px 10px 30px black"});
			} else {
				possible_width = a.pageX - $(window).scrollLeft() - 90;
				contentWidth = possible_width < width ? possible_width : width;
				_$cont.css({"left":a.pageX - 80 - contentWidth + "px"});
				_$cont.css({"-webkit-box-shadow":"-10px 10px 30px black", "box-shadow":"-10px 10px 30px black"});
			}

			if(contentWidth < 1050) {
				iframeWidth = 1050;
				var scale = contentWidth / iframeWidth;
				iframeHeight = contentHeight / scale;
				_$iframe.css('-webkit-transform', 'scale(' + scale + ',' + scale + ')');
			} else {
				_$iframe.css('-webkit-transform', '');
				iframeWidth = contentWidth;
				iframeHeight = contentHeight;
			}

			if(contentHeight / 2 > top_margin - 15) {
				_$cont.css({top:$(window).scrollTop() + 10 + "px"});
			} else if(contentHeight / 2 > window_height - top_margin - 15) {
				_$cont.css({top:$(window).scrollTop() + window_height - contentHeight - 30 + "px"});
			} else {
				_$cont.css({top:a.pageY - (contentHeight / 2)});
			}

			// Set the height a widths
			_$content.height(contentHeight).width(contentWidth);
			_$cover.height(contentHeight).width(contentWidth);
			_$loading.css('margin-top', (contentHeight - 11) / 2).css('margin-left', (contentWidth - 43) / 2);
			_$iframe.height(iframeHeight).width(iframeWidth);
		};

		this.disable = function() {
			$('body').unbind('keydown', _onKeyDown).unbind('keyup', _onKeyUp);
			_$e.off('mouseenter', 'a', _onLinkHover);
			_$e.off('mouseleave', 'a', _onLinkUnhover);
		};

		this.enable = function() {
			var $bd = $('body');
			_$hoverLink.unbind('mousemove', _onMouseMoveImage);
			_$hoverLink.unbind('mousemove', _onMouseMoveIframe);
			$bd.unbind('keydown', _onKeyDown).unbind('keyup', _onKeyUp);
			_$e.off('mouseenter', 'a', _onLinkHover);
			_$e.off('mouseleave', 'a', _onLinkUnhover);
			$bd.bind('keydown', _onKeyDown).bind('keyup', _onKeyUp);
			_$e.on('mouseenter', 'a', _onLinkHover);
			_$e.on('mouseleave', 'a', _onLinkUnhover);
		};

		this.updateOptions = function(options) {
			itz.extend(_options, options);
		};

		_init();
	};
})(jQuery);
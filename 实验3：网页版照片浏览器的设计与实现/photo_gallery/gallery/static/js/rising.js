
/* Copyright (c) 2011 Ernesto Mendez <der-design.com> */

var wrap, body, html;

window.Rising = new (function($) {

	$(document).ready(function() {

		html = $('html');
		body = $('body');
		wrap = $('#wrap');

		if ( Rising.ie.is_ie() ) html.addClass('ie'); else html.addClass('not-ie');

	})

	var slider, loadFns = [], validateForms = []

	this.ie = new IE_Detect();

	this.onLoad = function(callback) {
		loadFns.push(callback);
	}

	this.load = function() {
		for (var i=0; i < loadFns.length; i++) {loadFns[i].call(this);} // Load queued callbacks
		this.slideshow();
		this.portfolioSlideshow();
	}

	this.slideshow = function() {
		slider = $('#slider');
		if ( slider.length == 0 ) return;
		var sliderClass = slider.attr('class') || this.slider.sliderClass;
		switch (sliderClass ) {
			case 'default':
				this.slider = new defaultSlider(this);
				break;
			case 'nivo':
				this.slider = new nivoSlider(this);
				break;
			case 'accordion':
				this.slider = new accordionSlider(this);
				break;
			case 'piecemaker':
				this.slider = new piecemakerSlider(this);
				this.slider.load();
				break;
		}
	}

	this.loadScript = function(url, callback) {
		head.js(url, callback);
	}

	function defaultSlider(self) {

		if ( self.sliderData.length <= 1 ) return;
		this.config = self.sliderConfig;
		this.totalSlides = self.sliderData.length;
		this.running = false;
		this.currentSlide = 0;
		this.sliderData = self.sliderData;
		this.playing = false;

		var self = this,
			blind = slider.find('span.blind'),
			controls = slider.find('ul.common-slide-controls'),
			titleDesc = slider.find('a.title-desc'),
			slideImage = slider.find('img.slide'),
			intervalID = 0;

		// Create Image Objects (cache)
		var i, cache = [];
		for (i=0; i < this.totalSlides; i++) {
			cache.push($(_.sprintf('<img width="892" height="%s" src="%s" />', this.config.height, self.sliderData[i].img)));
		}

		// Generate Controls
		var controlsHtml = '';
		for (i=0; i < this.totalSlides; i++) { controlsHtml += _.sprintf('<li rel="%d"></li>', i); }
		controls.append(controlsHtml).find('li:first-child').addClass('active');

		// Control Click Events
		controls.find('li').click(function() {
			if ( this.data == undefined ) this.data = {me: $(this), next: parseInt($(this).attr('rel'))};
			with (this.data) {
				if ( self.running || me.hasClass('active') ) return;
				self.running = true;
				self.runSlide(next);
			}
		})

		// Automatically set next image to preload
		blind.html(cache[1]);

		// Start the slideshow
		this.play = function() {
			this.playing = true;
			clearInterval(intervalID);
			intervalID = setInterval(function() {
				self.nextSlide();
			}, this.config.pauseTime + this.config.pauseTime*0.7);
		}

		// Pause the slideshow
		this.pause = function() {
			this.playing = false;
			clearInterval(intervalID);
		}

		// Toggle the slideshow
		this.toggle = function() {
			if ( this.playing ) this.pause()
			else this.play();
		}

		// Move to a specific slide
		this.slideMove = function(incr) {
			var next = Rising.cycle(incr, this.currentSlide, this.totalSlides);
			this.runSlide(next);
		}

		// Run a specific slide by index
		this.runSlide = function(next) {
			this.currentSlide = next;
			clearInterval(intervalID);
			controls.find('li').eq(next).addClass('active').siblings('li.active').removeClass('active');

			var self = this, l = titleDesc.width();
			titleDesc.stop().animate({marginLeft: (l*-1)-40+'px'}, this.config.transitionTime, this.config.easing, function() {
				titleDesc.hide();
				titleDesc.find('h1').html(self.sliderData[next].title);
				titleDesc.find('h2').html(self.sliderData[next].desc);
				if ( self.sliderData[next].url != undefined ) titleDesc.attr('href', self.sliderData[next].url);
				else titleDesc.removeAttr('href');
				l = titleDesc.width();
				titleDesc
				  .css({marginLeft: (l*-1)-40+'px'})
				  .show()
				  .animate({marginLeft: '0px'}, self.config.transitionTime*0.7, self.config.easing, function() {
					  self.running = false;
					  slideImage.attr('src', cache[next].attr('src'));
					  setTimeout(function() { blind.css('width','0px'); },0);
					  if ( self.config.autoplay ) self.play();
				  });
			});
			blind.html(cache[next]).stop().animate({width: '892px'}, self.config.transitionTime, self.config.easing, function() {

			});

		}

		// Runs the next slide
		this.nextSlide = function() {
			this.slideMove(1);
		}

		// Runs the previous slide
		this.prevSlide = function() {
			this.slideMove(-1);
		}

		if ( this.config.autoplay ) this.play()

	}

	function nivoSlider(self) {

		// Closure Vars
		var images = '',
			slider = $('#slider.nivo'),
			workarea = slider.find('.workarea'),
			controls = slider.find('ul.common-slide-controls'),
			title = slider.find('h2.slider-title a'),
			controlsHtml = [],
			busy = false;

		// Append images
		var i=0;
		_.each(self.sliderData, function(ob) {
			if (i != 0) images += _.sprintf('<img width="892" height="%d" src="%s" />\n', self.sliderConfig.sliderHeight, ob.img);
			controlsHtml.push(_.sprintf('<li rel="%d"></li>', i));
			i++;
		});

		// Controls need to float right
		controlsHtml.reverse();
		controls.append(controlsHtml.join('')).find('> li:last-child').addClass('active');
		controls.find('> li:first-child').css('marginRight', '11px');

		var data, currentSlide, nivoOptions = _.extend(self.sliderConfig, {
			directionNavEnable: false,
			directionNavHide: false,
			pauseOnHover: false,
			beforeChange: function() {
				busy = true;
				currentSlide = nivoData.currentSlide+1;
				controls.find('li[rel='+currentSlide+']').addClass('active').siblings('.active').removeClass('active');
				data = self.sliderData[currentSlide];
				if ( html.hasClass('opacity') ) {
					title.stop().fadeOut(self.sliderConfig.animSpeed*0.5, function() {
						title.html(data.title).attr('href', data.url).fadeIn(self.sliderConfig.animSpeed*0.5);
					});
				} else title.html(data.title).attr('href', data.url);
			},
			afterChange: function() { busy = false; }
		});

		var nivoData = workarea.append(images).nivoSlider(nivoOptions).data('nivo:vars');

		// Nivo Slider elements ready
		var nivoControlNav = slider.find('.nivo-controlNav');

		controls.find('li').each(function() {
			this.data = {};
			this.data.self = $(this);
			this.data.rel = parseInt(this.data.self.attr('rel'));
			this.data.hook = nivoControlNav.find('a[rel='+this.data.rel+']');
		}).click(function() {
			if ( busy ) return;
			with (this.data) {
				hook.click();
			}
		});

	}

	this.portfolioSlideshow = function() {
		var portfolioOne = $('#portfolio-one');
		if ( portfolioOne.length == 0 ) return;

		var self = this, i=0, articleIndex=0,
			articles = portfolioOne.find('> article');

		// Per-Slideshow configuration
		_.each(this.sliderData, function(array) {

			if ( array.length == 0 ) return;

			var h, j=0, images = [], controls = [],
				workarea = articles.eq(articleIndex).find('> .slider .workarea'),
				pager = articles.eq(articleIndex).find('> .slider ul.common-slide-controls');
			h = parseInt(workarea.css('height').replace(/px$/, ''));

			// Create images & controls
			_.each(array, function(img) {
				if (j>0) images.push(_.sprintf('<img width="548" height="%d" src="%s" />', h, img));
				controls.push(_.sprintf('<li data-belongs-to="%d" rel="%d"></li>', articleIndex, j));
				j++;
			});

			// Attach images & controls
			pager.append(controls.join('')).find('li:first-child').addClass('active');

			var	options = _.extend({
				beforeChange: function() {
					with (options.nivoData) {
						busy = true;
						emitter.addClass('active').siblings('.active').removeClass('active');
					}
				},
				afterChange: function() { options.nivoData.busy = false; }
			}, self.sliderConfig);

			// Create nivoSlider instance

			workarea.append(images.join('')).nivoSlider(options);

			// Make nivoData available in nivo.beforeChange
			options.nivoData = workarea.data('nivo:vars');

			articleIndex++;
		});

		// Add data to each article object
		articles.each(function() {
			this.data = {self: $(this)};
			this.data.busy = false;
			this.data.nivoPager = this.data.self.find('.nivo-controlNav a');
			this.data.nivoData = this.data.self.find('.nivoSlider').data('nivo:vars');
		});

		// Controls click events
		portfolioOne.find('> article > .slider ul.common-slide-controls li').each(function() {
			this.data = {};
			this.data.self = $(this);
			this.data.belongsTo = parseInt(this.data.self.attr('data-belongs-to'));
			this.data.rel = parseInt(this.data.self.attr('rel'));
		}).live('click', function() {
			with (this.data) {
				var obData = articles.eq(belongsTo).get(0).data;
				if ( obData.busy ) return;
				obData.nivoData.emitter = self;
				obData.nivoPager.eq(rel).click();
			}
		});

	}

	this.cycle = function(increment, current, total) {
		var next = parseInt(current) + parseInt(increment);
		if ( next >= 0 && next <= total-1 ) return next;
		else if ( next < 0 ) return total-1;
		else if ( next >= total ) return 0;
		else return 0;
	}

	function accordionSlider(self) {
		var slider = $('#slider.accordion'),
			sliderWidth = parseFloat(slider.width()),
			slides = slider.find('ul.slides'),
			images = [],
			w = Math.floor(sliderWidth / self.sliderData.length),
			h = parseInt(slider.css('height').replace(/px$/, ''));

		_.each(self.sliderData, function(ob) {
			images.push(_.sprintf('<li style="width: %dpx"><img width="892" height="%d" src="%s" /><span class="bottom-bar"><a href="%s">%s</a></span></li>', w, h, ob.img, ob.url, ob.title));
		});

		slides.html(images.join('')).find('li').addClass('shadow').each(function() {
			this.data = {self: $(this)};
			this.data.anchor = this.data.self.find('a');
			this.data.opacity = html.hasClass('opacity');
		}).hover(function(e) {
			with (this.data) {
				switch (e.type) {
					case 'mouseenter':
						if (opacity) anchor.stop().animate({opacity: 1});
						else anchor.show();
						break;
					case 'mouseleave':
						if (opacity) anchor.stop().animate({opacity: 0});
						else anchor.hide();
						break;
				}
			}
		});

		// API: http://www.jeremymartin.name/projects.php?project=kwicks

		slides.kwicks({
			min: 100,
			max: sliderWidth * 0.90,
			duration: self.sliderConfig.duration,
			spacing: 0,
			easing: self.sliderConfig.easing
		});

		slider.data('width', sliderWidth);

	}

	function piecemakerSlider(self) {

		if ( this.data == undefined ) {
			var slider = $('#slider.piecemaker');
			this.data = { // saves to Rising.slider, not #slider
				sliderHtml: _.sprintf('<div id="slider" class="piecemaker" style="height:%dpx;">%s</div>', slider.height(), slider.html()),
				sliderWidth: slider.width(),
				sliderHeight: slider.height()+150
			};
			this.sliderClass = slider.attr('class');
		}

		// loading method
		this.load = function() {
			var docroot = 'core/flash/piecemaker/web/',
				flashvars = {},
				swfSource = docroot + 'piecemaker.swf',
				expressInstall = docroot + 'scripts/swfobject/expressinstall.swf';
			flashvars.cssSource = docroot + "piecemaker.css";
			flashvars.xmlSource = docroot + 'piecemaker-' + Rising.theme + '-' + (wrap.width()+60) + '.xml';

			var params = {};
			params.play = "true";
			params.menu = "false";
			params.scale = "showall";
			params.wmode = "transparent";
			params.allowfullscreen = "true";
			params.allowscriptaccess = "always";
			params.allownetworking = "all";

			swfobject.embedSWF(swfSource, 'slider', this.data.sliderWidth, this.data.sliderHeight, '10', expressInstall, flashvars, params, null);
		}

		this.reload = function() {
			if ( ! $.browser.safari ) return;
			$('object#slider').replaceWith(this.data.sliderHtml);
			this.load();
		}

	}

	this.isMobile480 = function() {
		return parseInt(wrap.width()) == 420; // + 60 = 480px
	}

	this.isMobile768 = function() {
		return parseInt(wrap.width()) == 708; // + 60 = 768px
	}

	this.isDesktop = function() {
		return parseInt(wrap.width()) == 900; // + 60 = 960px
	}

	this.isAppleDevice = function() {
		return navigator.userAgent.match( /(iPod|iPhone|iPad)/ ) ? true : false;
	}

	function IE_Detect() {
		var self = this;
		var version = (function() {
			var re = /MSIE (\d+)\./;
			var match = navigator.appVersion.match(re);
			if ( match ) { return parseInt(match[1]); }
			else { return null; }
		})()

		self.version = function() { return version; }
		self.is_ie = function() { return version != null; }

		/* The following methods uses Internet Explorer's Conditional Comments comparison syntax:
		 * http://msdn.microsoft.com/en-us/library/ms537512(v=vs.85).aspx */

		self.e = function(v) { return (version) ? version == parseInt(v) : false; }  // Equals
		self.is = self.e; // Method alias
		self.gt = function(v) { return (version) ? version > parseInt(v) : false; } // Greater than
		self.gte = function(v) { return (version) ? version >= parseInt(v) : false; }  // Greater than or equals
		self.lt = function(v) { return (version) ? version < parseInt(v) : false; } // Less than
		self.lte = function(v) { return (version) ? version <= parseInt(v) : false; }  // Less than or equals
	}

})(jQuery)
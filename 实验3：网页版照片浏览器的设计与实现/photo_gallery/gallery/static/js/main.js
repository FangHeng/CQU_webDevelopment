
/* Copyright (c) 2011 Ernesto Mendez <der-design.com> */

var html, body;

(function() {

var nav, navSection, navSearch, wrap,
	navSearchActive = false;

$(document).ready(function() {

	html = $('html'), body = $('body'), wrap = $('#wrap');

	ui_enhance();
	ui_events();
	ui_scrollable();
	ui_lightbox();
	ui_shortcodes();
	ui_syntax_highlight();
	Rising.load();

});

function ui_enhance() {

	wrap = $('#wrap');
	nav = $('nav[role=navigation] ul');
	navSection = nav.parents('section');

	// Nav Stripes
	nav.find('> li > ul > li:even').addClass('alt');

	// Nav Hover
	nav.find('> li').hover(function() {
		$(this).find('ul:first').css({visibility: 'visible',display: 'none'}).fadeIn(300,'easeOutSine');
	}, function() {
		$(this).find('ul:first').css({visibility: 'hidden'});
	});

	// Nav Home/Search Hover
	navSection.find('> a.button').each(function() {
		this.data = this.data || {};
		this.data.self = $(this);
		this.data.span = this.data.self.find('span');
		this.data.isSearch = this.data.self.hasClass('search');
	}).hover(function(e) {
		with (this.data) {
			if ( isSearch && navSearchActive ) return;
			switch (e.type) {
				case 'mouseenter':
					span.stop().animate({opacity: 1}, 400);
					break;
				case 'mouseleave':
					span.stop().animate({opacity: 0}, 150);
					break;
			}
		}
	});

	if ( Rising.ie.is(8) ) $('#nav-wrap a.button').trigger('mouseleave');

	// Hide plus buttons, excluding special portfolio layout
	$('.frame .plus, .frame .overlay-desc').not('.column-grid.special .frame .plus').addClass('hide');

	// Suppress last-child margin
	$('\
.content > *:last-child:not(a), .excerpt > *:last-child:not(a), \
ul.sc-tabs > li.tab > *:last-child:not(a), \
.column-4 > *:last-child:not(a), \
.column-3 > *:last-child:not(a), \
.column-2 > *:last-child:not(a) \
').css({marginBottom: 0});

	// Hover effect for Latest Work Entries
	if ( html.hasClass('opacity') ) {
		$('a.special-hover').each(function() {
			this.data = { self: $(this), span: null };
			with (this.data) {
				self.append('<span class="hover"></span>');
				span = self.find('span.hover').css('visibility','visible');
				span.width(span.width()-8).height(span.height()-8);
				self.hover(function(e) {
					switch (e.type) {
						case 'mouseenter':
							span.stop().animate({opacity: 1}, 200);
							break;
						case 'mouseleave':
							span.stop().animate({opacity: 0}, 180);
							break;
					}
				});
			}
		});
	}

	// Hover effect for Social Icons
	$('footer ul.social-icons li a').each(function() {
		this.data = {self: $(this)};
	}).hover(function(e) {
		with (this.data) {
			switch (e.type) {
				case 'mouseenter':
					self.stop().animate({opacity: 1}, 180);
					break;
				case 'mouseleave':
					self.stop().animate({opacity: 0.51},180);
					break;
			}
		}
	});

	if ( Rising.ie.is(8) ) $('footer ul.social-icons li a').trigger('mouseleave');

	// Color Change Animation function
	function colorChange(e) {
		if ( ! this.data.hasText ) return;
		with (this.data) {
			switch (e.type) {
				case 'mouseenter':
					self.stop().animate({color: toColor}, timers[0]);
					break;
				case 'mouseleave':
					self.stop().animate({color: origColor}, timers[1]);
					break;
			}
		}
	}

	// Homepage Posts & Blog Posts color animations
	$('#home section.modular h2.post-title a, #portfolio h2.post-title a, .post .post-meta h1 a, #secondary .widget a').each(function() {
		this.data = {};
		this.data.self = $(this);
		this.data.origColor = this.data.self.css('color');
		this.data.hasText = this.data.self.text().length > 0;
		this.data.toColor = Rising.colors.postTitleHover;
		this.data.timers = [180, 180];
	}).hover(colorChange);

	// Footer links color animations
	$('footer[role=contentinfo] a').each(function() {
		this.data = {};
		this.data.self = $(this);
		this.data.origColor = this.data.self.css('color');
		this.data.hasText = this.data.self.text().length > 0;
		this.data.toColor = Rising.colors.footerLinkHover;
		this.data.timers = [180, 180];
	}).hover(colorChange);

	// Image Frame Animations
	$('.frame:not(.transparent), .widget.widget_flickr .flickr_badge_image img').each(function() {
		this.data = {};
		this.data.self = $(this);
		this.data.c = Rising.colors.frameHover;
		this.data.bc = this.data.self.css('borderLeftColor');
		this.data.plus = this.data.self.find('.plus.hide');
		this.data.overlay = this.data.self.find('span.overlay');
		this.data.desc = this.data.self.find('.overlay-desc.hide');
		if ( this.data.desc.length ) {
			this.data.desc.css('bottom', -(this.data.desc.height())-13+'px');
		}
		this.data.frameHover = ! this.data.self.hasClass('nohover');
		this.data.t1 = 400;
		this.data.t2 = 200;
	}).hover(function(e) {
		with (this.data) {
			var isMobile480 = Rising.isMobile480();
			switch (e.type) {
				case 'mouseenter':
					if ( plus.length && ! isMobile480 ) plus.stop().animate({right: 0}, t1, 'easeOutExpo'); // Plus button
					if ( desc.length && ! isMobile480 ) desc.stop().animate({bottom: '0'}, t1, 'easeOutExpo'); // Overlay Description
					if ( html.hasClass('opacity') && overlay.length ) overlay.stop().animate({opacity: 1}, t1); // Color Overlay
					if ( frameHover ) self.stop().animate({borderTopColor:c, borderRightColor:c, borderBottomColor:c, borderLeftColor:c}, t2); // Frame Color
					break;
				case 'mouseleave':
					if ( plus.length && ! isMobile480 ) plus.stop().animate({right: '-32px'}, t1, 'easeOutExpo'); // Plus Button
					if ( desc.length && ! isMobile480 ) desc.stop().animate({bottom: -(desc.height()+13)+'px'}, t1, 'easeOutExpo'); // Overlay Description
					if ( html.hasClass('opacity') && overlay.length ) overlay.stop().animate({opacity: 0}, t1); // Color Overlay
					if ( frameHover ) self.stop().animate({borderTopColor:bc, borderRightColor:bc, borderBottomColor:bc, borderLeftColor:bc}, t2); // Frame Color
					break;
			}
		}

	});

	// Pagination Effect
	$('section#pagination a').each(function() {
		this.data = {};
		this.data.self = $(this);
		this.data.which = $(this).attr('class');
		this.data.paramsIn = {
			prev: {marginLeft: '3px'},
			next: {marginRight: '3px'}
		};
		this.data.paramsOut = {
			prev: {marginLeft: '0'},
			next: {marginRight: '0'}
		};
	}).hover(function(e) {
		with (this.data) {
			switch (e.type) {
				case 'mouseenter':
					self.stop().animate(paramsIn[which], 120);
					break;
				case 'mouseleave':
					self.stop().animate(paramsOut[which], 120);
					break;
			}
		}
	});

	// Portfoio Layout Animations (special)

	$('#portfolio .column-grid.special').each(function() {
		var self = $(this);
		self.wrap('<div class="wrapper"></div>');
		self.parent().height( self.height() );
		self.addClass('absolute');
	});

	$('#portfolio .column-grid.special ul.column li.entry').each(function() {
		this.data = {};
		this.data.self = $(this);
		this.data.frame = this.data.self.find('> .frame');
		this.data.content = this.data.self.find('> .content');
		this.data.plus = this.data.self.find('> .frame .plus');
		this.data.frameHeight = this.data.frame.height() + 8;
		this.data.contentHeight = this.data.content.height();
		this.data.nextEntry = this.data.self.next('li.entry');
		this.data.vOffset = this.data.nextEntry.length ? parseInt(this.data.nextEntry.css('marginTop')) : 0;
		this.data.content.css({height: 0});
	}).hover(function(e) {
		if ( ! Rising.isDesktop() ) return; // Effect only available on Desktop
		var t = 250;
		with(this.data) {
			switch (e.type) {
				case 'mouseenter':
					content.stop().animate({height: contentHeight+'px'}, t, 'easeOutExpo');
					plus.stop().animate({bottom: -contentHeight}, t, 'easeOutExpo');
					if ( nextEntry.length ) nextEntry.stop().animate({marginTop: contentHeight+vOffset+'px'}, t, 'easeOutExpo');
					break;
				case 'mouseleave':
					content.stop().animate({height: 0}, t, 'easeOutExpo');
					plus.stop().animate({bottom: 0}, t, 'easeOutExpo');
					if ( nextEntry.length ) nextEntry.stop().animate({marginTop: 0+vOffset+'px'}, t, 'easeOutExpo');
					break;
			}
		}
	});

	$('#portfolio .column-grid.special ul.column li.entry .content').each(function() {
		var frame = $(this).prev('.frame');
		this.data = frame.get(0).data;
	}).hover(function(e) {
		with (this.data) {
			switch (e.type) {
				case 'mouseenter':
					if ( html.hasClass('opacity') && overlay.length ) overlay.stop().animate({opacity: 1}, t1); // Color Overlay
					if ( frameHover ) self.stop().animate({borderTopColor:c, borderRightColor:c, borderBottomColor:c, borderLeftColor:c}, t2); // Frame Color
					break;
				case 'mouseleave':
					if ( html.hasClass('opacity') && overlay.length ) overlay.stop().animate({opacity: 0}, t1); // Color Overlay
					if ( frameHover ) self.stop().animate({borderTopColor:bc, borderRightColor:bc, borderBottomColor:bc, borderLeftColor:bc}, t2); // Frame Color
					break;
			}
		}
	});

	// Post Image hover animations

	$('.opacity .post > header .post-img span.overlay').each(function() {
		this.data = {};
		this.data.self = $(this);
	}).hover(function(e) {
		with (this.data) {
			switch (e.type) {
				case 'mouseenter':
					self.stop().animate({opacity: 1}, 250);
					break;
				case 'mouseleave':
					self.stop().animate({opacity: 0}, 250)
					break;
			}
		}
	});

	// Comment Animations & Effects

	$('.opacity ol.commentlist li .reply a.comment-reply-link').each(function() {
		this.data = {};
		this.data.self = $(this);
		this.data.opacity = parseFloat(this.data.self.css('opacity'));
		this.data.fgColor = this.data.self.css('color');
	}).hover(function(e) {
		with (this.data) {
			switch (e.type) {
				case 'mouseenter':
					self.stop().animate({opacity: 1, color: '#eb5426'}, 200);
					break;
				case 'mouseleave':
					self.stop().animate({opacity: opacity, color: fgColor});
					break;
			}
		}
	});

}

function ui_events() {

	navSearch = navSection.find('form');

	var navSearchBusy = false,
		navSearchButton = navSection.find('> a.button.search'),
		navSearchInput = navSearch.find('input:text');

	// Nav Search Show
	navSearchButton.click(function() {
		if ( navSearchActive ) return
		else {
			navSearchActive = true;
			navSearch.css({opacity: 0, visibility: 'visible'}).animate({opacity: 1}, 190, function() {
				navSearchBusy = false;
			});
		}
	});

	// Nav Search Hide
	navSearch.find('span.close').click(function() {
		if ( navSearchBusy ) return
		else {
			navSearchBusy = true;
			navSearchButton.find('span').animate({opacity: 0}, 190);
			navSearch.animate({opacity: 0}, 190, function() {
				navSearch.css('visibility', 'hidden');
				navSearchBusy = navSearchActive = false;
			});
		}
	});

	// Nav Search Input focus/blur
	navSearchInput.each(function() {
		this.data = {};
		this.data.self = $(this);
		this.data.label = this.data.self.val();
	}).focus(function() {
		with (this.data) { if ( self.val() == label ) self.val(''); }
	}).blur(function() {
		with (this.data) { if ( $.trim(self.val()) == '' ) self.val(label); }
	});

	// Dismiss Button
	$('span[data-action=dismiss]').each(function() {
		this.data = {};
		this.data.self = $(this);
		this.data.parent = this.data.self.parent();
	}).live('click', function() {
		with (this.data) {
			if ( html.hasClass('opacity') ) parent.stop().animate({opacity: 0}, 250, function() { setTimeout(function() { parent.remove(); }, 0); });
			else parent.remove();
		}
	});

	// Add form.special data (required for validation)
	$('form.special input, form.special textarea').each(function() {
			this.data = {};
			this.data.self = $(this);
			var val = this.data.self.val();
			this.data.label = (val && val.length) ? val : null;
			this.data.required = this.data.self.attr('aria-required') == 'true';
	});

	// Use HTML5 Native Form Inputs on browsers that support them
	if ( Rising.isAppleDevice() || $.browser.safari ) { // Add browser tests here
		var formSpecial = $('form.special, form[role=search]');
		formSpecial.find('input:text').each(function() {
			this.data.self.attr('placeholder', this.data.self.attr('value')).attr('value', '').focus().blur();
		});
	} else {
		// Special form focus & blur
		$('form.special input, form.special textarea').focus(function() {
			with (this.data) {
				console.log('focusing');
				if ( label && self.val() == label) self.val('');
				else return;
			}
		}).blur(function() {
			with (this.data) {
				if ( label && self.val().length == 0 ) self.val(label)
				else return;
			}
		});
	}

}

function ui_scrollable() {

	$('section.scrollable').each(function() {
		var self = $(this),
			articles = self.find('> .scroller > .column-grid > .entry');

		if ( articles.length == 0 ) return;

		var grid = self.find('> .scroller > .column-grid'),
			columns = parseInt(grid.attr('class').match(/cols-\d/)[0].replace('cols-','')),
			pages = Math.ceil(articles.length / columns);

		if ( pages == 1 ) return;

		var	controls = self.find('> ul.common-scroller-controls'),
			scroller = self.find('> .scroller');

		// Create controls
		var i, html = '';
		for (var i=0; i < pages; i++) { html += _.sprintf('<li rel="%d"></li>', i); }
		controls.append(html);
		controls.find('> li:first-child').addClass('active');

		// Controls click event
		var busy = false;
		controls.find('li').each(function() {
			this.data = {};
			this.data.self = $(this);
			this.data.rel = parseInt(this.data.self.attr('rel'));
			this.data.offset = 21;
		}).click(function(e) {
			with (this.data) {
				if ( self.hasClass('active') ) return;
				if ( busy ) return; else busy = true;
				self.addClass('active').siblings('.active').removeClass('active');
				grid.stop().animate({marginLeft: -(rel*wrap.width())-(rel*offset)+'px'}, 750, 'easeInOutExpo', function() { busy = false; });
			}
		});
	});

}

function ui_lightbox() {

	/*
		Fancybox API: http://fancybox.net/api

		Video URL formats for href's:
		  - Youtube: http://www.youtube.com/v/{VIDEO-ID}
		  - Vimeo: http://vimeo.com/moogaloop.swf?clip_id={VIDEO-ID}

		HTML Element attribute triggers for lightbox:
		  - Video:  data-lightbox="video"
		  - Images: data-lightbox="image"
	 */

	var imgOptions = {
		speedIn: 470,
		titleShow: false,
		transitionIn: 'elastic',
		easingIn: 'easeInOutExpo',
		overlayColor: Rising.colors.lightboxBg,
		overlayOpacity: 0.8,
		speedOut: 150,
		transitionOut: 'fade'
	}

	var swfOptions = {
		speedIn: 400,
		titleShow: false,
		transitionIn: 'elastic',
		easingIn: 'easeOutQuad',
		speedOut: 0,
		transitionOut: 'none',
		overlayColor: Rising.colors.lightboxBg,
		overlayOpacity: 0.8,
		width: 800,
		height: 460,
		type: 'swf',
		swf: {'allowfullscreen':'true'}
	}

	$("a[data-lightbox^='image']").fancybox(imgOptions);
	$("a[data-lightbox^='video']").fancybox(swfOptions);
}
function ui_syntax_highlight() {

	/* SHJS Api: http://shjs.sourceforge.net/ */

	var theme;
	switch (Rising.theme) {
		case 'default':  theme = 'ide-devcpp'; break;
		case 'dark': theme = 'darkblue'; break;
	}

	var	classes = ['core/js/libs/sh_main.min.js'],
		shRegex = /^sh_(.*?)/;

	$('.post pre').each(function() {
		var self = $(this),
			_class = self.attr('class');
		if ( shRegex.test(_class) ) {
			classes.push('http://shjs.sourceforge.net/lang/'+_class+'.min.js');
		}
	});

	classes = _.uniq(classes);

	if ( classes.length == 1 ) return
	else {
		$('head').append(_.sprintf('<link rel="stylesheet" href="http://shjs.sourceforge.net/css/sh_%s.min.css" />', theme));
		classes.push(function() { sh_highlightDocument(); });
		head.js.apply(window, classes);
	}

	$('.post pre').css('backgroundColor', Rising.colors.sourceCodeBg);

}

function ui_shortcodes() {
	$('ul.sc-tabs').each(function() {
		var self = $(this),
			tabs = self.find('> li.tab'),
			nav = $('<li class="nav clearfix"></li>');
		tabs.each(function(i) {
			var title = $(this).attr('rel', i).prev('li.title');
			nav.append(_.sprintf('<span rel="%d">%s</span>', i, title.text()));
			title.remove();
		});
		nav.find(':first').addClass('active');
		nav.prependTo(self);
	}).find('li.nav > span').each(function() {
		this.data = {};
		this.data.self = $(this);
		this.data.rel = parseInt(this.data.self.attr('rel'));
	}).click(function() {
		with (this.data) {
			self.addClass('active').siblings('span').removeClass('active');
			self.parent().siblings('li.tab[rel='+rel+']').show().siblings('li.tab').hide();
		}
	});
}

})(jQuery);
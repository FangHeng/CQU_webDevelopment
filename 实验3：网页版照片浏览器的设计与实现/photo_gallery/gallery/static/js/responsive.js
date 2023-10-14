
/* Copyright (c) 2011 Ernesto Mendez <der-design.com> */

(function($) {

var wrap, _window, footerClear, accordionSlider, piecemaker, overlayDescs, portfolioSpecial;

$(document).ready(function() {

	wrap = $('#wrap'),
	_window = $(window);
	accordionSlider = $('#slider.accordion');
	piecemaker = $('#slider.piecemaker, object#slider');
	footerClear = $('footer[role=contentinfo] .column + .clear');
	overlayDescs = $('.frame .overlay-desc').each(function() { this.data = {self: $(this)}; });
	portfolioSpecial = $('#portfolio .column-grid.special');

	mobile_ui();
	responsive_events();

	if ( Rising.ie.is_ie() ) { $('.frame img').wrap('<div class="frame-inner"></div>'); }

});

function mobile_ui() {

	// Add Mobile navigation
	var nav = $('header nav[role=navigation]'),
		select = $('<select id="mobile-navigation"></select>'),
		navUl = nav.find('> ul'),
		navItems = navUl.find('> li'),
		menuItems = [];

	if ( Rising.ie.is(8) ) {
		// For some reason optgroups don't work on IE8
		var html = '',
			link, links = navUl.find('a');
		links.each(function(i) {
			link = $(links[i]);
			html += _.sprintf('<option value="%s">%s</option>', link.attr('href'), link.html());
		});
	} else {
		var html = navUl.html()
			.replace(/(alt|title|class|id)(\s+)?\=(\s+)?(\'|\")(.*?)(\'|\")/g, '')
			.replace(/href/g, 'value')
			.replace(/<(\/)?ul>/g,'<$1optgroup>')
			.replace(/<li(\s)?>(\s+)?<a|<a/g, '<option')
			.replace(/(<\/a\>)?<\/li>/g, '</option>')
			.replace(/<\/a>/g,'')
			.replace(/[ ]+/g,' ');
	}

	select.html(html).change(function() { window.location = $(this).attr('value'); });
	select.find('optgroup').attr('label', '- menu -').append('<option value="#"></option>');
	var active = navUl.find('> li.current-menu-item > a, > li.current_page_item > a').attr('href');
	select.find('option').each(function() {
		var self = $(this);
		if ( self.attr('value') == active ) {
			self.attr('selected', 'true');
			return false;
		}
	});

	nav.before(select);

	// Replace common-scroller-controls with mobile controls
	var scrollerControls = $('#home ul.common-scroller-controls'),
		mobileControls = '<ul class="mobile-scroller-controls"><li class="prev"></li><li class="next"></li></ul>';
	scrollerControls.before(mobileControls)

	mobileControls = $('#home ul.mobile-scroller-controls').data('rel', 0);

	$('#home ul.mobile-scroller-controls li').each(function() {
		this.data = {self: $(this)};
		this.data.incr = this.data.self.hasClass('next') ? 1 : -1;
		this.data.parent = this.data.self.parent();
		this.data.parent.data('busy', false);
		this.data.grid = this.data.parent.siblings('.scroller').find('.column-grid');
		this.data.total = this.data.grid.children('.entry').length;
	}).click(function() {
		with (this.data) {
			if ( parent.data('busy') ) return; else parent.data('busy', true);
			var offset, totalScrolls, w = wrap.width();

			switch (w) {
				case 420:
					offset = 21;
					totalScrolls = total;
					break;
				case 708:
					offset = 30;
					totalScrolls = Math.ceil(total/2.0);
					break;
			}

			if ( w != parent.data('cw') ) parent.data('rel', 0); // Reset rel value if screen size has changed

			var rel = Rising.cycle(incr, parent.data('rel'), totalScrolls);

			grid.stop().animate({marginLeft: -(rel*w)-(rel*offset)+'px'}, 750, 'easeInOutExpo', function() { parent.data('busy', false); });
			parent.data('rel', rel);
			parent.data('cw', w);
		}
	});

	// Add placeholder images for mobile devices
	$('#portfolio-one article').each(function(i) {
		var images = Rising.sliderData[i];
		if ( images.length ) {
			$(this).find('aside.slider').append(_.sprintf('<img class="placeholder" width="420" src="%s" />', images[0]));
		}
	});

	// Portfolio Special Column adjustments
	var column, AllColumns = portfolioSpecial.find('.column');
	portfolioSpecial.data('Allcolumns', AllColumns)
	AllColumns.each(function(i) {
		column = $(AllColumns[i]);
		column.attr('id', 'col-'+i);
		column.find('.entry').attr('rel', i);
	});

}

function responsive_events() {

	var homepageGrids = $('#home section .column-grid'),
		homepageControls = $('#home ul.common-scroller-controls li:first-child');


	var w, cw = wrap.width();
	_window.resize(function() {

		w = wrap.width();

		adjustHeader();

		if ( w == cw ) return; // Layout hasn't changed, do nothing...

		adjustOverlayDescs();
		adjustPortfolio();
		adjustFooter();

		adjustAccordionSlider();
		adjustPiecemaker();

		if ( homepageGrids.length ) {
			homepageGrids.css('marginLeft', 0); // Reset position of column grid
			homepageControls.addClass('active').siblings('.active').removeClass('active');
		}

		cw = w; // update current width

	});

	adjustHeader();
	adjustOverlayDescs();
	adjustPortfolio();
	adjustFooter();

}

function adjustHeader() {
	if ( body.width() >= 1008 ) wrap.css('overflow', 'visible'); else wrap.css('overflow', 'hidden');
}

function adjustAccordionSlider() {
	if ( accordionSlider.width() != accordionSlider.data('width') ) {
		var slides = accordionSlider.find('ul.slides');
		slides.html('');
		Rising.slideshow();
	}

}

function adjustPiecemaker() {
	if ( piecemaker.length ) {
		Rising.slider.reload();
	}
}

function adjustOverlayDescs() {
	if ( Rising.isMobile480() ) {
		overlayDescs.each(function() { this.data.self.css('bottom', '0'); });
	} else if ( Rising.isMobile768() || Rising.isDesktop() ) {
		overlayDescs.each(function() { this.data.self.css('bottom', -(this.data.self.height()+13)+'px'); })
	}
}

function adjustPortfolio() {
	if ( portfolioSpecial.length == 0 ) return;
	if ( Rising.isMobile768() ) {
		$('#col-1, #col-2, #col-3').hide().children().appendTo('#col-0');
		$('#col-0').children(':nth-child(2n)').after('<li class="clear"></li>');
	} else if ( Rising.isDesktop() ) {
		$('#col-1, #col-2, #col-3').show();
		$('#col-0 li.entry[rel=1]').appendTo('#col-1');
		$('#col-0 li.entry[rel=2]').appendTo('#col-2');
		$('#col-0 li.entry[rel=3]').appendTo('#col-3');
		$('#col-0 li.clear').remove();
	}
}

function adjustFooter() {
	if ( Rising.isDesktop() ) footerClear.hide();
	else if ( Rising.isMobile768() ) footerClear.show();
	else if ( Rising.isMobile480() ) footerClear.show();
}

})(jQuery)
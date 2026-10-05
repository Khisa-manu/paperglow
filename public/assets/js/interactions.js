/**
 * Creative Agency: the sticky header, figures that count up, and the video popup.
 *
 * These are the three things the design does when you scroll or click. All of
 * them are enhancements: without this file the header stays at the top of the
 * page, every figure shows its final value and the play button is a link to
 * the video.
 *
 * Counting is skipped for a visitor who asks the system for reduced motion,
 * and a site owner can switch it off with the
 * `creative_agency_enable_scroll_animations` filter. The header can be kept
 * in place with `creative_agency_sticky_header`.
 */
( function () {
	'use strict';

	var settings = window.creativeAgencyMotion || {};
	var reduced = window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	var motion = settings.enabled !== false && ! reduced && 'IntersectionObserver' in window;

	/*
	 * The header scrolls away with the page and comes back, black, once the
	 * visitor is 400px down — the design's own threshold. It is taken out of
	 * the flow only then, and the template part keeps its height, so nothing
	 * under it jumps.
	 */
	function stickyHeader() {
		var header = document.querySelector( '.creative-agency-header' );
		if ( ! header || settings.sticky === false ) {
			return;
		}

		var holder = header.closest( 'header' ) || header.parentElement;
		var stuck = false;
		var ticking = false;

		function update() {
			ticking = false;
			var next = window.scrollY > 400;
			if ( next === stuck ) {
				return;
			}
			stuck = next;
			if ( stuck ) {
				holder.style.minHeight = header.offsetHeight + 'px';
			}
			header.classList.toggle( 'is-stuck', stuck );
			if ( ! stuck ) {
				holder.style.minHeight = '';
			}
		}

		window.addEventListener( 'scroll', function () {
			if ( ! ticking ) {
				ticking = true;
				window.requestAnimationFrame( update );
			}
		}, { passive: true } );
		update();
	}

	function belowTheFold( el ) {
		return el.getBoundingClientRect().top > window.innerHeight * 0.92;
	}

	function counters() {
		if ( ! motion ) {
			return;
		}

		Array.prototype.forEach.call( document.querySelectorAll( '.creative-agency-count' ), function ( el ) {
			var text = el.textContent.trim();
			var parts = text.match( /^(\D*)([\d.,]+)(\D*)$/ );

			// A figure already on screen keeps its value rather than dropping to 0.
			if ( ! parts || ! belowTheFold( el ) ) {
				return;
			}

			var target = parseFloat( parts[ 2 ].replace( /,/g, '' ) );
			if ( ! isFinite( target ) ) {
				return;
			}

			var grouped = parts[ 2 ].indexOf( ',' ) !== -1;
			var decimals = ( parts[ 2 ].split( '.' )[ 1 ] || '' ).length;

			function format( value ) {
				var number = grouped
					? value.toLocaleString( 'en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals } )
					: value.toFixed( decimals );
				return parts[ 1 ] + number + parts[ 3 ];
			}

			// Screen readers get the real figure, not every step on the way to it.
			el.setAttribute( 'aria-label', text );
			el.textContent = format( 0 );

			var observer = new IntersectionObserver( function ( entries ) {
				if ( ! entries[ 0 ].isIntersecting ) {
					return;
				}
				observer.disconnect();

				var start = null;
				var duration = 1600;

				function step( now ) {
					if ( null === start ) {
						start = now;
					}
					var progress = Math.min( ( now - start ) / duration, 1 );
					var eased = 1 - Math.pow( 1 - progress, 3 );
					el.textContent = progress < 1 ? format( target * eased ) : text;
					if ( progress < 1 ) {
						window.requestAnimationFrame( step );
					}
				}

				window.requestAnimationFrame( step );
			}, { threshold: 0.4 } );

			observer.observe( el );
		} );
	}

	function youtubeId( url ) {
		var match = url.match( /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/ );
		return match ? match[ 1 ] : null;
	}

	function video() {
		var links = document.querySelectorAll( '.creative-agency-video a[href]' );
		if ( ! links.length || 'undefined' === typeof window.HTMLDialogElement ) {
			return;
		}

		var dialog = null;
		var frame = null;

		function build() {
			dialog = document.createElement( 'dialog' );
			dialog.className = 'creative-agency-video-dialog';
			dialog.setAttribute( 'aria-label', settings.videoLabel || 'Video' );

			var close = document.createElement( 'button' );
			close.type = 'button';
			close.className = 'creative-agency-video-dialog__close';
			close.setAttribute( 'aria-label', settings.closeLabel || 'Close video' );
			close.textContent = '×';
			close.addEventListener( 'click', function () {
				dialog.close();
			} );

			frame = document.createElement( 'iframe' );
			frame.title = settings.videoLabel || 'Video';
			frame.setAttribute( 'allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen' );
			frame.setAttribute( 'allowfullscreen', '' );

			dialog.appendChild( close );
			dialog.appendChild( frame );

			// A click on the backdrop lands on the dialog itself, never on its contents.
			dialog.addEventListener( 'click', function ( event ) {
				if ( event.target === dialog ) {
					dialog.close();
				}
			} );

			// However it closes — button, backdrop or Escape — the video stops.
			dialog.addEventListener( 'close', function () {
				frame.src = 'about:blank';
			} );

			document.body.appendChild( dialog );
		}

		Array.prototype.forEach.call( links, function ( link ) {
			var id = youtubeId( link.href );
			if ( ! id ) {
				return;
			}
			link.addEventListener( 'click', function ( event ) {
				event.preventDefault();
				if ( ! dialog ) {
					build();
				}
				frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
				dialog.showModal();
			} );
		} );
	}

	function init() {
		stickyHeader();
		counters();
		video();
	}

	if ( 'loading' === document.readyState ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
}() );

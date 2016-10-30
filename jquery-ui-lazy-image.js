/*!
 * Image lazy loading based on jQuery UI Widget and Waypoints
 * Author: office@slicemenice.de
 * Licensed under the MIT license
 *
 *  Requires UI version 1.9+
 */

( function( $, window, document, undefined ) {

	$.widget( 'smn.lazyImage', {

		options: {},

		_create: function() {
			var widget = this;

			widget._trigger( 'willBeInitialized' );

			widget._verticalWaypoint = new Waypoint.Inview( {
				element: widget.element[ 0 ],
				horizontal: false,
				enter: function() {
					if ( !widget.element.is( ':visible' ) ) {
						return;
					}

					widget._isInViewVertically = true;

					if ( widget._isInViewVertically && widget._isInViewHorizontally ) {
						widget._inViewHandler();
						widget._destroyWaypoints();
					}
				},
				exit: function() {
					widget._isInViewVertically = false;
				}
			} );

			widget._horizontalWaypoint = new Waypoint.Inview( {
				element: widget.element[ 0 ],
				horizontal: true,
				enter: function() {
					if ( !widget.element.is( ':visible' ) ) {
						return;
					}

					widget._isInViewHorizontally = true;

					if ( widget._isInViewVertically && widget._isInViewHorizontally ) {
						widget._inViewHandler();
						widget._destroyWaypoints();
					}
				},
				exit: function() {
					widget._isInViewHorizontally = false;
				}
			} );

			widget._trigger( 'hasBeenInitialized' );
		},

		_destroyWaypoints: function() {
			var widget = this;

			if ( widget._horizontalWaypoint ) {
				widget._horizontalWaypoint.destroy();
				widget._horizontalWaypoint = null;
			}

			if ( widget._verticalWaypoint ) {
				widget._verticalWaypoint.destroy();
				widget._verticalWaypoint = null;
			}
		},

		_inViewHandler: function() {
			var widget = this;

			var imageUrl = widget.element.data( 'lazyImage' );

			if ( imageUrl ) {
				$( '<img />' )
					.one( 'load', function() {
						widget.element.hide();

						if ( widget.element.is( 'img' ) ) {
							widget.element.attr( 'src', imageUrl );
						} else {
							widget.element.css( 'background-image', 'url(' + imageUrl + ')' );
						}

						widget.element.fadeIn();
					} )
					.attr( 'src', imageUrl );
			}
		},

		_destroy: function() {
			var widget = this;
			
			widget._trigger( 'willBeDestroyed' );

			widget._destroyWaypoints();

			widget._trigger( 'hasBeenDestroyed' );
		}

	} );

} )( jQuery, window, document );

/*!
 * Image lazy loading based on jQuery UI Widget and Waypoints
 * Author: office@slicemenice.de
 * Licensed under the MIT license
 *
 *  Requires UI version 1.9+
 */

( function( $, window, document, undefined ) {

	$.widget( 'smn.lazyImage', {

		options: {
			offset: 0.5
		},

		_create: function() {
			var widget = this;

			widget._trigger( 'onWillBeInitialized' );

			widget.waypoints = [];
			widget._createWaypoints();

			widget._trigger( 'onHasBeenInitialized' );
		},

		_createWaypoint: function( config ) {
			var widget = this;

			widget.waypoints.push( new Waypoint( {
				context: window,
				element: widget.element[ 0 ],
				offset: config.offset,
				horizontal: config.horizontal,
				handler: ( function( config ) {
					return function( direction ) {
						widget[ config[ direction ] ].call( widget, direction );
					};
				} )( config )
			} ) );
		},

		_createWaypoints: function() {
			var widget = this;

			var configs = [
				{
					down: '_onEnterVertically',
					up: '_onExitedVertically',
					offset: function() {
						return this.context.innerHeight() * ( 1 + widget.options.offset )
					},
					horizontal: false
				},
				{
					down: '_onExitedVertically',
					up: '_onEnterVertically',
					offset: function() {
						return - ( this.adapter.outerHeight() + this.context.innerHeight() * widget.options.offset )
					},
					horizontal: false
				},
				{
					right: '_onEnterHorizontally',
					left: '_onExitedHorizontally',
					offset: function() {
						return this.context.innerWidth() * ( 1 + widget.options.offset );
					},
					horizontal: true
				},
				{
					right: '_onExitedHorizontally',
					left: '_onEnterHorizontally',
					offset: function() {
						return - ( this.adapter.outerWidth() + this.context.innerWidth() * widget.options.offset );
					},
					horizontal: true
				}
			];

			configs.map( function( config ) {
				widget._createWaypoint( config );
			} );
		},

		_destroy: function() {
			var widget = this;

			widget._trigger( 'onWillBeDestroyed' );
			widget._destroyWaypoints();
			widget._trigger( 'onHasBeenDestroyed' );
		},

		_destroyWaypoints: function() {
			var widget = this;

			if ( widget.waypoints && Array.isArray( widget.waypoints ) ) {
				for ( var i = 0, end = widget.waypoints.length; i < end; i++ ) {
					widget.waypoints[ i ].destroy();
				}

				widget.waypoints = [];
			}
		},

		_inViewHandler: function() {
			var widget = this;

			var imageUrl = widget.element.data( 'lazyImage' );

			if ( imageUrl ) {
				widget._trigger( 'onImageInViewport', null, [ widget, imageUrl ] );

				$( '<img />' )
					.one( 'load', function() {
						widget._trigger( 'onImageLoaded', null, [ widget, imageUrl ] );
					} )
					.one( 'error', function() {
						widget._trigger( 'onImageFailedToLoad', null, [ widget, imageUrl ] );
					} )
					.attr( 'src', imageUrl );
			}
		},

		_onEnterHorizontally: function() {
			var widget = this;

			if ( !widget.element.is( ':visible' ) ) {
				return;
			}

			widget._isInViewHorizontally = true;

			if ( widget._isInViewVertically && widget._isInViewHorizontally ) {
				widget._inViewHandler();
				widget._destroyWaypoints();
			}
		},

		_onEnterVertically: function() {
			var widget = this;

			if ( !widget.element.is( ':visible' ) ) {
				return;
			}

			widget._isInViewVertically = true;

			if ( widget._isInViewVertically && widget._isInViewHorizontally ) {
				widget._inViewHandler();
				widget._destroyWaypoints();
			}
		},

		_onExitedHorizontally: function() {
			var widget = this;
			widget._isInViewHorizontally = false;
		},

		_onExitedVertically: function() {
			var widget = this;
			widget._isInViewVertically = false;
		}

	} );

} )( jQuery, window, document );

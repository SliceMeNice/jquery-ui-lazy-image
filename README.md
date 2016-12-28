# jQuery UI Lazy Image

## How to Use

```
$( '.lazyImage' ).each( function() {
	var $lazyImage = $( this );

	if ( !$lazyImage.data( 'smnLazyImage' ) ) {
		$lazyImage.lazyImage( {
			onImageInViewport: function( event, widget, imageUrl ) {
				// can be used to show some loading indicator
				widget.element.addClass( 'loading' );
			},
			onImageLoaded: function( event, widget, imageUrl ) {
				widget.element.hide();

				if ( widget.element.is( 'img' ) ) {
					widget.element.attr( 'src', imageUrl );
				} else {
					widget.element.css( 'background-image', 'url(' + imageUrl + ')' );
				}

				widget.element.removeClass( 'loading' );
				widget.element.addClass( 'loaded' );
				widget.element.show();
			},
			onImageFailedToLoad: function( event, widget, imageUrl ) {
				widget.element.removeClass( 'loading' );
				widget.element.addClass( 'failedToLoad' );
			}
		} );
	}
} );
```

## Release History

__2.0.0__

  * Removed dependency to Waypoint's Inview shortcut by integrating the configuration and initialization of required Waypoints into this lazy-image widget.
  * Replaced the built-in image loaded event handler with just a trigger of a custom onImageLoaded event that can be defined via the widget's settings.

__1.0.1__

  * Moved out-of-viewport handlers from exit event to exited event.

__1.0.0__

  * Added basic component.
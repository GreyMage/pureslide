pureslide
=========

This code is intended for personal use, however if you find it useful, please consider donating!

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2V9VFPX38V3A2)

jquery-based slideshow.

Example Implementation:

	$('#slideshow').pureslide({
		images:[
			'<img src="image.png" width="600" height="400" />',
			'<img src="image.png" width="600" height="400" />',
			'<img src="image.png" width="600" height="400" />',
			'<img src="image.png" width="600" height="400" />',
		],
		maxX:670,
		prevArrow:"go-previous.png",
		nextArrow:"go-next.png",
		autoMillis:5000,
		stopAutoOnClick:true,
		pauseAutoOnHover:true
	});
	
---
Parameters
==========

images
------

An array of full html image tags, including width and height attributes.
maxX and maxY
-------------

The maximum size the slideshow will size to, regardless of the size of any inner images. 0 default, 0 disable.
prevArrow and nextArrow
-------------

Path to images to use for the scroll arrows. "go-previous.png" and "go-next.png" default.
autoMillis
-------------

Amount of time in milliseconds before the slideshow will progress on its own. 0 default, 0 disable.
stopAutoOnClick
-------------

If set to true, then clicking manually to move the slideshow will turn off automatic advancement afterwards. defaults to false.
pauseAutoOnHover
-------------

If set to true, then hovering the mouse over an image in the slideshow will prevent it from progressing automatically, and will resume when no longer hovered. defaults to false.
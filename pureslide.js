/**
 * @author Eric Cutler
 * v. 1.2
 */
jQuery.fn.pureslide = function(options) {
	
	var settings = $.extend({
		// These are the defaults.
		maxY: 0,
		maxX: 0,
		images: [],
		prevArrow: 'go-previous.png',
		nextArrow: 'go-next.png',
		allowSlide:true,
		allowDrag:true,
		dragTolerance:100,
		autoMillis: 0,
		fitparent: false,
		stopAutoOnClick: false,
		pauseAutoOnHover: false
	}, options );

	return this.each(function(){
		var mySlide = {}
		mySlide.images = [];
		
		for(var x in settings.images){ // Parse em.
			var t = $(settings.images[x]);
			mySlide.images.push(t);
		}
		
		mySlide.wrap = $(this);

		if(settings.fitparent){
			settings.maxY = mySlide.wrap.parent().height();
			settings.maxX = mySlide.wrap.parent().width();
		}
		
		mySlide.root = $('<div/>').addClass('inner').appendTo(mySlide.wrap);
		mySlide.prevButton = $('<div/>').addClass('prevBtn').appendTo(mySlide.wrap);
		mySlide.nextButton = $('<div/>').addClass('nextBtn').appendTo(mySlide.wrap);
		mySlide.frames = [];
		mySlide.atFrame = 0;
		mySlide.autoPause = false;
		mySlide.bigX = 0;
		mySlide.bigY = 0;
		mySlide.maxY = settings.maxY;
		mySlide.maxX = settings.maxX;
		
		// Discover max sizes.
		for(i in mySlide.images){
		
			mySlide.images[i].cw = mySlide.images[i].attr("width");
			mySlide.images[i].ch = mySlide.images[i].attr("height");
		
			if(mySlide.images[i].cw > mySlide.bigX) mySlide.bigX = mySlide.images[i].cw;
			if(mySlide.images[i].ch > mySlide.bigY) mySlide.bigY = mySlide.images[i].ch;
		}

		// Adjust for scale
		mySlide.imgScale = 1;
		if(typeof mySlide.maxY == "undefined"){ mySlide.maxY = 0; }	//get Y ratio
		if(typeof mySlide.maxX == "undefined"){	mySlide.maxX = 0; } //get X ratio
		if(
			(mySlide.bigX > mySlide.maxX && mySlide.maxX > 0) || 
			(mySlide.bigY > mySlide.maxY && mySlide.maxY > 0)
		){
			mySlide.yScale = mySlide.maxY / mySlide.bigY;
			mySlide.xScale = mySlide.maxX / mySlide.bigX;
			/*if(mySlide.yScale == 0) {
				mySlide.imgScale = mySlide.xScale;
			} else if(mySlide.xScale == 0) {
				mySlide.imgScale = mySlide.yScale;
			} else {
				if( mySlide.xScale > mySlide.yScale ){
					mySlide.imgScale = mySlide.xScale;
				} else {
					mySlide.imgScale = mySlide.yScale;
				}
			}*/
			mySlide.bigX = Math.ceil(mySlide.bigX * mySlide.xScale);
			mySlide.bigY = Math.ceil(mySlide.bigY * mySlide.yScale);
		}

		// Create Frames
		for(i in mySlide.images){
			var x = $('<div/>').addClass("frame");
			mySlide.frames.push(x);
			//mySlide.images[i].appendTo(x);
			x.css("background-image","url("+mySlide.images[i].attr("src")+")").css({
				backgroundPosition: "center center",
				backgroundRepeat: "no-repeat",
				float: "left"
			});
			
			// v3 Works for any image, does not resize ones smaller than the frame.
			if(mySlide.images[i].cw > mySlide.bigX || mySlide.images[i].ch > mySlide.bigY){
				var viewAR = mySlide.bigX / mySlide.bigY;
				var myAR = mySlide.images[i].cw / mySlide.images[i].ch;
				if(myAR > viewAR){
					x.css("background-size","100% auto");
				} else {
					x.css("background-size","auto 100%");
				}
			}
			
			x.appendTo(mySlide.root);
		}

		// Prepare buttons
		mySlide.prevButton.css({
			height: "100%",
			left: "0",
			position: "absolute",
			top: "0",
			width: "10%",
			cursor:"pointer",
			background: "url("+settings.prevArrow+") no-repeat 50%"
		});

		mySlide.nextButton.css({
			height: "100%",
			right: "0",
			position: "absolute",
			top: "0",
			width: "10%",
			cursor:"pointer",
			background: "url("+settings.nextArrow+") no-repeat 50%"
		});

		fIn = function(){$(this).css({backgroundPosition:"55% 50%"})}
		fIn2 = function(){$(this).css({backgroundPosition:"45% 50%"})}
		fOut = function(){$(this).css({backgroundPosition:"50% 50%"})}

		mySlide.prevButton.hover(fIn2,fOut);
		mySlide.nextButton.hover(fIn,fOut);
		
		mySlide.ready = function(){mySlide.isReady = true;}
		mySlide.unready = function(){mySlide.isReady = false;}

		mySlide.showNext = function(){
			if(mySlide.isReady){
				mySlide.unready();
				
				if(++mySlide.atFrame >= mySlide.frames.length){
					mySlide.atFrame = 0;
					mySlide.root.animate({
						left: "0"
					},1000,function(){
						mySlide.ready();
					});
				} else {
					mySlide.root.animate({
						left: "-="+mySlide.bigX
					},500,function(){
						mySlide.ready();
					});
				}
			}
		}

		mySlide.showPrev = function(){
			if(mySlide.isReady){
				mySlide.unready();
				if(--mySlide.atFrame < 0){
					mySlide.atFrame = mySlide.frames.length - 1;
					mySlide.root.animate({
						left: "-"+((mySlide.frames.length - 1) * mySlide.bigX)
					},1000,function(){
						mySlide.ready();
					});
				} else {
					mySlide.root.animate({
						left: "+="+mySlide.bigX
					},500,function(){
						mySlide.ready();
					});
				}
			}
		}

		mySlide.prevButton.click(function(){
			mySlide.showPrev();
			if(settings.stopAutoOnClick){
				clearInterval(mySlide.autoProgress);
			}
		});
		
		mySlide.nextButton.click(function(){
			mySlide.showNext();
			if(settings.stopAutoOnClick){
				clearInterval(mySlide.autoProgress);
			}
		});
		
		if(settings.allowSlide){
		
			mySlide.drag = {}
			mySlide.drag.start = function(x){
				mySlide.drag.dragging = true;
				mySlide.drag.initX = x;
				return this;
			}
			mySlide.drag.move = function(x){
				return this;
			}
			mySlide.drag.stop = function(x){
				if(mySlide.drag.dragging){
					mySlide.drag.dragging = false;
					if(Math.abs(x-mySlide.drag.initX) > settings.dragTolerance){
						if(x < mySlide.drag.initX){
							mySlide.showNext();
						} else {
							mySlide.showPrev();
						}
						if(settings.stopAutoOnClick){
							clearInterval(mySlide.autoProgress);
						}
					}
				}
				return this;
			}
		
			mySlide.root.on({ 'touchstart mousedown ' : function(e){ 
				var X = 0;
				if(e.type == "mousedown"){
					X = e.clientX;
				} else if(e.type == "touchstart"){
					X = e.originalEvent.touches[0].pageX;
				}	
				mySlide.drag.start(X);
				return false;
			}});
			
			mySlide.root.on({ 'touchmove mousemove ' : function(e){ 
				
				var X = 0;
				if(e.type == "mousemove"){
					X = e.clientX;
				} else if(e.type == "touchmove"){
					X = e.originalEvent.changedTouches[0].pageX;
				}			
				mySlide.drag.move(X);
				return false;
			}});
			
			$(window).on({ 'touchstop mouseup ' : function(e){ 		
				var X = 0;
				if(e.type == "mouseup"){
					X = e.clientX;
				} else if(e.type == "touchstop"){
					X = e.originalEvent.changedTouches[0].pageX;
				}				
				mySlide.drag.stop(X);
				return false;
			}});
		}

		$(mySlide.frames).each(function(){
			$(this).width(mySlide.bigX).height(mySlide.bigY);
		});
		mySlide.wrap.width(mySlide.bigX).height(mySlide.bigY);
		mySlide.wrap.css({
			overflow: "hidden",
			position: "relative"
		});
		mySlide.root.width(mySlide.bigX * mySlide.images.length);
		mySlide.root.css("position","relative");
		mySlide.root.children().first().show();
		mySlide.ready();
		
		if(settings.pauseAutoOnHover){
			mySlide.wrap.hover(function(){
				mySlide.autoPause = true;
			},function(){
				mySlide.autoPause = false;
			});
		}
		
		if(settings.autoMillis > 0){
			mySlide.autoProgress = setInterval(function(){
				if(!mySlide.autoPause) mySlide.showNext();
			},settings.autoMillis);
		}
	});
}
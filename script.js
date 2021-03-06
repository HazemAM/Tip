/* 
* Tip
* ---
*
* Version 1.1, 2017-12-15 
*
* (c) Copyright 2017 Hazem AbuMostafa.
* This project is subject to the Apache License, Version 2.0
* <http://apache.org/licenses/LICENSE-2.0.html>.
*/

var Tip = function(options){
	var self = this;

	options = options || {};
	
	self.elem  = self.getElement(options.id || 'tip');
	self.delay = options.delay || parseInt(self.elem.dataset.duration) || 3500;
	self.onClickMessage = options.onClickMessage || '';

	self.hover = false;
	self.visible = false; //The tip is currently visible to the user, or animating to disappear.
	self.prev  = null;  //Holding the original tip string while clicked.
	self.mode  = null;
	
	self.hideTimeoutId = null;
	self.killTimeoutId = null;
	
	//Listeners:
	self.elem.onmouseover = function(e){
		if(self.isHiddenOrKilled())
			return;
		
		self.hover = true;

		window.clearTimeout(self.hideTimeoutId);
		self.hideTimeoutId = null;
	};

	self.elem.onmouseout = function(e){
		if(self.isHiddenOrKilled())
			return;
		
		self.hover = false;
		self.hideTimeoutId = window.setTimeout(self.hide.bind(self), self.delay/2);

		if(self.isClicked()){
			self.elem.innerHTML = self.prev;
			self.elem.setAttribute('class','in-move');
			self.adjustPos();
			self.prev = null;
		}
	};

	//Only add on-click listener when there's actually something to do:
	if(self.onClickMessage){
		self.elem.onclick = function(e){
			if(!self.isClicked()){
				self.prev = self.elem.innerHTML;
				self.elem.innerHTML = self.onClickMessage;
				self.elem.setAttribute('class','in-move');
				self.adjustPos();
			}
		};
	}

	window.addEventListener('resize', function(e){
		//Stopping any in-move animations/transitions:
		self.elem.classList.remove('in-move');
		self.adjustPos();
	});
};

//Functions:
Tip.prototype.getElement = function(id){
	var exist = document.getElementById(id),
		theElem;
	
	if(exist)
		theElem = exist;
	else{
		theElem = document.createElement('div');
		theElem.id = id;
		document.body.appendChild(theElem);
	}
	
	theElem.setAttribute('class', 'killed');
	return theElem;
};

Tip.prototype.adjustPos = function(){
	var leftValue = (window.innerWidth/2) - (this.elem.offsetWidth/2);
	this.elem.style.left = leftValue.toString() + 'px';
};

Tip.prototype.hide = function(){
	this.elem.setAttribute('class','hidden');
	this.elem.style.opacity = '0';
	
	var duration = this.getCurrentAnimationDuration();
	this.killTimeoutId =  window.setTimeout(function(){
		this.visible = false;
		this.mode = null;
		this.elem.setAttribute('class', 'killed');
		this.elem.innerHTML = '';
	}.bind(this), duration);
};

/*
 * The main method. Shows a new tip to the user, and overrides
 * the previous tip if any.
*/
Tip.prototype.echo = function(text, mode, animateInAgain){
	if(this.isHiddenOrKilled())
		this.elem.setAttribute('class','shown');
	else{
		this.elem.setAttribute('class','in-move');
		if(animateInAgain !== false && text == this.elem.innerHTML){
			this.elem.setAttribute('class','in-again');
			var duration = this.getCurrentAnimationDuration();
			
			window.setTimeout(function(){
				this.elem.classList.remove('in-again');
			}.bind(this), duration);
		}
	}

	window.clearTimeout(this.hideTimeoutId);
	this.hideTimeoutId = null;

	window.clearTimeout(this.killTimeoutId);
	this.killTimeoutId = null;

	this.elem.innerHTML = text.toString();
	this.elem.style.opacity = '1';

	if(!this.hover)
		this.hideTimeoutId = window.setTimeout(this.hide.bind(this), this.delay);

	this.prev = null;
	this.mode = mode;
	this.visible = true;

	this.adjustPos();
};

/*
 * Force the tip to hide even if the timer isn't over yet.
*/
Tip.prototype.forceHide = function(){
	if(this.hideTimeoutId){
		window.clearTimeout(this.hideTimeoutId);
		this.hideTimeoutId = null;

		window.clearTimeout(this.killTimeoutId);
		this.killTimeoutId = null;

		this.hide();
	}
};

/*
 * Updates the tip text without renewing the timer.
 * Works best with `Tip.isVisible()`, for regularly updating
 * very-time-sensitive data while the tip is visible to the user.
*/
Tip.prototype.updateText = function(text){
	if(this.visible && !this.isClicked())
		this.elem.innerHTML = text.toString();
	else if(this.visible)
		this.prev = text;
	
	this.adjustPos();
};

Tip.prototype.getText = function(){
	return this.elem.innerHTML;
};

Tip.prototype.getMode = function(){
	return this.mode;
};

Tip.prototype.isVisible = function(){
	return this.visible;
};

/*
 * Returns the animation duration for the current class list
 * of the tip element. If there are multiple animations, it
 * returns the duration for the first one.
*/
Tip.prototype.getCurrentAnimationDuration = function(){
	var dur = window.getComputedStyle(this.elem).getPropertyValue('animation-duration');
	return parseFloat(dur) * 1000; //'0.2s' (string) => 2000 (number).
};

Tip.prototype.isClicked = function(){
	return this.prev != null;
};

Tip.prototype.isHiddenOrKilled = function(){
	return this.elem.classList.contains('hidden') ||
	       this.elem.classList.contains('killed');
};


/*
 * Module export
*/
if(typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
	module.exports = Tip;
} else if(typeof define === 'function' && define.amd){
	define(function(){
		return Tip;
	});
} else if(window){
	window.Tip = Tip;
}

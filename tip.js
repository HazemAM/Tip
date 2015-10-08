Tip = function(id, delay){
	var self = this;
	
	self.elem  = self.getElement(id ? id : 'tip');
	self.hover = false;
	self.delay = delay || parseInt(self.elem.dataset.duration) || 3500;
	self.shown = false; //The tip is currently shown to the user, or animating to disappear.
	self.prev  = null;  //Holding the original tip string while clicked.
	self.mode  = null;
	
	self.hideTimeoutId = null;
	self.killTimeoutId = null;
	
	//Listeners:
	self.elem.onmouseover = function(e){
		self.hover = true;
		window.clearTimeout(self.hideTimeoutId); self.hideTimeoutId=null;
	};

	self.elem.onmouseout = function(e){
		self.hover = false;
		self.hideTimeoutId = window.setTimeout(self.hide.bind(self), self.delay/2);

		if(self.isClicked()){	//Tip easter
			self.elem.innerHTML = self.prev;
			self.elem.setAttribute('class','in-move');
			self.adjustPos();
			self.prev = null;
		}
	};

	self.elem.onclick = function(e){
		if(!self.isClicked()){	//easter thing
			self.prev = self.elem.innerHTML;
			self.elem.innerHTML = 'Tips tell you what is happening here';
			self.elem.setAttribute('class','in-move');
			self.adjustPos();
		}
	};

	window.addEventListener('resize', function(e){
		self.elem.setAttribute('class','');
		self.adjustPos();
	});
}

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
	
	theElem.dir = 'auto';
	theElem.setAttribute('class', 'killed');
	return theElem;
}

Tip.prototype.adjustPos = function(){
	var leftValue = (window.innerWidth/2) - (this.elem.offsetWidth/2);
	this.elem.style.left = leftValue.toString() + 'px';
}

Tip.prototype.hide = function(){
	this.elem.setAttribute('class','fadeout');
	this.elem.style.opacity = '0';
	
	var duration = this.getCurrentAnimationDuration();
	this.killTimeoutId =  window.setTimeout(function(){
		this.shown = false;
		this.mode = null;
		this.elem.setAttribute('class', 'killed');
		this.elem.innerHTML = '';
	}.bind(this), duration);
}

/*
 * The main function. Shows a new tip to the user, and overrides
 * the previous tip if any.
*/
Tip.prototype.echo = function(text, mode){
	if(this.isHiddenOrKilled())
		this.elem.setAttribute('class','fadein');
	else{
		this.elem.setAttribute('class','in-move');
		if(text == this.elem.innerHTML){
			this.elem.setAttribute('class','in-again');
			var duration = this.getCurrentAnimationDuration();
			
			window.setTimeout(function(){
				this.elem.classList.remove('in-again');
			}.bind(this), duration);
		}
	}

	window.clearTimeout(this.hideTimeoutId); this.hideTimeoutId=null;
	window.clearTimeout(this.killTimeoutId); this.killTimeoutId=null;
	this.elem.innerHTML = text.toString();

	this.elem.style.opacity = '1';
	if(!this.hover)
		this.hideTimeoutId = window.setTimeout(this.hide.bind(this), this.delay);

	this.prev = null;
	this.mode = mode;
	this.shown = true;

	this.adjustPos();
}

/*
 * Force the tip to hide even if the timer isn't over yet.
*/
Tip.prototype.forceHide = function(){
	if(this.hideTimeoutId){
		window.clearTimeout(this.hideTimeoutId); this.hideTimeoutId=null;
		window.clearTimeout(this.killTimeoutId); this.killTimeoutId=null;
		this.hide();
	}
}

/*
 * Update the tip text without renewing the timer.
 * Works best with `Tip.shown`, for regularly updating
 * very-time-sensitive data while the tip is shown to the user.
*/
Tip.prototype.updateText = function(text){
	if(this.shown && !this.isClicked())
		this.elem.innerHTML = text.toString();
	else if(this.shown)
		this.prev = text;
}

Tip.prototype.getText = function(){
	return this.elem.innerHTML;
}

Tip.prototype.getMode = function(){
	return this.mode;
}

Tip.prototype.getCurrentAnimationDuration = function(){
	var dur = window.getComputedStyle(this.elem).getPropertyValue('animation-duration');
	return dur = parseFloat(dur) * 1000; //Converting from '0.2s' as string, to 2000 as number.
}

Tip.prototype.isClicked = function(){
	return this.prev != null;
}

Tip.prototype.isHiddenOrKilled = function(){
	var opacity = this.elem.style.opacity;
	return opacity == '0' || opacity == '';
}
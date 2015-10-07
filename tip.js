Tip = function(id, delay){
	var self = this;
	
	self.elem  = self.getElement(id ? id : 'tip');
	self.hover = false;
	self.delay = delay || parseInt(self.elem.dataset.duration) || 3500;
	self.shown = false; //The tip is currently shown to the user.
	self.prev  = null;  //Holding the original tip string while clicked.
	self.mode  = null;
	
	self.timeoutId = null;
	
	//Listeners:
	self.elem.onmouseover = function(e){
		self.hover = true;
		window.clearTimeout(self.timeoutId); self.timeoutId=null;
	};

	self.elem.onmouseout = function(e){
		self.hover = false;
		self.timeoutId = window.setTimeout(self.hide.bind(self), self.delay/2);

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
	var exist = document.getElementById(id);
	if(exist)
		return exist;
	else{
		var newElem = document.createElement('div');
		newElem.id = id;
		newElem.dir = 'auto';
		document.body.appendChild(newElem);
		return newElem;
	}
}

Tip.prototype.adjustPos = function(){
	var selfWidth = (window.innerWidth/2) - (this.elem.offsetWidth/2);
	this.elem.style.left = selfWidth.toString() + 'px';
}

Tip.prototype.hide = function(){
	this.elem.setAttribute('class','fadeout');
	this.elem.style.opacity = '0';
	this.mode = null;
	this.shown = false;
}

/*
 * The main function. Shows a new tip to the user, and overrides
 * the previous tip if any.
*/
Tip.prototype.echo = function(text, mode){
	if(this.elem.style.opacity=='0' || this.elem.style.opacity==''){
		this.elem.setAttribute('class','fadein');
	}
	else{
		this.elem.setAttribute('class','in-move');
		if(text==this.elem.innerHTML){
			this.elem.setAttribute('class','in-again');
			window.setTimeout(function(){
				this.elem.classList.remove('in-again');
			}.bind(this), 200);
		}
	}

	window.clearTimeout(this.timeoutId); this.timeoutId=null;
	this.elem.innerHTML = text.toString();

	this.elem.style.opacity = '1';
	if(!this.hover){
		this.timeoutId = window.setTimeout(this.hide.bind(this), this.delay);
	}

	this.prev = null;
	this.mode = mode?mode:null;
	this.shown = true;

	this.adjustPos();
}

Tip.prototype.title = function(text){
	this.elem.title = text;
}

/*
 * Force the tip to hide even if the timer isn't over yet.
*/
Tip.prototype.forceHide = function(){
	if(this.timeoutId){
		window.clearTimeout(this.timeoutId); this.timeoutId=null;
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

Tip.prototype.isClicked = function(){
	return this.prev != null;
}
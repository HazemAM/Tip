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
		var selfWidth = (window.innerWidth/2) - (self.elem.offsetWidth/2);
		self.elem.style.left = selfWidth.toString() + 'px';
	}

	Tip.prototype.hide = function(){
		self.elem.setAttribute('class','fadeout');
		self.elem.style.opacity = '0';
		self.mode = null;
		self.shown = false;
	}

	/*
	 * The main function. Shows a new tip to the user, and overrides
	 * the previous tip if any.
	*/
	Tip.prototype.echo = function(text, mode){
		if(self.elem.style.opacity=='0' || self.elem.style.opacity==''){
			self.elem.setAttribute('class','fadein');
		}
		else{
			self.elem.setAttribute('class','in-move');
			if(text==self.elem.innerHTML){
				self.elem.setAttribute('class','in-again');
				window.setTimeout(function(){
					self.elem.classList.remove('in-again');
				}.bind(self), 200);
			}
		}

		window.clearTimeout(self.timeoutId); self.timeoutId=null;
		self.elem.innerHTML = text.toString();

		self.elem.style.opacity = '1';
		if(!self.hover){
			self.timeoutId = window.setTimeout(self.hide.bind(self), self.delay);
		}

		self.prev = null;
		self.mode = mode?mode:null;
		self.shown = true;

		self.adjustPos();
	}

	Tip.prototype.title = function(text){
		self.elem.title = text;
	}

	/*
	 * Force the tip to hide even if the timer isn't over yet.
	*/
	Tip.prototype.forceHide = function(){
		if(self.timeoutId){
			window.clearTimeout(self.timeoutId); self.timeoutId=null;
			self.hide();
		}
	}

	/*
	 * Update the tip text without renewing the timer.
	 * Works best with `Tip.shown`, for regularly updating
	 * very-time-sensitive data while the tip is shown to the user.
	*/
	Tip.prototype.updateText = function(text){
		if(self.shown && !self.isClicked())
			self.elem.innerHTML = text.toString();
		else if(self.shown)
			self.prev = text;
	}

	Tip.prototype.getText = function(){
		return self.elem.innerHTML;
	}

	Tip.prototype.getMode = function(){
		return self.mode;
	}

	Tip.prototype.isClicked = function(){
		return self.prev != null;
	}
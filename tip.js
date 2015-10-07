Tip = function(id, delay){
	var self = this;
	
	self.elem  = document.getElementById(id); //TODO: Use self.getElement(id ? id : 'tip').
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
		self.timeoutId = window.setTimeout(self.hide, self.delay/2);

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

	//Functions:
	self.getElement = function(id){
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
	
	self.adjustPos = function(){
		selfWidth = (window.innerWidth/2) - (self.elem.offsetWidth/2);
		self.elem.style.left = selfWidth.toString() + 'px';
	}

	self.hide = function(){
		self.elem.setAttribute('class','fadeout');
		self.elem.style.opacity = '0';
		self.mode = null;
		self.shown = false;
	}

	/*
	 * The main function. Shows a new tip to the user, and overrides
	 * the previous tip if any.
	*/
	self.echo = function(text, mode){
		if(self.elem.style.opacity=='0' || self.elem.style.opacity==''){
			self.elem.setAttribute('class','fadein');
		}
		else{
			self.elem.setAttribute('class','in-move');
			if(text==self.elem.innerHTML){
				self.elem.setAttribute('class','in-again');
				window.setTimeout(function(){
					self.elem.classList.remove('in-again');
				}, 200);
			}
		}

		window.clearTimeout(self.timeoutId); self.timeoutId=null;
		self.elem.innerHTML = text.toString();

		self.elem.style.opacity = '1';
		if(!self.hover){
			self.timeoutId = window.setTimeout(self.hide, self.delay);
		}

		self.prev = null;
		self.mode = mode?mode:null;
		self.shown = true;

		self.adjustPos();
	}

	self.title = function(text){
		self.elem.title = text;
	}

	/*
	 * Force the tip to hide even if the timer isn't over yet.
	*/
	self.forceHide = function(){
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
	self.updateText = function(text){
		if(self.shown && !self.isClicked())
			self.elem.innerHTML = text.toString();
		else if(self.shown)
			self.prev = text;
	}
	
	self.getText = function(){
		return self.elem.innerHTML;
	}
	
	self.getMode = function(){
		return self.mode;
	}
	
	self.isClicked = function(){
		return self.prev != null;
	}
}
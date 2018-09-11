
/*initialize stuff*/
$('body').ready(function(){
	$('.arithmetics').hide();
	$('.stats').hide();
	//get user info
	$('.start').focus();
	timer.duration();
	
	//bind events to components
	$('.start').click(function(){
		// Animation
		var showS3 = function(){
			$('#cd3').show('size', 700).hide('puff',300, showS2);
		}
		var showS2 = function(){
			$('#cd2').show('size', 700).hide('puff',300, showS1);
		}
		var showS1 = function(){
			$('#cd1').show('size', 700).hide('puff',300, cont);
		}
		var cont = function(){
			// show things
			$('.arithmetics').show();
			$('.stats').show();
			$('.pause-btn').show();
			$('#submit').show();
			
			//run the game
			timer.setRunning(true);
			game.start();
		}
		showS3();
		$(this).hasClass('resume') ? $('.pause-scr').hide() : $(this).hide();
	});
	
	$('.pause-btn').click(function(){
		//hide things
		$(this).hide();
		$('.arithmetics').hide();
		$('.stats').hide();
		timer.setRunning(false);
		$('.pause-scr').show();
	});
	
	// esc, number, num-pad, left, right
	var keys = [8,37,39,48,49,50,51,52,53,54,55,56,57,
		96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
	$('.sum').keydown(function(event){
		var key = event.keyCode;
		if(keys.indexOf(key) < 0)event.preventDefault(); 
		if(key == 27){
			$('.pause-btn').click();
			$('.start').focus();
		}
		if(key == 13){ // when user presses enter
			var val = parseInt($(this).val());
			var bool = game.checkResponse(val);
			stat.update(bool);
			bool && game.next();
			var bg = 'url('+(bool ? 'img_o-big.png' : 'img_x-big.jpg')+')'; 
			$('.sum').css('background-image', bg);
			setTimeout(function(){
				$('.sum').css('background-image', 'url()');
			}, 300);
			$(this).val('');
		}
	});
	
	var e = jQuery.Event("keydown");
	e.which = 13; // enter keyCode
	e.keyCode = 13;
	$('#submit').click(function(){
		$('.sum').trigger(e);
		$('.sum').focus();
	});
});



/*
	userObject 
	-level
	-min criteria must be met:
		-required time
		-required accuracy
		-required speed
*/
var userProfile = {
	getLevel: function(){
		return 1;
	},
	updateLevel: function(){
		
	}
}
	
/* game object
	each game consists of
		-new numbers
		-new answer
	change horizontal to vertical layout
	change level according to stat
*/

var game = {
	level: 1,
	augend: [],
	addend: [],
	operator: '+',
	answer: 0,
	nextAnswer: 0,
	
	setLevel: function(){
		this.level = userProfile.getLevel();
	},
	start: function(){
		// start timer
		timer.setStart();
		this.setNext();
		this.next();
		$('.sum').val('');
		$('.sum').focus();
	},
	setNext: function(){
		// setUp nextQuestion according to level
		// wrapDigits() --> append operand
		var getNumber = function(len){
			var num = Math.random();
			var min = Math.pow(10, len-1);
			while(num < min){
				num *= 499;  //<<<<< this determines the max numer
			}
			return parseInt(num);
		}
		
		var wrap = function(n){
			var arr = [];
			n += '';
			for(var i = 0; i < n.length; i++){
				var digit = $('<div>' + n[i] + '</div>');
				$(digit).addClass('digit-wrapper');
				arr.push(digit);
			}
			return arr;
		}
	
		var len1 = parseInt((this.level+2) / 2);
		var len2 = parseInt((this.level+1) / 2);
		var num1 = getNumber(len1);
		var num2 = getNumber(len2);
		this.augend = wrap(num1);
		this.addend = wrap(num2);
		this.nextAnswer = num1 + num2;
	},
	next: function(){
		// clear current
		$('.operand').empty();
		// set up next
		$('.augend').append(this.augend);
		$('.addend').append(this.addend);
		this.answer = this.nextAnswer;
		this.setNext();
	},
	checkResponse: function(res){
		return res == this.answer;
	}
}	

/*
stat object: 
	arr, right, wrong, getPercent(), 
	updateDisplay(), update(isRight)

*/
var stat = {
	arr : [],
	right: 0,
	wrong: 0,
	getPercent: function(){
		var r = this.right, w = this.wrong;
		var v = (r / (r+w) * 100);
		return v.toPrecision(3);;
	},
	initDisplay: function(){
		$('#num-correct-resp').text(0);
		$('#num-total-resp').text(0);
		$('#percent-correct').text('--');
		$('#current-time').text('--');
		$('#avg-time').text('--');
	},
	updateDisplay: function(){
		if(this.arr.length == 0){
			this.initDisplay();
		} else {
			$('#num-correct-resp').text(this.right);
			$('#num-total-resp').text(this.right + this.wrong);
			$('#percent-correct').text(this.getPercent() + '%');
			var t = (timer.getTime()/1000).toFixed(2);
			$('#current-time').text(t);
			var avg = (timer.lastMark - timer.start) / (this.right * 1000);
			avg = avg.toFixed(2);
			$('#avg-time').text(avg);
		}
	},
	update: function(isRight){
		this.arr.push(isRight);
		isRight ? this.right++ : this.wrong++;
		this.updateDisplay();
	}
}

/*
	timer object:
		start, lastMark, lastDuration,
		times[], setStart(), getTime(), getTimes();
*/
var timer = {
	start : 0,
	lastMark: 0,
	lastDuration: 0,
	times: [],
	isRunning: false,
	totalDuration: 0,
	setStart: function(){
		this.start = this.lastMark = new Date();
	},
	getTime: function(){
		var now = new Date();
		var time = now - this.lastMark;
		this.lastMark = now;
		this.times.push(time);
		return time;
	},
	getTimes: function(){return this.times},
	duration: function(){
		var o = this;
		var sec = min = runningSec = 0;
		setInterval(function(){
			if(o.isRunning)runningSec++;
			sec = runningSec%60;
			min = parseInt(runningSec / 60);
			var zero = sec < 10 ? ':0' : ':';
			var str = min + zero + sec;
			this.durationSec = runningSec;
			$('#duration').text(str);
			this.totalDuration = runningSec;
		}, 1000);
	},
	setRunning: function(run){
		this.isRunning = run;
	},
}

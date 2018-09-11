var showKeypad = function(isMobile){
	if(isMobile){
		var width = $(this).width();
		var height = $(this).height();
		if(width < height){
			//show 3 x 4 keyboard
			$('#keypad1').show();
			$('#keypad2').hide();
		} else {
			//show 6 x 2 keyboard
			$('#keypad1').hide();
			$('#keypad2').show();
		}
	}
}

//draw it on: #graphics_board

var graphToday = function(testArray){
	$('#graphics_board').highcharts({
		chart: {
			type: 'column'
		},
		title: {
			text: 'Time per Question Today'	
		},
		xAxis: { /*     |<-------------delete-------------------->|*/
			categories: testArray ? new Array(testArray.length) : (function(){
				var length = engine.times.length;
				var arr = new Array();
				for(var i = 0; i < length; i++){ arr[i] = i+1; }
				return arr;		
			}())
		},
		series: [{/*|<-------------delete-------------------->|*/
			data: testArray ? testArray : (function(){ //for total time;
				var length = engine.times.length;
				var arr = new Array();
				for(var i = 0; i < length; i++){ 
					var val = engine.times[i][3] / 1000;
					val = Math.round(val);
					arr[i] = val;
				}
				return arr;
			}()),
			name: 'time'
		}],
		yAxis: [{
			title:{
				text: 'Seconds'
			}
		}]
	})
}

var graphAllTime = function(testArray){
	if(docCookies.hasItem('avgTimeArray') || testArray){
		var arr = docCookies.getItem('avgTime') || testArray;
		$('#graphics_board').highcharts({
			chart: {
				type: 'column'
			},
			title: {
				text: 'Progress Through Time'	
			},
			xAxis: { /*     |<-------------delete-------------------->|*/
				categories: testArray ? testArray : (function(){
					var date, temp = new Array();
					for(var i = 0; i < arr.length; i++){
						date = arr[i][0];
						temp.push(date);
					}
					return temp;
				}())
			},
			series: [{/*|<-------------delete-------------------->|*/
				data: testArray ? testArray : (function(){
					var t, temp = new Array();
					for(var i = 0; i < arr.length; i++){
						t = arr[i][1]; 
						temp.push(t);
					}
					return temp;
				}()),
				name: 'Average Time'
			}],
			yAxis: [{
				title:{
					text: 'Seconds'
				}
			}]
		})
	} else {
		$('#graphics_board').append($('<div></div>')
				.html('No Data to Show')
				.css({
					'font-size': '3em',
					'text-align': 'center',
					'margin-top': '10%'
				})
		)
	} 

}

/*initialize stuff*/
$('body').ready(function(){	
	var isMobile =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			
	// esc, number, num-pad, left, right, shift, tab, F12
	var keys = [8,9,10,16,37,39,46,48,49,50,51,52,53,54,55,56,57,
		96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
	$('.input').keydown(function(event){
		var key = event.keyCode;
		if(keys.indexOf(key) < 0)event.preventDefault(); 
		if(key == 27){
			$('.pause-btn').click();
			$('.start').focus();
		}
		if(key == 13 && $(this).val()){ // when user presses enter
			submitInput(this);
		}
	});

	$('#analyse_today').click(function(){ graphToday();})
	$('#analyse_all_time').click(function(){graphAllTime();})

/***************************************/

	$('.close_button').click(function(){
		$(this).closest('.close_target').hide({
			duration: 0,
			complete: function(){
				$('.main').css('opacity', '1');
			}
		});
		showKeypad(isMobile);
	})
	$('#analysis_button').click(function(){
		$('#analysis_window').show({
			complete: function(){
				$('.main').css('opacity', '0.3');
			}
		});

		if($('#left-slideout').is(':visible')) $('#left-slideout').toggle('slide');
		$('.keypad').hide();
	});

/***************************************/

	$(window).resize(function(){
		showKeypad(isMobile);
	});
	
	if(isMobile){
		$('.input').prop('readonly', true);
		/* prevents zoom: 
			$('head').append('<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=no; target-densityDpi=device-dpi" />');
		*/
		showKeypad(isMobile);
	}
	
	engine.initialize();
	game.initialize();
	//check and set cookies
	$('.keypad').css('left', (function(){
		return ($(window).width() - 650)/2 + 'px';
	})());
	$('.key').click(function(){
		var i = $(engine.currentInput);
		var key = $(this).data('key');
		var val = i.val();
		if(key == 'a'){
			var len = val.length;
			i.val(val.substr(0,len-1));
		} else if(key == 'b'){
			submitInput();
		} else {
			i.val(val+key);
		}
		$(engine.currentInput).focus();
	});

	$('#launch_reward_zone').click(function(){
		$('#reward_zone').toggle();
	});
	var rewardzone_css = {
		left: (function(){
			return ($(window).width() - 400) / 2;
		}),
		top: (function(){
			return ($(window).height() - 300) / 2;
		}),
	}
	$('#reward_zone').css(rewardzone_css);
	
	(function populateEpisodesList(){
		for(var i = 0; i < 41; i++){
			var episode = i < 9 ? "0" + (1+i) : (1+i);
			var anchor = $('<li><a class="reward" href="s01e' + episode + '.html" target="_blank"> Episode ' + episode + '</a></li>');
			var list_css = engine.reward < 1 ? {
				'text-decoration' : 'line-through'
				} : {
				'text-decoration' : 'underline'
				};
			$('#vid-SBSP-S01').append(anchor);
		}
	})();
	engine.changeMeter();	
	
	$('#panel-opener').click(function(){
		$('#left-slideout').toggle("slide", function(){
			var curr = $('#reward-count').html();
			curr = parseInt(curr);
			//console.log(curr);
			if(curr < engine.reward){
				//console.log('here');
				$('#reward-count').html(engine.reward);
				$('#reward-count').css('background-color', 'rgb(226, 22, 22)');
				$('#reward-count').click(function(){
					$(this).css('background-color', 'rgb(157, 157, 157)');
				});
			}
		});
		$('#reward_zone').hide();
		var list_css = engine.reward < 1 ? {
			'text-decoration' : 'line-through'
		} : {
			'text-decoration' : 'underline'
		};
		window.rara = list_css;
		$('#vid-SBSP-S01').find('a').css(list_css);
	});
	
	$('.main').click(function(){
		$('.hide-misc').toggle(false);
		//$('.input').first().focus();
	});
	
	$('.reward').click(function(event){
		//jquery stuff to launch viewer
		$('#reward-count').html(engine.reward);
		
		if(engine.reward < 1){
			event.preventDefault();
			engine.reward = 0;
		} else {
			$('#left-slideout').toggle();
			engine.reward--;
		}
		$('#reward-count').html(engine.reward);
	});
	
});

function submitInput(){
	var curr = $(engine.currentInput);
	var scoreBoard = $(curr).parent().find('.scoreboard');
	var bool = engine.checkAnswer();
	
	//show check mark or x mark
	var bg = 'url('+(bool ? '../img_o-big.png' : '../img_x-big.jpg')+')'; 
	scoreBoard.html(bool ? '+' + $(curr).data('score') : -$(curr).data('penalty'));
	scoreBoard.css({
		'color': (bool ? 'green' : 'red'),
		'background' : 'none'
	});
	scoreBoard.animate({
		top: (bool ? -6 : 24),
		opacity: 0
	}, {
		duration: 1250,
		easing: 'easeOutQuad',
		complete: function(){
			$(this).css({
				top: 9,
				background: bg,
				opacity: 1,
				'background-size': 'contain',
  				'background-repeat': 'no-repeat'
			}).html('');
		}
	})

	curr.data('correct', bool);
	if(bool) curr.prop('disabled', true);
	var d = bool ? $(curr).data('score') : -$(curr).data('penalty');

	engine.currentScore += parseInt(d);
	engine.changeMeter();
	engine.checkReward();
}

var engine = {
	inputCounts: 0,
	inputs: [],
	numberCorrect: 0,
	currentInput: 0, //currently focused input field
	currentScore: 10,
	maxScore: 50,
	reward: 0,
	times: [], //'haha',
	bonusPoints: 0,
	currentDurationSet: [],
	avgTime: -1,
	checkAnswer: function(){
		var userInput = $(this.currentInput).val();
		userInput = parseInt(userInput);
		var answer = $(this.currentInput).data('answer');
		if(answer == userInput){
			var toFocus;
			for(var i = 0; i < $('.input').length; i++){
				toFocus = $('.input')[i];
				if($(toFocus).is(this.currentInput)){
					toFocus = $('.input')[i+1];
					break;
				}
			}
			$(toFocus).focus();
			

			this.numberCorrect++;
			
			//Log time
			var duration = this.timer(new Date());
			this.logTime(duration);
			this.avgTime = (function(){
				var arr = this.times;
				if(arr.length > 0){
					var t = 0;
					for(var i=0; i<arr.length;i++){
						t += arr[i];
					}
					return t / arr.length;
				}
			}())
						
			//set cookie
			docCookies.setItem('currentScore', this.currentScore, (14 * 24 * 3600));
			docCookies.setItem('maxScore', this.maxScore, (14 * 24 * 3600));
			docCookies.setItem('reward', this.reward, (14 * 24 * 3600));
			docCookies.setItem('level', game.level, (14 * 24 * 3600));

			var avgTimeArray = docCookies.hasItem('avgTimeArray') ? docCookies.getItem('avgTime') : new Array();
			var date = getFullDate();
			avgTimeArray.push([date, this.avgTime]);
			docCookies.setItem('avgTimeArray', avgTimeArray, (14 * 24 * 3600));
			
			this.currentScore += this.bonusPoints;
			
			//if everything is correct
			var temp2 = this;
			if(this.numberCorrect == this.inputCounts){
				//give the bonus
				var bonus = $('#bonus-text').html();
				bonus = parseInt(bonus);
				temp2.currentScore += (isNaN(bonus)? 0 : bonus);
				temp2.changeMeter();

				setTimeout(function(){
					//Resetting the game
					game.setAnswers();
					game.drawBlocks();
					$('.input').prop('disabled', false);
					$('.input').first().focus();
					temp2.numberCorrect = 0;
					$('#bonus-bar').remove();
					$('.scoreboard').css('background', 'none');
										
					engine.setBonus();
				}, 2000);
				//check if score is high enough for reward******************
			}
			return true;
		}
		return false;
	},
	getCurrentInput: function(){
		return this.currentInput;
	},
	initialize: function(){
		this.inputs = $('.input');
		this.inputCounts = $('.input').length;
		game.setAnswers();
		var temp = this;
		$('.input').focus(function(){
			temp.currentInput = this;
		});
		$('.input').first().focus();
		
		if(docCookies.hasItem('currentScore')){
			engine.currentScore = parseInt(docCookies.getItem('currentScore'));
		}
		if(docCookies.hasItem('maxScore')){
			engine.maxScore = parseInt(docCookies.getItem('maxScore'));
			if(isNaN(engine.maxScore)) engine.maxScore = 50;
			//console.log(engine.maxScore);
		}
		if(docCookies.hasItem('reward')){
			engine.reward = parseInt(docCookies.getItem('reward'));
		}
	},
	changeMeter: function(){
		var p = (this.currentScore / this.maxScore) * 100;
		$('#point-meter').width(p + '%');
	},
	setBonus: function(){
		var time = 2 == 3 /*this.avgTime > -1 */ ? this.avgTime : 60000;
		if($('#bonus-bar')) $('#bonus-bar').remove();
		var text = '<div id="bonus-bar"></div>';
		$('#bonus-bar-container').append(text);
		var e = this;
		$('#bonus-bar').animate({'width': '0px'}, {
			duration: time,
			step: function(now, fx){
				var remaining = Math.round(now / 220 * time / 6000);
				$('#bonus-text').html(remaining);
				//e.bonusPoints = remaining*2;
				//console.log(remaining);
			},
			complete: function(){
				$(this).remove();
			}
		});
	},

	checkReward: function(){
		if(this.currentScore > this.maxScore){
			//Reward goes up by 1
			this.reward++;
			//increase the maxScore
			this.maxScore += 4;
			//$('#panel-opener').animate({backgroundColor:'rgb(121, 174, 255)'}).animate({backgroundColor:'white'});
			$('#reward_count').html(this.reward);
			//set score
			this.currentScore -= this.maxScore;
			//this.changeMeter();
			$('#reward-count').addClass('reward-point-up');
		}
	},
	
	//input: ([min, max] | max[, min])
	getRandom: function(){
		var random = Number.NEGATIVE_INFINITY, min = 0, max = 10;
		if(arguments.length == 1 && 
				Object.prototype.toString.call(arguments[0]) 
				=== "[object Array]"){
			min = arguments[0][0];
			max = arguments[0][1];
		} else if(Object.prototype.toString.call(arguments[0]) 
				=== "[object Number]"){
			max = arguments[0];
			if(Object.prototype.toString.call(arguments[1]) 
					=== "[object Number]"){
				min = arguments[1];
			}
		}
		while(random < min || random > max){
			random = Math.random() * max;
		}
		return Math.ceil(random);
	},
	timer: (function(){
		var lastTime = new Date(); 
		return function(newTime){
			var duration = newTime - lastTime; 
			lastTime = newTime;
			return duration;
		};
	}()),
	logTime: function(duration){
		this.currentDurationSet.push(duration);
		var sum = 0; 
		if(this.currentDurationSet.length == 3){
			var temp = [];
			for(var i=0; i < 3; i++){
				var temp2 = this.currentDurationSet.shift()
				sum += temp2;
				temp.push(temp2);
			}
			temp.push(sum);
			//console.log(temp);
			this.times.push(temp);
		}
	},
}

var getFullDate = function(){
	var date = new Date();
	var yyyy = date.getFullYear();
	var mm = date.getMonth() + 1; //since Jan starts at 0;
	mm = (mm + '').length == 1 ? '0' + mm : mm;
	var dd = date.getDate();
	dd = (dd + '').length == 1 ? '0' + dd : dd;
	return yyyy + '.' + mm + '.' + dd;
}
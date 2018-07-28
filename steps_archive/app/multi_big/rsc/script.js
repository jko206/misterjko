/*
	-make the work/stats save-able then upload
	
*/

var WINDOW_HEIGHT = 0;
var WINDOW_WIDTH = 0;

var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

var FONT_SIZES = [];
 
var user_data;
var loggedIn;
$(document).ready(function(){
	//if(!loggedIn) window.location.replace("login.php?from=multi");
	//load user info: 
	var user_data = {
		username: 'Abdul',
		score: parseInt(docCookies.getItem('score')) || 0,
		level: parseInt(docCookies.getItem('level')) || 0,
		averageTime: -1, //-1 means no data yet
		totalGames: 0, //total number played
		sets: (function(){
			var arr = [1,2,3,4,5];//,6,7,8,9];
			//console.log(arr);
			return arr;
		}()), // levels to practice, set by mother
		rewards: parseInt(docCookies.getItem('rewards')) || 0,
		threashold: parseInt(docCookies.getItem('threashold')) || 20
	}
	$('#current_points').html(user_data.score);
	$('#rewards').html(user_data.rewards);
	$('#level').html(user_data.level);
	var totalTime = 0; //total time taken this session

	if(mobile){
		//generate keys
	}
	
	//generate problem
	var game = {
		num1: 0,
		num2: 0,
		answer: this.num1*this.num2,
		sets: [],
		threashold: 0, //points at which reward++;
		arr: [1,2,3,4,5,6,7,8,9],
		stat: {
			attempts: 0,
			success: 0,
			duration: 0	
		},
		init: function(){
			this.sets = user_data.sets;
			this.newGame();
			clock.setTime();
			this.threashold = user_data.threashold || 20;
		},
		newGame: function(){
			$('.user_input').val('').text('');
			var s = this.sets;
			this.num1 = (function(){
				var num= Math.ceil(Math.random() * 99);
				return num;
			}());
			this.num2 = (function(){
				var num= Math.ceil(Math.random() * 99);
				return num;
			}())
			$('.number').first().html(this.num1);
			$('.number').last().html(this.num2);
			this.answer = this.num1 * this.num2;
		},
		checkAnswer: function(num){
			console.log('attempts: ' + this.stat.attempts);
			console.log('success: ' + this.stat.success);
			this.stat.attempts++;
			if(num == this.answer){
				this.stat.success++;
				return true;
			}
		}
	}
	var clock = {
		time: 0,
		setTime: function(){
			this.time = new Date;
		},
		//start timer
		//getLength: stops time, sets new start time, returns length
		getTime: function(){
			return (new Date() - this.time)/1000;
		}
	}

	$('#end_session').click(function(){
		game.stat.duration = clock.getTime();
		game.stat.date = (function(){
			var d = new Date();
			var year = d.getFullYear();
			var month = d.getMonth() + 1;
			month = ('' + month).length == 1 ? '0' + month : month;
			var date = d.getDate();
			date = date.length == 1 ? '0' + date : date;
			return '' + year + '-' + month + '-' + date;
		}());
		$('#summary').show();
		$('#time').text(game.stat.duration);
		$('#attempts').text(game.stat.attempts);
		$('#correct').text(game.stat.success);
		$('#success_rate').text((function(){
			var r = game.stat.success / game.stat.attempts;
			r = Math.round(r * 100);
			return r + '%';
		}()));
		console.log(game.stat);
		$.ajax({
			url : 'update_data.php',
			type : 'POST',
			data : {
				date: game.stat.date,
				attempts: game.stat.attempts,
				success: game.stat.success,
				duration: game.stat.duration
			},
			success : function(response){
				console.log(response);
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.log('jqXHR.responseText:  ' + jqXHR.responseText);
				console.log('jqXHR.responseXML :  ' + jqXHR.responseXML);
				console.log('textStatus:   ' +  textStatus);
				console.log('errorThrown:   ' + errorThrown);
			},
			dataType : 'text' //type that I'm expecting back
		});
		console.log('rararaa');
		$(this).unbind('click');
		$(this).css('color', 'gray');
	})

	$('.user_input').on('keydown',function(e){
		var key = e.keyCode;
		if(key==13){
			var resp = $(this).text() || $(this).val();
			var isCorrect = game.checkAnswer(resp); // returns stat
			if(isCorrect) game.newGame();
		}else if(key == 27){
			$(this).val('').text('');
		}
	})
	
	game.init();

	$('.close_pop_ups').click(function(){
		$('#pop_ups').hide();
	})

	$('#username').text(user_data.username);

	$('.close_pop_ups').click();
	
});

function reset(){
	docCookies.removeItem('level');
	docCookies.removeItem('score');
	docCookies.removeItem('threashold');
	docCookies.removeItem('rewards');	
}


function setCookie(s, i){
	user_data[s] = i;
	$('#current_points').html(user_data.score);
	$('#rewards').html(user_data.rewards);
	$('#level').html(user_data.level);
}

//gets passed an array with number sets user has to practice
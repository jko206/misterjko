/*
	-make the work/stats save-able then upload
	
*/

var WINDOW_HEIGHT = 0;
var WINDOW_WIDTH = 0;

var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

var FONT_SIZES = [];
 
var user_data;

$(document).ready(function(){
	//load user info: 
	/*var*/ user_data = {
		username: 'Kevin',
		score: parseInt(docCookies.getItem('score')) || 0,
		level: parseInt(docCookies.getItem('level')) || 0,
		averageTime: -1, //-1 means no data yet
		totalGames: 0, //total number played
		sets: [1,2,3,4,5,6,7,8,9], // levels to practice, set by mother
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
		init: function(){
			this.sets = user_data.sets;
			console.log(this.sets);
			this.newGame();
			clock.setTime();
			this.threashold = user_data.threashold || 20;
		},
		newGame: function(){
			var s = this.sets;
			this.num1 = (function(){
				var len = s.length;
				var i = Math.floor(Math.random() * len);
				return s[i];
			}());

			var a = this.arr;
			this.num2 = (function(){
				var len = a.length;
				var i = Math.floor(Math.random() * len);
				return a[i];
			}())
			$('.number').first().html(this.num1);
			$('.number').last().html(this.num2);
			clock.setTime();

			this.answer = this.num1 * this.num2;
		},
		checkAnswer: function(num){
			if(num == this.answer){
				var points = 0;
				//get points
				points++;
				//calculate bonus (up to 5 points) depending on time;
				var temp = 5 - clock.getTime();
				console.log(temp);
				temp = Math.round(temp);
				if(temp > 0) points += temp;

				//****** animate bonus

				//add points
				user_data.score += points;
				console.log('score: ' + user_data.score + '   threashold: ' + this.threashold);
				if(user_data.score >= this.threashold){
					user_data.score %= this.threashold;
					console.log('score: ' + user_data.score + '   threashold: ' + this.threashold);
					this.threashold += 2;
					user_data.threashold = this.threashold;
					user_data.level++;
					user_data.rewards++;
				}
				
				//display points
				$('#current_points').html(user_data.score);
				$('#rewards').html(user_data.rewards);
				$('#level').html(user_data.level);
				this.newGame();
			} else {
				user_data.score--;
				if(user_data.score < 0) user_data.score = 0;
			}
			//display points
			var th = this.threashold;
			$('#points_bar').width((function(){
				return (user_data.score/th * 100) + '%';
			}()));
			$('.user_input').val('').text('');

			docCookies.setItem('username', 'Kevin', 1000000);
			docCookies.setItem('score', user_data.score, 1000000);
			docCookies.setItem('level', user_data.level, 1000000);
			docCookies.setItem('rewards', user_data.rewards, 1000000);
			docCookies.setItem('threashold', user_data.threashold, 1000000);
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

	$('.user_input').on('keydown',function(e){
		var key = e.keyCode;
		if(key==13){
			var resp = $(this).text() || $(this).val();
			game.checkAnswer(resp);
		}else if(key == 27){
			$(this).val('').text('');
		}
	})

	game.init();
	$('#show_videos_list').click(function(){
		$('#pop_ups').show();
		$('#videos_list').show();
		if(user_data.rewards <= 0){
			$('#videos_list').find('a').addClass('disabled');
			$('#videos_list').find('a').each(function(){
				var  temp = $(this).attr('href');
				$(this).data('temp', temp);
				$(this).attr('href', '#');
			})
			console.log('rewards: ' + user_data.rewards);
		} else {
			$('#videos_list').find('a').removeClass('disabled');
			$('#videos_list').find('a').each(function(){
				var href = $(this).data('temp');
				$(this).attr('href', href);
			})
		}
	})

	$('#videos_list').on('click', '.video_link', function(e){		
		if(user_data.rewards <= 0){
			$('#videos_list').find('a').addClass('disabled');
			$('#videos_list').find('a').each(function(){
				var  temp = $(this).attr('href');
				$(this).data('temp', temp);
				$(this).attr('href', '#');
			})
			console.log('rewards: ' + user_data.rewards);
			e.preventDefault();

		} else {
			$('#videos_list').find('a').removeClass('disabled');
			$('#videos_list').find('a').each(function(){
				var href = $(this).data('temp');
				$(this).attr('href', href);
			})
			user_data.rewards--;
			$('#rewards').text(user_data.rewards);
			console.log('here');
		}
	})

	$('.close_pop_ups').click(function(){
		$('#pop_ups').hide();
	})

	//populate cartoons list
	$('#videos_main').html('');
	$('#videos_main').append('<h3>Spongebob Squarepants</h3>');
	var div = $('<div></div>');
	$('#videos_main').append(div);
	for(var k=1; k <=2; k++){
		var s = '<h4>Season ' + k +'</h4>';
		$(div).append(s);

		var ul = $('<ul></ul>').attr('id', 'list_target' + k);
		$(div).append(ul);
		for(var i=0; i < 41; i++){
			var n = i < 10 ? '0' + (i+1) : (1+i);
			var li = $('<li></li>');
			var a = $('<a></a>');
			a.text('Episode ' + (i+1));
			a.attr('href', '../suite/videos/SBSP/S' + k + '/' + k + n + '.mp4'); //<---------- important
			a.attr('target', '_new');
			a.addClass('video_link');
			li.append(a);
			$('#list_target' + k).append(li);
		}
	}
	//cartoon population over

	$('#username').text(user_data.username);
	$('.accordion').accordion({
		collapsible : true
	});
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
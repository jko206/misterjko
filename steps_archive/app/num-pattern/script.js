
/*initialize stuff*/
$('body').ready(function(){
	$('.arithmetics').hide();
	$('.stats').hide();
	//get user info
	$('.start').focus();
	//timer.duration();
	startGame();
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
	var keys = [8,9,37,39,48,49,50,51,52,53,54,55,56,57,
		96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
	$('.input').keydown(function(event){
		var key = event.keyCode;
		if(keys.indexOf(key) < 0)event.preventDefault(); 
		if(key == 27){
			$('.pause-btn').click();
			$('.start').focus();
		}
		if(key == 13){ // when user presses enter
			checkAnswer(this);
		}
	});
	var e = jQuery.Event("keydown");
	e.which = 13; // enter keyCode
	e.keyCode = 13;
	$('.submit').click(function(){
		var input = $(this).parent().find('.input');
		$(input).trigger(e);
	});
});

var countCorrect = 0;

function checkAnswer(x){
	var input = $(x).val();
	var answer = $(x).data('answer');
	if(input == answer){
		countCorrect++;
		$(x).css('background', 'url("img_o-small.png") no-repeat 140px');
		$(x).attr('disabled', true);
		$(x).closest('.wrapper').siblings().find('.input').first().focus();
		if(countCorrect == 2){
			setTimeout(function(){
				$('.input').attr('disabled', false);
				$('.input').css('background', 'none');
				$('.input').val('');
				countCorrect = 0;
				startGame();
			}, 300);
		}
	} else {
		console.log('here!');
		$(x).css('background', 'url("img_x-small.jpg") no-repeat 140px');
	}
}

function startGame(){
	var seed, jump;
	seed = Math.floor(Math.random() * 50);
	jump = Math.floor(Math.random() * 20);
	$('#num1').html(seed);
	$('#num2').html(seed+jump);
	$('#num3').html(seed+jump*2);
	$('#num4').data('answer', seed+jump*3);
	$('#num5').data('answer', seed+jump*4);
	$('.input').first().focus();
}

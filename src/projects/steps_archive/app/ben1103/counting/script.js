
/*initialize stuff*/
$('body').ready(function(){
	$('.arithmetics').hide();
	$('.stats').hide();
	//get user info
	$('.start').focus();
	//timer.duration();
	
	var isMobile =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	var e = jQuery.Event("keydown");
	e.which = 13; // enter keyCode
	e.keyCode = 13;
	$('.submit').click(function(){
		var input = $(this).siblings().first();
		$(input).trigger(e);
		$(input).focus();
	});
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
	
	game.loadNext();
	
	// esc, number, num-pad, left, right
	var keys = [8,37,39,48,49,50,51,52,53,54,55,56,57,
		96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
	$('.input').keydown(function(event){
		var key = event.keyCode;
		if(keys.indexOf(key) < 0)event.preventDefault(); 
		if(key == 27){
			$('.pause-btn').click();
			$('.start').focus();
		}
		if(key == 13 && $(this).val()){ // when user presses enter
			var val = parseInt($(this).val());
			var bool = game.checkAnswer(val);
			
			//show check mark or x mark
			var bg = 'url('+(bool ? 'img_o-big.png' : 'img_x-big.jpg')+')'; 
			$(this).css('background-image', bg);
			var thisInput = this;
			setTimeout(function(){
				$(thisInput).css('background-image', 'none');
			}, 300);
			if(bool){	//load next game
				$(this).val('');
				game.loadNext();
			}
		}
	});
	
	if(isMobile){
		$('.input').prop('readonly', true);
		//$('head').append('<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=no; target-densityDpi=device-dpi" />');

		$('#keypad').show();
		$('.key').click(function(){
			var key = $(this).data('key');

			var val = $('.input').val();
			if(key == 'a'){
				var len = val.length;
				$('.input').val(val.substr(0,len-1));
			} else if(key == 'b'){
				$('.submit').first().click();
			} else {
				$('.input').val(val+key);
			}
			
		});
	}
	
});

var game={
	currentNumber: 0, 
	newNumber: function(){
		var random = Math.random() * 500;
		random = Math.floor(random);
		this.currentNumber = random;
	},
	checkAnswer: function(number){
		return number == this.currentNumber;
	},
	loadNext: function(){
		this.newNumber();
		var pow0 = this.currentNumber%10;
		var pow1 = Math.floor(this.currentNumber%100 / 10);
		var pow2 = Math.floor(this.currentNumber/100);
		$('.block-spawn').html('');
		var gif0 = '1.gif';
		var gif1 = '10.gif';
		var gif2 = '100.gif';
		for(var i=0; i < pow0; i++){
			var elem = $('<img src="1.gif">');
			if(i == 4 && pow0 > 4) elem.addClass('five-grouper');
			$('#b1').append(elem);
		}
		for(var j=0; j < pow1; j++){
			var elem = $('<img src="10.gif">');
			if(j == 4 && pow1 > 4) elem.addClass('five-grouper');
			$('#b10').append(elem);
		}
		for(var k=0; k < pow2; k++){
			$('#b100').append('<img src="100.gif">');
		}
	}
}

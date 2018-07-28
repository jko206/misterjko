/* global $ */

$(document).ready(function(){
	//$('.label').hide();
	$('.cell').each(function(){
		$(this).data('amount', 0);
	});
	
	$('#dividend').change(function(){
		reset();
	});
	
	$('#divisor').change(function(){
		reset();
		$('.cell').hide();
		var n = $(this).val();
		$('#story-divisor').text(n);
		var cdHeight = $('#coin-depot').css('height');
		var cdWidth = $('#coin-depot').css('width');
		for(var i = 0; i < n; i++){
			var cell = $('.cell')[i];
			$(cell).show();
		}
		if(n == 1){
			$('.cell').css({
				'width' : '600px',
				'height' : '450px'
			})
		} else if(n == 2){
			$('.cell').css({
				'width' : '600px',
				'height' : '225px'
			})
		} else if(n == 3){
			$('.cell').css({
				'width' : '600px',
				'height' : '150px'
			})
		} else if(n == 4){
			$('.cell').css({
				'width' : '300px',
				'height' : '225px'
			})
		} else if(n == 5 || n == 6){
			$('.cell').css({
				'width' : '200px',
				'height' : '225px'
			})
		} else{
			$('.cell').css({
				'width' : '200px',
				'height' : '150px'
			})
		}
		$('#coin-depot').show().css({
			'width' : cdWidth,
			'height' : cdHeight
		});
	});
	
	$('.cell').droppable({
		accept: '.coin',
		drop: function(event, ui){
			var coin = ui.draggable;
			var amount = coin.text();
			amount = parseInt(amount);
			var parentAmount = coin.parent().data('amount') - amount;
			coin.parent().data('amount', parentAmount);
			coin.remove();
			coin = makeCoin(amount);
			$(this).append(coin);
			
			
			var newAmount = $(this).data('amount') + amount;
			$(this).data('amount', newAmount);
		}
	});
	
	$('#coin-depot').data('mode', 'tens');
	
	$('#quotient').change(function(){
		var n = $(this).val();
		$('#story-quotient').text(n);
	});
	
	$('#split-button').click(function(){
		var amount = $('#coin-depot').data('amount');
		if(amount != 0){
			var mode = $('#coin-depot').data('mode');
			var cd = $('#coin-depot');
			var amount = cd.data('amount');
			cd.empty();
			if(mode == 'tens'){
				//split into ones
				for(var i = 0; i < amount; i++){
					cd.append(makeCoin(1));
				}
				//change the mode to ones
				cd.data('mode', 'ones');
				$(this).text('합치기');
			} else if (mode == 'ones'){
				var tens = parseInt(amount/10);
				var ones = amount%10;
				for(var j = 0; j < tens; j++){
					cd.append(makeCoin(10));
				}
				for(var k = 0; k < ones; k++){
					cd.append(makeCoin(1));
				}
				cd.data('mode', 'tens');
				$(this).text('쪼개기');
			}
		}
	});
	
	
	// ALMOST EXACTLY THE SAME AS $('#dividend').change(); (see above)
	$('#reset-button').click(function(){
		reset();
	});
	
	$('#check-fairness').click(function(){
		var divisor = $('#divisor').val();
		divisor = parseInt(divisor);
		var model = $($('.cell')[0]).data('amount');
		var isFair = true;
		for(var i = 0; i < divisor; i++){
			var cell = $('.cell')[i];
			var amount = $(cell).data('amount');
			if(amount != model) isFair = false;
		}
		if(!isFair){
			$('#message')
					.text('공평하게 나눠지지 않았어요!')
					.animateHighlight('#ffcccc', 1000);
		} else if($('#coin-depot').data('amount') == 0){
			$('#message')
					.text('완벽하게 나눴군요!')
					.animateHighlight('#99ffaa', 1000);
		} else {
			$('#message')
					.text('지금까지는 공평합니다!')
					.animateHighlight('#99ffaa', 1000);
		}
	});
});

function makeCoin(amount){
	var text = amount == 1 ? 'one' : 'ten';
	var coin =$('<div>' + amount +'</div>')
			.addClass('coin ' + text)
			.draggable({
				appendTo: 'body',
				revert: 'invalid',
				scroll: false,
				helper: 'clone',
				start: function(event, ui){
					$(this).hide();
				},
				stop: function(event, ui){
					$(this).show();
				}
			});
	return coin;
}


var notLocked = true;

$.fn.animateHighlight = function(highlightColor, duration) {
    var highlightBg = highlightColor || "#FFFF9C";
    var animateMs = duration || 1500;
    var originalBg = this.css("backgroundColor");
    if (notLocked) {
        notLocked = false;
        this.stop().css("background-color", highlightBg)
            .animate({backgroundColor: originalBg}, animateMs);
        setTimeout( function() { notLocked = true; }, animateMs);
    }
};

function reset(){
	$('.coin').remove();
	$('.cell').data('amount', 0);
	var q = $('#dividend').val();
	q = parseInt(q);
	$('#story-dividend').text(q);
	
	$('#coin-depot').empty().data('amount', q);

	var tens = parseInt(q/10);
	var ones = q%10;
	
	for(var i = 0; i < tens; i++){
		var coin = makeCoin(10);
		$('#coin-depot').append(coin);
	}
	for(var j = 0; j < ones; j++){
		coin = makeCoin(1);
		$('#coin-depot').append(coin);
	}
	
	$('#quotient').val('');
	$('#split-button').text('쪼개기');
	$('#coin-depot').data('mode', 'tens');
	$('#message').text('새로운 도전!');
}
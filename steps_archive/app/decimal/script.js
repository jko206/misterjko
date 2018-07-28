

$('body').ready(function(){
	// b-space, left, right, 0-9 (keyboard and number pad)
	var keys = [8,37,39,48,49,50,51,52,53,54,55,56,57,
			96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
	$('#decimal').focus();
	
	$('input').keydown(function(event){
		var v = $(this).val();
		var key = event.keyCode;
		if(keys.indexOf(key) < 0)event.preventDefault(); 
	});
	
	$('#decimal').keyup(function(){
		var v = parseInt($(this).val());
		while(v < 1000){
			v *= 10;
		}
		v = '' + v;
		var ten1 = $('#decimal').data('ten-1', parseInt(v[0]));
		var ten2 = $('#decimal').data('ten-2', parseInt(v[1]));
		var ten3 = $('#decimal').data('ten-3', parseInt(v[2]));
		var ten4 = $('#decimal').data('ten-4', parseInt(v[3]));
		updateBox();
		updateIncr();
	});
	
	$('.incr').change(function(){
		var digit = parseInt($(this).val());
		var id = $(this).attr('id').substring(5);
		$('#decimal').data(id, digit);
		updateDecimal();
	});
	
	$('.quiz').hide();
	$('#doQuiz').change(function(){
		if($(this).prop('checked')){
			$('.quiz').show();
			$('.not-quiz').hide();
			$('.increments').hide();
			runQuiz();
		} else {
			$('.quiz').hide();
			$('.not-quiz').show();	
			$('.increments').show();
		}
	});
	fillGrid();
	enableRadio();
	$('#quiz-resp').keydown(function(event){
		if(event.keyCode == 13) $('#submit-resp').click();
	});
	
	
	$('#submit-resp').click(function(){
		//console.log('here');
		var val = '' + $('#quiz-resp').val();
		while(val.length < 4){
			val += '0';
		}
		var ten1, ten2, ten3, ten4;
		ten1 = $('#decimal').data('ten-1');
		ten2 = $('#decimal').data('ten-2');
		ten3 = $('#decimal').data('ten-3');
		ten4 = $('#decimal').data('ten-4');
		if(!ten1) ten1 = 0;
		if(!ten2) ten2 = 0;
		if(!ten3) ten3 = 0;
		if(!ten4) ten4 = 0;
		if(val[0] == ten1 && val[1] == ten2 &&
				val[2] == ten3 && val[3] == ten4){
			$('.wrapper').hide();
			$('.flash').text('NICE!');
			$('.flash').fadeIn(500, function(){
				$(this).fadeOut(500, function(){
					$('.wrapper').show();
				});
			});
			console.log('success');
			runQuiz();
		} else {
			$('.wrapper').hide();
			$('.flash').text('Try again');
			$('.flash').fadeIn(500, function(){
				$(this).fadeOut(500, function(){
					$('.wrapper').show();
					$('#quiz-resp').focus();
				});
			});
		}
	});
	function runQuiz(){
		$('.flash').hide();
		//$('.flash-success').hide();
		$('#quiz-resp').val('');
		
		var r = parseInt(Math.random()*10000);
		console.log(r);
		var ten1, ten2, ten3, ten4;
		ten1 = parseInt(r / 1000);
		r %= 1000;
		ten2 =  parseInt(r / 100);
		r %= 100;
		ten3 = parseInt(r / 10);
		r %= 10;
		ten4 = r;
		
		$('#decimal').data('ten-1', ten1);
		$('#decimal').data('ten-2', ten2);
		$('#decimal').data('ten-3', ten3);
		$('#decimal').data('ten-4', ten4);
		
		$('#quiz-resp').focus();
		
		updateIncr();
		updateDecimal();
	}
	
	function updateIncr(){
		var ten1 = $('#decimal').data('ten-1');
		var ten2 = $('#decimal').data('ten-2');
		var ten3 = $('#decimal').data('ten-3');
		var ten4 = $('#decimal').data('ten-4');
		$('#incr-ten-1').val(ten1);
		$('#incr-ten-2').val(ten2);
		$('#incr-ten-3').val(ten3);
		$('#incr-ten-4').val(ten4);
	}
	
	function updateDecimal(){
		var ten1 = $('#decimal').data('ten-1');
		var ten2 = $('#decimal').data('ten-2');
		var ten3 = $('#decimal').data('ten-3');
		var ten4 = $('#decimal').data('ten-4');
		if(!ten1) ten1 = 0;
		if(!ten2) ten2 = 0;
		if(!ten3) ten3 = 0;
		if(!ten4) ten4 = 0;
		var s = '' + ten1 + ten2 + ten3 + ten4;
		
		var count = 0;
		while(s[s.length-1] == '0'){
			s = s.substring(0, s.length - 1);
			count++;
			if(count > 10){
				console.log('break'); 
				break;
			}
		}
		
		$('#decimal').val(s);
		updateBox();
	}
	
	function updateBox(){

		var n10 = $('#decimal').data('ten-1');
		var n100 = $('#decimal').data('ten-2');
		var n1000 = $('#decimal').data('ten-3');
		var n10000 = $('#decimal').data('ten-4');
		//console.log(n10 + ', ' + n100 + ', ' + n1000 + ', ' + n10000);
		
		$('.one').find('.c').remove();
		for(var i=0; i < n10; i++){
			var ten1 = $('#ten-1').clone().removeAttr('id');
			$('.one').append(ten1);
		}
		for(var j=0; j < n100; j++){
			var ten2 = $('#ten-2').clone().removeAttr('id');
			$('.one').append(ten2);
		}
		var box = $('#ten-2').clone().removeAttr('id').css('background-color', 'white');
		for(var k=0; k < n1000; k++){
			var ten3 = $('#ten-3').clone().removeAttr('id');
			$(box).append(ten3);
		}
		for(var l=0; l < n10000; l++){
			var ten4 = $('#ten-4').clone().removeAttr('id');
			$(box).append(ten4);
		}
		$('.one').append(box);
	}
	
	function fillGrid(){
		var a = $('#grid-a');
		var gc = $('.grid-container')
		for(var i=0; i<100; i++){
			var b = $('#grid-b').clone().removeAttr('id');
			if((i+1)%10==0) $(b).css('border-right', '0px');
			if(i >= 90) $(b).css('border-bottom', '0px');
			$(a).append(b);
		}
		
		for(var j=0; j<100; j++){
			a = $('#grid-a').clone().removeAttr('id');
			$(gc).append(a);
		}
		
	}

	function enableRadio(){
		$('input[type=radio]').change(function(){
			var id = $(this).attr('id');
			switch(id){
				case 'grid-op-1':
					$('.grid-a').hide();
					$('.one').addClass('show-border');
					break;
				case 'grid-op-2':
					$('.grid-a').show();
					$('.grid-b').hide();
					$('.one').removeClass('show-border');
					break;					
				case 'grid-op-3':
					$('.grid-a').show();
					$('.grid-b').show();
					$('.one').removeClass('show-border');
					break;					
			}
		});
		$('#grid-op-2').click();
	}
});

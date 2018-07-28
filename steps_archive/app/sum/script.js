'use strict';

$('body').ready(function(){
	//Load start button and slides
	$('.start-btn').click(function(){
		//start program
		$('.starter').hide();
		$('.arithmetics').show();
		$('.quit').show();
		$('.stats').show();
		var run = true;
		runProgram();
		startTime = lastTime = new Date();
	});
});

function setUp(){
	
	// get augend / addend of appropriate length depending
	// on the level and type
	var augend = getNumber('augend');
	var addend = getNumber('addend');
	console.log('aug: ' + augend);
	console.log('add: ' + addend);
	sum = augend + addend;
	//window reflects the numbers
	updateParts('augend', augend);
	updateParts('addend', addend);
	$('.sum').val('');
}

function updateParts(part, num){
	$('.'+part).text('');
	while(num >= 1){
		var n = num%10;
		num = parseInt(num/10);
		var digit = $('#digit-wrapper').clone().removeAttr('id');
		digit.text(n);
		$('.'+part).append(digit);
		console.log(n);
	}
	console.log(part + ' updated');
}

function getNumber(type){
		var incr = (type == 'augend') ? 2 : 1;
		var digits = parseInt((level+incr)/2);
		var num = Math.random();
		var min = Math.pow(10, digits-1);
		while(num < min){
			num *= 10;
		}
		return parseInt(num);
	};


var runProgram = function(){
	//get user level
	var level = 1;
	var sum;
	var total = 0;
	var correct = 0;
	setUp();
	updateStat();
	
	/*get user prompt
	check answer
		//update statistics
		//if right, load next question
		//if not, re-prompt
	*/
	
	$('.sum').focus();
	
	$('input').keydown();
}


var stat = function(){
	this.startTime;
	this.lastTime;
	function updateStat(){
		var newTime = new Date();
		var currentTime = ((newTime - lastTime)/1000).toFixed(2);
		var avgTime = ((newTime - startTime)/total/1000).toFixed(2);
		lastTime = newTime;
		if(total < 1){
			currentTime = 0;
			avgTime = 0;
		}
		
		$('#num-correct-resp').html('correct: ' + correct);
		$('#num-total-resp').html('total: ' + total);
		var p = (total == 0) ? '' : (correct/total*100);
		$('#percent-correct').html(Math.floor(p*100)/100 + '%');
		$('#current-time').html('Speed: ' + currentTime + 's');
		$('#avg-time').html('Average: ' + avgTime + 's');
	}
}

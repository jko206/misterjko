
$(document).ready(function(){
	$('.answer-choice').click(function(){
		$('.answer-choice').removeClass('highlight-on');
		$(this).addClass('highlight-on');
	});
	
	$('#check-answer').click(function(){
		if($('#question').hasClass('practice')){
			$('#question').removeClass('practice');
			$('#start-real-quiz').show().delay(20).fadeOut(function(){
				myGlobal.lastTime = new Date();
				$('.show-chart').prop('disabled', false);
				$('#timeChart').show();
				loadQuestion();
			});
		} else {
			updateAttempts($('.highlight-on').hasClass('answer'));
			if($('.highlight-on').hasClass('answer')){
				updateTimelog();
				loadQuestion();
			}
			shuffle();
			drawChart();
			$('.highlight-on').removeClass('highlight-on');
		}
	});
	
});

function loadQuestion(){
	$('.answer-choice').remove();
	var randomIndex = Math.floor(Math.random() * questions.length);
	while(myGlobal.lastQ == randomIndex){
		randomIndex = Math.floor(Math.random() * questions.length);
	}
	myGlobal.lastQ = randomIndex;
	var q = questions[randomIndex];
	var qText = q.objs[0].value;
	var qnumText = 'Q' + (randomIndex + 1) + '. ';
	$('#question').html(qnumText + qText);
	$('#question').data('qnum', randomIndex);
	var c = q.choices;
	for(var i = 0; i < c.length; i++){
		var temp = $('<li></li>');
		var cText = c[i];
		temp.addClass('answer-choice');
		temp.html(cText);
		
		$('#answer-choices').append(temp);
		$('.answer-choice').click(function(){
			$('.answer-choice').removeClass('highlight-on');
			$(this).addClass('highlight-on');
		});
	}
	var answer = q.answer;
	$($('.answer-choice')[answer]).addClass('answer');
	shuffle();
	
	$('.answer-choice').click(function(){
		$('#check-answer').prop('disabled', false);
	});

}

function shuffle(array) {
	$(function () {
		var parent = $("#answer-choices");
		var divs = parent.children();
		while (divs.length) {
			parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
		}
	});
}

//IF MORE QUESTIONS ARE ADDED, CHANGE MYGLOBAL OBJECT
// BELOW AS WELL.
var questions = [{"tags":"","level":"","shuffle":false,"objs":[{"type":"text","value":"On a car trip Sam drove m miles, Kara drove twice as many miles as Sam, and Darin drove 20 fewer miles than Kara. In terms of m, how many miles did Darin drive?"},{"type":"img","value":""}],"choices":["2m + 20","2m - 20","m/2 + 20","(m+20) / 2","m/2 - 20"],"answer":1},{"tags":"","level":"","shuffle":false,"objs":[{"type":"text","value":"If x and y are positive integers, what are all the solutions (x, y ) of the equation 3x + 2y = 11?"},{"type":"img","value":""}],"choices":["(1, 4) only","(3, 1) only","(1, 4) and (2, 2)","(1, 4) and (3, 1)","(2, 2) and (3, 1)"],"answer":3},{"tags":"","level":"","shuffle":false,"objs":[{"type":"text","value":"A company’s profit, P, in dollars, for producing x machines in one day is given by P = 500x - 20x^2. If the company produces 10 machines in one day, then, according to this formula, what is the profit for that day?"},{"type":"img","value":""}],"choices":["$5,000","$4,000","$3,000","$2,000","$1,000"],"answer":2},{"tags":"","level":"","shuffle":false,"objs":[{"type":"text","value":"12 - n, 12, 12 + n\n\nWhat is the average (arithmetic mean) of the 3 quantities in the list above?"},{"type":"img","value":""}],"choices":["4","12","18","4 + n/3","12 + n/3"],"answer":1},{"tags":"","level":"","shuffle":false,"objs":[{"type":"text","value":"A fruit salad is made from pineapples, pears, and peaches mixed in the ratio of 2 to 3 to 5, respectively, by weight. What fraction of the mixture by weight is pineapple?"},{"type":"img","value":""}],"choices":["1/5","3/10","2/5","1/2","2/3"],"answer":0}];

var myGlobal = {
	lastQ: -1, 
	lastTime: 0,
	count: 1,
	durations: [ //the time it took to solve each problem
		[],[],[],[],[]
	],
	attempts: [ //the time it took to solve each problem
		[],[],[],[],[]
	],
	durationsChart: [
		['Question', 'last', 'avg.'],
		['Q1', 		0, 		0],
		['Q2', 		0, 		0],
		['Q3', 		0, 		0],
		['Q4', 		0, 		0],
		['Q5', 		0, 		0]
	], 
	attemptsChart: [
		['Question', 'last', 'avg.'],
		['Q1', 		0, 		0],
		['Q2', 		0, 		0],
		['Q3', 		0, 		0],
		['Q4', 		0, 		0],
		['Q5', 		0, 		0]
	]
}
function updateTimelog(){
	var qnum = $('#question').data('qnum');
	
	var lastTime = myGlobal.lastTime;
	var thisTime = new Date();
	
	var duration = thisTime - lastTime;
	myGlobal.lastTime = thisTime;
	
	var len = myGlobal.durations[qnum].push(duration);
	var totalDuration = myGlobal.durations[qnum].reduce(
		function(a,b){return a + b;}
	);
	var avg = Math.round(totalDuration / len / 100) / 10;
	
	var chartData = myGlobal.durationsChart[qnum+1];
	chartData[1] = Math.round(duration / 100) / 10;
	chartData[2] = avg;
}
function updateAttempts(isCorrect){
	var qnum = $('#question').data('qnum');
	var att = myGlobal.attempts[qnum];

	console.log(isCorrect);
	if(isCorrect){
		var attempts = myGlobal.count;
		att.push(attempts);
		myGlobal.count = 1;
		var total = att.reduce(function(a,b){return a+b;});
		var avg = Math.round(total / att.length * 10) / 10;
		
		var arr = myGlobal.attemptsChart[qnum + 1]
		arr[1] = attempts;
		arr[2] = avg;
	} else {
		myGlobal.count++;
	}
}
/*
	RedFrac
	
	Practice reducing fractions

	dependencies:
		-math.js
			-RationalNumber
		-jQuery
		
*/

/*global $, RedFrac, randomBetween, PreMath, 
	PointsSetting, ajaxer, renderMath, Timer, getDateTime, Timer, docCookies,
	recordResponse, gcd

*/


(function($global){
	$global.RedFrac = (function(){
		/* list of constants and whatnot */
		var exName = 'RedFrac';
		var level, FIRST_TRY;
		var CAN_SUBMIT;
		var skillSet = 'N/A at the moment';
		var answerN, answerD, probN, probD, IS_INT; 
		
		function renderProblem(){
			$('#rf-probN').text(probN);
			$('#rf-probD').text(probD);
			if(IS_INT){
				$('#rhs .rf-fraction').hide();
				$('#rf-intDiv').addClass('input').show();
			} else {
				$('#rhs .rf-fraction').show();
				$('#rf-intDiv').removeClass('input').hide();
			}
			
			PointsSetting.startBonusTimer();
		}
		function checkAnswer(n, d){
			return answerN == n && answerD == d;
		}
		
		//things not to mess with between exercises:
		
		
		return {
			init: function(args, lastProblem){
				if(typeof args == 'string') args = JSON.parse(args);
				//initialize stuff
				
				this.renderUI();
				this.loadProblem(lastProblem);
				renderMath();
			},
			loadProblem: function(toLoad){
				CAN_SUBMIT = true;
				FIRST_TRY = true;
				if(toLoad && toLoad != ''){
					toLoad = toLoad.split(',');
					answerN = toLoad[0];
					answerD = toLoad[1];
					probN = toLoad[2];
					probD = toLoad[3];
				} else {
					var d = randomBetween(1,10);
					var n = randomBetween(1,10);
					var factor = Math.ceil(Math.random() * 10);
					var g = gcd(n,d);
					answerN = d / g;
					answerD = n / g;
					probN = answerN * factor;
					probD = answerD * factor;
				}
				IS_INT = answerD == 1;
				
				//render the problem
				renderProblem();
				
				//start timer
				Timer.start();
				
				//save this problem as last problem on the server
				var lastProblem = [answerN, answerD, probN, probD];
				console.log(lastProblem);
				window.updateLastProblem({
			            userID : window.userID,
			            exercise : exName,
			            lastProblem : lastProblem + ''
			        })

				
			},
			submitResponse: function(){
				
				if(CAN_SUBMIT){
					var n = $((IS_INT ? '#rf-intDiv' : '#rf-answerN')).text();
					var d = IS_INT ? 1 : $('#rf-answerD').text();
					var isCorrect = checkAnswer(n, d);
					//reflect in UI / load new problem / put in wrong-pile if wrong
					if(!isCorrect){
						// append wrong-pile
						var wrong = $('<div></div>').text(n + '/' + d);
					} else {
						CAN_SUBMIT = false;
					}
					window.addToWrongResps(wrong);
					var probResp = JSON.stringify(probResp);
					var t = -1;
					window.processResponse('RedFrac', isCorrect, t, probResp, level, skillSet, FIRST_TRY);
					FIRST_TRY = false;
				}
			},
			startExercise: function(){
				//Move the following to the main js:
				
				PointsSetting.startBonusTimer();
			},
			stopExercise: function(){
				
			},
			//UI stuff
			renderUI: function($main){
				$main = $main ? $main : $('<div></div>')
						.attr('id','RedFrac-container')
						.addClass('ex-container');
				/*making the fraction div*/
				var answerDiv = '	<div class="rf-fraction">'
						+ '		<div id="rf-answerN" class="answer-input input rf-numer" contenteditable></div> '
						+ '		<div id="rf-answerD" class="answer-input input rf-denom" contenteditable></div> '
						+ '		<div class="rf-fracLine"></div> '
						+ '	</div>';
				var intDiv = '<div id="rf-intDiv" class="input" contenteditable></div>';
				var probDiv = '	<div class="rf-fraction">'
						+ '		<div id="rf-probN" class="rf-numer"></div> '
						+ '		<div id="rf-probD" class="rf-denom"></div> '
						+ '		<div class="rf-fracLine"></div> '
						+ '	</div>';
				$('#main-area').on('keydown', '.answer-input', function(e){
					if($(this).text().length > 2){
						e.preventDefault();
					}
				});
				

				var lhs = $('<div></div>').attr('id', 'lhs').append(probDiv);		// Left-hand side;
				var equal = $('<div></div>').html('=').attr('id', 'equal-sign');
				var rhs = $('<div></div>').attr('id', 'rhs').append(answerDiv, intDiv); // Right-hand side
				
				$main.append(lhs, equal, rhs);
				var checkAnswer = $('<div></div>')
						.addClass('button enter-target')
						.text('Check Answer')
						.attr('id', 'RedFrac-enter-target')
						.click(function(){
							RedFrac.submitResponse();
						})
						.css({
						    position: 'absolute',
						    bottom: '10px',										
						    right: '10px',
						    zIndex: 10
						});
				var obj = this;
				var loadProblemBtn = $(
							'<div id="load-RedFrac-problem" class="button load-problem-button">'
							+ 'New Problem</div>'
						).css({
							position: 'absolute',
						    bottom: '10px',
						    right: '10px',
						    zIndex: 20,
						    display: 'none',
						    background: 'white',
						    width: 125,
						    textAlign: 'center',
						}).click(function(){
							$(this).hide();
							obj.loadProblem();
            				$('#wrong-resps').empty();
						});
				$main.append(checkAnswer, loadProblemBtn);
				$('#main-area').append($main);
				
				$('#RedFrac-container').hide();
			},
			getExName: function(lang = 'eng'){
				if(lang == 'eng') return 'Fraction Reduction';
				else if(lang == 'kor') return '분수 약분';
			}
		};
	}());
	
}(window));
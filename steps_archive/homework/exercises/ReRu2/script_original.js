/*
	ReRu
	
	This exercise is meant to help students practice adding and subtracting fractions
	It can control following parameters:
		-Whether to make the denominators the same
		-Prsent proper fractions only
		-range of denominators
		-range of numbers

	dependencies:
		-math.js
			-RationalNumber
		-jQuery
		
*/

/*global $, ReRu, randomBetween, PreMath, 
	PointsSetting, ajaxer, renderMath, Timer, getDateTime, Timer, docCookies,
	recordResponse

*/


(function($global){
	$global.ReRu2 = (function(){
		/* list of constants and whatnot */
		var exName = 'ReRu2';
		var DIFFERENT_DENOM = false;
		var level;
		var CAN_SUBMIT;
		var skillSet = 'N/A at the moment';
		var FIRST_TRY, answer;
		var startPos, markBox; //operation
		
		/*
		'<div class="rr-mark-box">'
			'<div class="rr-rule-num"></div>'
			'<div class="rr-mark"></div>'
		'</div>'
		*/
		function renderProblem(){
			$('#rr-mark-boxes').empty();
			for(var i = startPos; i < startPos + 100; i++){
				var clone = markBox.clone(true);
				if(i == answer) clone.find('.rr-mark').addClass('ans-mark');
				if(i % 10 == 0){ // 1 cm marks
					clone.find('.rr-mark').addClass('rr-10');
					clone.find('.rr-rule-num').text(i/10);
				} else if(i % 5 == 0){ // 5mm marks
					clone.find('.rr-mark').addClass('rr-5');
				} else { // 1mm marks
					clone.find('.rr-mark').addClass('rr-1');
				}
				$('#rr-mark-boxes').append(clone);
				
				var offset = (answer - startPos) * 5 + 2.5;
				$('#rr-input-wrapper').css('left', offset);
			}
			
			PointsSetting.startBonusTimer();
		}
		function checkAnswer(input){
			return answer == input * 10;
		}
		
		//things not to mess with between exercises:
		
		
		return {
			init: function(args, lastProblem){
				if(typeof args == 'string') args = JSON.parse(args);
				//initialize stuff
				level = (args && args.level) || 0;
				
				//The main UI
				this.renderUI();
				this.loadProblem(lastProblem);
			},
			loadProblem: function(toLoad){
				CAN_SUBMIT = true;
				FIRST_TRY = true;
				var range = [100,400, 1000];
				startPos = Math.floor(Math.random() * range[level]);
				answer = Math.floor(Math.random() * 70) + startPos + 30;
				//render the problem
				renderProblem();
				
				//start timer
				Timer.start();
				
				//save this problem as last problem on the server
				window.updateLastProblem({
			            userID : window.userID,
			            exercise : exName,
			            lastProblem : answer
			        })

				
			},
			submitResponse: function(){
				var input = $('#rr-input').text();
				
				if(CAN_SUBMIT && input){
					var t = Timer.getRunningTime();
	
					var isCorrect = checkAnswer(input);
					//reflect in UI / load new problem / put in wrong-pile if wrong
					if(!isCorrect){
						// append wrong-pile
						var wrong = $('<div></div>').text(input);
					} else {
						CAN_SUBMIT = false;
					}
					window.addToWrongResps(wrong);
					
					window.processResponse('ReRu', isCorrect, t, input, level, skillSet, FIRST_TRY);
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
				$main = $main || $('<div></div>')
						.attr('id','ReRu-container')
						.addClass('ex-container');
				/*making the fraction div*/
				
				markBox = $(
						'<div class="rr-mark-box">'
						+	'<div class="rr-rule-num"></div>'
						+	'<div class="rr-mark"></div>'
						+'</div>'
				);
				
				$main.append($(
					'<div id="rr-ruler">'
					+	'<div id="rr-mark-boxes">'	
					+   '</div>'
					+	'<div id="rr-input-wrapper">'
					+		'<div id="rr-pointer">'
					+		'</div>'
					+		'<div id="rr-input" class="input" contenteditable>'
					+		'</div>'
					+	'</div>'
				   +'</div>'
				));
				
				
				var checkAnswer = $('<div></div>')
						.addClass('button enter-target')
						.text('Check Answer')
						.attr('id', 'ReRu-enter-target')
						.click(function(){
							ReRu.submitResponse();
						}).css({
						    position: 'absolute',
						    bottom: '10px',										
						    right: '10px',
						    zIndex: 10
						});
				var obj = this;
				var loadProblemBtn = $(
							'<div id="load-ReRu-problem" class="button load-problem-button">'
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
				
				$('#ReRu-container').hide();
			},
			getExName: function(lang = 'eng'){
				if(lang == 'eng') return 'Reading Ruler';
				else if(lang == 'kor') return '자 읽기';
			}
		};
	}());
	
}(window));
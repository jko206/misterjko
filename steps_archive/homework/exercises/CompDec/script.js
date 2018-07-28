/*
	CompDec
	
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
levels		format						# of terms	# of 0s	
1			1/10 numbers				3			0 /7	
2			1/10 numbers (hide 0)		3			1 /7
3			1/10, 1/100					3			0 /7
4			1/10, 1/100					5			1 /7
5			1/10, 1/100, 1/1000			5			1 /7
6			1/10, 1/100, 1/1000(hide 0)	5			2 /7
7			1/10, 1/100, 1/1000(hide 0)	8			3 /7

		
*/

/*global $, CompDec, randomBetween, PreMath, 
	PointsSetting, ajaxer, renderMath, Timer, getDateTime, Timer, docCookies,
	recordResponse

*/


(function($global){
	$global.CompDec = (function(){
		/* list of constants and whatnot */
		var exName = 'CompDec';
		var DIFFERENT_DENOM = false;
		var level;
		var CAN_SUBMIT;
		var skillSet = 'N/A at the moment';
		var FIRST_TRY, answer;
		var decs;
		
		
		/*
		'<div class="rr-mark-box">'
			'<div class="rr-rule-num"></div>'
			'<div class="rr-mark"></div>'
		'</div>'
		*/
		function renderProblem(){
			$('#cd-bottom-deck').empty();
			while(decs.length > 0){
				var dec = decs.shift();
				var decCard = $('<div class="cd-card">'+ dec +'</div>')
						.click(function(){
							var parent = $(this).parent().attr('id');
							var newParent = parent == 'cd-top-deck' 
									? '#cd-bottom-deck' : '#cd-top-deck';
							var card = $(this).detach();
							$(newParent).append(card);
						});
				$('#cd-top-deck').append(decCard);
			}
			
			//PointsSetting.startBonusTimer();
		}
		function checkAnswer(input){
			return answer.toString() == input.toString();
		}
		
		//things not to mess with between exercises:
		
		
		return {
			init: function(args, lastProblem){
				if(typeof args == 'string') args = JSON.parse(args);
				//initialize stuff
				level = (args && args.level) || 1;
				
				//The main UI
				this.renderUI();
				this.loadProblem(lastProblem);
			},
			loadProblem: function(toLoad){
				function randomDec(arr, length){
					var s = '', loops = 0;
					while(s.length < length && loops < 2000){
						var r = Math.floor(Math.random() * arr.length);
						s += arr[r];
						loops++;
					}
					return s;
				}
				CAN_SUBMIT = true;
				FIRST_TRY = true;
				var toSave = [];
				if(toLoad && toLoad.length){
					var copy = function(arr){
						var copy = [];
						for(var i = 0; i < arr.length; i++){
							copy.push(decs[i]);
						}
						return copy;
					};
					decs = toLoad;
					answer = copy(decs);
					toSave = copy(decs);
					answer.sort();
				} else {
					var lead = Math.round(Math.random() * (level < 3 ? 10 : 20));
					var decLength = (level < 3 && 1)
							|| (level < 5 && 2)
							|| 3;
					var randomDigits = (function(){
						var arr = (level < 2 && [])
								|| (level < 6 && [0])
								|| [0,0];
						while(arr.length < 7){
							var r = Math.floor(Math.random() * 10);
							arr.push(r);
						}
						return arr;
					}());
					answer = [];
					decs = [];
					
					var count = (level <= 3 && 3)
							|| (level <= 6 && 5)
							|| 8;
					var dropZeroes = level == 2 || level == 6 || level == 7;
					var loops = 0;
					
					//generate decimal numbers
					while(decs.length < count && loops < 2000){
						var dec = randomDec(randomDigits, decLength);
						while(dropZeroes && dec%10 == 0 && dec != 0) dec = dec/10;
						dec = lead + (dec != 0 ? '.' + dec : '');
						if(decs.indexOf(dec) == -1){
							decs.push(dec);
							toSave.push(dec);
							answer.push(dec);
						}
						loops++;
					}
					answer.sort();
				}
				
				//render the problem
				renderProblem();
				
				//start timer
				//Timer.start();
				//save this problem as last problem on the server
				// window.updateLastProblem({
			 //           userID : window.userID,
			 //           exercise : exName,
			 //           lastProblem : toSave
			 //       })

				
			},
			submitResponse: function(){
				var input = (function(){
					var arr = [];
					$('.cd-card').each(function(){
						var n = $(this).text();
						arr.push(n);
					})
					return arr;
				}());
				
				if(CAN_SUBMIT && input){
					var t = Timer.getRunningTime();
	
					var isCorrect = checkAnswer(input);
					//reflect in UI / load new problem / put in wrong-pile if wrong
					if(!isCorrect){
						// append wrong-pile
						var wrong = $('<div></div>').text(input);
					} else {
						//flash green
						$('.cd-card').effect('highlight', {
		                    color: 'green',
		                    easing: 'easeOutBack'
		                }, 1500)
						CAN_SUBMIT = false;
					}
					window.addToWrongResps(wrong);
					
					window.processResponse('CompDec', isCorrect, t, input, level, skillSet, FIRST_TRY);
					FIRST_TRY = false;
				}
			},
			startExercise: function(){
				//Move the following to the main js:
				
				//PointsSetting.startBonusTimer();
			},
			stopExercise: function(){
				
			},
			//UI stuff
			renderUI: function($main){
				$main = $main || $('<div></div>')
						.attr('id','CompDec-container')
						.addClass('ex-container');
				var topDeck = $('<div id="cd-top-deck"></div>');
				var bottomDeck = $('<div id="cd-bottom-deck"></div>');
				
				$('#main-area').height(320);
				
				$main.append(topDeck, bottomDeck);
				
				
				var checkAnswer = $('<div></div>')
						.addClass('button enter-target')
						.text('Check Answer')
						.attr('id', 'CompDec-enter-target')
						.click(function(){
							CompDec.submitResponse();
						}).css({
						    position: 'absolute',
						    bottom: '10px',										
						    right: '10px',
						    zIndex: 10
						});
				var obj = this;
				var loadProblemBtn = $(
							'<div id="load-CompDec-problem" class="button load-problem-button">'
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
				
				$('#CompDec-container').hide();
			},
			getExName: function(lang = 'eng'){
				if(lang == 'eng') return 'Compare Decimals';
				else if(lang == 'kor') return '소수 비교';
			}
		};
	}());
	
}(window));
/*
	BasicArithmetic
	
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

/*global $, BasicArithmetic, PreMath, 
	PointsSetting, ajaxer, renderMath, Timer, getDateTime, Timer, docCookies,
	recordResponse

*/


(function($global){
	$global.BasicArithmetic = (function(){
		/* list of constants and whatnot */
		var exName = 'BasicArithmetic';
		var level, CAN_SUBMIT, FIRST_TRY, ADDITIVE_LEVEL, MULTIPLICATIVE_LEVEL;
		var skillSet = 'N/A at the moment';
		var MAX_ADDITIVE, MIN_ADDITIVE, MAX_MULTIPLICATIVE, MIN_MULTIPLICATIVE;
		var t1, op1, t2, /*op2,*/ t3, answer;
		
		function renderProblem(){
			var op1Sign = (function(){
				if(op1 == 'add') return ' + ';
				if(op1 == 'sub') return ' - ';
				if(op1 == 'div') return ' &#247; ';
				if(op1 == 'mult') return ' &times; ';
			}());
			var exp = '' + t1 + op1Sign + t2;
			//if(op2 && t3) exp = exp + ' ' + op2 + ' ' + t3;
			$('#ba-lhs').html(exp);
			//renderMath();/////////////////////// KEEP ////////////
			$('#BasicArithmetic-container .input').text('');/////////////////////// KEEP ////////////
			PointsSetting.startBonusTimer();	/////////////////////// KEEP ////////////
		}
		function checkAnswer(rsp){
			return rsp == answer;
		}
		
		//things not to mess with between exercises:
		return {
			init: function(args, lastProblem){
				if(typeof args == 'string') args = JSON.parse(args);
				//initialize stuff
				level = args && args.level ? args.level : 11;
				ADDITIVE_LEVEL = (level + '')[0];
				MULTIPLICATIVE_LEVEL = (level + '')[1];
				if(ADDITIVE_LEVEL == 1){
					MAX_ADDITIVE = args && args.MAX_ADDITIVE ? args.MAX_ADDITIVE : 10;
					MIN_ADDITIVE = args && args.MIN_ADDITIVE ? args.MIN_ADDITIVE : 2;
				} else if(ADDITIVE_LEVEL == 2){
					MAX_ADDITIVE = args && args.MAX_ADDITIVE ? args.MAX_ADDITIVE : 50;
					MIN_ADDITIVE = args && args.MIN_ADDITIVE ? args.MIN_ADDITIVE : 2;
				} else if(ADDITIVE_LEVEL == 3){
					MAX_ADDITIVE = args && args.MAX_ADDITIVE ? args.MAX_ADDITIVE : 100;
					MIN_ADDITIVE = args && args.MIN_ADDITIVE ? args.MIN_ADDITIVE : 50;
				} else if(ADDITIVE_LEVEL == 4){
					MAX_ADDITIVE = args && args.MAX_ADDITIVE ? args.MAX_ADDITIVE : 500;
					MIN_ADDITIVE = args && args.MIN_ADDITIVE ? args.MIN_ADDITIVE : 50;
				} else if(ADDITIVE_LEVEL == 5){
					MAX_ADDITIVE = args && args.MAX_ADDITIVE ? args.MAX_ADDITIVE : 1000;
					MIN_ADDITIVE = args && args.MIN_ADDITIVE ? args.MIN_ADDITIVE : 50;
				} else if(ADDITIVE_LEVEL == 6){
					MAX_ADDITIVE = args && args.MAX_ADDITIVE ? args.MAX_ADDITIVE : 2000;
					MIN_ADDITIVE = args && args.MIN_ADDITIVE ? args.MIN_ADDITIVE : 100;
				} else if(ADDITIVE_LEVEL == 7){
					MAX_ADDITIVE = args && args.MAX_ADDITIVE ? args.MAX_ADDITIVE : 5000;
					MIN_ADDITIVE = args && args.MIN_ADDITIVE ? args.MIN_ADDITIVE : 500;
				}
				if(MULTIPLICATIVE_LEVEL == 1){
					MAX_MULTIPLICATIVE = args && args.MAX_MULTIPLICATIVE ? args.MAX_MULTIPLICATIVE : 10;
					MIN_MULTIPLICATIVE = args && args.MIN_MULTIPLICATIVE ? args.MIN_MULTIPLICATIVE : 2;
				} else if(MULTIPLICATIVE_LEVEL == 2){
					MAX_MULTIPLICATIVE = args && args.MAX_MULTIPLICATIVE ? args.MAX_MULTIPLICATIVE : 50;
					MIN_MULTIPLICATIVE = args && args.MIN_MULTIPLICATIVE ? args.MIN_MULTIPLICATIVE : 2;
				} else if(MULTIPLICATIVE_LEVEL == 3){
					MAX_MULTIPLICATIVE = args && args.MAX_MULTIPLICATIVE ? args.MAX_MULTIPLICATIVE : 100;
					MIN_MULTIPLICATIVE = args && args.MIN_MULTIPLICATIVE ? args.MIN_MULTIPLICATIVE : 10;
				} else if(MULTIPLICATIVE_LEVEL == 4){
					MAX_MULTIPLICATIVE = args && args.MAX_MULTIPLICATIVE ? args.MAX_MULTIPLICATIVE : 500;
					MIN_MULTIPLICATIVE = args && args.MIN_MULTIPLICATIVE ? args.MIN_MULTIPLICATIVE : 20;
				} else if(MULTIPLICATIVE_LEVEL == 5){
					MAX_MULTIPLICATIVE = args && args.MAX_MULTIPLICATIVE ? args.MAX_MULTIPLICATIVE : 1000;
					MIN_MULTIPLICATIVE = args && args.MIN_MULTIPLICATIVE ? args.MIN_MULTIPLICATIVE : 50;
				} else if(MULTIPLICATIVE_LEVEL == 6){
					MAX_MULTIPLICATIVE = args && args.MAX_MULTIPLICATIVE ? args.MAX_MULTIPLICATIVE : 2000;
					MIN_MULTIPLICATIVE = args && args.MIN_MULTIPLICATIVE ? args.MIN_MULTIPLICATIVE : 50;
				}
				//The main UI
				this.renderUI();				/////////////////////// KEEP ////////////
				this.loadProblem(lastProblem);	/////////////////////// KEEP ////////////
			},
			loadProblem: function(toLoad){
				CAN_SUBMIT = true;				/////////////////////// KEEP ////////////
				FIRST_TRY = true;				/////////////////////// KEEP ////////////
				if(toLoad && toLoad != '' && toLoad.indexOf(null) == -1){
					if(typeof toLoad == 'string') toLoad = JSON.parse(toLoad);
					t1 = parseInt(toLoad[0]);
					op1 = toLoad[1];
					t2 = parseInt(toLoad[2]);
					t3 = parseInt(toLoad[3]);
					answer = parseInt(toLoad[4]);
				} else {
					var isInverse = Math.floor(Math.random()*2) == 0;
					var isAdditive = Math.floor(Math.random()*2) == 0;
					if(isAdditive){
						op1 = isInverse ? 'sub' : 'add';
						var range = [MIN_ADDITIVE, MAX_ADDITIVE];
					} else {
						op1 = isInverse ? 'div' : 'mult'; //divide:  &#247; times:  &times; 
						range = [MIN_MULTIPLICATIVE, MAX_MULTIPLICATIVE];
					}
					t1 = PreMath.getRandomBetween(range[0], range[1]);
					t2 = PreMath.getRandomBetween(range[0], range[1]);
					
					if(isAdditive){
						t3 = t1 + t2;
						if(isInverse){
							var temp = t3;
							t3 = t1;
							t1 = temp;
						}
					} else { // it's multiplicative
						t3 = t1 * t2;
						if(isInverse){
							temp = t3;
							t3 = t1;
							t1 = temp;
						}
					}
					answer = t3;
				}
				
				//render the problem
				renderProblem();				/////////////////////// KEEP ////////////
				
				//start timer
				Timer.start();					/////////////////////// KEEP ////////////
				
				//save this problem as last problem on the server
				var lastProblem = [t1, op1, t2, t3, answer];
				lastProblem = JSON.stringify(lastProblem);						/////////////////////// KEEP ////////////
				window.updateLastProblem({										/////////////////////// KEEP ////////////
			            userID : window.userID,
			            exercise : exName,
			            lastProblem : lastProblem
			        })

				
			},
			submitResponse: function(){
				var resp = parseInt($('#ba-resp-input').text());
				if(CAN_SUBMIT && resp){					/////////////////////// KEEP ////////////
					var t = Timer.getRunningTime();								/////////////////////// KEEP ////////////
	
					var isCorrect = checkAnswer(resp);				/////////////////////// KEEP ////////////
					//reflect in UI / load new problem / put in wrong-pile if wrong
					if(!isCorrect){
						// append wrong-pile
						var wrong = $('<div>'+ resp+ '</div>');
					} else {
						CAN_SUBMIT = false;
					}
					window.addToWrongResps(wrong);
					
					var probResp = [t1, op1, t2, answer, resp, isCorrect];	/////////////////////// KEEP ////////////
					probResp = JSON.stringify(probResp);				/////////////////////// KEEP ////////////
					
					window.processResponse('BasicArithmetic', isCorrect, t, probResp, level, skillSet, FIRST_TRY);/////////////////////// KEEP ////////////
					FIRST_TRY = false;/////////////////////// KEEP ////////////
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
						.attr('id','BasicArithmetic-container')
						.addClass('ex-container');
				var equation = $(
							'<div id="ba-equation" style="font-size: 50px;">'
							+'	<div id="ba-lhs">'
							+'	</div>'
							+'	<div id="ba-equal-sign" style="display: inline-block;'
							+'		vertical-align: -webkit-baseline-middle;">'
							+'		='
							+'  </div>'
							+'	<div id="ba-rhs" style="display: inline-block;">'
							+'		<div class="input" id="ba-resp-input" contenteditable style="width: 175px;">'
							+'		</div>'
							+'	</div>'
							+'</div>'
						);
				$main.append(equation);
				var checkAnswer = $(
							'<div class="button enter-target" id="ba-enter-target">'
							+ 'Check Answer'
							+'</div>'
						).click(function(){
							BasicArithmetic.submitResponse();				/////////////////////// KEEP ////////////
						}).css({
							position: 'absolute',
							bottom:	'10px',
							right: '10px',
							zIndex: 10,
							width: '125px'
						});												/////////////////////// KEEP ////////////
				var obj = this;
				var loadProblemBtn = $(										/////////////////////// KEEP ////////////
							'<div id="load-BasicArithmetic-problem" class="button load-problem-button">'
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
						}).click(function(){								/////////////////////// KEEP ////////////
							$(this).hide();
							obj.loadProblem();
            				$('#wrong-resps').empty();
						});
				$main.append(checkAnswer, loadProblemBtn);
				$('#main-area').append($main);
				
				$('#BasicArithmetic-container').hide();						/////////////////////// KEEP ////////////
			},
			getExName: function(lang = 'eng'){
				if(lang == 'eng') return 'Basic Arithmetic';
				else if(lang == 'kor') return '기본 산수';
			}
			
			,getAnswer(){
				return answer;
			}
		};
	}());
	
}(window));
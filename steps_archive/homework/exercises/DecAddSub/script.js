/*
	DecAddSub
	
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

/*global $, DecAddSub, PreMath, 
	PointsSetting, ajaxer, renderMath, Timer, getDateTime, Timer, docCookies,
	recordResponse

*/


(function($global){
	$global.DecAddSub = (function(){
		/* list of constants and whatnot */
		var exName = 'DecAddSub';
		var level, CAN_SUBMIT, FIRST_TRY, ADDITIVE_LEVEL, MULTIPLICATIVE_LEVEL;
		var skillSet = 'N/A at the moment';
		var denoms, useT3;
		var t1, op1, t2, op2, t3, answer;
		
		function renderProblem(){
			var getDecimal = true;
			var exp = '' + t1.toString({getDecimal}) + op1 + t2.toString({getDecimal});
			if(useT3){
				exp += op2 + t3.toString({getDecimal});
			}
			$('#das-lhs').html(exp);
			//renderMath();/////////////////////// KEEP ////////////
			$('#DecAddSub-container .input').text('');/////////////////////// KEEP ////////////
			PointsSetting.startBonusTimer();	/////////////////////// KEEP ////////////
		}
		function checkAnswer(rsp){
			//console.log(rsp, answer.toString());
			return rsp == answer.toString({getDecimal: true});
		}
		
		//things not to mess with between exercises:
		return {
			init: function(args, lastProblem){
				if(typeof args == 'string') args = JSON.parse(args);
				//initialize stuff
				level = args && args.level ? args.level : 1;
				var pow = Math.ceil(level / 2);
				denoms = PreMath.powersOf(10, pow);
				useT3 = level%2 == 0;
				//The main UI
				this.renderUI();				/////////////////////// KEEP ////////////
				this.loadProblem(lastProblem);	/////////////////////// KEEP ////////////
			},
			loadProblem: function(toLoad){
				CAN_SUBMIT = true;				/////////////////////// KEEP ////////////
				FIRST_TRY = true;				/////////////////////// KEEP ////////////
				function getDenom(){
					var r = Math.random() * denoms.length;
					r = Math.floor(r);
					return denoms[r];
				}
				if(toLoad && toLoad != '' && toLoad.indexOf(null) == -1){
					toLoad = JSON.parse(toLoad);
					t1 = new PreMath.RationalNumber(toLoad[0]);
					op1 = toLoad[1];
					t2 = new PreMath.RationalNumber(toLoad[2]);
					
					if(toLoad[3] && toLoad[4] && toLoad[3] != '' && toLoad[4] != ''){
						//console.log(toLoad);
						op2 = toLoad[3];
						t3 = new PreMath.RationalNumber(toLoad[4]);
					}
					answer = op1 == ' + ' ? t1.add(t2, true) : t1.sub(t2, true);
				} else {
					op1 = (Math.round(Math.random()) == 0) ? ' + ' : ' - ';
					op2 = (Math.round(Math.random()) == 0) ? ' + ' : ' - ';
					
					var tempD1 = getDenom();
					var tempN1 = PreMath.getRandomBetween(tempD1, tempD1 * 2);
					t1 = new PreMath.RationalNumber([tempN1, tempD1]);
					
					var tempD2 = getDenom();
					var tempN2 = PreMath.getRandomBetween(1, tempD2-2);
					t2 = new PreMath.RationalNumber([tempN2, tempD2]);
					
					var tempD3 = getDenom();
					var tempN3 = PreMath.getRandomBetween(1, tempD3-2);
					t3 = new PreMath.RationalNumber([tempN3, tempD3]);
					
					if(!(op1 == ' + ' && op2 == ' + ')){
						var sum = t2.add(t3, true);
						while(sum.isGT(t1)){
							tempD1 = getDenom();
							tempN1 = PreMath.getRandomBetween(1, tempD1 * 2);
							t1 = new PreMath.RationalNumber([tempN1, tempD1]);
						}
					}
				}
				answer = t1[op1 == ' + ' ? 'add' : 'sub'](t2, true);
				if(useT3) answer = answer[op2 == ' + ' ? 'add' : 'sub'](t3, true);
				
				//render the problem
				renderProblem();				/////////////////////// KEEP ////////////
				
				//start timer
				Timer.start();					/////////////////////// KEEP ////////////
				
				//save this problem as last problem on the server
				var o = {getDecimal: true};
				var lastProblem = [t1.toString(o), op1, t2.toString(o), (op2 ? op2 : ''), (t3 ? t3.toString(o): ''), answer.toString(o)];
				lastProblem = JSON.stringify(lastProblem);						/////////////////////// KEEP ////////////
				window.updateLastProblem({										/////////////////////// KEEP ////////////
			            userID : window.userID,
			            exercise : exName,
			            lastProblem : lastProblem
			        })

				
			},
			submitResponse: function(){
				var resp = parseFloat($('#das-resp-input').text());
				if(CAN_SUBMIT && resp || resp == 0){					/////////////////////// KEEP ////////////
					var t = Timer.getRunningTime();								/////////////////////// KEEP ////////////
	
					var isCorrect = checkAnswer(resp);				/////////////////////// KEEP ////////////
					//reflect in UI / load new problem / put in wrong-pile if wrong
					
					if(!isCorrect){
						// append wrong-pile
						var wrong = $('<div>'+ resp+ '</div>');
					} else {
						CAN_SUBMIT = false;
						// console.log('here');
					}
					window.addToWrongResps(wrong);
					var o = {getDecimal: true};
					var probResp = [t1.toString(o), op1, t2.toString(o), answer, resp, isCorrect];	/////////////////////// KEEP ////////////
					probResp = JSON.stringify(probResp);				/////////////////////// KEEP ////////////
					
					window.processResponse('DecAddSub', isCorrect, t, probResp, level, skillSet, FIRST_TRY);/////////////////////// KEEP ////////////
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
						.attr('id','DecAddSub-container')
						.addClass('ex-container');
				var equation = $(
							'<div id="das-equation" style="font-size: 50px;">'
							+'	<div id="das-lhs">'
							+'	</div>'
							+'	<div id="das-equal-sign" style="display: inline-block;'
							+'		vertical-align: -webkit-baseline-middle;">'
							+'		='
							+'  </div>'
							+'	<div id="das-rhs" style="display: inline-block;">'
							+'		<div class="input" id="das-resp-input" contenteditable style="width: 175px;">'
							+'		</div>'
							+'	</div>'
							+'</div>'
						);
				$main.append(equation);
				var checkAnswer = $(
							'<div class="button enter-target" id="das-enter-target">'
							+ 'Check Answer'
							+'</div>'
						).click(function(){
							DecAddSub.submitResponse();				/////////////////////// KEEP ////////////
						}).css({
							position: 'absolute',
							bottom:	'10px',
							right: '10px',
							zIndex: 10,
							width: '125px'
						});												/////////////////////// KEEP ////////////
				var obj = this;
				var loadProblemBtn = $(										/////////////////////// KEEP ////////////
							'<div id="load-DecAddSub-problem" class="button load-problem-button">'
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
				
				$('#DecAddSub-container').hide();						/////////////////////// KEEP ////////////
			},
			getExName: function(lang = 'eng'){
				if(lang == 'eng') return 'Decimal Addition/Subtraction';
				else if(lang == 'kor') return '소수 덧뺄셈';
			}
			
			,getAnswer(){
				return answer;
			}
		};
	}());
	
}(window));
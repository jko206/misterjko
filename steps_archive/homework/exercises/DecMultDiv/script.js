/*
    DecMultDiv
    
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

/*global $, DecMultDiv, PreMath, 
	PointsSetting, ajaxer, renderMath, Timer, getDateTime, Timer, docCookies,
	recordResponse

*/


(function($global){
	$global.DecMultDiv = (function(){
		/* list of constants and whatnot */
		var exName = 'DecMultDiv';
		var level, CAN_SUBMIT, FIRST_TRY, ADDITIVE_LEVEL, MULTIPLICATIVE_LEVEL;
		var skillSet = 'N/A at the moment';
		var denoms, useT3;
		var t1, op, t2, op2, t3, answer;
		
		function renderProblem(){
			var getDecimal = true;
			//var exp = '' + t1.toString({getDecimal}) + op + t2.toString({getDecimal});
            var exp = `${t1} ${op} ${t2}`;
			if(useT3){
				exp += op2 + t3.toString({getDecimal});
			}
			$('#dmd-lhs').html(exp);
			//renderMath();/////////////////////// KEEP ////////////
			$('#DecMultDiv-container .input').text('');/////////////////////// KEEP ////////////
			PointsSetting.startBonusTimer();	/////////////////////// KEEP ////////////
		}
		function checkAnswer(rsp){
			//console.log(rsp, answer.toString());
			return rsp == answer;
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
					t1 = toLoad.t1;
                    t2 = toLoad.t2;
                    op = toLoad.op;
                    answer = toLoad.answer;
				} else {
					op = (Math.round(Math.random()) == 0) ? ' &times; ' : ' &divide; ';
					op2 = (Math.round(Math.random()) == 0) ? ' &times; ' : ' &divide; ';
//					
//					var tempD1 = getDenom();
//					var tempN1 = PreMath.getRandomBetween(tempD1, tempD1 * 2);
//					t1 = new PreMath.RationalNumber([tempN1, tempD1]);
//					
//					var tempD2 = getDenom();
//					var tempN2 = PreMath.getRandomBetween(1, tempD2-2);
//					t2 = new PreMath.RationalNumber([tempN2, tempD2]);
//					
//					t3 = t1.times(t2, true);
					
                    t1 = Math.floor(Math.random() * 90) + 10;
                    t2 = Math.floor(Math.random() * 90) + 10;
                    t3 = t1 * t2;
                    var d1 = getDenom();
                    var d2 = getDenom();
                    console.log(t1, t2, t3, op, d1, d2);
                    t1 /= d1;
                    t2 /= d2;
                    t3 /= (d1 * d2);
                    
					if(op == '&times;'){
						answer = t3;
					} else {
						answer = t1;
						t1 = t3;
					}
				}
				console.log(t1, t2, t3, answer);				
				//render the problem
				renderProblem();				/////////////////////// KEEP ////////////
				
				//start timer
				Timer.start();					/////////////////////// KEEP ////////////
				
				//save this problem as last problem on the server
				var o = {getDecimal: true};
				var lastProblem = {t1, t2, op, answer};
				lastProblem = JSON.stringify(lastProblem);						/////////////////////// KEEP ////////////
				window.updateLastProblem({										/////////////////////// KEEP ////////////
			            userID : window.userID,
			            exercise : exName,
			            lastProblem : lastProblem
			        })

				
			},
			submitResponse: function(){
				var resp = parseFloat($('#dmd-resp-input').text());
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
					var probResp = [t1, op, t2, answer, resp, isCorrect];	/////////////////////// KEEP ////////////
					probResp = JSON.stringify(probResp);				/////////////////////// KEEP ////////////
					
					window.processResponse('DecMultDiv', isCorrect, t, probResp, level, skillSet, FIRST_TRY);/////////////////////// KEEP ////////////
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
						.attr('id','DecMultDiv-container')
						.addClass('ex-container');
				var equation = $(
							'<div id="dmd-equation" style="font-size: 50px;">'
							+'	<div id="dmd-lhs">'
							+'	</div>'
							+'	<div id="dmd-equal-sign" style="display: inline-block;'
							+'		vertical-align: -webkit-baseline-middle;">'
							+'		='
							+'  </div>'
							+'	<div id="dmd-rhs" style="display: inline-block;">'
							+'		<div class="input" id="dmd-resp-input" contenteditable style="width: 175px;">'
							+'		</div>'
							+'	</div>'
							+'</div>'
						);
				$main.append(equation);
				var checkAnswer = $(
							'<div class="button enter-target" id="dmd-enter-target">'
							+ 'Check Answer'
							+'</div>'
						).click(function(){
							DecMultDiv.submitResponse();				/////////////////////// KEEP ////////////
						}).css({
							position: 'absolute',
							bottom:	'10px',
							right: '10px',
							zIndex: 10,
							width: '125px'
						});												/////////////////////// KEEP ////////////
				var obj = this;
				var loadProblemBtn = $(										/////////////////////// KEEP ////////////
							'<div id="load-DecMultDiv-problem" class="button load-problem-button">'
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
				
				$('#DecMultDiv-container').hide();						/////////////////////// KEEP ////////////
			},
			getExName: function(lang = 'eng'){
				if(lang == 'eng') return 'Decimal Multiplication/Division';
				else if(lang == 'kor') return '소수 곱나눗셈';
			}
			
			,getAnswer(){
				return answer;
			}
		};
	}());
	
}(window));
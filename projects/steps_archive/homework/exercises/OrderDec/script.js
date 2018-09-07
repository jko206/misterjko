/*
	OrderDec
	
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

/*global $, OrderDec, randomBetween, PreMath, 
	PointsSetting, ajaxer, renderMath, Timer, getDateTime, Timer, docCookies,
	recordResponse

*/


(function($global){
	$global.OrderDec = (function(){
		/* list of constants and whatnot */
		var exName = 'OrderDec';
		var DIFFERENT_DENOM = false;
		var DENOMS;
		var WHOLE_UPPER_LIMIT;
		var level;
		var CAN_SUBMIT;
		var skillSet = 'N/A at the moment';
		var frac1, frac2, frac3, answer, op1, op2, FIRST_TRY; //operation
		
		function renderProblem(){
			var sign1 = op1 == 'plus' ? ' + ' : ' - ';
			var sign2 = op2 == 'plus' ? ' + ' : ' - ';
			var str = '$' 
					+ frac1.toString({toMathJax: true, mixedNum: true, getOrigDenom: true}) 
					+ sign1 + frac2.toString({toMathJax: true, mixedNum: true, getOrigDenom: true}) 
					+ sign2 + frac3.toString({toMathJax: true, mixedNum: true, getOrigDenom: true}) 
					+ '$';
					
			$('#lhs').html(str);
			renderMath();
			$('#OrderDec-container .input').text('');
			$('#whole').focus();
			PointsSetting.startBonusTimer();
		}
		function checkAnswer(w, n, d){
			w = w == '' ? 0 : parseInt(w, 10);
			n = n == '' ? 0 : parseInt(n, 10);
			d = d == '' ? 1 : parseInt(d, 10);
			return answer.isEqualTo([w,n,d]);
		}
		
		//things not to mess with between exercises:
		
		
		return {
			init: function(args, lastProblem){
				if(typeof args == 'string') args = JSON.parse(args);
				//initialize stuff
				WHOLE_UPPER_LIMIT = args && args.maxInt ? args.maxInt : 10;
				DIFFERENT_DENOM = args && args.diffDenom ? args.diffDenom : true;
				level = args && args.level ? args.level : 1;
				if(level == 1){ DENOMS = [2,3,6];}
				else if(level == 2){ DENOMS = [2,3,4,6,8,12];}
				else if(level == 3){ DENOMS = [2,3,4,5,6,7,8,9,12];}
				//The main UI
				this.renderUI();
				this.loadProblem(lastProblem);
				renderMath();
			},
			loadProblem: function(toLoad){
				CAN_SUBMIT = true;
				FIRST_TRY = true;
				if(toLoad && toLoad != ''){
					//lastProblem --> [frac1, op1, frac2, op2, frac3];
					toLoad = JSON.parse(toLoad);
					frac1 = JSON.parse(toLoad[0]);
					frac2 = JSON.parse(toLoad[2]);
					frac3 = JSON.parse(toLoad[4]);
					answer = JSON.parse(toLoad[5]);
					
					frac1 = new PreMath.RationalNumber(frac1);
					frac2 = new PreMath.RationalNumber(frac2);
					frac3 = new PreMath.RationalNumber(frac3);
					answer = new PreMath.RationalNumber(answer);
					
					op1 = toLoad[1];
					op2 = toLoad[3];
				} else {
					var w2 = Math.ceil(Math.random() * 4);
					var w3 = Math.ceil(Math.random() * 4);
					var w1 = Math.ceil(Math.random() * 3) + 3 + w2 + w3;
					var r = Math.floor(Math.random() * DENOMS.length);
					var d1 = DENOMS[r];
					r = Math.floor(Math.random() * DENOMS.length);
					var d2 = DENOMS[r];
					r = Math.floor(Math.random() * DENOMS.length);
					var d3 = DENOMS[r];
					var n1 = Math.ceil(Math.random() * (d1 - 1));
					var n2 = Math.ceil(Math.random() * (d2 - 1));
					var n3 = Math.ceil(Math.random() * (d3 - 1));
					op1 = Math.floor(Math.random() * 2) == 0 ? 'plus' : 'minus';
					op2 = Math.floor(Math.random() * 2) == 0 ? 'plus' : 'minus';
					
					frac1 = new PreMath.RationalNumber([w1 * d1 + n1, d1]);
					frac2 = new PreMath.RationalNumber([w2 * d2 + n2, d2]);
					frac3 = new PreMath.RationalNumber([w3 * d3 + n3, d3]);
									
					answer = new PreMath.RationalNumber(frac1);
					answer = op1 == 'plus' ? answer.add(frac2) : answer.sub(frac2);
					answer = op2 == 'plus' ? answer.add(frac3) : answer.sub(frac3);
				}
				
				//render the problem
				renderProblem();
				
				//start timer
				Timer.start();
				
				//save this problem as last problem on the server
				var lastProblem = [frac1.toString({getOrigDenom: true}), op1, 
						frac2.toString({getOrigDenom: true}), op2, 
						frac3.toString({getOrigDenom: true}), answer.toString()
				];
				lastProblem = JSON.stringify(lastProblem);
				window.updateLastProblem({
			            userID : window.userID,
			            exercise : exName,
			            lastProblem : lastProblem
			        })

				
			},
			submitResponse: function(){
				var whole = $('#whole').text();
				var numer = $('#numer').text();
				var denom = $('#denom').text();
				
				if(CAN_SUBMIT && (whole || numer || denom)){
					var t = Timer.getRunningTime();
					var response = [whole, numer, denom];
	
					var isCorrect = checkAnswer(whole,numer,denom);
					//reflect in UI / load new problem / put in wrong-pile if wrong
					if(!isCorrect){
						// append wrong-pile
						whole = whole ? whole : 0;
						numer = numer ? numer : 0;
						denom = denom ? denom : 1;
						var mathjax = (new PreMath.RationalNumber([whole,numer,denom]))
								.toString({toMathJax: true, mixedNum: true, wrapper: '$'});
						var wrong = $('<div></div>').text(mathjax);
					} else {
						CAN_SUBMIT = false;
					}
					window.addToWrongResps(wrong);
					var probResp = [frac1.getFrac(), op1, frac2.getFrac(), op2, frac3.getFrac(), response, isCorrect];
					probResp = JSON.stringify(probResp);
					
					window.processResponse('OrderDec', isCorrect, t, probResp, level, skillSet, FIRST_TRY);
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
						.attr('id','OrderDec-container')
						.addClass('ex-container');
				/*making the fraction div*/
				var fracDiv = '	<div id="fraction" class="fraction">'
						+ '		<div id="whole" class="answer-input input whole" contenteditable></div> '
						+ '		<div id="numer" class="answer-input input whole" contenteditable></div> '
						+ '		<div id="denom" class="answer-input input whole" contenteditable></div> '
						+ '		<div id="fracLine" class="fracLine"></div> '
						+ '	</div>';
				$('#main-area').on('keydown', '.answer-input', function(e){
					if($(this).text().length > 2){
						e.preventDefault();
					}
				});
				

				var lhs = $('<div></div>').attr('id', 'lhs');		// Left-hand side;
				var equal = $('<div></div>').html('=').attr('id', 'equal-sign');
				var rhs = $('<div></div>').attr('id', 'rhs').append(fracDiv); // Right-hand side
				
				$main.append(lhs, equal, rhs);
				var checkAnswer = $('<div></div>')
						.addClass('button enter-target')
						.text('Check Answer')
						.attr('id', 'OrderDec-enter-target')
						.click(function(){
							OrderDec.submitResponse();
						})
						.css({
						    position: 'absolute',
						    bottom: '10px',										
						    right: '10px',
						    zIndex: 10
						});
				var obj = this;
				var loadProblemBtn = $(
							'<div id="load-OrderDec-problem" class="button load-problem-button">'
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
				
				$('#OrderDec-container').hide();
			},
			getExName: function(lang = 'eng'){
				if(lang == 'eng') return 'Fraction Add/Sub';
				else if(lang == 'kor') return '분수 덧뺄셈';
			}
		};
	}());
	
}(window));
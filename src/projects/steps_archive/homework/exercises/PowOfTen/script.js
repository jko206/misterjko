/*
	PowOfTen
	
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

/*global $, PowOfTen, PreMath, 
	PointsSetting, ajaxer, renderMath, Timer, getDateTime, Timer, docCookies,
	recordResponse

*/


(function($global){
	$global.PowOfTen = (function(){
		/* list of constants and whatnot */
		var exName = 'PowOfTen';
		var level, CAN_SUBMIT, FIRST_TRY, ADDITIVE_LEVEL, MULTIPLICATIVE_LEVEL;
		var skillSet = 'N/A at the moment';
		var min, max, mag, compMinToMax, direction, decPlaces, bigOrSmall;
		var UIP_DIR_IS_LEFT = true;
		var UIP_BOS_IS_BIG = true;
		var useDecimal, answer, currProb;
		
		function renderProblem(){
			if(compMinToMax){
				$('.pot-num1').text(min);
				$('.pot-num2').text(max);
			} else {
				$('.pot-num1').text(max);
				$('.pot-num2').text(min);
			}
			//renderMath();/////////////////////// KEEP ////////////
			//$('#ntw-num-word').text('');/////////////////////// KEEP ////////////
			PointsSetting.startBonusTimer();	/////////////////////// KEEP ////////////
		}
		function checkAnswer(rsp){
			return (
				(direction == 'right') == ($('#pot-uip-dir').text() == '오른쪽')
				&& (decPlaces == $('#pot-uip-decPlaces').val())
				&& (mag == $('#pot-uip-mag').text())
				&& ((bigOrSmall == 'big') == ($('#pot-uip-bigOrSmall').text() == '크다'))
			);
		}
		
		//things not to mess with between exercises:
		return {
			init: function(args, lastProblem){
				if(typeof args == 'string') args = JSON.parse(args);
				//initialize stuff
				level = args && args.level ? args.level : 1;
				if(level < 3){
					useDecimal = false;
				}

				//The main UI
				this.renderUI();				/////////////////////// KEEP ////////////
				this.loadProblem(lastProblem);	/////////////////////// KEEP ////////////
			},
			loadProblem: function(toLoad){
				CAN_SUBMIT = true;				/////////////////////// KEEP ////////////
				FIRST_TRY = true;				/////////////////////// KEEP ////////////

				var base = PreMath.getRandomBetween(2,50);
				var a =  PreMath.getRandomBetween(1,6);
				var b = a;
				while(b == a){
					b = PreMath.getRandomBetween(1,6);
				}
				decPlaces = Math.abs(a-b);
				
				min = Math.pow(10, Math.min(a,b)) * base;
				max = Math.pow(10, Math.max(a,b)) * base;
				mag = Math.pow(10, Math.abs(decPlaces));
				
				compMinToMax = Math.floor(Math.random() * 2) == 0;
				
				if(compMinToMax){
					// `min`에서 소숫점을 `direction`으로 `decPlaces` 자리 옮기면 `max`가 됨으로
					// `min`은 `max`보다 `mag`배 `bigOrSmall`하다 
					direction = 'right', bigOrSmall = 'small';
				} else {
					// `max`에서 소숫점을 `direction`으로 `decPlaces` 자리 옮기면 `min`이 됨으로
					// `max`는 `min`보다 `mag`배 `bigOrSmall`하다 
					direction = 'left', bigOrSmall = 'big';
				}
				
				
				
				//render the problem
				renderProblem();				/////////////////////// KEEP ////////////
				//start timer
				Timer.start();					/////////////////////// KEEP ////////////
				
				//save this problem as last problem on the server
				var lastProblem = [min, max, mag, compMinToMax, direction, bigOrSmall];									/////////////////////// KEEP ////////////
				currProb = lastProblem;
				window.updateLastProblem({										/////////////////////// KEEP ////////////
			            userID : window.userID,
			            exercise : exName,
			            lastProblem : lastProblem
			        });

				
			},
			submitResponse: function(){
				if(CAN_SUBMIT){					/////////////////////// KEEP ////////////
					var t = Timer.getRunningTime();								/////////////////////// KEEP ////////////
					
					var isCorrect = checkAnswer();				/////////////////////// KEEP ////////////
					//reflect in UI / load new problem / put in wrong-pile if wrong
					console.log(isCorrect);
					var resp = [
							$('#pot-uip-dir').text(),
							$('#pot-uip-decPlaces').val(),
							$('#pot-uip-mag').text(),
							$('#pot-uip-bigOrSmall').text()
						];
					if(!isCorrect){
						// append wrong-pile
						var wrong = $('<div>'+ resp+ '</div>');
					} else {
						CAN_SUBMIT = false;
						// console.log('here');
					}
					window.addToWrongResps(wrong);
					var probResp = [currProb, resp, isCorrect];	/////////////////////// KEEP ////////////
					probResp = JSON.stringify(probResp);				/////////////////////// KEEP ////////////
					
					window.processResponse('PowOfTen', isCorrect, t, probResp, level, skillSet, FIRST_TRY);/////////////////////// KEEP ////////////
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
				$main = $main ? $main : $('<div id="PowOfTen-container" class="ex-container"></div>')
				var equation = $(
							' <div id="pot-problem">'
							+'	<span class="pot-num1"></span>에서 소숫점을 <span id="pot-uip-dir" class="pot-uip">왼쪽</span>으로'
							+'	<input type="number" id="pot-uip-decPlaces" value="0" min="0" class="pot-uip">자리 옮기면 '
							+'	<span class="pot-num2"></span>이(가) 됨으로 <span class="pot-num1"></span>은(는)'
							+'	<span class="pot-num2"></span>보다 <span id="pot-uip-mag" class="pot-uip" contenteditable></span>'
							+'	배 <span id="pot-uip-bigOrSmall" class="pot-uip">크다</span>'
							+'</div>'
							// `min`에서 소숫점을 `direction`으로 `decPlaces` 자리 옮기면 `max`가 됨으로
							// `min`은 `max`보다 `mag`배 `bigOrSmall`하다 
						);
				$(equation).ready(function(){
					$('#pot-uip-dir').click(function(){
						UIP_DIR_IS_LEFT = !UIP_DIR_IS_LEFT;
						if(UIP_DIR_IS_LEFT) var dir = '왼쪽';
						else dir = '오른쪽';
						$(this).text(dir);
					});
					$('#pot-uip-bigOrSmall').click(function(){
						UIP_BOS_IS_BIG = !UIP_BOS_IS_BIG;
						if(UIP_BOS_IS_BIG) var bos = '크다';
						else bos = '작다';
						$(this).text(bos);
					});
					$('#pot-uip-mag').keydown(function(e){
						var key = e.which;
						var text = $(this).text();
						if(key == 38){ // up key
							if(text == ''){
								text = 1;
							} 
							text += '0';
						} else if (key == 40) { //down key
							text = parseInt(text, 10);
							text /= 10;
							if(isNaN(text) || text < 1) text = 1;
						} else {
							e.preventDefault();
						}
						$(this).text(text);
					});
					$('.pot-uip').css({
						'background-color' : '#cccccc',
						'border' : '1px solid black',
						'box-sizing' : 'border-box'
					});
					$('#pot-uip-decPlaces').width(30).css({
						'text-align' : 'center'
					});
					$('#pot-uip-mag').css({
						'display' : 'inline-block',
						'width' : 100,
						'height' : 20,
						'text-align' : 'center'
					});
				});
				$main.append(equation);
				
				
				var checkAnswer = $(
							'<div class="button enter-target" id="pot-enter-target">'
							+ 'Check Answer'
							+'</div>'
						).click(function(){
							PowOfTen.submitResponse();				/////////////////////// KEEP ////////////
						}).css({
							position: 'absolute',
							bottom:	'10px',
							right: '10px',
							zIndex: 10,
							width: '125px'
						});												/////////////////////// KEEP ////////////
				var obj = this;
				var loadProblemBtn = $(										/////////////////////// KEEP ////////////
							'<div id="load-PowOfTen-problem" class="button load-problem-button">'
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
				
				$('#PowOfTen-container').hide();						/////////////////////// KEEP ////////////
			},
			getExName: function(lang = 'eng'){
				if(lang == 'eng') return 'Decimal Point Placement Practice';
				else if(lang == 'kor') return '소숫점 자리 연습';
			}
			
			,getAnswer(){
				return answer;
			}
		};
	}());
	
}(window));
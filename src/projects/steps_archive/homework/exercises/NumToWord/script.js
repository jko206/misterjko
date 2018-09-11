/*
	NumToWord
	
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

/*global $, NumToWord, PreMath, 
	PointsSetting, ajaxer, renderMath, Timer, getDateTime, Timer, docCookies,
	recordResponse

*/


(function($global){
	$global.NumToWord = (function(){
		/* list of constants and whatnot */
		var exName = 'NumToWord';
		var level, CAN_SUBMIT, FIRST_TRY, ADDITIVE_LEVEL, MULTIPLICATIVE_LEVEL;
		var skillSet = 'N/A at the moment';
		var num, answer;
		
		function renderProblem(){
			$('#ntw-number').text(num);
			//renderMath();/////////////////////// KEEP ////////////
			$('#ntw-num-word').text('');/////////////////////// KEEP ////////////
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

				//The main UI
				this.renderUI();				/////////////////////// KEEP ////////////
				this.loadProblem(lastProblem);	/////////////////////// KEEP ////////////
			},
			loadProblem: function(toLoad){
				CAN_SUBMIT = true;				/////////////////////// KEEP ////////////
				FIRST_TRY = true;				/////////////////////// KEEP ////////////
				var words = ['', '일', '이', '삼', '사', '오', 
					'육', '칠', '팔', '구'];
				var places = ['', '만', '억', '조'];
				
				function ntw(number, str, digitsDone){
					if(number == 0) return str;
					else {
						var lastDigit = number % 10;
						number = Math.floor(number/10);
			///////////////////TO FIX ////////////////////////
			//-when the 만 digit is 0, it's omitted from the answer
			///////////////////TO FIX ////////////////////////
						if(lastDigit != 0){
							var temp = words[lastDigit];
							if(digitsDone%4 == 1) temp += '십';
							if(digitsDone%4 == 2) temp += '백';
							if(digitsDone%4 == 3) temp += '천';
							str = digitsDone%4 != 0 ? temp + str : str;
							if(digitsDone%4 == 0){
								str = temp + places[digitsDone/4] + str;	
							} 
							
						}
						digitsDone++;
						return ntw(number, str, digitsDone);
					}
				}
				
				if(toLoad){
					num = toLoad;	
				} else if(level == 1){
					num = PreMath.getRandomBetween(1000, 99999);
				} else if(level == 2){
					num = PreMath.getRandomBetween(10000, 9999999);
				} else if(level == 3){
					num = PreMath.getRandomBetween(10000000, 999999999999);
				} else if(level == 4){
					num = PreMath.getRandomBetween(10000000, 9999999999999999);
				}
				
				answer = ntw(num, '', 0);
				
				//render the problem
				renderProblem();				/////////////////////// KEEP ////////////
				
				//start timer
				Timer.start();					/////////////////////// KEEP ////////////
				
				//save this problem as last problem on the server
				var o = {getDecimal: true};
				var lastProblem = num;											/////////////////////// KEEP ////////////
				window.updateLastProblem({										/////////////////////// KEEP ////////////
			            userID : window.userID,
			            exercise : exName,
			            lastProblem : lastProblem
			        })

				
			},
			submitResponse: function(){
				var resp = $('#ntw-num-word').text();
				if(CAN_SUBMIT && resp){					/////////////////////// KEEP ////////////
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
					var probResp = [num, answer, resp, isCorrect];	/////////////////////// KEEP ////////////
					probResp = JSON.stringify(probResp);				/////////////////////// KEEP ////////////
					
					window.processResponse('NumToWord', isCorrect, t, probResp, level, skillSet, FIRST_TRY);/////////////////////// KEEP ////////////
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
				$main = $main ? $main : $('<div id="NumToWord-container" class="ex-container"></div>')
				var equation = $(
							' <div id="ntw-number" style="font-size: 40px;"></div>'
							+'<div id="ntw-num-word" style="" contenteditable></div>'
							+'<div id="ntw-buttons">'
							+'	<div class="ntw-buttons" id="ntw-big-ones">'
							+'		<div class="ntw-button" id="ntw-e4">만<span class="shortkey">J</span></div>'
							+'		<div class="ntw-button" id="ntw-e8">억<span class="shortkey">K</span></div>'
							+'		<div class="ntw-button" id="ntw-e12">조<span class="shortkey">L</span></div>'
							+'	</div>'
							+'	<div class="ntw-buttons" id="ntw-small-ones">'
							+'		<div class="ntw-button" id="ntw-e1">십<span class="shortkey">U</span></div>'
							+'		<div class="ntw-button" id="ntw-e2">백<span class="shortkey">I</span></div>'
							+'		<div class="ntw-button" id="ntw-e3">천<span class="shortkey">O</span></div>'
							+'	</div>'
							+'</div>'
						);
				$(equation).ready(function(){
					$('#ntw-num-word').css({
						display : 'inline-block',
						width : '300px',
						height : '50px',
						border : '1px solid black',
						'text-align' : 'center',
						'line-height' : '2',
						'text-size' : '40px',
						'background-color' : '#dfdfdf'
					});
					$('.ntw-button').css({
						display : 'inline-block',
						width : '50px',
						height : '50px',
						border : '1px solid black',
						'text-align' : 'center',
						'line-height' : '3',
						position : 'relative'
					}).click(function(){
						var t = $(this).text().substr(0,1);
						var str = $('#ntw-num-word').text();
						$('#ntw-num-word').text(str + t).focus();
					});
					$('.shortkey').css({
						'position' : 'absolute',
						'font-size' : '10px',
						'bottom' : 0,
						'text-align' : 'center'
					})
					$('#ntw-num-word').keydown(function(e){
						e.preventDefault();
						var keys = {
							49 : '일', 50 : '이', 51 : '삼', 52 : '사', 53 : '오',
							54 : '육', 55 : '칠', 56 : '팔', 57 : '구',
							85 : '십', 73 : '백', 79 : '천',
							74 : '만', 75 : '억', 76 : '조'
						};
						if(keys.hasOwnProperty(e.which)){
							var n = keys[e.which];
							var str = $('#ntw-num-word').text();
							$('#ntw-num-word').text(str + n);
						}
					});	
				});
				$main.append(equation);
				
				
				var checkAnswer = $(
							'<div class="button enter-target" id="ntw-enter-target">'
							+ 'Check Answer'
							+'</div>'
						).click(function(){
							NumToWord.submitResponse();				/////////////////////// KEEP ////////////
						}).css({
							position: 'absolute',
							bottom:	'10px',
							right: '10px',
							zIndex: 10,
							width: '125px'
						});												/////////////////////// KEEP ////////////
				var obj = this;
				var loadProblemBtn = $(										/////////////////////// KEEP ////////////
							'<div id="load-NumToWord-problem" class="button load-problem-button">'
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
				
				$('#NumToWord-container').hide();						/////////////////////// KEEP ////////////
			},
			getExName: function(lang = 'eng'){
				if(lang == 'eng') return 'Reading Numbers (Kor)';
				else if(lang == 'kor') return '숫자 읽기';
			}
			
			,getAnswer(){
				return answer;
			}
		};
	}());
	
}(window));
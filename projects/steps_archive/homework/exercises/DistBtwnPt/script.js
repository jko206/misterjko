/*
	DistBtwnPt
	
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

/*global $, DistBtwnPt, PreMath, 
	PointsSetting, ajaxer, renderMath, Timer, getDateTime, Timer, docCookies,
	recordResponse, distanceBetween

*/


(function($global){
	$global.DistBtwnPt = (function(){
		/* list of constants and whatnot */
		var exName = 'Distance Between Points';
		var answer, CAN_SUBMIT, FIRST_TRY
		var x1, y1, x2, y2;
		
		function renderProblem(){
			var p1str = '(' + x1 + ', ' + y1 + ')';
			var p2str = '(' + x2 + ', ' + y2 + ')';
			$('#dbp-p1').text(p1str);
			$('#dbp-p2').text(p2str);
			renderMath();/////////////////////// KEEP ////////////
			$('#DistBtwnPt-container .input').text('');/////////////////////// KEEP ////////////
			PointsSetting.startBonusTimer();	/////////////////////// KEEP ////////////
		}
		function checkAnswer(rsp){
			return JSON.stringify(rsp) == answer;
		}
		
		//things not to mess with between exercises:
		return {
			init: function(args, lastProblem){
				if(typeof args == 'string') args = JSON.parse(args);
				//The main UI
				this.renderUI();				/////////////////////// KEEP ////////////
				this.loadProblem(lastProblem);	/////////////////////// KEEP ////////////
			},
			loadProblem: function(toLoad){
				CAN_SUBMIT = true;				/////////////////////// KEEP ////////////
				FIRST_TRY = true;				/////////////////////// KEEP ////////////
				if(toLoad){
					x1 = toLoad[0][0];
					y1 = toLoad[0][1];
					x2 = toLoad[1][0];
					y2 = toLoad[1][1];	
				} else {
					x1 = PreMath.getRandomBetween(-15,15);
					y1 = PreMath.getRandomBetween(-15,15);x2 = x1;
                    while(x2 == x1){
                        x2 = PreMath.getRandomBetween(-15,15);    
                    }
                    y2 = y1;
                    while(y2 == y1){
    				    y2 = PreMath.getRandomBetween(-15,15);
                    }
				}
				
				answer = distanceBetween([x1, y1], [x2, y2]);
				answer = JSON.stringify(answer);
				//render the problem
				renderProblem();				/////////////////////// KEEP ////////////
				
				//start timer
				Timer.start();					/////////////////////// KEEP ////////////
				
				//save this problem as last problem on the server
				var lastProblem = [[x1, y1], [x2, y2]];
				lastProblem = JSON.stringify(lastProblem);						/////////////////////// KEEP ////////////
				window.updateLastProblem({										/////////////////////// KEEP ////////////
			            userID : window.userID,
			            exercise : exName,
			            lastProblem : lastProblem
			        })

				
			},
			submitResponse: function(){
				var n = $('#dbp-resp-input1').text();
				var sqrt = $('#dbp-resp-input2').text();
				if(CAN_SUBMIT && (n || sqrt)){					/////////////////////// KEEP ////////////

					var a = n ? parseInt(n, 10) : '';
					var b  = sqrt ? parseInt(sqrt, 10) : '';
					n = n ? parseInt(n, 10) : 1;
					sqrt = sqrt ? parseInt(sqrt, 10) : 1;
					var resp = [n, sqrt];
					var t = Timer.getRunningTime();								/////////////////////// KEEP ////////////
	
					var isCorrect = checkAnswer(resp);				/////////////////////// KEEP ////////////
					//reflect in UI / load new problem / put in wrong-pile if wrong
					if(!isCorrect){
						// append wrong-pile
						var str = a && b ? '$' + a + '\\sqrt{' + b + '}$' 
							: (a ? a : '$\\sqrt{' + b + '}$');
						var wrong = $('<div>' + str + '</div>');
					} else {
						CAN_SUBMIT = false;
					}
					window.addToWrongResps(wrong);
					var probResp = [[x1,y1], [x2,y2],answer, resp, isCorrect];	/////////////////////// KEEP ////////////
					probResp = JSON.stringify(probResp);				/////////////////////// KEEP ////////////
					window.processResponse('DistBtwnPt', isCorrect, t, probResp, 1,1,''+FIRST_TRY);/////////////////////// KEEP ////////////
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
						.attr('id','DistBtwnPt-container')
						.addClass('ex-container');
				var equation = $(
							'<div>The distance between'
							+'	<div id="dbp-p1" style="display: inline;"></div>'
							+' and '
							+'	<div id="dbp-p2" style="display: inline;"></div>'
							+' is $a\\sqrt{b}$,'
							+ 'where a = '
							+ '<div id="dbp-resp-input1" contenteditable class="input"></div>'
							+ ' and b = '
							+ '<div id="dbp-resp-input2" contenteditable class="input"></div>.'
							+ '</div>'
						);
				$main.append(equation);
				var checkAnswer = $(
							'<div class="button enter-target" id="dbp-enter-target">'
							+ 'Check Answer'
							+'</div>'
						).click(function(){
							DistBtwnPt.submitResponse();				/////////////////////// KEEP ////////////
						}).css({
							position: 'absolute',
							bottom:	'10px',
							right: '10px',
							zIndex: 10,
							width: '125px'
						});												/////////////////////// KEEP ////////////
				var obj = this;
				var loadProblemBtn = $(										/////////////////////// KEEP ////////////
							'<div id="load-DistBtwnPt-problem" class="button load-problem-button">'
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
				
				$('#DistBtwnPt-container').hide();						/////////////////////// KEEP ////////////
			},
			getExName: function(lang = 'eng'){
				if(lang == 'eng') return 'Dist Between Two Points';
				else if(lang == 'kor') return '두 점 사이의 거리';
			}
			
			,getAnswer(){
				return answer;
			}
		};
	}());
	
}(window));
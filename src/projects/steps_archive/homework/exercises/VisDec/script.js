/*
	VisDec
	
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

/*global $, VisDec, randomBetween, PreMath, 
	PointsSetting, ajaxer, renderMath, Timer, getDateTime, Timer, docCookies,
	recordResponse

*/


(function($global){
	$global.VisDec = (function(){
		/* list of constants and whatnot */
		var exName = 'VisDec';
		var DIFFERENT_DENOM = false;
		var DENOMS;
		var WHOLE_UPPER_LIMIT;
		var level;
		var CAN_SUBMIT;
		var skillSet = 'N/A at the moment';
		var frac1, frac2, frac3, answer, op1, op2, FIRST_TRY; //operation
		
		function renderProblem(){
			var colors = ['red', 'yellow', 'green', 'blue'];
			var count = answer[0];
			var nextContainer; 
			$('.vd-e1').each(function(i){
				var color = i < count ? 'red' : 'white';
				$(this).css('background-color', color).children().hide();
				if(i == count) nextContainer = $(this).removeClass('vd-frame');
				else if(!$(this).hasClass('vd-frame')) $(this).addClass('vd-frame');
			});
			var container = nextContainer;
			container.children().show();
			count = answer[1];
			$(container).find('.vd-e2').each(function(i){
				var color = i < count ? 'yellow' : 'white';
				$(this).css('background-color', color).children().hide();
				if(i == count) nextContainer = $(this).removeClass('vd-frame');
				else if(!$(this).hasClass('vd-frame')) $(this).addClass('vd-frame');
			});
			container = nextContainer;
			container.children().show();
			count = answer[2];
			$(container).find('.vd-e3').each(function(i){
				var color = i < count ? 'green' : 'white';
				$(this).css('background-color', color).children().hide();
				if(i == count) nextContainer = $(this).removeClass('vd-frame');
				else if(!$(this).hasClass('vd-frame')) $(this).addClass('vd-frame');
			});
			container = nextContainer;
			container.children().show();
			count = answer[3];
			$(container).find('.vd-e4').each(function(i){
				var color = i < count ? 'blue' : 'white';
				$(this).css('background-color', color).children().hide();
				if(i == count) nextContainer = $(this).removeClass('vd-frame');
				else if(!$(this).hasClass('vd-frame')) $(this).addClass('vd-frame');
			});
			
			PointsSetting.startBonusTimer();
		}
		function checkAnswer(input){
			var tempAns = answer;
			while(input%10 == 0) input /= 10;
			while(tempAns%10 == 0) tempAns /= 10;
			return tempAns == input;
		}
		
		//things not to mess with between exercises:
		
		
		return {
			init: function(args, lastProblem){
				if(typeof args == 'string') args = JSON.parse(args);
				//initialize stuff
				level = (args && args.level) || 4;
				
				//The main UI
				this.renderUI();
				this.loadProblem(lastProblem);
			},
			loadProblem: function(toLoad){
				CAN_SUBMIT = true;
				FIRST_TRY = true;
				answer = /*toLoad || */Math.random() * Math.pow(10, level);
				answer = Math.floor(answer) + '';
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
				var input = $('#VisDec-input').text();
				
				if(CAN_SUBMIT && input){
					var t = Timer.getRunningTime();
	
					var isCorrect = checkAnswer(input);
					//reflect in UI / load new problem / put in wrong-pile if wrong
					if(!isCorrect){
						// append wrong-pile
						var wrong = $('<div></div>').text('0.' + input);
					} else {
						CAN_SUBMIT = false;
					}
					window.addToWrongResps(wrong);
					
					window.processResponse('VisDec', isCorrect, t, input, level, skillSet, FIRST_TRY);
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
						.attr('id','VisDec-container')
						.addClass('ex-container');
				/*making the fraction div*/
				
				var inputWrapper = $('<div>0.</div>').addClass('vd-input-wrapper');
				
				var input = $('<div></div>')
						.prop('contenteditable', true)
						.attr('id', 'VisDec-input')
						.addClass('input')
						.css({
							'display' : 'inline-block',
							'width' : '100px',
							'height' : '40px',
							'border' : '1px solid black',
							'background-color' : '#dddddd',
							'text-align': 'left'
						});
						
				inputWrapper.append(input);
				$main.append(inputWrapper);
				
				var vde0 = $('<div></div>').addClass('vd-frame vd-e0');
				var vde1 = $('<div></div>').addClass('vd-frame vd-e1');
				var vde2 = $('<div></div>').addClass('vd-frame vd-e2');
				var vde3 = $('<div></div>').addClass('vd-frame vd-e3');
				var vde4 = $('<div></div>').addClass('vd-frame vd-e4');
				var loadTen = function(container, load){
					for(var i = 0; i < 10; i++){
						var clone = load.clone(true);
						//if(i == 9) clone.addClass('vd-last').css('background-color', 'none');
						container.append(clone);
					}
					return container;
				}
				vde3 = loadTen(vde3, vde4);
				vde2 = loadTen(vde2, vde3);
				vde1 = loadTen(vde1, vde2);
				vde0 = loadTen(vde0, vde1);
				$main.append(vde0);
				
				
				var checkAnswer = $('<div></div>')
						.addClass('button enter-target')
						.text('Check Answer')
						.attr('id', 'VisDec-enter-target')
						.click(function(){
							VisDec.submitResponse();
						}).css({
						    position: 'absolute',
						    top: '10px',										
						    right: '10px',
						    zIndex: 10
						});
				var obj = this;
				var loadProblemBtn = $(
							'<div id="load-VisDec-problem" class="button load-problem-button">'
							+ 'New Problem</div>'
						).css({
							position: 'absolute',
						    top: '10px',
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
				
				$('#VisDec-container').hide();
			},
			getExName: function(lang = 'eng'){
				if(lang == 'eng') return 'Visual Decimal';
				else if(lang == 'kor') return '시각적 소수';
			}
		};
	}());
	
}(window));
/*
	Phonics
	
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

/*global $, Phonics, PreMath, 
	PointsSetting, ajaxer, renderMath, Timer, getDateTime, Timer, docCookies, SpeechSynthesisUtterance,
	recordResponse

*/


(function($global){
	$global.Phonics = (function(){
		/* list of constants and whatnot */
		var exName = 'Phonics';
		var level, CAN_SUBMIT, FIRST_TRY, ADDITIVE_LEVEL, MULTIPLICATIVE_LEVEL;
		var skillSet = 'N/A at the moment';
		var wordSets = {
			wordSet1 : [	//short and long vowel challenges
				['mat', 'mate'], ['met', 'meet'], ['hat', 'hate'], ['mite', 'mit'], ['sit', 'site'], ['kit', 'kite'],
				['grip', 'gripe'], ['bit', 'bite'], ['win', 'wine'], ['white', 'wit'], ['hop', 'hope'], ['cop', 'cope'],
				['tot', 'tote'], ['con', 'cone'], ['not', 'note'], ['writ', 'write']
			],
			wordSet2 : [	//short a and short e sounds
				['mat', 'met'], ['pat', 'pet'], ['tan', 'ten'], ['ham', 'hem'], ['dan', 'den'], ['ran', 'wren'],
				['man', 'men'], ['sand', 'send'], ['Ben', 'ban'], ['sat', 'set'], ['bag', 'beg'], ['vet', 'vat'],
				['pan', 'pen'], ['can', 'cane'], ['cam', 'came']
			],
			wordSet3 : [	//short i and long e sounds
				['sin', 'seen'], ['tin', 'teen'], ['fit', 'feet'], ['kip', 'keep'], ['pick', 'peek'], ['lip', 'leap'],
				['bin', 'bean'], ['win', 'ween'], ['din', 'dean'], ['bit', 'beet'], ['kin', 'keen'], ['rip', 'reap'],
				['pit', 'Pete'], ['sit', 'seat'], ['Sid', 'seed'], ['kiss', 'keys'], ['this', 'these']
			],
			wordSet4 : [	//short o and short u sounds
				['cop', 'cup'], ['bot', 'butt'], ['sop', 'sup'], ['cot', 'cut'], ['dog', 'dug'], ['luck', 'lock'],
				['hot', 'hut'], ['jot', 'jut'], ['pot', 'putt'], ['got', 'gut'], ['rot', 'rut'], ['Ron', 'run'],
				['jog', 'jug']
			],
			wordSet5 : [
				['met', 'mate', 'mat', 'meet', 'mite'],
				['root', 'rut', 'rot', 'wrote', 'rate', 'rat', 'writ', 'write'],
				['ten', 'teen', 'tin', 'tan', 'tane', 'ton', 'tone'],
			],
			wordSet6 : [
				['Tran', 'train']
			]
		}
		var answer, currProb, quizList = [], choiceSet, spokenWord;
		
		function renderProblem(){
			$('#phx-choices').empty();
			
			$('#phx-spoken-word').off().click(function(){
				var msg = new SpeechSynthesisUtterance(spokenWord);
				msg.lang = 'en';
				msg.rate = 0.7;
				window.speechSynthesis.speak(msg);
			});
			for(var i = 0; i < choiceSet.length; i++){
				var word = $('<div>'+ choiceSet[i] + '</div>').addClass('phx-choice phx-card');
				$('#phx-choices').append(word);
			}

			$('.phx-choice').click(function(){
				$('.phx-choice').removeClass(('phx-selected'));
				$(this).toggleClass('phx-selected');
			});
			//renderMath();/////////////////////// KEEP ////////////
			//$('#ntw-num-word').text('');/////////////////////// KEEP ////////////
			PointsSetting.startBonusTimer();	/////////////////////// KEEP ////////////
		}
		function checkAnswer(rsp){
			return rsp == spokenWord;
		}
		
		//things not to mess with between exercises:
		return {
			init: function(args, lastProblem){
				$('#main-area').width(600).height(400);
				
				if(typeof args == 'string') args = JSON.parse(args);
				//initialize stuff
				if(args && args.level){
					level = args.level +'' ;
					level = level.match(/\d+/)[0];
					level = PreMath.decToBaseN(level, 2) + '';
				} else {
					level = '10000';
				}
				while(level.length < 5){
					level = '0' + level;
				}

				//The main UI
				this.renderUI();				/////////////////////// KEEP ////////////
				this.loadProblem(lastProblem);	/////////////////////// KEEP ////////////
			},
			loadProblem: function(toLoad){
				CAN_SUBMIT = true;				/////////////////////// KEEP ////////////
				FIRST_TRY = true;				/////////////////////// KEEP ////////////

				if(toLoad){
					if(typeof toLoad == 'string') toLoad = JSON.parse(toLoad);
					choiceSet = toLoad[0];
					spokenWord = toLoad[1];
				} else {
					for(var i = 0; i < level.length; i++){
						var toLoadOrNot = level[i];
						if(toLoadOrNot == 1){
							var arr = wordSets['wordSet' + (i + 1)];
							for(var j = 0; j < arr.length; j++){
								quizList.push(arr[j]);
							}
						}
					}
					// console.log(quizList);
					var r = Math.floor(Math.random() * quizList.length);
					choiceSet = quizList[r];
					r = Math.floor(Math.random() * choiceSet.length);
					spokenWord = choiceSet[r];
				}
				
				
				//render the problem
				renderProblem();				/////////////////////// KEEP ////////////
				//start timer
				Timer.start();					/////////////////////// KEEP ////////////
				
				//save this problem as last problem on the server
				var lastProblem = JSON.stringify([choiceSet, spokenWord]);									/////////////////////// KEEP ////////////
				currProb = lastProblem;
				window.updateLastProblem({										/////////////////////// KEEP ////////////
			            userID : window.userID,
			            exercise : exName,
			            lastProblem : lastProblem
			        });

				
			},
			submitResponse: function(){
				
				if(CAN_SUBMIT && $('.phx-selected').length == 1){					/////////////////////// KEEP ////////////
					var t = Timer.getRunningTime();								/////////////////////// KEEP ////////////
					
					var choice = $('.phx-selected').text();
					var isCorrect = checkAnswer(choice);				/////////////////////// KEEP ////////////
					//reflect in UI / load new problem / put in wrong-pile if wrong
					var resp = [

						];
					CAN_SUBMIT = false;
					$('#load-Phonics-problem').show();
					if(!isCorrect){
						// append wrong-pile
						var wrong = $('<div>'+ resp+ '</div>');
						var flashColor = 'red';
					} else {
						flashColor = 'green';
					}
					$('.phx-selected').effect('highlight', {
	                    color: flashColor,
	                    easing: 'easeOutBack'
	                }, 1500);
					window.addToWrongResps(wrong);
					var probResp = [currProb, resp, isCorrect];	/////////////////////// KEEP ////////////
					probResp = JSON.stringify(probResp);				/////////////////////// KEEP ////////////
					
					window.processResponse('Phonics', isCorrect, t, probResp, level, skillSet, FIRST_TRY);/////////////////////// KEEP ////////////
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
				$main = $main ? $main : $('<div id="Phonics-container" class="ex-container"></div>')
				var equation = $(
							'<div id="phx-main">'
							+'	<div id="phx-spoken-word" class="phx-card"></div></div>'
							+'	<div id="phx-choices"></div>'
							+'</div>'
						);
				$main.append(equation);
				
				
				var checkAnswer = $(
							'<div class="button enter-target" id="phx-enter-target">'
							+ 'Check Answer'
							+'</div>'
						).click(function(){
							Phonics.submitResponse();				/////////////////////// KEEP ////////////
						}).css({
							position: 'absolute',
							bottom:	'10px',
							right: '10px',
							zIndex: 10,
							width: '125px'
						});												/////////////////////// KEEP ////////////
				var obj = this;
				var loadProblemBtn = $(										/////////////////////// KEEP ////////////
							'<div id="load-Phonics-problem" class="button load-problem-button">'
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
				
				$('#Phonics-container').hide();						/////////////////////// KEEP ////////////
			},
			getExName: function(lang = 'eng'){
				if(lang == 'eng') return 'Phonics';
				else if(lang == 'kor') return 'Phonics 파닉스';
			}
			
			,getAnswer(){
				return spokenWord;
			}
		};
	}());
	
}(window));
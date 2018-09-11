/*
	fracAddSub.js
	
	This exercise is meant to help students practice adding and subtracting fractions
	It can control following parameters:
		-Whether to make the denominators the same
		-Prsent proper fractions only
		-range of denominators
		-range of numbers
		
*/

/*global $, Problem, randomBetween, RationalNumber, PointsSetting, ajaxer, renderMath*/



(function($global){
	$global.Problem = (function(){
		/* list of constants and whatnot */
		var DIFFERENT_DENOM = true;
		var DENOM_LOWER_LIMIT = 2;
		var DENOM_UPPER_LIMIT = 10;
		var WHOLE_LOWER_LIMIT = 0;
		var WHOLE_UPPER_LIMIT = 10;
		
		var frac1, frac2, answer;
		
		return {
			load : function(){},
			loaderContent: function(){},
			loadFromURL: function(url){},
			newProblem: function(){
				// after problem is loaded, re-render math with MathJax:
				var w1 = randomBetween(WHOLE_LOWER_LIMIT, WHOLE_UPPER_LIMIT);
				var w2 = randomBetween(WHOLE_LOWER_LIMIT, WHOLE_UPPER_LIMIT);
				var d1 = randomBetween(DENOM_LOWER_LIMIT, DENOM_UPPER_LIMIT);
				var n1 = randomBetween(1, d1);
				var d2 = d1;
				while(d1 == d2 && DIFFERENT_DENOM){
					d2 = randomBetween(DENOM_LOWER_LIMIT, DENOM_UPPER_LIMIT);
				}
				var n2 = randomBetween(1, d2);
				frac1 = (new RationalNumber()).init([w1*d1 + n1, d1]);
				frac2 = (new RationalNumber()).init([w2*d2 + n2, d2]);
				answer = (new RationalNumber()).init(frac1).add(frac2);
			},
			renderUI: function($main){
				$main = $main ? $main : $('#main-area');
				/*making the fraction div*/
				var fracDiv = $('<div></div>').attr('id', 'fraction');
				var whole = $('<div></div>')
						.attr('id',  'whole')
						.addClass('answer-input input')
						.prop('contenteditable', true);
				var numer = $('<div></div>')
						.attr('id', 'numer')
						.addClass('answer-input input')
						.prop('contenteditable', true);
				var denom = $('<div></div>')
						.attr('id', 'denom')
						.addClass('answer-input input')
						.prop('contenteditable', true);
				var fracLine = $('<div></div>').attr('id', 'fracLine');
				
				fracDiv.append(whole, numer, fracLine, denom);
				
				var lhs = $('<div></div>').attr('id', 'lhs');		// Left-hand side;
				var equal = $('<div></div>').html('=').attr('id', 'equal-sign');
				var rhs = $('<div></div>').attr('id', 'rhs').append(fracDiv); // Right-hand side
				
				$main.append(lhs, equal, rhs);
				var checkAnswer = $('<div></div>')
						.addClass('button')
						.text('Check Answer')
						.attr('id', 'check-answer')
						.click(function(){
							Problem.checkAnswer();
						})
						.css({
						    position: 'absolute',
						    bottom: '10px',
						    right: '10px'
						});
				$main.append(checkAnswer);
			},
			renderProblem: function(){
				var str = '$' + frac1.toMathJax('mixed') 
						+ ' + ' + frac2.toMathJax('mixed') + '$';
						
				$('#lhs').html(str);
				renderMath();
			},
			uploadResponse: function(){},
			loadProblemArea: function(){},
			logAttempt: function(){},
			setParameters: function(){},
			checkAnswer: function(){ 
				var whole = $('#whole').text();
				var numer = $('#numer').text();
				var denom = $('#denom').text();
				var response = [whole, numer, denom];

				whole = whole == '' ? 0 : parseInt(whole);
				numer = numer == '' ? 0 : parseInt(numer);
				denom = denom == '' ? 1 : parseInt(denom);
				var ans = answer.getFrac({format: 'mixed'});
				var isCorrect = [whole,numer,denom].toString() == ans.toString();
				if(isCorrect){
					$('#fraction').effect('highlight', 
						{color: 'green', easing: 'easeOutBack'}, 
						1500,
						function(){
							//give points
							PointsSetting.changePoints(1);
							PointsSetting.renderState();
							PointsSetting.saveSetting();
							$('#whole').text('');
							$('#numer').text('');
							$('#denom').text('');
							
							
							Problem.newProblem();
							Problem.renderProblem();
						}
					);
				} else {
					$('#fraction').effect('highlight', {color: 'red', easing: 'easeOutBack'}, 1500);
				}
				
				var str = 'frac1: ' + frac1 + '\tfrac2: ' + frac2 
						+ '\tresponse: ' + JSON.stringify(response)
						+ '\ttime: ' + getDateTime();
				
				ajaxer({
					requestHandler: 'responseRecords.php',
					requestType: 'post',
					data: {data : str},
					errorHandler: function(e){console.log(e)},
					successHandler: function(message){console.log(message)}
				});
			},
			getAnswer: function(){
				return answer;
			}
		};
	}());
	
}(window));

$('document').ready(function(){
	Problem.renderUI();
	Problem.newProblem();
	Problem.renderProblem();
});



/*
	must have:
		loadProblem()
		loadProblemFromURL()
			//var a = location.href; 
			//var b = a.substring(a.indexOf("?")+1);
		upload responses



function newProblem(){
	var o = getProblem();
	loadProblem(o.dividend, o.divisor, o.quotient);
}

$('#reference').on('input', '.input', function(){
	var answer = $(this).data('answer');	
	var response = parseInt($(this).text());
	if(answer == response){
		$(this).css('backgroundColor', '#4cea6f');
	} 
});
	
function loadProblem(dividend, divisor, quotient){
	$('#snippets .snippet').remove();
	$('#solution').text('').data('solution', quotient);
	$('#dividend').text(dividend);
	$('#divisor').text(divisor);

	var crutchLevel = window.settingsObj.crutchLevel;
	var crutches = (function(l){
		l--; //switching from 1 based to 0 based index;
		var crutches = [
				[0],
				[0, 2, 5],
				[1, 3, 5, 7],
				[0, 2, 4, 6, 8],
				[0,1,2,3,4,5,6,7,8]
			];
		return crutches[l];
	}(crutchLevel));
	// populate helper window
	$('.multiplicant').text(divisor);
	$('.product').each(function(i){
		var product = (i + 1) * divisor;
		var parentID = $(this).parent().attr('id');
		if(crutches.contains(i)){
			$(this).text(product);
		} else if(parentID == 'reference') {
			$(this).data('answer', product)
				.addClass('input')
				.prop('contenteditable', true)
				.text('');
		}
	})
	
	$('#reference .input').css('backgroundColor', 'gray');
	addSnippet(dividend, divisor);
}

function getProblem(){
	var dividendMax = window.settingsObj.dividendMax;
	var dividendMin = window.settingsObj.dividendMin;
	var divisorMax = Math.min(window.settingsObj.divisorMax, dividendMin);
	var divisorMin = Math.min(window.settingsObj.divisorMin, divisorMax);

	var divisor = randomBetween(divisorMin, divisorMax);
	var dividend = randomBetween(dividendMin, dividendMax);
	var quotient = Math.floor(dividend / divisor);
	var remainder = dividend%divisor;
	dividend -= remainder;
	
	function randomBetween(a, b){
		var d = Math.abs(a - b);
		var r = Math.random() * d;
		return Math.floor(r) + Math.min(a, b);
	}
	return {
		quotient,
		divisor,
		dividend
	};
}

function addSnippet(dividend, divisor){
	if(window.currentSnippet){
		$(window.currentSnippet).find('.input').prop('contenteditable', false);
	}
	var snippet = $('#original-snippet').clone(true);
	snippet.removeAttr('id');
	snippet.find('.dividend').text(dividend);
	snippet.find('.divisor').text(divisor);
	
	window.currentSnippet = snippet;
	
	$('#check-progress').before(snippet);
	$(window.currentSnippet).find('.input').first().focus();
}


	$('#check-solution').click(function(){
		var input = $('#solution').text();
		var solution = $('#solution').data('solution');
		input = parseInt(input);
		solution = parseInt(solution);
		if(input == solution){
			var response = confirm('yay!');
			if(response){
				window.settingsObj.changePoints(1);
				renderPoints();
				
				var o = getProblem();
				var dividend = parseInt(o.dividend);
				var divisor = parseInt(o.divisor);
				var quotient = parseInt(o.quotient);
				
				loadProblem(dividend, divisor, quotient);
			}
		} else {
			alert('try again');
		}
	});
	
	
	
	var statObj = {
        attempts : 0,
        success : 0,
        questions : [],
        addQuestion : function(p1, p2, resp, actual){
            // add to questions as a string what the 
            // points were and the given response was entered
            var o = {
                    p1: p1,
                    p2: p2,
                    resp: resp,
                    actual: actual
                }
            this.questions.push(JSON.stringify(o));
            
        },
        toString : function(){
            return JSON.stringify([
                    "attempts: " + this.attempts,
                    "success: " + this.success,
                    "questions" + JSON.stringify(this.questions)
                ]);
        }
    }



*/
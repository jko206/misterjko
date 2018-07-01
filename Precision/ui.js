/* global $, PM*/

$(document).ready(function(){
	// PM.renderMath();
	
	$('.parameter').blur(function(){
		let text = $(this).text().trim();
		if(text == ''){
			let caption = $(this).data('caption');
			$(this).text(caption).addClass('captioned');
		}
	}).focus(function(){
		let text = $(this).text().trim();
		let caption = $(this).data('caption');
		if(text == caption){
			$(this).text('').removeClass('captioned');
		}
	}).trigger('blur');
	
	$('.add-parameter').click(function(){
		let parameterWrap = $(this).prev().prev().clone(true);
		let caption = parameterWrap.find('.parameter').data('caption');
		parameterWrap.find('.parameter').addClass('captioned').text(caption);
		$(this).before(parameterWrap);
		$(this).before('<div class="syntax">,</div> ');
	});
	
	$('.del-parameter').click(function(){
		$(this).parent().prev().remove();
		$(this).closest('.parameter-wrap').remove();
	});
	
	$('.run-method').click(function(){
		let fn = $(this).closest('.fn-cont').attr('id');
		runMethod(fn);
	});
	
	$('.parameter').keydown(function(e){
		if(e.which == 13){
			e.preventDefault();
			let fn = $(this).closest('.fn-cont').attr('id');
			runMethod(fn);
		} else if(e.which == 27){
			e.preventDefault();
			let caption = $(this).data('caption');
			if(caption){
				$(this).text(caption);
				$(this).addClass('captioned');
			} else {
				$(this).text('');
			}
		}/*else if(e.which == 9){
			e.preventDefault();
			if(!$(this).parent().hasClass('limited-param')){
				$(this).parent().siblings('.add-parameter').trigger('click');
			}
		}*/
	});
	
	$('.boolean').click(function(){
		let current = $(this).text().trim();
		if(current == 'true'){
			$(this).text('false');
		} else {
			$(this).text('true');
		}
	});
	
	$('#bignum-explanation-toggle').click(function(){
		$('#bignum-explanation').toggle();	
	});
});

function runMethod(fn){
	function parseTo(f){
		let needInt = [
			'isPrime', 'getPrimeFactors', 'getPrimesBetween', 'gcd', 'gcf',
			'lcm', 'maxExp', 'getRandomPrimeBetween', 'powerOf', 'factorsOf',
			'getRandomBetween', 
		];
	}
	let params = [];
	$(`#${fn}`).find('.parameter').each(function(i, e){
		let caption = $(this).data('caption');
		let val = $(this).text().trim();
		if(caption != val){
			if(val.toLowerCase() == 'true') params.push(true);
			else if(val.toLowerCase() == 'false') params.push(false);
			else{
				let temp = parseTo(fn)(val);
				if(temp) val = temp;
				params.push(val);
			}
		}
	});
	if(params.length){
		try{
			$(`#${fn} .output`).text('');
			let output = PM[fn](...params);
			if(Array.prototype.isPrototypeOf(output)) output = `[${output.join(', ')}]`;
			else if(typeof output == 'object') output = JSON.stringify(output);
			else if(output === undefined) output = 'undefined';
			else if(output === true || output == false) output += '';
			while(output.length > 100){
				let chunk = output.substr(0, 100) + '<br>';
				output = output.substr(100);
				$(`#${fn} .output`).append(chunk);
			}
			$(`#${fn} .output`).append(output);
			$(`#${fn} .error-msg`).text('');
		} catch(e){
			$(`#${fn} .error-msg`).text(e.message);
		}
	}
}

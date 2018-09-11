
var currCovered = 0;
/* global $ */
var problem = (function(){
    var nums = [];
	var min;
	return {
		load(){
			$('.cover').show();
			$('#resp').text('');
			nums = [];
			min = Infinity;
			currCovered = 0;
			$('#button').text('Check Answer');
			$('.box').each(function(){
				let r = -1;
				while(r == -1 || nums.indexOf(r) != -1){
					var f = Math.ceil(Math.random() * 1000);
					r = Math.ceil(Math.random() * 1000) * f;
					if(options.mode && options.mode == 1){
						r /= 100000;
					}
				}
				min = min > r ? r : min;
				nums.push(r);
				$(this).find('.number').text(r);	
			});
			console.log(nums);
		},
		check(){
			var resp = $('#resp').text();
			resp = parseFloat(resp);
			if(resp == min){
				var loadProblem = confirm('Good job!! Start new problem?');
				if(loadProblem) this.load();
				else $('#button').text('New Problem');
			} else {
				alert('Try again!');
			}
		}//,
//    	getAnswer(){
//			return min;
//		}
	}
}());

var options = {};

(function(){
	var href = window.location.href.split('?');
	var temp = href[1]; 
	if(temp){
		temp = temp.split('&');
		temp.forEach(function(e, i, arr){
			var split = e.split('=');
			options[split[0]] = split[1];
		});
	}
	console.log(options);
}());

$(document).ready(function(){
	$('#button').click(function(){
		let txt = $(this).text();
		if(txt == 'New Problem'){
			problem.load();
		} else {
			problem.check();
		}
	});
	var length = options.mode && options.mode == 1 ? 20 : 50;
	for(let i = 0; i < length; i++){
		var box = $(`
			<div class="box">
				<div class="cover">?</div>
				<div class="number"></div>
			</div>
		`);
		$('#boxes').append(box);
	}
	$('#resp').on('keydown', function(e){
		var key = e.which;
		if(key == 13){
			e.preventDefault();
			problem.check();
		}
	})
	
	$('.box').click(function(){
		var cover = $(this).find('.cover');
		var display = cover.css('display');
		if(currCovered < 2 && display == 'block'){
			cover.css('display', 'none');
			currCovered++;
		} else if(display == 'none'){
			cover.css('display', 'block');
			currCovered--;
		}
	});
	
});
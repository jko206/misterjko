/* global $ */

let answer, problem, firstTry = true;

$(document).ready(function(){
	newProblem();
	$('#input').keydown(function(e){
		let key = e.which;
		if(key == 13){ // enter
			e.preventDefault();
			let resp = $(this).text();
			submit(resp);
		} else if(key == 27){ // esc
			$(this).val('');
		}
	});
});

function submit(n){
	let diff = Math.abs(n - answer);
	let isCorr = diff < 0.000001;
	let d = new Date();
	let timeStamp = `${d.toDateString()} ${d.toLocaleTimeString()}`;
	
	let pkg = {
		timeStamp,
		problem,
		n,
		isCorr
	};
	
	pkg = JSON.stringify(pkg);
    $.ajax({
		url : 'record.php',
		crossDomain : true,
		type : 'post',
		data: {data : pkg},
		success : function(response){
			console.log(response);
		},
		//async: false,
		error: function(jqXHR, textStatus, errorThrown){
		    var text = 'jqXHR.responseText:  ' + jqXHR.responseText
		            +'<br>jqXHR.responseXML :  ' + jqXHR.responseXML
			        +'<br>textStatus:   ' +  textStatus
        			+'<br>errorThrown:   ' + errorThrown;
			console.log(text);
			//if(o.errorHandler) o.errorHandler(jqXHR, textStatus, errorThrown);
		},
		dataType : 'text' //expected data type to be returned from server
	});
	
	if(isCorr){
        let count = $('#cons-corr').text();
        if(firstTry) count++;
        $('#cons-corr').text(count);
		$('#input').css('background-color', 'green')
			.animate({
				'background-color' : 'white'
			}, 500, 'easeOutCubic', newProblem);
            
	} else {
		let clone = $('#wrong-input-template').clone(true).removeAttr('id');
		clone.text(n);
		$('#wrong-inputs').append(clone);
		$('#input').css('background-color', 'red')
		.animate({
			'background-color' : 'white',
		}, 1500);
        $('#cons-corr').text(0);
        firstTry = false;
	}
	
}

function newProblem(){
	// Initialize
	$('#given-num, #op, #factor, #input, #wrong-inputs').text('');
    firstTry = true;
	
	let n = Math.random(),
		powOfTen1 = Math.pow(10, Math.ceil(Math.random() * 4)),
		powOfTen2 = Math.pow(10, Math.ceil(Math.random() * 4)),
		op = Math.round(Math.random()) == 1; // true-> multiplication, false -> division
	n = Math.ceil(n * powOfTen1);
	answer = op ? n * powOfTen2 : n / powOfTen2;
	
	$('#given-num').text(n);
	$('#op').html(op ? '&times;' : '&#247;');
	$('#factor').text(powOfTen2);
	problem = `${n} ${op ? '*' : '/'} ${powOfTen2} = ${answer}`;
}
/* global $*/


/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  Revision #1 - September 4, 2014
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|  https://developer.mozilla.org/User:fusionchess
|*|  https://github.com/madmurphy/cookies.js
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path[, domain]])
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/
var docCookies = {
	getItem: function (sKey) {
		if (!sKey) { return null; }
		return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
	},
	setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
		if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
		var sExpires = "";
		if (vEnd) {
    		switch (vEnd.constructor) {
        		case Number:
        			sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
        			break;
    			case String:
        			sExpires = "; expires=" + vEnd;
        			break;
        		case Date:
        			sExpires = "; expires=" + vEnd.toUTCString();
        			break;
    		}
    	}
    	document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    	return true;
	},
	removeItem: function (sKey, sPath, sDomain) {
		if (!this.hasItem(sKey)) { return false; }
		document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
		return true;
	},
	hasItem: function (sKey) {
		if (!sKey) { return false; }
		return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
	},
	keys: function () {
		var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
		for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
		return aKeys;
	}
};


let LEVEL = docCookies.hasItem('level') ? parseInt(docCookies.getItem('level')) : 1, 
	answer = {}, problem, loadNewProblem = false, consCorr = 0 , totalCorr = 0, 
	totalQ = 0, firstAttempt = true;


$(document).ready(function(){
	
	updateStatDisplay();
	
	$('.close-btn').click(function(){
		$(this).closest('.popup-wrapper').hide();
	});
	
	$('.input').keydown(function(e){
		let key = e.which;
		if(key == 13){
			e.preventDefault();
			if(loadNewProblem){
				newProblem();
			} else if(!loadNewProblem && $('#numer4').text() && $('#denom4').text()) {
				submit();
			}
		} else if(key == 27){ // esc
			$(this).text('');
		}
	});
	
	$('#set-level').click(function(){
		$('.popup-wrapper').show();
		$('.submit-msg').hide();
		$('#set-level').val(LEVEL);
	});
	
	$('.popup input').keydown(function(e){
		let key = e.which;
		if(key == 27){
			$('.close-btn').click();
		}
	});
	
	$('#submit-change').click(function(){
		let pw = $('#password').val();
		if(pw == 'kevinissmart'){
			// $(this).val('');
			let newLevel = $('#new-level').val();
			newLevel = parseInt(newLevel);
			LEVEL = newLevel < 1 ? 1 : (newLevel > 6 ? 6 : newLevel);
			docCookies.setItem('level', LEVEL);
			if(docCookies.hasItem('currProblem')) docCookies.removeItem('currProblem');
			newProblem();
			
			$('#submit-success').show({
				complete: function(){
					$('#submit-success').hide();
					$('.popup-wrapper').hide();
					$('#password').val('');
				}	
			});
		} else {
			$('#submit-fail').show();
		}
	});
	
	$('#new-problem').click(function(){
		newProblem();	
	});
	
	$('#submit').click(function(){
		//if everything is filled, then submit
		if(!loadNewProblem && $('#numer4').text() && $('#denom4').text()){
			submit();
		}
	});
	
	$('.input').keydown(function(e){
		let key = e.which;
		if(key >= 48 && key <= 57){// these are numbers
		}
	});

	newProblem();
});

function submit(){
	let n4 = $('#numer4').text().trim();
	let d4 = $('#denom4').text().trim();
	let resp = `${n4} / ${d4}`;
	let isCorr = answer.numer == n4 && answer.denom == d4;


	let d = new Date();
	let options = { hour12: false };
	let timeStamp = d.toLocaleString('en-US', options);

	let pkg = JSON.stringify({
		timeStamp, problem, answer, resp, isCorr
	}); 
	
	
    $.ajax({
		url : 'record.php',
		crossDomain : true,
		type : 'post',
		data : {data : pkg},
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
		//flash green, show next problem button ;
		$('.input').css('background-color', 'green').animate({
			'background-color' : 'white',
		}, 500, 'easeOutCubic', function(){
			$('#new-problem').show();
		});
		loadNewProblem = true;
		docCookies.hasItem('currProblem') && docCookies.removeItem('currProblem');
		loadNewProblem = true;
		if(firstAttempt) consCorr++;
		totalCorr++;
	} else {
		//flash red, add resp to wrong inputs;
		$('.input').css('background-color', 'red').animate({
			'background-color' : 'white',
		}, 500, 'easeOutCubic');
		let clone = $('#wrong-input-template')
			.clone(true)
			.removeAttr('id')
			.text(resp);
		$('#wrong-inputs').append(clone);
		consCorr = 0;
		firstAttempt = false;
	}
	updateStatDisplay();
	
}

function newProblem(){
	
	
	function getGCD(a, b){
		if(a == 0) throw new Error('a cannot be zero. b = ' + b);
		if(b == 1) throw new Error('b cannot be zero. a = ' + a);
		if(a == 1 || b == 1) return 1;
		let min = Math.min(a, b), max = Math.max(a, b);
		if(max % min == 0) return min;
		return getGCD(max%min, min);
	}
	
	function displayProb(){
		$('#numer1').text(n1);
		$('#denom1').text(d1);
		$('#op1').html(op1 ? '&divide;' : '&times;');
		$('#numer2').text(n2);
		$('#denom2').text(d2);
		$('#op2').html(op2 ? '&divide;' : '&times;');
		$('#numer3').text(n3);
		$('#denom3').text(d3);
		
		if(LEVEL > 3){
			$('#op2, #frac3').show();
		} else {
			$('#op2, #frac3').hide();
		}
		
	}
	// Initialize and clear problem area
	firstAttempt = true;
	totalQ++;
	loadNewProblem = false;
	
	$('.input, #wrong-inputs').text('');
	$('#new-problem').hide();
	loadNewProblem = false;
	
	// terms 1~3 and 4 is for answer
	let d1, d2, d3, d4, 
		n1, n2, n3, n4, 
		op1, op2;
		
	if(docCookies.hasItem('currProblem')){
		let currProblem = docCookies.getItem('currProblem');
		currProblem = JSON.parse(currProblem);
		d1 = currProblem.d1, d2 = currProblem.d2, d3 = currProblem.d3,
		d4 = currProblem.d4, n1 = currProblem.n1, n2 = currProblem.n2,
		n3 = currProblem.n3, n4 = currProblem.n4, op1 = currProblem.op1,
		op2 = currProblem.op2;
		
	} else {
		let level = LEVEL - 1;
		let maxDenomByLevel = [8, 12, 25, 12, 25, 40];
		let maxDenom = maxDenomByLevel[level] - 1; // -1 and then + 1 so denom doesn't become 1
		op1 = Math.floor(Math.random() * 2), // 0 -> multi, 1 -> div
		op2 = Math.floor(Math.random() * 2),
		d1 = Math.ceil(Math.random() * maxDenom) + 1;
		d2 = Math.ceil(Math.random() * maxDenom) + 1;
		d3 = level > 2 ? Math.ceil(Math.random() * maxDenom) + 1 : 1;
		n1 = Math.ceil(Math.random() * (d1 - 1));
		n2 = Math.ceil(Math.random() * (d2 - 1));
		n3 = level > 2 ? Math.ceil(Math.random() * (d3 - 1)) : 1;
		
		d4 = d1, n4 = n1;
		if(op1 == 0){
			d4 *= d2, n4 *= n2;
		} else {
			d4 *= n2, n4 *= d2;
		}
		if(op2 == 0){
			d4 *= d3, n4 *= n3;
		} else {
			d4 *= n3, n4 *= d3;
		}
		
		let gcd = getGCD(n4, d4);
		n4 /= gcd, d4 /= gcd;
		
		
		
		let currProblem = {
			d1, d2, d3, d4, 
			n1, n2, n3, n4, 
			op1, op2
		};
		currProblem = JSON.stringify((currProblem));
		docCookies.setItem('currProblem', currProblem);
	}
	
	
	answer.numer = n4, answer.denom = d4;

	
	
	displayProb();
}




function updateStatDisplay(){
	$('#curr-level').text(LEVEL);
	$('#cons-corr').text(consCorr);
	$('#total-corr').text(totalCorr);
	$('#total-q').text(totalQ);
	
	let pct = totalQ == 0 ? '--%' : (Math.floor(consCorr * 1000 / totalQ) / 10) + '%';
	$('#pct-corr').text(pct);
}

function getRandomMilli(level = LEVEL - 1){
	let increments = [10, 1000, 1, 1000000, 1];
	let ranges = [99, 99, 99999, 99, 99999999];
	let r = Math.ceil(Math.random() * ranges[level]) * increments[level];
	return r;
}

//given a number in milli unit, it'll return values in centi, unit, and kilo 
function getAllUnitNums(n){
	let arr = [n, n / 10];	 // [m, c]
	if(LEVEL > 1) arr.push(n / 1000); // u
	if(LEVEL > 3) arr.push(n / 1000000); //k
	return arr;
}

function getGivenUnit(maxIndex){
	return Math.floor(Math.random() * maxIndex);
}

function getMeasurementType(){
	let r = Math.floor(Math.random() * 3);
	return (r == 0 && 'l') || (r == 1 && 'm') || (r == 2 && 'g');
}

function getUnits(){
	let arr = ['m', 'c'];
	if(LEVEL > 1) arr.push('');
	if(LEVEL > 3) arr.push('k');
	return arr;
}

function getCombo(nums, units, measureType){
	let arr = [];
	for(let i = 0; i < nums.length; i++){
		arr.push(`${nums[i]}${units[i]}${measureType}`);	
	}
	return arr;
}


Array.prototype.shuffle = function(){
	let length = this.length;
	this.forEach(function(e, i, arr){
		let temp = e;
		let r = Math.floor(Math.random() * length);
		arr[i] = arr[r];
		arr[r] = temp;
    });
};
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
	
	$('#problem').on('blur', '.other-unit', function(){
		let content = $(this).text().trim();
		let caption = $(this).data('caption').trim();
		if(!content){
			$(this).addClass('captioned').text(caption);
		} else if(content != caption){
			$(this).removeClass('captioned');
		}
	}).on('focus', '.other-unit', function(){
		let content = $(this).text().trim();
		let caption = $(this).data('caption').trim();
		if(content == caption){
			$(this).text('').removeClass('captioned');
		}
	}).on('keydown', '.other-unit', function(e){
		let key = e.which;
		if(key == 13){
			e.preventDefault();
			if(loadNewProblem){
				newProblem();
			} else {
				let isBlank = false;
				$('.input').each(function(){
					if(!$(this).text()) isBlank == true;
				});
				if(!isBlank){
					submit();
				}	
			}
		} else if(key == 27){
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
			$('#password').val('');
			let newLevel = $('#new-level').val();
			newLevel = parseInt(newLevel);
			LEVEL = newLevel < 1 ? 1 : (newLevel > 5 ? 5 : newLevel);
			docCookies.setItem('level', LEVEL);
			if(docCookies.hasItem('currProblem')) docCookies.removeItem('currProblem');
			newProblem();
			
			$('#submit-success').show({
				complete: function(){
					$('#submit-success').hide();
					$('.popup-wrapper').hide();
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
		let isBlank = false;
		$('.input').each(function(){
			if(!$(this).text()) isBlank == true;
		});
		if(!isBlank){
			submit();
		}
	});

	newProblem();
});

function submit(){
	let resp = '';
	$('.input').each(function(){
		let text = $(this).text().trim();
		if(resp == '') resp += text;
		else resp += ',  ' + text;
	});
	let isCorr = (function(){
		let isCorr = true;
		$('.input').each(function(e, i, arr){
			let unit = $(this).data('caption');
			let resp = $(this).text().trim();
			if(answer[unit] != resp) isCorr = false;
		});
		return isCorr;
	}());
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
			loadNewProblem = true;
			docCookies.hasItem('currProblem') && docCookies.removeItem('currProblem');
		});
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
	// Initialize and clear problem area
	firstAttempt = true;
	totalQ++;
	loadNewProblem = false;
	
	$('.input, #wrong-inputs').text('');
	$('#new-problem').hide();
	$('#problem').empty();
	loadNewProblem = false;
	
	let base, measureType, given, nums, units, prob, combo;
	// Problem
	// if(docCookies.hasItem('currProblem')){
	// 	base = docCookies.getItem('currProblem');
	// 	base = parseInt(base);
		
	// } else {
		// Generate random number based on student's level
		base = getRandomMilli();
		
		// Get other related numbers based on the base, and choose 
		// measurement type between volume, length, and mass
		nums = getAllUnitNums(base);
		units = getUnits();
		measureType = getMeasurementType();
		
		combo = getCombo(nums, units, measureType);
		
		let givenIndex = Math.floor(Math.random() * combo.length);
		given = combo.splice(givenIndex, 1)[0];
		combo.shuffle();
		// Display problem
		let $givenUnit = $(`<div class="given-unit">${given}</div>`);
		$('#problem').append($givenUnit);
		combo.forEach(function(e, i, arr){
			let caption = e.match(/[a-z]+/)[0];
			let $otherUnit = $(`
				<div class="other-unit input captioned" contenteditable>
					${caption}
				</div>
			`).data('caption', caption).appendTo('#problem');
			answer[caption] = e;
		});
		
		docCookies.setItem('currProblem', prob);
		
	// }
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
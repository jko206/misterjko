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
	answer, problem, loadNewProblem = false, consCorr = 0 , totalCorr = 0, 
	totalQ = 0, firstAttempt = true;


$(document).ready(function(){
	
	updateStatDisplay();
	
	$('.close-btn').click(function(){
		$(this).closest('.popup-wrapper').hide();
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
			console.log('here');
			let newLevel = $('#new-level').val();
			newLevel = parseInt(newLevel);
			console.log(newLevel, LEVEL);
			LEVEL = newLevel < 1 ? 1 : (newLevel > 5 ? 5 : newLevel);
			console.log(newLevel, LEVEL);
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
	
	function enterChar(code){
		
		let char = keyCodes[code];
		// let str = $('#input').text();
		// str += char;
		// $('#input').text(str);
		insertAtCaret(char);
		
	}
	let keyCodes = {
		49 : '일',	50 : '이', 51 : '삼',
		52 : '사',	53 : '오', 54 : '육',
		55 : '칠',  56 : '팔', 57 : '구', 
		
		81 : '십',	87 : '백', 69 : '천',
		65 : '만',	83 : '억', 68 : '조'
	};
	let otherKeys = [37, 38, 39, 40, 46, 8]; //arrows, delete, backspace
	let keys = Object.keys(keyCodes);
	$('#input').keydown(function(e){
		let key = e.which;
		if(otherKeys.indexOf(key) == -1){
			e.preventDefault();
		}
		key += '';
		if(key == 13){ // enter
			if(loadNewProblem){
				newProblem();
			} else if($('#input').text()){
				submit();
			}
		} else if(key == 27){ // esc
			$(this).text('');
		} else if(keys.indexOf(key) != -1){
			enterChar(key);
		}
	}).focus();
	
	$('#new-problem').click(function(){
		newProblem();	
	});
	
	/*
	clicking the key doesn't work.....
	$('.key').click(function(){
		let id = $(this).attr('id');
		let code = id.match(/[0-9]+/);
		enterChar(code);
		$('#input').focus();
	});
	*/
	newProblem();
});

function submit(){
	let resp = $('#input').text();
	let isCorr = resp == answer;
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
		$('#input').css('background-color', 'green').animate({
			'background-color' : 'white',
		}, 500, 'easeOutCubic', function(){
			$('#new-problem').show();
			loadNewProblem = true;
			docCookies.hasItem('currProblem') && docCookies.removeItem('currProblem');
		});
		if(firstAttempt) consCorr++;
		totalCorr++;
	} else {
		//flash red, add resp to wrong inputs;
		$('#input').css('background-color', 'red').animate({
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
	
	$('#input, #wrong-inputs').text('');
	$('#new-problem').hide();
	loadNewProblem = false;
	
	let n;
	// Problem
	if(docCookies.hasItem('currProblem')){
		n = docCookies.getItem('currProblem');
		n = parseInt(n);
	} else {
		n = genNum(LEVEL);
		docCookies.setItem('currProblem', n);
	}
	
	let nStr = commaNum(n);
	problem = nStr;
	$('#problem').text(nStr);
	
	//Answer
	answer = getKoreanNum(n);
}



function getKoreanNum(n){
	let chunks = chopUpNums(n);
	let str = '';
	let bigUnits = ['', '만', '억', '조', '경', '해'];
	let len = chunks.length;
	
	for(let i = 0; i < len; i++){
		let chunkStr = getPartStr(chunks[i]);
		str += chunkStr + bigUnits[len - 1 - i];
	}
	return str;
}

function chopUpNums(n){
	let parts = [];
	while(n > 10000){
		let part = n % 10000;
		n /= 10000;
		n = Math.floor(n);
		parts.unshift(part);
    }
	parts.unshift(n);
	return parts;
}

function commaNum(n){
	let str = '';
	while(n > 999){
		let lastThree = (n % 1000) + '';
		n = Math.floor(n/1000);
		if(lastThree.length == 1) lastThree = '00' + lastThree;
		else if(lastThree.length == 2) lastThree = '0' + lastThree;
		str = ',' + lastThree + str;
	}
	str = n + str;
	return str;
}


function getPartStr(n){
	let str = '';
	let digits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
	let units = ['', '십', '백', '천'];
	let nStr = n + '';
	for(let i = 0; i < nStr.length; i++){
		let part = nStr[i];
		part = parseInt(part);
		let digit = (part > 1 || i == nStr.length - 1) ? digits[part] : '';
		let unit = part > 0 ? units[nStr.length - 1 - i] : '';
		str += digit + unit;
	}
	
	return str;
}
/*
	Level	Non-zero	Zeros	total
	  1 	   2		  3		  5
	  2		   3		  4		  7
	  3		   4	      5       9
	  4		   5		  6      11
	  
	  nonZero = level + 1;
	  Zeros = level + 2;
	  
	  22000

*/


function genNum(level){
	function getUnit(n){
		return Math.pow(10, n);
	}
	
	function randomUpTo(x = 9){
		return Math.floor(Math.random() * x);
	}
	
	let sum = 0;
	let maxUnit = level * 2 + 3;
	let maxPlace = randomUpTo() * getUnit(maxUnit);
	let unitsSet = [maxUnit];
	let nonZeros = level + 1;
	sum += maxPlace;
	while(nonZeros > 0){
		let digit = randomUpTo();
		let place = maxUnit;
		while(unitsSet.indexOf(place) != -1){
			place = randomUpTo(maxUnit);
		}
		unitsSet.push(place);
		sum += (digit * getUnit(place));
		nonZeros--;
	}
	return sum;
}

function insertAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            
            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

function updateStatDisplay(){
	$('#curr-level').text(LEVEL);
	$('#cons-corr').text(consCorr);
	$('#total-corr').text(totalCorr);
	$('#total-q').text(totalQ);
	
	let pct = totalQ == 0 ? '--%' : (Math.floor(totalCorr * 1000 / totalQ) / 10) + '%';
	$('#pct-corr').text(pct);
}

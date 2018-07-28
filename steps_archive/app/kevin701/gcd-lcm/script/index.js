/* global $ */

let gcdAnswer, lcmAnswer, isCorrect;

$(document).ready(function(){
    newProblem();
	$('input').keydown(function(e){
		let key = e.which;
		if(key == 13){ // enter
			submit();
		} else if(key == 27){ // esc
			$(this).val('');
		}
	});
});

function submit(){
	
	let gcdInput = $('#gcd-input').val(),
		lcmInput =  $('#lcm-input').val(),
		date = new Date();
    if(gcdInput && lcmInput){
        if(gcdInput == gcdAnswer && lcmInput == lcmAnswer){
        	$('#wrong-inputs').empty();
    		$('input').css('background-color', 'green')
    			.animate(
    			    {'background-color' : 'white'},
    				1500,
    			);
    		isCorrect = true;
            if(docCookies.hasItem('currProblem')) docCookies.removeItem('currProblem');
    	} else {
    		let clone = $('#wrong-input-template').clone(true).removeAttr('id');
    		clone.find('.wrong-gcd').html(gcdInput);
    		clone.find('.wrong-lcm').html(lcmInput);
    		$('#wrong-inputs').append(clone);
    		isCorrect = false;
    	}
    	
    	
    		
    	let pkg = {
    			timeStamp: `${date.toLocaleDateString()}...${date.toLocaleTimeString()}`,
    			gcd : gcdAnswer, 
    			gcdInput, 
    			lcm : lcmAnswer, 
    			lcmInput,
    			isCorrect
    		};
    	pkg = JSON.stringify(pkg);
        $.ajax({
    		url : 'record.php',
    		crossDomain : true,
    		type : 'post',
    		data : {data : pkg},
    		success : function(response){
                
    		},
    		//async: false,
    		error: function(jqXHR, textStatus, errorThrown){
    		    var text = 'jqXHR.responseText:  ' + jqXHR.responseText
    		            +'<br>jqXHR.responseXML :  ' + jqXHR.responseXML
    			        +'<br>textStatus:   ' +  textStatus
            			+'<br>errorThrown:   ' + errorThrown;
    			//if(o.errorHandler) o.errorHandler(jqXHR, textStatus, errorThrown);
    		},
    		dataType : 'text' //expected data type to be returned from server
    	});
    	if(isCorrect) newProblem();
    }
	
}

function newProblem(){
	isCorrect = undefined;
	$('input').val('');
	$('input').first().focus();
	function nGT(target){ // number Greater Than
		let primes = [2, 2, 2, 3, 3, 5, 7];
		let n = 1;
		while(n < target){
			let r = Math.floor(Math.random() * primes.length);
			let rand = primes[r];
			n *= rand;
		}
		return n;
	}
		
	function getGCD(a, b){
		if(a == 1 || b == 1) return 1;
		let min = Math.min(a, b);
		let max = Math.max(a, b);
		if(max % min == 0) return min;
		return getGCD(max % min, min);
	}
    var n1, n2;
	if(docCookies.hasItem('currProblem')){
        let obj = docCookies.getItem('currProblem');
        obj = JSON.parse(obj);
        n1 = obj.n1, n2 = obj.n2, gcdAnswer = obj.gcdAnswer, lcmAnswer = obj.lcmAnswer;
	} else {
        
        gcdAnswer = nGT(15);
    	let relPrime1 = Math.ceil(Math.random() * 7);
    	let relPrime2 = (function(){
    		let n = relPrime1;
    		while(n == relPrime1){
    			n = Math.ceil(Math.random() * 7);
    		}
    		return n;
    	}());
    	let g = getGCD(relPrime1, relPrime2);
    	relPrime1 /= g;
    	relPrime2 /= g;
    	n1 = gcdAnswer * relPrime1;
    	n2 = gcdAnswer * relPrime2;
    	lcmAnswer = gcdAnswer * relPrime1 * relPrime2;
        
        let obj = {n1, n2, gcdAnswer, lcmAnswer};
        docCookies.setItem('currProblem', JSON.stringify(obj));
	}
	$('.n1').html(n1);
	$('.n2').html(n2);
}



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

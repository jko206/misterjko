/* global $, docCookies, ajaxer*/


var pAndDs = [  // ( ͡° ͜ʖ ͡°
    //     p1       p2      distance [a,b] -> a * sqrt(b)
        [[1,-5], [-2,4],  [3,10]],
        [[3,-2], [-4,-4], [1,53]],
        [[-5,-2], [2,5],  [7, 2]],
        [[-7,8], [-3,-5],  [1, 185]],
        [] // place holder; this is defined by newQuestion()
    ];
var user;


$(document).ready(function(){    
	if(!docCookies.hasItem('user')){
        var name = prompt('What is your name?');
        docCookies.setItem('user', name);
        user = name;
    } else {
        user = docCookies.getItem('user');
    }
    newQuestion();
    if(!docCookies.hasItem('attempts')){
        docCookies.setItem('attempts', 0);
        docCookies.setItem('success', 0);
    }
    $('.button').click(function(){
        var qNum = $(this).attr('id').match(/\d+/)[0];
        qNum = parseInt(qNum);
        var row = pAndDs[qNum];
        var a = row[2][0];
        var b = row[2][1];
        var respA = parseInt($('#q' + qNum + 'a').val()) || 1;
        var respB = parseInt($('#q' + qNum + 'b').val()) || 1; 
        var sqrt = a*a*b;
        var respSqrt = respA * respA * respB;
        
        statObj.attempts++;
        statObj.addQuestion(row[0], row[1], [respA, respB], row[2]);
        if(a == respA  && b == respB){
            alert('yay');
            statObj.success++;
        } else if(sqrt == respSqrt){
            alert('you must simplify');
        } else {
            alert('Wrong. Please try again');
            console.log(row[2]);
        }
        
        docCookies.setItem('attempts', statObj.attempts);
        docCookies.setItem('success', statObj.success);
        ajaxer({
            requestHandler: 'responseRecords.php',
            requestType : 'post',
            data : {data : JSON.stringify({
                user : user,
                attempts: statObj.attempts,
                success : statObj.success,
                statement: (function(){
                    return str = 'p1: ' + row[0] + '\tp2: ' + row[1]
                        + '\tresp: [' + respA + ', ' + respB + ']'
                        + '\tactual: ' + row[2] + '\t timeDate: ' + getTimeDate();
					
                }())
                
            })},
            successHandler : function(){ //if posting is successful
               docCookies.setItem('lastSaved', getTimeDate());
            }, 
            errorHandler : function(e){ //if posting fails
                console.log(e);
            }
        });
    });
    
    $('#new-q').click(function(){
        newQuestion();
    });
    
    $('input').keydown(function(e){
        if(e.which == 13){
            $(this).siblings('.button').click();
        }
    });
    
});

//a and b are given as arrays. 
function distanceBetween(a, b, maxDistance){
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var c2 = dx * dx + dy * dy;
    // prime factorize
    
    //get prime numbers less than n
    var max = maxDistance * maxDistance || 400;
    var primes = (function(n){
        var arr = [];
        var nums = [];
        for(var i = 2; i <=n; i++){
            if(nums[i] === undefined){ //if prime number,
                //then mark all the multiples less <= n false;
                var k = 2; // can't mark itself as composite
                while(k*i <= n){
                    nums[k*i] = false;
                    k++;
                }
                // put nums[i] in primes;
                arr.push(i);
            }
        }
        return arr;
    }(max));
    var prime = primes.shift();
    var pFactors = primeFactorize(c2, prime, primes, []);
    var aRootB = simplifyRadical(pFactors);
    
    //must initialize prime. Fresh list of prime numbers must be provided each use
    function primeFactorize(num, prime, primes, pFactors){
        var dividend = num / prime;
        if(num == 1){
            return pFactors;
        } else if(dividend == parseInt(dividend, 10)){ //num is divisible by prime
            num = dividend;
            pFactors.push(prime);
            return primeFactorize(num, prime, primes, pFactors);
        } else {
            prime = primes.shift();
            return primeFactorize(num, prime, primes, pFactors);
        }
    }
    
    // takes in an array of factors that are inside the sq. root sign
    function simplifyRadical(factors){
        var a = 1;
        var b = 1;
        var last = 1;
        for(var i = 0; i < factors.length; i++){
            var current = factors[i];
            if(current == last){
                b /= current;
                a *= current;
                last = 1;
            } else {
                b *= current;
                last = current;
            }
        }
        return [a, b];
    }
    
    return aRootB;
}

function newQuestion(){
    var p1x = randomBetween(-10,10);
    var p1y = randomBetween(-10,10);
    var p2x = randomBetween(-10,10);
    var p2y = randomBetween(-10,10);
    
    
    $('#p1').text('(' + p1x + ', ' + p1y + ')');
    $('#p2').text('(' + p2x + ', ' + p2y + ')');
    var p1 = [p1x, p1y], p2 = [p2x, p2y];
    
    var d = distanceBetween(p1, p2);
    //if(pAndDs) console.log(pAndDs);
    pAndDs[4] = [p1, p2, d];
    
    function randomBetween(a = 20, b = 0){
        var range = a - b;
        range = range < 0 ? range * -1 : range;
        var r = Math.round(Math.random() * range);
        return r + Math.min(a,b);
    }
}

var statObj = {
    attempts : 0,
    success : 0,
    questions : [],
    addQuestion : function(p1, p2, resp, actual){
        // add to questions as a string what the 
        // points were and the given response was entered
        var str = 'p1: ' + p1 + '\tp2: ' + p2
            + '\tresp: ' + resp + '\tactual: ' + actual;
        this.questions.push(str);
        
    },
    toString : function(){
        return JSON.stringify([
                "attempts: " + this.attempts,
                "success: " + this.success,
                "questions" + JSON.stringify(this.questions)
            ]);
    }
}

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

/* global $ */

var ajaxer = function(o){
	/*
		Object.getOwnPropertyNames(o) ->
		[requestHandler, requestType, data, successHandler, errorHandler, dataType]
	*/
	var append = '';//'https://steps-education-jkeezie.c9users.io/WIP/apps';
    $.ajax({
		url : append + 'php/' + o.requestHandler,
		crossDomain : true,
		type : o.requestType,
		data : o.data,
		success : function(response){
			o.successHandler(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
		    var text = 'jqXHR.responseText:  ' + jqXHR.responseText
		            +'<br>jqXHR.responseXML :  ' + jqXHR.responseXML
			        +'<br>textStatus:   ' +  textStatus
        			+'<br>errorThrown:   ' + errorThrown;
			console.log(text);
			if(o.errorHandler) o.errorHandler(jqXHR, textStatus, errorThrown);
		},
		dataType : (o.dataType || 'text') //expected data type
	});
}

function getTimeDate(){
    var k = new Date();
    var y = k.getFullYear(), m = k.getMonth() + 1, d = k.getDate(), 
    min = k.getMinutes(), h = (k.getHours());
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    min = min < 10 ? '0' + min : min;
    h = h < 10 ? '0' + h : h;
    
    var date = '' + y + '-' + m + '-' + d;
    var time = '' + h + ':' + min;
    return date + ' ' + time;
}

/* global $, docCookies, ajaxer*/
$(document).ready(function(){
  
  // return integer n such that a <= n < b
  function randomBetween(a, b){
    return Math.floor(Math.random() * b) - a; 
  }	
  function powersOf(base, power){
    var arr = [];
    for(var i = 0; i <= power; i++){
      arr.push(Math.pow(base, i));
    }
    return arr;
  }
  window.factors = new Set();
  function findFactors(x, arrays){
    if(arrays == null || arrays.length == 0){
      window.factors.add(x);
    }
    for(var i = 0; i < arrays.length; i++){
      var temp = arrays.splice(i, 1)[0]; //take the array out of the big array
      for(var j = 0; j < temp.length; j++){
        var product = temp[j] * x;
        findFactors(product, arrays);
      }
      arrays.splice(i, 0, temp); // putting the array back in the big array
    }
  }
  window.nQ = newQuestion;
  function newQuestion(){
    $('#factors').hide();
    $('#factors').empty();
    $('input[type="text"]').val('');
    window.factors = new Set();
    window.factorsEntered = new Set();
    
    var pow2 = randomBetween(0, 7); // 0 ~ 6
    var pow3 = randomBetween(0, 5); // 0 ~ 4
    var pow5 = randomBetween(0, 5); // 0 ~ 4
    var pow7 = randomBetween(0, 2); // 0 ~ 1
    
    window.numOfFactors = (pow2 + 1) * (pow3 + 1) * (pow5 + 1) * (pow7 + 1);
    var n = Math.pow(2, pow2) * Math.pow(3, pow3) * Math.pow(5, pow5) * Math.pow(7, pow7);
    $('#number').text(n);
    //console.log(n + ', ' + window.numOfFactors);
    
    for(var k = 0; k < window.numOfFactors; k++){
      var div = $('<input></input>').addClass('factor-input').attr('type', 'text');
      $('#factors').append(div);
    }  
    var arrays = [powersOf(2, pow2), powersOf(3, pow3), powersOf(5, pow5), powersOf(7, pow7)];
    window.factors = new Set();
    findFactors(1, arrays);
    //console.log(window.factors);  
  }
  
  newQuestion();
  
  
  $('#check-answer').click(function(){
    var response1 = $('input[type="text"]').val();

    response1 = parseInt(response1);
    var message = '';
    if(response1 == window.numOfFactors){ 
      $('#factors').show();
      message = 'correct!';
    } else{
      message = 'wrong! try again~';
    }
    alert(message);
  });
  window.factorsEntered = new Set();
  
  $('#factors').on('change', '.factor-input', function(){
    var val = parseInt($(this).val());
    var temp = $(this).data('val');
    temp = parseInt(temp);
    window.factorsEntered.delete(temp);
    $(this).data('val', val);
    var bgColor;
    if(isNaN(val) || val == ''){
      bgColor = '';
    } else if(window.factorsEntered.has(val)){
      bgColor = 'orange';
    }else if(window.factors.has(val)){
      window.factorsEntered.add(val);
      $(this).data('val', val);
      bgColor = 'green';
    } else {
      bgColor = 'red';
    }
    $(this).css('backgroundColor', bgColor);
    if(window.factors.size == window.factorsEntered.size){
      var getNewQuestion = confirm('Good job! New question?');
      if(getNewQuestion){
        newQuestion();
      }
    }
  })
  
  $('input[type="text"]').keydown(function(e){
    if(e.which == 13) $('#check-answer').click();
  });
});

var logout = function(){
  docCookies.removeItem('userID');
  window.location = "login.html";
};

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
	var append = 'https://steps-education-jkeezie.c9users.io/WIP/';
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

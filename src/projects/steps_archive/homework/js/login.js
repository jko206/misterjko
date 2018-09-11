/* global $ */

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

var ajaxer = function(o){
    	/*
    		Object.getOwnPropertyNames(o) ->
    		[requestHandler, requestType, data, successHandler, errorHandler, dataType]
    	*/
    	
    	var append = 'https://steps-education-jkeezie.c9users.io/WIP/homework/';
    	if(window.location.origin == 'http://stepsmath.co.kr') append = '';
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
    		dataType : (o.dataType || 'text') //expected data type to be returned from server
    	});
    };
$(document).ready(function(){
	$('#submit').click(function(){
    	checkCredential();
	});
	$('#password').keydown(function(e){
		if(e.which == 13) checkCredential();
	})
});

function checkCredential(){
	var username = $('#username').val();
	var password = $('#password').val();
	ajaxer({
		requestHandler : 'checkCredential.php',
		requestType : 'post',
		data : {
			username : username,
			password : password
		},
		successHandler: function(response){
			if(response != -1){
				var json = JSON.parse(response);
	    		var userID = json[0];
	    		var lang = json[1];
	    		docCookies.setItem('lang', lang);
	    		var url = docCookies.getItem('redirectTo');
	    		docCookies.setItem('userID', userID);
	    		url = url ? url : 'index.html';
	    		window.location = url;
			} else {
				alert('Please check your username and password combo.');
			}
		},
		errorHandler : function(response){
			console.log(response);
		},
		datatype: 'text'
	});
}
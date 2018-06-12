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
		//async: false,
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

/*
	type: alert (notification), prompt(user input), dialog(yes/no)
	content: if text, just append
		if function, then render
	callback: something to do once the content is rendered
	options:
		-size: specific height/width, default for alert/prompt/dialog,
			cover main area, or whole window
*/
function Popup(type, content, callback, options){
	this.type = type;
	this.content = content;
	var mar = this.type;
	(function(){
		console.log(mar, type);
	}());
}

Popup.prototype.constructor = Popup;

// returns a date and time in 'YYYY-MM-DD HH:MM' format
// passing 'date' or 'time' will return such string.
var getDateTime = function(option){

    var k = new Date();
    var y = k.getFullYear(), m = k.getMonth() + 1, d = k.getDate(), 
    min = k.getMinutes(), h = k.getHours();
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    min = min < 10 ? '0' + min : min;
    h = h < 10 ? '0' + h : h;
    
    var date = '' + y + '-' + m + '-' + d;
    var time = '' + h + ':' + min;
    if(option == 'date'){
        return date;
    } else if(option == 'time'){
        return time;
    } else {
        return date + ' ' + time;    
    }
};

	
// stat reporter should be part of the problem, but timer is part of init
// returns time in ms
function Timer(){
    var startTime;
    return {
        start : function(){
            startTime = new Date();
        }, 
        getRunningTime : function(){
            var t = (new Date()) - startTime;
            return Math.round(t/1000);
        },
        getTime: function(){
            if(startTime){
	            var t = (new Date()) - startTime;
	            this.stop();
	            return Math.round(t/1000);
	        } else {
	            throw "timer hasn't started";
	        }
        },
        stop : function(){
            startTime = undefined;  
        }
    };
}

Timer.prototype.constructor = Timer;

Array.prototype.clone = function(){
	return [...this];
};

/*
	Got it from: https://stackoverflow.com/questions/5537622/dynamically-loading-css-file-using-javascript-with-callback-without-jquery#
*/

function loadStyleSheet( path, fn, scope ) {
   var head = document.getElementsByTagName( 'head' )[0], // reference to document.head for appending/ removing link nodes
       link = document.createElement( 'link' );           // create the link node
   link.setAttribute( 'href', path );
   link.setAttribute( 'rel', 'stylesheet' );
   link.setAttribute( 'type', 'text/css' );

   var sheet, cssRules;
// get the correct properties to check for depending on the browser
   if ( 'sheet' in link ) {
      sheet = 'sheet'; cssRules = 'cssRules';
   }
   else {
      sheet = 'styleSheet'; cssRules = 'rules';
   }

   var interval_id = setInterval( function() {                     // start checking whether the style sheet has successfully loaded
          try {
             if ( link[sheet] && link[sheet][cssRules].length ) { // SUCCESS! our style sheet has loaded
                clearInterval( interval_id );                      // clear the counters
                clearTimeout( timeout_id );
                fn.call( scope || window, true, link );           // fire the callback with success == true
             }
          } catch( e ) {} finally {}
       }, 10 ),                                                   // how often to check if the stylesheet is loaded
       timeout_id = setTimeout( function() {       // start counting down till fail
          clearInterval( interval_id );             // clear the counters
          clearTimeout( timeout_id );
          head.removeChild( link );                // since the style sheet didn't load, remove the link node from the DOM
          fn.call( scope || window, false, link ); // fire the callback with success == false
       }, 15000 );                                 // how long to wait before failing

   head.appendChild( link );  // insert the link node into the DOM and start loading the style sheet

   return link; // return the link node;
}
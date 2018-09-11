/* global $ */

let factorCount, pfactors, firstTry, score = 0, totalQCount = 0, MINIMUM = 300;
let primes = [2, 2, 2, 3, 3, 5, 7];

$(document).ready(function(){
    if(docCookies.hasItem('currProblem')) var currProblem = docCookies.getItem('currProblem');
    newQuestion(currProblem);
    if(docCookies.hasItem('stat')) var stat = docCookies.getItem('stat');
    updateStat(stat);
    $('#check-answer').click(function(){
        let resp = $('#factor-count').text();
        resp = parseInt(resp);
        let bgColor;
        if(resp == factorCount){
            bgColor = 'green';
            $('#check-answer2').show();
            $('#factors').show();
            $(this).hide();
        } else {
            bgColor = 'red';
        }
        $('#factor-count').css({backgroundColor: bgColor}).animate({
            backgroundColor : 'white'
        }, 2000, 'easeOutQuint');
    });
    $('#check-answer2').click(function(){
        let resp = [];
        $('.factor').each(function(){
           let n = $(this).text();
           n = parseInt(n);
           resp.push(n);
        });
        resp.sort();
        for(let i = 0; i < resp.length; i++){
            if(resp[i] != pfactors[i]){
                $('#factors input')
                    .css({backgroundColor: 'red'})
                    .animate({
                        backgroundColor : 'white'
                    }, 3000, 'easeOutQuint');   
                firstTry = false;
                return;
            }
        }
        $(this).hide();
        if(firstTry) score++;
        $('#factors input')
            .css({backgroundColor: 'green'})
            .animate({
                backgroundColor : 'white'
            }, 3000, 'easeOutQuint');  
        updateStat();
        $('#new-problem').show();
    });
    $('#new-problem').click(function(){
        $(this).hide();
        newQuestion();
    });
});

function newQuestion(currProblem){
    
    totalQCount++;
    firstTry = true;
    $('#factor-count').text('');
    $('#factors').empty().hide();
    $('#check-answer').show();
    
    factorCount = -1;
    pfactors = [];
    let composite = 1;
    
    if(currProblem){
        currProblem = JSON.parse(currProblem);
        pfactors = currProblem.pfactors;
        factorCount = currProblem.factorCount;
        composite = currProblem.composite;
    } else {
        
        while(composite < MINIMUM){
            let r = Math.floor(Math.random() * primes.length);
            let pfact = primes[r];
            pfactors.push(pfact);
            composite *= pfact;
        }
        pfactors.sort();
        factorCount = pfactors.length;
        let currProblem = {pfactors, factorCount, composite}
        currProblem = JSON.stringify(currProblem);
        docCookies.setItem('currProblem', currProblem);
    }
    
    
    
    
    
    $('#number').html(composite);
    
    //ready the #factors div
    $('#factors').html(`${composite} = <div contenteditable class="factor"></div>`);
    let loopCount = factorCount - 1;
    while(loopCount){
        let timesFactor = '&times; <div contenteditable class="factor"></div>';
        $('#factors').append(timesFactor);
        loopCount--;
    }
}

function updateStat(stat){
    if(stat){
        stat = JSON.parse(stat);
        totalQCount = stat.totalQCount;
        score = stat.score;
    }
    $('#total-q-count').html(totalQCount);
    $('#score').html(score);
    let pct = '--';
    if(totalQCount > 0){
        pct = Math.round(score / totalQCount * 10000) / 100;    
    }    
    $('#percentage').html(`${pct}%`);
    stat = {totalQCount, score};
    stat = JSON.stringify(stat);
    docCookies.setItem('stat', stat);
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
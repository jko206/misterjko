
/* global $ */
var timerInterval;

var timer = {
	start : 0,
	init : function(){
		this.start = new Date();
	},
	getTime : function(){
		var t = new Date();
		var dt = t - this.start;
		this.start = t;
		return dt;
	},
	getRunningTime : function(){
		return new Date() - this.start;
	}
};

var arithmetic = {
	addLevel : 2,
	subLevel : 2,
	multiLevel : 2,
	addRecord: Infinity,
	subRecord: Infinity,
	multiRecord: Infinity,
	currentType : 0,
	attempts: 0,
	isCurrProbSolved: '',
	init: function(){
		timer.init();
		this.multiLevel = user.multiLevel;
		this.addLevel = user.addLevel;
		this.subLevel = user.subLevel;
		this.multiRecord = user.multiRecord;
		this.addRecord = user.addRecord;
		this.subRecord = user.subRecord;
		this.isCurrProbSolved = true;
		this.loadProblem();
	}, 
	loadProblem : function(){
		//Operand: upper number, operator: bottom number
		var temp = Math.random() * 3;
		var type = Math.floor(temp); // 0 -> +, 1 -> -, 2 -> * 
		this.currentType = type;
		var symbol, record, level, op;
		if(type == 0){ // addition
			symbol = "+";
			record = this.addRecord;
			level = this.addLevel;
			op = function(a, b){
				return a + b;
			}
		} else if(type == 1){ // subtraction
			symbol = "-";
			record = this.subRecord;
			level = this.subLevel;
			op = function(a, b){
				return a - b;
			}
		} else { // multiplication
			symbol = "&#215;";
			record = this.multiRecord;
			level = this.multiLevel;
			op = function(a, b){
				return a * b;
			}
		}
		// Making operand (the top number)
		var exponent = Math.ceil(level / 2 + 0.5);
		var operandMax = Math.pow(10, exponent);
		var operandMin = operandMax / 10;
		var operand = getRandomInt(operandMin, operandMax);
		
		// Making operator(the bottom number)
		var exponent = Math.floor(level / 2 + 0.5);
		var operatorMax = Math.pow(10, exponent);
		var operatorMin = operandMax / 10;
		//var operator = getRandomInt(operatorMin, operatorMax);
		var operator = getRandomInt(10, 99);
		
		// The answer:
		var answer = op(operand, operator);
		
		// Make sure there's no negative answer
		if(type == 1 && operand < operator){
			temp = operand;
			operand = operator;
			operator = temp;
			answer = Math.abs(answer);
		}
		
		//loading them into DOM
		$('#row1').text(operand);
		$('#symbol').html(symbol);
		$('#number').text(operator);
		$('#row3').data('answer', answer);
		$('#row3').data('type', type).val('');
		this.isCurrProbSolved = false;
		
		this.attempts = 1;
		$('#timeFreeze').hide();
		timer.init();
	},
};

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!

$(document).ready(function(){
	// get user data and use its info:
	
	var isMobile = mobilecheck();
	if(isMobile){
		$('#row3').prop('disabled', true);
		$('#virtualKeyboard').show();
		$('button.numkey').click(function(){
			var buttonVal = $(this).val();
			var inputVal = $('#row3').val();
			$('#row3').val(inputVal + '' + buttonVal);
			console.log(buttonVal);
		});
		$('.clear-button').click(function(){
			$('#row3').val('');
		});
		$('.enter-button').click(function(){
			//checkAnswer($('#row3'));
			if(arithmetic.isCurrProbSolved){
				arithmetic.loadProblem();
			} else {
				checkAnswer($('#row3'));
			}
		});
	} else {
		$('#virtualKeyboard').hide();
		$('#row3').prop('disabled', false);
		$('#row3').keypress(function(e){
			if(e.which == 13){
				if(arithmetic.isCurrProbSolved){
					arithmetic.loadProblem();
				} else {
					checkAnswer($(this));
				}
			}
		}).keyup(function(e){
			if(e.keyCode === 27){
				$(this).val('');
			}
		});
	}
	
	arithmetic.loadProblem();
	timer.init();
	updateUI();
	getShowsList();
	
/*
	$('body').on('click', '.video-link', function(){
		var path = $(this).data('path');

		var video = document.getElementById('video');
		var source = document.createElement('source');

		source.setAttribute('src', path);

		video.appendChild(source);
		
		$('#video-viewing-window').show();
		
		video.load();
		video.play();

		setTimeout(function() {  
			video.pause();

			source.setAttribute('src', path); 

			video.load();
			video.play();
		}, 3000);
		
		var video = $('<video></video>')
				.attr('id', 'video')
				.addClass('video-js');
		var source = $('<source>')
				.attr('src', path);
		video.append(source);
		//videojs('video',{});
		$('#video-viewing-window').show().append(video);
		video.play();
		
	});
*/
	

	
	$('#videos-button').click(function(){
		$('#video-list-container').show();
		
		//clearInterval(timerInterval);
		$('#timer').hide();
		//************************//
		//if not enough coins, gray them out or something
		//************************//
		var coins = user.coins;
		if(coins < 1){
			$('#video-list').hide();
			$('#message').show();
		} else {
			$('#video-list').show();
			$('#message').hide();
		}
	});
	
	$('#progress-button').click(function(){
		$('#progress').show();
		//clearInterval(timerInterval);
		$('#timer').hide();
	});
	
	$('.close-button').click(function(){
		$(this).parent().hide();
		$('#timer').show();
	});
	
	$('#timer').dblclick(function(){
		$('#controls').show();
	});
	
	$('body').on('taphold', '#timer', function(){
		alert('ha!');
	});
	docCookies.removeItem('record');
});

function updateAssnStat(data){
	//update it to assnStatUpdater.php
	$.ajax({
		url : 'assnStatUpdater.php',
		type : 'POST',
		data : data,
		success : function(response){
			$('#ajax').html(response);
			//console.log(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
		    var text = 'jqXHR.responseText:  ' + jqXHR.responseText
		            +'<br>jqXHR.responseXML :  ' + jqXHR.responseXML
			        +'<br>textStatus:   ' +  textStatus
        			+'<br>errorThrown:   ' + errorThrown;
			$('#ajax').html(text);
		},
		dataType : 'text' //expected data type
	});
}

function getAssn(data){
	//if given just name, it will get a list of assns
	//if given name and assn #, it will get the contents
	//   of the file 
    $.ajax({
		url : 'assnFetcher.php',
		type : 'POST',
		data : data,
		success : function(response){
			if(data.assnID){	//get assn with assnID
				console.log(response);
				var assnJSON = JSON.parse(response);
				assnJSON = JSON.parse(assnJSON);
				renderAssn(assnJSON);
			} else {	//get a list of assignments.
				//$('#ajax').text(response);
				data = JSON.parse(response);
				
				$('#ajax').text(JSON.stringify(data));
				// DO STUFF WITH DATES
				for(var i = 0; i < data.length; i++){
					var hwID = data[i][0];
					var hwName = data[i][1];
					var date = data[i][2];
					var str = hwName + ' (' + date + ')';
					var option = $('<option>'+ str +'</option>').val(hwID);
					$('#assns').append(option);
				}
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
		    var text = 'jqXHR.responseText:  ' + jqXHR.responseText
		            +'<br>jqXHR.responseXML :  ' + jqXHR.responseXML
			        +'<br>textStatus:   ' +  textStatus
        			+'<br>errorThrown:   ' + errorThrown;
			$('#ajax').html(text);
		},
		dataType : 'text' //expected data type
	});
}

function updateUI(){
	//load points
	$('timeFreeze').hide();
	$('#points').empty();
	var points = user.getPoints();
	for(var i = 0; i < points; i++){
		var point = $('<div></div>')
				.text(1)
				.addClass('point');
		$('#points').append(point);
	}
	
	$('#videos-button').data('coins', user.coins);
	
	//update coin count
	if(user.coins > 0){
		$('#coins').show().text(user.coins);
	} else {
		$('#coins').hide().text(0);
	}
	
	//update record
	var type = $('#row3').data('type');
	var record;
	if(type == 0){
		record = user.addRecord;
	} else if(type == 1){
		record = user.subRecord;
	} else {
		record = user.multiRecord;	
	}
	
	if(record == Infinity){
		$('#record').text('--');
	} else {
		//display only down to 1/100
		var t = record / 10;
		t = Math.floor(t) / 100;
		$('#record').text(t);
		/*$('#countdown').effect('size', {
			to: {height : 0},
			origin: ['bottom']
		}, record);*/
	}
	
	timerInterval = setInterval(function(){
	var t = timer.getRunningTime();
		t = Math.floor(t / 10);
		var extraZero = t%10 == 0 ? '0' : '';
		$('#timer').text((t / 100) + extraZero);
	}, 10);
}

/****************/
var notLocked = true;

$.fn.animateHighlight = function(highlightColor, duration) {
    var highlightBg = highlightColor || '#FFFF9C';
    var animateMs = duration || 1500;
    var originalBg = this.css('backgroundColor');
    if (notLocked) {
        notLocked = false;
        this.stop().css('background-color', highlightBg)
            .animate({backgroundColor: originalBg}, animateMs);
        setTimeout( function() { notLocked = true; }, animateMs);
    }
};

/****************/

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.ceil(Math.random() * (max - min)) + min;
}

function getShowsList(){
	$.ajax({
		url : 'helper.php',
		type : 'GET',
		data : {
			request : 'getShowList'
		},
		success : function(response){
			//$('#ajax').html(response).show();
			generateVideosList(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
		    var text = 'jqXHR.responseText:  ' + jqXHR.responseText
		            +'<br>jqXHR.responseXML :  ' + jqXHR.responseXML
			        +'<br>textStatus:   ' +  textStatus
        			+'<br>errorThrown:   ' + errorThrown;
			$('#ajax').html(text);
		},
		dataType : 'json' //expected data type
	});
};

function getProgress(){

};

function generateVideosList(showsList){
	//console.log(showsList);
	/*
<ul>
	<li>Coffee</li>
	<li>Tea
		<ul>
			<li>Black tea</li>
			<li>Green tea</li>
		</ul>
	</li>
	<li>Milk</li>
</ul>
	*/
	var ul = $('<ul></ul>');
	for(var i = 0; i < showsList.length; i++){
		var seriesName = showsList[i].seriesName;
		var seasons = showsList[i].seasons;
		var li = $('<li>' + seriesName + '</li>');
		for(var j = 0; j < seasons; j++){
			var ul2 = $('<ul>Season '+ (j+1) +'</ul>');
			for(var k = 0; k < showsList[i].episodes[j].length; k++){
				var ep = showsList[i].episodes[j][k];
				var epTitle = ep.epTitle;
				var path = ep.filePath;
				
				var li2 = $('<li></li>');
				var a = $('<a>'+ epTitle + '</a>')
						.attr('href', 'videoPlayer.php?play=' + path)
						.attr('target', '_blank')
						.addClass('video-link')
						.data('path', path)
						.click(function(){
							user.coins--;
							updateUI();
							$('#video-list-container').hide();
							var record = JSON.stringify(user);
							//docCookies.setItem('record', record);
							$('#timer').show();
						});
				li2.append(a);
				ul2.append(li2);
			}			
			li.append(ul2);
		}
		ul.append(li);
	}
	ul.addClass('cbp-ntaccordion').attr('id','video-list');
	
	$('#video-list-container').append(ul);
	
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



var mobilecheck = function() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

var checkAnswer = function(inputBox){
	var answer = $(inputBox).data('answer');
	var input = $(inputBox).val();
	if(input == '') return;
	if(answer == input){
		//flash green;
		$(inputBox).animateHighlight('green', 500);
	
		// check if record is broken
			//if broken, give 3 points, load new record
		var t = timer.getTime();
		var type = $(inputBox).data('type');
		var record;
		if(type == 0){
			record = user.addRecord;
		} else if(type == 1){
			record = user.subRecord;
		} else {
			record = user.multiRecord;			
		}
		if(t < record){
			if(type == 0){
				user.addRecord = t;
			} else if(type == 1){
				user.subRecord = t;
			} else {
				user.multiRecord = t;
			}
			$('#record').animateHighlight('green', 500);
			user.updatePoints(3);
		}
		// give point
		user.updatePoints(1);
		$('#countdown').css('height', '100%');
		updateUI(); //record, timer, countdown, points.
		$('#timeFreeze').text(t).show();
		
		arithmetic.isCurrProbSolved = true;
		
		//********************************************
		var stat1 = JSON.stringify(user);
		var stat2 = JSON.stringify({
			'userID' : userID,
			'level' : (function(){
				if(type == 0) return user.addLevel;
				if(type == 1) return user.subLevel;
				if(type == 2) return user.multiLevel;
			})(),
			'type' : type,
			'tLength' : t
		});
		
		updateStat(stat1, stat2);
		
		//********************************************
		
	} else {
		inputBox.val('').animateHighlight('red', 500);
		arithmetic.attempts++;
		user.updatePoints(-1);
		updateUI();
	}
	$(inputBox).val('');
}

function updateStat(stat1, stat2){
	$.ajax({
		url : 'helper.php',
		type : 'POST',
		data : {
			action : 'performance',
			data1 : stat1,
			data2 : stat2
		},
		success : function(response){
			//$('#ajax').html(response).show();
			console.log(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
		    var text = 'jqXHR.responseText:  ' + jqXHR.responseText
		            +'<br>jqXHR.responseXML :  ' + jqXHR.responseXML
			        +'<br>textStatus:   ' +  textStatus
        			+'<br>errorThrown:   ' + errorThrown;
			$('#ajax').html(text);
		},
		dataType : 'text' //expected data type
	});
}
























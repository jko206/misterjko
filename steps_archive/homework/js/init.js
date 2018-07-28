// This file should facilitate UI and communication with the server

// When user clicks "check" or something to check the answer,
// this will ask the problem.js whether the question is right or wrong

// showing video (or at least opening the window)
// managing and displaying points

// custom make an alert, prompt, and confirm dialogue box 


/* global $, docCookies, PointsSetting, videoList start loadHomework ajaxer currentExercise userID ReqHandler recordResponse*/

var JS_VERSION = 1;

var language;
(function(){
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
    window.docCookies = {
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
    
    /*REFRESH IF THE PAGE IS OLD*/
    var loadToday = setInterval(function(){
       var dateToday = (new Date()).getDate();
        if(docCookies.hasItem('lastDate')){
            var lastDate = docCookies.getItem('lastDate');
            if(lastDate != dateToday){
                docCookies.setItem('lastDate', dateToday);
                location.reload(true);
            }
        } 
    }, 600);
    
    
    /*REFRESH IF THE PAGE IS OLD*/
    
    window.allExercises = new Set();
    //CHECK IF USER IS LOGGED IN
    // if(docCookies.hasItem('userID')){
        // var userID = window.userID = docCookies.getItem('userID');
    // } else {
        // var currLocation = window.location.toString();
        // docCookies.setItem('redirectTo', currLocation);
        // window.location = 'login.html';
    // }
    // language = docCookies.getItem('lang');
    language = 'eng';
    window.ajaxer = function(o){
    	/*
    		Object.getOwnPropertyNames(o) ->
    		[requestHandler, requestType, data, successHandler, errorHandler, dataType]
    	*/
    	
    	var append = 'https://steps-education-jkeezie.c9users.io/WIP/homework/';
    	if(window.location.origin == 'http://stepsmath.co.kr') append = '';
		append = '';
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
    
    //check if JS is current. Else, hard refresh.
    window.ajaxer({
        requestHandler : 'checkJSVersion.php',
        requestType : 'get',
        data : {version : 1},
        successHandler: function(response){
            if(!JSON.parse(response)) window.location.reload(true);
        }, 
        errorHandler: function(a,b,c){
            console.log(a, b, c);
        }
    })

	window.PointsSetting = (function(){
	    
	    var pointsPerCoin, EARNED_COIN = false; //earedCoin is used for rendering
		var points, coins, pointsPerCorrect, global = this;
		var wrongCount = 0, wrongLimit = 3, penalty = -1, IS_PENALIZED = false; //IS_PENALIZED is for rendering purposes
		var timeBonus = 5, timeForBonus = 30/*in seconds*/, currentTimeBonus, countdown; 
		var TRACK_WIDTH = $('#total-points-track').width();
		return {
		    //coins earned can be never taken away. Only points.
		    init: function(settings){
		        points = settings.points ? settings.points : 0;
		        pointsPerCorrect = settings.pointsPerCorrect ? settings.pointsPerCorrect : 10;
		        coins = settings.coins ? settings.coins : 0;
		        pointsPerCoin = settings.pointsPerCoin ? settings.pointsPerCoin : 100;
		        wrongCount = settings.wrongCount ? settings.wrongCount : 0;
		        wrongLimit = settings.wrongLimit ? settings.wrongLimit : 3;
		        penalty = settings.penalty ? settings.penalty : -5;
		        timeBonus = settings.timeBonus ? settings.timeBonus : 5;
		        timeForBonus = settings.timeForBonus ? settings.timeForBonus : 60;
		        
		        
		        $('#total-points').text(points);
		        $('#potential-penalty').text(penalty);
		        this.renderPenaltyMeter();
                this.renderPointsMeter();
		    },
		    saveSetting : function(){
		        var data = {
	                points,
	                coins,
	                wrongCount
		        };
	            
		        ajaxer({
		            requestHandler: 'pointsHandler.php',
		            requestType : 'post',
		            data : {
	                    userID : 1, 
	                    data : JSON.stringify(data)
		            },
		            successHandler : function(response){
		                
		            },
		            errorHandler : function(){
		                
		            },
		            dataType : 'text'
		            
		        });
		        return global;
		    },
		    loadSetting: function(){
		        points = docCookies.hasItem('points') ? parseInt(docCookies.getItem('points')) : 0;
		        coins = docCookies.hasItem('coins') ? parseInt(docCookies.getItem('coins')) : 0;
		        pointsPerCoin = docCookies.hasItem('pointsPerCoin') 
		                ? parseInt(docCookies.getItem('pointsPerCoin')) : 5;
		        return global;
		    },
            getPoints: function(){
                return points;  
            },
		    renderPointsMeter: function(){
                var t = 0;
		        $('#coins').text(coins);
		        if(EARNED_COIN){ //render full points
		            t = 500;
    		        $('#coins').text(coins).effect(
                        'highlight', 
                        {color: 'yellow', easing: 'easeOutBack'},
                        1500 // , callBack()
                    );
		        }
	            //render current points
	            $('#total-points').text(points);
		        setTimeout(function(){
	                
                    var finalWidth = TRACK_WIDTH * points / pointsPerCoin;
                    $('#total-points-meter').animate({
                        width: finalWidth
                    }, 800);
		        }, t);
		        return global;
            },
            penalize: function(){
                wrongCount++;
                if(wrongCount >= wrongLimit){
                    wrongCount %= wrongLimit;
                    IS_PENALIZED = true;
                    points += penalty;
                }
            },
            resetPenalty: function(){
                wrongCount = 0;  
            },
            renderPenaltyMeter: function(){
                //if IS_PENALIZED, go full, then come back down
                var finalWidth = wrongCount / wrongLimit * 100;
                if(IS_PENALIZED){
                    $('#penalty-count-meter').animate({
                        width: '100%'
                    },800, 'easeOutBack', function(){
                        $(this).animate({
                            backgroundColor: 'white'
                        }, 1000, function(){
                            $(this).width(0).css({
                                backgroundColor : 'red'
                            })
                        });
                    });
                    IS_PENALIZED = false;
                } else {
                    $('#penalty-count-meter').animate({
                        width : finalWidth + '%'
                    });
                }
            },
            //getWrongCount(){return wrongCount},
            startBonusTimer: function(){
                if(window.currentExercise == undefined) return;
                if(countdown){
                    clearInterval(countdown);
                    countdown = false;
                }
                currentTimeBonus = timeBonus;
                $('#potential-time-bonus').text(currentTimeBonus);
                $('#time-bonus-meter').width('100%');
                
                countdown = setInterval((function(){
                    var secsPerPoint = timeForBonus / timeBonus;
                    var time = 0;
                    var timeLimit = timeForBonus * 1000;
                    var width = $('#time-bonus-track').width();
                    var widthDecrement = width / timeLimit;
                    return function(){
                        time += 10;
                        var newWidth = width - time * widthDecrement;
                        $('#time-bonus-meter').width(newWidth);
                        if(time % (secsPerPoint* 1000) == 0){
                            currentTimeBonus--;
                            $('#potential-time-bonus').text(currentTimeBonus);
                        }
                        if(time >= timeLimit) clearInterval(countdown);
                    }
                    }()), 10);
            },
            stopBonusTimer: function(){
                points += currentTimeBonus;
                currentTimeBonus = 0;
                if(countdown){
                    clearInterval(countdown);
                    countdown = false;
                }
            },
		    changePointsBy : function(d){
		        points += parseInt(d);
		        if(points < 0){
		            points = 0;
		        } else if(points >= pointsPerCoin){
		            EARNED_COIN = true;
		            coins += parseInt(Math.floor(points / pointsPerCoin));
		            points %= pointsPerCoin;
		        }
		        this.renderPointsMeter();
		        this.saveSetting();
		    },
		    changeCoinsBy : function(d){
		        coins += d;
		        this.renderPointsMeter();
		        this.saveSetting();
		    },
		    getCoins : function(){
		        return coins;
		    },
		    updatePoints: function(isCorrect){
				if(isCorrect){
				    var point = currentExercise == 'BasicArithmetic' ? 2 : pointsPerCorrect;
				    var point = currentExercise == 'DecAddSub' ? 1 : point;
				    point += currentTimeBonus;
				    this.resetPenalty();
				    this.renderPenaltyMeter();
				} else {
				    point = 0;
				    this.penalize();
				    this.renderPenaltyMeter();
				}
				this.changePointsBy(point);
				this.renderPointsMeter();
				this.saveSetting();
		    }
		};
	}());
	
	// stat reporter should be part of the problem, but timer is part of init
	// returns time in ms
	window.Timer = (function(){
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
	}());
	


    window.loadHomework = function(homeworkList){
        // console.log('here');
        if(homeworkList && homeworkList.length != 0){
            // console.log('here 2');
            var elmt = homeworkList.shift();
            var exercise = elmt.exercise;
            var settings = elmt.settings;
            var lastProblem = elmt.lastProblem;
            var reqs = elmt.requirements;
            $.getScript('exercises/' + exercise + '/script.js', function(){
                $.ajax({
                    url: 'exercises/' + exercise + '/style.css',
                    dataType: 'text',
                    success:function(data){
                        $('head').append('<style>' + data + '</style>');
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        console.log('something happened while fetching homework');
                        console.log(jqXHR, textStatus, errorThrown);
                    }
                });
                loadHomework(homeworkList);
				window.allExercises.add = exercise;
				window.createToggle(exercise);
                window[exercise].init(settings, lastProblem);
                window.ReqHandler.setReqs(exercise, reqs);  //<-----------------------
            });
        } else {
            $('#main-area').show();
        }
    };
    
    
    //loading the pointsSettings and homework
    ajaxer({
        requestHandler : 'homeworkHandler.php',
        requestType : 'get',
        data: {
            userID : 1
        },
        successHandler : function(response){
            if(response != -1){
                var list = (function(list){
                    var bracketList = [];
                    for(var i = 0; i < list.length; i++){
                        var char = list[i];
                        if(char == '['){
                            bracketList.push(char);
                        } else if(char == ']'){
                            bracketList.pop();
                            if(bracketList.length == 0) break;
                        }
                    }
                    return list.substring(0, i+1);
                }(response));
                list = JSON.parse(list);
                window.loadHomework(list);
            } else {
                console.log('failed to get homeworklist');
            }
        },
        errorHandler : function(jqXHR, textStatus, errorThrown){
            console.log('something happened while fetching homework');
            console.log(jqXHR, textStatus, errorThrown);
        },
        dataType : 'text'
    });

    window.ReqHandler = (function(){
        var reqsMet = {}; //Bool for each req for all assn.
        var reqs = {};
        var getReqState = function(isCorrect, t, FIRST_TRY, ex, reqs, callback){
			if(isCorrect === true || isCorrect === false){
				var data = {
					exercise : ex,
					isCorrect : (isCorrect ? 1 : 0),
					userID : 1,
					date: window.getDateTime('date'),
					duration: t, 
					FIRST_TRY : FIRST_TRY
				};
				var requestType = 'post';
			} else {
				data = {
					exercise : ex,
					userID : 1,
					date: window.getDateTime('date'),
				}
				requestType = 'get';
			}
			ajaxer({
				requestHandler: 'processReqs.php',
				requestType,
				data,
				errorHandler: function(e){console.log(e)},
				successHandler: function(rs){
				    if(rs){
    				    rs = JSON.parse(rs);
    					callback(ex, reqs, rs);
				    }
				}
			});
		}
		
        function renderState(exercise, reqs, reqState){
            for(var reqType in reqs){
                if(reqs.hasOwnProperty(reqType)){
                    var goal = reqs[reqType];
                    var curr = reqState[reqType] ? reqState[reqType] : 0;
                    var reqMetElmt = $('#' + exercise + '-' + reqType + '-met');
                    if(curr >= goal){
                        curr = goal;
                        reqMetElmt.closest('.req-item').find('.checkmark').addClass('checked');
                        if(!reqsMet[exercise]) reqsMet[exercise] = {}; // <-- this shouldn't exist;
                        reqsMet[exercise][reqType] = true;
                        
                        //reqMetElmt.text(curr).removeAttr('id'); // so the number stays locked once req is met
                    }
                    reqMetElmt.text(curr);
                }
            }
            if(o.areReqsMet()){
                $('#show-video-list-container').css({
                    background: 'none',
                    color: 'black'
                });
            } else {
                $('#show-video-list-container').css({
                    background: '#ddd',
                    color: 'white'
                });
            }
        }
        
        var o = {
            setReqs: function(ex, r){                   //<-----------------------
                //render UI; req details
                reqs[ex] = r;
                if(!r){return;} // don't make req-details if there is no reqs
                var toggler = $('#' + ex + '-toggle');
        		var reqItems = $('<div></div>').addClass('req-items')
                    .attr('id', ex + '-req-details');
                var reqDetailsOpenerArrow = $('<div></div>').addClass('req-items-opener-arrow');
                var reqDetailsOpener = $('<div></div>')
                        .addClass('req-items-opener')
                        .append(reqDetailsOpenerArrow, reqItems);
                toggler.append(reqDetailsOpener);
                for (var reqType in reqs[ex]) {
                    if (reqs[ex].hasOwnProperty(reqType)) {
                        var reqGoal = reqs[ex][reqType];
                        var reqDescText = displayText(reqType, language);
        		        reqItems.append($(
                            '<div class="req-item">'
                            + '	<div class="checkmark-box">'
                            + '		<div class="checkmark"></div>'
                            + '	</div>'
                            + '	<div class="req-desc"> '
                            + 		reqDescText
                            + '	</div>'
                            + '	<div class="req-progress">'
                            + '		<span class="req-met" id="'+ ex + '-' + reqType + '-met">0</span> '
                            + '		/'
                            + '     <span class="req-goal" id="'+ ex + '-' + reqType + '-goal">'
                            +           reqGoal 
                            + '     </span>'
                            + '	</div>'
                         + '</div>'
        		        ));
        		        // set up Bool for req
                        if(!reqsMet[ex]) reqsMet[ex] = {};
                        reqsMet[ex][reqType] = false;
                    }
                }
                getReqState('','', '', ex, r, renderState);
            },
            updateReqState: function(isCorrect, t, FIRST_TRY){
                var ex = currentExercise;
                getReqState(isCorrect, t, FIRST_TRY, ex, reqs[ex], renderState);
            }, 
            areReqsMet : function(){
                //if(Object.keys(reqsMet).length === 0 && reqsMet.constructor === Object) return false;
                var bool = true;
                for(var exercise in reqsMet){
                    if(reqsMet.hasOwnProperty(exercise)){
                        var e = reqsMet[exercise];
                        for(var reqType in e){
                            if(e.hasOwnProperty(reqType)){
                                var temp = e[reqType];
                                bool = bool && temp;
                                if(!bool) return false;
                            }
                        }
                    }
                }
                return true;
            }
        };
    
        return o;
    }());
    
    window.createToggle = function(exercise){
        var exName = window[exercise].getExName(language);
		var toggler = $('<div>'+ exName +'</div>')
			.addClass('exercise-list-item hoverable')
			.attr('id', exercise + '-toggle')
			.click(function(){
				$('.ex-container').hide();
				$('#'+ exercise + '-container').show();
				window.currentExercise = exercise;
				$('#current-exercise').text(exName);
			    for(let e of window.allExercises){
				    window[e].stopExercise();
				}
				window[exercise].startExercise();    
			});
		$('#exercise-list').append(toggler);
    };
    
    window.updateLastProblem = function(data){
	    ajaxer({
	        requestHandler : 'homeworkHandler.php',
	        requestType : 'post',
	        data,
	        successHandler : function(response){
	            if(response == 1){
	                console.log('failed to update last problem');
	            } else {
	                console.log(response);
	            }
	        },
	        errorHandler : function(){
                console.log('failed to update last problem. Error occurred.');
	        },
	        dataType : 'text'
	    });
    }
    
    //// Stuff for when the user submits the response
    window.recordResponse = function(probResp, t, isCorrect, level, skillSet, FIRST_TRY){
        var ex = currentExercise;
		ajaxer({
			requestHandler: 'recordResponses.php',
			requestType: 'post',
			data: {
				exercise : ex,
				response : probResp,
				userID : 1,
				date: window.getDateTime('date'),
				time: window.getDateTime('time'),
				duration: t,
				level,
				skillSet,
				isCorrect, 
				FIRST_TRY
			},
			errorHandler: function(e){console.log(e)},
			successHandler: function(message){/*/console.log(message);/**/}
		});
    }
    
    window.processResponse = function(ex, isCorrect, t, probResp, level, skillSet, FIRST_TRY){
        if(isCorrect){
            var flashColor = 'green';
            $('#load-' + ex+'-problem').show().focus();
            PointsSetting.stopBonusTimer();
			window.updateLastProblem({
	            userID : 1,
	            exercise : ex,
	            lastProblem : ''
	        });
        } else {
            flashColor = 'red';
        }
        $('#' + ex +'-container').find('.input')
                .effect('highlight', {
                    color: flashColor,
                    easing: 'easeOutBack'
                }, 1500)
                .text('');
        PointsSetting.updatePoints(isCorrect);
        ReqHandler.updateReqState(isCorrect, t, FIRST_TRY);
		recordResponse(probResp, t, isCorrect, level, skillSet, FIRST_TRY);
    }
    
    window.addToWrongResps = function(wr){
        if(!wr){
            $('#wrong-resps').width(0);
            return;
        }
        var $wr = $(wr).addClass('wrong-resp');
		var w = 0;
		var h = 0;
		$('#wrong-resps').append($wr).children().each(function(i){
		    w += $(this).outerWidth(true);
		    var temp = $(this).outerHeight(true);
		    h = temp > h ? temp : h;
		});
		$('#wrong-resps').width(w).height(h);
		window.renderMath();
    }
    
}());

//location.reload();
$(document).ready(function(){
    var host = window.location.host;
    if(host == 'stepsmath.co.kr' || host == 'www.stepsmath.co.kr'){
        $(document).contextmenu(function(e){
        	e.preventDefault();
        });        
    }
    $('#current-exercise').text(displayText('todo'));
    $('#non-main').attr('unselectable','on')
            .bind('selectstart', function(){ return false; });

	$('#new-problem').click(function(){
        if(PointsSetting.getPoints() < 30){
	        alert(displayText('notEnoughPoints'));
	        return;
	    }
		var response = confirm(displayText('loadNewProb'));
		if(response){
		    var ex = window.currentExercise;
		    window[ex].loadProblem();
			PointsSetting.changePointsBy(-30);
            $('#wrong-resps').empty();
		}
	});
    $('#numpad').hide();
    
    var dblTap = false;
    $('#logo').click(function(){
    	if(dblTap) window.location.reload(true);
    	else {
    		dblTap = true;
    		setTimeout(function(){
    			dblTap = false;
            }, 500);
        }
    });
    
    //get points settings
    ajaxer({
        requestHandler : 'pointsHandler.php',
        requestType : 'get',
        data: {
            userID : 1
        },
        successHandler : function(response){
            if(response != -1){
                var response = JSON.parse(response);
                var o1 = response[0];
                var o2 = response[1];
                var settings = {};
                for(var prop in o1){
                    settings[prop] = o1[prop];
                }
                for(prop in o2){
                    settings[prop] = o2[prop];
                }
                PointsSetting.init(settings);
            } else {
                console.log('failed to get points');
            }
        },
        errorHandler : function(){
            
        },
        dataType : 'text'
    });
    
    /********** KEYBOARD SHORTCUTS   **********
    // For all inputs and contenteditable div, 
    // pressing Enter will find the submit button and click it
    // pressing ESC will erase the answer
    ////////////////////////////////////////*/
    $('body').on('keydown', '.input, div[contenteditable]', function(e){
        var numKeys = [// 48~ 57, 96~105
                9, 16, // tab, shift
                48, 49, 50, 51, 52, 53, 54, 55, 56, 57, //row nums
                96, 97, 98, 99, 100, 101, 102, 103, 104, 105, //num pad
                110, 190//,        // decimal point / period
                //107, 109, 187, 189 // plus, mins (numpad), plus/equal, mins
            ];
        var loadButton = $('#' + currentExercise +'-container')
                .find('.load-problem-button');
        var isButtonVisible = loadButton.is(':visible');
        if(e.which == 13 && isButtonVisible){
			e.preventDefault();
            loadButton.click();
        } else if(e.which == 13){
			e.preventDefault();
			window[currentExercise].submitResponse();
        } else if(e.which == 27 || e.which == 8 || e.which == 46){
            $(this).text('');
		} else if(numKeys.indexOf(e.which) < 0){
            e.preventDefault();
        }
    });
	
	
	$('.close-container').click(function(){
	    $(this).closest('.container').hide();
	});
	
	$('#show-settings').click(function(){
		$('#submit-settings').toggle().css('display', 'inline-block');
		$('#settings-wrapper').toggle();
	});
	$('#submit-change').click(function(){
	    var pw = $('#password').val();
        if(checkPassword(userID, pw)){
            window[currentExercise].loadSettings();
        } else {
            console.log('wrong password');
        }
	});
	$('#password').keydown(function(e){
	    if(e.which == 13) $('#submit-change').click();
	});
	
	$('#show-controls').click(function(){
        // SHOW CURRENT SETTING!!!!!!!!!!!!!!!!!!
		$('#controls').toggle();
	});
	
	$('#close-controls').click(function(){
		$('#controls').hide();	
		$('#settings-wrapper').hide();	
	});

	$('#submit-settings').click(function(){
		var pw = $('#password').val();
		var data = $('#password').data('password');
		if(pw == data){
            
            //ASK "LOAD NEW PROBLEM?" OR 'MUST LOAD NEW PROBLEM'
            // OR SOMETHING LIKE THAT
		}
	});
	
	$('#close-video-list-container').click(function(){
		$('#video-list-container').hide();	
	});
	
	$('#show-video-list-container').click(function(){
	    if(!window.ReqHandler.areReqsMet()){
	        alert(displayText('mustCompleteReq'));
	        $('#show-video-list-container').css({
                background: '#ddd',
                color: 'white'
            });
	    } else if(PointsSetting.getCoins() > 0){
			$('#video-list-container').toggle();
		} else {
			alert(displayText('needMoreCoin'));
		}
	});
	
	$('#show-video-list-container-disabled').click(function(){
	    if(window.ReqHandler.areReqsMet()){
	        $('#show-video-list-container-disabled').attr('id', 'show-video-list-container');
	    } else {
	        alert(displayText('mustCompleteReq'));
	    }
	        
	})
	
    $.get('videoList.txt', {}, function(msg){
        var list = JSON.parse(msg);
        //console.log(msg);
        var videoList = (function generateVideosList(showsList){
        	var ul = $('<ul></ul>').attr('id', 'accordion');
        	for(var i = 0; i < showsList.length; i++){
        		var seriesName = showsList[i].seriesName;
        		var seasons = showsList[i].seasons;
        		seriesName = $('<span></span>')
        		        .addClass('video-list-toggle series-name')
        		        .text(seriesName);
        		var li = $('<li></li>').append(seriesName);
        		for(var j = 0; j < seasons; j++){
        		    var season = $('<span></span>')
        		            .addClass('video-list-toggle')
        		            .text('Season '+ (j+1));
        			var ul2 = $('<ul></ul>').append(season);
        			for(var k = 0; k < showsList[i].episodes[j].length; k++){
        				var ep = showsList[i].episodes[j][k];
        				var epTitle = ep.epTitle;
        				var path = ep.filePath;
        				
        				var li2 = $('<li></li>').addClass('episodes');
        				var a = $('<a>'+ epTitle + '</a>')
        						.attr('href', 'php/videoPlayer.php?play=' + path)
        						.attr('target', '_blank')
        						.addClass('video-link')
        						.data('path', path)
        						.click(function(){
        							PointsSetting.changeCoinsBy(-1);
        							$('#video-list-container').hide();
        							//var record = JSON.stringify(user);
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
        	return ul;
        }(list));
        $('#video-list-container').append(videoList);
        $('.video-list-toggle').click(function(){
            $(this).siblings().toggle();
        }).siblings().hide();
    }, 'text');
	
	$('#log-out').click(function(){
	    docCookies.removeItem('userID');
	    window.location = 'login.html';
	});
});

function checkPassword(userID, pw){
    var list = {
        1 : 'kevinissmart',
        2 : 'maxtothemax',
        3 : 'me'
    };
    return pw === list[userID];
}

function displayText(txt, lang = language){
    lang = lang.toLowerCase();
    var map = {
        'totalCorrect' : {
            'eng' : 'Total Correct',
            'kor' : '맞춘 문제들'
        },
        'consCorrect' : {
            'eng' : 'Consecutive Correct',
            'kor' : '연속으로 맞춤'
        },
        'mustCompleteReq' : {
            'eng' : 'You must complete today\'s task',
            'kor' : '오늘의 숙제를 모두 끝내야 합니다.'
        },
        'needMoreCoin' : {
            'eng' : 'You need more coins.',
            'kor' : '동전을 더 모아야 합니다.'
        },
        'loadNewProb' : {
            'eng' : 'If you start a new problem, you will lose 10 points. Continue?',
            'kor' : '새로운 문제를 내면 점수가 30점 깍입니다. 새로운 문제를 풀겠습니까?'
        },
        'todo' : {
            'eng' : 'To Practice: ',
            'kor' : '연습할 것들'
        },
        'notEnoughPoints' : {
            'eng' : 'You do not have enough points',
            'kor' : '점수가 부족합니다.'
        }
    };
    return map[txt][lang];
}
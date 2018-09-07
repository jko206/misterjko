/* global $ currEx*/
/*
	args = {
		exercise : shortName, str 
		requirements: {}, obj
		currProb: **, string, obj, or array
		settings: {}, obj
		pointsConfig: {} obj
	};
*/
function Exercise(args){
    var shortName = args.exercise, fullName, exObj = this, reqs = [];
	/*
	types of requirements:
		best time			-- time
		average time		-- time
		consCorrect			-- correct
		total correct		-- correct
		percent correct		-- correct
		total responses (maybe): just how many times the question has been 
			answered
	*/
	function Req(reqType, goal, uiContainer){
		this.corrs = []; // all of isCorr
		this.times = []; // all of the times for this ex;
		this.met; // whether requirement has been met;
		this.curr;
		this.goal = goal; // requirement to meet;
		this.reqType = reqType;
		var reqObj = this;

		
		(function(){
			var reqTypeLong;
			switch(reqType){
				case 'avgT':
					reqTypeLong = 'Average Time';
					break;
				case 'bestT':
					reqTypeLong = 'Best Time';
					break;
				case 'ttlCorr':
					reqTypeLong = 'Total Correct';
					break;
				case 'consCorr':
					reqTypeLong = 'Consecutive Correct';
					break;
				case 'pctCorr':
					reqTypeLong = 'Percentage Correct';
					break;
				default:
					reqTypeLong = '????';
			}
			var checkmark = $(
				''
				+ '<div class="checkmark-box">'
				+ '	<div class="checkmark"></div>'
				+ '</div>'
			);
			var desc = $('<div class="req-desc">' 
					+ reqTypeLong
					+'</div>'
			);
			var reqProgress = $('<div class="req-progress"></div>');
			var reqCurr = $('<div class="req-curr">0</div>');
			var reqGoal = $('<div class="req-goal">'+goal+'</div>');
			reqProgress.append(reqCurr, '/', reqGoal);
			
			var reqItem = $('<div class="req-item"></div>')
					.append(checkmark, desc, reqProgress);
			uiContainer.append(reqItem);
		}());
	}
	Req.prototype.constructor = Req;
	Req.prototype.update = function(isCorrect, time){
		if(!this.met){
			
		}
	}
	//get the exercise script
    $.getScript('exercises/' + shortName + '/script.js', function(){
        $.ajax({
            url: 'exercises/' + shortName + '/style.css',
            dataType: 'text',
            success:function(data){
                $('head').append('<style>' + data + '</style>');
            }
        });
        var exName = exObj.name = window[shortName]['getExName']();
        var launcher = $('#' + shortName + '-launcher');
        var children = $(launcher).children().detach();
        $(launcher).text(exName).append(children);
        window[shortName].init();
    });
    
    //render the exercise onto the bar
    var exListItem = $('<div class="exercise-list-item hoverable">'
    		+ (fullName ? fullName : '')
    		+ '</div>')
    		.attr('id', shortName+'-launcher')
    		.click(function(){
    			var container = '#' + shortName + '-container';
    			$('.exercise-container').hide();
    			$(container).show();
    			if(currEx != shortName){
    				exObj.start();
    				window[currEx+'Obj'].stop();
    			} 
    			
    		});
    $('#exercise-list').append(exListItem);
    //create points manager, timer, etc for this exercise.
    
    if(!$.isEmptyObject(args.requirements)){
    	var reqOpener = $('<div></div>')
    			.addClass('req-items-opener');
    	var reqOpenerArrow = $('<div></div>')
    			.addClass('req-items-opener-arrow');
    	var reqItems = $('<div></div>')
    			.addClass('req-items');
    	reqOpener.append(reqOpenerArrow, reqItems);
    	console.log(shortName);
    	$('#' + shortName + '-launcher').append(shortName, reqOpener);
    	
    	for(var req in args.requirements){
    		var goal = args.requirements[req];
    		reqs.push(new Req(req, goal, reqItems));
    	}
    }
    
    
}

Exercise.prototype = {
	constructor : Exercise,
	start(){
		//set main area 
		//show exercise
		//start timer
		//load the timer/ pointsMngr with time
		//
	},
	stop(){
		//hide exercise
		//pause timer
		//
	}
}

/*
	for each exercvise in exercise list,
	creat a new obj named ShorNameObj and put it in
	window[ShortNameObj]
*/

var loadHomework = function(){
	var list = [
		{exercise: 'CompDecNew', requirements: {ttlCorr : 10}},
		{exercise: 'ReRuNew', requirements: {avgT : 1000}}
	];
}
var INTEGER_PROBLEMS = true;

$(document).ready(function(){
	loadTiles(true);
	createDropSites();
	$('#apply-button').on('click', apply);
	$('#simplify-button').on('click', function(){getEquality(true)});
	$('#new-problem').on('click', function(){
		generate();
		$('#log-items').children().remove();
		updateLog();
	});
	$('#log-container').mCustomScrollbar({
		theme: 'dark'
	});
	$('#undo').on('click', function(){
		navigateLog(-1);
	});
	$('#redo').on('click', function(){
		navigateLog(1);
	});
	generate();
	updateLog();
	controlOperation();
	//make scales sortable();
	$('#check-sol').on('click', function(){
		INTEGER_PROBLEMS = !INTEGER_PROBLEMS;
		var text = INTEGER_PROBLEMS ? 'INT. PROBLEM' : 'FRAC. PROBLEM';
		$(this).text(text);
		generate();
	});
	$('#close-button').on('click', function(){
		$('#tarp').hide();
	});
});

// This is work in progress. 
function checkSolution(value){
	$('#left-solution').mCustomScrollbar({
		theme: 'dark'
	});
	$('#right-solution').mCustomScrollbar({
		theme: 'dark'
	}); // update mCustomScrollBar by .mCustomScrollbar('update');
	if(value !== undefined){
		var numer = value[0];
		var denom = value[1];
		$('#tarp').show();
	}
}

// Generates new problem; updates the scale info, 
// and loads tiles accordingly
function generate(){
	$('.scale').children().remove();
	var randInt = getRandInt(); // .length = 8;
	
	var integers = true;
	if(INTEGER_PROBLEMS){
		createTile(randInt[0], 1, 'left-scale', false, false);
		createTile(randInt[2], 1, 'left-scale', true, false);
		createTile(randInt[4], 1, 'right-scale', false, false);
		createTile(randInt[6], 1, 'right-scale', true, false);
	} else {
		createTile(randInt[0], randInt[1], 'left-scale', false, false);
		createTile(randInt[2], randInt[3], 'left-scale', true, false);
		createTile(randInt[4], randInt[5], 'right-scale', false, false);
		createTile(randInt[6], randInt[7], 'right-scale', true, false);
	}
	
	var reduced = reduceNumbers(randInt[0], randInt[1]);
	$('#left-scale').data('problem-num', reduced);
	reduced = reduceNumbers(randInt[2], randInt[3]);
	$('#left-scale').data('problem-var', reduced);
	reduced = reduceNumbers(randInt[4], randInt[5]);
	$('#right-scale').data('problem-num', reduced);
	reduced = reduceNumbers(randInt[6], randInt[7]);
	$('#right-scale').data('problem-var', reduced);
}

// Helps generate a new problem by coming up with new numbers
// in a way so that there isn't same amount of x's on both scales
function getRandInt(){
	var arr = new Array();
	for (var i = 0; i < 8; i++){
		var num = 0;
		while (num == 0){
			num = Math.floor(Math.random() * 12);
		}
		var neg = Math.floor(Math.random() * 2)%2 == 0 ? 1 : -1;
		arr[i] = num*neg;
	}
	while(arr[2] == arr[6]){
		var num = 0;
		while (num == 0){
			num = Math.floor(Math.random() * 15);
		}
		arr[6] = num;
	}
	return arr;
}

/*Applies the division/multiplication according to what tile is
	loaded on the drop-marks. Also updates the scale info
*/
function apply(){
	var leftKids = $('#left-scale').children();
	var rightKids = $('#right-scale').children();
	var multiFactor = $('#multiply-tile').data('numer');
	var divideFactor = $('#divide-tile').data('numer');
	var isMultiNeg = multiFactor < 0;
	var isDivideNeg = divideFactor < 0;
	multiFactor = multiFactor == null ? 1 : multiFactor;
	divideFactor = divideFactor == null ? 1 : divideFactor;
	var isNegative = !(isMultiNeg == isDivideNeg); // + * + = + , - * - = +

	if(multiFactor == 0 || divideFactor == 0){
		alert ('dividing or multiplying by 0');
	}
	multiFactor = Math.abs(multiFactor);
	divideFactor = Math.abs(divideFactor);
	
	for(var k=0; k < 2; k++){
		var scaleSide;
		var kidslist;
		if(k==0){
			scaleSide = 'left-scale';
			kidslist = leftKids;
		} else {
			scaleSide = 'right-scale';
			kidslist = rightKids;
		}
		for(var i=0; i < kidslist.length; i++){
			var tile = $(kidslist[i]);
			var numer = tile.data('numer');
			var denom = tile.data('denom');
			var isX = tile.data('isX');
			numer = isNegative ? -numer : numer;
			numer *= multiFactor;
			denom = divideFactor>0 ? denom*divideFactor : denom;
			createTile(numer, denom, scaleSide, isX);
		}
		kidslist.remove();
	}
	
	//update the original equations
	multiFactor = isNegative ? -multiFactor : multiFactor;
	var leftScaleNum = $('#left-scale').data('problem-num');
	var leftScaleVar = $('#left-scale').data('problem-var');
	var rightScaleNum = $('#right-scale').data('problem-num');
	var rightScaleVar = $('#right-scale').data('problem-var');
	leftScaleNum[0] *= multiFactor;
	leftScaleNum[1] *= divideFactor;
	leftScaleVar[0] *= multiFactor;
	leftScaleVar[1] *= divideFactor;
	rightScaleNum[0] *= multiFactor;
	rightScaleNum[1] *= divideFactor;
	rightScaleVar[0] *= multiFactor;
	rightScaleVar[1] *= divideFactor;
	$('#left-scale').data('problem-num', leftScaleNum);
	$('#left-scale').data('problem-var', leftScaleVar);
	$('#right-scale').data('problem-num', rightScaleNum);
	$('#right-scale').data('problem-var', rightScaleVar);
	
	$('#multiply .tile').remove();
	$('#divide .tile').remove();
	
	//update log
	updateLog("*", [multiFactor, divideFactor]);
	controlOperation();
}

function getEquality(simplify){
	simplify = (simplify !== undefined);
	// array = [numerator, denominator]
	// TOTAL weight 
	var leftNum = [0,1];
	var leftX = [0, 1];
	var rightNum = [0, 1];
	var rightX = [0, 1];
	
	$('.scale').each(function(){
		var sum;
		var xSum;
		if($(this).attr('id') == 'left-scale'){
			sum = leftNum;
			xSum = leftX;
		} else {
			sum = rightNum;
			xSum = rightX;
		}
		$(this).children().each(function(){
			var n = $(this).data('numer');
			var d = $(this).data('denom');
			var isX = $(this).data('isX');
			var tempArray;
			if(isX){
				tempArray = addFractions(n, d, xSum[0], xSum[1]);
				xSum[0] = tempArray[0];
				xSum[1] = tempArray[1];
			} else {
				tempArray = addFractions(n, d, sum[0], sum[1]);
				sum[0] = tempArray[0];
				sum[1] = tempArray[1];
			}
		});
	});
	
	// Determining Equality
	leftScaleNum = $('#left-scale').data('problem-num');
	leftScaleVar = $('#left-scale').data('problem-var');
	rightScaleNum = $('#right-scale').data('problem-num');
	rightScaleVar = $('#right-scale').data('problem-var');
	
	leftWeight = addFractions(-leftScaleNum[0], leftScaleNum[1], leftNum[0], leftNum[1]);
	leftXWeight = addFractions(-leftScaleVar[0], leftScaleVar[1], leftX[0], leftX[1]);
	rightWeight = addFractions(-rightScaleNum[0], rightScaleNum[1], rightNum[0], rightNum[1]);
	rightXWeight = addFractions(-rightScaleVar[0], rightScaleVar[1], rightX[0], rightX[1]);

	var isEqual = (leftWeight[0] == rightWeight[0] 
				&& leftWeight[1] == rightWeight[1]
				&& leftXWeight[0] == rightXWeight[0]
				&& leftXWeight[1] == rightXWeight[1]);
	
	if(isEqual){
		//update scale data
		$('#left-scale').data('problem-num', leftNum);
		$('#left-scale').data('problem-var', leftX);
		$('#right-scale').data('problem-num', rightNum);
		$('#right-scale').data('problem-var', rightX);
		
		//simplify
		if(simplify){
			$('#left-scale').children().remove();
			$('#right-scale').children().remove();
			
			if(leftNum[0] != 0)createTile(leftNum[0], leftNum[1], 'left-scale', false);
			if(leftX[0] != 0)createTile(leftX[0], leftX[1], 'left-scale', true);
			if(rightNum[0] != 0)createTile(rightNum[0], rightNum[1], 'right-scale', false);
			if(rightX[0] != 0)createTile(rightX[0], rightX[1], 'right-scale', true);
			updateLog("+", leftWeight, leftXWeight);
			
			controlOperation();
		}
	} else if(simplify){
		alertUnequal();
		loadLog($($('.current-state')[0]));
	}
	return isEqual;

}

/*
	op = operation performed: either "+" or "*"
	amount = an array of non-variable [numer, denom]
	amountX = an array of variable [numer, denom] (applies only to "+")
*/
function updateLog(op, amount, amountX){
	removeBelowCurrent();

	if(op !== undefined){
		var sign;
		var n = amount[0];
		var d = amount[1];
		var applied = '';
		if(n != 0){
			if(op == '*'){
				console.log('here');
				sign = '<span style="font-weight: bold">&#215;</span>';
			} else {
				if (n >= 0){
					sign = ' <span style="font-weight: bold">+</span> ';
				} else {
					n *= -1;
					sign = ' - ';
				}
			}
			applied = sign + n;
			if(d > 1) applied += '/' + d;
		}
		
		if(amountX !== undefined && amountX[0] != 0){
			var nX = amountX[0];
			var dX = amountX[1];
			if (nX >= 0){
				sign = ' + ';
			} else {
				nX *= -1;
				sign = ' - ';
			}
			applied += sign + nX + 'x';
			if(dX > 1) applied += ' / ' + dX;
		}
		
		var leftEqn = $('<span>' + applied + '</span>');
		var rightEqn = leftEqn.clone();
		leftEqn.addClass('left-eqn');
		rightEqn.addClass('right-eqn');
		var div = $('<div></div>')
		div.addClass('op-applied');
		div.addClass('log-item');
		div.append(leftEqn);
		div.append(rightEqn);
		$('#log-items').append(div);
	}
	
	
	
	$('.current-state').removeClass('current-state');
	var logItem = $('<div></div>');
	var leftEqn = $('<span></span>');
	leftEqn.attr('class', 'left-eqn');
	var rightEqn = $('<span></span>');
	rightEqn.attr('class', 'right-eqn');
	var equalSign = $('<span>=</span>').attr('class', 'equal-sign');
	$('.scale').each(function(){
		var scaleID = $(this).attr('id');
		var str = '';
		$(this).children().each(function(){
			var numer = $(this).data('numer');
			var denom = $(this).data('denom');
			var isX = $(this).data('isX');
			var str = $(this).data('str');
			if(denom > 1){
				str = str.replace(' ', '');
				str = str.replace(' ', '');
			}

			if(numer > 0){
				str = '&nbsp;&nbsp;+&nbsp;&nbsp;' + str;
			} else {
				str = str.replace('-', '');
				str = '&nbsp;&nbsp;-&nbsp;&nbsp;' + str;
			}

			var item = $('<span>' + str + '</span>');
			item.data('numer', numer);
			item.data('denom', denom);
			item.data('isX', isX);
			item.attr('class', 'tile-source');
			
			if(scaleID == 'left-scale'){
				leftEqn.append(item);
			} else {
				rightEqn.append(item);
			}
		});
	});
	
	var firstItem = $($(leftEqn).children()[0]);
	var text = firstItem.text().substring(5);
	if(firstItem.data('numer') < 0) text = '-' + text;
	firstItem.text(text);
	
	firstItem = $($(rightEqn).children()[0]);
	text = firstItem.text().substring(5);

	if(firstItem.data('numer') < 0) text = '-' + text;
	firstItem.text(text);
	
	logItem.append(leftEqn);
	logItem.append(equalSign);
	logItem.append(rightEqn);
	logItem.on('click', function(){
		
		loadLog($(this));
	});
	logItem.attr('class', 'log-item');
	logItem.addClass('state');
	logItem.addClass('current-state');
	var index = 0;
	$('.state').each(function(){
		var num = $(this).data('index');
		index = num > index ? num : index;
	});
	index++;
	logItem.data('index', index);
	$('#log-items').append(logItem);
	alignLogItems();
	
	//scroll to bottom:
	$('#log-container').mCustomScrollbar('update');
	$('#log-container').mCustomScrollbar('scrollTo', 'bottom');
	
}

function alignLogItems(){
	$('.left-eqn').each(function(){
		var width = $(this).css('width');
		width = 220 - parseInt(width);
		$(this).css('left', width);
	});
}

function removeBelowCurrent(){
	var isBelowCurrent = false;
	$('.log-item').each(function(){
		var cls = $(this).attr('class');
		if(isBelowCurrent){
			$(this).remove();
		}
		if(cls.indexOf('current-state') >= 0){
			isBelowCurrent = true;
		}
	});
}

function loadLog(state){
	$('.current-state').removeClass('current-state');
	state.addClass('current-state');
	$('#left-scale').children().remove();
	$('#right-scale').children().remove();
	var leftEqn = $(state.children()[0]);
	var rightEqn = $(state.children()[2]);
	
	var sum = [0,1];
	var sumX = [0, 1];
	leftEqn.children().each(function(){
		var numer = $(this).data('numer');
		var denom = $(this).data('denom');
		var isX = $(this).data('isX');
		createTile(numer, denom, 'left-scale', isX);
		if(isX){
			sumX = addFractions(sumX[0], sumX[1], numer, denom);		
		} else {
			sum = addFractions(sum[0], sum[1], numer, denom);		
		}
	});
	$('#left-scale').data('problem-num', sum);
	$('#left-scale').data('problem-var', sumX);
	
	sum = [0,1];
	sumX = [0, 1];
	rightEqn.children().each(function(){
		var numer = $(this).data('numer');
		var denom = $(this).data('denom');
		var isX = $(this).data('isX');
		createTile(numer, denom, 'right-scale', isX);
		if(isX){
			sumX = addFractions(sumX[0], sumX[1], numer, denom);		
		} else {
			sum = addFractions(sum[0], sum[1], numer, denom);		
		}
	});
	$('#right-scale').data('problem-num', sum);
	$('#right-scale').data('problem-var', sumX);
}

function navigateLog(increment){
	var currentIndex = $('.current-state').data('index');
	var toLoad;
	$('.state').each(function(){
		if($(this).data('index') == currentIndex + increment){
			toLoad = $(this);
		}
	});
	if(toLoad !== undefined) loadLog(toLoad);
}

function loadTiles(customTile){
	//tile should have:
	numbers = [1,2,3,10,4,5,6,25,7,8,9]
	for(var i = 0; i < numbers.length; i++){
		createTile(numbers[i], 1, 'pos-tiles', false, false);
	}
	for(var i = 0; i < numbers.length; i++){
		createTile(-numbers[i], 1, 'neg-tiles', false, false);
	}
	createTile(1, 1, 'pos-tiles', true, false);
	var testTile = createTile(-1, 1, 'neg-tiles', true);
	if(customTile){
		var customTile = createTile(0, 1, 'custom-tile-area', false);
		$(customTile).attr('id', 'custom-tile');
	}
}

//PRE: numer != 0 && denom != 0
function reduceNumbers(numer, denom){
	var isNegative = !(numer < 0 == denom < 0)
	numer = Math.abs(numer);
	numer = isNegative ? -numer : numer;
	denom = Math.abs(denom);
	if(numer != 0){
		var gcd = getGCD(Math.abs(numer), denom);
		numer /= gcd;
		denom /= gcd;
	}
	return [numer, denom];
}

/*PRE: denom > 0 */
function createTile(numer, denom, containerID, isX){
	
	// Set up negative-ness
	var reduced = reduceNumbers(numer, denom);
	numer = reduced[0];
	denom = reduced[1];
	
	// Set up str
	if(denom == 0) alert('denominator is 0');
	var str = "";
	
	
	// integers
	if(numer != 0){
		str += numer;	
		if(isX){
			if(numer == 1){
				str = 'x';
			} else if (numer == -1){
				str = '-x';
			} else {
				str += 'x';				
			}
		}
		
		//-fractions
		if(denom > 1){
			str += (" / " + denom);
		}
	}
	
	var tileStr = 'tile';
	
	//set class
	if(str.length > 3 && str.length < 6){
		tileStr += ' medium-tile';
	} else if(str.length >= 6){
		tileStr += ' large-tile';
		str = str.replace(' ', '');
		str = str.replace(' ', '');
	}
	
	var tile = $('<div>'+str+'</div>');
	tile.addClass(tileStr);
	tile.data('numer', numer);
	tile.data('denom', denom);
	tile.data('isX', isX);
	tile.data('str', str);
	
	$('#'+containerID).append(tile);
	tile.draggable({
		revert: 'invalid',
		start: function(event, ui){
			controlOperation(true);
		},
		stop: function(event, ui){
			controlOperation();
		}
	});
	return tile;
}

function createDropSites(){
	$('.drop-site').each(function(){
		var newParentID = $(this).attr('id');
		var isScaleDrop = newParentID == 'left-scale' || newParentID == 'right-scale';
		var isTrashDrop = newParentID == 'discard';
		var isCustomDrop = newParentID == 'custom-drop'; //dropping ONTO the custom-area
		var isOpDrop = newParentID == 'multiply' || newParentID == 'divide'; 
		
		var isEqual;
		$(this).droppable({
			accept: '.tile',			
			drop: function(event, ui){
				var tile = ui.draggable; // tile that is being moved about
				var oldParent = tile.parent();
				var oldParentID = oldParent.attr('id');
				var oldParentClass = oldParent.attr('class');
				var grandParentID = $("#"+oldParentID).parent().attr('id');
							
				var numer = tile.data('numer');
				var denom = tile.data('denom'); 
				var isX = tile.data('isX');
		
				if(isScaleDrop){
					if(numer != 0) createTile(numer, denom, newParentID, isX);
				} else if(isCustomDrop && !isX){
					var customN = $('#custom-tile').data('numer');
					var customD = $('#custom-tile').data('denom');
					$('#custom-tile').remove();
					var arr = addFractions(numer, denom, customN, customD);
					console.log('custom-drop');
					var newTile = createTile(arr[0], arr[1], 'custom-tile-area', false);
					$(newTile).attr('id', 'custom-tile');
				} else if(isOpDrop && !isX){
					console.log(newParentID);
					var opTileID = newParentID + '-tile';
					console.log(opTileID);
					if($('#' + opTileID).size() == 0){
						var newTile = createTile(numer, denom, newParentID, isX);
						$(newTile).attr('id', opTileID);
					}
				} else if(isTrashDrop){
					//if so: reproduce the scale from the parent
					if(tile.attr('id') == 'custom-tile'){
						numer = 0;
						denom = 1;
					}
				}
				
				//recreate the tile
				if(grandParentID == 'tile-area'){
					var isCustomTile = tile.attr('id') == 'custom-tile';
					var newTile = createTile(numer, denom, oldParentID, isX);
					if(isCustomTile && !isCustomDrop){
						$(newTile).attr('id', 'custom-tile');
					} else if(isCustomTile && isCustomDrop){
						$(newTile).remove();
					}
				}
				controlOperation();
				tile.remove();
				organizeTiles();
			}
		});
	});
}

function organizeTiles(){
	$('#pos-tiles').children().remove();
	$('#neg-tiles').children().remove();
	loadTiles(false);
}

//Pre: x > 0 && y > 0;
function getGCD(x, y){
	if(x == y){return x;}
	else if(x>y){return getGCD(x-y, y);}
	else {return getGCD(x, y-x)};
}

function controlOperation(showDiscard){
	if(showDiscard){
		$('#simplify-button').hide();
		$('#apply-button').hide();
		$('#discard').show();
	} else {
		$('#discard').hide();
		var occupied = $('#multiply-tile').length != 0 || $('#divide-tile').length != 0;
		if(occupied){
			$('#simplify-button').hide();
			$('#apply-button').show();
		} else {
			$('#apply-button').hide();
			$('#simplify-button').show();
		}
	}
}

//n = numerator, d = denominator
//PRE: d1 != 0 && d2 != 0
function addFractions(n1, d1, n2, d2){
	//console.log('adding fractions');
	var gcd = getGCD(d1, d2);
	var n = ((n1*d2)+(n2*d1)) / gcd;
	var d = d1*d2/gcd;
	if((n/d)%1===0){
		n /= d;
		d = 1;
	}
	return [n, d];
}

function alertUnequal(){
	$('#op-set').hide();
	$('#unequal-sign').show();
	$('#operators').css('background-color', '#fbb');
	setTimeout(function(){
		$('#unequal-sign').hide();
		$('#op-set').show();
		$('#operators').css('background-color', '"rgba(252, 252, 248, 0.7)"');
	}, 1000);
}


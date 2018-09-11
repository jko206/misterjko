
/* global PreMath $ jQuery*/

/*
options:[
	hideDigits: as when the term is a subtractor 
	lightUp: when target is met, UI elements change in certain way
]
*/
var rightDigitsArr = [], leftDigitsArr = [], digitsMap = {right:{}, left:{}};
function Digit(container, digit, base, level, unit, acct){
	var isFrac = level == 'f';

	var unit1 = isFrac ? `$\\frac{1}{${base}}$` : unit;
	var unit5 = isFrac ? `$\\frac{5}{${base}}$` : 5 * unit;
	var unit10 = isFrac ? `$\\frac{10}{${base}}$` : 10 * unit;
	var unit20 = isFrac ? `$\\frac{20}{${base}}$` : 20 * unit;
	
	var unitStr = isFrac ? 'f' : (unit + '').split('.').join(''); //get rid of decimal point;
	var thisUI = $(`<div class="level${level} digit"></div>`);
	
	var divs = {1: [], 5: [], 10: [], 20: []};
	var currDivCount = 0;
	
	container.prepend(thisUI);
	var cousin, levelAbove, levelBelow;
	var o = {
		renderState(n){ // n: how much to change by
			if(isNaN(n)) throw new Error('n is NaN. ' + n + ' given');
			if(n < 0 && -n > currDivCount) throw new Error('that cannot happen');
			divs = {1: [], 5: [], 10: [], 20: []};
			//thisUI.html('');
			var makeDivs = function(n){
			// console.log(divs, n, typeof n);
				if(n == 0) return;
				if(n < -20){
					divs[20].shift().remove();
					n += 20;
					currDivCount -= 20;
				} else if(n < -10){
					divs[10].shift().remove();
					n += 10;
					currDivCount -= 10;
				} else if(n < -5){
					divs[5].shift().remove();
					n += 5;
					currDivCount -= 5;
				} else if(n < 0){
					console.log(divs);
					divs[1].shift().remove();
					n += 1;
					currDivCount--;
				} else if(n < 5){
					var div = $(`<div class="unit unit${unitStr} onesy">${unit1}</div>`).data('count', 1);
					divs[1].push(div);
					n--;
					currDivCount++;
				} else if(n < 10){
					div = $(`<div class="unit unit${unitStr} fiver">${unit5}</div>`).data('count', 5);
					divs[5].push(div);
					n -= 5;
					currDivCount += 5;
				} else if(n < 20){
					div = $(`<div class="unit unit${unitStr} tenner">${unit10}</div>`).data('count', 10);
					divs[10].push(div);
					n -= 10;
					currDivCount += 10;
				} else {
					div = $(`<div class="unit unit${unitStr} fiver">${unit20}</div>`).data('count', 20);
					divs[20].push(div);
					n -= 20;
					currDivCount += 20;
				}
				thisUI.append(div);
				makeDivs(n);
			}
			makeDivs(n);
			if(thisUI.children().length) thisUI.children().draggable({
				'revert': true, 
				drag: function(){
					$(this).removeClass('selected');
				},
			});
			o.show();
			if(isFrac) PreMath.renderMathJax();
			return this;
		},
		set(d){
			digit = d;
			this.renderState(d);
			return this;
		},
		recountDivs(){
			thisUI.children().each(function(){
				let count = $(this).data('count');
			});
		},
		hide(fromCousin){
			thisUI.css('display', 'none');
			if(!fromCousin && cousin) cousin.hide(true);
			return this;
		},
		show(fromCousin){
			thisUI.css('display', 'block');
			if(!fromCousin && cousin) cousin.show(true);
			return this;
		},
		changeDivCount(d){
			currDivCount += d;	
		},
		setDenom(d){
			if(isFrac){
				base = d;
				unit1 = `$\\frac{1}{${base}}$`;
				unit5 = `$\\frac{5}{${base}}$`;
				unit10 = `$\\frac{10}{${base}}$`;
				unit20 = `$\\frac{20}{${base}}$`;
			}
			Object.keys(divs).forEach(function(key){
				divs[key].forEach(function(e, i, arr){
					var content = key == 1 && unit1
							|| key == 5 && unit5
							|| key == 10 && unit10
							|| key == 20 && unit20;
					e.html(content);
				});
			});
			PreMath.renderMathJax();
			return this;
		},
		getUnitStr(){
			return unitStr;	
		},
		setRelation(d, relation){
			if(relation == 'cousin'){
				cousin = d;
			} else if(relation == 'above'){
				levelAbove = d;
			} else if(relation == 'below'){
				levelBelow = d;
			} else {
				throw new Error('Relation must be provided. ' + relation + ' given');
			}
		}
	};
	thisUI.droppable({
		accept: `.unit${unitStr}`,
		drop: function(event, ui){
			var elem = ui.draggable;
			//if: the unit div is not being dropped in the same place it started from...
			if(!elem.is($(this).children())){ 
				var count = elem.data('count');
				o.renderState(count);
				console.log('origin');
				cousin.renderState(-count);
				
			}
		}
	});
	o.set(digit);
	thisUI.children().draggable();
	return o;
}
Digit.prototype.constructor = Digit;
 
//cont(ainer)= where all the digits will be; L = left, R = right
function Terms(contL, contR, options){
	//init(cont, d, base, level, unit, acct), set(int),
	//hide(), show(), setDenom(denom), setCousin(digitObj), changeBy(int)
	
	//init
	if(options && options.toLowerCase()){
		var hideDigits = options.contains('hidedigits');
		var lightUp = options.contains('lightup');
		var base = (options.contains('base') && options.base * 1);
		//set individual digit targets????
	}
	var minLevel = Infinity, maxLevel = -Infinity, hasFrac = false;
	base = base || 10;
	
	//Rational Number objects
	var leftCurr = new PreMath.RationalNumber(0), leftTarget = new PreMath.RationalNumber(0), 
		rightCurr = new PreMath.RationalNumber(0), rightTarget = new PreMath.RationalNumber(0);
	// accountant. Any change in value of Digits will be reflected in the total
	var leftAcct = function(n){
		leftCurr.plus(n);
		if(leftCurr.isEqualTo(leftTarget)) 1; // do something;
	};
	var rightAcct = function(n){ 
		rightCurr.plus(n);
		if(rightCurr.isEqualTo(rightTarget)) 1; // do something;
	}
	
	for(var i = -11; i < 11; i++){
		var level = i == -11 ? 'f' : i;
		var unit = typeof level == 'number' ? Math.pow(base, level) : '';
		var leftD = new Digit(contL, 0, base, level, unit, leftAcct);
		var rightD = new Digit(contR, 0, base, level, unit, rightAcct);
		
		leftDigitsArr.push(leftD), rightDigitsArr.push(rightD);
		digitsMap['left'][level] = leftD, digitsMap['right'][level] = rightD;
		rightD.setRelation(leftD, 'cousin'), leftD.setRelation(rightD, 'cousin');
		if(lastRight){
			rightD.setRelation(lastRight, 'below');
			lastRight.setRelation(rightD, 'above');
		}
		if(lastLeft){
			leftD.setRelation(lastLeft, 'below');
			lastLeft.setRelation(leftD, 'above');
		}
		var lastRight = rightD, lastLeft = leftD;
		/*************************************************
		 * 
		 * set fraction's upper to level 0
		 * *********************************************/
		
		leftD.hide(), rightD.hide();
	}
	
	var o = {
		//x: number to be loaded, side: left or right
		//x and target are both RationalNumber objects
		loadNum(x, target, side){ 
			if(side == 'left'){
				leftTarget = target, leftCurr = x;
			} else if(side == 'right'){
				rightTarget = target, rightCurr = x;
			} else {
				// throw exception
			}
			//then load the new number
			var xBits = (new PreMath.RationalNumber(x)).breakdown();
			var maxLevel = xBits[0].level;
			var minLevel = xBits.getLast().level;
			if(minLevel == 'f'){
				var showFrac = true;
				minLevel = xBits[xBits.length - 2].level;
			}
			//console.log(maxLevel, minLevel, showFrac);
			xBits.forEach(function(e, i, arr){ //element, index, current array(xBits)
				var level = e.level;
				var digit = e.digit;
				var base = e.base;
				digitsMap[side][level].set(digit);
				if(level == 'f'){
					digitsMap['left'][level].setDenom(base);	
					digitsMap['right'][level].setDenom(base);	
				} 
			});
		},
		reset(){
			Object.keys(digitsMap).forEach(function(key, i, thisArr){
				digitsMap(key).set(0).hide();
			});
		}
	};
	return o;
}
 
Terms.prototype.constructor = Terms;

$(document).ready(function(){
	var t1 = $('#term1'), t2 = $('#term2');
	var terms = new Terms(t1, t2/*, options */);
	var num1 = new PreMath.RationalNumber(123.456);
	var target1 = new PreMath.RationalNumber(0);
	
	var num2 = new PreMath.RationalNumber('78 9/11');
	var target2 = new PreMath.RationalNumber(0);
	
	terms.loadNum(num1, target1, 'left');
	terms.loadNum(num2, target2, 'right');
	
	//get left and right terms from #eq-input
	
	//process what left and right load and targets should be
	
	//t.loadNum() <-- fill in appropriately
	
	///////////////////////////////////////////////////////////////////
	///    IF FRACTION PROBLEM, SET LEVEL0'S BELOW TO FRACTION      ///
	///////////////////////////////////////////////////////////////////
	var selectedClass, base, digitObj, count, divCount;
	$('body').on('click', '.unit', function(){
		var currClass = $(this).attr('class').split(' ')[1];
		if(selectedClass != currClass){
			$('.selected').removeClass('selected');
			base = count = divCount = 0;
			digitObj = undefined;
		} else {
			$(this).addClass('selected');
			divCount++;
			base // get base from the tile or somethiandadskfaj;dfkjasd;faklsdj;f
			count += $(this).hasClass('onesy') && 1 
					&& $(this).hasClass('fiver') && 5
					&& $(this).hasClass('tenner') && 10 
					&& $(this).hasClass('twenner') && 20;
			if(divCount == 1 && (count == 1 || count == 5 || count == 10 || count == 20)){
				$('#split').removeClass('disabled');//enable split
				$('#combine').addClass('disabled');//disable combine
			} else if(count == base || count == 5 || count == 10 || count == 20) {
				//enable combine
				//disable split
				$('#combine').removeClass('disabled');//enable combine
				$('#split').addClass('disabled');//disable split
			} else {
				//disable both;
				$('#split').addClass('disabled');//disable split
				$('#combine').addClass('disabled');//disable combine
			}
			
		}
	});
	$('body').on
	
});
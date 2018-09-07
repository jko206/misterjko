
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
	
	var unitStr = (unit + '').split('.').join(''); //get rid of decimal point;
	var thisUI = $(`<div class="level${level} digit"></div>`);
	
	container.prepend(thisUI);
	var cousin;
	var o = {
		set(d, render = true){
			digit = d;
			if(render) this.renderState();
			return this;
		},
		renderState(){
			thisUI.html('');
			var count = digit;
			var divs = '';
			var name = '';
			while(count > 0){
				if(count >= 20){
					var decr = 20;
					var str = unit20;
					name = 'twenner'
				} else if(count >= 10){
					decr = 10;
					str = unit10;
					name = 'tenner'
				} else if(count >= 5){
					decr = 5;
					str = unit5;
					name = 'fiver'
				} else {
					decr = 1;
					str = unit1;
					name = 'onesy'
				}
				count -= decr;
				divs += `<div class="unit unit${unitStr} ${name}">${str}</div>`;
			}
			thisUI.html(divs);
			thisUI.children().draggable();
			this.show();
			PreMath.renderMathJax();
			return this;
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
		setDenom(d){
			if(isFrac){
				base = d;
				unit1 = `$\\frac{1}{${base}}$`;
				unit5 = `$\\frac{5}{${base}}$`;
				unit10 = `$\\frac{10}{${base}}$`;
				unit20 = `$\\frac{20}{${base}}$`;
			} 
			this.renderState();
			return this;
		},
		setCousin(d){
			if(!cousin) cousin = d; //can be only set once
			return this;
		},
		changeBy(n){
			digit += n;
			this.renderState();
			acct(n/*put in the change to be reflected in the total*/);
			return this;
		}
	};
	thisUI.droppable({
		accept: `.unit${unitStr}`,
		drop: function(event, ui){
			var elem = ui.draggable;
			var count = elem.hasClass('twenner') && 20 
					|| elem.hasClass('tenner') && 10
					|| elem.hasClass('fiver') && 5
					|| elem.hasClass('onesy') && 1;
			elem.remove();
			o.changeBy(count);
			cousin.changeBy(-count);
		}
	});
	o.set(digit)//, false); //<-----------------------------------
	return o;
}
Digit.prototype.constructor = Digit;
 
//cont(ainer)= where all the digits will be; L = left, R = right
function Terms(contL, contR, options){
	//init(cont, d, base, level, unit, acct), set(int), renderState(),
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
		rightD.setCousin(leftD), leftD.setCousin(rightD);
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
				// throw exceptoin
			}
			//then load the new number
			var xBits = (new PreMath.RationalNumber(x)).breakdown();
			var maxLevel = xBits[0].level;
			var minLevel = xBits.getLast().level;
			if(minLevel == 'f'){
				var showFrac = true;
				minLevel = xBits[xBits.length - 2].level;
			}
			console.log(maxLevel, minLevel, showFrac);
			xBits.forEach(function(e, i, arr){ //element, index, current array(xBits)
				var level = e.level;
				var digit = e.digit;
				digitsMap[side][level].set(digit);
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
	
	terms.loadNum(num2, target2, 'right');
	terms.loadNum(num1, target1, 'left');
	
	//get left and right terms from #eq-input
	
	//process what left and right load and targets should be
	
	//t.loadNum() <-- fill in appropriately
});
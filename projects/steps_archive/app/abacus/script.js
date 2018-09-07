
/* global PreMath $ jQuery*/

/*
Things that needs to improve:
-needs to be able to load arbitrary number system, but most importantly, time arithmetic
	-then maybe harry potter world money
	-something like 50 apples = 10 packs = 2 boxes = 0.1 crate 

-needs to be able to reset, so the user doesn't have to refresh all the time

-needs to be able to change denominator or something

options:[
	hideDigits: as when the term is a subtractor 
	lightUp: when target is met, UI elements change in certain way
]
*/

var map = new Map();
var rightDigitsArr = [], leftDigitsArr = [], digitsMap = {right:{}, left:{}};
function Digit(container, digit, base, level, unit, acct){
	var isFrac = level == 'f';

	var unit1 = isFrac ? `$\\frac{1}{${base}}$` : unit;
	var unit5 = isFrac ? `$\\frac{5}{${base}}$` : 5 * unit;
	var unit10 = isFrac ? `$\\frac{10}{${base}}$` : 10 * unit;
	var unit20 = isFrac ? `$\\frac{20}{${base}}$` : 20 * unit;
	
	var unitStr = isFrac ? 'f' : (unit + '').split('.').join(''); //get rid of decimal point;
	var thisUI = $(`<div class="level${level} digit"></div>`);
	
	var currDivCount = 0;
	
	container.prepend(thisUI);
	var cousin, levelAbove, levelBelow;
	var o = {
		account(){
			let temp = 0;
			thisUI.children().each(function(){
				if($(this).hasClass('onesy')) temp += 1;
				else if($(this).hasClass('fiver')) temp += 5;
				else if($(this).hasClass('tenner')) temp += 10;
				else if($(this).hasClass('twenner')) temp += 20;
			});	
			digit = temp;
		},
		renderState(n){ // n: how much to change by
			if(n === true) n = base;
			else if(isNaN(n)) throw new Error(`n is NaN. ${n} given`);
			var obj = this;
			var makeDivs = function(n){
				while(n > 0){
					if(n != base){
						var count = n >= 20 && 20
							|| n >= 10 && 10
							|| n >= 5 && 5
							|| 1;
					} else {
						count = n > 20 && 20
							|| n > 10 && 10
							|| n > 5 && 5
							|| 1;
					}
					var denomination = count == 20 && 'twenner'
							|| count == 10 && 'tenner'
							|| count == 5 && 'fiver'
							|| 'onesy';
					var str = unit * count;
					var randID = getRandomID();
					var div = $(`<div class="unit unit${unitStr} ${denomination}">${str}</div>`)
							.data('count', count)
							.data('base', base)
							.data('isFrac', isFrac)
							.attr('id', randID)
							.disableSelection();
					map.set(randID, obj);
					thisUI.append(div);
					//map.set(div, obj);
					n -= count;
				}
				if(isFrac){
					obj.setDenom(base);
				}
			}
			makeDivs(n);
			if(thisUI.children().length) thisUI.children().draggable({
				'revert': true
			});
			o.show();
			if(isFrac) PreMath.renderMathJax();
			this.account();
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
			thisUI.css('display','none');
			if(!fromCousin && cousin) cousin.hide(true);
			return this;
		},
		show(fromCousin){
			thisUI.css('display','block');
			if(!fromCousin && cousin) cousin.show(true);
			return this;
		},
		changeDivCount(d){
			currDivCount += d;	
		},
		setDenom(d){
			if(isFrac){
				base = d ? d : base;
				unit1 = `$\\frac{1}{${base}}$`;
				unit5 = `$\\frac{5}{${base}}$`;
				unit10 = `$\\frac{10}{${base}}$`;
				unit20 = `$\\frac{20}{${base}}$`;
			}
			thisUI.children().each(function(key){
				if($(this).hasClass('onesy')) $(this).html(unit1);
				else if($(this).hasClass('fiver')) $(this).html(unit5);
				else if($(this).hasClass('tenner')) $(this).html(unit10);
				else if($(this).hasClass('twenner')) $(this).html(unit20);
				$(this).data('base', base);
			});
			PreMath.renderMathJax();
			return this;
		},
		getUnitStr(n){
			if(n == 1) return unit1;
			if(n == 5) return unit5;
			if(n == 10) return unit10;
			if(n == 20) return unit20;
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
		},
		getRelation(relation){
			if(relation == 'cousin') return cousin;
			if(relation == 'above') return levelAbove;
			if(relation == 'below') return levelBelow;
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
				o.account()
				elem.remove();
				cousin.account();
			}
		}
	});
	o.set(digit);
	//thisUI.children().draggable();
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
	var leftAcct = function(n, level){
		leftCurr.plus(n);
		if(leftCurr.isEqualTo(leftTarget)){
			console.log('yay');
		}
	};
	var rightAcct = function(n){ 
		rightCurr.plus(n);
		if(rightCurr.isEqualTo(rightTarget)){
			console.log('yay');
		}
	};
	
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
		leftD.hide(), rightD.hide();
	}
	
	var o = {
		//x: number to be loaded, side: left or right
		//x and target are both RationalNumber objects
		loadNum(x, target, side, isFrac){ 
			if(side == 'left'){
				leftTarget = target, leftCurr = x;
			} else if(side == 'right'){
				rightTarget = target, rightCurr = x;
			} else {
				throw new Error(`Pass either 'right' or 'left'. ${side} given.`)
			}
			//then load the new number
			var xBits = (new PreMath.RationalNumber(x)).breakdown(isFrac);
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
	
	var selectedClass, base, totalCount = 0	, divCount, digitObj;
	$('body').on('click','.unit', function(){
		var currClass = $(this).attr('class').split(' ')[1];
		var count = $(this).hasClass('onesy') && 1 
					|| $(this).hasClass('fiver') && 5
					|| $(this).hasClass('tenner') && 10 
					|| $(this).hasClass('twenner') && 20;
		
		if($(this).hasClass('selected')){
			$(this).removeClass('selected').draggable('option','disabled', false);
			totalCount -= count;
			if(divCount == 0) base = 0;
		} else if(selectedClass === undefined || selectedClass == currClass) {
			$(this).addClass('selected').draggable('option','disabled', true);;
			selectedClass = currClass;
			base = $(this).data('base');
			totalCount += count;
	
			var thisID = $(this).attr('id');
			digitObj = map.get(thisID);
		} else {
			$('.selected').removeClass('selected').draggable('option','disabled', false);
		}
		divCount = $('.selected').length;
		if(divCount == 0){
			totalCount = 0;
			selectedClass = base = digitObj = undefined;
		}

		if(divCount == 1 && (totalCount == 1 || totalCount == 5 || totalCount == 10 || totalCount == 20)){
			$('#split').removeClass('disabled');
			$('#combine').addClass('disabled');
		} else if(totalCount == base || totalCount == 5 || totalCount == 10 || totalCount == 20) {
			//enable combine
			//disable split
			$('#combine').removeClass('disabled');
			$('#split').addClass('disabled');
		} else {
			//disable both;
			$('#split').addClass('disabled');
			$('#combine').addClass('disabled');
		}
	});
	$('#split').click(function(){
		if(divCount == 1){
			console.log(divCount, totalCount);
			$('.selected').draggable('option','disabled', false);
			let parent = $('.selected').parent();
			let id = $('.selected').attr('id');
			let digitObj = map.get(id);
			if(totalCount == 1){
				digitObj.getRelation('below').renderState(true);
			} else if(totalCount == 5){
				for(let i = 0; i < 5; i++){
					digitObj.renderState(1);
				}
				parent.children().draggable({'revert': true});
			} else if(totalCount == 10){
				for(let i = 0; i < 2; i++){
					digitObj.renderState(5);
				}
			} else if(totalCount == 20){
				for(let i = 0; i < 2; i++){
					digitObj.renderState(10);
				}
			}
			//digitObj.setDenom();
			digitObj.account();
			$('.selected').remove();
			
			$(this).addClass('disabled');
			divCount = totalCount = 0;
			selectedClass = base = digitObj = undefined;
		}
	});
	$('#combine').click(function(){
		if(totalCount == base){
			let id = $('.selected').attr('id');
			let digitObj = map.get(id);
			digitObj.getRelation('above').renderState(1);
			digitObj.account();
		} else if(totalCount == 5 || totalCount == 10 || totalCount == 20){
			let id = $('.selected').attr('id');
			let digitObj = map.get(id);
			digitObj.renderState(totalCount);
			digitObj.account();
		}
		$('.selected').remove();
		$(this).addClass('disabled');
		divCount = totalCount = 0;
		selectedClass = base = digitObj = undefined;
	});
	
	$('#eq-input').keydown(function(e){
		let key = e.which;
		let allowed = [48,49,50,51,52,53,54,55,56,57, //qwerty num
			96,97,98,99,100,101,102,103,104,105,	  //numpad nums
			13/*enter*/,16,187,189,191/* shift,-,+/=, (/) */, 
			32/*space*/,107,109,111, /*numpad +,-,(/) */
			110,190, //decimal point and period
			8, 27, 46 //backspace, esc, del
		];
		if(allowed.indexOf(key) == -1){
			e.preventDefault();
		} else {
			if(key == 13){
				e.preventDefault();
				let input = $(this).text().trim();
				$('#reset-btn').show();
				let isFrac = input.has('/');
				
				let isPlus = input.has('+');
				input = input.split(isPlus ? '+' : '-');
				let t1 = new PreMath.RationalNumber(input[0], 0, false);
				let t2 = new PreMath.RationalNumber(input[1], 0,false);
				let t3 = isPlus ? t1.plus(t2,'0', true) : t1.minus(t2, '0', true);
				let t4 = new PreMath.RationalNumber(0);
				let t1Str = t1.toString(isFrac ? ['toMathJax', 'mixed'] : ['getDec']);
				let t2Str = t2.toString(isFrac ? ['toMathJax', 'mixed'] : ['getDec']);
				let opSign = isPlus ? ' + ' : ' - ';
				let wrappers = isFrac ? '$' : '';
				$(`<div class="eq-part">${wrappers}${t1Str}${opSign}${t2Str}${wrappers}</div>`).prependTo('#equation-wrapper');
				if(isFrac) PreMath.renderMathJax();
				
				
				terms.loadNum(t1,t3, 'left', isFrac);
				isPlus ? terms.loadNum(t2,t4, 'right', isFrac) : terms.loadNum(t4,t2, 'right', isFrac);
				$(this).text('')
				
				if(isFrac){
					let level0L = digitsMap['left'][0];
					let level0R = digitsMap['right'][0];
					let levelFL = digitsMap['left']['f'];
					let levelFR = digitsMap['right']['f'];
					level0L.setRelation(levelFL, 'below');
					level0R.setRelation(levelFR, 'below');
					levelFL.setRelation(level0L, 'above');
					levelFR.setRelation(level0R, 'above');
					if(!isPlus){
						var temp = $(this).text().split('/').getLast() * 1;
						levelFL.setDenom(temp);
						levelFR.setDenom(temp);
					}
				}
				
			}
		}
	}).keyup(function(e){
		//if(e.which == 13) e.preventDefault();
	}).focus(function(){
		let t = $(this).text();
		if(t == 'Equation') $(this).text('');
	}).blur(function(){
		let t = $(this).text();
		if(t == '') $(this).text('Equation');
	});
	$('#reset-btn').click(function(){
		window.location.reload(true);	
	});
});


function getRandomID(length = 15){
	var s = '';
	var selection = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e',
			 'f','g','h','i','j','k','l','m','n','o','p','q',
			 'r','s','t','u','v','w','x','y','z','A','B','C',
			 'D','E','F','G','H','I','J','K','L','M','N','O',
			 'P','Q','R','S','T','U','V','W','X','Y','Z'
	];
	var range = selection.length;
	while(s.length < length){
		var r = Math.floor(Math.random() * range);
		if(!(s.length == 0 && r < 10)) s += selection[r];
	}
	return s;
}
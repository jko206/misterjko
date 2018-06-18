'use strict';
/*
	requires util.js
	
	Reason for this library:
	-let k = 123456789012345678901234567890;
	 k == parseInt(k) --> false
	-0.1 + 0.2 == 0.3 --> false
	-1/3 == 0.3333333333333333 --> true
	-lack of support for fractions
	-lack of native support for big numbers or small numbers
	-The native implementation is for speed, but for most of what I did, 
	I needed precision more than speed. In fact, speed wasn't even an issue.
	

	GLOSSARY AND ACRONYMS
	dec 		: Decimal number, or decimal point, depending on the context
	splum		: Short for simple number; numbers that need not be represented
					in string format. Opposite of strum
	strum		: Short for string number; numbers that must be represented
					as string in order to retain its precision.
					e.g. 3.1234567890123456789012345678901234567890
	arnum		: Short for array number;
	Denotes		: a dash (-) followed by a letter indicating what type
					of number strum or splum is:
					-d: decimal				-n: natural
					-w: whole				-i: integer
					-Z:	non-zero integer	-p: prime
					
	Decimal debt: When a decimal number gets converted to an int via 
					moving the decimal places (i.e. multiply by a power of 10), 
					the number of places it must move back in order for the int
					to become the original decimal number.
					e.g. 3.14 -> 314, then decimal debt is -2, because
					314 * 10^-2 == 3.14
					
	Scinot		: Scientific notation (e.g. 1e-14)
	numer		: Numerator
	Denom		: Denominator
	
	TODO: 
	-Be able to find BIG prime values more efficiently 
	-Implement different bases
	-Implement composite bases
		-time: 24h60m60s etc)
		-Traditional measurements, like 1yd = 3ft = 36in etc.
*/

const PreMath = (function(){
	// API
	
	// Evaluate an expression
	function evaluate(expression){
		
	}
	
	// Prime Numbers / factors
	function isPrime(n){}
	function primeFactorsOf(n, getUnique){}
	function factorsOf(n){}
	function gcd(...nums){}
	function gcf(...nums){}
	function lcm(...nums){}
	
	//combinatorics
	function factorial(n, quick){
		function quickFactorial(n){
			return n >= 0 ? 1 : n * quickFactorial(n - 1);
		}
		if(quick){
			if(n < 0) return;
			return quickFactorial(n);
		} else {
			
		}
	}
	function combination(n, r){}
	function permutation(n, r){}
	
	
	// Numbers stuff
	function getSignificand(n, getDecLevel){}
	
	
	//
	
	// Help
	function help(topic){}
	
	return {
		eval: evaluate,
		isPrime,
		help,
	};
}());

const PreNum = function(n, base, precision){
	function getPreNum(n){
		if(n instanceof PreNum) return n;
		else return new PreNum(n);
	}
	this.base = base || 10;
	this.numer = [];
	this.denom = [];
	this.level = 0;
	this.positivity = 0;
	
	//process n
	(_=>{
		// both are arnum
		this.numer; 
		this.denom;
		
		
	})();
	
	this.isEqualTo = function(n){
		Arnum.compress(this.denom);
		Arnum.compress(this.numer);
		
		n = getPreNum(n);
		
		const pos1 = this.positivity;
		const pos2 = n.positivity;
		if(pos1 !== pos2) return false;
		
		let numerAreEqual = this.numer.join('') === n.numer.join();
		let denomAreEqual = this.denom.join('') === n.denom.join();
		let levelsAreEqual = this.level === n.level
		return numerAreEqual && denomAreEqual && levelsAreEqual;
	}
	this.isGT = function(n){
		n = getPreNum(n);
		const pos1 = this.positivity;
		const pos2 = n.__getPositivity__;
		const temp = true
		
		if(pos1 > pos2) return true;
		else if(pos1 < pos2) return false;
		else if(pos1 === 0 && pos2 === 0) return false;
		else if(pos1 === -1 && pos2 === -1) temp = false;
		let n1 = [...this.numer];
		let n2 = [...n.numer];
		let d1 = [...this.denom];
		let d2 = [...n.denom];
		
		let p1 = Arnum.multiply(n1, d2);
		let p2 = Arnum.multiply(n2, d1);
		let result;
		// do stuff to compare p1 and p2
		// if p1 > p2, result = true;
		// if p1 < p2, result = false;
		// return result === temp;
		// if p1 == p2, then result must be undefined. then return false;
		
	}
	this.isGTE = function(n){
		return this.isGT(n) || this.isEqualTo(n);
	}
	this.isLT = function(n){
		return !this.isGTE(n);
	}
	this.isLTE = function(n){
		return !this.isGT(n);
	}
	
	this.isInt = function(){
		return this.denom.length === 1 && this.denom[0] === 1 && this.level >= 0;
	}
	this.isDec = function(){
		return !this.isInt();
	}
	//this.isRational = function(){}
	//this.isIrrational = function(){return !this.isRational()}
	//this.isPrime = function(){}
	
	this.changeBase = function(b){
		this.base = b;
	}
	this.valueOf = function(){
		if(this.positivity === 0) return 0;
		let str = this.toString();
		return parseFloat(str);
	}
	this.toString = function(){
		if(this.positivity === 0) return "0";
		let dividend = {
			digits: this.numer,
			level: this.level,
			positivity: this.positivity,
		};
		let divisor = {
			digits: this.denom,
			level: 0,
			positivity: 1,
		}
		let quotient = Arnum.divide(dividend, divisor);
		quotient = quotient.join('');
		// put on dec points or zeros
		if(this.level > 0){
			quotient = [...quotient].reverse().join('');
			let zeros = this.level;
			while(zeros--){
				quotient += '0';
			}
		} else if(this.level < 0){
			let decPoint = -this.level;
			quotient = quotient.substr(0, decPoint) 
				+ '.' 
				+ quotient.substr(decPoint);
		}
		
		// put on negative (-) sign, if necessary
		if(this.positivity === -1) return '-' + quotient;
		else return quotient;
	}
};

/* 
All numbers that are passed here have the form:
	{
		digits: [], // the significands
		level: n,	// level: 0.001, 0.01, 0.1, 1, 10, 100, etc.
		positivity: <1 | 0 | -1> //1 for +, 0, and -1 for -.
		
	}
*/

const Arnum = (function(){
	
	//These methods deal strictly with the digits.
	
	// if a > b return 1
	// if a === b return 0
	// if a < b, return -1
	function compare(a, b){
		let aLen = a.length;
		let bLen = b.length;
		if(aLen !== bLen){
			return aLen - bLen > 0 ? 1 : -1;
		} else {
			let A = [...a].reverse();
			let B = [...b].reverse();
			let result = 0;
			for(let i in A){
				let d_A = A[i];
				let d_B = B[i];
				if(d_A > d_B) result = 1;
				else if(d_A < d_B) result = -1;
			}
			return result;
		}
	}
	function matchLevel(a, b){
		let aLevel = a.level;
		let bLevel = b.level;
		if(aLevel === bLevel) return;
		let max = aLevel > bLevel ? a : b;
		let min = aLevel > bLevel ? b : a;
		let levelDiff = max.level - min.level;
		while(levelDiff--) max.digits.unshift(0);
		max.level = min.level;
		
		
		
		
		
		
		/*///////////
		let aDigits = a.digits;
		let bDigits = b.digits;
		let levelDifference = Math.abs(aLevel - bLevel);
		let max = aLevel > bLevel ? aDigits : bDigits;
		while(levelDifference--){
			aDigits.unshift(0);
		}
		//*/
	}
	function compress(arnum, digitLimit = 10){
		for(let i = 0; i < arnum.length; i++){
			let digit = arnum[i];
			if(digit >= digitLimit){
				arnum[i] = digit % digitLimit;
				let passUp = Math.floor(digit/digitLimit);
				let nextDigit = arnum[i+1] || 0;
				nextDigit += passUp;
				arnum[i+1] = nextDigit;
			}
		}
		return arnum;
	}
	function decompress(arnum){}
	function adder(A, B, options = {}){
		let {compPoint, compTo, compress} = options
		const COMPRESSION_POINT = compPoint || Math.floor(Number.MAX_SAFE_INTEGER / 10);
		let isOverCP;
		let longerNum = A.length > B.length ? A : B
		for(let i = 0; i < longerNum.length; i++){
			let a = A[i] || 0;
			let b = B[i] || 0;
			let sum = a + b;
			if(sum > COMPRESSION_POINT) isOverCP = true;
			A[i] = sum;
		}
		if(isOverCP || compress) compress(A, compTo);
		return A;
	}
	/* PRE: 
		A.length >= B.length, 
	    value of A >= value of B,
		each digit d is compressed (i.e. 0 <= d < 10)
	*/		
	function subtractor(A, B){
		function peek(arr){
			return arr[arr.length - 1];
		}
		let len = A.length;
		for(let i = 0; i < len; i++){
			let a = A[i];
			let b = B[i] || 0;
			let diff = a - b;
			if(diff < 0){
				 diff += 10;
				 A[i+1]--;
			}
			A[i] = diff;
		}
		while(peek(A) === 0) A.pop();
		if(Number.isNaN(peek(A)) || isNaN(peek(A))) throw new Error('Possilby |A| < |B|.');
		return A;
	}
	function groundZero(arnum){
		while(arnum.digits[0] === 0){
			arnum.level++;
			arnum.digits.shift();
		}
	}
	//API
	// PRE: no 0 in the addends
	function add(...addends){
		for(let i = 0; i < addends.length; i++){
			let a = addends[i];
			if(a.positivity === 0){
				addends.splice(i, 1);
				i--;
			}
		}
		while(addends.length > 1){
			let a, b, newDigits, newPos;
			
			//make sure neither number is 0
			do{
				a = addends.shift();
			} while(a.positivity === 0);
			do{
				b = addends.shift();
			} while(b.positivity === 0);
			matchLevel(a,b);
			let level = a.level;
			let aPos = a.positivity;
			let bPos = b.positivity;
			if(aPos === bPos){
				// a > 0 && b > 0 or a < 0 && b < 0
				newDigits = adder(a.digits, b.digits);
				newPos = aPos;
			} else {
				// a > 0 && b < 0 or a < 0 && b > 0
				let comparison = compare(a.digits, b.digits);
				if(comparison === 1){
					newDigits = subtractor(a.digits, b.digits);
					newPos = aPos;
				} else if(comparison === -1){
					newDigits = subtractor(b.digits, a.digits);
					newPos = bPos;
				} else {
					// a + b = a + -a = 0
					continue;
				}
				
			} 
			addends.push({
				digits: newDigits,
				positivity: newPos,
				level,
			});
		}
		let sum = addends.pop();
		compress(sum.digits);
		groundZero(sum);
		return sum;
	}
	
	// Minuend - subtrahend = difference
	// From minuend, all the subtrahends will be subtracted
	/*
min	    sub	    diff	
-10	    7   	-17
10	    -7  	17
-7	    10	    -17
7	    -10	    17

10  	7	    3       comp === 1      aPos === 1  --> 1  
-10	    -7  	-3      comp === 1      aPos === -1 --> -1
7	    10	    -3      comp === -1     aPos === 1  --> -1
-7	    -10	    3       comp === -1     aPos === -1 --> 1
	*/
	function subtract(minuend, ...subtrahends){
		let subtrahend = add(...subtrahends);
		
		let a = subtrahend;
		let b = minuend;
		let newDigits, newPos;
		matchLevel(a, b);
		
		let level = a.level; // They both have the same level
		let comparison = compare(a.digits, b.digits);
		let aPos = a.positivity;
		let bPos = b.positivity;
		if(aPos === 0){
			newDigits = b.digits;
			newPos = bPos * -1;
		} else if (bPos === 0){
			newDigits = a.digits;
			newPos = aPos;
		} else if (aPos === bPos){
			if(comparison === 0){
				newPos = 0;
				level = 0;
				newDigits = [];
			} else {
				newPos = comparison * aPos;
				if(comparison === 1){
					newDigits = subtractor(a.digits, b.digits);
				} else {
					newDigits = subtractor(b.digits, a.digits);
				}
			}
		} else {
			newPos = aPos;
			newDigits = adder(a.digits, b.digits);
		}
		let diff = {
			digits: newDigits,
			level,
			positivity: newPos,
		};
		groundZero(diff);
		return diff;
	}
	
	//////////////
	function multiply(...nums){}
	function divide(d, ...divs){}
	
	return {
		compare,
		matchLevel,
		compress, 
		decompress,
		adder,
		subtractor,
		divide, 
		multiply, 
		subtract, 
		add, 
	};
}());

const tester = {
	isZero(n){
		//match all digits
		//match all zeros
		//if they have the same length, then it's zero
	},
}


// I can use this in the terminal with: 
// node path/to/file/someJS.js methodName, 'arg1, arg2, ...'
// if arg starts with #, its parsed as float.
(function(){
	try{
			
		let [a1, a2, method, args] = process.argv;
		if(method){
			args = args.split(' ');
			args.forEach(function(e,i,arr){
				const startsWithHash = e[0] === '#'; 
				if(startsWithHash){
					e = e.substr(1);
					e = parseFloat(e);
					arr[i] = e;
				}
			});
			let result = PreMath[method](...args);
			console.log(result);
		}
	} catch(e){
		// nothing
	}
}())

function testNums(config = {}){
	function randomLevel(){
		let min = config.randomLevelMin !== undefined 
			? config.randomLevelMin : DEFAULT.randomLevelRangeMin;
		let max = config.randomLevelMax !== undefined 
			? config.randomLevelMax : DEFAULT.randomLevelRangeMax;
		let range = max - min + 1;
		let random = Math.floor(Math.random() * range);
		random += min;
		return random;
	}
	function randomDigits(maxLength, maxDigit){
		let digits = [];
		while(maxLength--){
			let r = Math.floor(Math.random() * maxDigit);
			digits.push(r);
		}
		return digits;
	}
	// digits, maxPerDigit, neg/pos/zero, levels, length
	// let {numOfDigits, digitMax, positivity, level, randomLevel} = config;
	let DEFAULT = {
		numOfDigits : 4,
		level: 0,
		positivity: 1,
		digitMax: 10,
		randomLevelRangeMin: -3,
		randomLevelRangeMax: 3,
	}
	let numOfDigits = config.numOfDigits || DEFAULT.numOfDigits;
	let maxDigit = config.digitMax || DEFAULT.digitMax;
	let level = config.randomLevel ? randomLevel() 
		: config.level !== undefined ? config.level 
		: DEFAULT.level;
	let positivity = config.positivity 
		|| (Math.floor(Math.random() * 2) == 1 ? 1 : -1);
	let digits = randomDigits(numOfDigits, maxDigit);
	return {
		level,
		digits, 
		positivity,
	}
	
}

function conductTest(config1, config2, op){
	let n1 = testNums(config1);
	let n2 = testNums(config2);
	console.log('n1: ' + JSON.stringify(n1));
	console.log('n2: ' + JSON.stringify(n2));
	
	Arnum[op](n1, n2);
	console.log('n1: ' + JSON.stringify(n1));
}
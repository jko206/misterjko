'use strict';


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
	function factorial(n, quick = true){
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
		positivity: <1 | 0 | -1> //1 for +, 0, and -1 for 
	}
*/

const Arnum = (function(){
	function isZero(n){
		//match all digits
		//match all zeros
		//if they have the same length, then it's zero
		n += '';
		let digitsMatch = n.match(/\d/g) || 0;
		let zerosMatch = n.match(/0/g) || 0;
		return digitsMatch.length === zerosMatch.length;
	}
	
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
	function compressor(arnum, digitLimit = 10){
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
	function decompressor(arnum){}
	function adder(A, B, options = {}){
		let {compPoint, compTo, compress} = options
		const COMPRESSION_POINT = compPoint || Math.floor(Number.MAX_SAFE_INTEGER / 10);
		let isOverCP;
		let runLength = Math.max(A.length, B.length);
		for(let i = 0; i < runLength; i++){
			let a = A[i] || 0;
			let b = B[i] || 0;
			let sum = a + b;
			if(sum > COMPRESSION_POINT) isOverCP = true;
			A[i] = sum;
		}
		if(isOverCP || compress) compressor(A, compTo);
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
		// filter out all the zeros
		for(let i = 0; i < addends.length; i++){
			let a = addends[i];
			if(a.positivity === 0){
				addends.splice(i, 1);
				i--;
			}
		}
		addends = addends.filter(e=> e.positivity !== 0);
		if(addends.length === 0){
			return {
				level: 0,
				digits: [],
				positivity: 0,
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
					// a + b = a + -a = 0, so don't queue
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
		compressor(sum.digits);
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
	
	function getArnum(n){
		n = (n + '').split('');
		let level = 0;
		let positivity = 0;
		if(isZero(n)){
			return {
				level,
				positivity,
				digits: [],
			}
		}
		if(n[0] === '-'){
			n.shift();
			positivity = -1;
		} else {
			positivity = 1
		}
		n.reverse();
		if(n.includes('.')){
			let i = n.indexOf('.');
			level = -i;
			n.splice(i, 1);
		}
		while(n[0] === '0'){
			n.shift();
			level++;
		}
		while(n[n.length - 1] === '0'){
			n.pop();
		}
		n = n.map(e=>{
			return e >> 0;
		});
		return {
			level,
			positivity,
			digits: n,
		}
	}
	
	
	return {
		compare,
		matchLevel,
		compressor, 
		decompressor,
		adder,
		subtractor,
		divide, 
		multiply, 
		subtract, 
		add, 
		getArnum,
	};
}());


// I can use this in the terminal with: 
// node path/to/file/someJS.js methodName, 'arg1, arg2, ...'
// if arg starts with #, its parsed as float.
/*(function(){
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
}())*/

function ArnumToString(arnum){
	let {digits, level, positivity} = arnum;
	digits = [...digits];
	if(positivity === 0){
		return 0;
    }
	if(level < 0){
		let dp = -level;
		digits.splice(dp, 0, '.');
    }
	while(level > 0){
		digits.unshift(0);
    }
	digits = digits.reverse().join('');
	const sign = positivity === -1 ? '-' : '';
	return sign + digits;
}

let handBrake = function(breakAt = 1000){
    let count = 0;
    return function(){
        count++;
        return count < breakAt;
    };
};

// let temp;

const Precision = (function(){
	const ArrayOps = {
		wholeToArnum(n){
			return n.split('').reverse().map(e=>e>>0);
		},
		decToArnum(n){
			//return with level	
			n = n.split('').reverse();
			let decLength = n.indexOf('.');
			n.splice(decLength, 1);
			n = n.map(e=>e>>0);
			while(n[n.length - 1] === 0) n.pop();
			let denom = [1];
			let brake = handBrake(20);
			let loopCount = decLength;
			while(loopCount-- && brake()){
				denom.unshift(0);
			}
			return {numer: n, denom, decLength};
		},
		repDecToArnum(n, precedingDigits = 0){
			let numer = this.wholeToArnum(n);
			let denom = [];
			let ninesCount = numer.length;
			let brake = handBrake(20);
			while(ninesCount-- && brake()){
				denom.unshift(9);
			}
			brake = handBrake(200);
			while(precedingDigits-- && brake()){
				denom.unshift(0);
			}
			return {numer, denom};
		},
		
		add(...nums){
		    nums = nums.filter(e=>{
		       e = e.join('');
		       return !is.zero(e);
		    });
	        if(nums.length === 0) return [0];
	        
			function compressor(arnum){
				compress = false;
				for(let i = 0; i < arnum.length; i++){
					let curr = arnum[i] || 0;
					if(curr >= 10){
						let next = arnum[i+1] || 0;
						next += drop(curr/10);
						curr %= 10;
						arnum[i] = curr;
						arnum[i+1] = next;
					}
					
				}
			}
			let compress = false;
			let drop = Math.floor;
			let COMP_POINT = drop(Number.MAX_SAFE_INTEGER / 100);
	        let sum = nums.shift();
		    while(nums.length > 0){
		        let N = nums.shift();
		        N.forEach((e,i)=>{
		        	let s = sum[i] || 0;
		        	let temp = s + e;
		        	if(temp > COMP_POINT) compress = true;
		        	sum[i] = temp;
		        });
		        if(compress) compressor(sum);
		    }
		    compressor(sum);
		    return sum;
		},
		subtract(minuend, ...subtrahends){
			let sub = this.add(...subtrahends);
			minuend.forEach((e,i,arr)=>{
				let s = sub[i] || 0;
				let diff = e - s;
				if(diff < 0){
					diff += 10;
					arr[i+1]--;
				}
				arr[i] = diff;
			});
			let lastDigit = minuend[minuend.length - 1];
			if(lastDigit < 0 || isNaN(lastDigit)) throw new Error('Minuend < subtrahend(s)');
			while(lastDigit === 0){
				minuend.pop();
				lastDigit = minuend[minuend.length - 1];
			}
			return minuend;
		},
		multiply(...nums){
			while(nums.length > 1){
				let A = nums.shift();
				let B = nums.shift();
				let aNum = A.join('');
				let bNum = B.join('');
				if(is.zero(aNum) || is.zero(bNum)) return [0];
				let toSum = [];
				let multiplesOfB = [];
				for(let i = 0; i < A.length; i++){
					let a = A[i];
					let prod = [];
					for(let j = 0; j < i; j++) prod.push(0);
					
					let multB = multiplesOfB[a];
					if(multB) prod.push(...multB);
					else {
						let temp = [];
						for(let j = 0; j < B.length; j++){
							let b = B[j];
							temp.push(a * b);
						}
						multiplesOfB[a] = [...temp];
						prod.push(...temp);
					}
					toSum.push(prod);
				}
				toSum = this.add(...toSum);
				nums.push(toSum);
			}
			return nums.pop();
		},
		divide(precision = 100, dividend, ...divisors){
			let divisor = this.multiply(...divisors);
			dividend.reverse();
			divisor.reverse();
			
			// do stuff here
		}
	};
	
	// temp = ArrayOps;
	
	const is = {
		int(n){},
		Arnum(n){},
		Number(n){},
		
		// test strings
		mixedFrac(n){
			return /^\d+\s\d+\s?\/\s?\d+$/.test(n);
		},
		frac(n){
			return /^\d+\s?\/\s?\d+$/.test(n);
		},
		repeatingDecimal(n){
			return /^\d+\.\d+\.{3}\d+$/.test(n);
		},
		decimal(n){
			return /^\d*\.\d+$/.test(n);
		},
		wholeNum(n){
			return /^\d+$/.test(n);
		},
		zero(n){
			if(n === '') return true;
			let digits = n.match(/\d/g);
			let zeros = n.match(/0/g);
			return zeros && digits.length === zeros.length;
		},
		negative(n){
			return n[0] === '-';
		},
	};
	//////////////
	let _P = {};
	// Math
	_P.evalulate = function(){};
	_P.primeFactors = function(){};
	_P.factors = function(){};
	_P.gcd = function(){};
	_P.gcf = function(){};
	_P.lcm = function(){};
	
	_P.factorial = function(n, quick){
		function quickFactorial(n){
			return n <= 1 ? 1 : n * quickFactorial(n - 1);
		}
		let temp = quickFactorial(n);
		if(quick || Number.isSafeInteger(temp)) return temp;
	};
	_P.combination = function(n){};
	_P.permutation = function(n){};
	
	//////////////
	const _Number = function(n, base){
		/*
			Acronyms: 
				W = Whole
				N = Numerator
				D = Denominator
			Valid formats (W: integer, N: Whole, D: Natural): 
			- W N / D, 
			- N / D
			- W
			- Decimal
			- Repeating Decimal
		*/
		function processInput(n){
			
			let parts;
			let numer, denom, positivity;
			if(is.negative(n)){
				positivity = -1;
				n = n.substr(1);
			} else {
				positivity = 1;
			}
			
			if(is.zero(n)){
				numer = [0], denom = [1], positivity = 0;
			} else if(is.mixedFrac(n)){
				parts = n.match(/\d+/g).map(function(e){
					return ArrayOps.wholeToArnum(n);
				});
				let w = parts[0], 
					n = parts[1],
					d = parts[2];
				let n1 = ArrayOps.multiply(w, d);
				numer = ArrayOps.add(n1, n);
				denom = d;
			} else if(is.frac(n)){
				parts = n.match(/d+/g).map(function(e){
					return ArrayOps.wholeToArnum(e);	
				});
				numer = parts[0];
				denom = parts[1];
			} else if(is.repeatingDecimal(n)){
				let temp = n.split('...');
				let dec = ArrayOps.decToArnum(temp[0]);
				
				let decLength = dec.decLength;
				let repDec = ArrayOps.repDecToArnum(temp[1], decLength);
				
				let n1 = dec.numer;
				let d1 = dec.denom;
				let n2 = repDec.numer;
				let d2 = repDec.denom;
				n1 = ArrayOps.multiply(n1, d2);
				n2 = ArrayOps.multiply(n2, d1);
				numer = ArrayOps.add(n1, n2);
				denom = ArrayOps.multiply(d1, d2);
			} else if(is.decimal(n)){
				n = ArrayOps.decToArnum(n);
				numer = n.numer;
				denom = n.denom;
			} else if(is.wholeNum(n)){
				numer = ArrayOps.wholeToArnum(n);
				denom = [1];
			} else {
				throw new Error(`${n} is not a valid form of input.`);
			}
			return {numer, denom, positivity};
		}
		
		const isInstance = this instanceof _Number;
		if(!isInstance) throw new Error('Number must be called with `new` keyword.');
		this.base = base || 10;
		n += '';
		n.trim();
		let {numer, denom, positivity} = processInput(n);
		this.numer = numer;
		this.denom = denom;
		this.positivity = positivity;
	};
	_P.Number = _Number;
	_Number.prototype.toString = function(format){
		return this.n + ', ' + this.base;
	};
	_Number.prototype.valueOf = function(){};
	
	/*
		format:
			- 0 -> reduce fraction (default)
			- 1 -> mixed fraction
			- 2 -> decimal fraction (denom is power of 10);
		returns:
			{numer, denom, positivity}
	*/
	_Number.prototype.getFrac = function(format){};
	
	
	
	_Number.prototype.isEqual = function(n){};
	_Number.prototype.isGT = function(n){};
	_Number.prototype.isGTE = function(n){};
	_Number.prototype.isLT = function(n){};
	_Number.prototype.isLTE = function(n){};
	
	_Number.prototype.isInt = function(){};
	_Number.prototype.isDec = function(){};
	
	//Later...
	_Number.prototype.changeBase = function(b){}
	
	//////////////
	
	return _P;
}());
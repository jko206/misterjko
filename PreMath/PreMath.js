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

const PreMath = (function(options){
	// States, constants, options, maps, etc.
	const COMP_POINT = 10000000;
	let getID = (function(){
		let id = 0;
		return function(){
			return id++;
		};
	}());
	let primes = [], initPrimeLimit = options && options.initPrime || 200000,
		currMaxPrime;
	let numAlphaMap = [
		0,		1,		2,		3,		4,		
		5,		6,		7,		8,		9,
		'A',	'B',	'C',	'D',	'E',
		'F',	'G',	'H',	'I',	'J',
		'K',	'L',	'M',	'N',	'O',
		'P',	'Q',	'R',	'S',	'T',
		'U',	'V',	'W',	'X',	'Y',
		'Z'
	];
	
	makePrimes(initPrimeLimit);
	/**********************************************************************
	 *						PRIME NUMBER  OPERATIONS
	**********************************************************************/
	function makePrimes(limit){
		if(!Number.isSafeInteger(limit)){
			throw new Error(`${limit} is too big to find primes for.`);
		}
		primes = [];
		let numLine = []; // composites are marked as `false`
		for(let i = 2; i <= limit; i++){
			if(numLine[i] === undefined){
				primes.push(i);
				for(let j = 2; j <= limit/i; j++) numLine[i*j] = false;
			}
		}
	}
	
	/**********************************************************************
	 *						ARRAY ARITHMETIC OPERATIONS
	**********************************************************************/
	// arr: 123 -> [3,2,1];
	// Don't compress it for Pascal's triangle
	function multiplyArray(f1, f2, addRows){
		/*
			This version memorizes previous multiples so it doesn't have to 
			go through the array again.
			For example, when doing 19832 * 2100021, it will remember
			19832 * 2 so it doesn't do it twice. For x1, it will simply copy
		*/
		let multiples = [[], [...f1]]; // f1 * 0 and f1 * 1;
		let prod = [];
		for(let i = 0; i < f2.length; i++){
			let multiplier = f2[i];
			if(multiplier == 0) continue;
			let multiple;
			if(multiples[multiplier]){
				multiple = [...multiples[multiplier]];
	        } else {
				multiple = [];
				for(let j = 0; j < f1.length; j++){
					multiple[j] = f1[j] * f2[i];
	            }
	            multiples[multiplier] = [...multiple];
				
	        }
	        let k = i;
	        while(k--) multiple.unshift(0);
			prod.push(multiple);
	    }
	    return addRows ? addArrays(...prod) : prod;
	}
	
	//Assume no nested array for now
	function addArrays(...addends){
		// let last = addends.peek();
		// let options = last instanceof 'object' 
		// 	&& !Array.isArray(last)
		// 	&& addends.pop();
		let sum = [];
		while(addends.length){
			let row = addends.shift();
			for(let j = 0; j < row.length; j++){
				let d = row[j];
				let curr = sum[j] || 0;
				sum[j] = d + curr;
			}
		}
		// return sum;
		return compressor(sum);
		// return options.compress ? compressor(sum, options) : sum;
	}
	
	/*
	when not compressed for too long, each digit will start to become scinot.
	Each digit is base 1000; if a digit becomes bigger than 1000, it will 
	turn into array
	compress: 0 -> don't compress
				 1 -> compress within digit
				 2 -> compress over to next digit
	compPt	: point at which to compress over to next digit or cell
	*/
	function compressor(arr, options){
		for(let i = 0; i < arr.length; i++){
			/*let d = arr[i];
			let unit = d%10;
			let gtUnit = Math.floor(d/10); // greater than unit
			let curr0 = result[i] || 0;
			result[i] = curr0 + unit;
			let curr1 = result[i+1] || 0;
			result[i+1] = curr1 + gtUnit;*/
			let digit = arr[i];
			let unit = digit%10;
			let tens = Math.floor(digit/10);
			arr[i] = unit;
			if(tens){
				let temp = arr[i+1] || 0;
				arr[i+1] = temp + tens;
			}
		}
		return arr;
	}
	
	
	function divideArray(dividend, divisor, getModulus){ 
		let quotient = [];
		
		
		if(getModulus) return 
	}
	// Arnums are reversed
	function subtractArray(minuend, subtrahend){
		let difference = [];
		
		return difference;
	}
	
	// [34][23][12] -> 3651
	// [12, 23, 34] -> [1, 5, 6, 3];
	
	function compressor__OLD(arr, options){
		for(let k = 0; k < arr.length; k++){
			let n = arr[k];
			if(n > 9){
				arr[k] = n % 10;
				if(!arr[k+1]) arr[k+1] = 0;
				arr[k+1] += Math.floor(n / 10);
			}
		}
		return arr;
	}
	
	/**********************************************************************
	 *					NUMBER OPERATIONS
	**********************************************************************/
	
	
	/*
		DESC:	removes the trailing zeros in decimal:
		E.G.:	0.001000 => 0.001
				12300 => 12300
		PARAM:	
				-getInt: if, after removing trailing zeros, 
					the number is an int, return the int.
					Otherwise, return it with .0 at the end.
					e.g. 40.00 --> 40.0 vs 40
	*/

	function trimZeros(n, getInt = true){
		let isArray = Array.isArray(n);
		if(!isArray) n = (n+'').split('');
		while(n[0] == 0) n.shift();
		while(n.peek() == 0) n.pop();
		if(!isArray) n = n.join('');
		return n;
	}
	
	/* 
		DELETE????
		
		IN	: strum-d (assume it passed isDec() test)
		OUT	: strum-d
		
		`option` : if true, then if the resulting number
					ends with a decimal point, then
					it will attach zero after it. 
	
	
	function moveDec(n, dir, units, option){
		// pad the side DP is moving to
		
		if((n+'')[0] == '-'){
			return '-' + moveDec(n.substring(1), dir, units, option);
		}
		let count = units, zeros = '';
		while(count--) zeros += '0';
		n = dir == 'right' ? n + zeros : zeros + n;
		let temp = n.indexOf('.');
		let index = temp == -1 ? n.length : temp;
		n = n.split('.').join('');
		let newIndex = dir == 'right' ? index + units : index - units;
		n = n.substring(0, newIndex) + '.' + n.substring(newIndex);
		console.log(n);
		while(n[0] == '0') n = n.substring(1);
		if(n[0] == '.') n = '0' + n;
		while(n[n.length - 1] == '0') n = n.substring(0, n.length-1);
		if(n[n.length - 1] == '.'){
			if(option) n = n.substring(0, n.length-1);
			else n += '0';
		}
		return n;
	}
	*/
	
	/*
		IN	: strum-d+/n+ (assume it passed isDec() or isScinNot() test);
		OUT	: {num, isNeg, debt}
	*/
	function getSignificand(n, getDebt){
		n += '';
		n = n.split('');
		let isNeg = n[0] == '-';
		if(isNeg) n = n.substring(1);
		
		//trim leading zeros
		while(n[0] == '0') n.shift();
		
		let decAt = n.indexOf('.');
		let debt = 0;
		if(decAt != -1){
			debt = -(n.length - 1 - decAt);
			n.splice(decAt, 1);
		}
		n = n.join('');
		return {num: n, isNeg, debt};
	}		
	
	//DELETE?
	/*
	DELETE??
	
	function fillZerosTo(n, place){
		n += '';
		let temp = isInt(n, true, true);
		if(temp || isZero(n)){
			n += '.';
			while(place--) n += '0';
			return n;
		} else {
			temp = n.split('.');
			let int = temp[0], dec = temp[1];
			while(dec.length < place) dec += '0';
			return int + '.' + dec;
		}
	}
	
	*/
	
	/*
		IN	:	-n : SafeInt or strum-n
				-getPowOfTen: boolean
				If `getPowOfTen`, then it returns 10^n in array
				e.g. (3, true) => [0,0,0,1]
					 (123, false) => [3,2,1];
		OUT	:
	*/
	function getArnum(n, getPowOfTen){
		if(getPowOfTen){
			let arr = [];
			while(n--) arr.push(0);
			arr.push(1);
			return arr;
		} else {
			n += '';
			n = n.split('').reverse();
			n.forEach(e=> parseInt(e,10));
			return n;
		}
	}
	function numToArray(n, getDebt){
		let obj = getSignificand(n, true);
	}
	
	/**********************************************************************
	 *					TEST NUMBER TYPE
	**********************************************************************/
	/*
		IN	: string
		OUT : bool or {num, isNeg, debt}
	*/
	function isSciNot(n, strict, extract){
		n += '';
		let result = (strict && /^\-?[1-9]\.\d+e\-?[1-9]\d*$/.test(n)
			|| !strict && /^\-?\d+(\.\d+)?[eE]\-?\d+$/.test(n));
		if(result && extract){
			let split = n.toLowerCase().split('e');
			let num = split[0];
			num = getSignificand(num, true);
			let debt = split[1];
			num.debt += debt;
			return;
		} else {
			return result;
		}
	}
	
	// if strict, 4.000 --> false
	function isInt(n, strict, extract){
		let result = (!strict && /^(\-?\d+)(\.0*)?$/.test(n))
			|| (strict && /^(\-?\d+)$/.test(n));
		if(result && extract){
			n = trimZeros(n, true);
			return n;
		}
		return result;
	}
	
	// if strict, 4.000 --> false
	/*  
		IN : 
		OUT: bool or {num, isNeg, debt}
	*/
	function isDec(n, strict, extract){
		let result = /\d+\.\d+/.test(n);
		if(strict) result = result && !isInt(n);
		if(result && extract){
			return getSignificand(n, true);
		}
		return result;
	}
	
	function isArnum(n, base = 10){
		if(!Array.isArray(n)) return false;
		let copy = [...numAlphaMap].splice(0, base);
		for(let i = 0; i < n.length; i++){
			let e = n[i];
			if(!copy.has(e)) return false;
		}
	}
	/*
		Proper format: 123 4/56
		If not strict, ALL of the following conditions must be met: 
		-
		If strict, on top of everything above, the following must be met:
		-numer < denom
		-If non-fraction part exists, it must be natural number
		-numer and denom must be natural numbers
		-If it's negative, then the first character must be negative sign (-)
	
	function isFrac(n, strict, getFormatted){
		let result = (!strict && /^\-?(\d+(\.\d+)?\s)?(\d+(\.\d+)?\/\d+(\.\d+)?)/.test(n))
			|| (strict && /^\-?([1-9]\d*\s)?([1-9]\d*\/[1-9]\d*)$/.test(n));
		
		if(result){
			// Extract parts
			let arr = n.split(/\s|\//);
			let numer = arr.length == 2 ? arr[0] : arr[1];
			let denom = arr.length == 2 ? arr[1] : arr[2];
			let whole = arr.length == 2 ? undefined : arr[0];
			
			
			if(strict 
				&& (numer = isInt(numer, true, true)) && !isZero(numer)				// numer is int, formatted, and not zero
				&& (denom = isInt(denom, true, true)) && !isZero(denom) 			// denom is int, formatted, and not zero
				&& (whole ? (whole = isInt(whole, true, true)) && !isZero(whole) : true)	// if whole exists, it is int, formatted, and not zero
				&& isLT(numer, denom)												// numerator is less than denom
			){
				if(getFormatted) return [whole, numer, denom];
				return true;
			} else if(strict){
				return false;
			}
		}
		return false;
		
	}
	*/
	
	function isPrime(n){}
	
	/*
		Any form of 0 will return true: 0, -0, 0.00, 0000.00, etc.
	*/
	function isZero(n){
		return /^\-?[0]+(\.0+)?$/.test(n);
	}			/*DONE*/

	
	/*
	////////////////////////////////////////////////////////////////////////
							RATIONAL NUMBER STUFF
	////////////////////////////////////////////////////////////////////////
		Numbers are made into fractions with numer and denom.
		Both numer and denom are array of single digits less than 10.
		Arrays are 'backwards' for ease of computing.
		e.g. 123 -> [1,2,3]
		
		Variables `numer` (numerator) and `denom` (denominator) are directly
		accessible outside the object, because I don't think people using 
		this library would be moronic enough to try to mess with it directly.
		
		
		TODO: 
			-change isNeg to isPos
			-handle repeating decimal
			-handle other bases
		
	*/
	function isRationalNumber(n, getIt){
		let result = n instanceof RationalNumber;
		if(getIt){
			if(!result){
				try {
					n = new RationalNumber(n);	
				} catch(e){
					throw e;
				}
			} else {
				return n;	
			} 
		}
		return result;
	}
	function RationalNumber(n, options){
		//deal with options
		//if the new RN is being created as a clone by another RN, then just get denom and numer from that obj
		let numer, denom, decDenom, origDenom, isNeg,
			origInput = n, //for debugging purpose
			base = options && options.base || 10;
		// Being cloned by another RN
		if(n instanceof 'RationalNumber'){
			
			return;
		}
		if(typeof n == 'number' && (isNaN(n) || Number.isNaN(n))){
			throw new Error(`${n} is NaN. It cannot initialize RationalNumber.`);	
		} else if(typeof n == 'number'){
			n += '';
		}
		if(isZero(n)){
			numer = 0, denom = 1, isNeg = false,
			origDenom = 1, decDenom = 1;
		} else if((n = isSciNot(n, true, true))){ 
			// n = {num, isNeg, debt}
			numer = getArnum(n.num);
			denom = origDenom = decDenom = getArnum(-n.debt);
			isNeg = n.isNeg;
		
		} else if(typeof n === 'string'){ 
			//test for bignum and fraction
			if(n.has('\/')){ //fraction
				let split, tempW, tempN, tempD; //whole, numerator, denominator
				if(n.has(' ')){ //has a whole number part (could be decimal, though, just to be comprehensive)
					split = n.split(' ');
					tempW = n[0];
					n = split[1];
					tempW = getSignificand(tempW, true);
				} else {
					tempW = {
						num: 0,
						isNeg: false,
						debt: 0
					};
				}
				split = n.split('\/');
				tempN = getSignificand(split[0], true);
				tempD = getSignificand(split[1], true);
				if(tempW && tempN && tempD){
					let debt = tempW.debt + tempN.debt - tempD.debt;
					let negs = 0;
					negs += tempW.isNeg ? 1 : 0;
					negs += tempD.isNeg ? 1 : 0;
					negs += tempN.isNeg ? 1 : 0;
					isNeg = negs%2 == 1;
					tempW = getArnum(tempW.num).reverse();
					tempN = getArnum(tempN.num).reverse();
					denom = getArnum(tempD.num).reverse();
					let product = multiplyArray(tempW, denom);
					numer = addArrays(product, tempN);
				} else {
					throw new Error(`${origInput} is not a valid input for RationalNumber.`);
				}
			} else {
				n = getSignificand(n, true);
				if(!n) throw new Error(`${origInput} is not a valid input for RationalNumber.`);
			}
		} else if(Array.isArray(n)){ 
			let map = [...numAlphaMap].splice(0, base);
			for(let i = n; i < n.length; i++){
				let e = n[i];
				if(!map.has(e)) throw new Error(`${origInput} is not a valid input for RationalNumber.`);
			}
			numer = n, denom = origDenom = decDenom = [1];
		} else { 
			throw new Error(`${origInput} is not a valid input for RationalNumber.`);
		}
		
		//test if the array has valid numbers of the base
	}
	
	RationalNumber.prototype = {
		/** 	COMPARISONS  **/
		isEqualTo(other){
			other = isRationalNumber(other, true);
			let isPos1 = this.isPos(),
				isPos2 = other.isPos();
			if(isPos1 != isPos2) return false;
			let n1 = this.getNumer(), 
				d1 = this.getDenom(),
				n2 = other.getNumer(),
				d2 = other.getDenom();
			return n1 == n2 && d1 == d2;
		},
		isLT(other){
			other = isRationalNumber(other, true);
			let isZero1 = this.isZero(),
				isZero2 = other.isZero(),
				isPos1 = this.isPos(),
				isPos2 = other.isPos();
			if(isZero1 && isZero2) return false;
			else if(isZero1) return isPos2;
			else if(isZero2) return !isPos1;
			if(isPos1 != isPos2) return !isPos1;
			
			
			//From here, it's either both -, or both +
			let n1 = this.getNumer({getArray: true}), 
				d1 = this.getDenom({getArray: true}),
				n2 = other.getNumer({getArray: true}),
				d2 = other.getDenom({getArray: true}),
				p1 = multiplyArray(n1, d2),
				p2 = multiplyArray(n2, d1);
			if(p1.length < p2.length) return isPos1;
			else if(p2.length < p1.length) return !isPos1;
			else { //From here, same sign, same length
				for(let i = p1.length - 1; i <= 0; i--){
					let d1 = p1[i],
						d2 = p2[i];
					if(d1 < d2) return isPos1;
					if(d1 > d2) return !isPos1;
				}
				return false; // They are equal
			}
			
		},
		isLTE(other){
			return this.isEqualTo(other) || this.isLT(other);
		},
		isGT(other){
			return !this.isLTE(other);
		},
		isGTE(other){
			return !this.isLT(other);
		},
		
		/** 	TESTING 	**/
		/*
			They all return boolean
		*/
		isNeg(){
			return !this.isPos && !this.isZero();
		},
		isZero(){
			return this.numer.length == 1 && this.numer[0] == 0;
		},
		isPos(){
			return this.isPos;
		},
		isInt(){
			return this.denom.length == 1 && this.denom[0] == 1;
		},
		//isDivisibleBy(other){},
		isRepDecimal(){
			return this.getDenom({getDec: true}) == true;
		},
		
		/** 	GET VALUE	**/
		/*
			Unless specified, they all return string by default
		*/
		toString(){
		/*
			options: toFrac, toPrecision, 
		*/
			if(options){
				
			} else {
				return this.valueOf() + '';
			}
		},
		toFrac(){
		/**
		 *	Options:
		 *		-getArray: returns [numer, denom]
		 *		-getDecimal: returns [decNumer, decDenom];
		 * 
		 **/
		},
		toDec(){},
		valueOf(){
			let n = this.numer.reverse().join('');
			let d = this.denom.reverse().join('');
			return n / d;
		},
		getNumer(options){
		/**
		 * options: original numer, or decimal numer
		 * 
		 */
			let n = [...this.numer];
			 if(options){
				let {
					getDecimal,
					getArray
				} = options;
				if(getArray) return n;
			}
			n.reverse();
			return n.join('');
		},
		getDenom(options){
		/**
		 * if the number is terminating decimal, then 
		 * it returns the denominator that is a power of ten
		 * options: original denom, or decimal Denom
		 * 
		 */
			let d = [...this.denom];
			if(options){
				let {
					getDecimal,
					getArray
				} = options;
				if(getArray) return d;
			}
			d.reverse();
			return d.join('');
		},
		// toBase(base){},
		
		
		/** 	ARITHMETIC	**/
		plus(){},
		minus(){},
		times(){},
		divideBy(){},
		power(){},
		nthRoot(){},
		
		/** 	MISC		**/
		getClone(){},
		
	};
	
	
	// user-facing methods
	return Object.freeze({
		getRational(n, options){
			return Object.freeze(new RationalNumber(n));
		},
		// n^(1/root)
		getNthRoot(n, root, options){
			let obj = getSignificand(n, true);
			n  = obj.num;
			let isNeg = obj.isNeg, debt= obj.debt;
			
		},
		add(...nums){
			let sum = nums.reduce((accu,curr)=>{return accu+curr});
			if(Number.isSafeInteger(sum)) return sum;
			
			
		},
		subtract(minuend, subtrahend){
			
		},
		multiply(...nums){
			
		},
		power(n, exp){
			
		},
		
		divide(dividend, divisor){
			
		},
		factorialEZ(n){
			return n <= 1 ? 1 : n * this.factorialEZ(n - 1);
		},
		factorial(n){
		/*
			Uses while loop as to not cause stack overflow
			Divides each factor by 10, 5, or 2, as to simply add
			the zeros at the end after the factorial is obtained.
		*/
			// get composites whose product is the desired factorial
			// separate 10s, as to add the zeros later
			function step1(n){
				let arr = [];
				let prod = 1;
				let tens = 0;
				let fives = 0;
				while(n){
					let curr = n--;
					while(curr%10 == 0){
						curr /= 10;
						tens++;
					}
					while(curr%5 == 0){
						fives++;
						curr /= 5;
					}
					while(fives && curr%2 == 0){
						fives--;
						tens++;
						curr /= 2;
					}
					
					let temp = prod * curr;
					if(Number.isSafeInteger(temp)){
						prod = temp;
			        } else {
						arr.push(prod);
						prod = curr;
			        }
			    }
				arr.push(prod);
				arr.tens = tens;
				return arr; // need to multiply everything before returning;
			}
			// Turn each number into array, and reverse it
			function step2(arr){
				for(let i = 0; i < arr.length; i++){
					let temp = [];
					let num = arr[i];
					while(num >= 10){
						let unit = num%10;
						num = Math.floor(num/10);
						temp.push(unit);
					}
					temp.push(num);
					arr[i] = temp;
				}
			}
			// multiply the arrays
			function step3(arr){
				while(arr.length > 1){
					let a = arr.shift();
					let b = arr.shift();
					let prod = multiplyArray(a, b, true);
					arr.push(prod);
				}
			}
			// add the zeros and reverse order
			function step4(arr){
				let num = arr.shift();
				let tens = arr.tens;
				while(tens--) num.unshift(0);
				num.reverse();
				return num;
			}
			let arr = step1(n);
			step2(arr);
			step3(arr);
			return step4(arr);
			
			// let f = arr[0];
			// f.reverse();
			// return f.join('');
		},
		getPascalsTriangle(rowCount, options){
			// nth row => 11^n before compression
			let getWholeTriangle = options && options.getWholeTriangle;
			let uncompressed = options && options.uncompressed;
			
			let rows = [[1], [1,1]];
			for(let i = 2; i < rowCount; i++){
				let row = [];
				let lastRow = rows[i - 1];
				for(let j = 0; j < lastRow.length - 1; j++){
					let a = lastRow[j], b = lastRow[j + 1];
					row.push(a + b);
				}
				row.unshift(1)
				row.push(1);
				rows.push(row);
			}
			return rows;
		},
		
		compare(a,b){},
		isIncreasing(...nums){},
		isNonDecreasing(...nums){},
		isDecreasing(...nums){},
		isNonIncreasing(...nums){},
		isEqual(...nums){},
		
		//Prime number stuff
		getPrimeFactors(n, getUnique){},
		getPrimesBetween(a,b){
		// returns an array of primes such that a prime 
		// in the array is a <= prime <= b
		// use Array slice: https://goo.gl/Ilgsok
		},
		isPrime(n){},
		
		//Discrete stuff
		breakdown(n){
		/* 
			123.456 => [
				{level: 2, unit: 1, val: 100}, 
				{level: 1, unit: 2, val: 20},  
				{level: 0, unit: 3, val: 3},   
				{level: -1, unit: 4, val: 0.4},   
				{level: -2, unit: 5, val: 0.05},   
				{level: -3, unit: 6, val: 0.006} 
			
			]
		*/
		},
		convertBase(n, b1, b2){
			function toBase10(n, b){
				
			}
			if(n < 0) return this.convertBase(-n, b1, b2);
			else if(n < 2) return n;
			
			if(b1 == b2) return n;
			if(b1 != 10) toBase10(n, b1);
		},
		gcd(...args){},
		gcf(...args){},
		lcm(...args){},
		powersOf(n){},
		factorsOf(n){},
		
		
		// Linear Algebra
		distanceBetween(v1, v2){
			
		},
		
		// Misc.
		max(){},
		min(){},
		simplifyRoot(n, root = 2){
		/*
			PRE: `n` and `root` are both simple integers
			RETURN: [INT, ROOT], where INT and ROOT are both 
				simple integers
		*/
		},
		getRandomBetween(a,b){
			
		}
	});
}({
	initPrimeLimit: 20000
}));

//***********//***********//***********//***********//***********//***********//
//***********//					EXPERIMENTAL STUFF				 //***********//
//***********//***********//***********//***********//***********//***********//

/*
process queue
-numbers:
  if scinot,
     and strict mode, throw exception
     if not strict, just make it into dec/debt
  if decimal
     dec/debt
  int is int
  take tens first, then 5s, then twos if there are fives
-String
  See if it can processed with parseInt,     parseFloat, and treated as number
  if it's too big, process it into array
-If array, check for dect/debt, twos and fives	

-Assume base 10, assume all inputs are in correct format [0-9]

if this is called with RationalNumber as `this`, then skip the testing, as everything
will be ints in arrays
*/
function getMultiQueue(...args){
	let numQueue = [], rejects = [], arrQueue = [], 
		counts = {tens: 0, fives: 0, twos: 0},
		isNeg = false, skipTest = this instanceof RationalNumber,
		options = (
			typeof args.peek() === 'object' 
			&& !Array.isArray(args.peek())
			&& args.pop()
		), base = options && options.base || 10,
		isStrict = options && options.isStrict;
		
	//will return either int or array
	function processElem(n){
		let divisors = [10, 5, 2];
		let isSciNot = /^\-?[1-9]\.\d+e\-?[1-9][0-9]*$/.test('' + n);
		n = isSciNot ? n + '' : n; // if scinot, preprocess it as string first, then as number
		if(typeof n == 'number' && !Number.isNaN(n)){
			if(n < 0){
				isNeg = !isNeg;
				n *= -1;
			}
			let skipTens = n !== parseInt(n); //////////////////////// problem
			while(n !== parseInt(n)){//////////////////////// problem
				n *= 10;
				counts.tens--;
			}
			divisors.forEach(divisor=>{
				if(divisor == 10 && skipTens) return;
				let count = 0; 
				while(n%divisor == 0){
					count++;
					n /= divisor;
				}
				let str = divisor == 10 ? 'tens' : divisor == 5 ? 'fives' : 'twos';
				counts[str] += count;
			});
			return n;
		} else if(typeof n == 'string'){
			n = n.split('');
			if(n[0] == '-'){
				n.shift();
				isNeg = !isNeg;
			}
			while(n[0] == '0') n.shift();
			n = n.join('');
			if(n.length == (parseInt(n) + '').length){
				return processElem(parseInt(n));
			} else if(n.length == (parseFloat(n) + '').length){
				return processElem(parseFloat(n));
			} else if(isSciNot){
				if(isStrict){
					return;
				} else {
					//just process it as decimal
					let temp = n.split('e');
					let significand = parseFloat(n[0]);
					let power = parseInt(n[1]);
					counts.tens -= power;
					return processElem(significand);
				}
			} else if(/^\d*(\.\d+)?$/.test(n)){ // number was passed as string because it was too long.
				n = n.split('');
				let decAt = n.indexOf('.');
				if(decAt == -1) return n;
				else {
					let debt = n.length - 1 - decAt;
					counts.tens -= debt;
					n.splice(decAt, 1);
					return n;
				}
				
			}
		} else if(Array.isArray(n)){ // if array, each elem must be an integer less than the base
			for(let i = 0; i < n.length; i++){
				if(n[i] >= base) return false;
			}
			return n;
		}
	}
	let hasZero = false;
	for(let i = 0; i < args.length; i++){
		let e = args[i];
		if(/^\-?0*(\.0*)*$/.test(e + '')){
			hasZero = true;
			break;
		}
		let result = processElem(e);
		if(result){
			if(Array.isArray(result)) arrQueue.push(result);
			else{
				numQueue.push(result);
			}
		} else if(result == 0){
			hasZero = true;
			break;
		} else {
			rejects.push(e);
		}
	};
	if(hasZero){
		numQueue = [], isNeg = false, arrQueue = [],
		counts = {tens: 0, fives: 0, twos: 0};
	}
	return {numQueue, rejects, arrQueue, counts, isNeg};
}



/*********
power of a number (e.g. 4^235)
4^235 = 4^128 * 4^64 * 4^32 * 4^8 * 4^2 * 4^1

so I just need to double 4 until i get obtain necessary powers,
keeping track of them as I go, and then multiply them


*********/
function addArrays2(...addends){
	let last = addends.peek();
	let options = last instanceof Object
		&& !Array.isArray(last)
		&& addends.pop();
	let sum = [];
	if(addends.length){
		sum = addends.shift();
		for(let i = 0; i < addends.length; i++){
			let row = addends.shift();
			for(let j = 0; j < row.length; j++){
				let d = row[j];
				let curr = sum[j] || 0;
				sum[j] = d + curr;
			}
		}
	}
	// return compressor(sum);
	// return options.compress ? compressor(sum, options) : sum;
	
}

function multiplyArray3(f1, f2, options){
	const COMP_POINT = 10000000;
	/*
		This version memorizes previous multiples so it doesn't have to 
		go through the array again.
		For example, when doing 19832 * 2100021, it will remember
		19832 * 2 so it doesn't do it twice. For x1, it will simply copy
		
		version3:
		-if the digits aren't supposed to be compressed, but the 
		product goes beyond breakPoint, then it will break into integer
		
		All this crap is being done so I can get Pascal's triangle right
	*/
	let compress = options && options.compress;
	let compPt = (options && options.compPt) || COMP_POINT /*|| base*/ || 10;
	let multiples = [[], [...f1]]; // f1 * 0 and f1 * 1;
	let prod = [];
	for(let i = 0; i < f2.length; i++){
		let multiplier = f2[i];
		if(multiplier == 0) continue;
		let multiple;
		if(multiples[multiplier]){
			multiple = [...multiples[multiplier]];
        } else {
			multiple = [];
			for(let j = 0; j < f1.length; j++){
				let d1 = f1[j], d2 = f2[i];
				if(Array.isArray(d1) || Array.isArray(d2)){
					if(!Array.isArray(d1)) d1 = [d1];
					if(!Array.isArray(d2)) d2 = [d2];
					d1.reverse();
					d2.reverse();
					let prod = multiplyArray3(d1, d2, {
						compress: true,
						compPt: COMP_POINT
					});
					prod.reverse();
					multiple[j] = prod;
				} else {
					let temp = f1[j] * f2[i];
					let arr = [];
					while(compress && temp >= compPt){
						arr.push(temp%compPt);
						temp = Math.floor(temp/compPt);
					}
					multiple[j] = compress ? arr : temp;
				}
            }
            multiples[multiplier] = [...multiple];
			
        }
        let k = i;
        while(k--) multiple.unshift(0);
		prod.push(multiple);
    }
    return prod;
}
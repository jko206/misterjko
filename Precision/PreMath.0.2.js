

/* global MathJax*/

/*
pass ints to those that can't handle intstr yet

getRandomBetween() finish
breakDown() start
convertBases() fix
Compare (a, b )
Apply, call, bind for gt, gte, lt, lte

If a=b, then 0
If a > b, then -1
Return 1


	TODO: 
		-sort: sorts a given array of numbers, no matter rational, irrational, or different base
		-get NthRootOf
		-finish RatNum
		-finish getRandomBetween(a,b);
		-Make getNthRootOf use string
		-change the names to "get______" or something.
		-make nthRootOf with BigInt
		-unit test everything
		-make n-based number like an array, like in WolframAlpha
		-Matrix op
		-see if there's a way to improve Big Int stuff
		-Finish N-tuple sum and products
		
		-Make things handle when given numbers are float
		- .subtract() needs to be finished
		- make everything, including RatNum into $PM(stuff).method() like jQuery
		- scientific notation to intstr
		- note which methods can handle bignum, and which can't.
		
		-isGT(); isLT(); isGTE(); isLTE(); equals();	
		-isAscendingOrder();
		-isNonDescendingOrder();
		-isDescendingOrder();
		-__isSciNotation();
		-__isRational
		-__isInt()
		-__isNatural()
		-__isFloat();
		-__isEndlessDecimal();
		
		
		
		parseNum(num);
		
*/
'use strict';

const PreMath = (function(){
	let JS_INT_LIMIT = 100000000000000000000;
	
	/***********************************
				BIG INT 
	***********************************/
	function multiplyHelper(a, b){
		a = (a + '').split('').reverse();
		b = (b + '').split('').reverse();
		let product = [];
		for(let i = 0; i < a.length; i++){
			for(let j = 0; j < b.length; j++){
				let temp = a[i] * b[j];
				let unit = temp % 10;
				let tens = Math.floor(temp / 10);
				if(!product[i + j]) product[i + j] = 0;
				product[i + j] += unit;
				if(tens){
					if(!product[i + j + 1]) product[i + j + 1] = 0;
					product[i + j + 1] += tens;
				}

			}
		}
		product = compressor(product);

		let final = product.reverse().join('');
		return final;
	}

	function compressor(arr){
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


	/***********************************
				PRIMES 
	***********************************/
	let primes = [], maxPrime;
	function makePrimes(limit = 10000){
		if(!obj.isInt(limit)) throw new Error(`Invalid value ${limit} given.`);
		if(limit <= maxPrime) return;
		let primeMarkers = [], incr = 1;
		primes = [];
        for(var i = 2; i <= limit; i+=incr){
            if(primeMarkers[i] === undefined){ //if prime number,
                //then mark all the multiples <= n false;
                var k = 2;				// can't mark itself as composite
                while(k*i <= limit){
                    primeMarkers[k*i] = false;
                    k++;
                }
                // put nums[i] in primes;
                if(i == 3) incr = 2;	// Increment by 2, since 2 is the only even prime
                primes.push(i);
        		maxPrime = i; //last prime number
            }
        }
    }
	///////////////////////////////////////////////////////////
	let obj = {
		/***********************************
				TEST AND PARSE NUMBERS
		***********************************/
		/*
			-isWhole / isWholeStr
			-isInt / isIntStr
			-isFloat / isFloatStr
			-isFrac
			-isScientific
		*/
		isWhole(...nums){
			for(var i = 0; i < nums.length; i++){
				let num = nums[i];
				if(!/^0$|^[1-9]\d*(\.0+)?$/.test(''+ num)) return false;
			}
			return true;
		},
		isInt(...nums){
			for(var i = 0; i < nums.length; i++){
				let num = nums[i];
				if(!/^0$|^\-?[1-9]\d*(\.0+)?$/.test(''+ num)) return false;
			}
			return true;
		},
		isFloat(...nums){
			for(var i = 0; i < nums.length; i++){
				let num = nums[i];
				if(!/^0$|^\-?[1-9]\d+\.\d+$/.test(''+ num)) return false;
			}
			return true;
		},
		isSciNotation(...nums){
			for(var i = 0; i < nums.length; i++){
				let num = nums[i] + '';
				if(num.indexOf('e') != -1){
					num = num.split('e');
					if(num.length != 2 || !this.isFloat(num[0]) || !this.isInt(num[0])) return false;
				} else {
					return false;
				}
			}
			return true;
		},
		
		
		/***********************************
			PRIME FACTOR STUFF
		***********************************/
        // PRE: args are ints < JS_INT_LIMIT
        isPrime(...nums){
        	// nums.sort();
        	nums.sort(function(a, b){
        		a = parseInt(a);
        		b = parseInt(b);
        		return a - b;
        	});
        	let last = nums[nums.length - 1];
        	last = parseInt(last);
	        if(!maxPrime || last > maxPrime) makePrimes(last);
        	for(let i = 0; i < nums.length; i++){
        		let n = nums[i]; 
        		n = parseInt(n, 10); ////////////////// TEMP STUFF///////////////
	        	if(n < 0) n *= -1;
		        if(primes.indexOf(n) == -1) return false;
        	}
        	return true;
	    },
		getPrimeFactors(num, getUnique){
			function findUnique(pfs){
				let last = -1;
				let arr = [];
				while(pfs.length){
					let shift = pfs.shift();
					if(shift != last){
						arr.push(shift);
					}
					last = shift;
				}
				return arr;
			}
			//must initialize prime. Fresh list of prime numbers must be provided each use
			if(!maxPrime || num > maxPrime) makePrimes(num);
			var primesClone = primes.clone();
		    var prime = primesClone.shift();
		    var primeFactors = [];
		    while(num > 1){
		    	let dividend = num / prime;
		    	if(this.isWhole(dividend)){
		    		primeFactors.push(prime);
		    		num = dividend;
		    	} else {
		    		prime = primesClone.shift();
		    	}
		    }
		    return getUnique ? findUnique(primeFactors) : primeFactors;
		},
		getPrimesBetween(a, b){ // inclusive: a <= primes <= b
			if(a == b) return [];
			let min = a < b ? a : b;
			let max = a >= b ? a : b;
			if(!maxPrime || maxPrime < max) makePrimes(max);
			while(primes.indexOf(min) == -1) min++;
			while(primes.indexOf(max) == -1) max--;
			let lowerIndex = primes.indexOf(min), upperIndex = primes.indexOf(max);
	        return primes.getChunk(lowerIndex, upperIndex);
		},
		getRandomPrimeBetween(a,b){
			if(!this.isWhole(a, b)) throw new Error (`Need integer values. a: ${a} and b: ${b} passed.`);
	        let rangedPrimes = this.getPrimesBetween(a, b);
	        let random = Math.floor(Math.random() * rangedPrimes.length);
	        return rangedPrimes[random];
	    },
		
		/***********************************
				NUMBER ANALYSIS
		***********************************/
		gcd(...nums){
			if(nums.length < 2 || !this.isWhole(...nums)) throw new Error('Invalid values passed: ' + nums);
			function euclidMethod(a, b){
				if(a > b) var max = a, min = b;
				else max = b, min = a;
				if(max%min == 0) return min;
				else return euclidMethod(max % min, min);
			}
			while(nums.length > 1){
				let a = nums.shift(), b = nums.shift();
				let result = euclidMethod(a, b);
				nums.push(result);
			}
			return nums[0];
		},
		gcf(...nums){return this.gcd(...nums)},
		lcm(...nums){
			if(nums.length < 2 || !this.isWhole(...nums)) throw new Error('Invalid values passed: ' + nums);
			while(nums.length > 1){
				let a = nums.shift(), b = nums.shift();
				let g = this.gcd(a, b);
				let l = a * b / g;
				nums.push(l);
			}
			return nums[0];
		},
		powersOf(base, maxExp){
			var arr = [];
	        var temp = 1;
	        for(var i = 1; i <= maxExp; i++){
	            temp *= base;
	            arr.push(temp);
	        }
	        return arr;
		},
		breakdown(){},					////////////////////////////////// TODO: work on this
		factorsOf(n){
			var factors = [1];
			for(var i = 2; i < n; i++){
				if(this.isWhole(n / i)) factors.push(i);
			}
		    factors.push(n);
		    return factors;
		},
	    //TODO: Handle decimal
		convertBases(num0, b0, b1, options){
			function changeBase(decimal, base){
				let newNum = [];
				while(decimal){
					let remainder = decimal % base;
					decimal = Math.floor(decimal / base);
					newNum.unshift(remainder);
				}
				return newNum;
			}
			function getDecimal(n0, b0){
				//convert to decimal first...
				let sum = 0;
				while(n0.length){
					let digit = n0.shift();
					sum *= b0;
					sum += digit;
				}
				return sum;
			}
			
			if(num0 == 0 || b0 == b1) return num0;
			let abcTo123 = {
				'A' : 10,	'B' : 11,	'C' : 12,	'D' : 13,	'E' : 14,
				'F' : 15,	'G' : 16,	'H' : 17,	'I' : 18,	'J' : 19,
				'K' : 20,	'L' : 21,	'M' : 22,	'N' : 23,	'O' : 25,
				'P' : 25,	'Q' : 26,	'R' : 27,	'S' : 28,	'T' : 29,
				'U' : 30,	'V' : 31,	'W' : 32,	'X' : 33,	'Y' : 34,
				'Z' : 35
			};
			let _123ToABC = {
				10  : 'A',	11	: 'B',	12	: 'C',	13	: 'D',  14	: 'E',	
				15	: 'F',	16	: 'G',	17	: 'H',	18	: 'I',  19	: 'J',	
				20	: 'K',	21	: 'L',	22	: 'M',	23	: 'N',  24	: 'O',	
				25	: 'P',	26	: 'Q',	27	: 'R',	28	: 'S',  29	: 'T',	
				30	: 'U',	31	: 'V',	32	: 'W',	33	: 'X',  34	: 'Y',	
				35  : 'Z'
			};
			num0 += '';
			// Pre-process
			if(/^(\[\d+\])+(\_\d+)?$/.test(num0)) num0 = num0.match(/^(\[\d+\])+/);
			if(/^(\[\d+\])+/.test(num0)) num0 = num0[0].match(/\d+/g);
			else num0 = num0.split('');
			num0.forEach(function(e, i, arr){
				e = e.toUpperCase();
				if(abcTo123[e]) e =  abcTo123[e];
				else e = parseInt(e);
				arr[i] = e;
			});
			
			//conversion
			let decimal = getDecimal(num0, b0);
			let converted = changeBase(decimal, b1);
			
			// Packaging return value
			if(options) var {toArray, showBase, wrapDigits} = options;
			
			wrapDigits = wrapDigits || b1 > 36;
			if(wrapDigits){
				let str = converted.join('][');
				str = `[${str}]`;
				if(showBase) return str + `_${b1}`;
				else return str;
			} else {
				for(let i = 0; i < converted.length; i++){
					let d = converted[i];
					if(_123ToABC[d]) converted[i] = _123ToABC[d];
				}
				if(toArray) return converted;
				return converted.join('');
			}
	    },
		/**
		 * Method 1: a <= random <  b
		 * Method 2: a <= random <= b
		 * Method 3: a <  random <= b
		 * Method 4: a <  random <  b
		 * 
		 */
		getRandomBetween(a, b, method = 0){
			let min, max, magDebt, range, offset;
			if(a == b){
				if(method != 4) return a;
				else return undefined;
			} else if(a > b) max = a, min = b;
			else max = b, min = a;
			
			while(1/*min and max are decimals*/){
				magDebt *= 10;
			}
		},
		/* 
		    Given two arrays of points of n-dimension, 
		    returns the distance between them. 
		    if one array is shorter than the other, the shorter
		    one is filled with 0s and calculates the distance that way. 
		    so if [1,2,3] and [1,2,3,3,4] is passed, the first array
		    will be seen as [1,2,3,0,0]
		    the distance between the two example points is 5 units
		*/
		distanceBetween(a, b){
			if(a.toString() == b.toString()) return 0;
			// x_1^2 + x_2^2 + x_3^2 + ... + x_n^2 = c^2 
			// that's where I got c2
		    var c2 = (function(){
		    	var len = Math.max(a.length, b.length);
		    	var total = 0; 
		    	for(var i = 0; i < len; i++){
		    		a[i] = a[i] || 0;
		    		b[i] = b[i] || 0;
		    		var diff = a[i] - b[i];
		    		total += diff * diff;
		    	}
		    	return total;
		    }());
		    // prime factorize
		    if(c2 == 0) return 0;
		    //get prime numbers less than n;
		    var aRootB = this.simplifyRadical(c2);
		    return aRootB;
		},
		// takes in an array of factors that are inside the sq. root sign
		simplifyRadical(n){
			return this.simplifyNthRoot(2, n);
		},
		simplifyNthRoot(n, root){
			function multiply(a, b){
				return a * b;
			}
			let factors = this.getPrimeFactors(root);
			let lastFactor = -1, buffer = [], a = [], b = [];
			while(factors.length){
				let factor = factors.shift();	
				if(factor == lastFactor){
					buffer.push(factor);
					if(buffer.length == n){
						buffer = [];
						a.push(factor);
					}
				} else {
					b.push(...buffer);
					buffer = [factor];
				}
				lastFactor = factor;
			}
			b.push(...buffer);
			
			a = a.reduce(multiply, 1), b = b.reduce(multiply, 1);
			return [a, b];
		},
		// nTupleProduct(3, 12) --> [[2, 2, 3], [1, 4, 3], [1, 2, 6]]
		// nTupleProduct(4, 7, {getUniqueElements:true}) --> [];
		nTupleProduct(n, prod, options){
			if(options) var {getUniqueElem, getUniqueSoln} = options; //getUniqueSoln means [1, 2, 3] == [3, 2, 1]
			
		},
		nTupleSum(n, sum){
			
		},
		
		
		
		
		/***********************************
					BIG INT 
		***********************************/
		factorial(n, iUnderstandTheRisk){
			if(n == 0) return 1;
			if(!this.isWhole(n) || n < 0) throw new Error(`${n} is not a valid argument`);
			if(n <= 10000 || iUnderstandTheRisk){
				let nums = [];
				while(n > 1){
					nums.push(n);
					n--;
				}
				return this.multiply(...nums);
			}
		},
		add(...nums){
			let sum = [];
			nums.forEach(function(num){
				num = (num+'').split('').reverse();
				num.forEach(function(digit, place){
					digit *= 1;
					sum[place] = sum[place] ? sum[place] + digit : digit;
				});
			});
			sum = compressor(sum);

			let final = sum.reverse().join('');
			return final;

		},
		subtract(minuend, ...subtrahends){
			let subtrahendSum = this.sum(...subtrahends);

		},
		multiply(...nums){
			if(nums.indexOf('0') != -1 || nums.indexOf(0) != -1) return 0;
			nums.filter(function(elem){
				return elem != 1 || elem != '1';
			});
			while(nums.length > 1){
				let a = nums.shift();
				let b = nums.shift();
				let prod = multiplyHelper(a, b);
				nums.push(prod);
			}
			return nums[0];
		},
		divideTo(dividend, divisor, precision){},
		pow(n, exp){
			let arr = [];
			while(exp--) arr.push(n);
			return this.multiply(...arr);
		},
		getNthRootOf(x, n, precision){
			if(x != parseFloat(x) || isNaN(x)) throw new Error('Pass a number, not ' + x);
			if(x < 0 && n%2 == 1) throw new Error('If x is negative, then can only get even roots');
			precision = (isNaN(precision) || precision < 1) ? 5 : parseInt(precision);
			let decimalTracker = 0;

			// Initialize x as to start the recursion with significands
			while(x != parseInt(x)){
				x *= 10;
				decimalTracker--;
			}
			while(x%10 == 0){
				x /= 10;
				decimalTracker++;
			}

			function recourse(root, target, precision){
				if(precision == 0){
					return root;
				} else {
					/*let greatestFit = root;
					let newDigitToTry = -1;
					while(greatestFit < target){
						newDigitToTry++;
						let temp = root + newDigitToTry;
						greatestFit = Math.pow(temp, n);
						if(greatestFit == target) return greatestFit;
					}
					target *= Math.pow(10, n);
					decimalTracker--;
					return recourse(greatestFit * 10, target, precision - 1);*/
					let greatestFit = 0;
					while(greatestFit < target){
						root++;
						greatestFit = Math.pow(root, n);
						if(greatestFit == target) return root;
					}
					root--;
					decimalTracker--;
					return recourse(root * 10, target * Math.pow(10, n), precision-1);
				}
			}
			let root = recourse(0, x, precision);
			return root * Math.pow(10, decimalTracker);
		},
		/* Returns significand and the exponent.
			getSignificand(1.234) --> ['1234', -3]
		*/
		getSignificand(number){
			//check validity
			number += '';
			number = number.trim();
			// Regex rules:
			/* 	The number may not start with 0, unless
				it is immediately followed by decimal point
				and one or more digits
			*/
			if(/^0+(\.0*)?$/.test(number)) return [0, 0];
			if(!/^((([1-9]+\d*)|0)(\.\d+)?)$/.test(number)) throw new Error('Invalid value '+number+' passed.');
			let significand, exponent;
			if(number.indexOf('.') != -1){
				let split = number.split('.');
				let whole = split[0], decimal = split[1];
				if(/^0*$/.test(decimal)){
					return this.getSignificand(whole);
				}
				significand = (whole + decimal).match(/[1-9]+(0*[1-9]+)*/)[0];
				decimal = decimal.match(/\d*[1-9]+/)[0];
				exponent = -decimal.length;
			} else {
				significand = number.match(/[1-9]+(0*[1-9]+)*/)[0];
				exponent = number.match(/0*$/)[0].length;
			}
			return [significand, exponent];
		},
		moveDecimalPointBy(number, d){
			function getZeros(n){
				let z = '';
				while(n--) z += '0'; 
				return z;
			}
			try{
				let sig = this.getSignificand(number);
				let significand = sig[0];
				let newExp = sig[1] + d;
				if(newExp > 0){
					let z = getZeros(newExp);
					return significand + z;
				} else if(newExp == 0){
					return significand;
				} else {
					let sigLength = significand.length;
					let temp = sigLength + newExp;
					if(temp <= 0){
						let z = getZeros(-temp);
						return '0.' + z + significand;
					} else {
						return significand.substring(0, temp) + '.' + significand.substr(temp);
					}
				}
			} catch (e){
				throw e;
			}
		},
		
		/***********************************
				MATHJAX STUFF 
		***********************************/
		renderMath(){
		    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		}
	};
	return obj;
}());

// RegularOl.factorial(40) => 8.159152832478977e+47
// BigInt.factorial(40) => "815915283247897734345611269596115894272000000000"
const BigInt = (function(){
	

	return {
		
	};
}());




/*
	Rational Number methods:
	-toString
	-getFrac(inOrigDenom)
	-getDec
	-plus()
	-minus()
	-times()
	-divBy()
	-

	Private variables:
	-significand
	-exp
	-numer
	-denom
	-original denom
	-isModified
	-isRepDecimal
	-
*/
function RationalNumber(n, repDigits){};

RationalNumber.prototype.constructor = RationalNumber;


function sqftToPyong(n){
	return n * 0.092903 / 3.3;
}
/*
RationalNumber: function(x, repeatsLastN){
        var whole, numer, denom, origDenom;
        function isInt(n){
            return n == parseInt(n);
        }
        function getRationalNumber(o){
            if(o.getClass && o.getClass == 'RationalNumber'){
                return o;
            } else {
                return new PreMath.RationalNumber(o);
            }
        }
        // initialize
        (function(x, repeatsLastN){
            var cls = getClass(x);
            if(cls == 'String'){
                temp = parseFloat(x);
                if(isNaN(temp)) throw new Error('RationalNumber needs a valid initial value. x: ' + x +'.');
                else x = temp;
                cls = 'Number';
            } 
            if(cls == 'Array') {
                // assume the nums are integers for now
                if(x.length == 2){
                    numer = parseInt(x[0]);
                    origDenom = denom = parseInt(x[1]);
                    if(!isInt(numer) || !isInt(denom)) 
                        throw new Error('RationalNumber needs a valid initial value. x: ' + x +'. Array2');
                } else if(x.length == 3){
                    whole = parseInt(x[0]);
                    numer = parseInt(x[1]);
                    denom = origDenom = parseInt(x[2]);
                    if(!isInt(whole) || !isInt(numer) || !isInt(denom)) 
                        throw new Error('RationalNumber needs a valid initial value. x: ' + x +'. Array3');
                    numer = denom * whole + numer;
                } else {
                    throw new Error('RationalNumber needs a valid initial value. x: ' + x +'. ArrayMisc');
                }
            } else if(cls == 'Object' && x.getClass && x.getClass() == 'RationalNumber'){
                var xFrac = x.getFrac();
                numer = xFrac[0], denom = xFrac[1];
            } else if(cls == 'Number'){
                if(repeatsLastN){
                    var str = x + '';
                    if((str).length - 2 < repeatsLastN) 
                        throw new Error('RationalNumber needs a valid initial value. x: ' + x
                            + ', and number of repeating digits: ' + repeatsLastN + '. Repeat'
                        );
                    var decPointIndex = str.indexOf('.');
                    var repeatStartsAt = str.length - repeatsLastN;
                    d
                    var nonRepeat = str.substring(0, repeatStartsAt);
                    nonRepeat = new PreMath.RationalNumber(nonRepeat);
                    var repeat = str.substring(repeatStartsAt);
                    repeat = parseInt(repeat, 10);
                    var decimal = str.substring(decPointIndex);
                    decimal = parseFloat(decimal);
                    
                    var nines = '';
                    while(repeatsLastN > 0){
                        nines += '9';
                        repeatsLastN--;
                    }
                    nines = parseInt(nines, 10);
                    
                    while(decimal < 0.1){
                        nines *= 10;
                    }
                    var d = nines;
                    var n = repeat;
                    
                    var temp = nonRepeat.add([n,d]).getFrac();
                    numer = temp[0], denom = temp[1];
                } else {
                    denom = 1;
                    while(!isInt(x)){
                        x *= 10;
                        denom *= 10;
                    }
                    numer = x;
                }
            } else {
                throw new Error('RationalNumber needs a valid initial value. x: ' + x +'.');
            }
            //console.log(numer, denom);
            var g = gcd(numer, denom);
            numer /= g, denom /= g;
        }(x, repeatsLastN));
        
        return {
            //by default returns fraction
            //options: toMathJax, getDecimal, roundTo, wrapper, mixedNum, denom
            toString(options){
                if(isInt(numer/denom)) return numer/denom;
                var toMathJax = options && options.toMathJax;
                var wrapper = toMathJax && options && options.wrapper
                        ? options.wrapper : '';
                var getDecimal = options && options.getDecimal;
                if(getDecimal){
                    var isRep = (function(){
                        var pf = primeFactors(denom);
                        return !(pf.length == 2 && pf[0] == 2 && pf[1] == 5);
                    }());
                    var roundTo = options && options.roundTo;
                    var decimal = PreMath.getDecimal(numer, denom, 100);
                    if(isRep && roundTo){
                        var n  = numer / denom;
                        var powOf10 = (function(){
                            var p = 1;
                            while(roundTo > 0){
                                p *= 10;
                                roundTo--;
                            }
                            return p;
                        }());
                        return Math.round(n * powOf10) / powOf10;
                    } else if(isRep && toMathJax){
                        console.log('here', toMathJax);
                        var findPattern = function(pattern, str){
                            if(str == '') return true;
                            var len = pattern.length;
                            if(str.length > len){
                                var chunk = str.substr(0, len);
                                var remaining = str.substr(len);
                                var isMatch = chunk == pattern;
                            } else {
                                chunk = str;
                                remaining = '';
                                isMatch = pattern.indexOf(chunk) == 0
                            }
                            return isMatch && findPattern(pattern, remaining);
                        }
                        var pattern = '';
                        for(var i = decimal.indexOf('.') + 1; i < decimal.length; i++){
                            for(var pLength = 1; pLength <= decimal.length - i; pLength++){
                                pattern = decimal.substr(i, pLength);
                                var substr = decimal.substring(i+pLength);
                    			var result = findPattern(pattern, substr);
                    			if(result) break;
                            }
                            if(result) break;
                        }
                        // $4.\overline{285714}$
                        decimal = decimal.substring(0, i);
                        return wrapper +  decimal
                                + '\\overline{' + pattern + '}' 
                                + wrapper;
                    	//return [decimal, pattern, i];
                    } else {
                        return decimal;
                    }
                } else if(toMathJax){
                    var multiplier = 1;
                    if(options && options.getOrigDenom){
                        multiplier = origDenom / denom;
                    }
                    if(options && options.mixedNum){
                        var w = Math.floor(numer / denom);
                        w = w == 0 ? '' : w;
                        n = numer % denom;
                        return wrapper + w + '\\frac{' 
                            + (n * multiplier) + '}{' + (denom * multiplier)
                            + '}' + wrapper;
                    } else {
                        return wrapper + '\\frac{' 
                            + (numer * multiplier) + '}{' + (denom * multiplier)
                            + '}' + wrapper;
                    }
                } else if(options && options.getOrigDenom){
                    multiplier = origDenom / denom;
                    n = numer * multiplier;
                    return JSON.stringify([n, origDenom]);
                }
                return JSON.stringify([numer, denom]);
            },
            //WORK ON THIS
            getFrac(options){ //options:{mixed : bool, denom: int, origDenom: bool} 
                var n = numer, d = denom;
                if(options && options.denom){
                    if(isInt(options.denom / d)){
                        n *= (options.denom / d);
                        d = options.denom
                    } 
                }
                return [n, d];
            },
            add(n, getNew){
                n = getRationalNumber(n);
                var arr = n.getFrac();
                var otherNumer = arr[0];
                var otherDenom = arr[1];
                var tempNumer = (otherNumer * denom) + (numer * otherDenom);
                var tempDenom = denom * otherDenom;
                if(getNew){
                    return new PreMath.RationalNumber([tempNumer, tempDenom]);
                } else {
                    var d = gcd(tempNumer, tempDenom);
                    numer = tempNumer / d , denom = tempDenom / d;
                    return this;
                }
    
            },
            sub(n, getNew){
                n = getRationalNumber(n);
                var frac = n.getFrac();
                frac[0] *= -1;
                return this.add(frac, getNew);
            },
            times(n, getNew){       //WORK ON THIS
                return this;
            },
            divBy(n, getNew){       //WORK ON THIS
                return this;
            },
            getClass(n, getNew){
                return 'RationalNumber';
            },
            getInt(n, getNew){
                if(denom == 1) return numer;
            },
            isEqualTo(other){
                other = getRationalNumber(other);
                var otherFrac = other.getFrac();
                return (numer == 0 && otherFrac[0] == 0) || (numer == otherFrac[0] && denom == otherFrac[1]);
            },
            isGT(other, orEqualTo = false){ //greater than
                var otherFrac = getRationalNumber(other).getFrac();
                var thisN = numer * otherFrac[1];
                var otherN = otherFrac[0] * denom;
                return thisN > otherN || (orEqualTo && thisN == otherN);
            },
            isLT(other, orEqualTo = false){
                return !this.isGT(other, !orEqualTo);
            }
        }
    },
*/

if(!PM) var PM = PreMath;
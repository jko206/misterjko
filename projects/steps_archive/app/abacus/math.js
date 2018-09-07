// This JS file will contain all math ops. 

/*global MathJax*/

/* 
    Given two arrays of points of n-dimension, 
    returns the distance between them. 
    if one array is shorter than the other, the shorter
    one is filled with 0s and calculates the distance that way. 
    so if [1,2,3] and [1,2,3,3,4] is passed, the first array
    will be seen as [1,2,3,0,0]
    the distance between the two example points is 5 units
*/
function distanceBetween(a, b){
	if(a.toString() == b.toString()) return 0;
	// x_1^2 + x_2^2 + x_3^2 + ... + x_n^2 = c^2 
	// that's where I got c2
    var c2 = (function(){
    	var len = Math.max(a.length, b.length);
    	var total = 0; 
    	for(var i = 0; i < len; i++){
    		a[i] = a[i] ? a[i] : 0;
    		b[i] = b[i] ? b[i] : 0;
    		var diff = a[i] - b[i];
    		total += diff * diff;
    	}
    	return total;
    }());
    // prime factorize
    if(c2 == 0) return 0;
    //get prime numbers less than n;
    var aRootB = simplifyRadical(c2);
    return aRootB;
}


// returns an array of prime numbers less than n (400 by default)
function getPrimes(n = 1000){
    var arr = [];
    var nums = [];
    for(var i = 2; i <=n; i++){
        if(nums[i] === undefined){ //if prime number,
            //then mark all the multiples less <= n false;
            var k = 2; // can't mark itself as composite
            while(k*i <= n){
                nums[k*i] = false;
                k++;
            }
            // put nums[i] in primes;
            arr.push(i);
        }
    }
    return arr;
}


// Given a number, the function will return an array of prime factors
// in non-descending order
// primeFactorize(60) --> [2, 2, 3, 5]
function primeFactorize(num){
	//must initialize prime. Fresh list of prime numbers must be provided each use
	function primeFactorizationHelper(num, prime, primes, pFactors){
	    var dividend = num / prime;
	    if(num == 1){
	        return pFactors;
	    } else if(dividend == parseInt(dividend, 10)){ //num is divisible by prime
	        num = dividend;
	        pFactors.push(prime);
	        return primeFactorizationHelper(num, prime, primes, pFactors);
	    } else {
	        prime = primes.shift();
	        return primeFactorizationHelper(num, prime, primes, pFactors);
	    }
	}
    var primes = getPrimes(num);
    var prime = primes.shift();
	return primeFactorizationHelper(num, prime, primes, []);
}

// takes in an array of factors that are inside the sq. root sign
function simplifyRadical(n){
    var factors = primeFactorize(n);
    var a = 1;
    var b = 1;
    var last = 1;
    for(var i = 0; i < factors.length; i++){
        var current = factors[i];
        if(current == last){
            b /= current;
            a *= current;
            last = 1;
        } else {
            b *= current;
            last = current;
        }
    }
    return [a, b];
}

// returns random number such that a <= n < b
function randomBetween(a, b){
    var min = Math.min(a, b);
    var d = Math.abs(a - b);
    var r = Math.random() * d;
    return Math.floor(r) + min;
}

function isInt(x){
    return !isNaN(x) && x === Math.floor(x);
}

//PRE: a and b are non-zero integers
function gcd(a, b){
    function helper(a, b){
        if(!isInt(a) || !isInt(b)) throw new Error('Numbers must be integers.' + a + ', ' + b);
        if(a == 0 || b == 0) return 1;
        a = a < 0 ? -a : a;
        b = b < 0 ? -b : b;
        var min = Math.min(a,b);
        var max = Math.max(a,b);
        if(isInt(max/min)){
            return min;
        } else {
            var temp = max % min;
            return helper(min, temp);
        }
    }
    var args = Array.from(arguments);
    a = args[0];
    if(Array.isArray(a)) args = a;
    if(args.length < 2) throw new Error('gcd(a,b) requires at least two integers. a: ' + a + 'b: ' + b);
    a = args.shift();
    b = args.shift();
    var g = helper(a,b);
    while(args.length != 0){
        var next = args.shift();
        g = helper(g, next);
    }
    return g;
}

//PRE: a and b are integers
function gcf(a, b){
    return gcd(a,b);
}

//PRE: a and b are integers
function lcm(a, b){
    if(!isInt(a) || !isInt(b)) throw new Error('Numbers must be integers.' + a + ', ' + b);
    var args = Array.from(arguments);
    if(args.length < 2) throw new Error('lcm() needs at least two integers.' + args.length + ' args provided.');
    a = args[0];
    b = args[1];
    var l = a * b / gcd(a,b);
    while(args.length > 0){
        var next = args.shift();
        l = (l * next) / gcd(l, next);
    }
    return l;
}


// powersOf(2, 4) --> [2, 4, 8, 16]
// powersOf(5, 6) --> [5, 25, 125, 625, 3125, 15625]
function powersOf(base, maxExp){
    var arr = [];
    var temp = 1;
    for(var i = 1; i <= maxExp; i++){
        temp *= base;
        arr.push(temp);
    }
    return arr;
}

// returns a set, not array
function factors(x){
    var factors = new Set();
    function factorsOfHelper(x, pfactors){
        if(pfactors.length == 0){
            factors.add(x);
        } else {
            for(var i = 0; i < pfactors.length; i++){
                var multiplier = pfactors.splice(i,1)[0];
                console.log(pfactors);
                var product = x * multiplier;
                console.log('multiplier: '
                        + multiplier
                        + '\tpfactors: '
                        + pfactors 
                        + '\tfactors: '
                        + factors
                );
                factorsOfHelper(1, pfactors);
                factorsOfHelper(product, pfactors);
                pfactors.splice(i, 0, multiplier);
            }
        }
    }
    var primeFactors = primeFactorize(x);
    factorsOfHelper(1, primeFactors);
    return factors;
    
}

function primeFactors(x){
    var pfactors = primeFactorize(x);
    var arr = [];
    var last = 0;
    for(var i = 0; i < pfactors.length; i++){
        var n = pfactors[i];
        if(n != last){
            arr.push(n);
            last = n;
        }
    }
    return arr;
}

function renderMath(){
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

function getClass(obj) {
    if (typeof obj === "undefined") return "undefined";
    if (obj === null) return "null";
    return Object.prototype.toString.call(obj)
            .match(/^\[object\s(.*)\]$/)[1];
}

var PreMath = {
    primes: [],
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
        function reduce(){
            var g = gcd(numer, denom);
            numer /= g, denom /= g;
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
                if(getNew){
                    return (new PreMath.RationalNumber([numer,denom])).sub(n)
                } 
                n = getRationalNumber(n);
                var frac = n.getFrac();
                frac[0] *= -1;
                return this.add(frac, getNew);
            },
            times(n, getNew){       //WORK ON THIS
                if(getNew){
                    return (new PreMath.RationalNumber([numer,denom])).times(n)
                } 
                if(isInt(n)){
                    numer *= n;
                } else {
                    var frac = new PreMath.RationalNumber(n).getFrac();
                    numer *= frac[0], denom *= frac[1];
                }
                reduce();
                return this;
            },
            divBy(n, getNew){       //WORK ON THIS
                if(getNew){
                    return (new PreMath.RationalNumber([numer,denom])).divBy(n)
                }
                if(isInt(n)){
                    denom *= n;
                    reduce();
                } else {
                    var frac = new PreMath.RationalNumber(n).getFrac();
                    numer *= frac[1], denom *= frac[0];
                }
                return this;
            },
            getReciprocal(){
                return [denom, numer];  
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
            },
            value(){
                return numer / denom;
            },
            getDec(){
                return parseFloat(PreMath.getDecimal(numer, denom));
            }
        }
    },
    breakDown(n){
        
    },
    getDecimal(n, d, dec = 15, getJustDec = false){
    	var s = '';
    	if(!getJustDec){
    	    var whole = Math.floor(n / d);
    	    s += whole + '.';
    	} 
    	var n = n % d;
    	while(dec > 0 && n != 0){
    		s += Math.floor((n * 10) / d);
    		n = (n * 10) % d;
    		dec--;
        }
    	return s;
    },
    /*options:
        type:
            -type1 (default): a <= r <= b
            -type2: a < r < b
            -type3: a <= r < b
            -type4: a < r <= b
        decimalDigits (int)
        fraction(int): returns a fraction with given denominator
    */
    getRandomBetween(a, b, options){
        if(!a) throw new Error('Valid number must be passed. a: ' + a);
        if(!b) throw new Error('Valid number must be passed. b: ' + b);
        var min = a < b ? a : b;
        var max = min == b ? a : b;
        var range = (max - min);
        var type2 = options && options.hasOwnProperty('type') && options.type == 2;
        var type3 = options && options.hasOwnProperty('type') && options.type == 3;
        var type4 = options && options.hasOwnProperty('type') && options.type == 4;
        if(type2) range--;
        var r = Math.random() * range;
        if(type2) return Math.round(r) + min + 1;
        else if(type3) return Math.floor(r) + min;
        else if(type4) return Math.ceil(r) + min;
        else return Math.round(r) + min;
    },
    // PRE: 1 < n <= 36;
    decToBaseN(x, n, soFar = ''){
        if(x == 0) return soFar;
        var temp = Math.floor(x / n);
        var digit = x%n;
        if(digit >= 10){
            var i = digit - 10;
            digit = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
                'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
                'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
            ][i];
        }
        return this.decToBaseN(temp, n, '' + digit + soFar);
    },
    baseNToDec(x, n){
        return parseInt(x, n);
    },
    //////////////// PRIME NUMBER STUFF //////////////////
    
    getRandomPrimeBetween(a,b){
        if(!a || a < 2) a = 2;
        if(!b) b = this.primes[this.primes.length - 1]; // last element
        if(this.primes.length == 0 || b > this.primes.length) this.makePrimes(b);
        var n = -1;
        while(n < a || n > b){
            var i = Math.round(Math.random() * this.primes.length);
            var n = this.primes[i];
        }
        return n;
    },
    //PRE: valid input provided
    getPrimesBetween(a, b){ //work on this
        var arr = [];
        for(var i = 0; i < this.primes.length; i++){
            var p = this.primes[i];
            if(p > a && p < b) arr.push(p);
        }
        return arr;
    },
    makePrimes(n = 100000){
        var i = this.primes.length == 0 ? 2 : this.primes[this.primes.length -1 ];
        var nums = [];
        for(; i <=n; i++){
            if(nums[i] === undefined){ //if prime number,
                //then mark all the multiples <= n false;
                var k = 2; // can't mark itself as composite
                while(k*i <= n){
                    nums[k*i] = false;
                    k++;
                }
                // put nums[i] in primes;
                this.primes.push(i);
            }
        }
    },
    isPrime(n){
        var lastPrime = this.prime ? this.primes[this.primes.length - 1] : 2;
        if(n > lastPrime) this.makePrimes(n);
        return this.primes.indexOf(n) != -1;
    },
    
    powersOf(base, maxExp){
        var arr = [];
        var temp = 1;
        for(var i = 1; i <= maxExp; i++){
            temp *= base;
            arr.push(temp);
        }
        return arr;
    }
};



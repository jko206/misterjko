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
    if(isNaN(x)){
        console.log(x);
        return false;
    } 
    return x === Math.floor(x);
}

//PRE: a and b are non-zero integers
function gcd(a, b){
    if(isNaN(a)) throw new Error(a + ' is NaN');
    if(isNaN(b)) throw new Error(a + ' is NaN');
    a = a < 0 ? -a : a;
    b = b < 0 ? -b : b;
    var min = Math.min(a,b);
    var max = Math.max(a,b);
    if(isInt(max/min)){
        return min;
    } else {
        var temp = max % min;
        return gcd(min, temp);
    }
}

//PRE: a and b are integers
function gcf(a, b){
    if(!isInt(a) || !isInt(b)) throw new Error('Numbers must be integers.');
    return gcd(a,b);
}

//PRE: a and b are integers
function lcm(a, b){
    if(!isInt(a) || !isInt(b)) throw new Error('Numbers must be integers.');
    var g = gcd(a,b);
    return a * b / g;
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
    console.log(pfactors);
    var arr = [];
    var last = 0;
    for(var i = 0; i < pfactors.length; i++){
        var n = pfactors[i];
        console.log('n: ' + n + '\tlast: '+ last);
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


// be able to create a number from number of factors. 
//makeCompositeFrom([p1, p2, p3, ... px], [exp1, exp2, exp3, ...])

/************************************************/
/************************************************/
/******************FRACTIONS*********************/
/************************************************/
/************************************************/
//unless otherwise noted, any arguments passed as a fraction
// must be of the form [(w)hole, (n)umer, (d)enom]
//
function fracAdd(a, b){
    a = fracToImproper(a);
    b = fracToImproper(b);
    var d1 = a[2], d2 = b[2];
    var d = lcm(d1, d2);
    var fracs = fracSetDenom(d, a, d);
    a = fracs[0];
    b = fracs[1];
    var n = a[1] + b[1];
    var frac = fracToMixedFrac([0, n, d]);
    return fracSimplify(frac);
    
}

function fracSetDenom(d){
    var fracs = [];
    for(var i = 1; i < arguments.length; i++){
        var frac = arguments[i];
        var w = frac[0], n = frac[1], d = frac[2];
        var multiplier = d / n;
        if(!isInt(multiplier)){
            throw new Error('Fraction ' + frac 
                    + ' cannot have ' + d + ' as denominator');
        }
        n *= multiplier;
        fracs.push([w, n, d]);
    }
    return fracs.length == 1 ? fracs[0] : fracs;
}

function fracToImproper(a){
    var w = a[0], n = a[1], d = a[2];
    return fracSimplify([0, n + w*d, d]);
}

function fracToMixedFrac(a){
    var w = a[0], n = a[1], d = a[2];
    w += Math.floor(n/d);
    n %= d;
    return fracSimplify([w, n, d]);
}


//PRE: a is an array of either [whole, numer, denom]
//      or [numer, denom]
function fracSimplify(a, toMixedNum = false){
    if(a.length == 2){
        var w = 0, n = a[0], d = a[1];
    } else if(a.length == 3){
        w = a[0], n = a[1], d = a[2];
        n += w*d;
    } else {
        //throw argument;
    }
    if(d == 0) throw new Error('Denominator cannot be 0');
    while((d != 0 && !isInt(d)) || (n != 0 && !isInt(n))){
        n *= 10;
        d *= 10;
    }
    if(n == 0){
        return toMixedNum ? [0, 0, n] : [0, n];
    } else {
        var g = gcd(n, d);
        n /= g;
        d /= g;
        return toMixedNum ? [Math.floor(n/d), n%d, d] : [n,d];
    }
}

function fracToMathJax(a, wrap = '$'){
    var w = a[0] == 0 ? '' : a[0], n = a[1], d = a[2];
    return wrap + w + '\\frac{' + n + '}{' + d + '}' + wrap;
}

function RationalNumber(){
    var denom = 1;
    var numer = 1;
    var global = this;
    var isInitialized = false;
    this.init = function(x){
        if(isInitialized) throw new Error('This number is already initialized');
        if(x.constructor.name == 'RationalNumber'){
            var frac = x.getFrac();
            numer = frac[0];
            denom = frac[1];
            isInitialized = true;
            return global;
        } else if(x instanceof Array){
            if(x.length == 1){
                if(isNaN(x[0])) throw new Error('['+x+']' + ' does not have valid elements');
                numer = n[0];
                isInitialized = true;
                return global;
            } else if(x.length == 2){
                if(isNaN(x[0]) || isNaN(x[1])) throw new Error('['+x+']' + ' does not have valid elements');
                n = x[0];
                d = x[1];
                frac = fracSimplify([n, d]);
                numer = frac[0];
                denom = frac[1];
                isInitialized = true;
                return global;
            } else if(x.length == 3){
                if(isNaN(x[0]) || isNaN(x[1]) || (isNaN(x[2]) && x[2] != 'r')) 
                    throw new Error('['+x+']' + ' does not have valid elements');
                if(x[2] == 'r'){
                    //then repeating decimal
                    console.log('static: \t' + x[0]);
                    console.log('repeating:\t' + x[1]);
                } else {
                    var w = x[0];
                    var n = x[1];
                    var d = x[2];
                    frac = fracSimplify([w, n, d]);
                    numer = frac[0];
                    denom = frac[1];
                }
                isInitialized = true;
                return global;
            } else {
                throw new Error('['+x+']' + ' is not a correct format');
            }
        } else if(isNaN(x)){
            throw new Error(x + ' cannot initialize RationalNumber');
        } else if(isInt(x)){
            numer = x;
            isInitialized = true;
            return global;
        } else {
            d = 1;
            frac = fracSimplify([x, d]);
            numer = frac[0];
            denom = frac[1];
            isInitialized = true;
            return global;
        }
    };
    /************************
        private methods
    *************************/

    var repeatingDecToFrac = function(arr){
        
    }
    /************************
        public methods
    *************************/
    this.add = function(o){
        var other = new RationalNumber;
        other.init(o);
        var otherFrac = other.getFrac();
        var n1 = otherFrac[0], n2 = numer;
        var d1 = otherFrac[1], d2 = denom;
        var n = n1*d2 + n2*d1;
        var d = d1*d2;
        var frac = fracSimplify([n,d]);
        numer = frac[0];
        denom = frac[1];
        return global;
    };
    
    this.subtract = function(o){
        var other = new RationalNumber;
        other.init(o);
        var otherFrac = other.getFrac();
        var n1 = otherFrac[0], n2 = numer;
        var d1 = otherFrac[1], d2 = denom;
        var n = n1*d2 - n2*d1;
        var d = d1*d2;
        var frac = fracSimplify([n,d]);
        numer = frac[0];
        denom = frac[1];
        return global;
    };
    
    this.multiply = function(o){};
    this.divideBy = function(o){};
    
    var getFrac = this.getFrac = function(options){
        var n = numer;
        var d = denom;
        if(options && options.denom){
            var newDenom = options.denom;
            var multiplier = newDenom / d;
            n *= multiplier;
            d = newDenom;
        }
        if(options && options.format == 'mixed'){
            var whole = Math.floor(numer / denom);
            var n = n%d;
            return [whole, n, d];
        }
        return [n, d];
    };
    
    this.toMathJax = function(format = 'frac', wrapper = ''){
        if(denom == 1) return wrapper + numer + wrapper;
        else if(format == 'frac') 
            return wrapper + '\\frac{' + numer +'}{' + denom + '}' + wrapper;
        else if(format == 'mixed'){
            var whole = Math.floor(numer/denom);
            whole = whole == 0 ? '' : whole;
            return wrapper + whole + '\\frac{' + (numer%denom)
                    +'}{' + denom + '}' + wrapper;
        } else if(format == 'decimal'){
            
        }
    };
    var isTermDecimal = this.isTermDecimal = function(){
        var pFactors = primeFactorize(denom);
        for(var i = 0; i < pFactors.length; i++){
            if(!(pFactors[i] == 2 || pFactors[i] == 5)) return false;
        }
        return true;
    }
    
    this.isRepeatDecimal = function(){
        return !isTermDecimal();
    }
    
    //////////////////////////////work on this ////////////////////////////////
    this.toString = function(){
        return '[' + getFrac() + ']';
    };
}

function getClass(obj) {
    if (typeof obj === "undefined") return "undefined";
    if (obj === null) return "null";
    return Object.prototype.toString.call(obj)
            .match(/^\[object\s(.*)\]$/)[1];
}
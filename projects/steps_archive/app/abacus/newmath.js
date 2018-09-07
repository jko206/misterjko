// This JS file will contain all math ops. 

/*global MathJax Utility*/


var PreMath = {};
/* 
    Given two arrays of points of n-dimension, 
    returns the distance between them. 
    if one array is shorter than the other, the shorter
    one is filled with 0s and calculates the distance that way. 
    so if [1,2,3] and [1,2,3,3,4] is passed, the first array
    will be seen as [1,2,3,0,0]
    the distance between the two example points is 5 units
*/
PreMath.distBetween = function distanceBetween(a, b){
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
    var aRootB = this.simplifyRad(c2);
    return aRootB;
};

// returns an array of prime numbers less than n (400 by default)
PreMath.getPrimes = function getPrimes(n = 1000){
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


// takes in an array of factors that are inside the sq. root sign
PreMath.simplifyRad = function simplifyRadi(n){
    var factors = this.primeFactorize(n);
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
PreMath.randomBetween = function randomBetween(a, b){
    var min = Math.min(a, b);
    var d = Math.abs(a - b);
    var r = Math.random() * d;
    return Math.floor(r) + min;
}

PreMath.isInt = function isInt(x){
    return !isNaN(x) && x == Math.floor(x);
}

//PRE: a and b are integers
PreMath.gcd = function gcd(a, b){
    function helper(a, b){
        if(!PreMath.isInt(a) || !PreMath.isInt(b)) throw new Error('Invalid value a: ' + a + ', b: ' + b);
        if(a == 0 || b == 0) return 1;
        if(a == b) return a;
        var min = a < b ? a : b;
        var max = a > b ? a : b;
        var mod = max%min;
        if(mod == 0) return min;
        return helper(min, mod);
    }
    if(arguments.length < 2) throw new Error('PreMath.gcd expects at least 2 arguments');
    else if(arguments.length == 2){
        var list = [a,b];
    } else {
        list = Array.prototype.slice.call(arguments);
    }
    
    while(list.length > 1){
        a = list.shift();
        b = list.shift();
        a = (a < 0 ? -a : a);
        b = (b < 0 ? -b : b);
        var g = helper(a, b);
        list.push(g);
    }
    return list[0];
}

//PRE: a and b are integers
PreMath.gcf = function gcf(a, b){
    return this.gcd.apply(this, arguments);
}

//PRE: a and b are integers
PreMath.lcm = function lcm(a, b){
    if(arguments.length < 2) throw new Error('PreMath.gcd expects at least 2 arguments');
    else if(arguments.length == 2){
        var list = [a,b];
    } else {
        list = Array.prototype.slice.call(arguments);
    }
    
    while(list.length > 1){
        a = list.shift();
        b = list.shift();
        var g = this.gcf(a, b);
        list.push(a * b / g);
    }
    return list[0];
}


/* powersOf(2, 4) --> [1, 2, 4, 8, 16]
 * powersOf(5, 6) --> [1, 5, 25, 125, 625, 3125, 15625]
 */
PreMath.powersOf = function powersOf(base, maxExp, hasDeg0){
    var arr = hasDeg0 ? [1] : [];
    var temp = 1;
    for(var i = 1; i <= maxExp; i++){
        temp *= base;
        arr.push(temp);
    }
    return arr;
}

PreMath.primeNumsLimit;

PreMath.primeNums = [];
/*
      mode
    default: primeFactors(180) --> [2, 2, 3, 3, 5]
    1      : primeFactors(180, 1) --> [[2,2],[3,2],[5,1]] (has count of each prime)
    2      : primeFactors(180, 2) --> [2, 3, 5]    (has just the primes with no counts)
*/
PreMath.primeFactors = function (x, mode){
    var condensed = mode == 1 || mode == 2;
    var justPrimes = mode == 2;
    if(!this.isInt(x)) throw new Error(`x must be an integer. ${x} passed.`);
    x = x < 0 ? -x : x;
    if(!(this.primeNumsLimit && this.primeNumsLimit >= x))
        PreMath.primeNums = this.getPrimes(x);
    var primes = PreMath.primeNums.clone();

    var p = primes.shift();
    var miniArr = [p, 0];
    var pf = []; // prime factors
    while(x > 1){
        var temp = x / p;
        if(this.isInt(temp)){
            if(condensed) miniArr[1]++;  
            else pf.push(p);
            x = temp;
        } else {
            p = primes.shift();
            if(condensed){
                if(miniArr[1] > 0) pf.push(miniArr);
                miniArr = [p, 0];
            }
        }
    }
    if(condensed && miniArr[1] > 0) pf.push(miniArr);
    if(justPrimes){
        temp = [];
        while(pf.length){
            var m = pf.shift()
            temp.push(m[0]);
        }
        pf = temp;
    }
    return pf.sort(function(a,b){return a < b ? -1 : 1;});
};

// returns a set, not array
PreMath.factors = function factors(x){
    var pf = this.primeFactors(x, 1);
    var setOfPows = [];
    pf.forEach(function(elem){
       var powers = PreMath.powersOf(elem[0], elem[1]);
       setOfPows.push(powers);
    });
    var f = [1];
    while(setOfPows.length){
        var currSet = setOfPows.shift(); 
        var length = f.length;
        while(currSet.length){
            var multiplier = currSet.shift();
            for(var i = 0; i < length; i++){
                var prod = multiplier * f[i];
                f.push(prod);
            }
        }
    }
    return f.sort(function(a, b){
    	return a < b ? -1 : 1;
    });
};

PreMath.renderMathJax = function renderMath(){
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

PreMath.reduceFrac = function reduceFrac(n, d){
    var g = this.gcd(n, d);
    return [n/g, d/g];
}

//PRE: n and d must be integers
PreMath.getDecimal = function(n, d, dec = 15, getJustDec = false){
    var isNeg = n < 0;
    n = n  * (isNeg ? -1 : 1);
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
	return (isNeg ? '-' : '') + s;
}

/***************** RATIONAL NUMBER *****************/
/*
    can't do:
    var n = new PreMath.RationalNumber('1176.4705882352941176', 16)
    It's supposed to be 2000/17;
*/
PreMath.RationalNumber = function RationalNumber(x, repNDigits, reduceFrac = true, base = 10){
    this.numer = 0, this.denom = 1;
    var filler = (seed = '', toRep, times) => {
        while(times){
            seed += toRep;
            times--;
        }
        return seed;
    }
    var addFrac = this.addFrac = (n, d) => {
        if(this.denom == d){
            this.numer += n;
            return;
        }
        let newD = this.denom * d;
        let n1 = this.numer * d;
        let n2 = n * this.denom;
        if(reduceFrac){
            let frac = PreMath.reduceFrac(n1 + n2, newD);
            this.numer = frac[0], this.denom  = frac[1];
        } else {
            this.numer = n1 + n2, this.denom  = newD;
        }
    }
    /*****************HELPER FUNCTIONS******************/
    if(x && x.getFrac){
        var frac = x.getFrac();
        this.numer = frac[0], this.denom = frac[1];
        return;
    } else if(x === undefined){
        this.numer = 0, this.denom = 1;
        return;
    }
    x += '';
    x = x.trim();
    var isNeg = x[0] == '-';
    if(isNeg) x = x.substring(1);
    // separate non-frac from frac
    if(x.indexOf('/') != -1){
        //process frac
        if(x.indexOf(' ') != -1){
            var temp = x.split(' ');
            var nonFrac = temp[0];
            frac = temp[1];
        } else {
            frac = x;
        }
        temp = frac.split('/');
        var tempN = parseInt(temp[0]);
        var tempD = parseInt(temp[1]);
        if(reduceFrac){
            
            if(reduceFrac) frac = PreMath.reduceFrac(tempN, tempD);
            this.numer = frac[0];
            this.denom = frac[1];
        } else {
            this.numer = tempN;
            this.denom = tempD;
        }
    } else {
        nonFrac = x;
    }

    if(nonFrac){
        //separate dec from int
        if(nonFrac.indexOf('.') != -1 && nonFrac.indexOf('.') != x.length - 1 ){ // has decimal, but it's not like "123."
            temp = nonFrac.split('.');
            var intr = temp[0]; // intr = integer, since int is a reserved word
            var dec = temp[1];
            //process decimal
            if(repNDigits){
                var nonRepLength = dec.length - repNDigits;
                var repDigits = dec.substr(nonRepLength);
                var nonRepDigits = dec.substr(0, nonRepLength);
                
                tempN = parseInt(repDigits, base);
                tempD = parseInt(filler('', '9', repNDigits), base);
                tempD *= Math.pow(10, nonRepLength);
                
                addFrac(tempN, tempD);
            } else {
                nonRepDigits = dec;
                nonRepLength = (dec + '').length;
            }
            tempN = nonRepDigits;
            tempD = Math.pow(10, nonRepLength);
            addFrac(tempN, tempD);
        } 
        intr = parseInt(nonFrac);
        addFrac(intr, 1);
    }
    this.numer *= (isNeg ? -1 : 1);
}

PreMath.RationalNumber.prototype.getClass = function(){
    return 'RationalNumber';
}

PreMath.RationalNumber.prototype.constructor = PreMath.RationalNumber;
//options is an array of strings
//['isMixed', 'any number', 'toMathJax']
PreMath.RationalNumber.prototype.getFrac = function(options){
    if(!options)return [this.numer, this.denom];
    if(Utility.getClass(options) != 'Array') options = Array.from(arguments);
    options = options.toLowerCase();
    var isMixed = options.contains('mixed', true);
    var toMathJax = options.contains('mathjax', true);
    var setDenom = options.contains('setdenom', true);
    var n = this.numer, d = this.denom;
    if(setDenom){
        var newD = setDenom.input.match(/[0-9]/)[0] * 1;
        if(PreMath.isInt(newD / d)) n *= (newD / d), d = newD;
    }
    if(isMixed){
        var w = Math.floor(n / d);
        n %= d;
    }
    if(toMathJax) return `${(w ? w : '')}\\frac{${n}}{${d}}`;
    return (w ? [w, n, d] : [n, d]);
}

PreMath.RationalNumber.prototype.getDec = function(options){
    if(!options) return this.value();
    if(Utility.getClass(options) != 'Array') options = Array.from(arguments);
    options = options.toLowerCase();
    var toMathJax = options.contains('mathjax', true);
    var decLength = options.contains('declength', true);
    var wrapper = options.contains('wrapper', true);
    var n = this.numer, d = this.denom;
    if(decLength){
        var length = decLength.input.split(' ')[1] * 1;
        return PreMath.getDecimal(this.numer, this.denom, length);
    }
    if(toMathJax){
        var decimal = PreMath.getDecimal(this.numer, this.denom, 200);
        wrapper = wrapper ? wrapper.input.split(' ')[1] : '';
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
    }
}

PreMath.RationalNumber.prototype.plus = function(x, repNDigits, getNew){
    var o = getNew ? new PreMath.RationalNumber(`${this.numer}/${this.denom}`)
        : this;
    if(PreMath.isInt(x)) var n = x, d = 1;
    else {
        x = new PreMath.RationalNumber(x, repNDigits);
        var frac = x.getFrac();
        n = frac[0], d = frac[1];
    }
    o.addFrac(n, d);
    return o;
}

PreMath.RationalNumber.prototype.minus = function(x, repNDigits, getNew){
    if(typeof x == 'number') x = -x;
    else if(typeof x == 'string'){
        if(x[0] == '-') x = x.substr(1);
        else x = '-' + x;
        x = new PreMath.RationalNumber(x, repNDigits);
    }
    return this.plus(x, repNDigits, getNew);
}

PreMath.RationalNumber.prototype.times = function(x, repNDigits, getNew){
    var o = getNew ? new PreMath.RationalNumber(`${this.numer}/${this.denom}`)
        : this;    
    if(PreMath.isInt(x)) o.numer *= x;
    else {
        x = new PreMath.RationalNumber(x, repNDigits);
        var frac = x.getFrac();
        o.numer *= frac[0], o.denom *= frac[1];
    }
    frac = PreMath.reduceFrac(o.numer, o.denom);
    o.numer = frac[0], o.denom = frac[1];
    return o;
}

PreMath.RationalNumber.prototype.divBy = function(x, repNDigits, getNew){
    var o = getNew ? new PreMath.RationalNumber(`${this.numer}/${this.denom}`)
        : this;    
    if(PreMath.isInt(x)) o.denom *= x;
    else {
        x = new PreMath.RationalNumber(x, repNDigits);
        var frac = x.getFrac();
        o.numer *= frac[1], o.denom *= frac[0];
    }
    frac = PreMath.reduceFrac(o.numer, o.denom);
    o.numer = frac[0], o.denom = frac[1];
    return o;
}

PreMath.RationalNumber.prototype.square = function(getNew){
    return this.toNPower(2, getNew);
}

// i must be an int
PreMath.RationalNumber.prototype.toNPower = function(i, getNew){
    var n = this.numer, d = this.denom;
    var o = getNew ? new PreMath.RationalNumber(`${n}/${d}`) : this;
    o.numer = Math.pow(n, i);
    o.denom = Math.pow(d, i);
    return o;
}

//toDecimal must be able to show trailing or leading 0s
PreMath.RationalNumber.prototype.toString = function(options){
    if(options && options.contains('getDec')){
        return this.getDec();
    } else {
        return this.getFrac(options);
    }
};

PreMath.RationalNumber.prototype.valueOf = function(){
    return this.getDec();
}

PreMath.RationalNumber.prototype.isEqualTo = function(other){
    if(!other.getFrac) other = new PreMath.RationalNumber(other);
    return this.numer == other.numer && this.denom == other.denom;
}

PreMath.RationalNumber.prototype.isGT = function(other){
    if(!other.getFrac) other = new PreMath.RationalNumber(other);
    var n1 = this.numer, d1 = this.denom, n2 = other.numer, d2 = other.denom;
    return n1 * d2 > n2 * d1;
}

PreMath.RationalNumber.prototype.isGTE = function(other){
    return this.isEqualTo(other) || this.isGT(other);
}

PreMath.RationalNumber.prototype.isLT = function(other){
    return !this.isGTE(other);
}

PreMath.RationalNumber.prototype.isLTE = function(other){
    return !this.isGT(other);
}

//is this rational number a terminating decimal?
PreMath.RationalNumber.prototype.isTermDec = function(){
    var pf = PreMath.primeFactors(this.denom, 2);
    return (this.denom == 1) ||
            (pf.length == 2 && pf[0] == 2 && pf[1] == 5) ||
            (pf.length == 1 && (pf[0] == 2 || pf[0] == 5));
}

//is this rational number a repeating decimal?
PreMath.RationalNumber.prototype.isRepDec = function(){
    return !this.isTermDec();   
}

PreMath.RationalNumber.prototype.value = function(){
    var isNeg = this.numer < 0;
    var n = this.numer * (isNeg ? -1 : 1);
    return parseFloat(PreMath.getDecimal(n, this.denom)) * (isNeg ? -1 : 1);
}

/* Example of how 123.45 breaks down
/*               
 *  digit   : 1     2       3       4       5
 *  base    : 10    10      10      10      10
 *  unit    : 100   10      1       0.1     0.01
 *  level   : 2     1       0       -1      -2
 *
 *  Example of how 123 4/5 breaks down       
 *  digit   : 1     2       3       4
 *  base    : 10    10      10      5
 *  unit    : 100   10      1       '1/5'
 *  level   : 2     1       0       'f'
 */

PreMath.RationalNumber.prototype.breakdown = function(getFrac){
    
    var levelAdj = 0, unitAdj = 1, newD = 1, d = this.denom;
    if(this.isRepDec() || getFrac){
        var v = parseInt(this.numer / this.denom);
        var n = this.numer%this.denom
    } else {
        while(!PreMath.isInt(newD / d)){
            newD *= 10;
            levelAdj++;
            unitAdj *= 10;
        }
        v = (newD / d) * this.numer;
    }
    var arr = (v + '').split('');
    var length = arr.length;
    arr.forEach(function(elem, i, thisArr){
        var digit = parseInt(elem);
        var level = length - 1 - i - levelAdj;
        var base = 10;
        var unit = Math.pow(base, level);
        thisArr[i] = {digit, base, unit, level};
    });
    if(n){
        arr.push({
            digit: n,
            level: 'f',
            base: d,
            unit: '1/' + d
        })
    }
    return arr;
}



/****
var decimal = getDecimal(2000, 17, 400); toMathJax = true; wrapper = '';
console.log('here', toMathJax);
(function(){
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
}())
                    	//return [decimal, pattern, i];}

"117.\overline{647058823529411}"

****/


/*
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
    ///////
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


*/
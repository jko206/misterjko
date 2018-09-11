/* global isInt*/

/**
 * Array operations
 * */

Array.prototype.sortByValue = function(){
	this.sort(function sortByValue(a, b){
		if(isInt(a) && isInt(b)) return a - b;
		if(!isInt(a) && isInt(b)) return 1;
		if(isInt(a) && !isInt(b)) return -1;
		let arr = [a, b].sort();
		if(Object.is(arr[0], b)) return -1;
		else return 1;
	});
}

// Shifts all elements to right by equal amount by
// multiple of width so that the smallest index >= 0
Array.prototype.shiftToPositiveIndices = function(multiplesOf = 1){
	if(isNaN(multiplesOf) && multiplesOf != parseInt(multiplesOf)) 
		throw new Error(`Array can only shift by integer values. '${multiplesOf}' passed.`)
	let leastIndex = (()=>{
		let keys = Object.getOwnPropertyNames(this);
		keys.sortByValue();
		return parseInt(keys[0]);
	})();
	let shiftBy = multiplesOf == 1 ? leastIndex : (()=>{
		let total = 0;
		while( leastIndex < 0){
			leastIndex += multiplesOf;
			total += multiplesOf;
		}
		return total;
	})();
	this.shiftIndicesBy(shiftBy);
}

Array.prototype.hasOnlyIntKeys = function(){
	let keys = Object.getOwnPropertyNames(this);
	for(let i = 0; i < keys.length; i++){
		let key = keys[i];
		if(!isInt(key) && key != 'length') return false;
	}
	return true;
}

Array.prototype.shiftIndicesBy = function(n){
	if(isNaN(n) || !isInt(n)) 
		throw new Error('Value needs to be an integer. '+n+' passed.');
	else if(n == 0) return;
	let keys = Object.getOwnPropertyNames(this)
	keys.sortByValue();
	for(let i = keys.length - 2; i >= 0; i--){
		let key = parseInt(keys[i]);
		let elem = this[key];
		delete this[key];
		this[key + n] = elem;
	}
}

Array.prototype.widenBy = function(n, currWidth){
	let emptyArray = [];
	emptyArray.length = 3;
	for(let i = currWidth; i < this.length; i += currWidth+n){
		this.splice(i, 0, ...emptyArray);
	}
}

Array.prototype.trimSides = function(){
	
}

Array.prototype.reverse = function(){
	let arr = []; 
	while(this.length) arr.push(this.pop());
	while(arr.length) this.push(arr.shift());
}

// the idx is 0 based from the back
Array.prototype.peek = function(idx = 0){
	return this[this.length - 1 - idx];
}

Array.prototype.has = function(elem){
	return this.indexOf(elem) != -1;
}

///////////////////////////////////////////////////////////////
String.prototype.has = function(substring, strict){
	if(strict){
		return this.indexOf(substring) != -1;
	} else {
		return this.toLowerCase().indexOf(substring.toLowerCase()) != -1;
	}
}


/**
 * All the Set operations return a new set
 * In all Set operations, `s` is the other set
 * */

Set.prototype.union = function(s){
	let newSet = new Set();
	this.forEach(function(e){
		newSet.add(e);	
	});
	s.forEach(function(e){
		newSet.add(e);
	});
	return newSet;
}

Set.prototype.difference  = function(s){
	let newSet = new Set();
	this.forEach(function(e){
		if(!s.has(e)) newSet.add(e);
	});
	return newSet;
}

Set.prototype.intersection = function(s){
	let newSet = new Set();
	this.forEach(function(e){
		if(s.has(e)) newSet.add(e);
	});
	return newSet;
}



//Cloning ops of Object, Array, and Function
Object.prototype.clone = function(deepClone = true){
	let isArray = this instanceof Array;
	let obj = isArray? [] : {};
	Object.assign(obj, this);
	return obj;
};


Array.prototype.clone = function(deepClone = true){
	let other = [];
	this.forEach(function(e, i, arr){
		if(e instanceof Object || e instanceof Array || e instanceof Function) e = e.clone(true);
		other[i] = e;
	});
	return other;
};

Array.prototype.getSet = function(){
	let s = new Set(), clone = this.clone();
	while(clone.length){
		let elt = clone.shift();
		s.add(elt);
	}
	return s;
}

Function.prototype.clone = function() {
    var that = this;
    var temp = function () { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};


//TODO: WORK ON THESE

Array.prototype.isSameAs = function(other){
	for(let i = 0; this.length; i++){
		if(this[i] != other[i]) return false;
	}
	return this.length == other.length;
};

Array.prototype.hasSameElementsAs = function(other){
	let sortedArray = this.clone().sort();
	other.sort();
	for(let i = 0; i < sortedArray.length; i++){
		if(sortedArray[i] != other[i]) return false;
	}
	return sortedArray.length == other.length;
};

//returns a new array with elements from index 
// a to b in this array
Array.prototype.getChunk = function(a, b){
	let other = [];
	for(let i = a; i <= b; i++){
		other.push(this[i].clone());
	}
	return other;
}

Number.prototype.clone = function(){
	return this.valueOf();
}

String.prototype.clone = function(){
	return this.toString();
}

let handBrake = function(limit){
	return (function(){
		let count = 0;
		return function(){
			count++;
			return count < limit;
        }
    }());
};
/* global $


 * This program, given a set of words, will generate either crossword puzzle or wordsearch
 * The comments will written as if 'apple', 'banana', 'orange', and 'carrot' have been 
 * passed as arguments
 */
 
 
 /**
  * **********Be able to combine discrete sets into one. 
  * 
  * Symbols:
  * 	- * : blank
  * 	- -: blocked
  * 
  * Directions: 
  * 		7	0   1
  * 		6	*	2
  * 		5	4	3
  * '*' to a number is the direction. For example left to right would be 2, 
  * and top right to bottom left would be 5
  * 
  * 
  * Returns answer key for either crossword puzzle or word search
  * allowDiagonal 
  * allowBackwards
  */

function getPuzzles(wordsAndDef, options){
	function get36BasedNumber(n){
		let digits = [
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
			'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
			'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
		];
		let str = '', base = digits.length;
		while(n >= base){
			let digit = digits[n % base];
			str = digit + str;
			n = Math.floor(n / base);
		}
		let digit = digits[n];
		str = digit + str;
		return str;
	}
	
	/** function checks whether all the elements have valid
	 *	characters based on the character set passed.
	 *	If it has definitions, it creates definition objects
	 *  that can be linked back to the word later after puzzles are made
	 * */
	function processedInput(wordsAndDef){
		// THROWS: invalid character error
		function getValidChar(word, charSet = 'alphabets'){
			if(charSet == 'alphabets'){
				// Convert the word to uppercase and rid of whitespace
				let word = word.replace(/\s/g, '').toUpperCase();
				if(/^(\w)+$/.test(word)) 
					throw new Error(`Invalid character found in "${word}.`);
				return words;
			} else if(charSet == 'numbers'){
				
			}
				
		}
		
		function getLetterSet(word){
			let wordSet = new Set();
			let letters = word.split('');
			letters.forEach(function(e, i, arr){
				wordSet.put(e);	
			});
			return letters;
		}
		
		let wordObjs = [], defObjs = [];
		wordsAndDef.forEach(function(e, i, arr){
			let {word, def} = e;
			try{
				word = getValidChar(word);
				let wordObj = {
					id: i,
					letterSet: getLetterSet(word),
				}
				let defObj = {
					def, 
					id: i
				}
				wordObjs.push(wordObj);
				defObjs.push(defObj);
			} catch(e){
				$('#crossword-submission-msg').text(e.message);
			}
		});
		
		return {wordObjs, defObjs};
	}
	
	// Process the words
	let processInput = processedInput(wordsAndDef);
	let {wordObjs, defObjs} = processInput;
	
	// Make puzzle pieces with the words 
}

let isInt = (n) =>{
	return !isNaN(n) && n == parseInt(n);
};
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
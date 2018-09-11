/**SuperSet
 * A SuperSet object do set operations with subsets of a given set. For example
 * a set might be a collection of names, numbers, or indices. 
 * 
 * Each element of the set is given a number based on the order its entered, 
 * or an index that's passed as an array. The given the number n, it will be 
 * assigned an ID that consists value two values:
 *														Example: 492
 *	-Block number (blocknum): Math.floor(n/31)				15
 *  -Binary value (bival)   : n%31							
 *  -ID						: (blocknum)(bival)
 * 
 * This way, no two different subsets can have the same sum of bivals. 
 * For instance, let's set the following letters are assigned bivals
 * based on their index:
 *	Index		0	1	2	3	4	5
 *	letter		a	b	c	d	e	f
 *	Bival		1	2	4	8	16	32
 * 
 * We see that bivals of 'd' and 'e' add up to 24. Barring any subsets with 
 * duplicates (e.g. 'ddcc'), no other subsets' bivals can add up to 24.
 * That's because when converted to binary, the numbers are like marking
 * a position of an array as true.
 * 
 * If we transpose the table above and write the bivals as binary, it becomes
 * clearer:
 *		Index	Letter	Bival
 *		  0		   a	  000001
 *		  1		   b	  000010
 *		  2 	   c	  000100
 *		  3		   d	  001000
 *		  4		   e	  010000
 *		  5		   f	  100000
 * 
 * Given the numbers like this, we see that the set 'de' has bival of 011000.
 * It's clear that no other combination of letters can produce such bival.
 * 
 * With such system in place, we can easily check whether two subsets have a
 * a common element via bit operation. A set 'de', as shown above, has bival
 * of 24 (011000), and set 'adf' has bival of 41 (101001). 
 *		'de'	: 011000
 *		'adf'	: 101001
 * ------------------------
 *  'de' & 'adf': 001000		=> bival of 'd';
 * 
 * Since JavaScript bitwise operation uses 32-bit integer, and the 32nd place 
 * is for sign (0 for positive, 1 for negative), we can effectively keep 
 * track of 31 elements with the numbering system demonstrated above. In order 
 * to implement this system with greater number of elements, it becomes 
 * necessary to cut the elements of the array into blocks. Indices 0 to 30 
 * (inclusive) will be block 1, 31 to 62 will be block 2, and so on. 
 * 
 * Given this, a subset of a set will hold bivals of its elements in an array,
 * whose length is the same as that of the original set. To test if two 
 * subsets have a common element, or lackof, we do bitwise operations to
 * with the numbers of the array at the same indices. 
 * 
 */
//`elems` is the array of elements to constitute the whole set, in order 
// that the user wants in.
//`elems` may not contain duplicate element
function SuperSet(elems){
	this.elems = [...elems]; //clone the array, as to not just make reference
}

//takes in two arrays of bivals
function bitwiseOp(op, bivalsA, bivalsB, getIdxStr){
	//padded to length 31
	function paddedBiToDec(n){
	let str = ''
	while(n){
		str = n%2 + str;
		n = Math.floor(n/2);
	}
	while(str.length < 31) str = '0' + str;
	return str;
}
	let bivals = [];
	let idxStr = ''
	let length = Math.max(bivalsA.length, bivalsB.length);
	op = op.toUpperCase();
	for(let i = 0; i < length; i ++){
		let bvA = bivalsA[i];
		let bvB = bivalsB[i];
		let union;
		if(op == 'OR') union = bvA | bvB;
		else if(op == 'AND') union = bvA & bvB;
		else if(op == 'XOR') union = bvA ^ bvB;
		else if(op == 'DIFF') union = bvA & ~bvB;
		else if(op instanceof Function) op(bvA, bvB);
		if(union ===  undefined) throw new Error(`Invalid operation: ${op}.`);
		bivals[i] = union; 
		if(getIdxStr){
			union = paddedBiToDec(union);
			idxStr = union + idxStr;
		}
	}
	if(getIdxStr) return {bivals, idxStr};
	return bivals;
}
// `a`, `b` are subsets
SuperSet.prototype.union = function(a, b, bivalsOnly){
	let bvA = a.bivals, bvB = b.bivals;
	let result = bitwiseOp('OR', bvA, bvB, bivalsOnly);
	if(bivalsOnly) return result;
	else {
		let indices = result.idxStr.split('').reverse();
		let elems = this.getElementsAt(indices);
		return {bivals: result.bivals, elems};
	}
}
// `a`, `b` are subsets
SuperSet.prototype.intersect = function(a, b, bivalsOnly){
	let bvA = a.bivals, bvB = b.bivals;
	let result = bitwiseOp('AND', bvA, bvB, bivalsOnly);
	if(bivalsOnly) return result;
	else {
		let indices = result.idxStr.split('').reverse();
		let elems = this.getElementsAt(indices);
		return {bivals: result.bivals, elems};
	}
}
// `a`, `b` are subsets. |A| + |B| =? |SuperSet(A,B)|
SuperSet.prototype.isExclusive = function(a, b){
	let bvA = a.bivals, bvB = b.bivals;
	let result = bitwiseOp('AND', bvA, bvB);
	let sum = 0; 
	for(let i = 0; i < result.length; i++) sum += +result[i];
	return sum == 0;
}

SuperSet.prototype.difference = function(a, b, bivalsOnly){
	let bvA = a.bivals, bvB = b.bivals;
	let result = bitwiseOp('DIFF', bvA, bvB, bivalsOnly);
	if(bivalsOnly) return result;
	else {
		let indices = result.idxStr.split('').reverse();
		let elems = this.getElementsAt(indices);
		return {bivals: result.bivals, elems};
	}
}
// Union - intersection
SuperSet.prototype.unique = function(a, b, bivalsOnly){
	let bvA = a.bivals, bvB = b.bivals;
	let result = bitwiseOp('XOR', bvA, bvB, bivalsOnly);
	if(bivalsOnly) return result;
	else {
		let indices = result.idxStr.split('').reverse();
		let elems = this.getElementsAt(indices);
		return {bivals: result.bivals, elems};
	}
}

//gets `pos` as array of integers
SuperSet.prototype.getElementsAt = function(indices){
	let elems = [];
	for(let i = 0; i < indices.length; i++){
		let getIt = indices[i];
		if(getIt){
			let elem = this.elements[i];
			elems.push(elem);
		}
	}
	return elems;
}

SuperSet.prototype.getSubset = function(indices){
	if(indices == indices * 1) indices = [indices]; // if just a number is passed
	let subset = [], bivals = [];
	indices.forEach(i=>{
		let elem = this.elems[i];
		subset.push(elem);
		let blocknum = Math.floor(i/31);
		let bival = Math.pow(2, i%31);
		let temp = bivals[blocknum];
		bivals[blocknum] = temp ? bival+temp : bival;
	});
	return {
		subset,
		bivals
	}
}

SuperSet.prototype.insert = function(elem){}

SuperSet.prototype.delete = function(elem){}

'use strict';
/**
 * Magic Square is a square matrix such that sum of each row, 
 * column, and two diagonals are all equal to each other
 * 
 * TERMS:
 * -magic number: the number that each row, col, and diag should equal to
 * 
 * dim: dimension of the matrix
 * nums: an array of dim*dim distinct integers
 * 
 * Method:
 * 1. Let there be matrix 
 */
 

function findMagics(dim, nums){
	if(dim == 1){
		nums = nums || [1];
		return nums;
	} else if(dim == 2){
		// Is it even possible?
	}
	let cornerCount = 4;
	let edgeCount = (dim - 2) * 4;
	let innerCount = (dim-2) * (dim-2);
	let setCounts = dim == 3 ? [4, 1] : [cornerCount, edgeCount, innerCount];
	// dim == 3 => nums = [1,2, ... , 8, 9];
	nums = (()=>{
		if(nums) return nums;
		nums = [];
		let count = dim*dim;
		while(count) nums.unshift(count--);
		return nums;
	})();
	
	
}
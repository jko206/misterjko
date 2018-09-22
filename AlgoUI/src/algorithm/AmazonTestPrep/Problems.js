'use strict';



import {
  randomInt, 
  shuffleArray,
  makeArray,
  printTree,
  coinFlip,
} from './util.js';

import Node from './node.js';

function generateTree(depth, mode, valFunc){
  
  function recourse(curr, depth){
    if(depth){
      if(mode === 0 || (mode === 1 && coinFlip())){
        let val = valFunc();
        curr.left = new Node(val);
        recourse(curr.left, depth - 1);
        
        val = valFunc();
        curr.right = new Node(val);
        recourse(curr.right, depth - 1);
      } else if(mode === 3) {
        let r = randomInt();
        if(r > 0){
          let val = valFunc();
          curr.left = new Node(val);
          recourse(curr.left, depth - 1);
        }
        r = randomInt();
        if(r > 0){
          let val = valFunc();
          curr.right = new Node(val);
          recourse(curr.right, depth - 1);
        }
      }
    }
  }
  
  if(depth === 0) return null;
  else {
    valFunc = valFunc || (start=>{
      let index = start || 0; 
      return function(){
        return index++;
      }
    })(0);
    let val = valFunc();
    let root = new Node(val);
    recourse(root, depth - 1);
    return root;
  }
}



//////////////////////////

/*
  Save all leaf nodes of a Binary tree in a Doubly Linked List 
  by using Right node as Next node and Left Node as Previous Node.
*/

function prob01(print = true, depth = randomInt(6)){
  function SaveLeaves(nodes, arr){
    while(nodes.length){
      let node = nodes.shift();
      let {left, right} = node;
      if(left || right){
        if(left) nodes.push(left);
        if(right) nodes.push(right);
      } else {
        arr.push(node.val);
      }
    }
  }
  
  let tree = generateTree(depth, 3);
  let arr = [];
  SaveLeaves([tree], arr);
  if(print){
    printTree(tree);
    console.log(arr);
  }
  return arr;
  
}
/*
Given an array,find the maximum j – i such that arr[j] > arr[i]
*/
function prob02(arr, size){
  function mergeFind(arr1, arr2){
    let min = arr1[0];
    let max = arr2[arr2.length - 1]; 
    let diff = max - min;
    let arr = [];
    while(arr1.length || arr2.length){
      let elem1 = arr1[0] === undefined ? Infinity : arr1[0];
      let elem2 = arr2[0] === undefined ? Infinity : arr2[0];
      
      let elem = elem1 < elem2 ? arr1.shift() : arr2.shift();
      arr.push(elem);
    }
    return {arr, diff};
  }
  function sortFind(arr){
    if(arr.length === 1){
      return {
        arr,
        diff: -Infinity,
      }
    } else {
      let {length} = arr;
      let arr1 = arr.splice(0, length/2);
      let arr2 = arr;
      
      let result = sortFind(arr1);
      let diff1 = result.diff;
      arr1 = result.arr;
      
      result = sortFind(arr2);
      let diff2 = result.diff;
      arr2 = result.arr;
      
      result = mergeFind(arr1, arr2);
      let diff3 = result.diff;
      arr = result.arr;
      
      let diff = Math.max(diff1, diff2, diff3);
      return {arr, diff};
      
    }
  }
  arr = arr || makeArray(size);
  console.log(arr);
  let result = sortFind(arr);
  console.log(result.diff);
  console.log(result.arr);
}

/*
Given the root to a binary tree, a value n and k.Find the 
sum of nodes at distance k from node with value n
*/
function prob03(depth = 6){
  
  function traversal(node, depth, sum){
    if(node === null){
      return sum;
    } else if(depth === 1){
      return sum + node.val;
    } else {
      let {left, right} = node;
      sum = traversal(left, depth-1, sum);
      sum = traversal(right, depth-1, sum);
      return sum;
    }
  }
  let sumAt = randomInt(depth);
  let tree = generateTree(depth, 3, randomInt);
  printTree(tree);
  let sum = traversal(tree, sumAt, 0);
  
  console.log(`sum at depth ${sumAt}: ${sum}`);
}

/*
The cost of a stock on each day is given in an array, find the max profit that you can make by buying and selling in those days.
For example, if [100, 180, 260, 310, 40, 535, 695] represents the prices of stocks on different days,
the maximum profit can earned by buying on day 0, selling on day 3 and again buy on day 4 and sell on day 6. 
If the given array of prices is sorted in decreasing order, then profit cannot be earned at all.

Verfy similar to prob02
*/
function prob04(){}


/*
Given a binary search tree , print the path which has the sum equal to k and 
has minimum hops. i.e if there are multiple paths with the sum equal to k 
then print the path with minimum number of nodes.

IT'S NOT WORKING
*/
function prob05(){
  let minDepth = Infinity;
  let shortest;
  function traversal(node, target, sum, path){
    let {val, left, right} = node;
    if(sum + val === target){
      if(path .length < minDepth){
        minDepth = path.length;
        shortest = path;
      }
    } else if(sum + val < target){
      sum += val; 
      path.push(node);
      if(left !== null) traversal(left, target, sum, [...path]);
      if(right !== null) traversal(right, target, sum, [...path]);
    }
  }
  let tree = generateTree(7, 3, randomInt);
  let target = randomInt(30);
  let path = [];
  traversal(tree, target, 0, path);
  console.log('target: ' + target);
  printTree(tree)
  if(path.length){
    console.log(path)
    console.log(shortest);
  } else {
    console.log('No such path');
  }
}


/*
  Construct a binary tree from given inorder and preorder traversals.
*/
function prob06(list,size = 30){
  function getDepth(list){
    let depth = 0; 
    while(2**depth <= list.length){
      depth++;
    }
    return depth;
    
  }
  function preorder(list, level){
    /*if(level == 1){
      let val = list.shift();
      if(val !== undefined){
        return new Node(val);
      } else {
        return null;
      }
    } else {
      let left = preorder(list, level - 1);
      let currVal = list.shift();
      if(currVal === undefined){
        return left;
      } else {
        let curr = new Node(currVal, left);
        curr.right = preorder(list, level - 1);
        return curr;
      }
    }
    */
    if(level === 1){
      if(list.length){
        let val = list.shift();
        return new Node(val);
      } else {
        return null;
      }
    } else {
      if(list.length){
        let val = list.shift();
        let left = preorder(list, level - 1);
        let right = preorder(list, level - 1);
        return new Node(val, left, right);
      } else {
        return null;
      }
    }
  }
  function inorder(list, level){
    if(level === 1){
      let val = list.shift();
      if(val === undefined){
        return null;
      } else {
        return new Node(val);
      }
    } else {
      let left = inorder(list, level - 1);
      if(left){
        if(list.length){
          let val = list.shift();
          let right = inorder(list, level - 1);
          let node = new Node(val, left, right);
          return node;
        } else {
          return left;
        }
      } else {
        return null;
      }
    }
  }
  
  list = list || makeArray(size);
  let depth = getDepth(list);
  
  let t1 = preorder([...list], depth);
  
  let t2 = inorder([...list], depth);
  
  console.log(list);
  console.log('preorder: ');
  printTree(t1);
  console.log('inorder: ');
  printTree(t2);
  
  return {
    preorder: t1,
    inorder: t2,
  };
}

/*
Given an array, arrange the elements such that the number formed by concatenating the elements is highest.
E.g.: input = [9, 93, 24, 6], 
the output should be: [9,93,6,24].
 This is because if you concatenate all the numbers, 
993624 is the highest number that can be formed.
*/
function prob07(){
  
}


/*
Given a string, find the longest substring which is palindrome.

NOTE: can't figure out how to do this without brute force....
*/
function prob08(){}

/*
Given an array, arrange the elements such that the number formed by concatenating the elements is highest.
E.g.: input = [9, 93, 24, 6], 
the output should be: [9,93,6,24].
 This is because if you concatenate all the numbers, 
993624 is the highest number that can be formed.
*/
function prob09(arr){
  arr = arr || makeArray(10);
  return arr.sort((a,b)=>{
    let intA = '' + a + b;
    let intB = '' + b + a;
    intA = parseInt(intA);
    intB = parseInt(intB);
    return intB - intA;
  });
}

/*
Given an integer and number of possible swaps, return an array that concatenates 
to the highest possible value for the given number of swaps. Swaps can only happen
between adjacent cells. 

// get a map of the cells and their positions, sorted by priority

input: [1,2,3,4], 3 swaps
  bringing 4 to the front by 3 indices costs 3 swaps.
  -> [4,1,2,3]
input: [1,2,3,4], 2 swaps. Only consider up to 3, because 4 can not come to the front
  -> [3,1,2,4]

input: [1,1,1,1,1,1,1,5], 3
  -> [1,1,1,1,5,1,1,1]
input: [4,4,3,4], any number > 0
  -> [4, 4, 4, 3]
*/
function prob10(arr, swaps){}


/*
from g4g: https://practice.geeksforgeeks.org/problems/count-the-subarrays-having-product-less-than-k/0
Given an array of positive numbers, the task is to find the number of possible contiguous subarrays having product less than a given number K.

Input:
The first line of input contains an integer T denoting the number of test cases. Then T test cases follow. Each test case consists of two lines. First line of each test case contains two integers N & K and the second line contains N space separated array elements.

Output:
For each test case, print the count of required subarrays in new line.

Constraints:
1<=T<=200
1<=N<=105
1<=K<=1015
1<=A[i]<=105

Example:
Input:
2
4 10
1 2 3 4
7 100
1 9 2 8 6 4 3

Output:
7
16

Explanation:

Input : A[]={1, 2,3,4} 
        K = 10
Output : 7
The contiguous subarrays are {1}, {2}, {3}, {4}
{1, 2}, {1, 2, 3} and {2, 3} whose count is 7.
*/
function prob11(arr, target){
  function counter(a){
    if(a !== null && a < target){
      count++;
      console.log(`${count}: ${a}`)
    } 
    
  }
  function recourse(arr, idx, prod){
  	counter(prod);
  	if(idx < arr.length){
      for(;idx < arr.length; idx++){
        let n = arr[idx];
        let temp = prod === null ? n : prod * n;
		    recourse(arr, idx + 1, temp);
      }
    }
  }
  let count = 0;
  recourse(arr, 0, null);
  console.log(count);
}


/*
-Given a number n, find the number of length-n binary string that doesn't have consecutive 1s.
  e.g. prob12(5)
  -> 
    [
      "00000", "00001", "00010", 
      "00100", "00101", "01000", 
      "01001", "01010", "10000", 
      "10001", "10010", "10100", 
      "10101"
    ]
*/
function prob12(n){
  function recourse(n, arr){
    if(n === 0){
      return arr;
    } else {
      let newArr = [];
      for(let i = 0; i < arr.length; i++){
        let elem = arr[i];
        newArr.push(elem + '00', elem + '01');
        if(elem[elem.length - 1] !== '1') newArr.push(elem + '10');
      }
      return recourse(n - 2, newArr);
    }
  }
  if(n === 0){
    return [];
  } else if(n%2 === 1){
    return recourse(n - 1, ['0', '1']);
  } else {
    return recourse(n - 2, ['00', '10', '01']);
  }
}

/*
From: https://www.quora.com/What-are-the-questions-asked-in-an-Amazon-Online-Test-in-HackerRank
A swap operation M on an array is defined where you can only swap the

adjacent elements. Given an array containing digits and n swap

operations(defined as below), maximize the value of the array.

Example: Array 1, 2, 4, 3 (value = 1243), Number of swaps 2

Output 4,1,2,3 (value = 4123).
*/
function prob13(arr, swaps){
  function findMax(perms){}
  function recourse(arr, swaps){
    if(arr.length === 1 || swaps === 0){
      return '' + arr[0];
    } else {
      let perms = [];
      let temp = arr.shift();
      let result = temp + recourse(arr, swaps);
      arr.unshift(temp);
      perms.push(result);
      
      for(let i = 1; i < arr.length && swaps > 0; i++){
        
      }
      return findMax(perms);
    }
  }
  return recourse(arr, swaps);
}


/*
from: https://www.hackerrank.com/challenges/crush/problem?h_l=interview&playlist_slugs%5B%5D=interview-preparation-kit&playlist_slugs%5B%5D=arrays
original function name: arrayManipulation()

test0:
(5, [ [ 1, 2, 100 ], [ 2, 5, 100 ], [ 3, 4, 100 ] ])
-> 200

test1: 
(10, [ [ 1, 5, 3 ], [ 4, 8, 7 ], [ 6, 9, 1 ] ])
-> 10

test2:
(10, [ [ 2, 6, 8 ], [ 3, 5, 7 ], [ 1, 8, 1 ], [ 5, 9, 15 ] ])
-> 31

test3: 
(4, [ [2, 3, 603], [1, 1, 286], [4, 4, 882] ])
-> 882

test4: 
** 30 elements ** 
(40, [[29,40,787],[9,26,219],[21,31,214],[8,22,719],[15,23,102],[11,24,83],[14,22,321],[5,22,300],[11,30,832],[5,25,29],[16,24,577],[3,10,905],[15,22,335],[29,35,254],[9,20,20],[33,34,351],[30,38,564],[11,31,969],[3,32,11],[29,35,267],[4,24,531],[1,38,892],[12,18,825],[25,32,99],[3,39,107],[12,37,131],[3,26,640],[8,39,483],[8,11,194],[12,37,502]])


Done in O(n);
*/

function prob14(length, queries){
  let starters = [];
  let enders = []; 
  
  let curr = 0; 
  let max = -Infinity;
  let maxIdx = queries.length;
  
  for(let i = 0; i < length; i++){
    curr += starters[i] || 0;
    if(curr > max) max = curr;
    curr -= enders[i] || 0;
  }
  
  return max;
}

/*
  coin change problem
*/

function prob15(amount, denoms){
  
}

/**/
/**/

'use strict';
/*
  The following are all various versions and exercises regarding finding
  inversions
*/

function findInversions(arr){
  
  function mergeCount(arr1, arr2){
    let count = 0;
    let arr = [];
    while(arr1.length && arr2.length){
      let elem1 = arr1[0];
      let elem2 = arr2[0];
      if(elem1 > elem2){
        // console.log(`inversion: ${elem1}, ${elem2}`);
        count += arr1.length;
        elem2 = arr2.shift();
        arr.push(elem2);
      } else {
        elem1 = arr1.shift();
        arr.push(elem1);
      }
    }
    if(arr1.length == 0){
      arr.push(...arr2);
    } else if(arr2.length == 0){
      count += arr1.length;
      arr.push(...arr1);
    }
    return {count, arr};
  }
  function sortCount(arr){
    if(arr.length == 1){
      return {arr, count: 0};
    } else {
      let length = arr.length;
      let arr1 = arr.splice(0, length /2);
      let arr2 = arr;
      
      let result = sortCount(arr1);
      let count1 = result.count;
      arr1 = result.arr;
      
      result = sortCount(arr2);
      let count2 = result.count;
      arr2 = result.arr;
      
      result = mergeCount(arr1, arr2);
      let count3 = result.count;
      arr = result.arr;
      
      let count = count1 + count2 + count3;
      return {arr, count};
    }
  }
  return sortCount(arr);
}

// From: https://www.hackerrank.com/challenges/new-year-chaos/problem
function minimumBribes(q) {
  function isChaotic(arr){
    for(let i = 0; i < arr.length; i++){
      let elem = arr[i];
      let properIdx = elem - 1; 
      let currIdx = i;

      if(properIdx - currIdx > 2) return true;
    }
  }
  function halfArray(arr){
    let {length} = arr;
    let front = arr.splice(0, length/2);
    let back = arr;
    return [front, back];
  }
  function sortCount(arr1, arr2){
    let arr = [];
    let count = 0;
    while(arr1.length && arr2.length){
      let e1 = arr1[0];
      let e2 = arr2[0];
      if(e1 < e2){
        e1 = arr1.shift();
        arr.push(e1);
      } else { // Since all elements are unique, preclude equality
        count += arr1.length;
        e2 = arr2.shift();
        arr.push(e2);
      }
    }
    if(arr1.length){
      arr.push(...arr1);
    } else if(arr2.length){
      arr.push(...arr2);
    }

    return {arr, count};
  }
  function mergeCount(arr){
    if(arr.length == 1){
      return {arr, count: 0};
    } else {
      let [arr1, arr2] = halfArray(arr);
      let result1 = mergeCount(arr1);
      let result2 = mergeCount(arr2);
      let count = result1.count + result2.count;
      arr1 = result1.arr;
      arr2 = result2.arr;
      let result3 = sortCount(arr1, arr2);
      count += result3.count;
      arr = result3.arr;
      return {arr, count};
    }
  }
  if(isChaotic(q)){
    console.log('Too chaotic');
    return 'Too chaotic';
  } else {
    let result = mergeCount(q);
    console.log(result.count);
    return result.count;
  }
}


// From https://www.hackerrank.com/challenges/minimum-swaps-2/problem
function minimumSwaps(arr) {
  function halfArray(arr){
    let {length} = arr;
    let front = arr.splice(0, length/2);
    let back = arr;
    return [front, back];
  }
  function sortCount(arr1, arr2){
    let arr = [];
    let count = 0;
    let arr1LastLength = -1;
    while(arr1.length && arr2.length){
      let e1 = arr1[0];
      let e2 = arr2[0];
      if(e1 < e2){
        e1 = arr1.shift();
        arr.push(e1);
      } else { // Since all elements are unique, preclude equality
        if(arr1.length !== arr1LastLength){
          count += arr1.length;
        }
        arr1LastLength = arr1.length;
          
        e2 = arr2.shift();
        arr.push(e2);
      }
    }
    if(arr1.length){
      // count += arr1.length;
      arr.push(...arr1);
    } else if(arr2.length){
      arr.push(...arr2);
    }

    return {arr, count};
  }
  function mergeCount(arr){
    if(arr.length == 1){
      return {arr, count: 0};
    } else {
      let [arr1, arr2] = halfArray(arr);
      let result1 = mergeCount(arr1);
      let result2 = mergeCount(arr2);
      let count = result1.count + result2.count;
      arr1 = result1.arr;
      arr2 = result2.arr;
      let result3 = sortCount(arr1, arr2);
      count += result3.count;
      arr = result3.arr;
      return {arr, count};
    }
  }
  let {count} = mergeCount(arr);
  // console.log(count);
  return count;
}

// Brute force; O(n^2). This one worked
function minimumSwaps2(arr){
  function findIndices(arr){
    let indexOf = [];
    for(let i = 0; i < arr.length; i++){
      let elem = arr[i];
      indexOf[elem] = i;
    }
    return indexOf;
  }
  function swap(arr, i, j){
    let val1 = arr[i];
    let val2 = arr[j];
    arr[i] = val2;
    arr[j] = val1;
    
    indexOf[val1] = j;
    indexOf[val2] = i;
  }
  let arrLength = arr.length;
  let maxDeviance = 0;
  let count = 0;
  let indexOf = findIndices(arr);
  for(let val = 1; val <= arr.length; val++){
    let currIdx = indexOf[val];  // where value is;
    let properIdx = val - 1;     // where value is supposed to be
    if(val > arrLength){
      let deviance = val - arrLength;
      maxDeviance = maxDeviance > deviance ? maxDeviance : deviance;
    }
    if(currIdx !== properIdx){
      //swap
      swap(arr, currIdx, properIdx);
      count++;
    }
  }
  // console.log(count - maxDeviance);
  return count - maxDeviance;
}

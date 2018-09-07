// Given a string `str`, find the longest palindrome it contains. 

/*
  the last char of a string is either 1. part of the longest palindrome, 
    or 2. it's not. 
  
  Get results from both cases:
    Case 1: 
      recourse without the last character
    Case 2: 
      find all matches of the last char.
      for each match's index i, 
        get substring up to index i, 
        and also get substring from i to the last char (not inclusive)
      Save the longest one
      
*/


function findPalindrome(str){
  function findIndices(str, char){
    let arr = [];
    let len = str.length;
    for(let i = 0; i < len; i++){
      let c = str[i]; 
      if(c === char) arr.push(i);
    }
    return arr.reverse();
  }
  function recourse(str){
    if(str.length === 1){
      return str;
    } else if(str.length === 2){
      if(str[0] === str[1]){
        return str;
      } else {
        return '';
      }
    } else {
      let len = str.length;
      // the last char is part of the palindrome
      let substr = str.substr(0, len-1); 
      let result = findPalindrome(substr);
      
      // the last char is not part of the palindrome
      let lastChar = str.charAt(len-1);
      let indices = findIndices(str, lastChar);
      while(indices.length){
        let i = indices.shift();
        
      }
    }
  }
  
  return recourse(str);
}

function attempt2(str){
  function findIndices(str, char){
    let arr = [];
    let len = str.length;
    for(let i = 0; i < len; i++){
      let c = str[i]; 
      if(c === char) arr.unshift(i);
    }
    return arr;
  }
  function splitStr(str, index){
    
  };
  function recourse(str){
    if(str.length === 1){
      return {buildOn: true, str};
    } else if(str.length === 2){
      if(str[0] === str[1]){
        return {buildOn: true, str};
      } else {
        return {buildOn: false, str: ''};
      }
    } else {
      // first char is part of a palindrome
      let firstChar = str[0];
      let indices = findIndices(str, firstChar);
      let currBest = {};
      indices.forEach(index=>{
        let {front, back} = splitStr(str, index);
        /*
          In comparing the results of running `front` and `back`
          if one has smaller palindrome, but can be built on,
          whereas the other has bigger palindrome, but can't be built on,
          which one do I choose?
        
        */
      });
      
      // first char is not part of a palindrome
      let substr = str.substr(1);
      
    }
  }
}

function bruteforce(str){
  
}
function combo(arr, fn){
  function recourse(arr, idx, str){
  	fn(str);
  	if(idx < arr.length){
      for(;idx < arr.length; idx++){
        let c = arr[idx];
		    recourse(arr, idx + 1, str + c);
      }
    }
  }
  fn = fn || console.log;
  recourse(arr, 0, '');
}


function permutate(arr, fn){
  function recourse(arr, str){
  	if(!arr.length){
      fn(str);
    } else {
      for(let i = 0; i < arr.length; i++){
        let c = arr.splice(i, 1)[0];
        recourse(arr, str + c);
        arr.splice(i, 0, c);
      }
    }
  }
  fn = fn || console.log;
  recourse(arr, '');
}
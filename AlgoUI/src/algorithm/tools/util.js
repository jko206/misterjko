
 
/*
mode
 0: perfect: # nodes in tree = 2**(depth) - 1; all leaf are same depth;
 1: full; each node has either 0 or 2 children
 2: complete; second from last level is perfect; last row is concentrated to the left;
 3: random; each node may have one, two, or child nodes. 
 
 TODO: be able to set how sparse or dense to make the tree, if mode === 3
*/

export {
  randomInt, 
  shuffleArray, 
  makeArray,
  printTree,
  coinFlip,
};

function randomInt(max = 10){
  return Math.floor(Math.random() * max);
}

function shuffleArray(arr){
  let max = arr.length;
  for(let i = 0; i < max; i++){
    let r = randomInt(max);
    let temp = arr[i];
    arr[i] = arr[r];
    arr[r] = temp;
  }
}

function makeArray(size = 10){
  let arr = [];
  while(size) arr.unshift(--size);
  shuffleArray(arr);
  return arr;
}

function printTree(tree){
  let layers = [];
  function fillLayers(node, layers, depth, index){
    if(node){
      let currLayer = layers[depth] || [];
      currLayer[index] = node.val;
      layers[depth] = currLayer;
      
      let {left, right} = node;
      if(left || right){
        let newIndex = index * 2;
        fillLayers(left, layers, depth+1, newIndex);
        fillLayers(right, layers, depth+1, newIndex+1);
      }
    }
  }
  if(tree === null){
    console.log('(null)');
  } else {
    fillLayers(tree, layers, 1, 0);
    layers.shift(); // depth/index 0 is empty; shouldn't print.
    let spacer1 = '';
    let spacer2 = '  ';
    // format values;
    layers.forEach((layer, depth)=>{
      let max = 2**depth;
      for(let i = 0; i < max; i++){
        let temp = layer[i];
        let val = temp !== undefined ? temp < 10 ? '0' + temp : temp + '' : '__';
        layer[i] = val;
      }
    });
    
    // space the values
    let lines = layers.reverse().map((layer,i,arr)=>{
      let line = spacer1 + layer.join(spacer2);
      spacer1 = spacer2; 
      spacer2 += spacer2 + '  ';
      return line;
    });
    
    lines.reverse().forEach(line=>{
      console.log(line);
    });
  }
}

function coinFlip(){
  return randomInt(2) === 1;
}
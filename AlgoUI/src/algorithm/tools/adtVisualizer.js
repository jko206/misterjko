import Node from './ADT/node.js';
import {coinFlip, randomInt} from './util.js';

export {generateTree};

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
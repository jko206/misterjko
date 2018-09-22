/*
  global Vue $
*/
import algorithms from './algos-pkg.js';

$(document).ready(function(){
  new Vue({
    el: '#app',
    data: {
      algorithms,
      selected: {
        algorithm: {
          name: '',
          sampleInputs: [],
          methodName: '',
          desc: '',
          dataStructure: '', //if tree, or something print the tree
          args: [],
        },
        sampleIdx: -1,
      },
      argInputs: [],
      currTab: 'desc',
      validKeys: [
        8,   // backspace
        9,   // tab
        13,  // enter
        16,  // shift
        17,  // ctrl
        18,  // alt
        20,  // capslock
        27,  // esc
        32,  // shift
        33, 34, // page up/down
        35, 36, // home/end
        37, 38, 39, 40,         // arrow keys
        45,  // insert
        46,  // delete
        48, 49, 50, 51, 52,     // numbers 0~4
        53, 54, 55, 56, 57,     // numbers 5~9
        69,  // character 'e'
        91, 92,                 // windows key
        96, 97, 98, 99, 100,    // numpad numbers 0~4
        101, 102, 103, 104, 105,// numpad numbers 5~9
        110, // numpad .
        109, 189,               // - sign
        107, 187,               // +(=) sign
        188, // , 
        190  // regular .
      ],
      
      output: '',
      
      showAlgoList: false,
      showSampleList: false,
    },
    methods: {
      setCurrAlgorithm(algo){
        this.selected.algorithm = algo;
        this.argInputs = [];
        algo.args.forEach(({name, type, isRequired})=>{
          this.argInputs.push({
            name,
            type,
            isRequired,
            val: undefined,
          });
        });
      },
      setSample(idx){
        if(this.selected.sampleIdx == idx){
          this.selected.sampleIdx = -1;
        } else {
          this.selected.sampleIdx = idx;
          let data = this.selected.algorithm.sampleInputs[idx];
          // console.log(data);
          this.argInputs.forEach(arg=>{
            let {name} = arg;
            arg.val = data[name];
          });
        }
      },
      getInputType(type){
        if(type === 'Number' || type === 'Integer'){
          return 'number';
        } else {
          return 'text';
        }
      },
      isSelectedSample(idx){
        return idx === this.selected.sampleIdx && 'selected';
      },
      isSelectedAlgo(name){
        return name === this.selected.algorithm.name && 'selected';
      },
      focusArgInput(idx){
        this.$refs['arg' + idx][0].focus();
      },
      processInput(event, idx){
        const {
          key,
          shiftKey,
          ctrlKey,
        } = event;
        if(key === 'Enter' && !(shiftKey || ctrlKey)){
          event.preventDefault();
          this.runAlgo();
          return;
        }
        const thisInput = this.argInputs[idx];
        const currVal = thisInput.val || '';
        const fieldType = thisInput.type;
        
        const isNonNumeral = /\D/.test(key);
        const isValidKey = this.validKeys.includes(event.which);
        if(fieldType === 'Number'){
          if(key === '.'){
            const hasDecPointAlready = currVal.includes('.');
            if(hasDecPointAlready){
              event.preventDefault();
              event.target.blur();
              return;
            }
          }
          if(key === 'e' || key === 'E'){
            const hasEAlready = /(e|E)/.test(currVal);
            if(hasEAlready){
              event.preventDefault();
              return;
            }
          }
          if(isNonNumeral && !isValidKey){
            event.preventDefault();
          }
        } else if(fieldType === 'Integer'){
          if(isNonNumeral && (key === 'e' || key === 'E')){
            const hasEAlready = /(e|E)/.test(currVal);
            if(hasEAlready){
              event.preventDefault();
              return;
            }
          }
          if(key === '.'){
            event.preventDefault();
            return;
          }
          if(isNonNumeral && !isValidKey){
            event.preventDefault();
            return;
          }
        }
      },
      
      // arg <span> related stuff
      argPlaceholder({type, isRequired}){
        return type
          .replace('&lt;', '<')
          .replace('&gt;', '>');
        
          
      },
      getArgSpanClass(argIdx){
        return this.argInputs[argIdx].validity === 1 ? 'set' : '';
      },
      argSpanContent(arg, idx){
        let str = arg.name;
        if(idx > 0) str = ', ' + str;
        if(!arg.isRequired) str = `[${str}]`;
        return str;
      },
      getArgTitle(isReq){
        return isReq ? 'This is a required argument' : '';
      },
      runAlgo(){
        let input;
        try{
          input = validateInput(this.argInputs);
        } catch(e){
          this.output = `${e.message}`;
          return;
        }
        //get args
        let output = this.selected.algorithm.method(...input);
        this.output = output;
        // run the algorithm
        
      }
    },
    computed: {
      sampleString(){
        let str = 'Sample ';
        let postFix = this.selected.sampleIdx >= 0 ? 
          '#' + (this.selected.sampleIdx + 1) : 'Inputs';
        return str + postFix;
      },
      algoName(){
        return this.selected.algorithm.name || 'Select algorithm';
        
      }
    }
  });
});

function validateInput(inputs){
  /*
    arguments can be one of the followings:
    - String            - Number            - Integer
    - Array<Number>     - Array<Integer>    - Array<Object>
    - Array<String>     - JSON-Object
  */
  const integerRegex = /^\d+((e|E)\d+)?$/;
  const numberRegex = /^\d+(\.\d+)?((e|E)\d+)?$/;
  const arrayTypeRegex = /^array\<[a-z]+\>$/i;
  inputs = inputs.map(arg=>{
    let {
      name,
      type,
      isRequired,
      val,
    } = arg;
    val = val.trim ? val.trim() : val;
    if(isRequired && (!val && val != 0)){
      throw new Error(`Argument ${name} is required`);
    }
    if(type === 'Number'){
      if(numberRegex.test(val)){
        return val * 1;
      } else {
        throw new Error(`${val} is not a valid argument for ${name}.`);
      }
    }
    if(type === 'Integer'){
      if(integerRegex.test(val)){
        return val * 1;
      } else {
        throw new Error(`${val} is not a valid argument for ${name}.`);
      }
    }
    if(arrayTypeRegex.test(type)){
      let arrayType = type.match(/\<[a-zA-Z]\>$/i)[0];
      arrayType = arrayType.match(/[a-zA-Z]/)[0].toLowerCase();
      // throw new Error(`${name} needs to be wrapped with '[' and ']'.`);
      
      val = JSON.parse(val);
      if(arrayType === 'number'){
        val = val.map(elem=>{
          let result = numberRegex.test(elem);
          if(!result) throw new Error(`${elem} is an invalid integer`);
        });
        return val;
      }
      
      if(arrayType === 'integer'){
        val = val.map(elem=>{
          let result = integerRegex.test(elem);
          if(!result) throw new Error(`${elem} is an invalid integer`);
        });
        return val;
      }
      if(arrayType === 'string'){
        return val.map(elem=>{
          return elem + '';
        });
      }
    }
  });
  
  return inputs;
}

window.teetee = validateInput;
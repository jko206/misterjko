String.prototype.has = function(str){
	return this.indexOf(str) != -1;
};

Array.prototype.getLast = function getLast(){
	return this[this.length - 1];
};

//clones and returns arrays with primitive types.
Array.prototype.clone = function(){
    var arr = [];
    for(var i = 0; i < this.length; i++){
        arr[i] = this[i];
    }
    return arr;
};

//work on this
Array.prototype.contains = function(needle, deepSearch, path){
    var toReturn = [];
    //search own children
    this.forEach(function(elt, i, thisArr){
       if(typeof elt == 'string' && elt == needle){
           toReturn.push(elt);
       } 
    });
    if(deepSearch){
        this.forEach(function(elt, i, thisArr){
            if(typeof elt == 'string' && elt.match(needle)){
               toReturn.push(elt.match(needle));
            }
        });
    }
    if(toReturn.length == 1){
        return toReturn.shift();
    } else if(toReturn.length > 0){
        return toReturn;
    } else {
        return false;
    }
}

Array.prototype.toLowerCase = function(){
    this.forEach(function(elt, i, thisArray){
        thisArray[i] = typeof elt == 'string' ? elt.toLowerCase() : elt;
    });
    return this;
}

var Utility = {
    getClass(obj) {
    if (typeof obj === "undefined") return "undefined";
    if (obj === null) return "null";
    if (obj.getClass) return obj.getClass();
    if (obj.class && typeof obj.class == 'string') return obj.class;
    else if(typeof obj.class == 'function') return obj.class();
    return Object.prototype.toString.call(obj)
            .match(/^\[object\s(.*)\]$/)[1];
    }
}

var whileBreak = (function(){
	var loops = 1000;
	return function(){
		if(loops == 1) console.log(arguments.callee);
		return loops--;
	};
}());
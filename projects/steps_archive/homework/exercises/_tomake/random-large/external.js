
var game = function(length, limit){
	length = length ? length : 10;
	limit = limit ? limit : 1000;
	var arr = [];
	var max = -1;
	for(var i = 0; i < length; i ++){
		var r = Math.ceil(Math.random() * limit);
		if(r > max) max = r;
		arr.push(r);
	}
	return 'The maxst number in the array ' + JSON.stringify(arr) + ' is ' + max + '.';
}


var game2 = function(length, limit){
	length = length ? length : 10;
	limit = limit ? limit : 1000;
	var arr = [];
	var sum = [];
	for(var i = 0; i < length; i ++){
		var r = Math.ceil(Math.random() * limit);
		if(r%2 == 0) sum += r;
		arr.push(r);
	}
	return 'The sum of even numbers in the array ' + JSON.stringify(arr) + ' is ' + sum + '.';
}
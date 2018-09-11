var game = function(){
	var city = prompt('What city/town/neighborhood did you grow up in?');
	var animal = prompt('What is your favorite animal?');
	var color = (function(){
		var colors = [
				'Red',
				'Blue',
				'Yellow',
				'Golden',
				'Silver',
				'Spotted',
				'Black',
				'White'
			];
		var r = Math.floor(Math.random() * colors.length);
		return colors[r];
	}());
	var name = city + ' ' + color + ' ' + animal;
	alert('Your rapper name is: ' + name);
}
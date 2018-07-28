function triFromCoord(p1, p2, p3){
	//organize points by high to low y value;
	var points = (function(){
		var arr1 = p1.y > p2.y ? [p1, p2] : [p2, p1];
		var arr2 = [p3];
		var arr3 = [];
		var i = 0;
		while(arr1.length != 0 && arr2.length != 0){
			if(arr1[0].y > arr2[0].y){
				arr3.push(arr1.shift());
			} else {
				arr3.push(arr2.shift());
			}
			// break;
			i++;if(i > 20){ console.log('here!'); break;}
		}
		arr3 = arr3.concat(arr1).concat(arr2);
		return arr3;
	}(p1,p2,p3));
	var height = Math.abs(points[0].y - points[2].y);
	var basePoint = (
			(points[0].x - points[2].x) / (points[0].y - points[2].y)
			* (points[1].y - points[0].y) + points[0].x
		);
	var base = Math.abs(points[1].x - basePoint);
	var area = 0.5 * base * height;
	var index = ('' + area).indexOf('.');
	area = ('' + area).substring(0, index+2);
	return parseFloat(area);
}

function threeRandomPoints(){
	//inclusive
	var randomBetween = function(min, max){
		var range = Math.abs(min - max) + 1;
		var r = Math.random() * range;
		r = Math.round(r);
		return r + min;
	};
	var p1 = {
		x: randomBetween(-10, 10),
		y: randomBetween(-10, 10),
		toString: function(){
			return JSON.stringify([this.x, this.y]);
		}
	};
	var p2 = (function(){
		var x1 = randomBetween(-10, 10), y1 = randomBetween(-10, 10);
		while(x1 == p1.x || y1 == p1.y){
			x1 = randomBetween(-10, 10);
			y1 = randomBetween(-10, 10);
		}
		return {
			x: x1, 
			y: y1,
			toString: function(){
				return JSON.stringify([this.x, this.y]);
			}
		};
	}());
	
	var p3 = (function(){
		var x1 = randomBetween(-10, 10), y1 = randomBetween(-10, 10);
		while(x1 == p1.x || y1 == p1.y || x1 == p2.x || y1 == p2.y){
			x1 = randomBetween(-10, 10);
			y1 = randomBetween(-10, 10);
		}
		return {
			x: x1, 
			y: y1,
			toString: function(){
				return JSON.stringify([this.x, this.y]);
			}
		};
	}());
	
	return [p1, p2, p3];
}
/* global $ */

$(document).ready(function(){
	var area;
	$('#new-problem').click(function(){
		var points = threeRandomPoints();
		$('#p1').text(points[0]);
		$('#p2').text(points[1]);
		$('#p3').text(points[2]);
		area = triFromCoord(points[0], points[1], points[2]);
	});
	var message;
	$('#check-button').click(function(){
		var response = $('#response').val();
		if(response == area) message = 'correct!';
		else message = 'Try again!';
		$('#message').text(message);
	});
	
	$('.button').css({
		border: '1px solid black',
		padding: 3,
		borderRadius : 5,
		width: 100,
		height: 25
	})
	
	$('#new-problem').click();
})
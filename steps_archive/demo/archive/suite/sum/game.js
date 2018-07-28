


var game = {
	levels: { //Min/Max of augend and addend for each level
		/*	augend addend*/
		1: [[1,5],[1,5]],
		2: [[1,5],[5,10]],
		3: [[1,10],[1,10]],
		4: [[1,50],[1,50]],
		5: [[1,50],[50,100]],
		6: [[50,100],[50,100]],
		7: [[50,200],[50,200]],
		8: [[50,500],[50,499]]
	},
	level: 7,
	//maxNumber: 50,
	//minNumber: 10,
	initialize: function(){
		this.drawBlocks();
		$($('.input')[0]).focus(function(){
			$('#spawn1').hide();
			$('#spawn2').hide();
			$('#spawn0').show();
		});
		$($('.input')[1]).focus(function(){
			$('#spawn0').hide();
			$('#spawn2').hide();
			$('#spawn1').show();
		});
		$($('.input')[2]).focus(function(){
			$('#spawn0').show();
			$('#spawn1').show();
			$('#spawn2').hide();
		});
		$(engine.currentInput).focus();
		this.setPoints();
		/*if(docCookies.hasItem('level')){
			var temp = parseInt(docCookies.getItem('level'));
			this.level = isNaN(temp) ? 1 : temp;
			//console.log(level);
		}*/
	},
	setAnswers: function(){
		var allInputs = this.inputs = $('.input');
		$('.input').val('');
		$('.input').data('correct', 'x');
		$('.input').css('background-image', 'none');
		/*var num = [];
		
		for(var i=0; i<2; i++){
			var input = $('.input')[i];
			var random = Math.random() * this.maxNumber;
			random = Math.floor(random);
			$(input).data('answer', random);
			$(input).data('correct', 'x');
			num[i] = random;
		}
		$($('.input')[2]).data('answer', num[0] + num[1]);
		$($('.input')[2]).data('correct', 'x');*/
		var num1 = this.levels[this.level][0];
		var num2 = this.levels[this.level][1];
		num1 = engine.getRandom(num1);
		num2 = engine.getRandom(num2);
		$('#augend').data('answer', num1);
		$('#addend').data('answer', num2);
		$('#sum').data('answer', (num1 + num2));
	},
	setPoints: function(){
		$('.input').each(function(){
			$(this).data('score', 5);
			$(this).data('penalty', 3);
			$(this).data('bounus', 2);
		});
	},
	drawBlocks: function(){
		this.reset();
		var count = 0;
		$('.input').each(function(){
			var num = $(this).data('answer');
			var pow = [];
			pow[0] = num%10;
			pow[1] = Math.floor(num%100 / 10);
			pow[2] = Math.floor(num/100);
			var gif0 = '1.gif';
			var gif1 = '10.gif';
			var gif2 = '100.gif';
			var blockSpawn = $('.block-spawn')[count];
			for(var i=0; i < 3; i++){
				var target = ".pow" + i; 
				for(var j = 0; j < pow[i]; j++){
					var elem = $('<img src="'+ Math.pow(10,i) + '.gif">');
					if(j == 4 && pow[i] > 4 && i < 2) elem.addClass('five-grouper');
					$(blockSpawn).find(target).append(elem);
				}
			}
			count++;
		});
	},
	reset: function(){
		$('.pow0').empty();
		$('.pow1').empty();
		$('.pow2').empty();
	}
}


/*	part1		part2			part3
	Minuend - subtrahend 	= difference
	Augend	+	Addend		= sum
*/

$('body').ready(function(){
	/*
	$(document).mouseup(function (e){
		var container = $('.selectable');

		if (!container.is(e.target) && container.has(e.target).length === 0){
			$('.selectable').removeClass('selected');
		}
	});
	*/

	$('#spawn2').on('click', '.selectable', function(){
		$('#change-button').html('');
		$(this).toggleClass('selected');
		if(game.operation == 'addition'){
			$('#change-button').css('background-image', 'url("../many2one.png")');
		}else if(game.operation == 'subtraction'){
			$('#change-button').css('background-image', 'url("../one2many.png")');
			var temp;
			switch($(this).parent().attr('class')){
				case "pow2":
					temp = 100;
					break;
				case "pow1":
					temp = 10;
					break;
				case "pow0":
					temp = 1;
					break;
			}
			/*		
			If the selected piece is a subtrahend and the previously selected is minuend,
			and they're the same value, destroy them both, and last-selected is empty
			*/
			var parent = $(this).closest('.clone').attr('id');
			if(parent == 'part2-clone') $('#change-button').prop('disabled', true);
			if(parent == 'part1-clone') $('#change-button').prop('disabled', false);
			if((parent == 'part2-clone' 
					&& game.lastSelectedParent == 'part1-clone'
					&& game.lastSelectedValue == temp)
					|| (parent == 'part1-clone' 
					&& game.lastSelectedParent == 'part2-clone'
					&& game.lastSelectedValue == temp)){
				$(this).remove();
				$(game.lastSelected).remove();
				game.lastSelected = '';
				game.lastSelectedParent = '';
				game.lastSelectedValue = '';
				regroupFives();
				return;
			}
			if($(this).is($(game.lastSelected))){
				game.lastSelected = '';
				game.lastSelectedParent = '';
				game.lastSelectedValue = '';
				return;
			}
			game.lastSelected = this;
			game.lastSelectedParent = parent;
			game.lastSelectedValue = temp;
		}
	});
	/*
	Use this to order the number in which things are selected
	so they can be organized by order
	var getCount = (function(){
		var count = 0;
		return function(){
			return count++;
		};
	}())
	*/
	
	$('#change-button').click(function(){
		/*
		if one is selected
			then change into many
		else if 10 are selected
			if subtraction && they don't have same parents
				return;
		*/
		var countSelected = $('.selected').length;
		if(countSelected == 1 
				&& game.operation == 'subtraction'
				&& $(game.lastSelected).parent().parent().is('#part1-clone')){
			var target, piece;
			switch (game.lastSelectedValue){
				case 10:
					target = '.pow0';
					piece = '<img src="1.gif" alt="1 block" class="selectable">';
					break;
				case 100:
					target = '.pow1';
					piece = '<img src="10.gif" alt="10 block" class="selectable">';
					break;
			}
			var temp = $(game.lastSelected).parent().parent().find(target);
			for(var i=0; i<10; i++){
				$(temp).append(piece);
			}
			$(game.lastSelected).remove();
		} else if(countSelected == 10 && game.operation == 'addition'){
			var temp;
			var temp2 = $('.selected').first().parent().attr('class');
			switch(temp2){
				case "pow2":
					temp = 100;
					break;
				case "pow1":
					temp = 10;
					break;
				case "pow0":
					temp = 1;
					break;
			}
			if(temp == 100) return;
			var sum = 0;
			$('.selected').each(function(){
				var parent = $(this).parent().attr('class');
				switch(parent){
					case "pow1":
						sum += 10;
						break;
					case "pow0":
						sum += 1;
						break;
				}
			});
			if(sum != temp*10){
				return;
			} else if(sum == 100){
				$('#part1-clone > .pow2').append('<img src="100.gif" alt="100 block" class="selectable">');
			} else if(sum == 10){
				$('#part1-clone > .pow1').append('<img src="10.gif" alt="100 block" class="selectable">');
			}
			$('.selected').remove();
		} else {
			//warn user somehow
		}
		// Regroup groups of 5
		regroupFives();
	});
});

var game = {
	lastSelected: '',
	lastSelectedParent: '',
	lastSelectedValue: '',
	operation: '',
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
			$('#spawn0').hide();
			$('#spawn1').hide();
			$('#spawn2').show();
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
		$('.input').css('background-image', 'none');

		var numSet1 = this.levels[this.level][0];
		var numSet2 = this.levels[this.level][1];
		var num1 = engine.getRandom(numSet1);
		var num2 = engine.getRandom(numSet2);
		var num3 = num1 + num2;
		var coinToss = Math.floor(Math.random() * 2);
		if(coinToss%2 == 0){ 
			this.operation = 'addition';
			$('#operation-sign').html('+');
		} else {
			this.operation = 'subtraction';
			numSet2[1] = num1;
			num2 = engine.getRandom(numSet2);
			num3 = num1 - num2;
			$('#operation-sign').html('&#8722;');
		}
		$('#part1').data('answer', num1);
		$('#part2').data('answer', num2);
		$('#part3').data('answer', num3);
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
		$('#spawn2').empty();
		$('#spawn2').append(
			$('<div></div>').addClass('clone').attr('id', 'part1-clone').append(
				$('#spawn0').children().clone()
			),
			$('<div></div>').attr('id', 'divider').css({
				'height' : '2px',
				'background-color' : 'black'
			}), 
			$('<div></div>').addClass('clone').attr('id', 'part2-clone').append(
				$('#spawn1').children().clone()
			)
		);
		$('#spawn2').find('img').each(function(){
			$(this).addClass('selectable');
		});
	},
	reset: function(){
		$('.pow0').empty();
		$('.pow1').empty();
		$('.pow2').empty();
	}
}

function regroupFives(){
	$('.selectable').removeClass('five-grouper');
	var len = $('.selectable').length;
	var lastParent = '', count = 0;
	for(var i = 0; i < len; i++){
		var parent = $($('.selectable')[i]).parent();
		if(!parent.is(lastParent)) count = 0;
		if(count%5 == 4) $($('.selectable')[i]).addClass('five-grouper');
		lastParent = parent;
		count++;
	}
}
/*
	how to do this:
	One session will consist of 1 loop of the list; 
	it'll show the percentage correct at the end; 
	the task is to keep doing the sessions until 100%;
	Everyday, ones that took a long time will show up.  (Kinda like Khan Academy);




	make is so that the game object is byitself and only needs to be initlialized
	in the beginning
	Make the game pause if it stays still for too long. 
		-if mouse doesn't ever go over the four zones on the edge, 
		that means the student is using it, and shouldn't pause
		-otherwise, with no keystroke of any kind, it means the student is 
		not active
		-in that case, the program should pause
	
*/

(function($) {

	$.fn.randomize = function(tree, childElem) {
		return this.each(function() {
			var $this = $(this);
			if (tree) $this = $(this).find(tree);
			var unsortedElems = $this.children(childElem);
			var elems = unsortedElems.clone();

			elems.sort(function() { 
				return (Math.round(Math.random())-0.5); 
			});  

			for(var i=0; i < elems.length; i++)
				unsortedElems.eq(i).replaceWith(elems[i]);
		});    
	};

})(jQuery);

//for shuffling arrays
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

$(document).ready(function(){
	//console.log(word_list);
	//setting up
	decoys = word_list.slice(0);
	decoys = [];
	stat = {};
	for(var i = 0; i < word_list.length; i++){
		var w = word_list[i];
		//[# correct, # of attempts, time(ms)];
		stat[w[0]] = [0,0,0];
		decoys.push(w[1]);
	}
	var saved = false;

	max_decoy_count = Math.min(4, decoys.length-1);
	var current_choices = [];
	//Number of words exercised
	var count = 0;
	//var current_word = word_list.shift();
	newWord();
	timer.init();

	$('body').on('click', '#definition', function(){
		stat[current_word[0]][0]++;
		stat[current_word[0]][1]++;
		var t = timer.getInterval();
		stat[current_word[0]][2] += t;

		//remove the word if time is good
		var i;
		if(t < 7000){
			for(i = 0; i < word_list.length; i++){
				var w = word_list[i][0];
				if(current_word[0] == w) break;
			}
			if(i != word_list.length){
				word_list.splice(i, 1);
			}
		}

		newWord();

	})
	$('body').on('click', '.decoy', function(){
		stat[current_word[0]][1]++;
		$('body').randomize('#choices', '.choice');
	})

	$(window).on('beforeunload', function(){
		return 'YOUR PROGRESS IS NOT SAVED';
	});

	$('#save').click(function(){
		saved = true;
		$(window).off();
		$.ajax({
			url : 'process_vocab_performance.php',
			type : 'POST', 
			data: {
				'word_list' : arr,
				'set_name' : (function(){
					return $('#set_name').val();
				}())
			},
			success: function(response){
				console.log(response);
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.log('jqXHR.responseText:  ' + jqXHR.responseText);
				console.log('jqXHR.responseXML :  ' + jqXHR.responseXML);
				console.log('textStatus:   ' +  textStatus);
				console.log('errorThrown:   ' + errorThrown);
			},
			dataType : 'text' //type that I'm expecting back
		})
	})
	
	function newWord(){
		if(word_list.length > 0){	
			$('#choices').empty();
			current_choices = [];

			// put in the new word
			if(count%word_list.length == 0){
				count = 0;
				shuffle(word_list);
			}
			current_word = word_list.shift();
			$('#word').text(current_word[0]);
			current_choices.push(current_word[1]);

			// put in the decoys
			while(current_choices.length <= max_decoy_count){
				var r = Math.random() * (max_decoy_count+1);
				r = Math.floor(r);
				var decoy = decoys[r];
				if(current_choices.indexOf(decoy) == -1) current_choices.push(decoy);
			}

			for(var i = 0; i < current_choices.length; i++){
				var def = current_choices[i];
				$('#choices').append(function(){
					var temp = $('<div></div>').text(def).addClass('choice');
					if(i == 0) temp.attr('id', 'definition');
					else temp.addClass('decoy');
					return temp;
				});
			}

			$('body').randomize('#choices', '.choice');
			word_list.push(current_word);
			count++;
		} else {
			$('#save').click();
			$('#choices').empty();
			alert('You are done! Your performance is saved');
		}
	}

	$('#button').click(function(){
		newWord();
	})
});

var timer = {
	start: 0,
	end: 0,
	init : function(){
		this.start = new Date();
	}, 
	getTime : function(){
		return new Date() - this.start;
	},
	startTimer: function(){
		this.start = new Date();
	},
	getInterval: function(){
		var temp = this.getTime();
		this.startTimer();
		return temp;
	}
}
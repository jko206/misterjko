// to do: make the wordSets properties auto-generate the list in HTML

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

// https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
/* global $ */
var wordSets = {
	shorta : ["b.a.t", "c.a.t", "s.a.t", "m.a.t", "v.a.n", "t.a.n", "f.a.n"],

	shorte : ["k.e.t.ch.u.p", "s.e.t", "m.e.t.", "p.e.n", "t.e.n."],

	shorti : ["p.i.g", "sh.i.p", "s.k.i.p", "t.i.p", "h.i.p", "p.i.t", "k.i.t", "gr.i.p"],

	shorto : ["sh.o.p", "h.o.p", "h.o.t", "t.o.p", "p.o.t", "c.o.p"],

	shortu : ["k.e.t.ch.u.p", "u.p", "c.u.p", "f.u.n"],

	longa : ["t.ape", "s.afe", "c.ave", "w.ave", "c.ake", "v.ase", "c.ase",
		"p.ay", "ch.ai.r", "r.ai.n", "tr.ai.n", "p.ai.n", "l.ai.r", "f.ai.r", "ai.r",
		"gr.ape"],
		
	longe : ["t.ea.m", "m.ee.t", "m.ea.t", "s.ea.t", "k.ee.p", "ch.ea.p", "ch.ea.t", "p.ea.ch",
		"tr.ee", "f.ee.t", "y.ea.r", "ch.ee.se", "sh.ee.t", "s.ee", "p.ea", "p.ee", "s.ea", "s.ee", "f.ee",
		"ea.r", "t.ea.r", "f.ea.r", "r.ea.r", "g.ea.r", "ch.ee.r", "p.ee.r", "d.ea.r", "l.ee.r"],

	longi : ["gr.ipe", "m.ite", "s.ite", "k.ite", "b.ike", "m.ike"],

	longo : ["h.ope", "m.ore", "sh.ore", "t.ore", "c.ore", "st.ore", "t.oa.d", 
		"sl.ow", "s.oa.p", "sh.ow", "t.ow", "w.i.n.d.ow", "sn.ow"],
		//oat throat tore yore lore soar sore core boar board board store shore bore
		//snow show know row tow window mow crow hope rope rose nose pope cone tone dome foam bone moan
		//toast toad road boat coat stoat foal coal coast

	longu : ["c.ute", "m.ute", "f.ume"],

	nk : ["bl.ink", "bl.ank", "b.ank", "r.ank", "t.ank", "st.ink", "sl.ink", 
		"s.ink", "s.ank", "s.unk", "p.unk", "f.unk", "tr.unk", "fl.unk", "j.unk", "sh.ank"],
		
	ng : ["wr.ong", "s.ong", "tr.u.ck", "s.tr.ing", "l.eng.th", "s.tr.eng.th",
		"sl.ing", "s.ing", "bl.ing", "cl.ing", "f.ang", "b.ang", "s.ang", "s.ung", 
		"r.ing", "k.ing", "d.ing", "z.ing", "l.ong", "p.ang", "g.ong", "p.ing", "p.ong", "fl.ing"],

	ck : ["bl.a.ck", "d.e.ck", "s.a.ck", "p.e.ck", "p.i.ck", "r.o.ck", "m.o.ck", "s.i.ck", "tr.i.ck",
		"tr.u.ck", "b.a.ck", "p.a.ck", 
	],

	sh : ["sh.o.p", "sh.i.p", "f.i.sh", "sh.ank", "sh.u.t", "sh.ar.k", "sh.ar.p"],

	ch : ["ch.ur.ch", "ch.e.ck", "ch.a.nt", "ch.ai.r", "cr.u.n.ch", "p.u.n.ch", 
		"l.u.n.ch", "h.u.n.ch", "b.u.n.ch", "ch.ur.n"],
	
	ar : ["st.ar", "b.ar", "c.ar", "sh.ar.k", "sh.ar.p", "h.ar.p", "t.ar.t", "c.ar.t", "st.ar.t",
		"f.ar.t", "m.ar.t", "ar.t",
	],
	//er
	
	
	ur : ["ch.ur.ch", "p.ur.ple", "t.ur.tle", "ch.ur.n", "ur.n", "f.ur"],

	ir : ["s.k.ir.t", "b.ir.d", "f.ir", "g.ir.l", "s.ir"],
	// or
	nt : ["ch.ant", "t.ent", "t.int", "c.ent", "m.int", "d.ent", "r.ent", "ant", "l.ant.er.n", "ph.ant.om"],
	
	shortLongA : ['c.a.n', 'c.ane', 'm.a.n', 'm.ane', 's.a.ck', 's.ake', 'c.a.m', 'c.ame', 'b.a.n', 'b.ane',
		'v.a.n', 'v.ane', 'p.a.n', 'p.ane', 'r.a.t', 'r.ate', 'r.a.p', 'r.ape', 't.a.p', 't.ape', 'c.a.p.',
		'c.ape', 'f.a.t', 'f.ate'
	],
	
	shortLongI : ['f.i.n', 'f.ine', 't.i.n', 't.ine', 's.i.n', 's.ine', 'p.i.n', 'p.ine', 'k.i.t',
		'k.ite', 's.i.t', 's.ite', 'r.i.p', 'r.ipe', 'wh.i.p', 'w.ipe'
	],
	
	shortLongO : ['h.o.p', 'h.ope', 'c.o.p', 'c.ope', 'c.o.n', 'c.one', 'm.o.p', 'm.ope', 'b.o.n', 'b.one'
		
	],
	
	bdWords: ['b.e.d', 'b.a.d', 'b.o.d', 'b.u.d', 'b.i.d', 'd.i.b', 'd.u.b', 
		'b.o.b', 'd.u.d', 'd.ude', 'b.ide', 'd.a.d', 'd.a.b', 'b.ea.d', 
		'd.ee.d', 'b.i.b', 'd.i.d'
	],
}
var indices = [];
var currentPosition;
$(document).ready(function(){
	$('.phoneme-to-test').click(function(){
		$(this).toggleClass('selected');
		refreshIndices();
		currentPosition = -1;
		$('#next-button').click();
	});
	
	$('#panel-toggle').click(function(){
		var text = $(this).text();
		if(text == 'Hide'){
			$('#options').hide();
			$(this).text('Show');
		}
		if(text == 'Show'){
			$('#options').show();
			$(this).text('Hide');
		}
	});
	var generateCards = (function(){
		var index = 0;
		for(var phoneme in wordSets) {
			var arr = []; //for collecting the indices for a phoneme
			var set = wordSets[phoneme];
			for(var i = 0; i < set.length; i++){
				var card = $('#original-word-card')
					.clone(true)
					.removeAttr('id');
					//.addClass(phoneme);
				var temp = set[i];
				word = temp.replace(/\./g,'')
				card.find('.word').text(word);
				var phonemes = temp.split('.');
				var k = phonemes.length;
				for(var j = 0; j < k; j++){
					ph = phonemes[j];
					var phDiv = $('<div></div>')
						.addClass('phoneme')
						.text(ph);
					card.find('.phonemes').append(phDiv);
					getMagicE(phDiv, card);
				}
				$('#cards').append(card);
				arr.push(index);
				index++;
			}
			$('#' + phoneme + '-toggle').data('indices', arr);
		}
		//$('#cards').shuffleChildren();
		$('#original-word-card').remove();
		$('.phonemes').hide();
		$('.magic-e-section').hide();
	}());
	
	var cards = $('.word-card');
	$('#next-button').click(function(){
		cards.hide();
		currentPosition++;
		currentPosition = currentPosition.mod(indices.length);
		var n = indices[currentPosition];
		$(cards[n]).show();
		$('.phonemes').hide();
		$('.magic-e-section').hide();
	});
	
	$('#prev-button').click(function(){
		cards.hide();
		currentPosition--;
		currentPosition = currentPosition.mod(indices.length);
		var n = indices[currentPosition];
		$(cards[n]).show();
		$('.phonemes').hide();
		$('.magic-e-section').hide();
	});
	
	$('#toggle-word-phonemes').click(function(){
		if($('.phonemes').is(':visible')){
			$('.phonemes').hide();
			$('.magic-e-section').hide();
		} else {
			$('.phonemes').show();
		}
	});
	
	$('.phoneme.button').click(function(){
		if($('.magic-e-section').is(':visible')){
			$('.magic-e-section').hide();
		} else {
			$('.magic-e-section').show();
		} 
	});
		
	//present the first card by default (short A)
	$('#shorta-toggle').click();
});

// gets passed phoneme <div> p, and the card that contains it
// Must determine whether the given phoneme has "magic E," as
// Sean would call it.
// Ex: the word "hope" would be broken apart to "h" and "ope"
// 		This function will get passed ope. 
// 		1. make the phoneme clickable
// 		2. clicking will reveal how to make this sound
function getMagicE(p, card){
	var vowels = ['a', 'i', 'o', 'u'];
	var text = p.text();
	var firstLetter = text[0];
	var secondLetter = text[1];
	var lastLetter = text[2];
	//check if "magic e"
	if(text.length == 3 &&  $.inArray(firstLetter, vowels) >=0 && lastLetter == 'e'){
		p.addClass('button');
		card.find('.syllable').text(text);
		card.find('.magic-e').text('__' + firstLetter + '__e');
		card.find('.consonant').text(secondLetter);
	}
}

function refreshIndices(){
	indices = [];
	$('.selected').each(function(){
		var ind = $(this).data('indices');
		for(var i = 0; i < ind.length; i++){
			indices.push(ind[i]);
		}
	});
	var i = indices.length;
	while(--i >= 0){
		var r = Math.floor(Math.random() * i)
		var temp = indices[i];
		indices[i] = indices[r];
		indices[r] = temp;
	}
}	
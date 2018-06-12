/* This program, given a set of words, will generate either crossword puzzle or wordsearch
 * The comments will written as if 'apple', 'banana', 'orange', and 'carrot' have been 
 * passed as arguments
 */
 
 
 /**
  * **********Be able to combine discrete sets into one. 
  * 
  * Symbols:
  * 	- * : blank
  * 	- -: blocked
  * 
  * Directions: 
  * 		7	0   1
  * 		6	*	2
  * 		5	4	3
  * '*' to a number is the direction. For example left to right would be 2, 
  * and top right to bottom left would be 5
  * 
  * 
  * Returns answer key for either crossword puzzle or word search
  * allowDiagonal 
  * allowBackwards
  */
//function getPuzzles(options, ...words){
	
	/*
	function checkDuplicates(words){
		let giantWordString = words.join('');
		for(let i = 0; i < words.length; i++){
			let word = words[i];
			let regex = new RegExp(word, 'g');
			let matches = giantWordString.match(regex);
			if(matches.length > 1) 
				throw new Error(`Duplicate word found: ${word}. 
					Duplicate count: ${matches.length - 1}`);
		}
	}
	
	function padTopBottom(piece, padCount){
		let width = piece.width;
		let pad = (width)=>{
			let str = '';
			while(width){
				str += '*';
				str--;
			}
			return str;
		}
		while(padCount){
			piece.puzzle.push(pad);
			piece.shift(pad);
			padCount--;
		}
		piece.height += padCount * 2;
	}
	
	function padSides(piece, padCount){
		
	}
	
	
	/*  For each letter's position (n, m) on the grid, 
	 *  the function will return a new word so that each
	 *  word's position is now (m, n)
	*
	function transpose(puzzle, width, height, trimEnd){
		let str = '';
		for(let i = 0; i < width; i++){
			for(let j = 0; j < height; j++){
				let char = puzzle[j * width + i];
				str += char ? char : '*';
			}
		}
		return trimEnd ? str.match(/([a-zA-Z]+\*+)+[a-zA-Z]/).shift() : str;
	}
	
	/**
	 *  Only deals with vertical words
	 *   shiftRight(cat)
	 *   Given			Returns
	 *   *C***          **C**
	 *   *A***    =>    **A**
	 *   *T***          **T**
	 *  Returns the original word if all the way to the right
	 **
	function shiftRight(word, spaces = 1){
		word = word.split('');
		let lastChar = word[word.length - 1];
		while(spaces && lastChar == '*'){
			word.pop();
			word.unshift('*');
			lastChar = word[word.length - 1];
			spaces--;
		}
		return word.join('');
	}
	
	**/
	function hasOnlyAlphabets(words){
		let str = words.join('').toUpperCase();
		return /^[A-Z]+$/.test(str);
	}
	
	function makeRoom(piece, room){
		function getFiller(size){
			let filler = '';
			while(size){
				filler += '*';
				size--;
			}
			return filler;
		}
		let {padding, puzzle, width, height} = piece;
		let {left, right, top, bottom} = padding;
		let leftFiller = left > room ? '' : getFiller(room - left);
		let rightFiller = right > room ? '' : getFiller(room - right);
		let length = puzzle.length;
		console.log(`rightFiller: ${rightFiller}, \tleftFiller: ${leftFiller}, \tlength: ${length}, \tpuzzle: ${puzzle}`);
		while(length){
			let chunk = puzzle.substr(0, width);
			puzzle = puzzle.substr(width);
			puzzle += (leftFiller + chunk + rightFiller);
			
			length -= width;
			console.log(`length: ${width}, \tpuzzle: ${puzzle}`);
		}
		width += (leftFiller + rightFiller).length;
		left = right = room;
		
		let rowFiller = getFiller(width);
		while(room > top){
			puzzle = rowFiller + puzzle;
			height++;
			top++;
		}
		
		while(room > bottom){
			puzzle += rowFiller;
			height++;
			bottom++;
		}
		
		padding = {left, right, top, bottom};
		return {padding, puzzle, width, height};
	}

	function getPaddings(piece){
		let left = Infinity, right = Infinity, top = -1, bottom,
			{puzzle, width, height} = piece;
		//get top and bottom
		for(let i = 0; i < puzzle.length; i++){
			let char = puzzle[i];
			if(!(char == '*' || char == '-')){ // if non blank or blocked cell
				//get top
				let temp = Math.floor(i / width);
				top = top == -1 ? temp : top;
				
				//get bottom
				temp = i / width;
				temp = parseInt(temp, 10) == temp ? temp + 1 : temp;
				bottom = height - Math.ceil(temp);
				
				//get left and right
				temp = i % width;
				left = temp < left ? temp : left;

				temp = width - temp - 1;
				right = temp < right ? temp : right;
			}
		}

		return {left, right, top, bottom};
	}
	/** makeVertical('CAT', 5) => C****A****T****
	 * 
	 * In 3 x 5 grid =>
	 * C****
	 * T****
	 * A****
	 */
	function makeVertical(word, width, trimEnd){
		let str = '', filler = '';
		while(filler.length < width-1){
			filler += '*';
		}
		for(var i = 0; i < word.length - 1; i++){
			str += word[i] + filler;
		}
		str += word[i] + (trimEnd? '' : filler);
		return str;
	}
	
	
	function crossWords(pieces){
		
		/**
		 *	If must cross, puzzle and the word must cross. Else, just fit them 
		 *  together wherever possible. 
		 * 
		 * returns an array of object: {puzzle, index}
		 *		-puzzle: the new puzzle with the word in it.
		 *		-index: where the word is inserted
		 **/
		function wordCrosser(puzzle, word, width, height, direction, mustCross){
			let crossed = [];
			
			outerLoop : for(let i = 0; i < puzzle.length - word.length + 1; i++){
				if((i % width) + word.length > width) continue outerLoop;
				let didCross = false, didClash = false;
				let insertChunk = puzzle.substr(i, word.length); // part that will intersect with word
				let preInsert = puzzle.substring(0, i);
				let postInsert = puzzle.substr(i + word.length);
				let combinedChunk = '';
				let index = -1;
				// Actual crossing
				innerLoop : for(let j = 0; j < word.length; j++){
					let char1 = word[j], char2 = insertChunk[j];
					if(char1 == '*') combinedChunk += char2;
					else if(char2 == '*') combinedChunk += char1;
					else if(char1 == char2){
						if(index == -1) index = i;
						combinedChunk += char1;
						didCross = true;
					} else {
						didClash = true;
						break innerLoop;
					}
				}
				if((mustCross && didCross && !didClash) || !mustCross){
					let newPuzzle = preInsert + combinedChunk + postInsert;
					crossed.push({puzzle: newPuzzle, direction, index});
				} 
					
			}
			//return either 0 or the array of crossed words
			return crossed.length && crossed;
		}
		
		let loopBreaker = 0;
		puzzlesLoop: while(pieces.length){
			// Insurance against infinite loop
			if(loopBreaker == 100000){
				console.log('puzzlesLoop exceeded 100,000 loops');
				console.log(`Complete: ${JSON.stringify(complete)}`);
				break puzzlesLoop;
			}
			loopBreaker++;
			let piece = pieces.shift();
			let {
				words, 
				wordsToFit, 
				wordCount, 
				unfitWords,
				//padding, 
				height,
				width,
				puzzle
			} = piece;
			if(!wordsToFit.length){
				complete.push(piece);
			} else if(wordsToFit.isSameAs(unfitWords)){
				// Do something with discete pieces.
			} else {
				let word = wordsToFit.shift();
				word = '-' + word + '-';
				piece = makeRoom(piece, word.length);
				
				//Cross the word with the existing puzzle
				// Fit the word horizontally...
				let crossedWords = wordCrosser(puzzle, word, width, height, 2, true);
				
				// ...then vertically.
				word = makeVertical(word, width, true);
				let crossedWords2 = wordCrosser(puzzle, word, height, width, 4, true);
				
				crossedWords.splice(crossedWords.length, 0, crossedWords2);
				
				// Word successfully crossed with puzzle
				if(crossedWords.length){
					crossedWords.each(function(elem, i, arr){
						
						/***************************************************/
						/****************WORD CROSSER RETURNS INDEX*********/
						/***************************************************/
						/****************WORK ON THIS SO THE WORDS LIST*****/
						/****************CONTAINS THE INDEX AND DIRECTION***/
						/****************AS WELL****************************/
						let newPiece = {
							puzzle: elem.puzzle,
							words: words.push({
								word,
								index: elem.index,
								direction: elem.direction
							}),
							wordsToFit: wordsToFit.clone(),
							wordCount: ++wordCount,
							unfitWords: unfitWords.clone(),
							padding: getPaddings(piece),
							height: piece.height,
							width: piece.width
						};
						pieces.push(newPiece);
						console.log(newPiece);
					});
				
				//Word couldn't fit into the puzzle
				} else {
					unfitWords.push(word);
					wordsToFit.push(word); // put the word at the back if it failed to cross any.
				}
				
			}
			
		}
		
		console.log(`loops: ${loopBreaker}`);
		
	}
	
	//pre process
	words.forEach(function(e, i, arr){
		arr[i] = e.toUpperCase;	
	});
	if(!hasOnlyAlphabets(words)) throw new Error('Puzzle can only be created with alphabets.');
	
	//init
	let {isCrossword, allowDiagonal, allowBackwards} = options;
	let complete = [];
	
	let firstWord = words.shift();
	let puzzles = [
		{
			puzzle: '-' + firstWord + '-',
			words: [
				{
					word: firstWord,
					index: 0,
					direction: '2'
				}
			],
			wordsToFit: words.clone(),
			unfitWords: [],
			wordCount: 1,
			padding: {left: 0, right: 0, top: 0, bottom: 0},
			height: 1,
			width: firstWord.length
		}
	]
	
	crossWords(puzzles);
	
	return complete;
}

Array.prototype.clone = function(){
	let other = [];
	this.forEach(function(e, i, arr){
		other.push(e);
	});
	return other;
};

Array.prototype.isSameAs = function(other){
	
	for(let i = 0; this.length; i++){
		if(this[i] != other[i]) return false;
	}
	return this.length == other.length;
}

Array.prototype.hasSameElementsAs = function(other){
	let sortedArray = this.clone().sort();
	other.sort();
	for(let i = 0; i < sortedArray.length; i++){
		if(sortedArray[i] != other[i]) return false;
	}
	return sortedArray.length == other.length;
}

// Array.prototype.addRows = function(n, addBefore = true, currentW, currentH){
// 	let loops = n * currentW;
// 	let method = addBefore ? 'unshift' : 'push';
// 	while(loops){
		
// 		loops--;
// 	}
// }

// Array.prototype.addCols = function(n, addBefore = true, currentW, currentH){
	
// }
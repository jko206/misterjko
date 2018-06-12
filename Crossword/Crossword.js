/* 
 * This program, given a set of words, will generate either crossword puzzle or wordsearch
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

function getPuzzles(words, options){
	function hasOnlyAlphabets(words){
		let str = words.join('').toUpperCase();
		return /^[a-zA-Z]+$/.test(str);
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
		room++;
		let {padding, puzzle, width, height} = piece;
		let {left, right, top, bottom} = padding;
		let leftFiller = left > room ? '' : getFiller(room - left);
		let rightFiller = right > room ? '' : getFiller(room - right);
		let length = puzzle.length;
		while(length){
			let chunk = puzzle.substr(0, width);
			puzzle = puzzle.substr(width);
			puzzle += (leftFiller + chunk + rightFiller);
			
			length -= width;
			// console.log(`length: ${width}, \tpuzzle: ${puzzle}`);
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
		piece.padding = {left, right, top, bottom};
		piece.puzzle = puzzle;
		piece.height = height;
		piece.width = width;
		return piece;
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
	 * 
	 * makeVertical('CAT', 5, true) => C****A****T
	 * 
	 * In 3 x 5 grid =>
	 * C****
	 * T****
	 * A
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
	
	function wordCrosser(puzzle, word, width, height, direction, mustCross, blockCorners){
		function cornerBlocker(puzzle, crossPoint){
			puzzle = puzzle.split('');
			let dirs = {
				n : puzzle[crossPoint - width],
				ne: puzzle[crossPoint - width + 1],
				e : puzzle[crossPoint + 1],
				se: puzzle[crossPoint + width + 1],
				s : puzzle[crossPoint + width],
				sw: puzzle[crossPoint + width - 1],
				w:  puzzle[crossPoint - 1],
				nw: puzzle[crossPoint + width - 1]
			};
			let validChar = /^([A-Z]){1,1}$/;
			if(validChar.test(dirs.n)){
				//NorthEast corner
				if(validChar.test(dirs.e)){
					if(dirs.ne == '*') puzzle[crossPoint - width + 1] = '-';
					else return false;
				}
				//NorthWest corner
				if(validChar.test(dirs.w)){
					if(dirs.ne == '*') puzzle[crossPoint - width - 1] = '-';
					else return false;
				}
			}
			if(validChar.test(dirs.s)){
				//SouthEast corner
				if(validChar.test(dirs.e)){
					if(dirs.ne == '*') puzzle[crossPoint + width + 1] = '-';
					else return false;
				}
				//SouthWest corner
				if(validChar.test(dirs.w)){
					if(dirs.ne == '*') puzzle[crossPoint + width - 1] = '-';
					else return false;
				}
			}
			return puzzle.join('');
		}
		let crossed = [];
		outerLoop : for(let i = 0; i < puzzle.length - word.length + 1; i++){
			//For horizontal only; this makes sure the word doesn't loop to next line
			if((direction == 2 || direction == 6) 
				&& (i % width) + word.length > width) continue outerLoop;
			let didCross = false, didClash = false,  index = -1, crossPoint = -1;
			let beforeTarget = puzzle.substring(0, i);
			let targetChunk = puzzle.substr(i, word.length); // part that will intersect with word
			let afterTarget = puzzle.substr(i + word.length);
			let combo = '';
			if(mustCross && !/[A-Z]+/.test(targetChunk)) continue outerLoop;
			// Actual crossing
			innerLoop : for(let j = 0; j < word.length; j++){
				let char1 = word[j], char2 = targetChunk[j];
				if(char1 == '*') combo += char2;
				else if(char2 == '*') combo += char1;
				else if(char1 == char2 && char1 != '-'){
					if(index == -1){
						index = i;	
						crossPoint = i + j + 1;
					} 
					combo += char1;
					didCross = true;
					//console.log('crossing');
				} else {
					didClash = true;
					//console.log('clashed');
					break innerLoop;
				}
			}
			if((mustCross && didCross && !didClash) || !mustCross){
				let newPuzzle = beforeTarget + combo + afterTarget;
				if(blockCorners){
					newPuzzle = cornerBlocker(newPuzzle, crossPoint);
					if(!newPuzzle) continue outerLoop;
				}
				
				crossed.push({puzzle: newPuzzle, direction, index});
			} 
				
		}
		//return either 0 or the array of crossed words
		return crossed.length && crossed;
	}
	
	
	function crossWords(pieces){
		// let looper = 0;
		/**
		 *	If must cross, puzzle and the word must cross. Else, just fit them 
		 *  together wherever possible. 
		 * 
		 * returns an array of object: {puzzle, index}
		 *		-puzzle: the new puzzle with the word in it.
		 *		-index: where the word is inserted
		 **/
		puzzlesLoop: while(pieces.length && complete < 20){

			let piece = pieces.shift();
			let {wordsToFit, unfitWords} = piece;
			if(!wordsToFit.length){
				complete.push(piece);
			} else if(wordsToFit.isSameAs(unfitWords)){
				// Do something with discete pieces.
			} else {
				for(let i = 0; i < wordsToFit.length; i++){
					// let word = wordsToFit.shift();
					let wordsToFitFront = wordsToFit.splice(0, i);
					let word = wordsToFit.shift();
					let wordsToFitBack = wordsToFit;
					let wordsToFitClone = [];
					wordsToFitClone.splice(0, 0, ...wordsToFitFront, ...wordsToFitBack)
					
	
					piece = makeRoom(piece, word.length+2); // two for the wrapping '-'
					let {
						words,  
						height,
						width,
						puzzle
					} = piece;
					let crossedWords = [];
					//Cross the word with the existing puzzle
					// Fit the word horizontally...
					let crossedWords1 = wordCrosser(puzzle, `-${word}-`, width, height, 2, true);
					
					// ...then vertically.
					let wordPuzzle = makeVertical(`-${word}-`, width, true);
					let crossedWords2 = wordCrosser(puzzle, wordPuzzle, height, width, 4, true);
					
					if(crossedWords1.length) crossedWords = crossedWords1;
					if(crossedWords2.length) crossedWords.splice(crossedWords.length, 0, ...crossedWords2);
					
					// Word successfully crossed with puzzle
					if(crossedWords.length){
						crossedWords.forEach(function(elem, i, arr){
							 let newWords = words.clone();
							 newWords.push({
								word,
								index: elem.index,
								direction: elem.direction
							});
							let newPiece = {
								puzzle: elem.puzzle,
								words: newWords,
								wordsToFit: wordsToFitClone.clone(),
								wordCount: newWords.length,
								unfitWords: unfitWords.clone(),
								padding: getPaddings(piece),
								height: piece.height,
								width: piece.width
							};
							pieces.push(newPiece);
						});
					
					//Word couldn't fit into the puzzle
					} else {
						unfitWords.push(word);
						wordsToFit.push(word); // put the word at the back if it failed to cross any.
					}
					let temp = [];
					temp.splice(0,0, ...wordsToFitFront, word, ...wordsToFitBack);
					wordsToFit = temp;
				}
				
			}
			
		}
		
		
		
	}
	
	/////////////////////////////////
	///////HELPER FUNCTIONS ENDS/////
	/////////////////////////////////
	//pre process
	// See if it only has alphabets
	if(!hasOnlyAlphabets(words)) throw new Error('Puzzle can only be created with alphabets.');
	// Make everything and check if all the words are more than one letter,
	// and 
	words.forEach(function(e, i, arr){
		arr[i] = e.toUpperCase();	
	});
	
	//init
	if(options) var {isCrossword, allowDiagonal, allowBackwards, allowOverlapping} = options;
	let complete = [];
	
	
	for(let i = 0; i < words.length; i++){
		let front = words.splice(0, i);
		let word = words.splice(0, 1)[0];
		let back = words;
		let temp = [];
		temp.splice(0,0, ...front, ...back);
		
		let pieces = [
			{
				puzzle: '-' + word + '-',
				words: [
					{
						word,
						index: 0,
						direction: 2
					}
				],
				wordsToFit: temp.clone(),
				unfitWords: [],
				wordCount: 1,
				padding: {left: 0, right: 0, top: 0, bottom: 0},
				height: 1,
				width: word.length + 2 // because of the '-' at both ends.
			}
		]
		
		crossWords(pieces);
		//Stitch things back
		front.splice(i, 0, word, ...back);
		words = front;
	}
	
	
	
	
	console.log('finished');
	return complete;
}

Array.prototype.clone = function(deepClone = true){
	let other = [];
	this.forEach(function(e, i, arr){
		if(e instanceof Object || e instanceof Array) e = e.clone(true);
		other.push(e);
	});
	return other;
};

// TODO: search deep.
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

// TODO: Make it clone property attributes
Object.prototype.clone = function(deepClone = true){
	let obj = {};
	Object.assign(obj, this);
	return obj;
}

function conductTest(wordSetID){
	let wordSets = [
		['apple', 'banana', 'carrot'],
		['apple', 'carrot', 'banana'],
		['scissors', 'lenovo', 'computer', 'earphones', 'apple'],
	];
}


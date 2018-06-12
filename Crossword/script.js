/* global getPuzzles $*/


let PUZZLE_CELL_NEIGHBORS = {};
let MAX_PUZZLE_LENGTH = 10;

$(document).ready(function(){
	let caption = 'Separate words with comma.';
	$('#puzzle-words-input').focus(function(){
		let text = $(this).text().trim();
		if(text == caption) $(this).text('');
	}).blur(function(){
		let text = $(this).text().trim();
		if(text == '') $(this).text(caption);
	});
	
	$('#submit-words').click(function(){
		let text = $('#puzzle-words-input').text();
		if(text != caption){
			makePuzzle(text, $('#puzzle-cont'));
		}
	});
	
	// Navigating the crossword puzzle with keyboard arrow keys
	$('.puzzle-cont').on('keydown', '.puzzle-cell', function(event){
		let key = event.which;
		let direction = 
			(key == 37 && 'left') ||
			(key == 38 && 'above') ||
			(key == 39 && 'right') ||
			(key == 40 && 'below') ||
			false;
		if(direction){
			event.preventDefault();
			let cellID = $(this).data('cell-id');
			let neighbor = PUZZLE_CELL_NEIGHBORS[cellID][direction];
			//console.log(neighbor);
			if(neighbor) $(neighbor).trigger('focus');
		}
	});
	
});


let ids = [];
let ingredients = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function getRandomID(){
	let length = 10, str = '';
	while(length){
		let r = Math.floor(Math.random() * ingredients.length);
		str += ingredients[r];
		length--;
	}
	if(ids.indexOf(str) == -1){
		ids.push(str);
		return str;
	} else {
		return getRandomID();
	}
	
}


function makePuzzle(input, container){
	$('#puzzle-words-input').text('Wait a moment...');
		input = input.split(',');
		for(let i = 0; i < input.length; i++){
			input[i] = input[i].trim().toUpperCase();
		}
		try {
			let puzzles = getPuzzles(input);
			let puzzleLength = MAX_PUZZLE_LENGTH < puzzles.length 
				? MAX_PUZZLE_LENGTH : puzzles.length;
			while(puzzleLength){
				let puzzleBoard = $('<div class="puzzle-board"></div>');
				let tempArray = [];
				let piece = puzzles.shift();
				let {puzzle, width, height} = piece;
				puzzleBoard.width(width * 25).height(height * 25);
				for(let i = 0; i < puzzle.length; i++){
					let char = puzzle[i];
					// let cell = $(`<td class="puzzle-cell"></td>`); 
					let isAlphabet = /(^[A-Z])$/.test(char);
					let cell = $(`<div class="puzzle-cell">${isAlphabet ? char : ''}</div>`);
					cell.addClass(isAlphabet ? 'white-cell' : 'black-cell');
					cell.prop('contenteditable', isAlphabet);
					let cellID = getRandomID();
					cell.data('cell-id', cellID);
					if(isAlphabet) tempArray.push({
						cell, 
						index: i,
						rowIndex: i % width,
						
					});
					$(puzzleBoard).append(cell);
				}
				$(container).append(puzzleBoard);
				
				// link cells for arrow navigation
				for(let i = 0; i < tempArray.length; i++){
					let thisCellObj = tempArray[i];
					let thisCell = thisCellObj.cell;
					let thisRowIndex = thisCellObj.rowIndex;
					let cellID = thisCell.data('cell-id');
					let neighbors = {};
					
					if(i > 0){
						let leftCellObj = tempArray[i - 1];
						neighbors.left = leftCellObj.cell;
					}
					
					searchLeft: for(let j = i - 1; j >= 0; j--){
						let prevCellObj = tempArray[j];
						if(prevCellObj.rowIndex == thisRowIndex){
							neighbors.above = prevCellObj.cell;
							break searchLeft;
						}
					}
					
					if(i < tempArray.length - 1){
						let rightCellObj = tempArray[i + 1];
						neighbors.right = rightCellObj.cell;
					}
					searchRight: for(let k = i + 1; k < tempArray.length; k++){
						let nextCellObj = tempArray[k];
						if(nextCellObj.rowIndex == thisRowIndex){
							neighbors.below = nextCellObj.cell;
							break searchRight;
						}
					}
					PUZZLE_CELL_NEIGHBORS[cellID] = neighbors;
				}
				puzzleLength--;
			}
		} catch (e){
			// $('#crossword-submission-msg').text(e.message);
			console.log(e);
		}
}
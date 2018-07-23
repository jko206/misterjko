'use strict';
/*global $*/

/** This is the fourth attempt, after learning that this is actually a
 * NP Complete problem. Wikipedia also says a solution can be found in linear
 * time, which doesn't seem to make sense. 
 * 
 * This time, I'm going to find a solution to a 4x4 board first, 
 * and stitch together 4 of those to create a 8x8 board solution.
 * 
 * The 4x4 board's solution will be found by using Warnsdorff's rule, and 
 * Arnd Roth's proposition to break ties.
 * 
 * https://stackoverflow.com/questions/8402648/how-to-improve-knights-tour-with-warnsdorffs-rule
 */
function coordToIndex(x,y){
	return y*8 + x;
}
function indexToCoord(idx){
	return {
		x: idx%8,
		y: Math.floor(idx/8)
	}
}

const KnightsTour = (function(){
	let cells = [];
	let directions = [
		{x:  1,	y:	2},		{x:  2,	y:	1},
		{x:  2,	y: -1},		{x:  1, y: -2},
		{x: -1, y: -2},		{x: -2, y: -1},
		{x: -2, y:  1},		{x: -1, y:  2}
	];
	
	function Cell(index, x, y){
		this.index = index;
		this.x = x;
		this.y = y;
		
		//Euclidean distance from the center 
		let x1 = x >= 4 ? x - 4 : 3 - x;
		let y1 = y >= 4 ? y - 4 : 3 - y;
		this.d = x1 * x1 + y1 * y1; // because it's only for comparison, no need to root
		this.isVisited = false;
	}
	// Initially, # of neighbors == # of landables
	Cell.prototype.setNeighbors = function(){
		this.neighbors = [];
		for(let i = 0; i < 8; i++){
			let dir = directions[i];
			let dx = dir.x, dy = dir.y;
			let x1 = this.x + dx, y1 = this.y + dy;
			let isValidX = 0 <= x1 && x1 < 8;
			let isValidY = 0 <= y1 && y1 < 8;
			if(isValidX && isValidY){
				let idx = coordToIndex(x1, y1);
				let c = cells[idx];
				this.neighbors.push(c);
			}
		}
		this.landables = this.neighbors.length;
	}
	
	Cell.prototype.notifyNeighbors = function(increment){
		this.neighbors.forEach(function(e){
			if(increment) e.landables++;	
			else e.landables--;	
		});
	}
	
	//sort by number of landables
	Cell.prototype.sortNeighbors = function(){
		this.neighbors.sort((a,b)=>{
			if(a.landables == b.landables) return b.d - a.d;	//Arnd Roth's proposition
			return a.landables - b.landables;					//Warnsdorff's Rule
		});
	}
	
	function init(){
		// Make cells
		for(let i = 0; i < 64; i++){
			let {x,y} = indexToCoord(i);
			let c = new Cell(i, x, y);
			cells.push(c);
		}
		cells.forEach(function(cell,i,arr){
			cell.setNeighbors();
		});
		return cells;
	}
	
	function getSolution(x, y){
		function recourse(cell){
			if(path.length == 64){
				return true;
			} else {
				cell.sortNeighbors();
				let {neighbors} = cell;
				for(let i = 0; i < neighbors.length; i++){
					let n = neighbors[i];
					if(!n.isVisited){
						let nIdx = n.index;
						path.push(nIdx);
						n.notifyNeighbors();
						
						// Explore depth
						n.isVisited = true;
						let result = recourse(n);
						if(result) return true;
						
						// After exploring
						n.notifyNeighbors(true);
						path.pop();
						n.isVisited = false;
					}
				}
			}
		}
		let initIdx = coordToIndex(x, y);
		let initCell = cells[initIdx];
		let path = [initIdx];
		initCell.notifyNeighbors();
		initCell.isVisited = true;
		
		let t0 = new Date();
		let result = recourse(initCell);
		let t1 = new Date();
		console.log((t1-t0)/1000 +'sec');
		return result && path;
	}
	
	// For console solution printing
	
	function reset(){
		cells = [];
		init();
	}
	return {
		init,
		getSolution, 
		reset
	}
}());


function KnightsTourGUI(cont){
	let board = `<div id="knight-gui-board">`;
	let getCell = function(x, y){
		let index = coordToIndex(x, y);
		return `<div class="knight-gui-cell" data-index="${index}"></div>`;
	}
	for(let i = 0; i < 8; i++){
		let row = '<div class="knight-gui-row">'
		for(let j = 0; j < 8; j++)row += getCell(j, i);
		row += `</div>`;
		board += row;
	}
	board += `</div>`;
	/*$(`
		<style id="knight-gui-style">
			#knight-gui{
				background-color: #f7f7f7;
				position: relative;
				padding: 40px;
				border: 1px solid black;
			}
			#knight-gui-board{
			    background-color: #ccc;
			    height: 720px;
			    width: 720px;
			    position:relative;
			    margin: auto;
			}
			.knight-gui-row{
				position: relative;
			}
			.knight-gui-cell{
				width: 90px;
				height: 90px;
				background-color: #bbb;
				float: left;
				font-size: 40px;
				font-family: monospace, sans-serif;
				text-align: center;
				line-height: 2;
				vertical-align: bottom;
				position: relative;
			}
			.knight-gui-row:nth-child(odd) .knight-gui-cell:nth-child(even){
			    background-color: white;
			}
			.knight-gui-row:nth-child(odd) .knight-gui-cell:nth-child(even):hover{
			    background-color: #ddd;
			}
			.knight-gui-row:nth-child(even) .knight-gui-cell:nth-child(odd){
			    background-color: white;
			}
			.knight-gui-row:nth-child(even) .knight-gui-cell:nth-child(odd):hover{
			    background-color: #ddd;
			}
			.knight-gui-cell:hover{
			    cursor:pointer;
			    background-color: #ddd;
			}
			
			.knight-gui-cell-curr:after{
			    content: url('Knight-64.png');
			    position: absolute;
			    top: 13px;
			    left: 13px;
			}
			
			#knight-gui-controls{
			    background-color: #ccc;
			    width: 720px;
			    height: 40px;
			    margin: 20px auto;
			    position: relative;
			}
			#knight-gui-prompt{
			    font-size: 30px;
			    text-align: center;
			}
			
			#knight-gui-btns{
			    display: none;
			}
			
			#knight-gui-btns div{
			    height: 40px;
			    width: 90px;
			    font-size: 25px;
			    background-color: #aaa;
			    border-radius: 10px;
			    text-align: center;
			    line-height: 1.5;
			    position: absolute;
			}
			#knight-gui-btns div:hover{
			    background-color: #ccc;
			    cursor: pointer;
			}
			#knight-gui-prev{
			    left: 260px;
			}
			#knight-gui-next{
			    left: 370px
			}
			#knight-gui-reset{
			    right: 20px;
			}
			.knight-gui-arrow{
			    border-top: 3px solid black;
			    width: 200px;
			    position: absolute;
			    top: 45px;
			    left: 45px;
			    transform: rotate(170deg);
			}
			.knight-gui-arrow:after{
			    content: '';
			    border-top: 3px solid black;
			    border-left: 3px solid black;
			    width: 10px;
			    height: 10px;
			    position: absolute;
			    top: -7.6px;
			    transform:rotate(-45deg);
			}
		</style>
		<div id="knight-gui">
			${board}
			<div id="knight-gui-controls">
				<div id="knight-gui-prompt">
					Click initial position.
				</div>
				<div id="knight-gui-btns">
					<div class="button" id="knight-gui-prev">PREV</div>
					<div class="button" id="knight-gui-next">NEXT</div>
					<div class="button" id="knight-gui-reset">RESET</div>
				</div>
			</div>
		</div>
	`).appendTo(cont);*/
	$(`
		<style id="knight-gui-style">
			#knight-gui{
				background-color: #f7f7f7;
				position: relative;
				padding: 40px;
				border: 1px solid black;
			}
			#knight-gui-board{
		    background-color: #ccc;
		    width: 100%;
		    overflow: auto;
		    position: relative;
		    margin: auto;
			}
			.knight-gui-row{
				position: relative;
			}
			.knight-gui-cell{
				width: 12.5%;
  			padding-top: 12.5%;
				background-color: #bbb;
				float: left;
				font-size: 40px;
				font-family: monospace, sans-serif;
				text-align: center;
				line-height: 2;
				vertical-align: bottom;
				position: relative;
			}
			.knight-gui-row:nth-child(odd) .knight-gui-cell:nth-child(even){
			    background-color: white;
			}
			.knight-gui-row:nth-child(odd) .knight-gui-cell:nth-child(even):hover{
			    background-color: #ddd;
			}
			.knight-gui-row:nth-child(even) .knight-gui-cell:nth-child(odd){
			    background-color: white;
			}
			.knight-gui-row:nth-child(even) .knight-gui-cell:nth-child(odd):hover{
			    background-color: #ddd;
			}
			.knight-gui-cell:hover{
			    cursor:pointer;
			    background-color: #ddd;
			}
			
			.knight-gui-cell.knight-gui-cell-curr {
			  background-image: url(Knight-64.png);
			  background-size: contain;
			}
			.knight-gui-cell span {
			  position: absolute;
			  height: 100%;
			  top: 0;
			  display: block;
			  width: 100%;
			  left: 0;
			  font-size: 2rem;
			  line-height: 1.75;
			}
			
			#knight-gui-controls{
			  width: 100%;
			  height: 2rem;
			  margin: 20px auto;
			  position: relative;
			  font-size: 1.5rem;
			  text-align: center;
			  display: flex;
			  align-items: center;
				justify-content: space-evenly;
			}
			#knight-gui-prompt{
			  font-size: 30px;
			  text-align: center;
			  background: gray;
			  border-radius: 5px;
			  padding: 5px;
			  color: white;
			}
			
			#knight-gui-btns{
			    display: none;
			}
			
			#knight-gui-controls .button{
			  width: 100px;
			  border: 1px solid black;
			  padding: 5px;
			  border-radius: 5px;
			  display: none;
			}
			#knight-gui-btns div:hover{
			    background-color: #ccc;
			    cursor: pointer;
			}
		</style>
		<div id="knight-gui">
			${board}
			<div id="knight-gui-controls">
				<div id="knight-gui-prompt">
					Click initial position
				</div>
				<div class="button" id="knight-gui-prev">PREV</div>
				<div class="button" id="knight-gui-reset">RESET</div>
				<div class="button" id="knight-gui-next">NEXT</div>
			</div>
		</div>
	`).appendTo(cont);
	KnightsTour.init();
	
	// States
	
	let solution, currSolIndex, isInit;
	$('#knight-gui').ready(function(){
		// Click a cell to initialize
		$('.knight-gui-cell').click(function(){
			if(!isInit){
				isInit = true;
				let index = $(this).data('index');
				$('#knight-gui-prompt').hide();
				$('#knight-gui-controls .button').show();
				let {x, y} = indexToCoord(index);
				solution = KnightsTour.getSolution(x, y); 
				
				currSolIndex = 0;
				$(this).addClass('knight-gui-cell-curr');
				// Sconsole.log(solution);
			}

		});
		// [[NEXT]] moves it to the next cell
		$('#knight-gui-next').click(function(){
			if(currSolIndex < 64){
				//take care of last move
				let index = solution[currSolIndex];
				let cell = $('.knight-gui-cell')[index];
				$(cell).removeClass('knight-gui-cell-curr')
					.html(`<span>${currSolIndex + 1}</span>`);
				
				//mark the new move
				index = solution[++currSolIndex];
				cell = $('.knight-gui-cell')[index];
				$(cell).addClass('knight-gui-cell-curr').text('');
			}
		});
		
		// [[PREV]] moves it to the previous cell
		$('#knight-gui-prev').click(function(){
			//take care of last move
			if(currSolIndex > 0){
				let index = solution[currSolIndex];
				let cell = $('.knight-gui-cell')[index];
				$(cell).removeClass('knight-gui-cell-curr').text('');
				
				//mark the new move
				index = solution[--currSolIndex];
				cell = $('.knight-gui-cell')[index];
				$(cell).addClass('knight-gui-cell-curr').text('');
			}
		});
		
		// [[RESET]] click it to reset the board
		$('#knight-gui-reset').click(function(){
			$('.knight-gui-cell-curr').removeClass('knight-gui-cell-curr');
			$('.knight-gui-cell').text('');
			$('#knight-gui-prompt').show();
			$('#knight-gui-controls .button').hide();
			KnightsTour.reset();
			solution = undefined;
			isInit = false;
			currSolIndex = undefined;
		});
	});
}
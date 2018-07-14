'use strict';

var globglob;

/*
global $

Basically, KenKen determines possible solutions for EACH cage,
and tries to combine compatible ones into a super cage, until there are
no more cages from which to draw a compatible solution.

1. get the set of all possible solution for cages
	A. get a set of numbers whose operation will yield the target
	B. create permutation of the set from step A., and only save
		the valid ones (use Box).
	C. Each permutation has an ID: Cage# + solution
2. Put all the cages in an array and order by the number of possibilities it has,
	from the lowest to highest.
3. Starting from the index 0 of the array, traverse through the 
	tree of possibilities
	A. For each cage solution, mark whether it is compatible with its parent
4. Going through the arry must yield the solution.


*/


/*
	A Box will be used to check whether the set of permutation
	of a given set of solutions is valid; it'll return false
	if the given solution for the cage will put same number in 
	a row or column.
*/
/*
	public methods:
		-getSolSets
		-canLoadSolSet
		-loadSolSet
		-getID
*/
Set.prototype.__isTargetMet__ = function(){
	let toReturn = this.size == this.timesAdded;
	this.timesAdded = 0;
	this.clear();
	return toReturn;
}

function KenKen(puzzle){
	function Cage(cellIndices, op, target, size){
		
		function Box(width, indices){
		
			this.isValidSet = function(input){
				//load
				for(let i = 0; i < input.length; i ++){
					let n = input[i];
					let {rowCheck, colCheck} = box[i];
					
					rowCheck.add(n);
					rowCheck.timesAdded++;
					
					colCheck.add(n);
					colCheck.timesAdded++;
				}
		
				// Doing this so it iterates through all the sets
				// in order to reset them.
				let test = true;
				for(let i = 0; i < rowChecks.length; i++){
					let temp = rowChecks[i].__isTargetMet__();
					test = temp && test;
				}
				for(let i = 0; i < colChecks.length; i++){
					let temp = colChecks[i].__isTargetMet__();
					test = temp && test;
				}
				return test;
			}
			
			// actual making of box
			function init(){
				indices.sort((a,b)=>{return a-b});
				let x1 = Infinity, x2 = -Infinity,
					y1 = Infinity, y2 = -Infinity;
				for(let i = 0; i < indices.length; i++){
					let idx = indices[i];
					let x = idx % width, y = Math.floor(idx / width);
					x1 = x < x1 ? x : x1, x2 = x > x2 ? x : x2,
					y1 = y < y1 ? y : y1, y2 = y > y2 ? y : y2;
				}
				let dx = x2 - x1 + 1,	dy = y2 - y1 + 1, 
					firstIdx = y1 * width + x1;
				return {dx, dy, firstIdx}
			}
			
			// width, height, top left index of the box
			let {dx, dy, firstIdx} = init();
			
			//setup sets
			let rowChecks = [], colChecks = [], box = [];
			for(let i = 0; i < dy; i++){
				let s = new Set();
				s.timesAdded = 0;
				s.id = 'r' + i; // for debugging purpose
				rowChecks.push(s);	
			} 
			for(let i = 0; i < dx; i++){
				let s = new Set();
				s.timesAdded = 0;
				s.id = 'c' + i; // for debugging purpose
				colChecks.push(s);	
			} 
		
			for(let i = 0; i < indices.length; i++){
				let idx = indices[i] - firstIdx;
				let x = idx%width, y = Math.floor(idx/width);
				box.push({
					rowCheck : rowChecks[y],
					colCheck : colChecks[x]
				});
			}
		}
		
		// for + and * ops
		function getSolSets1(depth, cumm, nums){
			if(depth == 0 && cumm == target){
				solSets.push([...nums]);
			} else if(depth > 0){
				depth--;
				for(let i = 1; i <= size; i++){
					let temp = op == '*' ? cumm * i : cumm + i;
					nums.push(i);
					getSolSets1(depth, temp, nums);
					nums.pop();
				}
			}
		}
		//for - and / ops
		function getSolSets2(op, target){
			for(let i = 1; i <= size; i++){
				let temp = op == '-' ? target + i  : target * i;
				if(temp <= size) solSets.push([temp, i], [i, temp]);
			}
		}
		
		this.getSolSets = function(){
			return solSets;
		}
		this.canLoadSolSet = function(solSet){
			for(let i = 0; i < ownCells.length; i++){
				let c = ownCells[i];
				let n = solSet[i];
				let result = c.canSetVal(n);
				if(!result) return false;
			}
			return true;
		}
		this.loadSolSet = function(solSet){
			for(let i = 0; i < ownCells.length; i++){
				let c = ownCells[i];
				let n = solSet[i];
				c.setVal(n);
			}
		}
		this.unloadSolSet = function(){
			for(let i = 0; i < ownCells.length; i++){
				ownCells[i].unsetVal();
			}
		}
		this.getID = function(){
			return cageID;
		}
		
		let solSets = [],
			ownCells = [],
			cageID = cellIndices[0];
		
		if(cellIndices.length > 1){
			
			cellIndices.sort((a,b)=>{return a-b;}); //sort in increasing order
			
			let box = new Box(size, cellIndices);
			
			if(op == '+' || op == '*') 
				getSolSets1(cellIndices.length, (op=='+'?0:1), []);
			else 
				getSolSets2(op, target);
			
			solSets = solSets.filter(sol=>box.isValidSet(sol));
		} else {
			solSets = [[target]];
		}
		
		while(cellIndices.length){
			let cellIdx = cellIndices.shift();
			ownCells.push(cells[cellIdx]);
		}
	}
	
	/*
		NumList methods:
		-isMarked
		-mark
		-unmark
		-getState
	*/
	function NumList(max, type, index){
		this.type = type;
		this.index = index;
		let marked = ['']; 
		this.marked = marked;				//////////////
		for(let i = 1; i <= max; i++) marked[i] = false;
		
		let actionStack = [];
		
		this.isMarked = function(n){
			return marked[n] !== false;
		}
		
		// n isput down for index of that row/col
		this.mark = function(n, idx){
			marked[n] = idx;
		}
		this.unmark = function(n){
			marked[n] = false;
		}
		
		//for printing
		this.getState = function(){
			let state = [];
			for(let i = 0; i < max; i++) state[i] = '-';
			for(let i = 1; i < marked.length; i++){
				let idx = marked[i];
				if(idx == parseInt(idx)) state[idx] = i; //if idx is integer
			}
			return state;
		}
	}
	
	/*
		Cell methods: 
		-canSetVal()
		-setVal()
		-unsetVal()
	*/
	function Cell(index, max){
		let colIdx = index%max, rowIdx = Math.floor(index/max);
		let col = cols[colIdx], row = rows[rowIdx];
		this.val = undefined;
		this.index = index; /////////////////////////////////////////
		this.setVal = function(n){
			this.val = n;
			col.mark(n, rowIdx);
			row.mark(n, colIdx);
		}
		this.unsetVal = function(){
			let val = this.val;
			this.val = undefined;
			col.unmark(val);
			row.unmark(val);
		}
		this.canSetVal = function(n){
			return !col.isMarked(n) && !row.isMarked(n);
		}
	}
	
	// Make sure there are size**2 unique cells
	function checkInput(cages){
		// for(let i = 0; i < cages.length; i++){
		// 	let c = cages[i].cells;
		// 	if(cells.length == 1 && cages.op == ''){
		// 		throw new Error(`Cage with cells ${cells} doesn't have an op.`);
		// 	}
		// 	for(let j = 0; j < c.length; j++){
		// 		arr.push(c[j]);
		// 	}
		// }
		
		// if(arr.length != size ** 2){
		// 	arr.sort((a,b)=>{return a-b});
		// 	arr.forEach(function(e,i,arr){
		// 		arr[i] = e == i ? true : e;
		// 	});
		// 	throw new Error('Check input. Given cells: ' + arr);	
		// } 
		let allCells = [];
		cages.forEach((cage,i)=>{
			let cageCells = cage.cells;
			allCells.push(...cageCells);
		});
		let last;
		let hasDupes;
		allCells.sort((a,b)=>a-b).forEach(c=>{
			if(c === last) hasDupes = true;
			last = c;
		});
		let maxSize = size**2;
		if(hasDupes) throw new Error('There are duplicate cells in the input.');
		if(last != maxSize - 1){
			throw new Error(`Last cage should be ${maxSize-1}. ${last} was given.`)
		}
		if(allCells.length !== maxSize){
			throw new Error(`Wrong number of unique cells passed. Should be ${maxSize}.`);
		}
		
	}
	
	let {size, cages} = puzzle;
	let isReady = false;
	// let arr = [];
	let cells = [], cols = [], rows = [], cageObjs = [], accountant = [];
	
	checkInput(cages);
	
	// Make row and column objects
	for(let i = 0; i < size; i++){
		let col = new NumList(size, 'col', i);
		cols.push(col);
		let row = new NumList(size, 'row', i);
		rows.push(row);
	}
	
	// Make cell objects;
	for(let i = 0; i < size * size; i++){
		let cell = new Cell(i, size);
		cells.push(cell);
	} 
	
	// Make Cage objects
	for(let i = 0; i < cages.length; i++){
		let cageSeed = cages[i];
		let {cells, op, target} = cageSeed;
		let cage = new Cage(cells, op, target, size);
		cageObjs.push(cage);
		for(let i = 0; i < cells.length; i++) accountant.push(cells[i]);
	}
	
	
	isReady = true;
	this.solve = function(printSteps){
		function captureState(){
			let sol = [];
			for(let i = 0; i < rows.length; i++){
				let row = rows[i];
				let state = row.getState();
				sol.push(...state);
			}
			solutions.push(sol);
		}
		function recourse(queue){
			
			if(queue.length){
				if(printSteps) console.log(steps);
				steps++;	
				let cage = queue.shift();
				let solSets = cage.getSolSets();
				
				for(let i = 0; i < solSets.length; i++){
					let solSet = solSets[i];
					let canLoad = cage.canLoadSolSet(solSet);
					if(canLoad){
						cage.loadSolSet(solSet);
						recourse(queue);
						cage.unloadSolSet();
					}
				}
				queue.unshift(cage);
			} else { // solution is found;
				captureState();
				return true;
			}
			
		}
		let solutions = [];
		let steps = 0;
		if(isReady){
			// order the cages with the least number of solution sets
			cageObjs.sort((a,b)=>{return a.getSolSets().length - b.getSolSets().length;});
			// order the cages by its index
			// cageObjs.sort((a,b)=>{return a.getID() - b.getID();});
			recourse(cageObjs);
			return solutions;
		} else {
			console.log('The puzzle is not done initializing.');
		}
	}
}

let samples = [
	/*
		Sample puzzle 1 (sample1)
		+-------+-------+-------+-------+
		|8x		|9+						|
		|		|						|
		|		|						|
		+		+-------+-------+-------+
		|				|7+		|2/		|
		|				|		|		|
		|				|		|		|
		+-------+-------+		+		+
		|6x				|		|		|
		|				|		|		|
		|				|		|		|
		+		+-------+-------+-------+
		|		|2-				|4		|
		|		|				|		|
		|		|				|		|
		+-------+-------+-------+-------+
	*/	
	{
		size : 4, 
		cages : [
			{cells: [0, 4, 5],	op: '*',	target: 8},
			{cells: [1,2,3],	op: '+',	target: 9},
			{cells: [6,10],		op: '+',	target: 7},
			{cells: [7,11],		op: '/',	target: 2},
			{cells: [8,9,12],	op: '*',	target: 6},
			{cells: [13,14],	op: '-',	target: 2},
			{cells: [15],		op: '',		target: 4}
		]
	},
	
	/*
		Sample puzzle 2 (sample2)
		+-------+-------+-------+-------+-------+-------+
		|12+			|6*						|5-		|
		|				|						|		|
		|				|						|		|
		+       +-------+-------+-------+-------+		+
		|		|7+				|96*			|		|
		|		|				|				|		|
		|		|				|				|		|
		+-------+-------+-------+		+-------+-------+
		|3+		|3/		|3/		|		|1-				|
		|		|		|		|		|				|
		|		|		|		|		|				|
		+		+		+		+-------+-------+-------+
		|		|		|		|3/		|1-				|
		|		|		|		|		|				|
		|		|		|		|		|				|
		+-------+-------+-------+		+-------+-------+
		|2-		|1-		|12+	|		|1-				|
		|		|		|		|		|				|
		|		|		|		|		|				|
		+		+		+		+-------+-------+-------+
		|		|		|				|2/				|
		|		|		|				|				|
		|		|		|				|				|
		+-------+-------+-------+-------+-------+-------+
	*/
	{
		size : 6, 
		cages : [
			{cells: [0, 1, 6],		op: '+',	target: 12},
			{cells: [2,3,4],		op: '*',	target: 6},
			{cells: [5,11],			op: '-',	target: 5},
			{cells: [7,8],			op: '+',	target: 7},
			{cells: [9,10,15],		op: '*',	target: 96},
			{cells: [12,18],		op: '+',	target: 3},
			{cells: [13,19],		op: '/',	target: 3},
			{cells: [14,20],		op: '/',	target: 3},
			{cells: [16,17],		op: '-',	target: 1},
			{cells: [21,27],		op: '/',	target: 3},
			{cells: [22,23],		op: '-',	target: 1},
			{cells: [24,30],		op: '-',	target: 2},
			{cells: [25,31],		op: '-',	target: 1},
			{cells: [26,32,33],		op: '+',	target: 12},
			{cells: [28,29],		op: '-',	target: 1},
			{cells: [34,35],		op: '/',	target: 2}
		]
	},
	
	/*
		Sample puzzle 3 (sample3)
			0		1		2		3		4		5		6		7		8		
		+-------+-------+-------+-------+-------+-------+-------+-------+-------+
		|3/				|315*					|8-				|10+	|4-		|
	0	|				|						|				|		|		|
		|				|						|				|		|		|
		+-------+-------+		+-------+-------+-------+-------+		+		+
		|189*	|8-		|		|3-				|70*			|		|		|
	1	|		|		|		|				|				|		|		|
		|		|		|		|				|				|		|		|
		+		+		+-------+-------+-------+		+-------+-------+-------+
		|		|		|576*					|		|10*	|5-				|
	2	|		|		|						|		|		|				|
		|		|		|						|		|		|				|
		+		+-------+		+-------+-------+-------+		+-------+-------+
		|		|144*	|		|72*	|7-				|		|17+	|35*	|
	3	|		|		|		|		|				|		|		|		|
		|		|		|		|		|				|		|		|		|
		+-------+		+-------+		+-------+-------+-------+		+		+
		|3-		|		|7		|				|1-				|		|		|
	4	|		|		|		|				|				|		|		|
		|		|		|		|				|				|		|		|
		+		+		+-------+		+-------+-------+-------+		+		+
		|		|		|8-		|		|13+			|2-		|		|		|
	5	|		|		|		|		|				|		|		|		|
		|		|		|		|		|				|		|		|		|
		+-------+-------+		+-------+-------+-------+		+-------+-------+
		|3+		|1-		|		|26+					|		|1-				|
	6	|		|		|		|						|		|				|
		|		|		|		|						|		|				|
		+		+		+-------+-------+-------+		+-------+-------+-------+
		|		|		|80*	|6-				|				|4-		|3/		|
	7	|		|		|		|				|				|		|		|
		|		|		|		|				|				|		|		|
		+-------+-------+		+-------+-------+-------+-------+		+		+
		|28*			|				|15+					|		|		|
	8	|				|				|						|		|		|
		|				|				|						|		|		|
		+-------+-------+-------+-------+-------+-------+-------+-------+-------+
	*/
	{
		size : 9, 
		cages : [
			{cells: [0, 1],			op: '/',	target: 3},		{cells: [2,3,4,11],		op: '*',	target: 315},
			{cells: [5,6],			op: '-',	target: 8},		{cells: [7,16],			op: '+',	target: 10},
			{cells: [8,17],			op: '-',	target: 4},		{cells: [9,18,27],		op: '*',	target: 189},
			{cells: [10,19],		op: '-',	target: 8},		{cells: [12,13],		op: '-',	target: 3},
			{cells: [14,15,23],		op: '*',	target: 70},	{cells: [20,21,22,29],	op: '*',	target: 576},
			{cells: [24,33],		op: '*',	target: 10},	{cells: [25,26],		op: '-',	target: 5},
			{cells: [28,37,46],		op: '*',	target: 144},	{cells: [30,39,40,48],	op: '*',	target: 72},	
			{cells: [31,32],		op: '-',	target: 7},		{cells: [34,43,52],		op: '+',	target: 17},
			{cells: [35,44,53],		op: '*',	target: 35},	{cells: [36,45],		op: '-',	target: 3},	
			{cells: [38],			op: '',		target: 7},		{cells: [41,42],		op: '-',	target: 1},	
			{cells: [47,56],		op: '-',	target: 8},		{cells: [49,50],		op: '+',	target: 13},
			{cells: [51,60],		op: '-',	target: 2},		{cells: [54,63],		op: '+',	target: 3},
			{cells: [55,64],		op: '-',	target: 1},		{cells: [57,58,59,68,69],op: '+',	target: 26},
			{cells: [61,62],		op: '-',	target: 1},		{cells: [65,74,75],		op: '*',	target: 80},
			{cells: [66,67],		op: '-',	target: 6},		{cells: [70,79],		op: '-',	target: 4},	
			{cells: [71,80],		op: '/',	target: 3},		{cells: [72,73],		op: '*',	target: 28},
			{cells: [76,77,78],		op: '+',	target: 15}
		]
	}
];

let KenKenGUI = (function(){
	function isContiguous(cells, size){
		// If the neighbor in the given direction is within
		// the bounds, then returns the index else, return false;
		function getNeighbor(dir, center){
			function getCoord(index){
				let x = index % size;
				let y = (index / size) >> 0;
				return {x, y};
			}
			function getIndex(x, y){
				return x + y * size;
			}
			let d = {
				n: {x:  0,  y: -1},
				w: {x: -1,  y: 0},
				e: {x:  1,  y: 0},
				s: {x:  0,  y: 1}
			}
			let dx = d[dir].x;
			let dy = d[dir].y;
			let {x, y} = getCoord(center);
			x += dx;
			y += dy;
			if(x >= 0 && x < size && y >= 0 && y < size){
				return getIndex(x, y);
			} else {
				return false;
			}
		}
		if(!cells || !cells.length) return false;
		if(cells.length == 1) return true;
		cells.sort((a,b)=>{return a-b});
		let union = [];
		union.push(cells.shift());
		let dirs = ['n', 'w', 'e', 's'];
		for(let i = 0; i < union.length && cells.length;i++){
			let cell = union[i];
			for(let j in dirs){
				let dir = dirs[j];
				let neighbor = getNeighbor(dir, cell);
				if(neighbor !== false && cells.includes(neighbor)){
					removeFromArray(cells, neighbor);
					union.push(neighbor);
				}
			}
	    }
		return cells.length == 0;
	}
	
	function removeFromArray(arr, elem){
		let i = arr.indexOf(elem);
		arr.splice(i, 1);
	}
	
	const MAX_SIZE = 9;
	const MIN_SIZE = 3;
	const $$ = e=>{
		const isClass = e[0] === '.';
		const firstChar = isClass ? '.kk-' : '#kk-';
		e = firstChar + e.substr(1);
		return $('#kk-gui').find(e);
	};
	const stateMgr = {
		// data
		size: 0,
		selected : [],
		cages: [],
		cagedCells: [],
		cageNum: [], // cageNum[cellNum] --> cageNum (to get cellmates)
		
		// state of currently selected cell[s]/cage
		currOp: '',
		currTarget: '',
		currCage: undefined,
		isContiguous: false,
		
		// methods
		select(cell){
			const toggleCage = (select, cell)=>{
				if(select){
					const cageNum = this.cageNum[cell];
					const cage = this.cages[cageNum];
					this.selected = [...cage.cells];
					this.currOp = cage.op;
					this.currTarget = cage.target;
					this.currCage = cage;
					this.isContiguous = true;
				} else {
					this.selected = [];
					this.currOp = '';
					this.currTarget = '';
					this.currCage = undefined;
					this.isContiguous = false;
				}
			}
			const cellWasSelected = this.selected.includes(cell);
			const cageWasSelected = this.currCage !== undefined;
			const isCagedCell = this.cagedCells.includes(cell);
			if(isCagedCell){
				if(cellWasSelected){
					toggleCage();
				} else {
					toggleCage(true, cell);
				}
			} else {
				if(cageWasSelected){
					toggleCage(); // off
				}
				if(cellWasSelected){
					removeFromArray(this.selected, cell);
				} else {
					this.selected.push(cell);
					this.selected.sort((a,b)=>a-b);
				}
				this.isContiguous = isContiguous([...this.selected], this.size);
				const cond1 = this.isContiguous;
				const cond2 = this.selected.length < 2;
				const cond3 = this.selected.length > 2;
				const cond4 = this.currOp === '-';
				const cond5 = this.currOp === '/';
				if(!cond1 || cond2 || (cond3 && (cond4 || cond5))){
					this.currOp = '';
				}
				if(!cond1) this.currTarget = '';
			}
			render.selected();
			render.controls();
		},
		setCage(){
			/*
			    make a cage 
			    check if any cells are left
			    if(cells are left)
			        show cage setter buttons
			    else 
			        show "solve" button
			*/
			
			const c1 = this.currOp !== '';
			const c2 = this.currTarget !== '';
			const c3 = this.isContiguous;
			
			if((this.currOp && this.currTarget && this.isContiguous )
				|| (this.currOp === '' && this.selected.length === 1)){
				let target = this.currTarget
				const cells = (e => {
					return function(){
						return [...e];
					}
				})(this.selected);
				const headCell = this.selected[0];
				const op = this.currOp;
				
				this.currCage = {op, target, cells: cells()};
				
				this.cages[headCell] = this.currCage;
				this.cagedCells.push(...cells());
				cells().forEach(cell=>{
					this.cageNum[cell] = headCell;	
				});
				
				
				render.cage(cells());
				render.cageDesc({op, target, cell: cells()[0]});
				if(this.cagedCells.length == this.size ** 2){
					render.toggleSolveBtn(true);
				}
			} else {
				console.log(`This shouldn't happen`);
			}
		},
		unsetCage(){
			render.uncage(this.selected);
			this.selected.forEach(cell=>{
				removeFromArray(this.cagedCells, cell);
			});
			this.currCage = undefined;
			removeFromArray(this.cages, this.currCage);
			render.toggleSolveBtn(false);
		},
		solvePuzzle(){
			function cloner(cages){
				let clone = [];
				cages.forEach(cage=>{
					let {target, cells, op} = cage;
					let arr = [];
					cells.forEach(cell=>arr.push(cell));
					clone.push({
						target,
						cells: arr,
						op,
					});
				});
				return clone;
			}
			let cagedCells = this.cagedCells.length;
			const canSolve = cagedCells === this.size**2;
			if(canSolve){
				let {
					cages,
					size,
				} = this;
				cages = cages.filter(e=> e !== undefined);
				let clone = cloner(cages);
				//return {size, cages: clone};
				let k = new KenKen({size, cages: clone});
				let sols = k.solve();
				if(!sols || sols.length === 0){
					console.log('why is this happening to me.');
				}
				this.sols = sols;
				render.printSol();
				//globglob = cloner(cages);
				render.toggleSolveBtn(false);
				render.toggleResetBtn(true);
			} else {
				console.log(`can't be solved. Only ${cagedCells} cells are ready.`)
			}
		},
		setOp(op){
			if(this.currCage){
				this.currCage.op = op;
				this.currOp = op;
				render.cageDesc({
					op: this.currOp,
					target: this.currTarget,
					cell: this.selected[0]
				});
			} else if(this.currOp == op){
				this.currOp = '';
			} else {
				this.currOp = op;
			}
			render.controls();
		},
		setCageTarget(target){
			if(this.currTarget !== target){
				if(this.currCage && target){
					this.currCage.target = target;
				}
				this.currTarget = target;
				render.controls();
				if(this.currCage){
					render.cageDesc({
						op: this.currOp,
						target: this.currTarget,
						cell: this.selected[0]
					});
				}
			}
		},
		resetPuzzle(){
			this.size = 0;
			this.selected = [];
			this.cages = [];
			this.cagedCells = [];
			this.cageNum = []; 
			this.currOp = '';
			this.currTarget = '';
			this.currCage = undefined;
			this.isContiguous = false;
			
			render.resetPuzzle();
		},
		
		loadSample(sample){
			function triggerSetSize(s){
				$$('#size-display').text(s)
				$$('#set-size').click();
			}
			let {size, cages} = sample;
			this.size = size;
			triggerSetSize(size);
			for(let cage of cages){
				let {target, op, cells} = cage;
				this.currTarget = target;
				this.currOp = op;
				this.selected = cells;
				this.isContiguous = true;
				this.setCage();
			}
		},
		
	};
	
	const render = {
		selected(){
			$$('.selected').removeClass('kk-selected');
			let cellsToRender = stateMgr.selected;
			for(let i in cellsToRender){
				let cellNum = cellsToRender[i];
				let cellID = `#cell-${cellNum}`;
				$$(cellID).addClass('kk-selected');
			}
		},
		controls(){
			function enDisableOpBtns(mode){
				// enable /disable buttons
				if(mode === 0){//disable all
					$$('#op-btns')
						.find('button')
						.addClass('disabled')
						.removeClass('toggled');
				} else if(mode === 1){ // disable -, /
					$$('#plus-btn').removeClass('disabled');
					$$('#times-btn').removeClass('disabled');
					$$('#minus-btn').addClass('disabled').removeClass('toggled');
					$$('#divide-btn').addClass('disabled').removeClass('toggled');
				} else if(mode === 2){ // enable all
					$$('#op-btns').find('button').removeClass('disabled');
				}
			}
			function toggleOpBtn(op){
			// toggle/untoggle op buttons
				$$('.op-btn').removeClass('toggled');
				if(op !== ''){
					const opText = 
						op === '+' ? 'plus' :
						op === '-' ? 'minus' : 
						op === '*' ? 'times' :
						'divide';
					const id = `#${opText}-btn`;
					const isDisabled = $$(id).hasClass('disabled');
					if(isDisabled) throw new Error('Disabled button cannot be toggled. This shouldnt happen.');
					$$(id).addClass('toggled');
				}
			}
			
			// toggles cage setter and unsetter
			function toggle(elem, turnOn){
				$$(`#${elem}`)[turnOn ? 'removeClass' : 'addClass']('disabled');
			}
			
			const count = stateMgr.selected.length;
			const isContiguous = stateMgr.isContiguous;
			
			// enable / disable buttons and inputs
			if(isContiguous){
				if(count < 2){
					enDisableOpBtns(0);
				} else if(count === 2){
					enDisableOpBtns(2);
				} else {
					enDisableOpBtns(1);
				}
				
				const {currOp, currTarget} = stateMgr;
				if(stateMgr.cageIsSelected){
					toggle('cage-setter', false);
				} else if((currTarget && currOp) || count === 1){
					toggle('cage-setter', true);
				}
				toggle('cancel-btn', true);
				toggleOpBtn(currOp);
				$$('#cage-target').val(currTarget);
				
			} else {
				toggle('cage-setter', false);
				toggle('cancel-btn', false);
				$$('#cage-target').val('');
				enDisableOpBtns(0);
			}
		},
		cage(cells){
			function thinBorder(dir, cellElem){
				let borderClass = dir === 'n' ? 'kk-border-top' : 'kk-border-left';
				cellElem.addClass(borderClass);
			}
			// deal with borders
			let size = stateMgr.size;
			cells.forEach(cellNum=>{
				let id = `#cell-${cellNum}`;
				let elem = $$(id);
				elem.addClass('kk-caged');
				
				let north = cellNum - size;
				let hasNorth = cells.includes(north);
				let isValidNorth = north >= 0;
				if(hasNorth && isValidNorth){
					thinBorder('n', elem);
				}
				
				let west = cellNum - 1;
				let hasWest = cells.includes(west);
				let isValidWest = west%size >= 0;
				if(hasWest && isValidWest){
					thinBorder('w', elem);
				}
			});
			
		},
		uncage(cells){
			cells.forEach((e,i)=>{
				let cellElem = $$(`#cell-${e}`);
				if(i == 0){
					cellElem.find('.kk-cage-desc').remove();
				}
				cellElem.removeClass('kk-border-top kk-border-left kk-caged');
			});
		},
		cageDesc(descObj){
			let {op, target, cell} = descObj;
			op = 
				op === '+' ? '&plus;'
				: op === '-' ? '&minus;'
				: op === '/' ? '&divide;'
				: op === '*' ? '&times;'
				: '';
			let desc = op + ' ' + target;
			let cageDesc = $$(`#cage-desc-${cell}`);
			if(cageDesc.length){
				cageDesc.html(desc);
			} else {
				let cellID = `#cell-${cell}`;
				$$(cellID).append(`
					<div class="kk-cage-desc" id="kk-cage-desc-${cell}">
						${desc}
					</div>
				`);
			}
		},
		toggleSolveBtn(show){
			if(show) $$('#solve-puzzle').show();
			else $$('#solve-puzzle').hide();
		},
		toggleResetBtn(show){
			if(show) $$('#reset-puzzle').show();
			else $$('#reset-puzzle').hide();
		},
		printSol(){
			let sols = stateMgr.sols[0];
			for(let i in sols){
				let sol = sols[i];
				let cellElemID = `#cell-${i}`;
				$$(cellElemID).append(`
					<div class="kk-cell-val">
						${sol}
					</div>
				`);
				
			}
		},
		resetPuzzle(){
			$$('#puzzle').empty().hide();
			$$('#initializer').show();
			$$('#reset-puzzle').hide();
			
			this.initCellClickEvents();
		},
		
		//Initialization stuff
		gui(cont){
			cont.append(`
				<div id="kk-gui">
					<style>
				#kk-gui{
				  font-family: sans-serif;
				}
	
				#kk-initializer, #kk-puzzle {
				  width: calc(100vmin - 10px);
				  height: calc(100vmin - 10px);
				  margin: auto;
			    }
				
	
				@media (min-width: 600px){
				  #kk-initializer, #kk-puzzle {
					width: calc(100vmin - 100px);
					height: calc(100vmin - 100px);
				  }
				}
	
				/**********INITIALIZER *********************/
	
				#kk-initializer{
				  border: 1px solid black;
				  display: flex;
				  flex-direction: column;
				  justify-content: center;
				  align-items: center;
				}
				  #kk-size-setter-wrap, #kk-sample-loaders{
					display: flex;
					flex-direction: column;
				  }
					#kk-size-setter{
					  display: flex;
					  width: 200px;
					  height: 50px;
					}
					  #kk-decr-size,
					  #kk-incr-size,
					  #kk-size-display{
					    width: 70px;
					    text-align: center;
					    font-size: 1rem;
					    line-height: 1.5;
					    vertical-align: bottom;
					    border: 0;
					  }
					  #kk-decr-size{
					    border-top-left-radius: 30px;
					    border-bottom-left-radius: 30px;
					  }
					  #kk-incr-size{
					    border-top-right-radius: 30px;
					    border-bottom-right-radius: 30px;
					  }
					  #kk-size-setter-wrap #kk-set-size{
					    border-radius: 25px;
					    height: 50px;
					    width: 200px;
					    border-width: 0;
					    margin-top: 10px;
					    font-size: 1rem;
					  }
				  #kk-sample-loaders{
					/*margin-top: 50px;
					flex-direction: column;
					overflow: hidden;*/
				  }
					#kk-sample-loaders span,
					#kk-sample-loaders button{
					  width: 200px;
					  text-align: center;
					  height: 50px;
					  font-size: 1rem;
					}
	
					#kk-sample-loaders button{
					  background-color: #dcddde;
					  border: 0;
					  margin: 5px;
					  border-radius: 50px;
					}
				/********** PUZZLE *********************/
				#kk-puzzle{
				  --heavy-border: 2px solid black;
				  --kk-light-border-color: gray;
				  /*
				  border-bottom: var(--heavy-border);
				  border-right: var(--heavy-border);
				  */
				  display: grid;
				  grid-template-columns: repeat(4, 1fr);
				  grid-template-rows: repeat(4, 1fr);
				  box-sizing: content-box;
				}
				  .kk-puzzle-cell{
					box-sizing: border-box;
					border-top: 2px solid black;
					border-left: 2px solid black;
					display: flex;
					justify-content: center;
					align-items: center;
				  	background-color: gray;
				  }
				  .kk-border-top{
					border-top: 1px solid var(--kk-light-border-color);
				  }
				  .kk-border-left{
					border-left: 1px solid var(--kk-light-border-color);
				  }
				  .kk-puzzle-cell.kk-caged{
				  	background-color: white;
				  }
				  .kk-puzzle-cell.kk-selected{
				  	background-color: #f3f3b3;
				  }
					.kk-cage-desc{
					  position:absolute;
					  top: 0;
					  left: 0;
					  width: 100%;
					  font-size: 2vmin;
					}
					#kk-puzzle.big-cells .kk-cage-desc{
					  font-size: 4vmin;
					}
					.kk-cell-val{
					  font-size: 3.5vmin;
					}
					
					#kk-puzzle.big-cells .kk-cell-val{
					  font-size: 5vmin;
					}
	
	
				/********** CONTROL *********************/
				#kk-controls{
				  display: flex;
				  justify-content: space-evenly;
				  margin-top: 10px;
				  flex-wrap: wrap;
				}
				#kk-controls.center{
					justify-content: center;
				}
				#kk-controls button.toggled{
				  background-color: gray;
				  color: white;
				}
	
				#kk-controls button.disabled{
				  background-color: #ffffff;
				  color: #cccccc;
				}
	
				#kk-op-btns, #kk-inputs{
				  display: flex;
				}
				#kk-op-btns button, 
				#kk-cage-setter,
				#kk-inputs input{
				  background-color: #dcddde;
				  border: 0;
				  font-size: 1rem;
				  width: 50px;
				  height: 50px;
				  border: 1px solid black;
				}
				#kk-op-btns button:not(:last-child){
				  border-right: 0;
				}
				#kk-inputs #kk-cage-target{
				  width: 100px;
				  background: white;
				  margin-right: 20px;
				  border-right: 1px solid black;
				  text-align: center;
				  -moz-appearance:textfield;
				}
	
				#kk-inputs #kk-cancel-btn{
				  background-color: transparent;
				  width: 50px;
				  border: 0;
				  font-size: 2rem;
				  line-height: 0;
				  color: red;
				}
				#kk-inputs #kk-cancel-btn.disabled{
				  color: pink;
				}
				#kk-reset-puzzle, #kk-solve-puzzle{
				  padding: 0 40px;
				  border: 0;
				  border-radius: 20px;
				  font-size: 1rem;
				}
					</style>
					<div id="kk-initializer">
						<div id="kk-size-setter-wrap">
							<span id="kk-size-setter">
								<button id="kk-decr-size">-</button>
								<span id="kk-size-display">4</span>
								<button id="kk-incr-size">+</button>
							</span>
							<button id="kk-set-size">SET</button>
						</div>
						<div id="kk-sample-loaders">
							<span>Load Samples</span>
							<button id="kk-sl1" class="kk-sample-loader">Sample 1</button>
							<button id="kk-sl2" class="kk-sample-loader">Sample 2</button>
							<button id="kk-sl3" class="kk-sample-loader">Sample 3</button>
						</div>
					</div>
					<div id="kk-puzzle" style="display: none;">
						<!--
						<div class="kk-puzzle-cell">
							<div class="kk-cage-desc">× 1200</div>
							<div class="kk-cell-val">3</div>
						</div>
						-->
					</div>
					<div id="kk-controls" style="display: none;">
						<span id="kk-op-btns">
							<button class="kk-op-btn" id="kk-plus-btn">+</button>
							<button class="kk-op-btn" id="kk-minus-btn">-</button>
							<button class="kk-op-btn" id="kk-times-btn">×</button>
							<button class="kk-op-btn" id="kk-divide-btn">÷</button>
						</span>
						<span id="kk-inputs">
							<input type="number" id="kk-cage-target">
							<button id="kk-cage-setter" class="disabled">SET</button>
							<button id="kk-cancel-btn" class="disabled">×</button>
						</span>
						<button id="kk-reset-puzzle" style="display: none;">RESET PUZZLE</button>
						<button id="kk-solve-puzzle" style="display: none;">SOLVE PUZZLE</button>
					</div>
				</div>
			`);
		},
		initBtns(){
			let _this = this;
			// Setup button events
			$$('#incr-size').click(function(){
				let currSize = $$('#size-display').text() >> 0;
				currSize++;
				currSize = Math.min(currSize, MAX_SIZE);
				$$('#size-display').text(currSize);
			});
			$$('#decr-size').click(function(){
				let currSize = $$('#size-display').text() >> 0;
				currSize--;
				currSize = Math.max(currSize, MIN_SIZE);
				$$('#size-display').text(currSize);
			});
			$$('#set-size').click(function(){
				// Setup puzzle
				let size = $$('#size-display').text() >> 0;
				stateMgr.size = size;
				$$('#puzzle').css({
					'grid-template-rows' : `repeat(${size}, 1fr)`,
					'grid-template-columns' : `repeat(${size}, 1fr)`
				});
				if(size <= 6){
					$$('#puzzle').addClass('big-cells');
				}
				for(let i = 0; i < size**2; i++){
					let $cellHTML = $(`
						<div class="kk-puzzle-cell" id="kk-cell-${i}">
							<div class="kk-cell-val"></div>
						</div>
					`);
					let lastRowIndices = size ** 2 - size;
					if(i >= lastRowIndices) $cellHTML.css('border-bottom', 'var(--heavy-border)');
					if(i%size == size-1) $cellHTML.css('border-right', 'var(--heavy-border)');
					$$('#puzzle').append($cellHTML);
				}
	
				// Hide / show appropriate parts
				$$('#initializer').hide();
				$$('#puzzle').show();
				$$('#controls').show();
				
				_this.initCellClickEvents();
				
			});
			$$('.sample-loader').click(function(){
				let sampleNum = $(this).attr('id').match(/\d+/)[0] >> 0;
				sampleNum--;
				let sample = samples[sampleNum];
				stateMgr.loadSample(sample);
			});
			$$('.op-btn').click(function(){
				const isDisabled = $(this).hasClass('disabled');
				if(!isDisabled){
					const thisID = $(this).attr('id');
					const op = thisID === 'kk-plus-btn' ? '+'
						: thisID === 'kk-minus-btn' ? '-'
						: thisID === 'kk-times-btn' ? '*'
						: '/';
					stateMgr.setOp(op);
				}
			});
			$$('#cancel-btn').click(function(){
				stateMgr.unsetCage();
			});
			$$('#cage-setter').click(function(){
				const isDisabled = $(this).hasClass('disabled');
				if(!isDisabled) stateMgr.setCage();
			});
			$$('#cage-target').keyup(function(){
				const val = $(this).val() >> 0;
				stateMgr.setCageTarget(val);
			}).change(function(){
				$(this).trigger('keyup');
			});
			
			$$('#solve-puzzle').click(function(){
				stateMgr.solvePuzzle();
			});
			$$('#reset-puzzle').click(function(){
				$$('puzzle').removeClass('big-cells');
				stateMgr.resetPuzzle();
			});
		},
		initCellClickEvents(){
			$$('.puzzle-cell').click(function(){
				let cellID = $(this).attr('id');
				let cellNum = cellID.match(/\d+/)[0] >> 0;
				stateMgr.select(cellNum);
			});
		},
	};
	

	return{
		initGUI(cont){
			cont = $(cont);
			render.gui(cont);
			render.initBtns();
		},
	};
}());
'use strict';
/**
 * 
 * AKA Match making algorithm
 * 
 * get ideal match
 * 
 * 
 * BUG: 
 *	{"m":[[0,1,2],[0,2,1],[1,2,0]],"w":[[1,0,2],[1,2,0],[0,1,2]]}
 *  {"m":[[1,0,2],[2,0,1],[1,2,0]],"w":[[2,1,0],[2,1,0],[1,2,0]]}
 *  produces an output of length 2
 * 
 */


Array.prototype.__randomize__ = function() {
	let max = this.length;
	for (let i = 0; i < max; i++) {
		let r = Math.floor(Math.random() * max);
		let temp = this[i];
		this[i] = this[r];
		this[r] = temp;
	}
}

function makeMatches(mCount, wCount) {
	function Person(gender, n, preference) {
		this.engagedTo = null;
		this.gender = gender;
		this.preference = preference;
		this.currPrefIndex = 0;
		this.number = n;
	}
	if (!wCount) wCount = mCount;
	let prefs = [],
		men = [],
		women = [],
		propQueue = [],
		matches = [];

	function init() {

		// Init men and their preferences
		for (let i = 0; i < wCount; i++) prefs.push(i);
		for (let i = 0; i < mCount; i++) {
			prefs.__randomize__();
			let m = new Person('m', i, [...prefs]);
			men.push(m);
			console.log(i + ': [' + prefs.join(', ') + ']');
		}

		prefs = [];
		for (let i = 0; i < mCount; i++) prefs.push(i);
		for (let i = 0; i < wCount; i++) {
			prefs.__randomize__();
			let w = new Person('w', i, [...prefs]);
			women.push(w);
			console.log(i + ': [' + prefs.join(', ') + ']');
		}
		// console.log(men);
		// console.log(women);
	}

	function findMatches(forGender) {
		let thisGroup = forGender == 'm' ? men : women;
		let otherGroup = forGender == 'm' ? women : men;

		let steps = 0;
		while (propQueue.length /**/ && steps < 200000) { // */ ){
			let person = propQueue.shift();
			let number = person.number;
			let currPrefIndex = person.currPrefIndex;
			let mateNum = person.preference[currPrefIndex];
			let mate = otherGroup[mateNum];

			if (mate.engagedTo === undefined) {
				matches[number] = mateNum;
				person.engagedTo = mateNum;
				mate.engagedTo = number;
			}
			else {
				let fianceNum = mate.engagedTo;
				let fiance = thisGroup[fianceNum];
				let rank1 = mate.preference.indexOf(number);
				let rank2 = mate.preference.indexOf(fianceNum);

				// Determine who's accepted/rejected
				let accepted = rank1 < rank2 ? person : fiance;
				let reject = rank1 < rank2 ? fiance : person;

				// match is made
				accepted.engagedTo = mateNum;
				mate.engagedTo = accepted.number;
				matches[accepted.number] = mateNum;

				// rejected goes back to the queue
				reject.currPrefIndex++;
				reject.engagedTo = undefined;
				propQueue.push(reject);
			}

			steps++;
		}
		console.log('steps: ' + steps);
	}

	let allMatches = {};
	init();
	propQueue = [...men];
	findMatches('m');
	allMatches.m2w = [...matches];

	// reset
	matches = [];
	for (let i = 0; i < men.length; i++) {
		men[i].currPrefIndex = 0;
		men[i].engagedTo = undefined;
	}
	for (let i = 0; i < women.length; i++) {
		women[i].currPrefIndex = 0;
		women[i].engagedTo = undefined;
	}

	propQueue = [...women];
	findMatches('w');
	allMatches.w2m = [...matches];
	return allMatches;
}

function testGS(){
	const inputs = [
		{
			m: [
				[0, 1],
				[0, 1],
			],
			w: [
				[0, 1],
				[0, 1],
			]
		}
	];
	const correctOutputs = [
		{
			m: [0, 1],
			w: [0, 1],
		}
	];
	const outputs = [];

	function printResult(){
		outputs.forEach((output,i)=>{
			let input = inputs[i];
			console.log(`
test:  \t${i}
Input: \t${input[i]}
Output:\t${output[i]}
Answer:\t${correctOutputs[i]}
-----------------
			`);
		});
	}
	
	function runTest(){
		inputs.forEach(input=>{
			let output = gsAlgo(input);
			outputs.push(output);
		});
	}
}

/*
	`input` format: 
	{
		m: [
			[#, #, #], // man0's pref; lower idx means higher ranking
			[#, #, #], // man1's pref
			[#, #, #], // man2's pref
		],
		w: [
			[#, #, #], // woman0's pref
			[#, #, #], // woman1's pref
			[#, #, #], // woman2's pref
		]
	}
	
	`output` format:
	[#, #, #] 			// index is for a man's number
									// value is the man's match
	
	PRE:
		- m.length == w.length
		- a man's preference list include all women.
		- a woman's preference list include all men.

*/
function gsAlgo(input, proposer = 'm'){
	
	function createPersons(input, gender){
		function Person(gender, n, preference) {
			this.engagedTo = null;
			this.gender = gender;
			this.preference = preference;
			this.currPrefIndex = 0;
			this.number = n;
		}
		let arr = [];
		input.forEach((pref,idx)=>{
			let p = new Person(gender, idx, pref);
			arr.push(p);
		});
		return arr;
	}
	function makeMatches(g1, g2){
		function engage(p1, p2){
			p1.engagedTo = p2.number;
			p2.engagedTo = p1.number;
		}
		function disengage(p1, p2){
			p1.engagedTo = null;
			p2.engagedTo = null;
		}
		// return negative if challenger ranks higher (lower index on pref array). 
		function compare(target, fiance, challenger){
			let {preference} = target;
			let fianceRank = preference.indexOf(fiance.number);
			let challengerRank = preference.indexOf(challenger.number);
			return challengerRank - fianceRank;
		}
		
		let bachs = [...g1]; // bachelors or bachelorettes
		let pots = [...g2];	// potentials matches
		let matched = new Set(); // .add() / .delete()
		
		while(bachs.length){
			let bach = bachs.shift();
			// see if bach's pref is open
			let {currPrefIndex, preference} = bach;
			let targetNumber = preference[currPrefIndex];
			let target = pots[targetNumber];
			if(target.engagedTo === null){
				// target is not engaged; 
				engage(bach, target);
				matched.add(bach);
			} else {
				// target is engaged; 
				let fNumber = target.engagedTo; // Fiance or fiancee's number;
				let f = g1[fNumber];
				let verdict = compare(target, f, bach);
				if(verdict > 0){
					bachs.push(bach);
				} else {
					disengage(target, f);
					matched.delete(f);
					bachs.push(f);
					
					engage(target, bach);
					matched.add(bach);
				}
			}
			bach.currPrefIndex++;
		}
		
		
		let arr = [];
		g1.forEach(e=>arr.push(e.engagedTo));
		return arr;
	}
	function makeOutput(group){
		let matches = [];
		group.forEach(p=>{
			let f = p.engagedTo; // Fiancé or Fiancée
			matches.push(f);
		});
		return matches;
	}
	
	let {m, w} = input;
	m = createPersons(m, 'm');
	w = createPersons(w, 'w');
	
	// g1 proposes to g2
	let g1, g2;
	if(proposer == 'm'){
		g1 = m, g2 = w;
	} else {
		g1 = w, g2 = m;
	}
	
	return makeMatches(g1, g2);
	// let output = makeOutput(matchedGroup);
	// return output;
	
}

function generateInput(size){
	function shuffleArr(arr){
		let {length} = arr;
		for(let i = 0; i < length; i++){
			let r = Math.floor(Math.random() * length);
			let temp = arr[r];
			arr[r] = arr[i];
			arr[i] = temp;
		}
		return arr;
	}
	function getPref(group, arr){
		let s = size;
		while(s--){
			let pref = shuffleArr([...arr]);
			group.push(pref);
		}
	}
	let templateArr = (size=>{
		let arr = [];
		while(size) arr.push(--size);
		return arr;
	})(size);
	let obj = {m: [], w:[]};
	getPref(obj.m, templateArr);
	getPref(obj.w, templateArr);
	
	return obj;
}


'use strict';
/**
 * Gale Shapley Algorithm,
 * AKA Match making algorithm
 * 
 * get ideal match
 * 
 * 
 */


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

const GaleShapley = {
	algorithm(input, proposer = 'm'){
			
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
	},
	generateInput(size = 2){
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
	},
	testGS(){
		// To do;
	},
}

export {GaleShapley};
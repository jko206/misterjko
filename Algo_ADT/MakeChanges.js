'use strict';
/**
 * AKA Match making algorithm
 * 
 * get ideal match
 */
Array.prototype.__clone__ = function(){
	return [...this];
}

function makeChanges(denoms, goal){
	function greedy(changes, denomIndex, goal){
		if(goal == 0) return changes;
		else {
			let denom = denoms[denomIndex];
			if(denom > goal) return greedy(changes, denomIndex + 1, goal)
			else {
				changes.push(denom);
				return greedy(changes, denomIndex, goal - denom);
			}
		}
	}
	
	// solutions to any amount less than the goal
	// are themselves solutions.
	function dynamic(goal, denoms){
		let changes = [];
		changes[0] = [];
		let steps = 0;
		for(let i = 1; i <= goal; i++){
			let bestSolution;
			for(let j = 0; j < denoms.length; j++){
				let denom = denoms[j];
				let temp = [];
				if(i - denom < 0) continue;
				
				temp = changes[i - denom];
				temp = [...temp];			//clone
				temp.push(denom);
				if(!bestSolution || temp.length < bestSolution.length) 
					bestSolution = temp;
				steps++;
			}
			changes[i] = bestSolution;
		}
		console.log('Dynamic steps: ' + steps);
		return changes;
	}
	//high to low
	denoms.sort(function(a, b){
		return b - a;	
	});
	let g = greedy([], 0, goal);
	
	
	//low to high
	denoms.sort(function(a, b){
		return a - b;	
	});
	let d = dynamic(goal, denoms);
	d = d[goal];
	return {greedy : g, dynamic : d};
}

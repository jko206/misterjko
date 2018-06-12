// Priority Queue (Heap implementation)
// add, remove (return removed), print, get()
function PriorityQueue (){
	let queue = [''];
	function bubbleUp(idx){
		if(idx === undefined) idx = queue.length - 1;
		if(idx > 1){
			let parentIdx = Math.floor(idx / 2);
			let parent = queue[parentIdx];
			let child = queue[idx]
			if(parent > child){
				let temp = parent;
				queue[parentIdx] = child;
				queue[idx] = temp;
				bubbleUp(parentIdx);
			}
		}
	}
	
	function bubbleDown(idx){
		if(idx < queue.length / 2){
			let idx1 = idx * 2, idx2 = idx1 + 1,
				child1 = queue[idx1] || Infinity,
				child2 = queue[idx2] || Infinity;
				
			if(child1 < child2){
				queue[idx] = child1;
				queue[idx1] = undefined;
				bubbleDown(idx1);
			} else {
				queue[idx] = child2;
				queue[idx2] = undefined;
				bubbleDown(idx2);
			}
		}
	}
	this.add = function(elem){
		let idx = queue.length;
		queue.push(elem);
		bubbleUp(idx);
	};
	this.remove = function(idx){
		if(idx >= queue.length || idx < 1) throw new Error('Index '+idx+' is invalid.');
		let elem = queue[idx];
		queue[idx] = undefined;
		bubbleDown(idx);
		let last = queue.pop();
		if(last) queue.push(last); // get rid of last undefined
		return elem;
	};
	this.getNext = function(){
		return this.remove(1)
	};
	this.print = function(){
		console.log(queue);
	};
}

function pqTester(numberCount, maxNumber){
	if(!numberCount) numberCount = 10;
	if(!maxNumber) maxNumber = numberCount * 3;
	let nums = [], deleteIndices = [];
	// three random indices to delete later;
	let count = 3;
	while(count){
		let r = Math.floor(Math.random() * (numberCount));
		deleteIndices.push(r);
		count--;
	}
	deleteIndices.sort((a,b)=>{return b-a}); // order big to small
	while(numberCount){
		let r = Math.random() * maxNumber;
		r = Math.floor(r);
		nums.push(r);
		numberCount--;
	}
	console.log('original array: ' + nums);
	
	let pq = new PriorityQueue();
	// Show adding
	while(nums.length){
		let num = nums.shift();
		pq.add(num);
		pq.print();
	}
	
	// Show deleting
	/*
	while(deleteIndices){
		let idx = deleteIndices.shift();
		try{
			pq.remove(idx);
			pq.print();
		} catch (e){
			deleteIndices.unshift(--idx);
		}
	}
	*/
	return pq;
}

// Array List

// simulations
'use strict';
/**
 * AKA Match making algorithm
 * 
 * get ideal match
 */

function Person(gender, n, preference) {
	this.engagedTo = undefined;
	this.gender = gender;
	this.preference = preference;
	this.currPrefIndex = 0;
	this.number = n;
}

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

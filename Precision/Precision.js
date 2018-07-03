// v.0.9

'use strict';

let handBrake = function(breakAt = 1000){
    let count = 0;
    return function(){
        count++;
        return count < breakAt;
    };
};

let tester;

const Precision = (function(){
	// Internal functions and states
	const drop = Math.floor;
	const raise = Math.ceil;
	const _C_ = {
		// Safe integers
		MAX_INT: Number.MAX_SAFE_INTEGER,
		MIN_INT: Number.MIN_SAFE_INTEGER,
		MAX_DEC: (function(){
			let dec = 1;
			let limit = Number.MAX_SAFE_INTEGER / 10;
			while(dec < limit) dec *= 10;
			return dec;
		})(),
	};
	const config = {
		INITIAL_MAX_PRIME : drop(_C_.MAX_INT**0.25),
		MAX_PRIME_SCALE_UP_BY: 10,
	};
	
	/*			OPERATIONS			*/
	const CommonFinderOps = {
		euclidean(a, b){
			if(a === 0) return b;
			if(b === 0) return a;
			
			let min = a < b ? a : b;
			let max = a > b ? a : b;
			max %= min;
			return this.euclidean(min, max);
		},
		filter(nums){
			nums = nums.filter(e=>{
				if(e !== parseInt(e)) throw new Error(`${e} is not an integer`);
				return e !== 0 && e !== 1 && e !== -1;
			}).map(e => e < 0 ? -e : e);
			return nums;
		}
	};
	const FactorialOps = (function(){
		function getQueue(from, to = 1){
			let queue = [];
			while(from > to){
				queue.push(from--);
			}
			return queue;
		}
		function primeFactorize(nums){
			// index-> prime factor 
			// value-> number of that prime factor
			let pfs = []; //prime factors
			while(nums.length){
				let n = nums.shift();
				if(n === 1) continue;
				let pf = P__.primeFactorize(n);
				pf.forEach(e=>{
					let count = pfs[e] || 0;
					count++;
					pfs[e] = count;
				});
			}
			return pfs;
		}
		function reduceToMainNums(main, subtractor){
			let factors = []; // the product all its elem. is the solution
			main.forEach((e,i,arr)=>{
				let thisCount = e;
				let reduceBy = subtractor[i] || 0;
				thisCount -= reduceBy;
				while(thisCount--) factors.push(i);
			});
			return factors;
		}
		
		return function(n, r, n_r, options){
			/*						n!		<----- top num
				combo(n, r) = --------------
								n! * (n-r)! <----- bottom num
				combo(n, r) === combo(n, n-r), hence the following:
			*/
			let topNums = getQueue(n, r);
			let botNums = getQueue(n_r);
			
			let topNumsPF = primeFactorize(topNums);
			let botNumsPF = primeFactorize(botNums);
			let mainNums = reduceToMainNums(topNumsPF, botNumsPF);
			mainNums.sort((a,b)=>a-b);
			mainNums = ArrayOps.m.condense(mainNums);
			mainNums = mainNums.map(num=>{
				return (num+'').split('').reverse().map(n=> (n>>>0));
			});
			while(mainNums.length > 1){
				let a = mainNums.shift();
				let b = mainNums.shift();
				let product = ArrayOps.multiply(a, b);
				mainNums.push(product);
			}
			let result = mainNums.shift();
			if(options && options.getArray) return result;
			return result.reverse().join('');
		}
	}());
	
	const ArrayOps = {
		// additive ops
		a: {
			carry(nums, digitLimit = 10){
				for(let i = 0; i < nums.length; i++){
					let curr = nums[i] || 0;
					if(curr >= digitLimit){
						let next = nums[i+1] || 0;
						next += drop(curr/digitLimit);
						curr %= digitLimit;
						nums[i] = curr;
						nums[i+1] = next;
					}
				}
				return nums;
			},
			condense(nums){
				let condensed = [];
				let curr = 0;
				let level = 1;
				while(nums.length){
					let n = nums.shift();
					let temp = n * level + curr;
					if(temp >= _C_.MAX_DEC){
						condensed.push(curr);
						curr = n;
						level = 10;
					} else {
						curr = temp;
						level *= 10;
					}
				}
				condensed.push(curr);
				nums = condensed;
				return condensed;
			},
			expand(nums){
    			let expanded = [];
    			let max;
    			while(nums.length){
    				let num = nums.shift();
    				max = _C_.MAX_DEC;
    				while(max > 1){
    					let unit = num%10;
    					expanded.push(unit);
    					num = drop(num/10);
    					max /= 10;
    				}
    			}
    			// Discard leading zeros
    			while(expanded[expanded.length - 1] === 0) expanded.pop();
    			nums = expanded;
    			return expanded;
    		},
		},
		// multiplicative ops
		m: {
			condense(nums){
				let condensed = []; 
				let curr = 1;
				while(nums.length){
					let num = nums.shift();
					let product = curr * num;
					if(product <= _C_.MAX_DEC){
						curr = product;
					} else {
						condensed.push(curr);
						curr = num;
					}
				}
				condensed.push(curr);
				return condensed;
			},
			expand(nums){
				
			},
			getBlueprint(nums){
				let blueprint = [];
				nums.forEach(num=>{
					let pfs = P__.primeFactorize(num);
					pfs.forEach(prime=>{
						let currCount = blueprint[prime] || 0;
						currCount++;
						blueprint[prime] = currCount;
					});
				});
				return blueprint;
				
				
			},
			buildFromBlueprint(bp, condense = true){
				let pfs = []; // prime factors
				bp.forEach((e,i,arr)=>{
					let count = e;
					while(count--) pfs.push(i);
				});
				if(condense) return this.condense(pfs);
				return pfs;
			},
		},
		
		compare(A, B){
			while(A[A.length -1] === 0) A.pop();
			while(B[B.length -1] === 0) B.pop();
			if(A.length !== B.length){
				if(A.length > B.length) return 1;
				else return -1;
			} else {
				while(A.length){
					let a = A.pop();
					let b = B.pop();
					if(a > b) return 1;
					else if(a < b) return -1;
				}
				return 0;
			}
		},
		
		wholeToArnum(n){
			return (n + '').split('').reverse().map(e=>e>>0);
		},
		decToArnum(n){
			//return with level	
			n = n.split('').reverse();
			let decLength = n.indexOf('.');
			n.splice(decLength, 1);
			n = n.map(e=>e>>0);
			while(n[n.length - 1] === 0) n.pop();
			let denom = [1];
			let loopCount = decLength;
			while(loopCount--){
				denom.unshift(0);
			}
			return {numer: n, denom, decLength};
		},
		repDecToArnum(n, precedingDigits = 0){
			let numer = this.wholeToArnum(n);
			let denom = [];
			let ninesCount = numer.length;
			let brake = handBrake(20);
			while(ninesCount-- && brake()){
				denom.unshift(9);
			}
			brake = handBrake(200);
			while(precedingDigits-- && brake()){
				denom.unshift(0);
			}
			return {numer, denom};
		},
		arnumToWhole(arnum){
			arnum = [...arnum].reverse();
			return arnum.join('');
		},
		
		add(...nums){
		    nums = nums.filter(e=>{
		       e = e.join('');
		       return !is.zero(e);
		    });
	        if(nums.length === 0) return [0];
	        
			let carry = false;
	        let sum = nums.shift();
		    while(nums.length > 0){
		        let N = nums.shift();
		        N.forEach((e,i)=>{
		        	let s = sum[i] || 0;
		        	let temp = s + e;
		        	if(temp > _C_.MAX_DEC / 10) carry = true;
		        	sum[i] = temp;
		        });
		        if(carry) this.a.carry(sum);
		    }
		    this.a.carry(sum);
		    return sum;
		},
		subtract(minuend, ...subtrahends){
			let sub = this.add(...subtrahends);
			minuend.forEach((e,i,arr)=>{
				let s = sub[i] || 0;
				let diff = e - s;
				if(diff < 0){
					diff += 10;
					arr[i+1]--;
				}
				arr[i] = diff;
			});
			let lastDigit = minuend[minuend.length - 1];
			if(lastDigit < 0 || isNaN(lastDigit)) throw new Error('Minuend < subtrahend(s)');
			while(lastDigit === 0){
				minuend.pop();
				lastDigit = minuend[minuend.length - 1];
			}
			return minuend;
		},
		multiply(...nums){
			while(nums.length > 1){
				let A = nums.shift();
				let B = nums.shift();
				let aNum = A.join('');
				let bNum = B.join('');
				if(is.zero(aNum) || is.zero(bNum)) return [0];
				let toSum = [];
				let multiplesOfB = [];
				for(let i = 0; i < A.length; i++){
					let a = A[i];
					let prod = [];
					for(let j = 0; j < i; j++) prod.push(0);
					
					let multB = multiplesOfB[a];
					if(multB) prod.push(...multB);
					else {
						let temp = [];
						for(let j = 0; j < B.length; j++){
							let b = B[j];
							temp.push(a * b);
						}
						multiplesOfB[a] = [...temp];
						prod.push(...temp);
					}
					toSum.push(prod);
				}
				toSum = this.add(...toSum);
				nums.push(toSum);
			}
			return nums.pop();
		},
		divide(A, B, options = {}){
			function findFit(target){
			    function recourse(low, high){
			        if(high - low === 1){
			        	return {multiple: low, fit: multiples[low]};
			        } else {
			            let middle = raise((low + high)/2);
			            let h = multiples[high];
			            let m = multiples[middle];
			            let l = multiples[low];
			            if(!m){
			                let temp = ArrayOps.multiply([...B], [middle]);
			                multiples[middle] = [...temp];
			                m = temp;
			            }
			            let comp = ArrayOps.compare([...m], [...target]);
			            if(comp == 0){
			                return {multiple: middle, fit: m}
			            } else if(comp == -1){ 
			            	// middle lower than target
			                return recourse(middle, high);
			            } else {
			            	// middle higher than target
			                return recourse(low, middle);
			            }
			        }
			    }
			    return recourse(0, 10);
			}
			let {
				divisorIsQueue,
				getMod,
				precision,
				condenseDivisor,
			} = options;
			if(is.zero(B)){
				throw new Error('A number cannot be divided by 0.');
			} else if (B.length === 1 && B[0] == 1){
				let quotient = A.reverse().join('');
				if(getMod){
					return {
						quotient,
						mod: '0',
					}
				} else {
					return quotient;
				}
			}
			let multiples = [[0]];
			
			//unpack options
			
			// Initialize
			if(divisorIsQueue){
				B = ArrayOps.m.condense(B);
				B = B.map(num => {
					return this.wholeToArnum(num);
				});
				B = this.multiply(...B);
				condenseDivisor = false;
			} 
			if(condenseDivisor){
				B = this.m.condense(B);
			}
			let Q = '';
			multiples[10] = [0, ...B];
			
			// Actual algo
			// Get a chunk such that chunk.length -1 === B.length;
			let chunk = (_=>{
				let targetLen = B.length - 1;
				let chunk = [];
				while(chunk.length < targetLen){
					let digit = A.pop();
					chunk.unshift(digit);
				}
				return chunk;
			})();
			while(A.length){
				// Add digit to chunk
				let digit = A.pop();
				chunk.unshift(digit);
				
				let {multiple, fit} = findFit(chunk)
				Q += multiple;
				
				chunk = this.subtract(chunk, fit);
				
				if(!A.length) break; 
				if(!chunk.length){
					while(A.length && A[A.length - 1] === 0){
						Q += '0';
						A.pop();
					}
				}
			}
			while(Q.length > 1 && Q[0] === '0' && Q[1] !== '.'){
				Q = Q.substr(1);
			}
			
			if(getMod){
				let mod = chunk.reverse().join('');
				mod = mod || '0';
				return {mod, quotient: Q};
			}
			if(chunk.length && precision){
				Q += '.';
				while(precision){
					// do stuff
					chunk.unshift(0);
				
					let {multiple, fit} = findFit(chunk, B)
					Q += multiple;
					
					chunk = this.subtract(chunk, fit);
					precision--;
				}
			}
			if(Q[0] === '.') Q = '0' + Q;
			
			
			return Q;
		},
		
		
		primeFactorize(num){
			num = this.a.condense(num);
			if(num.length > 1){
				let pfs = [];
				let primes = PrimeOps.getPrimeNumbers(10000);
				let gcd = P__.gcd(...num);
				num.forEach((e,i,arr)=>{
					if(e) arr[i] = e / gcd;
				});
				let temp = PrimeOps.primeFactorize(gcd);
				pfs.push(...temp);
				
				// EXPENSIVE FRKN OP
				num = this.a.expand(num);
				let prime = primes.shift();
				let hb = handBrake(100000);
				while(primes.length && hb()){
					let {
						mod, 
						quotient,
					} = this.divide([...num], [prime], {getMod: true});
					if(mod == 0){
						pfs.push(prime);
						if(quotient === (parseInt(quotient) + '')){
							quotient = parseInt(quotient);
							let temp = PrimeOps.primeFactorize(quotient);
							pfs.push(...temp);
							return pfs;
						} 
						num = this.wholeToArnum(quotient);
					} else {
						prime = primes.shift();
					}
				}
				while(num[num.length - 1] === 0) num.pop();
				pfs.unfactorized = num;
				return pfs;
			} else {
				let n = num.shift();
				return PrimeOps.primeFactorize(n);
			}
		},
		gcf(a, b){
			let comparison = this.compare([...a], [...b]);
			let min, max;
			if(comparison === 0) return a;
			else if(comparison === -1){
				min = a;
				max = b;
			} else {
				min = b;
				max = a;
			}
			let {
				mod,
				quotient,
			} = this.divide(max, min, {getMod: true});
			if(is.zero(mod)){
				return min;
			} else {
				mod = this.wholeToArnum(mod);
				return this.gcf(min, mod);
			}
		},
		reduce(numer, denom){
			//find gcf
			let g = this.gcf([...numer], [...denom]);
			let n = this.divide(numer, [...g]);
			let d = this.divide(denom, [...g]);
			n = this.wholeToArnum(n);
			d = this.wholeToArnum(d);
			return {n, d};
			//divide numer and denom by gcf
		},
	};
	const PrimeOps = {
		max_prime : 2,
		primes : [2],
		findPrimes(limit){
			function processInput(num){
				if(!Number.isSafeInteger(num)){
					throw new Error('Prime number must be less than _C_.MAX_INT');
				}
				if(num < 2){
					throw new Error('Prime number must be an integer greater than 2.');
				}
				return num;
			}
			if(limit <= PrimeOps.max_prime) return;
			else if(limit > _C_.MAX_INT) 
				throw new Error('Precision cannot find prime greater than Number.MAX_SAFE_INTEGER');
			let primes = this.primes;
			limit = processInput(limit);
			// 2 is the only even prime, so from 3 and on, check only odd numbers
			outer: 	for(let i = this.max_prime + 1; i < limit; i += 2){
				inner: for(let j = 0; j < primes.length; j++){
					// Check divisibility by other primes
					let prime = primes[j];
					let mod = i%prime;
					if(mod === 0) continue outer;
		        }
		        primes.push(i);
		    }
		    this.primes = primes;
		    this.max_prime = primes[primes.length - 1];
			return primes;
		},
		getPrimeNumbers(a, b){
			let primes = [...this.primes];
			if(a !== undefined && b !== undefined ){
				// a is min, b is max;
				// if b > currMax, make more priems
				primes = primes.filter(e=> (e >=a) && (e <=b));
				return primes;
			} else if(a !== undefined){
				// a is max;
				if(a > PrimeOps.max_prime) PrimeOps.findPrimes(a);
				primes = primes.filter(e=> e <=a);
				return primes;
			} else {
				return primes;
			}
		},
		primeFactorize(num){
			if(num > this.max_prime){
				if(num > _C_.MAX_INT){
					throw new Error(
					 	'Precision currently cannot prime factorize integers greater'
					 	+ 'than ' + _C_.INITIAL_MAX_PRIME
					);
				}
				this.findPrimes(num);
			}
			let origNum = num;
			let pf = [];
			let primes = [...this.primes];
			let primeIdx = 0;
			let prime = primes[primeIdx];
			while(!primes.includes(num)){
				let quotient = num / prime;
				if(is.integer(quotient)){
					num = quotient;
					pf.push(prime);
				} else {
					primeIdx++;
					if(primeIdx > primes.length){
						let scale = config.MAX_PRIME_SCALE_UP_BY;
						let newMax = PrimeOps.max_prime * scale;
						if(!is.safeInt(newMax)){
							throw new Error(`${origNum} is too big to find the prime factors of precisely.`);
						}
						PrimeOps.findPrimes(newMax);
						primes = PrimeOps.primes;
					}
					prime = primes[primeIdx];
				}
			}
			pf.push(num);
			return pf;	
		},
	};
	
	const is = {
		Arnum(n){},
		Number(n){
			return n instanceof _Number;
		},
		
		// test strings
		mixedFrac(n){
			return /^\d+\s\d+\s?\/\s?\d+$/.test(n+'');
		},
		frac(n){
			return /^\d+\s?\/\s?\d+$/.test(n+'');
		},
		repeatingDecimal(n){
			return /^\d+(\.\d+)?\.{3}\d+$/.test(n+'');
		},
		decimal(n){
			return /^\d*\.\d+$/.test(n+'');
		},
		wholeNum(n){
			return /^\d+$/.test(n+'');
		},
		zero(n){
			if(n === '') return true;
			if(n instanceof Array){
				if(n.length === 0) return true;
				if(n.length === 1 && n[0] == 0) return true;
				return false;
			}
			let digits = n.match(/\d/g) || 0;
			let zeros = n.match(/0/g) || 0;
			return zeros && digits.length === zeros.length;
		},
		negative(n){
			return n[0] === '-';
		},
		integer(n){
			n += '';
			if(this.negative(n)) n = n.substr(1);
			let isW = this.wholeNum(n);
			let isZ = this.zero(n);
			return isW || isZ;
		},
		safeInt(n){
			if(typeof n === 'string' && n !== parseInt(n) +'') return false;
			return Number.isSafeInteger(n);
		},
		prime(n){
			if(n > PrimeOps.max_prime) PrimeOps.findPrimes(n);
			return PrimeOps.primes.includes(n);
		},
		scinot(n){
			return /^\d+(\.\d+)?(\.{3}\d+)?(E|e)(\+|\-)?\d+$/.test('' + n);
		},
	};
	tester = is;
	let P__ = {};
	/*********************** Math ***********************/
	// Prime Number related
	P__.primeFactorize = function(num){
		return PrimeOps.primeFactorize(num);
	};
	P__.getPrimeNumbers = function(a, b){
		return PrimeOps.getPrimeNumbers(a,b);
	};
	P__.factors = function(num){
		let factors = [1];
		for(let i = 2; i < num; i++){
			if(num%i === 0) factors.push(i);
		}
		return factors;
	};
	P__.isPrime = function(num){
		return is.prime(num);
	};
	
	P__.gcd = function(...nums){
		return P__.gcf(...nums);
	};
	P__.gcf = function(...nums){
		nums = CommonFinderOps.filter(nums);
		while(nums.length > 1){
			let a = nums.shift();
			let b = nums.shift();
			let g = CommonFinderOps.euclidean(a, b);
			nums.push(g);
		}
		return nums[0];
	};
	P__.lcm = function(...nums){
		nums = CommonFinderOps.filter(nums);
		while(nums.length > 1){
			let a = nums.shift();
			let b = nums.shift();
			let g = CommonFinderOps.euclidean(a,b);
			let l = a / g * b;
			nums.push(l);
		}
		return nums.shift();
	};
	
	P__.factorial = function(num, options = {}){
        num = parseInt(num);
        num = num < 0 ? -num : num;
        return FactorialOps(num, 1, 1, options);
	};
	P__.combination = function(n, r, options = {}){
        n = parseInt(n);
        r = parseInt(r);
	    let temp = n - r;
	    let n_r;
	    if(temp > r){
	    	n_r = r;
	    	r = temp;
	    } else {
	    	n_r = temp;
	    }
	    
		return FactorialOps(n, r, n_r, options);
	};
	P__.permutation = function(n, r, options = {}){
        n = parseInt(n);
        r = parseInt(r);
	    return FactorialOps(n, n-r, 1, options);
	};
	
	P__.changeBase = function(n1, b1, b2){
		function toBase10(n, b){
			let sum = 0;
			// A25C -> [C, 5, 2, A]
			n.split('').reverse().forEach((e,i)=>{
				let val = numAlphaMap.indexOf(e);
				if(val >= b) throw new Error(`Base ${b} number cannot have ${val} as a digit.`);
				val *= b**i;
				sum += val;
			});
			return sum;
		}
		function toBaseB(n, b){
			n = parseInt(n);
			let n1 = '';
			while(n){
				let mod = n%b;
				n = drop(n/b);
				n1 = mod + n1;
			}
			return n1;
		}
		let numAlphaMap = [
				'0',	'1',	'2',	'3',	'4',		
				'5',	'6',	'7',	'8',	'9',
				'A',	'B',	'C',	'D',	'E',
				'F',	'G',	'H',	'I',	'J',
				'K',	'L',	'M',	'N',	'O',
				'P',	'Q',	'R',	'S',	'T',
				'U',	'V',	'W',	'X',	'Y',
				'Z',
			];
		if(typeof n1 === 'string'){
			 n1 = n1.toUpperCase();
		} else if(n1 instanceof Array){
			
		} else {
			n1 += '';
		}
		
		if(b1 !== 10) n1 = toBase10(n1, b1);
		if(b2 !== 10) n1 = toBaseB(n1, b2);
		
		return n1;
		
	}
	
	///////////////////////////////////
	
	const _Number = function(num, base){
		/*
			Acronyms: 
				W = Whole
				N = Numerator
				D = Denominator
			Valid formats (W: integer, N: Whole, D: Natural): 
			- W N / D, 
			- N / D
			- W
			- Decimal
			- Repeating Decimal
		*/
		function processInput(num){
			function decimalPower(pow){
				//pow is strum-n
				let dec = [1];
				while(pow--) dec.unshift(0);
				return dec;
			}
			let parts;
			let numer, denom, positivity;
			if(is.negative(num)){
				positivity = -1;
				num = num.substr(1);
			} else {
				positivity = 1;
			}
			let upNumer = [1];
			let upDenom = [1];
			if(is.scinot(num)){
				let temp = num.split(/[e|E]/);
				num = temp[0];
				let power = temp[1] >> 0;
				if(power < 0){
					power *= -1;
					upDenom = decimalPower(power);
				} else if(power > 0){
					upNumer = decimalPower(power);
				}
			}
			
			if(is.zero(num)){
				numer = [0], denom = [1], positivity = 0;
			} else if(is.mixedFrac(num)){
				parts = num.match(/\d+/g)
				parts = parts.map(function(e){
					return ArrayOps.wholeToArnum(e);
				});
				let w = parts[0], 
					n = parts[1],
					d = parts[2];
				let n1 = ArrayOps.multiply(w, d);
				numer = ArrayOps.add(n1, n);
				denom = d;
			} else if(is.frac(num)){
				parts = num.match(/\d+/g).map(function(e){
					return ArrayOps.wholeToArnum(e);	
				});
				numer = parts[0];
				denom = parts[1];
			} else if(is.repeatingDecimal(num)){
				let [nonRep, repDec] = num.split('...');
				let n1, d1, n2, d2, decLength;
				if(is.integer(nonRep)){
					decLength = 0;
					n1 = ArrayOps.wholeToArnum(nonRep);
					d1 = [1];
				} else {
					nonRep = ArrayOps.decToArnum(nonRep);
					decLength = nonRep.decLength;
					n1 = nonRep.numer;
					d1 = nonRep.denom;
				} 
				
				repDec = ArrayOps.repDecToArnum(repDec, decLength);
				
				n2 = repDec.numer;
				d2 = repDec.denom;
				n1 = ArrayOps.multiply(n1, d2);
				n2 = ArrayOps.multiply(n2, d1);
				numer = ArrayOps.add(n1, n2);
				denom = ArrayOps.multiply(d1, d2);
			} else if(is.decimal(num)){
				num = ArrayOps.decToArnum(num);
				numer = num.numer;
				denom = num.denom;
			} else if(is.wholeNum(num)){
				numer = ArrayOps.wholeToArnum(num);
				denom = [1];
			} else {
				throw new Error(`${num} is not a valid form of input.`);
			}
			numer = ArrayOps.multiply(numer, upNumer);
			denom = ArrayOps.multiply(denom, upDenom);
			return {numer, denom, positivity};
		}
		
		const isInstance = this instanceof _Number;
		if(!isInstance){
			return new _Number(num);
		}
		if(is.Number(num)){
			this.numer = [...num.numer];
			this.denom = [...num.denom];
			this.positivity = num.positivity;
			this.base = num.base;
		} else {
			this.base = base || 10;
			num += '';
			num.trim();
			let {numer, denom, positivity} = processInput(num);
			let {n, d} = ArrayOps.reduce(numer, denom);
			
			this.numer = n;
			this.denom = d;
			this.positivity = positivity;
		}
	};
	/*
		options:
		-precision: how many decimals digits to display
		-showRepDec: show repeating decimals following ...
	*/
	_Number.prototype.toString = function(options = {}){
		let {
			//getRepDec,
			getFrac,
			getMixedNumber,
			getScinot,
			precision,
		} = options;
		let isInt = this.isInt() && !getScinot;
		let sign = this.positivity === -1 ? '-' : '';
		// if(getRepDec){
		// 	// need to work on this...
		// } else 
		if(getFrac){
			let {w, n, d} = this.getFrac({getMixedNumber});
			w = w === '0' ? '' : w + ' ';
			let fracStr = `${w}${n}/${d}`;
			return sign + fracStr;
		} else if(precision || isInt){
			let numer = [...this.numer];
			let denom = [...this.denom];
			let q = ArrayOps.divide(numer,denom, {precision});
			return q;
		} else if(getScinot){
			return this.valueOf() + '';
		}
		return this.valueOf() + '';
	};
	_Number.prototype.valueOf = function(){
		let precision = 50;
		let numer = [...this.numer];
		let denom = [...this.denom];
		let q = ArrayOps.divide(numer, denom, {precision});
		return parseFloat(q) * this.positivity;
	};
	/*
		format:
			- 0 -> reduce fraction (default)
			- 1 -> mixed fraction
			- 2 -> decimal fraction (denom is power of 10);
		returns:
			{numer, denom, positivity}
	*/
	_Number.prototype.getFrac = function(options = {}){
		let {
			getMixedNumber,
		} = options;
		let n = [...this.numer];
		let d = [...this.denom];
		let isWholeNum = d.length === 1 && d[0] === 1;
		if(isWholeNum || !getMixedNumber){
			n = ArrayOps.arnumToWhole(n);
			d = ArrayOps.arnumToWhole(d);
			return {n, d, positivity: this.positivity};
		} else {
			let result = ArrayOps.divide([...n], [...d], {getMod: true});
			let {
				quotient,
				mod,
			} = result;
			d = ArrayOps.arnumToWhole(d);
			return {
				w: quotient,
				n: mod,
				d,
				positivity: this.positivity
			};
		}
	};
	_Number.prototype.clone = function(){
		return new _Number(this);	
	};
	
	_Number.prototype.isEqualTo = function(num){
		if(!is.Number(num)) num = new _Number(num);
		if(this.positivity !== num.positivity) return false;
		else if(this.positivity === 0 && num.positivity === 0) return true;
		let nComp = ArrayOps.compare([...this.numer], [...num.numer]);
		let dComp = ArrayOps.compare([...this.denom], [...num.denom]);
		return nComp === 0 && dComp === 0;
	};
	_Number.prototype.equals = function(num){
		return this.isEqualTo(num);
	}
	_Number.prototype.isGT = function(num){
		if(!is.Number(num)) num = new _Number(num);
		if(this.positivity > num.positivity) return true;
		else if(this.positivity < num.positivity) return false;
		else if(this.positivity === 0 && num.positivity === 0) return false;
		let n1 = [...this.numer], 
			n2 = [...num.numer],
			d1 = [...this.denom],
			d2 = [...num.denom];
		let p1 = ArrayOps.multiply(n1, d2);
		let p2 = ArrayOps.multiply(n2, d1);
		let comparison = ArrayOps.compare(p1, p2);
		return this.positivity === comparison; // (+ & 1) || (- & -1) -> true
		
	};
	_Number.prototype.isGTE = function(num){
		return this.isEqualTo(num) || this.isGT(num);
	};
	_Number.prototype.isLT = function(num){
		return !this.isGTE(num);
	};
	_Number.prototype.isLTE = function(num){
		return !this.isGT(num);
	};
	
	_Number.prototype.isInt = function(){
		let d = this.denom;
		return d.length === 1 && d[0] === 1;
	};
	_Number.prototype.isDec = function(){
		return !this.isInt();
	};
	
	_Number.prototype.plus = function(num){
		if(!is.Number(num)) num = new _Number(num);
		let n1 = this;
		let n2 = num;
		let num1 = [...n1.numer];
		let num2 = [...n2.numer];
		let den1 = [...n1.denom];
		let den2 = [...n2.denom];
		
		num1 = ArrayOps.multiply([...num1], [...den2]);
		num2 = ArrayOps.multiply([...num2], [...den1]);
		let den = ArrayOps.multiply([...den1], [...den2]);
		if(n1.positivity === n2.positivity){
			num1 = ArrayOps.add(num1, num2);
		} else {
			let comparison = ArrayOps.compare([...num1], [...num2]);
			if(comparison === 0){
				this.numer = [];
				this.denom = [1];
				this.positivity = 0;
				return this;
			} else if(comparison === 1){
				num1 = ArrayOps.subtract(num1, num2);
			} else {
				num1 = ArrayOps.subtract(num2, num1);
			}
			this.positivity *= comparison;
		}
		let reduced = ArrayOps.reduce(num1, den);
		this.numer = reduced.n;
		this.denom = reduced.d;
		
		return this;
	};
	_Number.prototype.minus = function(num){
		if(!is.Number(num)) num = new _Number(num);
		num.negate();
		this.plus(num);
		return this;
	};
	_Number.prototype.times = function(num){
		if(!is.Number(num)) num = new _Number(num);
		let n1 = [...this.numer];
		let d1 = [...this.denom];
		let n2 = [...num.numer];
		let d2 = [...num.denom];
		
		let reduced1 = ArrayOps.reduce(n1, d2);
		let reduced2 = ArrayOps.reduce(n2, d1);
		
		n1 = reduced1.n;
		d2 = reduced1.d;
		n2 = reduced2.n;
		d1 = reduced2.d;
		
		let n = ArrayOps.multiply(n1, n2);
		let d = ArrayOps.multiply(d1, d2);
		this.numer = n;
		this.denom = d;
		
		let pos1 = this.positivity;
		let pos2 = num.positivity;
		this.positivity = pos1 * pos2;
		
		return this;
	};
	_Number.prototype.divBy = function(num){
		if(is.zero(num+'')) throw new Error('No number can be divided by 0.');
		if(!is.Number(num)) num = new _Number(num);
		num.reciprocate();
		this.times(num);
		return this;
	};
	
	_Number.prototype.isTermDec = function(){
		if(this.isInt()) return true;
		
	};
	_Number.prototype.isRepDec = function(){
		return this.isTermDec();
	};
	
	_Number.prototype.getNumerator = function(){
		return [...this.numer].reverse().join('');
	};
	_Number.prototype.getDenominator = function(){
		return [...this.denom].reverse().join('');
	};
	
	_Number.prototype.power = function(int){
		if(int === 0){
			this.numer = 1;
		} else if(int < 0){
			this.reciprocate();
			return this.power(-int);
		} else {
			
		}
		return this;
	};
	_Number.prototype.negate = function(){
		this.positivity *= -1;
		return this;
	};
	_Number.prototype.reciprocate = function(){
		let temp = this.numer;
		this.numer = this.denom;
		this.denom = temp;
		return this;
	};
	_Number.prototype.inverse = function(){
		this.reciprocate();
		return this;
	};
	_Number.prototype.root = function(n){
		this.powerOf(`1 / ${n}`);
		return this;
	};
	
	P__.Number = _Number;
	
	////////////// Initialize
	
	PrimeOps.findPrimes(config.INITIAL_MAX_PRIME);
	
	/*
	supplement `is`:
		-is.Arnum()
		-is.int();
		-is.regum();
		etc
	
	_Number.prototype.isRepDec = function(){
	    return !this.isTermDec();
	};
	_Number.prototype.isTermDec = function(){
	    if(this.isInt()) return true;
	    // prime factors of denom consists only of 2 or 5
	}; 
	
	// Return pascal's triangle to a certain row
	P__.pascalsTriangle = function(maxRow){};
	
	//	from <= random <= to
	P__.random = function(...args){
		function getDecimalLevel(num){}
		function levelNums(a, b){}
		let from, to, decimal;
		if(args.length === 1){
			from = 0;
			to = args[0];
			decimal = getDecimalLevel(to);
		} else if(args.length === 2){
			from = args[0];
			to = args[1];
			let dec1 = getDecimalLevel(from);
			let dec2 = getDecimalLevel(to);
			decimal = dec1 > dec2 ? dec1 : dec2;
		} else {
			from = args[0];
			to = args[1];
			decimal = args[2];
		}
		let leveled = levelNums(from, to);
		from = leveled.from;
		to = leveled.to;
		let range;
		if(is.safeInt(from) && is.safeInt(to)){
			range = to - from;
			
		} else {

		}
	}
	*/
	
	return P__;
}());

if(!P__){
	var P__ = Precision;
}
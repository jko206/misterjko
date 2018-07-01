
const PreMath = (function(){

	/*
		Rational Number methods:
		-toString
		-getFrac(inOrigDenom)
		-getDec
		-plus()
		-minus()
		-times()
		-divBy()
		-

		Private variables:
		-numer
		-denom
		-original denom
		-isModified
		-isRepDecimal
		-
	*/
	function RationalNumber(n, repDigits){};

	RationalNumber.prototype.constructor = RationalNumber;


	let primes = [];
	let maxPrime = 2;
	return {
		// Tests whether the argument(s) are integers or not
		isInt(...nums){
			for(var n in nums){
				let num = nums[n];
				if(isNaN(num) || parseInt(num) != num){
					return false;
	            }
			}
			return true;
		},
		getRandomBetween(){},
		distanceBetween(){},
		getPrimes(upto = 1000){},
		breakdown(){},
		primeFactorize(n){},
		getPrimeFactorsOf(n){},
		factorsOf(n){},
		powersOf(n, maxExp){},
		gcd(...nums){},
		gcf(...nums){this.gcd(nums)},
		lcm(...nums){},
		divideTo(dividend, divisor, precision){},
		getRationalNumber(n, repDigits){
			return new RationalNumber(n, repDigits);
		},
		changeBaseOf(n, from, to){},
		getPrimesBetween(a, b){},
		isPrime(...nums){

		}

	};
}());

//Initializes the prime numbers
PreMath.getPrimes();

// RegularOl.factorial(40) => 8.159152832478977e+47
// BigInt.factorial(40) => "815915283247897734345611269596115894272000000000"
const BigInt = (function(){
	function multiplyHelper(a, b){
		a = (a + '').split('').reverse();
		b = (b + '').split('').reverse();
		let product = [];
		for(let i = 0; i < a.length; i++){
			for(let j = 0; j < b.length; j++){
				let temp = a[i] * b[j];
				let unit = temp % 10;
				let tens = Math.floor(temp / 10);
				if(!product[i + j]) product[i + j] = 0;
				product[i + j] += unit;
				if(tens){
					if(!product[i + j + 1]) product[i + j + 1] = 0;
					product[i + j + 1] += tens;
				}

			}
		}
		product = compressor(product);

		let final = product.reverse().join('');
		return final;
	}

	function compressor(arr){
		for(let k = 0; k < arr.length; k++){
			let n = arr[k];
			if(n > 9){
				arr[k] = n % 10;
				if(!arr[k+1]) arr[k+1] = 0;
				arr[k+1] += Math.floor(n / 10);
			}
		}
		return arr;
	}

	function isIntStr(str){
		return /^[0-9]+$/.test(str);
	}

	return {
		// Method can handle up to 10,000 in Chrome in about 5 seconds
		// Anything more will exponentially increase the time to the point of
		// being unbearable. Anything less than 5,000 is handled more or less
		// instantaneously.
		factorial(n, iUnderstandTheRisk){
			if(n == 0) return 1;
			if(!isIntStr(''+n) || n < 0) throw new Error(`${n} is not a valid argument`);
			if(n <= 10000 || (n > 10000 && iUnderstandTheRisk)){
				let nums = [];
				while(n > 1){
					nums.push(n);
					n--;
				}
				return this.multiply(...nums);
			}
		},
		factorial2(n, iUnderstandTheRisk){
			if(n == 0) return 1;
			if(!isIntStr(''+n) || n < 0) throw new Error(`${n} is not a valid argument`);
			if(n <= 10000 || (n > 10000 && iUnderstandTheRisk)){
				let nums = [];
				let twos = 0, fives = 0;
				while(n > 1){
					nums.push(n);
					n--;
				}
				return this.multiply(...nums);
			}
		},
		add(...nums){
			let sum = [];
			nums.forEach(function(num){
				num = (num+'').split('').reverse();
				num.forEach(function(digit, place){
					digit *= 1;
					sum[place] = sum[place] ? sum[place] + digit : digit;
				});
			});
			sum = compressor(sum);

			let final = sum.reverse().join('');
			return final;

		},
		subtract(minuend, ...subtrahends){
			let subtrahendSum = this.sum(...subtrahends);

		},
		multiply(...nums){
			while(nums.length > 1){
				let a = nums.shift();
				let b = nums.shift();
				let prod = multiplyHelper(a, b);
				nums.push(prod);
			}
			return nums[0];
		},
		pow(n, exp){
			let arr = [];
			while(exp--) arr.push(n);
			return this.multiply(...arr);
		},
		getNthRootOf(x, n, precision){
			if(x != parseFloat(x) || isNaN(x)) throw new Error('Pass a number, not ' + x);
			if(x < 0 && n%2 == 1) throw new Error('If x is negative, then can only get even roots');
			precision = (isNaN(precision) || precision < 1) ? 1 : parseInt(precision);
			let decimalTracker = 0;

			// Initialize x as to start the recursion with significands
			while(x != parseInt(x)){
				x *= 10;
				decimalTracker--;
			}
			while(x%10 == 0){
				x /= 10;
				decimalTracker++;
			}

			function recourse(root, target, precision){
				if(precision == 0){
					return root;
				} else {
					/*let greatestFit = root;
					let newDigitToTry = -1;
					while(greatestFit < target){
						newDigitToTry++;
						let temp = root + newDigitToTry;
						greatestFit = Math.pow(temp, n);
						if(greatestFit == target) return greatestFit;
					}
					target *= Math.pow(10, n);
					decimalTracker--;
					return recourse(greatestFit * 10, target, precision - 1);*/
					let greatestFit = 0;
					while(greatestFit < target){
						root++;
						greatestFit = Math.pow(root, n);
						if(greatestFit == target) return root;
					}
					root--;
					decimalTracker--;
					return recourse(root * 10, target * Math.pow(10, n), precision-1);
				}
			}
			let root = recourse(0, x, precision);
			return root * Math.pow(10, decimalTracker);
		},
		/* Returns significand and the exponent.
			getSignificand(1.234) --> ['1234', -3]
		*/
		getSignificand(number){
			//check validity
			number += '';
			number = number.trim();
			// Regex rules:
			/* 	The number may not start with 0, unless
				it is immediately followed by decimal point
				and one or more digits
			*/
			if(/^0+(\.0*)?$/.test(number)) return [0, 0];
			if(!/^((([1-9]+\d*)|0)(\.\d+)?)$/.test(number)) throw new Error('Invalid value '+number+' passed.');
			let significand, exponent;
			if(number.indexOf('.') != -1){
				let split = number.split('.');
				let whole = split[0], decimal = split[1];
				if(/^0*$/.test(decimal)){
					return this.getSignificand(whole);
				}
				significand = (whole + decimal).match(/[1-9]+(0*[1-9]+)*/)[0];
				decimal = decimal.match(/\d*[1-9]+/)[0];
				exponent = -decimal.length;
			} else {
				significand = number.match(/[1-9]+(0*[1-9]+)*/)[0];
				exponent = number.match(/0*$/)[0].length;
			}
			return [significand, exponent];
		},
		moveDecimalPointBy(number, d){
			function getZeros(n){
				let z = '';
				while(n--) z += '0'; 
				return z;
			}
			try{
				let sig = this.getSignificand(number);
				let significand = sig[0];
				let newExp = sig[1] + d;
				if(newExp > 0){
					let z = getZeros(newExp);
					return significand + z;
				} else if(newExp == 0){
					return significand;
				} else {
					let sigLength = significand.length;
					let temp = sigLength + newExp;
					if(temp <= 0){
						let z = getZeros(-temp);
						return '0.' + z + significand;
					} else {
						return significand.substring(0, temp) + '.' + significand.substr(temp);
					}
				}
			} catch (e){
				throw e;
			}
		}
	};
}());


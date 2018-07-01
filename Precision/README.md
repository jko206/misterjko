# Precision Math: Slow But Accurate
---
## Introduction

This project started when I first encountered that in JavaScript, 
```0.1 + 0.2 === 0.3 // false```.

That was just the beginning, however. As I used more and more of JavaScript's math,
I encountered various limitations of native math. For my application, precision mattered
more than speed, so the project was born. Precision is designed to overcome JavaScript's
limitation, such as the following:

```JavaScript
let k = 123456789012345678901234567890;
k == parseInt(k)				// false

0.1 + 0.2 == 0.3				// false

1/3 == 0.3333333333333333		// true

1 1/2 + 1/2						// Uncaught SyntaxError: Unexpected number
```

---
## Use

Throughout the API, various terms and acronyms will be used. Please refer to the 
section Glossary & Acronyms section at the end. Variables may be used more than
once in different examples. Also, this library will be referenced as PrecisionJS
to distinguish is from the word precision.

For brevity, ```Precision``` will be shortened to ```P__``` (P followed by double
underscore). For example, ```let n1 = Precision.gcf(20, 52);``` is the same as 
```let n1 = P__.gcf(20, 52);```.

### Math Operations
PrecisionJS supplies some basic arithmetic methods that users might find useful.
The list is sure to grow in the future, but for now PrecisionJS has the following.
As of version 1, math operation only work on non scinot splums. 

#### Precision.primeFactorize()

|    Use                        | Arguments         |       Returns     |
|-------------------------------|-------------------|-------------------|
| ```P__.primeFactorize(n)```   | ```n```: splum-n  | Array of splum-n  |

Given an integer, the method returns an array of its prime factors.

##### Example
```
P__.primeFactorize(20);             // [2, 2, 5]
P__.primeFactorize(810);            // [2, 3, 3, 3, 3, 5]

```

#### Precision.getPrimeNumbers()

|    Use                               |       Arguments                              |       Returns     |
|--------------------------------------|----------------------------------------------|-------------------|
| ```P__.getPrimeNumbers()```          |    _(none)_                                  | Array of splum-n  |
| ```P__.getPrimeNumbers(to)```        | ```to```: splun-n                            | Array of splum-n  |
| ```P__.getPrimeNumbers(from, to)```  | ```from```: splun-n, ```to```: splun-n       | Array of splum-n  |



##### Example
```
P__.getPrimeNumbers();          // [2, 3, 5, 7, ... , INITIAL_MAX_PRIME]
P__.getPrimeNumbers(20);        // [2, 3, 5, 7, 11, 13, 17, 19]
P__.getPrimeNumbers(10, 20);    // [11, 13, 17, 19]

```

#### Precision.factors()

|    Use                               |       Arguments         |       Returns     |
|--------------------------------------|-------------------------|-------------------|
| ```P__.factors(n)```                 | ```n```: splun-n        | Array of splum-n  |



##### Example
```
P__.factors(24); // [1, 2, 3, 4, 6, 8, 12, 24]

```
#### Precision.gcd()
Alias for ```Precision.gcf()```.
#### Precision.gcf()

|    Use                            |       Arguments         |       Returns     |
|-----------------------------------|-------------------------|-------------------|
| ```P__.gcf(n1, n2, ...)```        | ```n_```: splun-n       |     splum-n       |
*Requires at least two arguments.*


##### Example
```
P__.gcf(4, 8); // 4

let arr = [30, 45, 60, 120];
P__.gcf(...arr); // 15

```

#### Precision.lcm()
|    Use                            |       Arguments         |       Returns     |
|-----------------------------------|-------------------------|-------------------|
| ```P__.lcm(n1, n2, ...)```        | ```n_```: splun-n       |     splum-n       |
*Requires at least two arguments.*


##### Example
```
P__.lcm(4, 8);                  // 8

let arr = [30, 45, 60, 120];
P__.lcm(...arr);                // 360

```
#### Precision.factorial()
|    Use                            |       Arguments         |       Returns     |
|-----------------------------------|-------------------------|-------------------|
| ```P__.factorial(n)```            | ```n```: splun-n        |     strum-n       |
*CAUTION: The running time for this method is O(n!). Before implementing, check to
ensure that typical input runs within acceptable timeframe.*


##### Example
```
Precision.factorial(200);                       // "7886578673647 ... 0000"

// Speed test for big number
let t1 = new Date();
let fact = Precision.factorial(2000);
let t2 = new Date();
console.log((t2 - t1)/1000 + 's');              // 5.05s; depends on hardware speed
fact.length;                                    // 5736
fact;                                           // "331627509245 ... 00000"
```
#### Precision.combination()
|    Use                       |       Arguments                      |       Returns     |
|------------------------------|--------------------------------------|-------------------|
| ```P__.combination(n, r)```  | ```n```: splun-n, ```r```: splun-n   |     strum-n       |
*CAUTION: Although faster than ```P__.factorial()``` The running time for this 
method is still O(n!). Before implementing, check to ensure that typical input 
runs within acceptable timeframe.*


##### Example
```
let combo = Precision.combination(2000, 200);
combo;                                     // "686394596....86099650"
combo.length;                              // 281
```
#### Precision.permutation()
|    Use                       |       Arguments                      |       Returns     |
|------------------------------|--------------------------------------|-------------------|
| ```P__.combination(n, r)```  | ```n```: splun-n, ```r```: splun-n   |     strum-n       |
*CAUTION: Although faster than ```P__.factorial()``` The running time for this 
method is still O(n!). Before implementing, check to ensure that typical input 
runs within acceptable timeframe.*


##### Example
```
let perm = Precision.permutation(2000, 200);
perm;                                     // "5413304986....000000"
perm.length;                              // 656
```
---

### Precision Number
```Precision.Number()``` is an object constructor that takes in an argument and 
parses it into two arnums representing the numerator and denominator of the 
number to hold value as a rational number.

#### Precision.Number()
Constructs new Precision Number objects, whether or not used with ```new``` keyword.

The constructor can take in several forms of number:

* Integer
* Decimal: ```"NR...R"```, where the non-repeating ```NR``` is either integer or decimal number, and ```R``` is integer.
* Fraction: ```"N / D"``` or ```"W N/D"``` where ```W```, ```N```, and ```D``` are integers.
* Scientific Notation: ```"Se[+|-]I"```, where ```S``` is either integer or decimal (as described above), and ```I``` is an integer.

##### Examples
```
// integer
let ex1 = new P__.Number(4);
'' + ex1;   // "4"
ex * 2;     // 8
```

```
// Fraction
let ex2 = new P__.Number('2 / 4');
ex2 + '';   // 0.5
ex2 * 2     // 1

```

```
// Decimal
let ex3 = new P__.Number('3.14');
ex3 + ''; 
```

To preserve the precision of the number, pass the argument as string, not number.

```JavaScript
let n1 = new Precision.Number("1234567890123456789012345678901234567890");
let n2 = new Precision.Number(1234567890123456789012345678901234567890);
n1.isEqualTo(n2); // false;

let s1 = n1.toString({precision: 40});
// "1234567890123456789012345678901234567890"
let s2 = n2.toString({precision: 40});
// "1234567890123456800000000000000000000000"d``ad
```


For instance, calling ```new Precision.Number('2.3...7')``` 
(=2.377777.....), will return an object with numerator 107, 
and denominator 45 (107 &divide; 45 = 2.377777.....).

#### Precision.Number.valueOf()
Returns the decimal value of the number. It is the default value used when doing
native JavaScript math.
``` JavaScript
let n = new Precision.Number('2 1/2');
n + 0.5 === 3   // true
n * 2 === 5     // true
```


#### Precision.Number.toString()


#### Precision.Number.getfrac()
#### Precision.Number.clone()

#### Precision.Number.isEqualTo()
#### Precision.Number.isGT()
#### Precision.Number.isGTE()
#### Precision.Number.isLT()
#### Precision.Number.isLTE()

#### Precision.Number.plus()
#### Precision.Number.minus()

```
let n1 = new Precision.Number('2 1/3')
n1.times(3).equals(7); // true;
```

#### Precision.Number.times()
#### Precision.Number.divBy()
#### Precision.Number.getNumerator()
#### Precision.Number.getDenominator()

#### Precision.Number.negate()
#### Precision.Number.reciprocate()
#### Precision.Number.inverse()

<!--
#### Precision.Number.power()
#### Precision.Number.root()
-->


---
## Roadmap


---
## Glossary & Acronyms

The following table contains a list of terms used in the program to concisely 
capture certain ideas and concepts that are used repeatedly. 

|        Term		| Definition	
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| dec				| Short for decimal.
| splum				| Short for simple number; number n such that ```typeof n === "number" // true```
| strum				| Short for string number; a string that can be parsed or understood as number. It is used when a number is too long, repeating, or to wrap a fraction.
| arnum				| Short for array number; to make arbitrary precision math possible, array had to be used.
| scinot			| Short for scientific notation. 
| level				| The number 25600 = 256 &times; 10<sup>2</sup>. For 25600, the level is 2. For 0.256 = 256 &times; 10<sup>-3</sup>, the level is -3.
| ardig				| Short for arnum digit. It is the value held by each index of arnum, not the individual numerals that make up the number as is the case in conventional sense.
| mixed-base		| For certain numbers, such as distance units, or time, each digit has different maximum before having to carry to next digit, so that's where mixed base is used.
| digit-base		| The limit of each ardig before it is carried to ardig.
| abs-base			| Base that applies to the value of the number. For time (s:m:h), the digit base is [60,60,24], but the absolute base is 10 in that time is represented as 12:34:56, decimal numbers.
| numer				| Short for numerator.
| denom				| Short for denominator.


### Denotes
A denote is a letter indicating what kind of strum, splum, or arnum is accepted by a method. 

Format: ```[strum|splum|arnum][(-letter)]```

| Letter	| Definition        |
|-----------|-------------------|
| d			| Decimal number    |		
| n			| Natural number    |
| w			| Whole number      |
| i 		| Integer           |
| z			| Zero              |
| Z			| Non-zero          |
| p 		| Prime             |

### Miscellaneous Convention

* Unless specified, all the options passed as arguments are in JSON format.
* For variable names, the following convention is used:
```
numsSet =>  [nums, nums, nums, ...]
nums =>     [num, num, num, ...]
num =>      [n, n, n, n, ... n];
n =>        a numeral from the set [0,1,2,3,4,5,6,7,8,9]
```


# Precision Math: Slow But Accurate

_v.0.9 BETA_

## Introduction

This project started when I first encountered that in JavaScript, 
```0.1 + 0.2 === 0.3``` returns ```false```.

That was just the beginning, however. As I used more and more of JavaScript's math,
I encountered various limitations of native math. For my application, precision mattered
more than speed, so the project was born. PrecisionJS is designed to overcome JavaScript's
limitation, such as the following:

```JavaScript
let k = 123456789012345678901234567890;
k === (k / 99999 * 99999)		// false

0.1 + 0.2 === 0.3				// false

// No repeating decimal support
1/3 === 0.3333333333333333		// true (Practically true, mathematically false)

// No fraction support
1 1/2 + 1/2						// Uncaught SyntaxError: Unexpected number

(2 + (1/27)) * 27 === 55        // false
```

---
## Use

Throughout the documentation, various terms and acronyms will be used. Please refer 
to the Glossary & Acronyms section at the end. Variables used in examples are 
limited in scope to that example alone. Also, this library will be referenced as 
PrecisionJS to distinguish it from the word precision.

For brevity, ```Precision``` will be shortened to ```P__``` (P followed by double
underscore). For example, ```Precision.gcf(20, 52);``` is the same as 
```P__.gcf(20, 52);```.

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
| ```P__.getPrimeNumbers(to)```        | ```to```: splum-n                            | Array of splum-n  |
| ```P__.getPrimeNumbers(from, to)```  | ```from```: splum-n, ```to```: splum-n       | Array of splum-n  |

##### Example

```JavaScript
P__.getPrimeNumbers();          // [2, 3, 5, 7, ... , INITIAL_MAX_PRIME]
P__.getPrimeNumbers(20);        // [2, 3, 5, 7, 11, 13, 17, 19]
P__.getPrimeNumbers(10, 20);    // [11, 13, 17, 19]

```

#### Precision.factors()

|    Use                               |       Arguments         |       Returns     |
|--------------------------------------|-------------------------|-------------------|
| ```P__.factors(n)```                 | ```n```: splum-n        | Array of splum-n  |

##### Example

```JavaScript
P__.factors(24); // [1, 2, 3, 4, 6, 8, 12, 24]

```

#### Precision.gcd()
Alias for ```Precision.gcf()```.

#### Precision.gcf()

|    Use                            |       Arguments         |       Returns     |
|-----------------------------------|-------------------------|-------------------|
| ```P__.gcf(n1, n2, ...)```        | ```n_```: splum-n       |     splum-n       |
*Requires at least two arguments.*

##### Example

```JavaScript
P__.gcf(4, 8); // 4

let arr = [30, 45, 60, 120];
P__.gcf(...arr); // 15

```

#### Precision.lcm()
|    Use                            |       Arguments         |       Returns     |
|-----------------------------------|-------------------------|-------------------|
| ```P__.lcm(n1, n2, ...)```        | ```n_```: splum-n       |     splum-n       |
*Requires at least two arguments.*

##### Example

```JavaScript
P__.lcm(4, 8);                  // 8

let arr = [30, 45, 60, 120];
P__.lcm(...arr);                // 360

```

#### Precision.factorial()
|    Use                            |       Arguments         |       Returns     |
|-----------------------------------|-------------------------|-------------------|
| ```P__.factorial(n)```            | ```n```: splum-n        |     strum-n       |

*CAUTION: The running time for this method is O(n!). Before implementing, check to
ensure that typical input runs within acceptable timeframe.*

##### Example

```JavaScript
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
| ```P__.combination(n, r)```  | ```n```: splum-n, ```r```: splum-n   |     strum-n       |

*CAUTION: Although faster than ```P__.factorial()``` The running time for this 
method is still O(n!). Before implementing, check to ensure that typical input 
runs within acceptable timeframe.*

##### Example

```JavaScript
let combo = Precision.combination(2000, 200);
combo;                                     // "686394596....86099650"
combo.length;                              // 281
```

#### Precision.permutation()

|    Use                       |       Arguments                      |       Returns     |
|------------------------------|--------------------------------------|-------------------|
| ```P__.combination(n, r)```  | ```n```: splum-n, ```r```: splum-n   |     strum-n       |

*CAUTION: Although faster than ```P__.factorial()``` The running time for this 
method is still O(n!). Before implementing, check to ensure that typical input 
runs within acceptable timeframe.*

##### Example

```JavaScript
let perm = Precision.permutation(2000, 200);
perm;                                     // "5413304986....000000"
perm.length;                              // 656
```

#### Precision.changeBase()

|    Use                           |       Arguments                                          |       Returns     |
|----------------------------------|----------------------------------------------------------|-------------------|
| ```P__.changeBase(n, b1, b2)```  | ```n```: splum-n, ```b1```: splum-n, ```b1```: splum-n   |     strum-n       |

Changes the base of the given number ```n``` from ```b1``` to ```b2```.

_Parsing numbers with prefix for binary, octal, and hexadecimal, (```0b```, 
```0```, and ```0x```, respectively) will be implemented in the next version._

##### Example

```JavaScript
P__.changeBase('2F', 16, 2);        //"101111"
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
* Scientific Notation: ```"Se[+|-]I"```, where ```S``` (for "significand") is either integer or decimal (as described above), and ```I``` is an integer. Sign is optional for positive power.

##### Examples

```JavaScript
// integer
let pn1 = new P__.Number(4);
'' + pn1;   // "4"
pn1 * 2;     // 8
```

```JavaScript
// Fraction
let pn2 = new P__.Number('2 / 4');
pn2 + '';   // 0.5
pn2 * 2     // 1
```

```JavaScript
// Decimal
let pn3 = new P__.Number('3.14');
pn3 + '';   // "3.14"
pn3 * 1;    // 3.14
```

To preserve the precision of the number, pass the argument as string, not number.

```JavaScript
let n1 = new Precision.Number("1234567890123456789012345678901234567890");
let n2 = new Precision.Number(1234567890123456789012345678901234567890);
n1.isEqualTo(n2); // false;

let s1 = n1.toString({precision: 40});
// "1234567890123456789012345678901234567890"
let s2 = n2.toString({precision: 40});
// "1234567890123456800000000000000000000000"
```

For instance, calling ```new Precision.Number('2.3...7')``` 
(=2.377777.....), will return an object with numerator 107, 
and denominator 45 (107 &divide; 45 = 2.377777.....).

#### Precision.Number.valueOf()
Returns the decimal value of the number. It is the default value used when doing
native JavaScript math.

|    Use                       |       Arguments                      |       Returns     |
|------------------------------|--------------------------------------|-------------------|
| ```pn.valueOf()```           | *(none)*                             |     splum         |

##### Examples
``` JavaScript
let n = new Precision.Number('2 1/2');
n + 0.5 === 3   // true
n * 2 === 5     // true
```

#### Precision.Number.toString()
|    Use                       |       Arguments                      |       Returns     |
|------------------------------|--------------------------------------|-------------------|
| ```pn.toString()```          | *(none)*                             |     strum         |
| ```pn.toString(options)```   | ```options```: JSON format object    |     strum         |

```options``` object may include the following properties and values:

| Property                   | Value Type                           | Description |
|---                         |---                                   | ---
| ```getFrac```              | Boolean: ```true``` or ```false```   | Returns fraction form, instead of decimal, which is the default
| ```getMixedNumber```       | Boolean: ```true``` or ```false```   | If ```true```, returns the fraction in mixed number form, such as "1 2/3" instead of "5/3". Only works ```getFrac``` property is set ```true```, and the numerator is greater than the denominator.
| ```getRepDec```            | Boolean: ```true``` or ```false```   | If ```true```, and the number is a repeating decimal, return it in ```"NR...R"``` format, where ```NR``` is the non-repeating part, and ```R``` is the repeating part.
| ```getScinot```            | Boolean: ```true``` or ```false```   | 
| ```precision```            | splum-n                              | Returns a decimal number with set number of decimal digits. 

##### Examples

```JavaScript
let n1 = new P__.Number('3/7');         // Be sure to pass it as string
n1.toString({getFrac: true});           // "3/7"

n1.toString({
    getFrac: true,
    getMixedNumber: true                // The numerator is less than the denom
});                                     // "3/7"

n1.plus(2).toString({
    getFrac: true,
    getMixedNumber: true
});                                     // "2 3/7"
```

#### Precision.Number.getFrac()

|    Use                       |       Arguments                      |       Returns           |
|------------------------------|--------------------------------------|-------------------------|
| ```pn.getFrac()```           | *(none)*                             |     Plain object        |
| ```pn.getFrac(options)```    | ```options```: JSON format object    |     Plain object        |

```options``` object may include the following property and value:

| Property                   | Value Type                           | Description |
|---                         |---                                   | ---
| ```getMixedNumber```       | Boolean: ```true``` or ```false```   | If ```true```, returns the fraction in mixed number form, such as "1 2/3" instead of "5/3". Only works ```getFrac``` property is set true, and the numerator is greater than the denominator.


Without any options, the method will return an object with three properties:
* ```n``` : Numerator of the rational number.
* ```d``` : Denominator of the rational number.
* ```positivity``` : Positivity (-1, 0, or 1) of the number.

##### Examples

```JavaScript
let n1 = new P__.Number('2 4/7');         // Be sure to pass it as string
n1.getFrac();                             // {n: "18", d: "7", positivity: 1} 
                                          // note that n and d have string values
n1.getFrac({
    getMixedNumber: true
});                                     // {w: "2", n: "4", d: "7", positivity: 1}

n1.minus(2).getFrac({
    getMixedNumber: true
});                                     // {w: "0", n: "4", d: "7", positivity: 1}
```

#### Precision.Number.clone()

|    Use                       |       Arguments                      |       Returns                      |
|------------------------------|--------------------------------------|------------------------------------|
| ```pn.clone()```             | *(none)*                             |     Precision Number object        |

Calling the method will return a Precision Number object with the same ```numer```, 
```denom```, and ```positivity``` as the current object. 

##### Examples

```JavaScript
let n1 = new P__.Number('2 4/7');         // Be sure to pass it as string
let n2 = n1.clone();

n1.isEqualTo(n2);                         // true
n1.plus(1).isEqualTo(n2);                 // false;
```

#### Precision.Number.isEqualTo()

|    Use                       |       Arguments                                |       Returns                      |
|------------------------------|--------------------------------------          |------------------------------------|
| ```pn.isEqualTo(num)```      | ```num``` : splum or strum or Precision Number |Boolean ```true``` or ```false```   |

The method accepts any input that can be used for Precision Math constructor 
(see above). Returns ```true``` if the passed input is equal to current object's 
value, and ```false``` otherwise.

##### Examples

```JavaScript
let n1 = new P__.Number('2 1/3');         // Be sure to pass it as string
n1.isEqualTo(2.3333333333);               // false
n1.isEqualTo('2...3');                    // true
n1.times(100).isEqualTo('233...3');       // true

let n2 = new P__.Number('1 / 3');
n2.divBy(100).isEqualTo('1 / 300');       // true

```

#### Precision.Number.equals()

Alias for ```Precision.Number.isEqualTo()```.

#### Precision.Number.isGT()

|    Use                       |       Arguments                                |       Returns                      |
|------------------------------|--------------------------------------          |------------------------------------|
| ```pn.isGT(num)```           | ```num``` : splum or strum or Precision Number |Boolean ```true``` or ```false```   |

The method accepts any input that can be used for Precision Math constructor 
(see above). Returns ```true``` if the passed input is greater than current 
object's value, and ```false``` otherwise.

##### Examples

```JavaScript
let n1 = new P__.Number('1/3');
n1.isGT(0.3333333333333333333);     // true
n1.isGT('0...3');                   // false
```

#### Precision.Number.isGTE()

|    Use                       |       Arguments                                |       Returns                      |
|------------------------------|--------------------------------------          |------------------------------------|
| ```pn.isGTE(num)```          | ```num``` : splum or strum or Precision Number |Boolean ```true``` or ```false```   |


The method accepts any input that can be used for Precision Math constructor 
(see above). Returns ```true``` if the passed input is greater than or equal to 
current object's value, and ```false``` otherwise.

_(Returns ```this.isEqualTo(num) || this.isGT(num)```)_

##### Examples

```JavaScript
let n1 = new P__.Number('1/3');
n1.isGTE(0.3333333333333333333);     // true
n1.isGTE('0...3');                   // true
```

#### Precision.Number.isLT()
|    Use                       |       Arguments                                |       Returns                      |
|------------------------------|--------------------------------------          |------------------------------------|
| ```pn.isLT(num)```           | ```num``` : splum or strum or Precision Number |Boolean ```true``` or ```false```   |


The method accepts any input that can be used for Precision Math constructor 
(see above). Returns ```true``` if the passed input is less than current object's 
value, and ```false``` otherwise.

_(Returns ```!this.isGTE(num)```)_

##### Examples

```JavaScript
let n1 = new P__.Number('1/3');
n1.isLT(0.3333333333333333333);     // false
n1.isLT('0...3');                   // false
```

#### Precision.Number.isLTE()

|    Use                       |       Arguments                                |       Returns                      |
|------------------------------|--------------------------------------          |------------------------------------|
| ```pn.isLTE(num)```          | ```num``` : splum or strum or Precision Number |Boolean ```true``` or ```false```   |

The method accepts any input that can be used for Precision Math constructor 
(see above). Returns ```true``` if the passed input is greater than or equal to 
current object's value, and ```false``` otherwise.

_(Returns ```!this.isGT(num)```)_

##### Examples

```JavaScript
let n1 = new P__.Number('1/3');
n1.isLTE(0.3333333333333333333);     // false
n1.isLTE('0...3');                   // true
```

#### Precision.Number.plus()

|    Use                       |       Arguments                                |       Returns                      |
|------------------------------|--------------------------------------          |------------------------------------|
| ```pn.plus(num)```           | ```num``` : splum or strum or Precision Number |    Current object (```this```)     |

The method adds the given ```num``` to the current object. 

##### Examples

```JavaScript
let n1 = new P__.Number('0.1');
n1.plus('0.2').isEqualTo('0.3');        // true, amazingly enough

n1.plus('-0.5').isEqualTo('-0.2');      // true
n1.plus('-0.0...2').isEqualTo('-2/9'); // true;
```

#### Precision.Number.minus()
|    Use                       |       Arguments                                |       Returns                      |
|------------------------------|--------------------------------------          |------------------------------------|
| ```pn.minus(num)```          | ```num``` : splum or strum or Precision Number |    Current object (```this```)     |

The method subtracts the given ```num``` from the current object. 

##### Examples

```JavaScript
let n1 = new Precision.Number('2 1/3')
n1.times(3).equals(7); // true;
```

#### Precision.Number.times()

|    Use                       |       Arguments                                |       Returns                      |
|------------------------------|--------------------------------------          |------------------------------------|
| ```pn.times(num)```          | ```num``` : splum or strum or Precision Number |Current object (```this```)         |

The method multiplies the current object by the given ```num```. 

##### Examples

```JavaScript
n1 = new P__.Number('2e+1000');
n2 = new P__.Number('5e-1000');
n1.times(n2).toString();        // "10"
```

#### Precision.Number.divBy()

|    Use                       |       Arguments                                |       Returns                      |
|------------------------------|--------------------------------------          |------------------------------------|
| ```pn.divBy(num)```          | ```num``` : splum or strum or Precision Number |Current object (```this```)         |


The method divides by the current object by the given ```num```. 

##### Examples

```JavaScript
// P(n, r) = n! / (n-r)!, where n = 300, r = 200 (300 choose 200)
let n = P__.factorial(300);         // n!
n = new P__.Number(n);
let n_r = P__.factorial(100);       // (n-r)!
n_r = new P__.Number(n_r);

let p = P__.permutation(300, 200);  // P(n, r)
p = new P__.Number(p);
p.isEqualTo(n.divBy(n_r));          // true;
```

#### Precision.Number.getNumerator()

|    Use                       |       Arguments                      |       Returns                      |
|------------------------------|--------------------------------------|------------------------------------|
| ```pn.getNumerator()```      |  *(none)*                            | Strum of the numerator             |


All Precision Numbers are rational numbers, and as such, have numerators. This method returns the numerator 
as strum.

##### Examples

```JavaScript
let n1 = new P__.Number('3 4/5');   // (3 4/5) = 3 + 4/5 = 15/5 + 4/5 = 19/5
n1.getNumerator()                   // "19"
```

#### Precision.Number.getDenominator()
|    Use                       |       Arguments                      |       Returns                      |
|------------------------------|--------------------------------------|------------------------------------|
| ```pn.getDenominator()```    |  *(none)*                            | Strum of the denominator           |


All Precision Numbers are rational numbers, and as such, have denominator. This method returns the denominator 
as strum.

##### Examples

```JavaScript
let n1 = new P__.Number('3 4/5');
n1.getDenominator()                   // "5"
```

#### Precision.Number.negate()
|    Use                       |       Arguments                      |       Returns                      |
|------------------------------|--------------------------------------|------------------------------------|
| ```pn.negate()```            |  *(none)*                            | Current object (```this```)        |

The method negates the current object; positive number becomes negative, and negative number becomes positive.
If the number is zero, it is not affected.

##### Examples

```JavaScript
let n = new P__.Number('2 / 3');
n.negate();
n.isEqualTo('-2/3');          //  true;
```

#### Precision.Number.reciprocate()
|    Use                       |       Arguments                      |       Returns                      |
|------------------------------|--------------------------------------|------------------------------------|
| ```pn.reciprocate()```       |  *(none)*                            | Current object (```this```)        |

Reciprocates the objects numerator and denominator. In other words, numerator and denominator are "switched."

##### Examples

```JavaScript
let n = new P__.Number('0...3');
n.reciprocate().isEqualTo(3);       // true
```

#### Precision.Number.inverse()

|    Use                       |       Arguments                      |       Returns                      |
|------------------------------|--------------------------------------|------------------------------------|
| ```pn.inverse()```           |  *(none)*                            | Current object (```this```)        |

Alias for ```Precision.Number.reciprocate()```.

##### Examples

```JavaScript
let n = new P__.Number('1/2');
n.inverse().reciprocate().isEqualTo('0.5');
```
<!--
#### Precision.Number.power()
#### Precision.Number.root()
-->


---

## Roadmap

* Improve performance by reducing the loop counts used in various operations. 
* Be able to handle powers and roots
* Be able to parse and evaluate expressions (e.g. 2^1.25 / 2^0.25 => 2).
* Implement series
* Calculate sine, cosine, and tangent values to certain precision.
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
| abs-base			| Base that applies to the value of the number. For time (s: m :h), the digit base is [60,60,24], but the absolute base is 10 in that time is represented as 12:34:56, decimal numbers.
| numer				| Short for numerator.
| denom				| Short for denominator.
| positivity        | Indicates whether the number is negative (value of -1), zero (value of 0), or positive (value of 1). 

### Denotes
A denote is a letter indicating what kind of strum, splum, or arnum is accepted by a method. 

Format: ```[strum|splum|arnum][-letter]```

| Letter	| Definition        |
|-----------|-------------------|
| d			| Decimal number    |		
| n			| Natural number    |
| w			| Whole number      |
| i 		| Integer           |
| z			| Zero              |
| Z			| Non-zero          |
| p 		| Prime             |

## Miscellaneous Convention

* Unless specified, all the options passed as arguments are in JSON format.
* For variable names, the following convention is used:

```
numsSet =>  [nums, nums, nums, ...]
nums =>     [num, num, num, ...]
num =>      [n, n, n, n, ... n];
n =>        a numeral from the set [0,1,2,3,4,5,6,7,8,9]
```
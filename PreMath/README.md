Precision Math

Introduction

This project first started when I learned that in JavaScript couldn't correctly 
solve 0.1 + 0.2. It'd produce 0.30000000001, owing to computer's limitation as 
a binary calculator, not decimal. 

Since discovering the problem, other difficulties, such as inability represented
repeating decimals, and not having handy math library made me want to build a 
JavaScript math library that enhances the accuracy of calculation by sacrificing
speed.

Most of the functions are used once to produce somme sort of math problem, so 
speed isn't an issue. 

Reason for this library:
-let k = 123456789012345678901234567890;
 k == parseInt(k) --> false
-0.1 + 0.2 == 0.3 --> false
-1/3 == 0.3333333333333333 --> true
-lack of support for fractions
-lack of native support for big numbers or small numbers
-The native implementation is for speed, but for most of what I did, 
I needed precision more than speed. In fact, speed wasn't even an issue.


GLOSSARY AND ACRONYMS
dec 		: Decimal number, or decimal point, depending on the context
splum		: Short for simple number; numbers that need not be represented
				in string format. Opposite of strum
strum		: Short for string number; numbers that must be represented
				as string in order to retain its precision.
				e.g. 3.1234567890123456789012345678901234567890
arnum		: Short for array number;
Denotes		: a dash (-) followed by a letter indicating what type
				of number strum or splum is:
				-d: decimal				-n: natural
				-w: whole				-i: integer
				-Z:	non-zero integer	-p: prime
				
Decimal debt: When a decimal number gets converted to an int via 
				moving the decimal places (i.e. multiply by a power of 10), 
				the number of places it must move back in order for the int
				to become the original decimal number.
				e.g. 3.14 -> 314, then decimal debt is -2, because
				314 * 10^-2 == 3.14
				
Scinot		: Scientific notation (e.g. 1e-14)
numer		: Numerator
Denom		: Denominator

Loosen		: To lower the digit base
Tighten		: To raise the digit base
Digits		: Each index of Arnum
Arnum		: 
Digit Base	: The max a digit can be
Compress	: 
Compression Point
Absolute Compression Point
Compound Base : Arnum in which each digit has different bases (like time, standard unit, and harry potter money)



TODO: 
-Be able to find BIG prime values more efficiently 
-Implement different bases
-Implement composite bases
	-time: 24h60m60s etc)
	-Traditional measurements, like 1yd = 3ft = 36in etc.
	
getting combination using pascal's triangle.
c(9, 2) = 9! / (2! * (9-2)!)
        = 9! / (2! * 7!)
== c(9 , 7)

Using pascal's triangle, one can simply go to the row 9 (0-based index), and go to item 2 (0-based index)
to obtain the combination.
to get the factorial using pascal's triangle, one can recursively multiply combinations
For example,
9! = c(9, 4) * c(5, 3) * c(4, 2) * c(3, 2) * c(2, 1) * c(2, 1) * c(2, 1) * c(2, 1)
   =    9!        5 !       4!        3!        2!         2!       2!         2!
       4!5!      3!2!      2!2!      2!1!      
       
a = c + e
b = c

362880
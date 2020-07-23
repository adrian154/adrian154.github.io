# Bases explained

You may be asked to learn about different number systems for a variety of reasons:
* You're learning programming, and for some reason one of the first lessons is on this subject despite it having no relevance at that stage
* You're in a weird math course

Regardless, bases are not too difficult to grasp.

## Blast to the past: learning to count

How do you count? It's pretty simple.

```
0
1
2
3
4
5
6
7
8
9
```

Uh oh. There's no more digits after 9! Whatever will we do?

This may all seem silly to you. We just reset the first digit to zero, and tack on a "1" in front. `10`!

However, what if we forgot about `8` and `9`? What if you only knew the digits from 0 to 7?

Let's try counting like that.

```
0
1
2
3
4
5
6
7
10
11
12
13
14
15
16
17
20
21
...
75
76
77
100
```

This system is called **octal**, and it only has 8 digits (0..7).

We need to go deeper. What if you only knew **2** digits, `0` and `1`? This is called **binary**. Let's try counting.

```
0
1
```

Already, we've run into trouble. What's after `1`? Do you jump straight forward to `10`?

**YES!**

Here's how to count in binary:

```
0
1
10
11
100
101
110
111
1000
1001
1010
1011
1100
1101
1110
1111
```

Notice the common pattern: the number system is defined by how many digits it has. We call this the *base*. Most of us count in base 10 nowadays. Computers count in base 2 since they store all data as pulses of electricity, and base 2 works perfectly for that.

## A More Civilized Way.

Let's consider a normal number. How about 1,738? How do you go from the digits ("1738") to its numerical value?

It's actually pretty simple:

```
1000 +
 700 +
  30 +
   8
====
1738
```

You may notice a pattern. The further left you go, the greater the digit's significance. This can be generalized:

```
1 x 10^3 +
7 x 10^2 +
3 x 10^1 +
8 x 10^0
========
1738
```

There's that number again! `10`! To convert a number to it's numerical value, you can reuse this calculation. Just swap out 10 for whatever base it's in.

## Let's Try!

Consider the octal number 562. What is its value in base 10?

```
5 x 8^2 +
6 x 8^1 +
2 x 8^0

=

5 x 64 + 
6 x 8 +
2 x 1

=

320 + 48 + 2 

=

370
```

It's easy to practice these problems for yourself. Pick a base, make a random number, and convert it to base 10.

## Note on Hexadecimal
Hexadecimal is base 16. By now, you should be familiar with how to convert it. However, what do we do when there's more digits in the new system than our original base-10 system?

The answer is quite silly. **Use letters!**

Here's how you'd count in hexadecimal (and its base-10 counterpart)

```
0 (0)
1 (1)
2 (2)
3 (3)
4 (4)
5 (5)
6 (6)
7 (7)
8 (8)
9 (9)
A (10)
B (11)
C (12)
D (13)
E (14)
F (15)
10 (16)
11 (17)
...
```

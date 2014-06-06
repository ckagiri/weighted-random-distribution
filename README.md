weighted-random-distribution
============================
Basic node REPL as answer to a fun puzzle problem

## To play
Install node, get this repo, and run `$ node index`

## The problem description
Write a program in the language of your choice to accept a list of animal names and an associated integer representing the odds of selection.  The program should prompt the user first for the number of animals and then for the animal and their odds. The program uses the inputs and randomly selects 100 animals according to the odds of selection for each animal and outputs the resulting distribution.
 
Here is a sample input:

```
$ 4            //number of Animals
$ cat, 1       //Animal, Weight/odds
$ dog, 1       //Animal, Weight/odds
$ turtle, 1    //Animal, Weight/odds
$ lorax, 7     //Animal, Weight/odds
```

Output: (since it will run 100 times) should return in this format (numbers obviously wont be exact since it is still random):

```
cat 9
dog 11
turtle 7
lorax 73
```

## Getting to the answer
I started with a simple, direct solution. Ooh, let's just generate an array listing each animal the number of times to match its weight, e.g. `['cat', 'cat', 'cat', 'dog', 'dog', ...]`! Then we'd loop 100 times, calculating a random index within that array's bounds and tally up as we go. That works and would be fast once the array was generated, but it seemed inefficient in terms of memory use. What if we wanted hundreds or thousands or more types of animal? That would be a big array, and needlessly so.

## Yay, math!
Next I went down an algorithm search spiral for a bit, and found Vose's method. Were I to implement this for actual use and not just as a thought exercise, I would probably just assess a few modules that already have the algorithm and include the implementation I liked in my app manifest. [vose-alias-method](https://github.com/jdiscar/vose-alias-method.js) provides a nice clear implementation and wisely links to this great explanation, [Darts, Dice, and Coins: Sampling from a Discrete Distribution](http://www.keithschwarz.com/darts-dice-coins/).

To avoid external dependencies for this little exercise, I've lifted the implementation mentioned above pretty much whole-cloth, with slightly fewer validation checks and no tests. For those reasons, **I would avoid using this repo in production.** :) On top of the algorithm, I've added a simple node-based REPL for gently cajoling users into typing answers.

Enjoy, and please feel free to comment with questions or corrections!

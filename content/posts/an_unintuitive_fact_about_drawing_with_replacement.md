---
title: "An unintuitive fact about random drawings with and without replacement"
date: 2025-06-13
---

Here's an odd fact that I came across while doing a probability puzzle.
I'll start by presenting a version of this puzzle; I hope you have the patience to try it yourself, at least for a minute or two.
I'll present it in two parts.
The first part is relatively easy.

> Suppose you are going to draw 10 cards from a standard 52-card shuffled deck of playing cards.
You are drawing with replacement, meaning that after each card is drawn, you note what it is and replace it back into the deck and shuffle again before the next draw.
What is the expected number of aces that you draw during this process?

To solve this, all we have to do is calculate the expected number of aces in a single round of this game, and then multiply that number by 10.
This is because each round is identical to the previous round.
Since $4/52$ cards in the deck are aces, the probability of drawing an ace in a single draw is $4/52 = 1/13$.
Thus on average, in each round of this game we expect to draw one thirteenth of an ace.
Or, if we play this game for 10 rounds, on average we will end up drawing $10/13 \approx .77$ aces.

To be slightly more technical, we are using the fact that expectation is linear.
If $X$ is a random variable that measures how many aces we draw, and $X_i$ is a random variable that measures how many aces we draw in round $i$, then $X = X_1 + \cdots + X_{10}$.
Then using linearity of expectation,
$$E[X] = E[X_1 + \cdots + X_{10}] = E[X_1] + \cdots + E[X_{10}].$$

So we see that it is sufficient to calculate the expectation for each round, as we have done.

So far so good.
Now we proceed to a harder version of the problem.

> In this version of the game, we don't replace the cards after each round.
If you draw 10 cards without replacement, what is the expected number of aces that you will draw?

We can't use the same idea as before; after all, not every round of this game needs to be the same.
If our first draw happens to be an ace, then the probability of drawing an ace in the future rounds goes down.
Alternatively, each time we draw a card that is not an ace, the probability of drawing an ace in the next round goes up slightly.
A further confusion is that the expectation in the previous version has to account for the fact that in some scenarios we could draw more than 4 aces.
In this version where we draw without replacement, it's clear that we can't draw any more than 4.

But now we get to our unintuitive fact - despite all these considerations, the expected number of aces when we're drawing without replacement is exactly the same as the expected number when drawing with replacement.

One way to justify this is as follows.
We'll use exactly the same fact that expectation is linear, but we need to choose our random variables slightly more cleverly.

Let $X_s$ denote the number of times that we draw the ace of spaces.
Similarly, let $X_c, X_h, X_d$ denote respectively the number of times that we draw the ace of clubs, hearts, and diamonds.[^objection]

Now if $X$ is the total number of aces that we have among the 10-card hand that we draw, then $X = X_s + X_c + X_h + X_d$, and so we again have that
$$E[X] = E[X_s] + E[X_c] + E[X_h] + E[X_d].$$

Since no ace is more likely to be drawn than any other, if we find the expected number of times that the ace of spades is among the 10 cards we draw, then we are essentially done.
In this case, $X_s = 1$ with probability $P_s$, and $X_s = 0$ with the remaining probability $1 - P_s$, where $P_s$ is the probability that the ace of spades is among the 10 cards that we draw.
This means that $X_s = P_s.$
This probability is easy to calculate; it's just $10/52$.
The chances of a particular card being in some randomly selected portion of the deck is just equal to the exact proportion that we select.
Now, we see that indeed we get the same answer,

$$E[X] = 4 \cdot E[X_s] = 4 \cdot \frac{10}{52} = \frac{10}{13}. \phantom{\frac{\hat{1}}{0}}$$

Now the exercise for the reader is to use this idea to trick someone at the bar and make some money.

[^objection]: One may object that these numbers depend on each other when we're drawing without replacement; this is related to the complications we mentioned that seem to arise when going from drawing with replacement to drawing without replacement.
Fortunately, the linearity of expectation does not require the random variables to be independent.

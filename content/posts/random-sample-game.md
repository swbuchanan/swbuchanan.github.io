+++
title = 'A surprising probabilistic game'
date = 2026-03-15
+++


I recently read about a game with an optimal strategy that I found surprising.
I'll present the game and then the mathematical analysis.

The rules of the game are as follows.
You draw a number uniformly randomly between $0$ and $1$.
After seeing it, you may either keep it or discard it and redraw once.
If you redraw, you must keep the second number.
Your opponent will do the same thing.
You will not have any information about the numbers your opponent has drawn until the end of the round, when your number is locked in.
You will also not know whether your opponent elected to draw again.
Likewise, your opponent will have no information about your number and your choices.

What is the optimal strategy?
Given that we have no information about the opponent, a natural guess is that we should simply maximize the expected value of our final number.

Feel free to try a few (hundred thousand) rounds of this game below, and then I will go into the mathematical analysis.
The computer knows the optimal strategy for this game.
If you tell the computer not to play optimally, it will simply redraw if the first number was below $\frac 1 2$ and keep the first number if it is above $\frac 1 2$.

With the slider or the text entry box, you can select a number $r$.
Then when the game is played, you will automatically redraw if your first number is below $r$.
Otherwise you will keep the first number that you draw.

{{<random_game_1>}}


Did you notice anything surprising?
The optimal strategy for this game is not simply to redraw whenever the first number is below $\frac 1 2.$
To me, this is quite unintuitive, especially considering that choosing a cutoff of $\frac 1 2$ would be the optimal strategy for a game that is only slightly different.
Suppose that instead of simply winning or losing each round, you received a score that is equal to your number minus your opponent's number.
This way you would gain or lose points proportionally to how much larger your number is.
Then you win if you have the highest score after a large number of these rounds.

It is not too hard to prove that in this case the optimal strategy really is just to redraw numbers below $\frac 1 2$; as an exercise for the reader I will claim that one can compute that the expected value of redrawing below a cutoff $r$ comes out to be
$$ \frac{1 + r - r^2}{2}. $$
Some quick calculus shows that this is maximized by taking $r = \frac 1 2$.

But the object of our game is not to get the highest number possible on average, but just to maximize our chance of getting any number higher than our opponent.
Even when this is pointed out, it may take some reflection to see that these are not quite the same thing.

Let's compute the optimal threshold and thereby solve this game.

To do this, we need to apply an important concept from game theory, called *indifference*.
This concept applies to complex games like poker, or simple ones like the one above.
Let's consider it in the case of rock-paper-scissors.
Say I have chosen some strategy for rock-paper-scissors.
If you know something about my strategy, you may know that it will be better for you if you throw rock on the next turn, rather than paper or scissors.
Or you may know that it would be better if you threw paper.
That is, you may have some information about how I choose between rock, paper, and scissors that allows you to choose a strategy to exploit me.
On the other hand, if I have chosen the best possible strategy, you cannot get any advantage by choosing some particular strategy in response.
My optimal strategy has made you *indifferent*.
More specifically, the optimal strategy for rock-paper-scissors is to randomly choose one of the three each round with equal probability and no correlation with the previous round.
If I adopt this strategy then it doesn't matter how you choose.
There's a bit more to this concept.
For example, in rock-paper-scissors it literally does not matter what you do in response to an optimal strategy.
You could choose rock every time, or you could throw rock, then paper, then scissors, then repeat.
All strategies have a long-term win rate of $\frac 1 3$ against an optimal strategy.
In general this is not the case.
It is common for optimal strategies to make one's opponent indifferent to certain actions, but usually there are certain actions that are strictly worse than the ones to which we are indifferent.
For now, let's return to our original game.


Note that by symmetry, the optimal threshold values for both players are the same.
Suppose both players use some threshold $r$.
We can apply the idea of indifference in the following way.
If we see any number below $r$, it is always better to redraw.
If we see any number above $r$, it is always better to keep it.
This means that at an optimal threshold $r$, we must be indifferent between keeping and redrawing when our first draw is exactly $r$.
Let us compare those two options.

Our opponent ends with a number below $r$ exactly when they first draw below $r$ and then redraw below $r$ again, which happens with probability $r^2$.
Since ties occur with probability $0$, this is exactly our probability of winning.
So the probability of winning by keeping $r$ is $r^2$.

Now suppose instead that we redraw.
Our second draw is then a fresh uniform random number $X$ in $(0,1)$.
We want to compute the probability that $X$ beats the opponent's number.
Let $Y$ denote the opponent's final number when they use threshold $r$.
We start by computing the distribution of $Y$.

If $0 < y < r$, then the only way the opponent can end with a number below $y$ is if they first draw a number below $r$ and then redraw a number below $y$.
This happens with probability
$$P(Y < y) = ry.$$
If $r < y < 1$, then there are two ways the opponent can end below $y$: either they draw below $r$ and then redraw and end below $y$, all with probability $ry$, or their first draw is between $r$ and $y$, which happens with probability $y-r$.
So
$$P(Y < y) = ry + (y - r).$$
Now fix a value $x$ of our redraw.
The probability that this redraw wins is just $P(Y < x)$.
Since $X$ is uniform on $(0,1)$, we average this over all $x$:
$$P(X > Y) = \int_0^1 P(Y < x) \, dx.$$
By the observations above,
$$P(X > Y) = \int_0^r rx \, dx + \int_r^1 (rx + x - r) \, dx.$$
Computing this yields
$$P(X > Y) = \frac{1 - r + r^2}{2}.$$
This is exactly the probability of winning by redrawing.

Based on the fact that keeping $r$ has the same probability of winning as redrawing, we can say
$$ r^2 = \frac{1 - r + r^2}{2}. $$
The positive solution to this equation is
$$ r = \frac{-1 + \sqrt{5}}{2} \approx 0.618.$$
Try this again in the simulation above and see that nice $50\\%$ win rate.
The final exercises for the reader are
- compute the exact win percentage of a player using the optimal strategy against someone who just chooses a threshold of $\frac 1 2$,
- determine any significance in the fact that the optimal value of $r$ is the reciprocal of the golden ratio.

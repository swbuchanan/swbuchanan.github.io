+++
title = 'A stupid application of the Kelly Criterion'
date = 2025-03-21T23:20:32+11:00
draft = true
+++


The Kelly Criterion is a classic solution to a classic problem.
Suppose I give you 100 dollars and an unfair coin.
The coin lands on heads 60% of the time, but I'll bet you even money that it lands on tails.
If I tell you that I'll offer you this bet 1000 times, and you can bet as much of your bankroll as you want, what is your best way of making money?
(Your bankroll is the 100 dollars that you started with together with any money that you win by betting against me.)
On each bet, you can maximize your expected profit by betting all of your bankroll.
However, this leaves open the possibility of losing all your money.


I recently started playing backgammon online.
This game has a lot to recommend it; it is a highly strategic game of perfect information (according to some definitions) with some random chance involved.
I'm not sure 


In order to calculate my chances of winning, I would need to know about about some variables that are essentially unknowable.
Backgammon Galaxy has a rating system; I assume that it tries to pair each player with another player of the same level.
If it could successfully do this every time, each player would have a 50% chance of winning every game.
Actually this is not quite true; a player that is in the process of improving would always be slightly underrated and thus have a slighly greater than 50% chance of winning.
There is another complication: based on my experience over a few dozen games or so, it seems like if you rating is too low, you are likely to be ranked against a higher rated player.


In order for the Kelly Criterion to apply, my chance of winning can't be too low.
Note that for the classic Kelly problem, if one is making even bets with a chance of winning that is less than 50%, the Kelly Criterion tells you that the best way to make money is to bet nothing, so I would be better off not playing!
There is a confounding factor for me: the website gives you some rewards just for playing games, as well as some rewards for checking in to the site.
I'll try to factor these in to get as realistic a model as possible.

It's also not the case that we make even bets on the website; players are able to buy coins with real money, and to encourage them to do so, some coins are raked from every match.
In particular, the winning player is returned the coins that he staked for the game plus 85% of the losing players stake.
That is, 15% of one bet is removed from the coin pool every game (TODO: I know this is true for 100-coin stake games, but what about higher?).

So I need to consider the following things:
- My winning chances given current distribution of ratings and my place in it,
- The rewards I get for playing a certain number of games, as well as the amount I'm winning/losing by playing these games,
- The rewards I get for checking into the site without necessarily playing any games,
- The coins that are raked from the site.

The first challenge is to determine the distribution of ratings.
Unlike lichess, backgammongalaxy does not publish much data about 

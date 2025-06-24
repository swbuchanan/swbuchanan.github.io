+++
title = 'How to tell if a 15-type puzzle is solvable'
date = 2025-06-22
draft = true
+++

I want to have a highly responsive adjustable 15-type puzzle game with timing and leaderboards.
In order to do this, I need to be able to generate random starting positions for the board.
However, an interesting fact about the 15 puzzle is that not all possible arrangements of the $15$ tiles on the $16 \times 16$ grid are solvable.
For example, if one takes the starting arrangement and swaps the 14 and 15 only, the resulting arrangement cannot be solved with normal moves (i.e. without doing some swap of two other tiles).
This would also be true for the starting arrangement with any two adjacent tiles swapped with each other.

So, my problem is to generate random starting positions, but check in some way that I don't present the player with an unsolvable configuration.
One possible solution to this problem is to not just generate a random configuration, but to generate a random sequence of moves from the starting position.
This is what one would do with a physical puzzle to "randomize" it, assuming that the pieces are not allowed to be removed from the board; just make moves without paying close attention and without any pattern.
This is actually a fine solution, it just doesn't appeal to my mathematical sensibilities.
What I would like is a straightforward way to take a random position and check if it is solvable or not.

Fortunately for me this problem has already been solved.
Here I'll explain the method I'll use.


{{< fifteen >}}

what


{{< fifteen size="4" default-setup="true" >}}

---
title: "Detecting 4-cycles in a graph is easier than detecting triangles"
date: 2025-12-01
---

## An algorithm to detect triangles in a graph

Recently I was looking through [Thirty-three Miniatures: Mathematical and Algorithmic Applications of Linear Algebra](https://kam.mff.cuni.cz/~matousek/stml-53-matousek-1.pdf).
One of the applications is an algorithm to efficiently detect a triangle in a graph, such as the following.
(There is an obvious algorithm that works by enumerating all possible triplets of vertices and checking them one at a time; this involves some multiple of $n^3$ steps, where $n$ is the number of vertices.
That is, the algorithm has $O(n^3)$ time complexity, which is really bad.)

![a graph with a triangle highlighted](/graph_example.png)

The algorithm works in the following way.
Construct the adjacency matrix of the graph.
This is done by labeling the vertices with numbers $1, 2, \dots, v$, where $v$ is the number of vertices.
Then, the entry in row $i$, column $j$ of the matrix is $1$ if there is an edge between vertex $i$ and vertex $j$, and 0 otherwise.
This gives us a matrix that encodes exactly the same information as the "dots and lines" representation of a graph.
For example, this graph:

![a graph with labeled vertices](/graph_example_2.png)

has adjacency matrix
$
\begin{bmatrix}
0 & 0 & 1 & 0 \\\\
0 & 0 & 1 & 1 \\\\
1 & 1 & 0 & 1 \\\\
0 & 1 & 1 & 0
\end{bmatrix}.
$

For the graph where we want to find triangles, call its adjacency matrix $A$.
Now the key is to consider the square of this matrix, $A^2$.
By definition of matrix multiplication, the entry in row $i$, column $j$ of this matrix will be (here $a_{m, n}$ denotes the entry in row $m$, column $n$ of matrix $A$)
$$
b_{i,j} = a_{i,1} a_{1,j} + a_{i, 2} a_{2,j} + \cdots + a_{i, v} a_{v, j}.
$$
Note that

$$
a_{i,k}a_{k,j} =
\begin{cases}
1 & \text{if the vertex $k$ is adjacent to both $i$ and $j$}, \\\\
0 & \text{otherwise,}
\end{cases}
$$
from which it follows that $b_{i,j}$ is the number of neighbors that are common to vertex $i$ and vertex $j$.
We're almost done.
To find a triangle, we just have to find a pair of vertices that are connected to each other and have a common neighbor.
With the matrices that we've constructed, this amounts to finding some values for $i$ and $j$ for which both
- $a_{i,j} \neq 0$ (meaning that $i$ and $j$ are connected to each other) and
- $b_{i,j} \neq 0$ (meaning that $i$ and $j$ have a common neighbor.
Thus we merely have to inspect the  matrices $A$, $A^2$ to find the triangle.
To summarize, our algorithm goes like this:
1) Construct the adjacency matrix for the graph.
2) Square the adjacency matrix.
3) Compare the adjacency matrix with its square to see if there are nonzero entries in matching cells.

The complexity bottleneck in this algorithm is in the second step.
Currently it is conjectured but not proven that matrix multiplication can be done by an algorithm with $O(n^2)$ steps.
The algorithm that is used most often in practice (Strassen's algorithm) has complexity around $O(n^{2.807})$.
The best theoretical bound is $O(n^{2.371339})$, but this and other "improvements" on Strassen's algorithm are not used in practice since the constants hidden by the big-O notation are impractically large for the size of matrices that current computers can deal with.
In any case, we can safely say that our algorithm to detect triangles is significantly worse than $O(n^2)$.

## An algorithm to detect 4-cycles in a graph

This is a case where a more complicated problem actually has a simpler solution.
A triangle in a graph is also called a 3-cycle, since it is 3 vertices that form a closed loop.
Similarly, we can ask about the existence of 4 vertices in a closed loop.

There is a very straightforward algorithm to check for 4-cycles:
- enumerate through all pairs of vertices $u$ and $v$ (this is $O(n^2)$)
- compute the vertices that $u$ and $v$ have in common (this is $O(n^2)$ or better)
- if the set of common vertices ever contains more than one element, we have found the 4-cycle.

So we see that this seemingly more complex problem is strictly easier, requiring only $O(n^2)$ steps.

## References

1) [Abboud, Khoury, Leibowitz, Safier - Listing 4-cycles](https://drops.dagstuhl.de/storage/00lipics/lipics-vol284-fsttcs2023/LIPIcs.FSTTCS.2023.25/LIPIcs.FSTTCS.2023.25.pdf?)

2) [Thirty-three Miniatures: Mathematical and Algorithmic Applications of Linear Algebra](https://kam.mff.cuni.cz/~matousek/stml-53-matousek-1.pdf).

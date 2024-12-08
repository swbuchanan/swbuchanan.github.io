---
title: "My research, part 3"
date: 2024-01-15
---

This is the third part in a series of short articles I'm trying to write about my research.
[See the first one here.]({{< ref "2023-01-03-my-research-part-1" >}})

In this article, I will introduce some preliminary notions that will be necessary in describing the work that I do (and in fact they are fundamental to all research in geometry).
The two notions are these: manifolds and metric tensors.
A manifold is a mathematical structure that generalizes and makes precise the idea of *space*.
Space is a familiar idea.
The (physical, i.e. ignoring the time dimension) space we live in is (described by) a 3-dimensional manifold.
One way to see that it is 3-dimensional is to observe that if we are at some point in space, we can fix 3 different directions, perhaps forward, left, and up, and then any direction in which it is possible for us to move is some combination of these 3 directions.[^basis]
(Here we are counting moving backwards along one of these chosen directions as using that direction.)
If we had only chosen 2 directions, say forward and to the right, then we could not describe any upward or downward motion in terms of these directions.
So our physical space must have more than 2 dimensions.
If we had chosen 4 directions, say forward, right, down, and a little bit up and to the left, then we have some redundancy.
We only need any 3 of these directions to describe any sort of motion we want in space.
(It's true that if we choose to use the 3 directions: forward, right, and a little bit up and to the left, then describing motion in, say, purely the leftward direction becomes unnecessarily complicated, but the important thing is that it can in principle be done.)
So 4 directions is too many.

Another example of a manifold is a sphere, which is the infinitely thin outer surface of a ball.
Here we aren't talking about either the outside or the inside of the sphere, just the surface itself.
When one imagines a sphere, one probably imagines it sitting inside of 3-dimensional space.
That's fine for visualization purposes, and indeed the mathematical analysis often takes the perspective of looking at the sphere as an object sitting inside a larger space.
However, it's an important point that the sphere itself is a 2-dimensional manifold, with geometric properties (like its dimension) that don't depend on the space around it.

It may be counterintuitive to say that the sphere is 2-dimensional: after all one can look at a sphere and see it occupying space outside of any flat plane.
But for the study of abstract manifolds, it's important to be able to forget about the surrounding space.
To see that the sphere really is a 2-dimensional object, we can use the same reasoning as before, when we found that our own physical space is 3-dimensional: if we are on the surface of the sphere and we pick out two distinguished directions relative to our position, then we can specify any point on the surface nearby using only these two directions.
For example, I could tell you that the point I'm thinking of is 3 units to my right and -3 units in front of me, if my distinguished directions happen to be "to the right" and "forward."
Another way to phrase this same concept is by pointing out that we can specify any point on the surface of the earth with two coordinates: latitude and longitude.

The mathematically precise way to state this idea of being able to describe the manifold in terms of a certain number of coordinates is fairly technical, but it goes something like this.
In each dimension, there is a certain "default manifold" that is basically as nice as it's possible for a manifold to be.
This is called Euclidean space.
The 1-dimensional Euclidean space is a straight line extending forever in both directions (perhaps more accurately we could say it extends forever in one direction, including "negatives" of that direction).
Then a coordinate for this space is just a number, say $x$.
This space is often just referred to as *the line*.

The 2-dimensional Euclidean space is *the plane*, extending forever in all directions.
Any point in this space has a pair of 1-dimensional coordinates $(x,y)$, where each coordinate in the pair comes from 1-dimensional Euclidean space.

The 3-dimensional Euclidean space can be imagined as the physical space that we live in extending forever in all directions.
It's the space with 3 coordinates $(x,y,z)$ with each coordinate in the triplet coming from 1-dimensional Euclidean space.

Higher dimensional Euclidean spaces are obtained following the same pattern: simply add more coordinates.

Not all manifolds are as nice as Euclidean space.
For example, the surface of a sphere is a 2-dimensional manifold.
The surface of a doughnut is as well.
Both of these have fundamentally different topological structures from Euclidean space.
However, once we have the Euclidean spaces in our hands, we can declare that a manifold with possibly some other shape, like a sphere, is some mathematical object with the property that when we look very closely around a point, it looks like one of these Euclidean spaces of some dimension.
For example, the (idealized, without terrain features) surface of the earth looks like a piece of 2-dimensional Euclidean space.
Or a circle, when one zooms in closely on some point, looks just like a piece of 1-dimensional Euclidean space.

Now we can ask an important question.
If we are within some manifold, say on the surface of a 2-dimensional manifold, then we look all around us and, due to what it means to be a manifold, it appears to us that we are in Euclidean space.
How exactly can we be sure that our manifold is not, in fact, Euclidean space?
The two main things that differentiate one manifold from another are the *topology* and the *geometry*.
To oversimplify, these concepts refer respectively to the large-scale shape of the manifold and the small-scale shape.

## Topology

Topology should be considered as the "lower-level" structure of a manifold.
Later we will be interested in ways that the geometry of the manifold can change over time, but the underlying topology of the manifold will generally be fixed.[^topology]
Topology is sometimes referred to as rubber-sheet geometry, because deforming a manifold in ways that one could deform a rubber sheet would not change the topology.
For instance, the sphere has a certain topology and spheres that are, say, larger or smaller or squished or stretched or crumpled up all have different geometries, but the same underlying spherical topology.
One way to see that the topology is different from the topology of a plane is that a sphere does not "extend forever in all directions."
If one starts traveling in a fixed direction on a sphere, one will eventually come back to where they started.[^direction]
This is not true for the plane.

There is a mathematical tool that is used to distinguish the topology of manifolds.
It is sort of the rigorous version of the "rubber" in rubber-sheet topology.
The tool is called a *homeomorphism*, and its a map that points in one space to point in another.
Intuitively, we could say that two objects, like a sphere and a crumpled up or stretched-out sphere are the same if they can be deformed into one another without tearing, and without attaching different points on the object to each other.
Mathematically, the way to say it is that two topological spaces (like manifolds) are the same if there is a homeomorphism between them.
There are requirements on what types of maps can be homeomorphisms.
I won't try to state these requirements here, but they end up being basically ways of making precise the notion of "not tearing" and "not attaching" the space to itself.

For example, there is a homeomorphism between these two spaces,

But there isn't one between these two spaces, because we would have to tear a hole in the first surface to map it onto the second one.

And there isn't one between these two spaces, because we would have to join the first surface to itself along one edge to map it onto the second one.

Here are some examples of 1-dimensional manifolds. Which of these are homeomorphic to each other?

The examples I've given are all 1 or 2 dimensional, but these concepts apply to manifolds of any dimension.



## Footnotes

[^basis]: We do have to be just a little bit careful when choosing these directions.  For example, if we choose: forward, left, and backward, then we are unable to describe any upward or downward motion.
[^topology]: I doubt I'll get around to talking about it, but I can't resist mentioning it.
There are notions of geometric evolution that allow the toplogy of the manifold to change it a certain carefully controlled way.
The so-called Ricci flow with surgery is one famous way; analysis of this process was what led to the resolution of the Poincare conjecture.
[^direction]: This is not really the correct way to state what I'm talking about, but it's a better way to understand the idea.
The concept of direction on a topological manifold isn't really well-defined in the first place (although once we endow a topological manifold with a geometric structure we can sensibly talk about direction).
The technical concept that I'm referring to is called *compactness*, and it's very important in many areas of mathematics.
W

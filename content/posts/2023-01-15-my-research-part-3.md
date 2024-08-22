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
If we had only chosen 4 directions, say forward and to the right, then we could not describe any upward or downward motion in terms of these directions.
So our physical space can't be 2 dimensional.
If we had chosen 4 directions, say forward, right, down, and a little bit up and to the left, then we have some redundancy.
We only need any 3 of these directions to describe any sort of motion we want in space.
(It's true that if we choose to use the 3 directions: forward, right, and a little bit up and to the left, then describing motion in, say, purely the leftward direction becomes unnecessarily complicated, but the important thing is that it can in principle be done.)
So 4 directions is too many.

Another example of a manifold is a sphere, which is the infinitely thin outer surface of a ball.
When one imagines a sphere, one probably imagines it sitting inside of 3-dimensional space, but the sphere itself is a 2-dimensional manifold.
This can be seen for the same reason as before: if we are on the surface of the sphere and we pick out two distinguished directions relative to our position, then we can specify any point around us using only these two directions.
For example, I could tell you that the point I'm thinking of is 3 units to my right and -3 units in front of me, if my distinguished directions happen to be "to the right" and "forward."
Another way to phrase this same concept is by pointing out that we can specify any point on the surface of the earth with two coordinates: latitude and longitude.

The mathematically precise way to state this idea of being able to describe the manifold in terms of a certain number of coordinates is fairly technical, but it goes something like this.
In each dimension, there is a certain "default manifold" that is basically as nice as it's possible for a manifold to be.
This is called Euclidean space.
The 1-dimensional Euclidean space is a straight line extending forever in both directions.
Then a coordinate for this space is just a number, say $x$.
This space is often just referred to as *the line*.

The 2-dimensional Euclidean space is *the plane*, extending forever in all directions.
Any point in this space has a pair of 1-dimensional coordinates $(x,y)$, where each coordinate in the pair comes from 1-dimensional Euclidean space.

The 3-dimensional Euclidean space can be imagined as the physical space that we live in extending forever in all directions.
It's the space with 3 coordinates $(x,y,z)$ with each coordinate in the triplet coming from 1-dimensional Euclidean space.

Higher dimensional Euclidean spaces are obtained following the same pattern: simply add more coordinates.
Once we have these spaces in our hands, we can say that a manifold with possibly some other shape, like a sphere, is some mathematical object with the property that when we look very closely around a point, it looks like one of these Euclidean spaces of some dimension.
For example, the (idealized, without terrain features) surface of the earth looks like a piece of 2-dimensional Euclidean space.
Or a circle, when one zooms in closely on some point, looks just like a piece of 1-dimensional Euclidean space.

Now we can ask an important question.
If we are within some manifold, say on the surface of a 2-dimensional manifold, then we look all around us and, due to what it means to be a manifold, it appears to us that we are in Euclidean space.
How exactly can we be sure that our manifold is not, in fact Euclidean space?
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


## Footnotes

[^basis]: We do have to be just a little bit careful when choosing these directions.  For example, if we choose: forward, left, and backward, then we are unable to describe any upward or downward motion.
[^topology]: I doubt I'll get around to talking about it, but I can't resist mentioning it.
There are notions of geometric evolution that allow the toplogy of the manifold to change it a certain carefully controlled way.
The so-called Ricci flow with surgery is one famous way; analysis of this process was what led to the resolution of the Poincare conjecture.
[^direction]: This is not really the correct way to state what I'm talking about, but it's a better way to understand the idea.
The concept of direction on a topological manifold isn't really well-defined in the first place (although once we endow a topological manifold with a geometric structure we can sensibly talk about direction).
The technical concept that I'm referring to is called *compactness*, and it's very important in many areas of mathematics.
W

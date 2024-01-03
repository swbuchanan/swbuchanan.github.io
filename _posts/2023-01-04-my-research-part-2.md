---
layout: post
usemathjax: true
title: "My research, part 2"
---

## Research questions in curve shortening flow

In this article, I will not be talking about my own research, but instead I'll be talking about research completed by others.
The primary aim of this article is to discuss an example of a geometric flow.
Curve shortening flow is not the flow that I am primarily interested in, but there are some ideas and techniques that are common to almost all geometrics flows.

The secondary aim of this article is to provide a case study of research questions and results in the field of pure mathematics.

In the field of geometric flows, we usually have some partial differential equation like the heat equation or the equation that describes curve shortening flow.
It's important to note that "solving the equation" is not a focus of research in the area.
Indeed, solutions to these equations are generally easy to come by.
If you recall the website I linked last time (linked again [here](https://a.carapetis.com/csf/)), you will be able to observe solutions to the curve shortening flow equation yourself[^solutions].

A solution to a geometric flow is just the initial setup (in this case, it's the curve that you draw), and then all the curves at every instant in time afterwards.
What makes these time-slices of curves a solution is that if you play the time-slices like a movie (this is what the website does for you), you see the curve moving according to the curve shortening flow equation.
It could be moving in a way that satisfied some other geometric equation, or it could be moving randomly, but it's moving according to the rule of curve shortening flow, and therefore it is a solution.
Generally, a solution to a geometric flow of a manifold is again a collection of time-slices of a manifold changing geometry such that if you play the time-slices like a movie, you "see" the geometry changing over time in a way that is described by whatever equation you happen to be looking at.

When we have a partial differential equation, rather than just trying to solve the equation, usually the interesting problem is to prove that any solution to the equation must have certain properties.
Or more often, that any solution with property A must also have property X, or something to that effect.
To slightly undermine my previous point, occasionally we are interested in trying to construct a solution to the equation that has some certain properties or is missing some certain properties, or demonstrates that some idea is true or some other idea is false.

However, most often the goal in mathematical research is to prove a claim.
In geometric flows, we usually want to prove some statement about solutions to some geometric evolution equation.
Sometimes it's too much to ask to be able to prove a statement that refers to every possible solution to an equation, so instead we only look at solutions that have some properties that make our lives easier.

As an example, I'll discuss the proof of the following statement about certain solutions to the curve shortening flow.

> If we begin with a curve forming a closed loop in 2-dimensional space without crossing over itself, then as the curve moves according to curve shortening flow, it will never cross over itself, but instead will shrink to a point.
> Moreover, as it shrinks it will become more and more circular.



## Footnotes

[^solutions]: Technically the website will show approximations of solutions, but the point that solutions are easy to come by still stands.
    Precisely, one example of a solution is $$\gamma(x,t) = (\sqrt{9 - 2t} \cos x, \sqrt{9 - 2t} \sin x).$$
    The curve described by this equation (which, by necessity, tells us how the curve looks at each time-slice) looks like a circle with initial radius 3 that is shrinking inwards.
    If you could draw a perfect circle on the website (and if the website could actually process a perfect circle), this equation describes what you would see.

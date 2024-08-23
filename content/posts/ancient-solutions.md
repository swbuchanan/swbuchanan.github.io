---
title: "Ancient 2-dimensional solutions to the Ricci flow"
date: 2024-08-23
---

Here I'll give a more technical description of the work that I'm doing.
See my other posts for a generally accessible version of the same thing.

## Introduction

Geometric evolution equations describe how some quantity defined on a manifold changes over time.
This is a broad idea; it applies to the description of many evolving physical systems, and for many years has allowed us to apply the theory of partial differential equations to these problems.
Solutions of certain equations provide geometric models for corresponding physical phenomena.
The shape of a stationary film of soap is the solution to an elliptic partial differential equation.
The heat equation,
$$ \frac{\partial}{\partial t} u = \Delta u,$$
which describes diffusion processes like heat spreading through an unevenly heated object, is the prototypical parabolic partial differential equation.

Recently many differential equations and systems of equations - particularly parabolic systems - have been used to describe certain natural deformations of curves, surfaces, or Riemannian metrics (among other geometric objects).
Aside from direct physical applications, these theories can be applied to the problem of finding canonical or "best" metrics on Riemannian manifolds.


## The Ricci Flow

The pioneering work in this direction was by Richard Hamilton in 1982.
Motivated by the work of Eells and Sampson on the harmonic map heat flow (a way of deforming arbitrary maps between manifolds into harmonic maps), Hamilton considered a "heat equation" for the metric of a Riemannian manifold.

Hamilton classified all compact 3-manifolds of positive Ricci curvature by showing that, given an arbitrary Riemannian metric with positive Ricci curvature on a 3-manifold, the metric could smoothly deform to have constant curvature.
In particular, he examined the following.
Given a (compact) manifold $M$, a one-parameter family $g_t$ of Riemannian metrics on $M$ is said to evolve by the Ricci flow if
$$test$$
$$\frac{\partial}{\partial t} g_{ij} = R_{ij}$$
where $R$ is the Ricci curvature of $g(t)$.
This turns out to be a weakly parabolic system of nonlinear partial differential equations.
In particular, in the proper coordinates, this equation becomes
$$ \frac{\partial}{\partial t}g_{ij} = \Delta g_{ij} + \text{lower order terms.}  $$
The Ricci flow equation shares some important properties with the heat equation, and many other geometric quanities, including the Riemann curvature tensor, satisfy similar heat-type equations as the metric.
To such quantities we can often apply the *maximum principle*, a far-reaching generalization of the fact that at a local maximum of a function $u(x,t)$ satisfying $u_t = u_{xx}$, the second derivative of $u$ will be negative, and thus $u_t < 0$, causing the maximum of $u$ to decrease over time.

One example to keep in mind is the *shrinking sphere*.
A sphere has the same positive curvature everywhere.
Since the curvature is positive, the right hand side of the Ricci flow equation is negative, so the Ricci flow will uniformly shrink the metric.
A natural question then is what happens to the flow as the sphere shrinks down to a point.
This question and related questions form the topic of singularity analysis within the study of geometric flows.

## Modeling singularities

Suppose we have a solution to the Ricci flow with finite maximal time of existence $T$.
Then at $t \to T$, the curvature of the metric goes to infinity somewhere on the manifold (or indeed everywhere, as in the case of the sphere).
The technique we use to deal with this situation is to choose a sequence of times $t_i \to T$ and a sequence of points $x_i$ converging to the point where the curvature is exploding (e.g. the points where the supremum of curvature up to time $t_i$ is attained on $M$).
Then we apply a parabolic rescaling
$$ g_\lambda(x,t) = \lambda^2 g \left( x, \frac{t}{\lambda^2} \right) $$
so that the curvature remains bounded.
It is a general property of the Ricci flow that a parabolically rescaled solution to the flow is another solution.
Assuming a lower bound on the injectivity radius, there is a compactness theorem for solutions to the Ricci flow that ensures we can take a (subsequential) limit and obtain a so-called ancient solution to the Ricci flow that tells us what the manifold looks like near the singularity.

## Ancient solutions

An ancient solution to Ricci flow is a solution that is defined for all time before, say, time $t = 0$.
An example is provided by the shrinking spheres discussed before.
Any sphere has an ancestry reaching back forever, comprising larger and larger spheres as we look further backwards in time.
A more trivial example is the stationary plane: a flat metric is unchanging over time, since the right hand side of the Ricci flow equation is 0.
Certainly such a flow exists for all time, forwards and backwards.
Another important example is the *cigar*.
It can be pictured as a tube that extends infinitely in one direction and has a rounded (though not hemispherical) tip.
The almost-flat parts of the manifold, along the cylinder, barely move under the flow, but the curved tip "burns away" as time goes on.
Explicitly, the cigar is $(\R^2, g)$, with $g$ given in geodesic polar coordinates by
$$ ds^2 + \tanh^2 s \, d \theta^2. $$
The rescaling process described in the last section involves scaling the backwards time-domain of the flow to $-\infty$, so singularity models are always ancient solutions (although the converse of this isn't true).

## Classification of 2-dimensional ancient solutions and beyond

We can use the maximum principle mentioned previously to show that ancient solutions have non-negative curvature.
Then by the strong maximum principle, a solution must either have strictly positive curvature everywhere or must be a quotient of the stationary plane (i.e. a flat manifold, the most trivial solution to Ricci flow).
Then the only strictly positively curved ancient solutions are the shrinking spheres, the cigars, and the King-Rosenau solutions, which are sort of like compact versions of the cigars.
This classification was achievd through various papers and somewhat technical analysis.

Certain techniques in 1-dimensional mean curvature flow (aka curve shortening flow) can be applied to Ricci flow on surfaces.
Recently, Bourni, Langford, and Tinaglia have classified the convex ancient solutions to curve shortening flow.
My project aims to re-prove the classification of ancient Ricci flows on surfaces using the more geometric methods used in this classification.
I also hope to apply some of the methods we learn to classification of solutions in higher dimensions, or possibly classification of solutions to related flows, such as the Kähler-Ricci flow.





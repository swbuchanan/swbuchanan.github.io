---
layout: post
usemathjax: true
title: "My research, part 2"
---

This is the second part in a series of short articles I'm trying to write about my research.
[See the first one here]({% post_url 2023-01-03-my-research-part-1 %})

## Research questions in curve shortening flow

In this article, I will not be talking about my own research yet, but instead I'll be talking about research completed by others.

Event though it isn't the focus of my research, I want to talk about curve shortening flow since it is a particularly simple and concrete example of a geometric flow.
I also hope to give an example of what an actual research question in this field is like, since most of the time when I explain my research field I have to stay at the level of vague ideas and intuitive explanations.
This article will still be quite vague compared to the actual research papers, but at least it will be a vague explanation of a significant result in this area.

In the field of geometric flows, we usually have some partial differential equation like the heat equation or the curve shortening flow equation.
It's often easy to describe the flow without the use of an equation, but the equation is critical when it comes to actually doing mathematics.
It's natuaral to think that equations exist as things that are to be solved, but it should be noted that solving these equations is never a major research question.
Indeed, solutions to these equations are generally easy to come by.
In the last article I linked [this website](https://a.carapetis.com/csf/), which lets you observe solutions to curve shortening flow that begin with a curve that you can draw yourself.[^solutions].

A solution to a geometric flow is just the initial setup consisting of a manifold and its geometry (in this case the manifold is the curve and the geometry is the shape of the curve) and then all the curves at every instant in time afterwards.
What makes these time-slices of curves a solution is that if you play the time-slices like a movie (this is what the website does for you), you see the curve move according to the curve shortening flow equation (remember that the curve shortening flow tells a curve how to change shape over time).
It could be moving in a way that satisfied some other geometric equation, or it could be moving randomly, but it's moving according to the rule of curve shortening flow, and therefore it is a solution.
To summarize this paragraph: a solution to a geometric flow of a manifold (think about a curve) is a collection of time-slices of a manifold changing geometry (think about the curve changing shape) such that if you could play the time-slices like a movie, you would see the geometry changing over time in a way that is described by the equation associated to the geometric flow you're thinking of.

When we have a partial differential equation, rather than just trying to solve the equation, usually a more interesting problem is to prove that any solution to the equation must have certain properties.
Or more often, that any solution with properties A, B, and C necessarily has some particular behavior, or doesn't have some other behavior, or something to that effect.
To slightly undermine my previous point about solving the equation, occasionally we are interested in trying to construct a solution to the equation that has some certain properties or is missing some certain properties, or demonstrates that some idea is true or some other idea is false.
It also can be a challenging problem to prove that solutions to the equation always have to exist!
For instance, not every curve has a well-defined normal vector at every point (think about what happens if the curve has a "corner" somewhere).
Since the normal vector is part of the equation, not having a normal vector means that the curve shortening flow equation can't tell the curve how to move if the curve doesn't have a normal vector somewhere[^normal].
Even if we start with a curve that is completely smooth and has no corners, if we let it flow according to curve shortening flow, how do we know it won't later on develop a corner and break the flow?
This doesn't happen, but the fact that it doesn't happen is a non-obvious fact requiring proof.

Okay, so we know what solutions to curve shortening flow are, and we're interested in proving that certain types of solutions (that is, solutions with certain properties as mentioned in the previous paragraph) behave in a certain way.
As an example of this, I'll discuss the proof of the following statement about certain solutions to the curve shortening flow.

> If we begin with a curve forming a closed loop in 2-dimensional space without crossing over itself, then as the curve moves according to curve shortening flow, it will never cross over itself, but instead will shrink to a point.
> Moreover, as it shrinks it will become more and more circular.

This statement is often called the *Gage-Hamilton-Grayson theorem*.
I won't discuss the technical details of this proof, but instead try to give a high-level understanding of what it takes to prove it.
If you would like to see technical details, [here](https://math.jhu.edu/~js/Math745/gage-hamilton.pdf) is the paper of Gage and Hamilton proving (part of) this result.[^gage_hamilton]

Some important tools are the *normal vector* $$\mathsf N$$ that is perpendicular to the curve at a point, the *tangent vector* $$\mathsf T$$ that is tangent to the curve at a point, and the *Frenet-Serret equations*.
These equations give information about the spatial derivative of the normal vector in terms of the tangent vector, and the spatial derivative of the tangent vector in terms of the normal vector.
These equations also involve the curvature of the curve.
The phrase "spatial derivative" may sound confusing, but the idea to keep in mind is that when we talk about the normal or tangent vectors, we are talking about vectors that are based at some particular point on the curve.
Then the spatial derivative of the tangent vector describes how the tangent vector rotates as the point we're looking at moves around the curve.

It's very important that these equations involve the curvature.
The curvature is just the shape of the curve, so having equations like these gives us a way to prove things about the shape of the curve.

Here's another important idea: since the curve shortening equation

$$\frac{\partial}{\partial t} \gamma = \kappa \mathsf N$$

involves the normal vector and a *time derivative*, and the Frenet-Serret equations involve the normal vector and a *space derivative*, as well as information about the shape of the curve, they give us a precise way to talk about how changes in space relate to changes in time, and then apply this to the shape of the curve.
So we can get equations that describe how the shape of the curve is changing.
More specifically, using these ideas we can get a differential equation for how the curvature evolves over time.

This is a good time to introduce another important tool that shows up very frequently in geometric analysis: the maximum principle.
There are some complicated mathematical statements I could write down to explain the maximum principle in full detail, but the basic idea is this:
as heat diffuses throughout an object, the hottest parts cool down and the coldest parts heat up.
In other words, the maximum heat is decreasing and the minimum heat is increasing.
And even in the case where this isn't true, which is the case where we're heating the object from the outside (or the object is losing heat to the outside - previously I was talking about a perfectly insulated object), the only places that we can look to find the new hottest parts of the object are the places where we're introducing new heat: i.e. the edges of the object.

This is true of heat diffusion, which means it is true of solutions to the heat equation.
However, there are many other differential equations that are similar enough to the heat equation that they share this property that maximums decrease and minimums increase (or just one of these two properties, but sometimes we only need one to work).
This is the basic idea that we call the maximum principle.
This fact can be proved for large classes of differential equations, and the proof is quite pleasing, but it would take too long to discuss in this post.

Now, when we left off three paragraphs ago, we had just found a differential equation that tells us how the curvature at any point of the curve changes over time.
Using this differential equation (and many other concepts and technical details), we can find that the ratio of the maximum curvature at any point on the curve to the minimum curvature at any point of the curve goes to 1 as time passes.
That is, the curvature is changing over time in such a way that the maximum curvature anywhere is equal to the minimum curvature anywhere.
The only way that can be true is if the curvature everywhere is the same, and the only way *that* can be true is if the curve is a circle.
So, over time the curve is becoming a circle.[^circle]

Notice that it's important that we're talking about the *ratio* of the maximum and minimum curvatures instead of just the maximum and minimum curvatures directly.
As the curve shrinks to a tiny circle (and eventually shrinks into nothing), the curvature increases without bound.
A tiny circle is more curved than a large one, but the ratio of the maximum and minimum curvatures on a tiny circle is still 1.
If all we knew was that the maximum and minimum curvatures were increasing without bound, this wouldn't be enough to say that the curve is becoming circular, but the fact about the ratio approaching 1 is a stronger fact.

## Footnotes

[^solutions]: Technically the website will show approximations of solutions, but the point that solutions are easy to come by still stands.
    Precisely, one example of a solution is $$\gamma(x,t) = (\sqrt{9 - 2t} \cos x, \sqrt{9 - 2t} \sin x).$$
    The curve described by this equation (which, by necessity, tells us how the curve looks at each time-slice) looks like a circle with initial radius 3 that is shrinking inwards.
    If you could draw a perfect circle on the website (and if the website could actually process a perfect circle), this equation describes what you would see.

[^normal]: Don't worry, there's a way to fix this problem, and the curve shortening flow still works even if the curve you start with has sharp corners.
    (But worse things can happen too.)

[^gage_hamilton]: To be completely accurate, Gage and Hamilton proved the result under the additional assumption that the curve you start with is *convex*, meaning that if you travel around the curve in a counterclockwise direction, you can only turn to the left (or go straight for a while).
    Later, Grayson proved that if you start with an arbitrary curve that doesn't intersect itself, eventually it will *become* convex without ever intersecting itself.
    Together these two results prove the result we stated.

[^circle]: Although it's becoming a circle that shrinks to nothing!
    That's why it's important that we're talking about the *ratio* of the maximum to minimum curvatures, and not just the maximum and minimum curvatures themselves.
    The maximum curvature and minimum curvature are both going to infinity as the curve shrinks - because a tiny circle has higher curvature than a big circle.
    When things go to infinity they become hard to describe mathematically.


---
title: "Jensen's inequality, and how to not go broke when you're winning money"
date: 2026-08-08
math: true
---

I'm always happy when I see the same thing in two different places.
In this case, the thing is *Jensen's inequality*.

The basic form that is generally used is the following:
if $d \mu$ is a probability measure, and $\Phi$ is a convex function, then
$$\Phi \left( \int f \, d \mu \right) \le \int \Phi(f) \, d \mu. $$

This inequality appears occasionally in my field of geometric flows (often as the [Cauchy-Schwarz inequality (Wikipedia)](https://en.wikipedia.org/wiki/Cauchy%E2%80%93Schwarz_inequality)).
Specifically in what I've been working on recently, it appears in some rather technical auxiliary calculations, but to illustrate the point, let's make the following observation.
Ricci flow on a surface is described by the Riemannian metric changing over time in a certain way.
That is, the metric on the surface is a function of time $t$: we write $g_t$.
But due to the [Uniformization theorem](https://en.wikipedia.org/wiki/Uniformization_theorem), we can write[^conformal]
$$ g_t = e^{2u(t)} g_0, $$
where $g_0$ is a *fixed* metric and $u(t)$ is a function that is changing in time.
Since we have changed the problem to studying a metric (i.e. a tensor) that is evolving to studying a function that is evolving, we have made a certain simplification.

Since $e^{2x}$ is convex, Jensen's inequality says that
$$ e^{2 \bar u} \le \frac 1 A \int_M e^{2 u} \, d \mu_0 = 1, $$
from which it follows that $\bar u \le 0$.
This sign estimate helps us control the conformal factor along the flow (via the Liouville energy I think).


## The geometric picture

A function is convex when every chord joining two points on its graph stays above the graph between those points. More precisely, if $a < b$ and $0 \leq t \leq 1$, then

$$
f\big((1-t)a+tb\big) \leq (1-t)f(a)+tf(b).
$$

The picture below shows this definition for the fixed convex function $f(x)=x^2$. Move either endpoint of the secant segment.

{{< convex_secant >}}

At the midpoint, $t=\frac12$, this becomes

$$
f\left(\frac{a+b}{2}\right) \leq \frac{f(a)+f(b)}{2}.
$$

The same geometric idea, extended from two points to a weighted collection of points, is Jensen's inequality.
For example, say we have four points $x_1, x_2, x_3, x_4$, and nonnegative weights $\lambda_1, \lambda_2, \lambda_3, \lambda_4$ that satisfy
$$ \lambda_1 + \lambda_2 + \lambda_3 + \lambda_4 = 1$$
(with two points the weights were $t$ and $1-t$; for any value of $t$ these two weights add up to $1$.)
Then the inequality says that
$$ \Phi \left( \sum_{i=1}^4 \lambda_i x_i \right) \le \sum_{i=1}^4 \lambda_i \Phi(x_i). $$

Here is the same two-point picture repeated across four movable points. Each segment is the secant for a neighbouring pair. For equal weights $\lambda_i=\frac14$, the diamond marks the barycenter
$B=\frac14\sum_{i=1}^4(x_i,f(x_i))$. Its dashed vertical line compares $B$ with the point $(\bar x,f(\bar x))$ on the graph.

{{< convex_secant points="4" >}}

In probability, 

Suppose we are making trades regularly over a long period of time.
If $W_t$ denotes our weatlth at time $t$, and the return on trade $i$ is denoted $R_i$ (with $0 \leq R_i \leq 1$), then after making the first trade, our wealth is
$$ W_0 (1 + R_1). $$
After making the first two, it is
$$ W_0 (1 + R_1)(1 + R_2), $$
and so on.
At the end time $T$, we have
$$ W_T = W_0 \prod_{t=1}^T (1 + R_t). $$
Taking logs, we get
$$ \log W_T = \log W_0 + \sum_{t=1}^T \log(1 + R_t). $$
So the long-run growth is determined by 




### Footnotes

[^conformal]: We could just write it as $g(t) = u(t) g_0$, but including the exponential and the factor of $2$ makes some computations nicer.

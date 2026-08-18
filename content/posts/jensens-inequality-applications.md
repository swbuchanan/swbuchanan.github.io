---
title: "Jensen's inequality, and how to not go broke when you're winning money"
date: 2026-08-08
math: true
draft: true
---

I'm always happy when I see the same thing in two different places.
In this case, the thing is *Jensen's inequality*.

The basic form that is generally used is the following:
if $d \mu$ is a probability measure, and $\Phi$ is a convex function, then
$$\Phi \left( \int f \, d \mu \right) \le \int \Phi(f) \, d \mu. $$
In words, this says that applying a convex function after averaging gives something no longer than averaging after applying the convex function.
Below are some simplified examples that make this more concrete, although first I'll look at an application that shows why it was useful to me.

This inequality appears occasionally in my field of geometric flows (often as the [Cauchy-Schwarz inequality (Wikipedia)](https://en.wikipedia.org/wiki/Cauchy%E2%80%93Schwarz_inequality)).
Specifically in what I've been working on recently, it appears in some rather technical auxiliary calculations, but to illustrate the point, let's make the following observation.

Ricci flow on a surface is described by the Riemannian metric changing over time in a certain way.
That is, the metric on the surface is a function of time $t$: we write $g_t$.
On a surface, Ricci flow preserves the conformal class of the metric.
Due to the [Uniformization theorem](https://en.wikipedia.org/wiki/Uniformization_theorem), we can write[^conformal]
$$ g_t = e^{2u(t)} g_0, $$
where $g_0$ is a *fixed* metric and $u(t)$ is a function that is changing in time.
Since we have changed the problem to studying a metric (i.e. a tensor) that is evolving to studying a function that is evolving, we have made a certain simplification.

Let

$$A=\int_M d\mu_0$$

be the area of $(M,g_0)$, and write

$$\bar u = \frac 1 A \int_M u \, d\mu_0 $$

for the average value of $u$.

Since $e^{2x}$ is convex, Jensen's inequality gives

$$ e^{2\bar u} \leq \frac 1 A \int_M e^{2u}\,d\mu_0. $$

But $d\mu_{g_t}=e^{2u}d\mu_0$, so the right-hand side is just

$$\frac{\operatorname{Area}(M,g_t)}{A}.$$

If we are working with an area-normalized flow, so that the area stays equal to $A$, this becomes

$$ e^{2\bar u}\leq 1, $$

and therefore

$$ \bar u\leq 0. $$

The integral inequality has given us a sign estimate on the average conformal factor. Estimates of this kind can then be fed into the energy estimates used to control the flow.

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

In probability, the weights are probabilities and the weighted average is an expectation. If $X$ is a random variable, Jensen becomes
$$ \Phi(\mathbb E[X]) \le \mathbb E[ \Phi(X) ]. $$
Now let's see an unintuitive fact that essentially follows from this.

## Losing with positive expected value?

Suppose we are making trades regularly over a long period of time.
Let $W_t$ denotes our wealth after trade $t$, and let $R_t$ denote the fractional return on trade $t$.
That is, $R_t = -0.02$ means that trade $t$ loses us $2\\%$ of our wealth, while $R_t = 0.5$ means trade $t$ gains us $50\%$.
With this notation, after one trade, our wealth is $W_1$, which can be expressed as
$$ W_1 = W_0 (1 + R_1). $$
After making the first two trades, we have
$$ W_0 (1 + R_1)(1 + R_2), $$
and so on.
After $T$ trades, our wealth is
$$ W_T = W_0 \prod_{t=1}^T (1 + R_t). $$
Taking logs turns the product into a sum:
$$ \log W_T = \log W_0 + \sum_{t=1}^T \log(1 + R_t). $$
We can rearrange and divide by $T$ so that the right hand side is an average:
$$ \frac 1 T \log \frac{W_T}{W_0} = \frac 1 T \sum_{t=1}^T \log(1 + R_t). $$
Suppose we are in a situation where the returns are independent and identically distributed (i.e. we are essentially making the same bet every time), then the law of large numbers says that for large $T$,
$$ \frac 1 T \log \frac{W_T}{W_0} \longrightarrow \mathbb E[\log(1 + R)]. $$
Here $R$ has become a random variable that describes the bet/trade that we are making; samples of $R$ give the specific $R_t$'s.
So the long-run growth is determined by $\mathbb E[\log(1 + R)]$.
Here we apply Jensen's inequality (in the opposite direction because $\log$ is concave rather than convex), which says
$$ \mathbb E[\log(1 + R)] \le \log( \mathbb E[1 + R]) = \log(1 + \mathbb E[R]). $$
In particular, it is possible to have positive expected return on the bet: $\mathbb E[R] < 0$, but still lose money over time: $\mathbb E[\log(1 + R)] < 0$.

### An example

Consider a trade which has a $50\\%$ chance of gaining $50\\%$ and a $50\\%$ chance of losing $40\\%$.

The expected return is
$$ \mathbb E[R] = \frac 1 2 (0.5) + \frac 1 2 (-0.4) = 0.05, $$
meaning that on average we should be winning $5\\%$ each time, right?
Not exactly: suppose we win and lose once.
After this, our wealth is multiplied by
$$ 1.5 \times 0.6 = 0.9, $$
meaning that we have lost $10\\%$.
This is so sad:
$$
\begin{align*}
\mathbb E[\log(1+R)] &= \frac12\log(1.5)+\frac12\log(0.6) \\\\
& = \frac12\log(0.9) \\\\
&<0.
\end{align*}
$$
Another strange observation we can make at this point is that the expected wealth is actually growing exponentially:
$$ \mathbb E[W_T] = W_0(\mathbb E[1 + R])^T = W_0 (1.05)^T. $$
This reflects the fact that a small number of traders in this situation ar eextremely successful.

## Not all hope is lost: the Kelly Criterion

A more realistic scenario is that we can estimate the probability of a bet winning or losing, but the *amount* that it wins or loses (even the percentage) is up to us to decide.
That is, we can decide how much to wager.
We can use the previous observations to our advantage.

Suppose we have a bet that wins $60\\%$ of the time and loses $40\\%$ of the time.
If we bet a $n$ dollars, we expect to win
$$ 0.6 (\\$ n) + 0.4 (-\\$n) = \\$( 0.2  n). $$
So to maximize the EV of a single bet, we should bet as much as possible.
However, if we bet all we have, the fractional return is
$$
R = 
\begin{cases}
1 & \text{with probability } 0.6 \\\\
-1 & \text{with probability } 0.4.
\end{cases}
$$
So
$$ \mathbb E[\log(1 + R)] =  \frac 1 2 \log(0) + \frac 1 2 \log(2) = -\infty.$$
This seems weird but what it is saying is that if you repeatedly place all your money on this bet then you are guaranteed to eventually go broke.
This perspective makes sense: the $40\\%$ chance outcome is bound to happen eventually.



### Footnotes

[^conformal]: We could just write it as $g(t) = u(t) g_0$, but including the exponential and the factor of $2$ makes some computations nicer.

---
title: "Jensen's inequality, and how to not go broke when you're winning money"
date: 2026-08-08
math: true
draft: true
---

I'm always happy when I see the same thing in two different places.
In this case, the thing is *Jensen's inequality*.

The basic form that is generally used is the following:
if $d\mu$ is a probability measure, and $\Phi$ is a convex function, then

$$
\Phi\left(\int f\,d\mu\right)
\leq
\int \Phi(f)\,d\mu.
$$

In words: applying a convex function *after averaging* gives something no larger than averaging *after applying the convex function*.

This inequality appears occasionally in my field of geometric flows (often disguised as something like the [Cauchy--Schwarz inequality](https://en.wikipedia.org/wiki/Cauchy%E2%80%93Schwarz_inequality)).
Specifically, in what I've been working on recently, it appears in some rather technical auxiliary calculations. But to illustrate the point, let's make a simpler observation.

Ricci flow on a surface is described by a Riemannian metric changing over time in a certain way.
That is, the metric on the surface is a function of time $t$, which we write as $g_t$.

On a surface, Ricci flow preserves the conformal class. Using the Uniformization theorem, we can choose a convenient fixed metric $g_0$ in that conformal class and write[^conformal]

$$
g_t=e^{2u(t)}g_0,
$$

where $u(t)$ is now the thing changing in time.
We have changed the problem from studying an evolving tensor to studying an evolving function, which is a substantial simplification.

Let

$$
A=\int_M d\mu_0
$$

be the area of $(M,g_0)$, and write

$$
\bar u
=
\frac1A\int_M u\,d\mu_0
$$

for the average value of $u$.

Since $e^{2x}$ is convex, Jensen's inequality gives

$$
e^{2\bar u}
\leq
\frac1A\int_M e^{2u}\,d\mu_0.
$$

But $d\mu_{g_t}=e^{2u}d\mu_0$, so the right-hand side is just

$$
\frac{\operatorname{Area}(M,g_t)}{A}.
$$

If we are working with an area-normalized flow, so that the area stays equal to $A$, this becomes

$$
e^{2\bar u}\leq 1,
$$

and therefore

$$
\bar u\leq 0.
$$

A fairly abstract-looking integral inequality has given us a sign estimate on the average conformal factor. Estimates of this kind can then be fed into the energy estimates used to control the flow.

But Jensen's inequality has another interpretation which I find much more intuitive.


## The geometric picture

A function is convex when every chord joining two points on its graph stays above the graph between those points. More precisely, if $a<b$ and $0\leq t\leq1$, then

$$
f\big((1-t)a+tb\big)
\leq
(1-t)f(a)+tf(b).
$$

The picture below shows this definition for the fixed convex function $f(x)=x^2$. Move either endpoint of the secant segment.

{{< convex_secant >}}

At the midpoint, $t=\frac12$, this becomes

$$
f\left(\frac{a+b}{2}\right)
\leq
\frac{f(a)+f(b)}2.
$$

So the value of a convex function at the average of two points lies below the average of the two function values.

The same geometric idea extends from two points to a weighted collection of points.
For example, suppose we have four points $x_1,x_2,x_3,x_4$, together with nonnegative weights $\lambda_1,\lambda_2,\lambda_3,\lambda_4$ satisfying

$$
\lambda_1+\lambda_2+\lambda_3+\lambda_4=1.
$$

Then Jensen's inequality says

$$
\Phi\left(\sum_{i=1}^4\lambda_i x_i\right)
\leq
\sum_{i=1}^4\lambda_i\Phi(x_i).
$$

Here is the same picture repeated across four movable points. For equal weights $\lambda_i=\frac14$, the diamond marks the barycenter

$$
B
=
\frac14\sum_{i=1}^4(x_i,f(x_i)).
$$

Its dashed vertical line compares the height of this barycenter with the point $(\bar x,f(\bar x))$ on the graph.

{{< convex_secant points="4" >}}

Jensen says that the barycenter cannot lie below the graph.

In probability, the weights are probabilities and the weighted average is an expectation. If $X$ is a random variable, Jensen becomes

$$
\Phi(\mathbb E[X])
\leq
\mathbb E[\Phi(X)].
$$

And now we can use essentially the same picture to lose some money.


## Winning on average

Suppose we make trades regularly over a long period of time.

Let $W_t$ denote our wealth after trade $t$, and let $R_t$ denote the fractional return on that trade. Thus $R_t=-0.2$ means we lose $20\%$, while $R_t=0.5$ means we gain $50\%$. We require $R_t>-1$, since losing more than $100\%$ of our wealth would require borrowing money.

After one trade,

$$
W_1=W_0(1+R_1).
$$

After two,

$$
W_2=W_0(1+R_1)(1+R_2),
$$

and after $T$ trades,

$$
W_T
=
W_0\prod_{t=1}^T(1+R_t).
$$

The important thing here is that wealth does not add: **it multiplies**.

Taking logarithms turns this product into a sum:

$$
\log W_T
=
\log W_0
+
\sum_{t=1}^T\log(1+R_t).
$$

Equivalently,

$$
\frac1T\log\frac{W_T}{W_0}
=
\frac1T\sum_{t=1}^T\log(1+R_t).
$$

If the returns are independent and identically distributed, and satisfy the usual integrability assumptions, then the law of large numbers tells us that for large $T$,

$$
\frac1T\log\frac{W_T}{W_0}
\longrightarrow
\mathbb E[\log(1+R)].
$$

So the quantity which controls long-run multiplicative growth is not

$$
\mathbb E[R],
$$

but

$$
\mathbb E[\log(1+R)].
$$

And here Jensen appears again.

The logarithm is *concave*, rather than convex, so Jensen's inequality goes in the opposite direction:

$$
\mathbb E[\log(1+R)]
\leq
\log\big(\mathbb E[1+R]\big)
=
\log(1+\mathbb E[R]).
$$

This is the mathematical version of the fact that volatility hurts when gains compound multiplicatively.

In particular, it is perfectly possible to have

$$
\mathbb E[R]>0
$$

while simultaneously having

$$
\mathbb E[\log(1+R)]<0.
$$

In other words: you can have a positive expected return and still get poorer over time.


## A very small casino

Consider a trade which has a $50\%$ chance of gaining $50\%$ and a $50\%$ chance of losing $40\%$.

The expected return is

$$
\mathbb E[R]
=
\frac12(0.5)+\frac12(-0.4)
=
0.05.
$$

So the trade has an expected return of $5\%$.

That sounds pretty good.

But suppose we win once and lose once. Our wealth is multiplied by

$$
1.5\times0.6=0.9.
$$

We are down $10\%$.

The expected logarithmic growth per trade is

$$
\begin{aligned}
\mathbb E[\log(1+R)]
&=
\frac12\log(1.5)+\frac12\log(0.6)\\
&=
\frac12\log(0.9)\\
&<0.
\end{aligned}
$$

So over a long sequence of these trades, a typical trajectory of our wealth heads toward zero, despite every trade having a positive expected return.

There is an especially strange consequence. Since the trades are independent,

$$
\mathbb E[W_T]
=
W_0\big(\mathbb E[1+R]\big)^T
=
W_0(1.05)^T.
$$

Thus the *expected wealth* grows exponentially, even while the wealth along a typical sufficiently long sequence of trades shrinks exponentially.

There is no contradiction. The expectation is increasingly dominated by a small number of extremely successful trajectories.

The arithmetic mean says we are getting richer.

The geometric mean says we are going broke.


## Bet sizing

There is another way to see the same issue which is closer to actual gambling or trading.

Suppose a bet wins with probability $p$ and loses with probability $1-p$. For simplicity, suppose it pays even money: if we bet one dollar and win, we gain one dollar; if we lose, we lose the dollar.

Suppose furthermore that $p=0.6$.

This is a very good game. For each dollar wagered, the expected profit is

$$
0.6(1)+0.4(-1)=0.2.
$$

A $20\%$ edge!

So should we bet all our money every time?

Obviously not. The first loss would bankrupt us.

Instead, suppose we bet a fraction $f$ of our current wealth on each round. Our wealth multiplier is then

$$
1+f
$$

when we win, and

$$
1-f
$$

when we lose.

The expected logarithmic growth is therefore

$$
G(f)
=
0.6\log(1+f)
+
0.4\log(1-f).
$$

This is the quantity we actually want to maximize if the goal is long-run compounded growth.

Differentiating,

$$
G'(f)
=
\frac{0.6}{1+f}
-
\frac{0.4}{1-f}.
$$

Setting this equal to zero gives

$$
f=0.2.
$$

So even though the game has a substantial positive edge, the long-run growth-optimal strategy is to bet only $20\%$ of our wealth at a time.

This is the simplest version of the **Kelly criterion**.

And if we ignore this and bet too aggressively, something interesting happens. For example, if we bet half our wealth every round,

$$
G(0.5)
=
0.6\log(1.5)+0.4\log(0.5)
<0.
$$

So we have a game which we win $60\%$ of the time, with a positive expected profit on every dollar wagered, and nevertheless our wealth tends to decrease if we bet too much.

The problem is not that we failed to find an edge.

The problem is that we sized the bet badly.


## Jensen again

The geometric statement and the financial statement are really the same phenomenon.

For a convex function, fluctuations push the average function value upward:

$$
\Phi(\mathbb E[X])
\leq
\mathbb E[\Phi(X)].
$$

For a concave function, fluctuations push it downward:

$$
\mathbb E[\Phi(X])
\leq
\Phi(\mathbb E[X]).
$$

The logarithm is concave, and compounded wealth is governed by logarithms. So randomness in returns imposes a cost that cannot be seen by looking only at the arithmetic average return.

This is sometimes called *volatility drag*, but I think Jensen's inequality makes the mechanism clearer: averaging and applying a nonlinear function do not commute.

The gap between

$$
\log\mathbb E[1+R]
$$

and

$$
\mathbb E[\log(1+R)]
$$

is exactly the gap that matters.

So Jensen's inequality gives, on one hand, a sign estimate for a conformal factor in Ricci flow, and on the other, an explanation of why somebody can repeatedly make positive-expectation bets and nevertheless lose nearly all their money.



### Footnotes

[^conformal]: Writing the conformal factor as $e^{2u}$ guarantees that it is positive. The factor of $2$ is also natural because multiplying lengths by $e^u$ multiplies the metric, which measures squared lengths, by $e^{2u}$.

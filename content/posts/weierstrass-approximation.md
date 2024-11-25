---
title: A cute proof of Weierstrass approximation
date: 2024-11-07
---

The Weierstrass approximation theorem says that (on an interval of finite length) we can approximate any continuous function arbitrarily well by polynomials.
As polynomials have very nice mathematical any computational properties, this is a very useful theorem.

Probably most people who have encountered any proof of the Weierstrass approximation theorem have already seen the essential idea of this proof.
Indeed, this is basically the original proof that Karl Weierstrass gave in 1885, just with a slightly different perspective.
The idea of the proof is to take $f(x)$, the function that we are trying to approximate, as initial data to the heat equation.
Then allow the heat distribution described by $f$ to diffuse for a very short amount of time.
The heat equation has the remarkable property that its solutions immediately become smooth.
But if we only allow the diffusion to happen for a sufficiently short amount of time, the distribution after this short time is still quite close (in the appropriate sense of "close") to the original function $f$.
Thus we have a smooth approximation.
From there we can use Taylor's theorem, which says that a smooth function can be approximated by polynomials.

To be more precise, we can find a function $\phi(x,t)$ so that $\phi(x,t)$ to the heat equation on $\R$ with $\phi(x,0) = f(x)$.
Then $\phi$ converges uniformly to $f$ as $t$ goes backwards to $0$, and is smooth for all $t > 0$.
Since $\phi$ is smooth, we can apply Taylor's theorem to obtain the uniform approximation by polynomials.


> Theorem: Weierstrass approximation. Given a continuously supported compact function $f$ on $\R$ and $\epsilon > 0$, there is a polynomial $p(x)$ such that $|f(x) - p(x)| < \epsilon$ whenever $f \neq 0$.

Proof. Take
$$\phi(x,t) = \frac{1}{\sqrt{4 \pi t}} \int_{\R} e^{-\frac{(x-y)^2}{4t}} f(y) \\, dy.$$

This is our desired solution to the heat equation.
There are still a few more details to fill in, but from here it's mostly computation, so I'll add the details when I have more time.

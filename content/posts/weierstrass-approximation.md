---
title: A cute proof of Weierstrass approximation
date: 2024-11-07
---

The Weierstrass approximation theorem says that (on an interval of finite length) we can approximate any continuous function arbitrarily well by polynomials.
As polynomials have very nice mathematical any computational properties, this is a very useful theorem.

Probably most people who have encountered any proof of the Weierstrass approximation theorem have already seen the essential idea of this proof.
Indeed, this is basically the original proof that Karl Weierstrass gave in 1885, just with a slightly different perspective.
The idea of the proof is to take $f(x)$, the function that we are trying to approximate, as initial data to the heat equation.
Then the solution $\phi(x,t)$ to the heat equation on $\R$ with $\phi(x,0) = f(x)$ converges uniformly to $f$ as $t$ goes backwards to $0$, and is smooth for all $t > 0$.
Since $\phi$ is smooth, we can apply Taylor's theorem to obtain the uniform approximation by polynomials.

I'll add a few details soon.



> Theorem: Weierstrass approximation. Given a continuously supported compact function $f$ on $\R$ and $\epsilon > 0$, there is a polynomial $p(x)$ such that $|f(x) - p(x)| < \epsilon$ whenever $f \neq 0$.

Proof. Take
$$\phi(x,t) = \frac{1}{\sqrt{4 \pi t}} \int_{\R} e^{-\frac{(x-y)^2}{4t}} f(y) \\, dy$$

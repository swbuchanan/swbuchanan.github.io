---
title: "Nagel-Schreckenberg traffic simulation"
date: 2025-12-11
---

In [this](https://artowen.su.domains/mc/Ch-intro.pdf) text book available online about Monte Carlo simulation, the first example given is a traffic simulation that shows how traffic jams can emerge seemingly out of nowhere, even when there aren't any particularly bad drivers or disruptive incidents on the road.
Below is a small demonstration of traffic following the **Nagel-Schreckenberg** simulation rules.
Based on these rules, we have the following setup:
- The road is divided into discrete cells, each with one car.
- The cars all have some velocity $v$.
- There is a maximum velocity $v_{\max}$ that all cars obey.

The simulation proceeds in discrete time steps.
At each time step, the following 4 rules are applied to all cars in parallel.
For each car,
1) If its velocity is below $v_{\max}$, it increases its velocity by one unit.
2) It checks the distance to the car in front of it.
3) If that distance is $d$ spaces and the car has velocity $v \geq d$, then it reduces its velocity to $d-1$ in order to avoid collision.
4) If the velocity is positive then with probability $p$ it reduces its velocity by 1 unit. This is the key step that models random driver behavior.
5) The motion of the car takes place. That is, the car moves ahead by $v$ units.

Here is a simulation following these rules with a road that wraps around (so the drivers are effectively driving in a circle).
The road has length 700, there are 100 drivers, and the probability of braking is around $1/3$.
The maximum speed is 3.

{{< traffic_simulation >}}

I made this in a hurry but soon I hope to update this page with options to adjust the number of drivers, the maximum speed, and the probability $p$ of braking.

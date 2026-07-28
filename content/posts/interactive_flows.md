---
title: "Some interactive demonstrations of geometric flows"
date: 2023-09-15
---


## Network flow

This is an example of a geometric flow on a graph.
Vertices flow in the direction defined by the "sum" of all the edges connected to them, where the sum is defined by treating the edges as vectors.
Vertices with a single edge do not move.

Select empty space to add points.

Once you've added some points, right-drag to add edges between them.
Drag a point to move it.

Once you've added a few points and a few edges, click the toggle animation button to see it move.

{{< networkflow >}}


## Discrete curve shortening flow

Select the canvas to add points and form a closed polygon (you need at least two points before anything appears), then use the controls to evolve it.
Once there are at least three points, the normal vectors at the vertices are displayed.
Select **Step** to move one time step forward and simulate the polygon's motion under discrete curve shortening flow.
When only two points remain, the flow degenerates. When two points get too close, the simulation replaces them with one point; this introduces some small numerical discontinuities in the normal vectors.

You can find a more polished demonstration of a slightly different form of curve shortening flow on [Anthony Carapetis's site](https://a.carapetis.com/csf/).

This is still a work in progress. Some polygons disappear almost immediately; if that happens with a reasonably large polygon, try drawing it again.

{{< thing >}}

---
title: "Running every suburb in Melbourne"
date: 2026-11-09
description: "Current progress on running from my apartment in Southbank into every suburb of Melbourne."
---

A while ago I wrote that my [Canberra street-running project]({{< ref "/posts/running-canberra.md" >}})
was defunct and that a Melbourne version was coming.
Finally the Melbourne version is here!

I don't currently have the goal to run every street in Melbourne, but instead I want to **run at least 1km in every suburb of Melbourne at least once**.

## Progress so far

{{< melbourne_progress >}}

## Suburb definitions

For now I'm using the Victorian government's gazetted locality
boundaries, from Vicmap Admin's `LOCALITY_POLYGON` layer, trimmed to a
bounding box around metropolitan Melbourne.
This isn't the only way to define things, but it's what I ended up on.

## How it works

Runs come off Strava as GPX files. Each trackpoint gets tested against the
suburb polygons, which is a single spatial join rather than anything clever,
and the result is the table and map above.

I originally tried to do this by matching runs onto a graph of Melbourne's
streets, which is what you'd want for the "minimise retraced streets" part of
the project. It turns out to be the wrong tool for *this* question. Suburbs
are big simple polygons, so the GPS noise that makes graph matching fiddly —
a point landing on the wrong side of a road, a tunnel, a bridge over a river —
doesn't matter at all when the thing you're asking is "which 2-kilometre-wide
shape is this point in". Point-in-polygon is both simpler and more robust
here. The street graph is still there; I may use it for some route planning later.

## What's next

The interesting part is the planning problem. With 457 suburbs to go and a
fixed starting point, I'd like to be able to ask for a route of a given
distance that picks up as many new suburbs as possible without retracing
steps, and I may include some sort of public transport routing as well.

The code is all at
[github.com/swbuchanan/melbourne-run-project](https://github.com/swbuchanan/melbourne-run-project).


---
title: "Running every suburb in Melbourne"
date: 2026-11-09
description: "Current progress on running from my apartment in Southbank into every suburb of Melbourne."
---

A while ago I wrote that my [Canberra street-running project]({{< ref "/posts/running-canberra.md" >}})
was defunct and that a Melbourne version was coming.
This is that version, and this page is where I'll keep the progress.

Melbourne is far too big to run every street in, so the goal is different.
Instead I want to **run in every suburb of Melbourne at least once**, starting
from my apartment in Southbank, within about three years from August 2026.
The stretch goal is to run *from Southbank to* every suburb, rather than
driving or taking a train to the far ones and running there.

## Progress so far

{{< melbourne_progress >}}

## What counts

Two definitions do most of the work here, and both of them are arguable.

**What a suburb is.** I'm using the Victorian government's gazetted locality
boundaries, from Vicmap Admin's `LOCALITY_POLYGON` layer, trimmed to a
bounding box around metropolitan Melbourne. That box is the part I had to pick
by hand, and it's the reason the denominator is 479 rather than some official
count: there is no single agreed edge to "Melbourne". The ABS has its own
suburb boundaries which disagree in places; I went with the state's because
they're the ones the street signs follow.

**What counts as having run in one.** Any GPS point from a run falling inside
the polygon. That's the loosest possible rule, and it does mean a run that
clips the corner of a suburb for ten metres counts the same as one that goes
through the middle of it. I may tighten this later — the threshold is a
parameter, not a constant — but for now I'd rather have the simple version
working than argue with myself about it. There are also a few suburbs whose
boundary runs down the middle of a street I've run along, where which side I
was on is a question my watch cannot really answer.

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
here. The street graph is still there; it's for route planning, not progress.

## What's next

The interesting part is the planning problem. With 457 suburbs to go and a
fixed starting point, I'd like to be able to ask for a route of a given
distance that picks up as many new suburbs as possible without retracing
itself, and eventually to fold in public transport for the suburbs that are
too far to reach on foot and come back from.

The code is all at
[github.com/swbuchanan/melbourne-run-project](https://github.com/swbuchanan/melbourne-run-project).

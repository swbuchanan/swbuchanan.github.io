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

Runs are retreived from my Strava using the API, and checked against the suburb polygons.
I actually am not checking the distance within the suburb at the moment, but it's on the todo list.

## What's next

The interesting part is the planning problem. With 457 suburbs to go and a
fixed starting point, I'd like to be able to ask for a route of a given
distance that picks up as many new suburbs as possible without retracing
steps, and I may include some sort of public transport routing as well.

The code is all at
[github.com/swbuchanan/melbourne-run-project](https://github.com/swbuchanan/melbourne-run-project).


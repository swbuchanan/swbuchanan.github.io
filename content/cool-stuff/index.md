
### Network flow

I think this is the network flow but you know I'm not really sure.
It's something at least.

{{< networkflow >}}

what

### Discrete curve shortening flow

Try clicking below to add points to form a closed polygon (you have to click at least twice before anything shows up), and then click the other buttons to make it do stuff.
Once there are at least three points; the "normal vectors" at the vertices of the polygon are displayed.
Then you can click the button below to move one timestep forward to simulate the motion of the polygon under the discrete curve shortening flow.
When there are only two points remaining the flow degenerates, and when two points in the flow get two close we replace them with only one point; I guess in the mathematical case this doesn't cause any problems but there are sure to be some small numerical ones (note the discontinuous motion of the normal vectors).

You can find a much better demonstration of (a slightly different form of) curve shortening flow here https://a.carapetis.com/csf/.

Note that this is still a work in progress so there are probably some bugs.
If you find any I'd like to know.
In particular there is one where some polygons disappear almost immediately; if you draw something that isn't really small then it should be around for a few seconds at least, so just try again if it seems to mess up.

{{< thing >}}
<!--
This is just a proof of concept of something that I probably won't ever use.

 {{< phasergame >}}

hello


<h1>Interactive satellite orbit visualization in WebGL using iTowns</h1>

<p align="center">
<img src="https://github.com/itownsResearch/orbitvis/blob/master/examples/screenshots/ISSCloseUpWithTraj.jpg?raw=true" alt="Sample visualization">
</p>

<h1>Description</h1>
This little demo show the visualization of ISS. The user sees it in realtime but can also accelerate to see the future trajectory.
Trajectory is computed using fresh TLE from https://www.celestrak.com/NORAD/elements/stations.txt
with the library SGP4.
It is possible to move the camera to specific position and also to show a 24h trajectory.
Clouds are created using a globa IR image from Space Science and Engineering Center close to the time of the application launch so when accelerating the time, clouds informations is no more related to real conditions.

<h1>How to use it</h1>
Beware that the default model (ISS) is detailed and super heavy (around 40 mo!) so be patient. Let the application launch itself until you see the clouds.

Controls:
(In default mode) 
- Mouse-Left-click: Keep mousedown and move to rotate camera around the globe.
- Mouse-Left-Double-Click: Slow zoom.
- Mouse-Wheel: zoom

The menu offer different camera tracking positions:
It's buggy for now when changing options, you might have to click in the screen after a change.
- Over ISS lock the camera target to iss and position vertical. 
- Look at ISS keeps current camera position but target to ISS


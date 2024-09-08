//import * as THREE from '../../node_modules/three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// Create the scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
// Create a camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
// Create the renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Add orbit controls for interactivity
var controls = new OrbitControls(camera, renderer.domElement);
// Create the axes
var axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// Create a sine wave graph
var points = [];
for (var i = 0; i < 100; i++) {
    var x = i / 10 - 5;
    var y = Math.sin(x);
    var z = 0; // Keeping it 2D, but you can add z values for more complexity
    points.push(new THREE.Vector3(x, y, z));
}
// Create a geometry from the points
var geometry = new THREE.BufferGeometry().setFromPoints(points);
// Create a line material
var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
// Create the line from the geometry and material
var sineWave = new THREE.Line(geometry, material);
scene.add(sineWave);
// Handle window resize
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
// Animation loop
function animate() {
    requestAnimationFrame(animate);
    // Update the controls
    controls.update();
    // Render the scene
    renderer.render(scene, camera);
}
animate();

import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/*
    Three essential components: a scene, camera, and renderer.
*/

const scene = new THREE.Scene(); // Acts as a container that holds all objects, lights, etc.

// Arguments for camera are: field of view in degrees, aspect ratio of user's browser window, and last two are view frustrum or what is visible relative to camera itself.
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100); // The actual 3D shape supported by 3js
// Material is rapping paper for geometry. 3js has default materials with different properties, but there are custom shaders using WEBGL
const material = new THREE.MeshStandardMaterial( { color: 0xff6347 } ); // Standard materials need lighting to be visible.
// const material = new THREE.MeshBasicMaterial( { color: 0xFF6347, wireframe: true } );
const torus = new THREE.Mesh( geometry, material ); // The mesh is the actual combination of geometry and material.

// Actually adds the mesh
scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff, 1000, 100); // Emits light in all directions.
pointLight.position.set(20,20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(pointLight, ambientLight)
scene.add(ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight); // Add helper wireframe to see light source.
// const gridHelper = new THREE.GridHelper(200, 50); // Adds grid to help with development.
// // scene.add(lightHelper, gridHelper);

// Instantiates imported examples class that allows camera control.
// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial( { color: 0xffffff} );
    const star = new THREE.Mesh( geometry, material );

    const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100)); // code to generate stars at random coordinates.

    star.position.set(x, y, z);
    scene.add(star);
}

Array(200).fill().forEach(addStar);

const skyTexture = new THREE.TextureLoader().load('sky.jpg');
scene.background = skyTexture;

const seanTexture = new THREE.TextureLoader().load('headshot.jpg');
const sean = new THREE.Mesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshBasicMaterial({ map: seanTexture })
);

scene.add(sean);

const moonTexture = new THREE.TextureLoader().load('circuitboard.jpg');

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({ map: moonTexture })
    /* Check tutorial in README for normal mapping, which let's you layer more than one texture for uneven surfaces  */
);

scene.add(moon);
// The following notations do the same thing, matter of preference
moon.position.z = 30;
moon.position.setX(-10);

function moveCamera() {

    const t = document.body.getBoundingClientRect().top;

    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;

    sean.rotation.y += 0.01;
    sean.rotation.z += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Below is recursive function so we don't have to call the render method over and over again, similar to a game loop.
function animate() {
    requestAnimationFrame(animate); // Mechanism that tells the browser you want to perform an animation.

    torus.rotation.x += 0.01; // Rotate horizontally this amount per frame
    torus.rotation.y += 0.005; // Rotate vertically this amount per frame
    torus.rotation.z += 0.01;

    moon.rotation.x += 0.005

    // Ensures control inputs from user, such as from OrbitControls with mouse, are detected during animation.
    // controls.update();

    renderer.render(scene, camera);
}

animate();

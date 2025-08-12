import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// d 20 shape
const geometry = new THREE.IcosahedronGeometry(10);
const material = new THREE.MeshStandardMaterial({
  color: 0x0077ff
});
const d20 = new THREE.Mesh(geometry, material);

scene.add(d20);

// lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(10, 11, 10);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);


// helpers for lighting
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper);
// scene.add(gridHelper);

// controls move around the scene
const controls = new OrbitControls(camera, renderer.domElement);

// adds in specks
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  
  star.position.set(x, y, z);
  scene.add(star);

}

Array(200).fill().forEach(addStar);

// defines background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;


// cube texture example
const cubeTexture = new THREE.TextureLoader().load('cube_text.jpg');

const cube_text = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: cubeTexture })
);

cube_text.position.set(10, 10, 0);
scene.add(cube_text);



// complex texture example moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map:moonTexture,
    normalMap: normalTexture
  })
);

moon.position.z = 30; //further down to see while scrolling
moon.position.setX(-10);
scene.add(moon);



// Set initial camera position before first render
camera.position.set(20, 10, 0); // starting point
const startCameraPos = camera.position.clone(); // remember where it started

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  // rotate moon
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  // Smooth camera movement based on starting position
  camera.position.z = startCameraPos.z + t * -0.01;
  camera.position.x = startCameraPos.x + t * -0.0002;
  camera.position.y = startCameraPos.y + t * -0.0002;
}


document.body.onscroll = moveCamera;



function animate() {
  requestAnimationFrame(animate);

  // D20 rotation
  d20.rotation.x += 0.01;
  d20.rotation.y += 0.01;



  controls.update();

  renderer.render(scene, camera);
}

animate();


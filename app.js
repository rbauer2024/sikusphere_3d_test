import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

// Szene & Kamera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-2.5, 0.5, 2.5);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Licht
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

// Modellpfade und neue, enger gesetzte Positionen
const loader = new GLTFLoader();
const modelPaths = [
  { path: './models/Steuereinheit.glb', x: -0.16 },
  { path: './models/Daemmmatte.glb', x: -0.08 },
  { path: './models/Ventilatoreinheit.glb', x: 0.0 },
  { path: './models/Patrone.glb', x: 0.08 },
  { path: './models/Aussenhaube.glb', x: 0.16 }
];

// Modelle laden
modelPaths.forEach((model) => {
  loader.load(model.path, (gltf) => {
    const object = gltf.scene;
    object.position.set(model.x, 0, 0);
    object.rotation.y = 3.40; // 195° Y-Achse
    object.scale.set(0.2, 0.2, 0.2);
    scene.add(object);
  });
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Responsives Resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

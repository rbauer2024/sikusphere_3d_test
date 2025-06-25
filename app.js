import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf4f4f4);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.2, 1.8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lichtquellen
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Modellpfade und Zielpositionen
const modelData = [
  { file: 'Steuereinheit.glb', position: [-0.6, 0, 0] },
  { file: 'Daemmmatte.glb', position: [-0.3, 0, 0] },
  { file: 'Ventilatoreinheit.glb', position: [0, 0, 0] },
  { file: 'Patrone.glb', position: [0.3, 0, 0] },
  { file: 'Aussenhaube.glb', position: [0.6, 0, 0] }
];

// Modelle laden
const loader = new GLTFLoader();
modelData.forEach(({ file, position }) => {
  loader.load(`models/${file}`, (gltf) => {
    gltf.scene.position.set(...position);
    scene.add(gltf.scene);
  }, undefined, (error) => {
    console.error(`Fehler beim Laden von ${file}:`, error);
  });
});

// Render-Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

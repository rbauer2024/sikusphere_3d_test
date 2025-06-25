import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.1, 2.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Licht
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(1, 1, 2);
scene.add(directionalLight);

// Steuerung
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Modellliste mit Position und Drehung
const modelData = [
  { file: 'Steuereinheit.glb', position: [-1.2, 0, 0], rotationY: 0.25 },
  { file: 'Daemmmatte.glb', position: [-0.6, 0, 0], rotationY: 0.25 },
  { file: 'Ventilatoreinheit.glb', position: [0.0, 0, 0], rotationY: 0.25 },
  { file: 'Patrone.glb', position: [0.6, 0, 0], rotationY: 0.25 },
  { file: 'Aussenhaube.glb', position: [1.2, 0, 0], rotationY: 0.25 }
];

// Modelle laden und anordnen
const loader = new GLTFLoader();
modelData.forEach(({ file, position, rotationY }) => {
  loader.load(`models/${file}`, (gltf) => {
    const model = gltf.scene;
    model.position.set(...position);
    model.rotation.y = rotationY; // leichte Neigung
    model.scale.set(0.25, 0.25, 0.25); // gleichmäßig skalieren
    scene.add(model);
  }, undefined, (error) => {
    console.error(`Fehler beim Laden von ${file}:`, error);
  });
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Größe bei Resize anpassen
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

// Szene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2f2f2); // hellgrauer Hintergrund

// Kamera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 4); // etwas zurück und leicht erhöht

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Licht
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
scene.add(dirLight);

// Modelle
const loader = new GLTFLoader();
const models = [
  { file: 'Steuereinheit.glb', x: -1.5 },
  { file: 'Daemmmatte.glb', x: -0.9 },
  { file: 'Ventilatoreinheit.glb', x: -0.3 },
  { file: 'Patrone.glb', x: 0.9 },
  { file: 'Aussenhaube.glb', x: 1.5 }
];

models.forEach(({ file, x }) => {
  loader.load(`./${file}`, (gltf) => {
    const model = gltf.scene;
    model.position.set(x, 0, 0);
    scene.add(model);
  }, undefined, (error) => {
    console.error(`Fehler beim Laden von ${file}:`, error);
  });
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

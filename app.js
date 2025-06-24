import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

// Szene, Kamera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 1000);
camera.position.set(0, 0.2, 2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Licht
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(1, 1, 1);
scene.add(ambientLight, directionalLight);

// Modelle und Positionen
const parts = [
  { file: 'Steuereinheit.glb', title: 'INNENHAUBE', x: -1.25 },
  { file: 'Daemmmatte.glb', title: 'SCHALLSCHUTZ', x: -0.75 },
  { file: 'Ventilatoreinheit.glb', title: 'VENTILATOR MIT STRÖMUNGSRICHTER', x: -0.25 },
  { file: 'Filterhalterung.glb', title: 'FILTERHALTERUNG', x: 0.25 },
  { file: 'Patrone.glb', title: 'WÄRMETAUSCHER', x: 0.75 },
  { file: 'Aussenhaube.glb', title: 'AUSSENHAUBE', x: 1.25 }
];

const loader = new GLTFLoader();
parts.forEach((part, index) => {
  loader.load(part.file, (gltf) => {
    const model = gltf.scene;
    model.position.set(part.x, 0, 0);
    model.rotation.y = Math.PI / 10; // leicht geneigt
    scene.add(model);
  }, undefined, (error) => {
    console.error(`Fehler beim Laden von ${part.file}:`, error);
  });
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

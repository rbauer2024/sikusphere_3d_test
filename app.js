import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7f7f7); // heller Hintergrund

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-2, 0.8, 2.5); // neue Kameraposition (leicht links oben vorne)
camera.lookAt(0, 0.3, 0); // Blick auf das Zentrum

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Licht
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

// Controls (nur zur Vorschau)
const controls = new OrbitControls(camera, renderer.domElement);

// Modelle laden
const loader = new GLTFLoader();
const modelFiles = [
  'models/Aussenhaube.glb',
  'models/Patrone.glb',
  'models/Ventilatoreinheit.glb',
  'models/Daemmmatte.glb',
  'models/Steuereinheit.glb',
];

const spacing = 0.01; // ~1 cm Abstand
let startX = 0;

modelFiles.forEach((path, index) => {
  loader.load(path, (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2); // Einheitliche Skalierung

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    model.position.x = startX;
    startX += spacing; // Abstand auf X-Achse erhöhen

    scene.add(model);
  }, undefined, (error) => {
    console.error(`Fehler beim Laden von ${path}:`, error);
  });
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Bei Größenänderung
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

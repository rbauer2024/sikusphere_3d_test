import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7f7f7);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-2, 0.8, 2.5);
camera.lookAt(0, 0.3, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Licht
const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();
const modelFiles = [
  'models/Steuereinheit.glb',      // jetzt links
  'models/Daemmmatte.glb',
  'models/Ventilatoreinheit.glb',
  'models/Patrone.glb',
  'models/Aussenhaube.glb'         // jetzt rechts
];

const spacing = 0.05; // größerer Abstand = bessere Sichtbarkeit
let startX = 0;

modelFiles.forEach((path, index) => {
  loader.load(path, (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.3, 0.3, 0.3); // etwas größer für mehr Klarheit

    // Spiegeln um Y-Achse (180° Drehung)
    model.rotation.y = Math.PI;

    model.position.x = startX;
    startX += spacing;

    scene.add(model);
  }, undefined, (error) => {
    console.error(`Fehler beim Laden von ${path}:`, error);
  });
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

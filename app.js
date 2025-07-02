import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2f2f2); // hellgrau statt weiß

// Kamera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-3.5, 1.5, 3.5); // leicht schräg von oben links
camera.lookAt(0, 1.2, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

// Licht
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // vorher 1.2
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4); // vorher 0.5
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Abstand & Skalierung
const positions = [-0.24, -0.12, 0, 0.12, 0.24]; // 5 Teile
const scaleFactor = 0.2;

// Dateinamen in Lade-Reihenfolge (von innen nach außen)
const files = [
  'Steuereinheit.glb',
  'Daemmmatte.glb',
  'Ventilatoreinheit.glb',
  'Patrone.glb',
  'Aussenhaube.glb'
];

// Modelle laden
const loader = new GLTFLoader();
files.forEach((file, index) => {
  loader.load(`./models/${file}`, (gltf) => {
    const model = gltf.scene;
    model.scale.set(scaleFactor, scaleFactor, scaleFactor);
    model.rotation.y = Math.PI; // 180°
    model.position.x = positions[index];
    scene.add(model);
  });
});

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render-Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

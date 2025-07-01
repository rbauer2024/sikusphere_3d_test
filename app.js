import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

// Szene erstellen
const scene = new THREE.Scene();

// Kamera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-18, 4, 0.5); // Feinausrichtung – frontal mit leichtem Winkel
camera.lookAt(0, 1.2, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000); // Schwarzer Hintergrund
document.body.appendChild(renderer.domElement);

// Lichtquellen
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 10, 5); // von schräg oben
scene.add(directionalLight);

// Optional: zusätzliches Licht direkt auf die Steuereinheit
const pointLight = new THREE.PointLight(0xffffff, 0.7);
pointLight.position.set(-22, 4, 0.5); // seitlich links von der Kamera
scene.add(pointLight);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2;

// GLTF laden
const loader = new GLTFLoader();
loader.load(
  './models/SikuSphere3D_neu.glb',
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(1.5, 1.5, 1.5);
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error('Fehler beim Laden der GLB-Datei:', error);
  }
);

// Animation
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Responsives Verhalten
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
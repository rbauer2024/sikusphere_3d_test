import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

// Szene, Kamera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, 0.15, 1.5); // Angepasste Kameraposition

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lichtquelle
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// GLB-Modell laden
const loader = new GLTFLoader();
loader.load('./Steuereinheit.glb', (gltf) => {
  gltf.scene.scale.set(5, 5, 5); // Modell vergrößern
  scene.add(gltf.scene);

  // Modellgröße & Zentrum debuggen
  const box = new THREE.Box3().setFromObject(gltf.scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  console.log("Modellgröße:", size);
  console.log("Modellzentrum:", center);

  // Kamera auf Zentrum ausrichten
  camera.lookAt(center);
}, undefined, (error) => {
  console.error('Fehler beim Laden des Modells:', error);
});

// Responsive Renderer
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
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
  const model = gltf.scene;

  // Modell skalieren
  model.scale.set(5, 5, 5);

  // Modellgröße und Zentrum berechnen
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Modell zentrieren
  model.position.sub(center); // Modell zum Ursprung verschieben
  scene.add(model);

  // Kamera-Distanz berechnen basierend auf Modellgröße
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180); // in Radian
  let cameraZ = maxDim / (2 * Math.tan(fov / 2));
  cameraZ *= 1.5; // etwas Abstand zur Sicherheit

  camera.position.set(0, 0, cameraZ);
  camera.lookAt(0, 0, 0);

  console.log("Modellgröße:", size);
  console.log("Modellzentrum:", center);
  console.log("Kamera-Z:", cameraZ);
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
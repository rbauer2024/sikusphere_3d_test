import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.148.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.148.0/examples/jsm/loaders/GLTFLoader.js';

// Szene, Kamera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lichtquellen
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // gleichmäßiges Licht
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // gerichtetes Licht
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

// Modell laden
const loader = new GLTFLoader();
loader.load('./Steuereinheit.glb', (gltf) => {
  const model = gltf.scene;
  model.position.set(0, 0, 0);
  model.scale.set(1, 1, 1);
  model.rotation.set(0, 0, 0);
  scene.add(model);

  // Bounding-Box ermitteln
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  console.log('Modellgröße:', size);
  console.log('Modellzentrum:', center);

  // Kamera an Modellgröße anpassen
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  const cameraZ = maxDim / (2 * Math.tan(fov / 2));
  camera.position.set(center.x, center.y, cameraZ * 1.5);
  camera.lookAt(center);

}, undefined, (error) => {
  console.error('Fehler beim Laden des Modells:', error);
});

// Render-Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

// Szene, Kamera, Renderer
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0.4, 2.5);
camera.lookAt(new THREE.Vector3(0, 0.2, 0));

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xf0f0f0); // heller Hintergrund
document.body.appendChild(renderer.domElement);

// Licht
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
hemiLight.position.set(0, 1, 0);
scene.add(hemiLight);

// Modell-Dateien und Positionen für Explosionsansicht
const models = [
  { file: 'Steuereinheit.glb', position: [-0.6, 0, 0], name: 'Steuereinheit' },
  { file: 'Daemmmatte.glb', position: [-0.36, 0, 0], name: 'Daemmmatte' },
  { file: 'Ventilatoreinheit.glb', position: [-0.12, 0, 0], name: 'Ventilatoreinheit' },
  { file: 'Filterhalterung.glb', position: [0.12, 0, 0], name: 'Filterhalterung' },
  { file: 'Patrone.glb', position: [0.36, 0, 0], name: 'Patrone' },
  { file: 'Aussenhaube.glb', position: [0.6, 0, 0], name: 'Aussenhaube' }
];

// Modelle laden
const loader = new GLTFLoader();
models.forEach(({ file, position, name }) => {
  loader.load(
    file,
    (gltf) => {
      const model = gltf.scene;
      model.position.set(...position);
      scene.add(model);
      console.log(`✅ Modell geladen: ${name}`);
    },
    undefined,
    (error) => {
      console.error(`❌ Fehler beim Laden von ${file}:`, error);
    }
  );
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Responsives Verhalten
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

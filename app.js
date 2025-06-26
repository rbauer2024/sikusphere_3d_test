import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

const scene = new THREE.Scene();

// Kamera aus Referenz: leicht links und schräg zur Explosionsreihe
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-1.2, 0.3, 1.5); // seitlich versetzt und leicht erhöht
camera.lookAt(0, 0.2, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Licht
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

// Orbit Controls (optional, kann deaktiviert werden)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Modellnamen und Positionen
const models = [
  { file: 'Aussenhaube.glb', positionX: -0.24 },
  { file: 'Patrone.glb', positionX: -0.12 },
  { file: 'Ventilatoreinheit.glb', positionX: 0.0 },
  { file: 'Daemmmatte.glb', positionX: 0.12 },
  { file: 'Steuereinheit.glb', positionX: 0.24 },
];

const loader = new GLTFLoader();

models.forEach(({ file, positionX }) => {
  loader.load(`models/${file}`, (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.rotation.y = -Math.PI / 12; // ≈ -15°
    model.position.set(positionX, 0, 0);
    scene.add(model);
  }, undefined, (error) => {
    console.error(`Fehler beim Laden von ${file}:`, error);
  });
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

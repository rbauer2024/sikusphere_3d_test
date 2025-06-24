import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Licht
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Steuerung
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Dateien in Reihenfolge der Explosionsansicht
const models = [
  { file: 'Steuereinheit.glb', offsetX: -1.6 },
  { file: 'Daemmmatte.glb', offsetX: -0.9 },
  { file: 'Ventilatoreinheit.glb', offsetX: -0.2 },
  { file: 'Patrone.glb', offsetX: 0.5 },
  { file: 'Aussenhaube.glb', offsetX: 1.2 }
];

const loader = new GLTFLoader();

models.forEach(({ file, offsetX }) => {
  loader.load(`models/${file}`, gltf => {
    const model = gltf.scene;
    model.scale.set(0.8, 0.8, 0.8);

    // Zentrum berechnen und Modell darauf zentrieren
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);
    model.position.sub(center);

    // Position im Raum setzen
    model.position.x += offsetX;

    scene.add(model);
  });
});

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

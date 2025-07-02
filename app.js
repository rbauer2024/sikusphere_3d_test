
import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

// Szene erstellen
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf4f4f4);

// Kamera konfigurieren (angepasst)
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-2.8, 1.0, 2.6);
camera.lookAt(0, 1.0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lichtquellen
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Modellpfade
const models = [
  { path: 'models/Steuereinheit.glb', positionX: -0.24 },
  { path: 'models/Daemmmatte.glb', positionX: -0.12 },
  { path: 'models/Ventilatoreinheit.glb', positionX: 0 },
  { path: 'models/Patrone.glb', positionX: 0.12 },
  { path: 'models/Aussenhaube.glb', positionX: 0.24 }
];

// Loader und Modellplatzierung
const loader = new GLTFLoader();
const modelScale = 0.25;

models.forEach((model) => {
  loader.load(model.path, (gltf) => {
    const object = gltf.scene;
    object.scale.set(modelScale, modelScale, modelScale);
    object.rotation.y = Math.PI; // 180°
    object.position.x = model.positionX;
    scene.add(object);
  });
});

// Responsive Anpassung
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

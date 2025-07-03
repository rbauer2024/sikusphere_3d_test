import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

// Szene, Kamera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2f2f2);

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-3.5, 1.5, 3.5);
camera.lookAt(0, 1.2, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

// Licht
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Container-Gruppe für Explosion
const modelGroup = new THREE.Group();
scene.add(modelGroup);

// Modelle laden
const loader = new GLTFLoader();

const modelFiles = [
  'models/Steuereinheit.glb',
  'models/Daemmmatte.glb',
  'models/Ventilatoreinheit.glb',
  'models/Patrone.glb',
  'models/Aussenhaube.glb'
];

const initialSpacing = 0; // Anfangsposition: zusammen
const targetSpacing = 0.12; // Endposition: auseinander
const scale = 0.2;

function loadModel(file, index) {
  loader.load(file, (gltf) => {
    const model = gltf.scene;
    model.scale.set(scale, scale, scale);
    model.rotation.y = Math.PI; // 180°
    model.position.set(0, 0, 0); // geschlossen
    modelGroup.add(model);
  });
}

modelFiles.forEach((file, i) => {
  loadModel(file, i);
});

// Animation starten (Explosion nach 3 Sekunden)
setTimeout(() => {
  modelGroup.children.forEach((model, i) => {
    gsap.to(model.position, {
      x: i * targetSpacing,
      duration: 1.5,
      ease: 'power2.out'
    });
  });
}, 3000);

// Rendering
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

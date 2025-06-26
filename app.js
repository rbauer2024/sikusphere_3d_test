import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-2.5, 0.5, 2.5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);           // Detailverbesserung
renderer.outputEncoding = THREE.sRGBEncoding;              // Farbkorrektur
document.body.appendChild(renderer.domElement);

// Licht
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

// Abstand 30 % kleiner als zuvor
const loader = new GLTFLoader();
const positions = [-0.067, -0.034, 0, 0.034, 0.067];
const modelPaths = [
  './models/Steuereinheit.glb',
  './models/Daemmmatte.glb',
  './models/Ventilatoreinheit.glb',
  './models/Patrone.glb',
  './models/Aussenhaube.glb'
];

modelPaths.forEach((path, i) => {
  loader.load(path, (gltf) => {
    const model = gltf.scene;
    model.position.set(positions[i], 0, 0);
    model.rotation.y = 3.40; // 195°
    model.scale.set(0.2, 0.2, 0.2);
    scene.add(model);
  });
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

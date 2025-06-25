import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Licht
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Modelle & Pfade
const modelInfos = [
  { file: 'models/Steuereinheit.glb' },
  { file: 'models/Daemmmatte.glb' },
  { file: 'models/Ventilatoreinheit.glb' },
  { file: 'models/Patrone.glb' },
  { file: 'models/Aussenhaube.glb' },
];

const loader = new GLTFLoader();
const group = new THREE.Group();
scene.add(group);

// Modelle laden
modelInfos.forEach((info, i) => {
  loader.load(info.file, gltf => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(i * 2, 0, 0); // kleinerer Abstand
    model.rotation.y = Math.PI / 2 + Math.PI; // 180° + 90°
    group.add(model);
  });
});

// Gesamte Gruppe leicht drehen
group.rotation.y = THREE.MathUtils.degToRad(-15);

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

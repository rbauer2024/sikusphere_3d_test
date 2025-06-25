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
camera.position.set(0, 1, 8); // näher ran

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Modelle mit spezifischem Offset & Rotation
const modelInfos = [
  { file: 'models/Steuereinheit.glb',   offset: 0,    rotationY: Math.PI / 2 },
  { file: 'models/Daemmmatte.glb',      offset: 1.1,  rotationY: Math.PI },
  { file: 'models/Ventilatoreinheit.glb', offset: 2.2,  rotationY: Math.PI },
  { file: 'models/Patrone.glb',         offset: 3.3,  rotationY: Math.PI },
  { file: 'models/Aussenhaube.glb',     offset: 4.4,  rotationY: Math.PI },
];

const loader = new GLTFLoader();
const group = new THREE.Group();
scene.add(group);

// Modelle laden
modelInfos.forEach((info, i) => {
  loader.load(info.file, gltf => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(info.offset, 0, 0);
    model.rotation.y = info.rotationY;
    group.add(model);
  });
});

// Gesamte Gruppe etwas drehen
group.rotation.y = THREE.MathUtils.degToRad(-15);

// Fenstergrößen-Anpassung
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

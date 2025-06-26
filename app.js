import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf3f3f3);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 2.2, 3.2);
camera.lookAt(0.4, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

const loader = new GLTFLoader();
const fileNames = [
  'Aussenhaube.glb',
  'Patrone.glb',
  'Ventilatoreinheit.glb',
  'Daemmmatte.glb',
  'Steuereinheit.glb'
];

const spacing = 0.005; // 0.5 cm Abstand
const scale = 0.2;

fileNames.forEach((file, index) => {
  loader.load(`models/${file}`, (gltf) => {
    const model = gltf.scene;
    model.scale.set(scale, scale, scale);
    model.rotation.y = -Math.PI / 12; // -15 Grad um Y-Achse
    model.position.x = index * (scale + spacing);
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

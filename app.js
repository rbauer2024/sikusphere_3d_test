import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0.15, 2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(1, 1, 2);
scene.add(light1);

const light2 = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(light2);

const loader = new GLTFLoader();

const modelPaths = [
  { path: 'Steuereinheit.glb', offset: -0.8 },
  { path: 'Daemmmatte.glb', offset: -0.4 },
  { path: 'Ventilatoreinheit.glb', offset: 0.0 },
  { path: 'Patrone.glb', offset: 0.4 },
  { path: 'Aussenhaube.glb', offset: 0.8 }
];

modelPaths.forEach(({ path, offset }) => {
  loader.load(path, gltf => {
    const model = gltf.scene;
    model.rotation.y = Math.PI; // zeigt nach vorne
    model.position.set(offset, 0, 0);
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

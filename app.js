import * as THREE from 'https://cdn.skypack.dev/three@0.148.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.148.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Licht
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

// Kamera Position
camera.position.set(0, 1, 5);

// 3D-Modell laden (z. B. Patrone.glb muss im gleichen Ordner liegen)
const loader = new GLTFLoader();
loader.load('./Patrone.glb', (gltf) => {
  scene.add(gltf.scene);
}, undefined, (error) => {
  console.error('Fehler beim Laden:', error);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

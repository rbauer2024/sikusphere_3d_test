import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let scene, camera, renderer;
let models = [];
const fileNames = [
  'Aussenhaube.glb',
  'Patrone.glb',
  'Ventilatoreinheit.glb',
  'Daemmmatte.glb',
  'Steuereinheit.glb'
];

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf2f2f2);

  // Kamera links außen, 20° nach rechts geneigt
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-1.5, 0.5, 2.5);
  camera.lookAt(0, 0, 0);

  // Licht
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(2, 2, 2);
  scene.add(directionalLight);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // GLB-Modelle laden
  const loader = new GLTFLoader();
  let startX = 2.0; // ganz rechts außen
  const spacing = 0.01; // 1 cm Abstand

  fileNames.forEach((file, index) => {
    loader.load(`./models/${file}`, (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.2, 0.2, 0.2);
      model.position.set(startX - index * (spacing + 0.3), 0, 0); // Abstand & Reihenfolge
      model.rotation.y = -Math.PI / 9; // ca. 20° Drehung nach links
      scene.add(model);
      models.push(model);
    });
  });

  // Resizing
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

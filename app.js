import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let camera, scene, renderer;
let group;

init();
animate();

function init() {
  const container = document.createElement('div');
  document.body.appendChild(container);

  // Kamera – Position links außen, leicht schräg
  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-6, 1.5, 3.5);
  camera.lookAt(0, 1.2, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Licht
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // Gruppe für die Einzelteile
  group = new THREE.Group();
  group.rotation.y = Math.PI; // 180° Drehung
  scene.add(group);

  // Bauteile laden
  const loader = new GLTFLoader();

  const parts = [
    { file: 'models/Aussenhaube.glb', position: [4.0, 1.2, 0] },
    { file: 'models/Patrone.glb', position: [3.0, 1.2, 0] },
    { file: 'models/Ventilatoreinheit.glb', position: [2.0, 1.2, 0] },
    { file: 'models/Daemmmatte.glb', position: [1.0, 1.2, 0] },
    { file: 'models/Steuereinheit.glb', position: [0.0, 1.2, 0] },
  ];

  parts.forEach(part => {
    loader.load(part.file, gltf => {
      const model = gltf.scene;
      model.position.set(...part.position);
      group.add(model);
    });
  });

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);
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

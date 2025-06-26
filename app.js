// app.js – Darstellung der SIKU Sphere in sauberer Explosionsansicht

import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let camera, scene, renderer;
const components = [
  { file: 'Steuereinheit.glb', position: [-2.5, 0, 0], name: 'INNENHAUBE' },
  { file: 'Daemmmatte.glb',    position: [-1.25, 0, 0], name: 'SCHALLSCHUTZ' },
  { file: 'Ventilatoreinheit.glb', position: [0, 0, 0], name: 'VENTILATOR' },
  { file: 'Patrone.glb',       position: [1.25, 0, 0], name: 'WÄRMETAUSCHER' },
  { file: 'Aussenhaube.glb',   position: [2.5, 0, 0], name: 'AUSSENHAUBE' },
];

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8f8f8);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-5, 2, 5);
  camera.lookAt(0, 0, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 10);
  scene.add(dirLight);

  const loader = new GLTFLoader();
  const scale = 0.2;
  const rotationY = -Math.PI / 12; // ca. -15°

  components.forEach(({ file, position }) => {
    loader.load(`models/${file}`, (gltf) => {
      const model = gltf.scene;
      model.scale.set(scale, scale, scale);
      model.rotation.y = rotationY;
      model.position.set(...position);
      scene.add(model);
    });
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

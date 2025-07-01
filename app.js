// app.js

import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';
import gsap from 'https://cdn.skypack.dev/gsap';

let scene, camera, renderer, controls;
let parts = [];
let originalPositions = [];

init();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(-18, 4, 2);
  camera.lookAt(0, 1.2, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableRotate = false;

  const light = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(light);

  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(5, 10, 5);
  scene.add(directional);

  loadModels();
  animate();

  renderer.domElement.addEventListener('mouseenter', explode);
  renderer.domElement.addEventListener('mouseleave', implode);
}

function loadModels() {
  const loader = new GLTFLoader();
  const files = [
    { file: 'Aussenhaube.glb', offset: -2.0 },
    { file: 'Patrone.glb', offset: -1.0 },
    { file: 'Ventilatoreinheit.glb', offset: 0.0 },
    { file: 'Daemmmatte.glb', offset: 1.0 },
    { file: 'Steuereinheit.glb', offset: 2.0 }
  ];

  files.forEach(({ file, offset }, index) => {
    loader.load(`models/${file}`, (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.2, 0.2, 0.2);
      model.rotation.y = Math.PI; // 180 Grad
      model.position.x = offset;

      scene.add(model);
      parts[index] = model;
      originalPositions[index] = model.position.clone();
    });
  });
}

function explode() {
  parts.forEach((part, i) => {
    const direction = i - 2; // 0 = center
    gsap.to(part.position, { x: originalPositions[i].x + direction * 0.4, duration: 0.5 });
  });
}

function implode() {
  parts.forEach((part, i) => {
    gsap.to(part.position, { x: originalPositions[i].x, duration: 0.5 });
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

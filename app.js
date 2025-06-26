// app.js (3D Szene mit korrekter Ausrichtung und Kamera)

import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let scene, camera, renderer;

init();

function init() {
  scene = new THREE.Scene();

  // Kamera von links vorne mit 15°-20° Winkel
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-2.5, 1.5, 3); // Links, leicht oben, nach rechts blickend
  camera.lookAt(0, 0.5, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  loadModel('models/Aussenhaube.glb',   0.4);
  loadModel('models/Patrone.glb',       0.3);
  loadModel('models/Ventilatoreinheit.glb', 0.2);
  loadModel('models/Daemmmatte.glb',    0.1);
  loadModel('models/Steuereinheit.glb', 0.0);

  animate();
}

function loadModel(path, xOffset) {
  const loader = new GLTFLoader();
  loader.load(path, function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.rotation.y = -Math.PI / 12; // -15 Grad
    model.position.x = xOffset;
    scene.add(model);
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

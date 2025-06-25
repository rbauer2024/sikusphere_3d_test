import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

let scene, camera, renderer, controls;

init();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0); // Hellgrauer Hintergrund

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1, 5); // Kamera leicht schräg von vorne
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // OrbitControls aktivieren
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Licht hinzufügen
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Modelle laden
  const loader = new GLTFLoader();

  const modelInfos = [
    { file: 'models/Steuereinheit.glb', x: -2 },
    { file: 'models/Daemmmatte.glb', x: -1 },
    { file: 'models/Ventilatoreinheit.glb', x: 0 },
    { file: 'models/Patrone.glb', x: 1 },
    { file: 'models/Aussenhaube.glb', x: 2 },
  ];

  modelInfos.forEach(info => {
    loader.load(info.file, gltf => {
      const model = gltf.scene;
      model.position.set(info.x, 0, 0);
      model.rotation.y = Math.PI / 2; // ⬅️ um 90° horizontal nach links drehen
      scene.add(model);
    }, undefined, error => {
      console.error('Fehler beim Laden von', info.file, error);
    });
  });

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let camera, scene, renderer;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Kamera etwas näher, zentraler
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-2.5, 1.4, 2.2); // leicht links + etwas höher + näher dran
  camera.lookAt(0, 1.2, 0);           // Fokus zentral auf Modellhöhe

  // Licht
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  // Renderer mit hoher Qualität
  renderer = new THREE.WebGLRenderer({ antialias: true, precision: 'highp' });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  // Modelle laden
  const loader = new GLTFLoader();
  const modelScale = 0.24;
  const spacing = 0.12; // gleichmäßiger Abstand zwischen Komponenten

  const parts = [
    { file: 'Steuereinheit.glb', x: 0 },
    { file: 'Daemmmatte.glb', x: spacing * 1 },
    { file: 'Ventilatoreinheit.glb', x: spacing * 2 },
    { file: 'Patrone.glb', x: spacing * 3 },
    { file: 'Aussenhaube.glb', x: spacing * 4 }
  ];

  parts.forEach((part) => {
    loader.load(`models/${part.file}`, (gltf) => {
      const model = gltf.scene;
      model.scale.set(modelScale, modelScale, modelScale);
      model.position.set(part.x, 0, 0);
      model.rotation.y = Math.PI; // 180°-Drehung für richtige Reihenfolge
      scene.add(model);
    });
  });

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

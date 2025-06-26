import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

let scene, camera, renderer, controls;

init();
loadModels();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5); // leichtes Grau

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 2.5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Licht
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(3, 2, 5);
  scene.add(directionalLight);

  // Steuerung
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  window.addEventListener('resize', onWindowResize, false);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function loadModels() {
  const modelConfigs = [
    { file: 'Steuereinheit.glb',     name: 'INNENHAUBE',     positionX: -0.30 },
    { file: 'Daemmmatte.glb',        name: 'SCHALLSCHUTZ',   positionX: -0.15 },
    { file: 'Ventilatoreinheit.glb', name: 'VENTILATOR',     positionX:  0.00 },
    { file: 'Patrone.glb',           name: 'WÄRMETAUSCHER',  positionX:  0.15 },
    { file: 'Aussenhaube.glb',       name: 'AUSSENHAUBE',    positionX:  0.30 }
  ];

  const loader = new GLTFLoader();

  modelConfigs.forEach(config => {
    loader.load(`models/${config.file}`, gltf => {
      const model = gltf.scene;
      model.scale.set(0.2, 0.2, 0.2);
      model.rotation.y = -Math.PI / 12; // -15 Grad
      model.position.set(config.positionX, 0, 0);
      scene.add(model);
    });
  });
}

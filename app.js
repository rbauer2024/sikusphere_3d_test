import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

let scene, camera, renderer;

init();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0); // hellgrauer Hintergrund

  // Kamera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.5, 6);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Licht
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // Orbit Controls (Maussteuerung)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 10;

  // Modelle laden
  loadModels();

  // Re-Render bei Fenstergröße ändern
  window.addEventListener('resize', onWindowResize, false);

  animate();
}

function loadModels() {
  const loader = new GLTFLoader();

  const fileNames = [
    'Steuereinheit.glb',
    'Daemmmatte.glb',
    'Ventilatoreinheit.glb',
    'Patrone.glb',
    'Aussenhaube.glb'
  ];

  const spacing = 2.3;
  const startX = -spacing * 2;

  fileNames.forEach((file, i) => {
    loader.load(`/models/${file}`, (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.2, 0.2, 0.2);
      model.position.set(startX + i * spacing, 0, 0);
      model.rotation.set(-Math.PI / 12, -Math.PI / 2, 0); // -15° X, -90° Y
      scene.add(model);
    });
  });
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

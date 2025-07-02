import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let camera, scene, renderer;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4f4f4); // leichtes Grau statt Weiß

  // Kamera etwas weiter zurück und mittiger
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-3.2, 1.2, 3.2);
  camera.lookAt(0, 1.2, 0);

  // Lichtquellen mit besserem Kontrast
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // reduziert
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // stärker für Kontrast
  directionalLight.position.set(5, 10, 7);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Renderer hochqualitativ
  renderer = new THREE.WebGLRenderer({ antialias: true, precision: 'highp' });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Modelle laden
  const loader = new GLTFLoader();
  const modelScale = 0.22;
  const spacing = 0.12;

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
      model.rotation.y = Math.PI;
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

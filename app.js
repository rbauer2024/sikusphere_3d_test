import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let scene, camera, renderer;
const componentFiles = [
  'Aussenhaube.glb',
  'Patrone.glb',
  'Ventilatoreinheit.glb',
  'Daemmmatte.glb',
  'Steuereinheit.glb'
];

init();
loadComponents();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);

  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(2.5, 1.5, 3);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  window.addEventListener('resize', onWindowResize, false);
  animate();
}

function loadComponents() {
  const loader = new GLTFLoader();
  let offsetX = 0;
  const spacing = 0.01; // 1 cm

  componentFiles.forEach((file, index) => {
    loader.load(
      `models/${file}`,
      (gltf) => {
        const model = gltf.scene;

        // Einheitlich skalieren
        model.scale.set(0.2, 0.2, 0.2);

        // Gesamten Block leicht rotieren
        model.rotation.y = -Math.PI / 12; // ca. -15 Grad

        // Abstand zwischen den Komponenten
        model.position.set(offsetX, 0, 0);
        scene.add(model);

        // Modellbreite (Zylinder) grob geschätzt: 0.2–0.4 → addiere ~0.22 plus spacing
        offsetX += 0.22 + spacing;
      },
      undefined,
      (error) => {
        console.error(`Fehler beim Laden von ${file}:`, error);
      }
    );
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

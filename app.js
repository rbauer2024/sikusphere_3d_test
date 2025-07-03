import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let scene, camera, renderer;
const models = [];
const modelFiles = [
  'Steuereinheit.glb',
  'Daemmmatte.glb',
  'Ventilatoreinheit.glb',
  'Patrone.glb',
  'Aussenhaube.glb'
];

// Kamera- und Lichtsetup
function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf2f2f2);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-3.5, 1.5, 3.5);
  camera.lookAt(0, 1.2, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 10, 10);

  scene.add(ambientLight);
  scene.add(directionalLight);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.body.appendChild(renderer.domElement);

  loadModels();
  animate();
}

// Modelle laden mit Startposition (geschlossen, y = 0)
function loadModels() {
  const loader = new GLTFLoader();
  const initialSpacing = 0.0;   // Start: alle Modelle nebeneinander, fast ohne Abstand
  const yOffset = 0;            // Gleiche Höhe für alle
  const modelScale = 0.2;

  modelFiles.forEach((file, index) => {
    loader.load(`models/${file}`, gltf => {
      const model = gltf.scene;
      model.scale.set(modelScale, modelScale, modelScale);
      model.rotation.y = Math.PI;
      model.position.set(index * initialSpacing, yOffset, 0);

      scene.add(model);
      models.push(model);
    });
  });

  // Start der Animation nach 3 Sekunden
  setTimeout(triggerExplosion, 3000);
}

// Animation: Modelle auf X-Achse auseinanderziehen
function triggerExplosion() {
  const finalSpacing = 0.12; // Zielabstand
  models.forEach((model, index) => {
    gsap.to(model.position, {
      x: index * finalSpacing,
      duration: 2,
      ease: 'power2.out'
    });
  });
}

// Standard Render-Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Start
initScene();

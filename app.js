import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

let camera, scene, renderer, controls;

init();
animate();

function init() {
  // Szene erstellen
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Kamera
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
 camera.position.set(-4.2, 1.0, 2.0); // leicht links, etwas über Boden
	camera.lookAt(0, 0.1, 0);            // ins Zentrum, leicht nach oben

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Licht
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.minPolarAngle = Math.PI / 3; // etwas nach unten
  controls.maxPolarAngle = Math.PI / 2;

  // Komponenten laden
  const models = [
    { file: 'models/Steuereinheit.glb', position: [-1.2, 0, 0] },
    { file: 'models/Daemmmatte.glb',    position: [-0.6, 0, 0] },
    { file: 'models/Ventilatoreinheit.glb', position: [0.0, 0, 0] },
    { file: 'models/Patrone.glb',       position: [0.6, 0, 0] },
    { file: 'models/Aussenhaube.glb',   position: [1.2, 0, 0] }
  ];

  const loader = new GLTFLoader();

  models.forEach(model => {
    loader.load(model.file, gltf => {
      const obj = gltf.scene;
      obj.scale.set(0.2, 0.2, 0.2);
      obj.position.set(...model.position);
      obj.rotation.y = THREE.MathUtils.degToRad(-15); // leichter seitlicher Winkel
      scene.add(obj);
    });
  });

  // Fenstergrößen-Anpassung
  window.addEventListener('resize', onWindowResize);
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

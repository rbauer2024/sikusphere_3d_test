import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

let camera, scene, renderer, controls;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Licht
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(2, 2, 5);
  scene.add(directionalLight);

  // Kamera – von außen (rechts) auf das Modell blickend
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-4.2, 1.0, 2.0); // seitlich links, leicht erhöht
  camera.lookAt(0, 0.2, 0);            // leicht über Zentrum

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // OrbitControls (falls nötig)
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0.2, 0);
  controls.update();

  // Loader & Positionierung
  const loader = new GLTFLoader();

  // 1. Innenhaube (ganz links)
  loader.load('./models/Steuereinheit.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(-3.0, 0, 0);
    scene.add(model);
  });

  // 2. Schallschutzmatte
  loader.load('./models/Daemmmatte.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(-2.5, 0, 0);
    scene.add(model);
  });

  // 3. Ventilatoreinheit
  loader.load('./models/Ventilatoreinheit.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(-2.0, 0, 0);
    scene.add(model);
  });

  // 4. Wärmetauscher
  loader.load('./models/Patrone.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(-1.5, 0, 0);
    scene.add(model);
  });

  // 5. Filterhalterung
  loader.load('./models/Filterhalterung.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(-1.0, 0, 0);
    scene.add(model);
  });

  // 6. Außenhaube (ganz rechts, vor Kamera)
  loader.load('./models/Aussenhaube.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(-0.5, 0, 0);
    scene.add(model);
  });

  // Fenster-Resize
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

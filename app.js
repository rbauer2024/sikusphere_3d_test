import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let scene, camera, renderer;

init();
animate();

function init() {
  scene = new THREE.Scene();

  // Kamera optimiert
  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-12, 4, 2);
  camera.lookAt(0, 1.2, 0);

  // Renderer mit besserem Encoding
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  document.body.appendChild(renderer.domElement);

  // Lichtquellen für Details
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);

  // Positionen der Bauteile (leicht auseinandergezogen, Explosionsdarstellung)
  const componentData = [
    { file: 'models/Steuereinheit.glb', position: [-4, 0, 0] },
    { file: 'models/Daemmmatte.glb', position: [-2, 0, 0] },
    { file: 'models/Ventilatoreinheit.glb', position: [0, 0, 0] },
    { file: 'models/Patrone.glb', position: [2, 0, 0] },
    { file: 'models/Aussenhaube.glb', position: [4, 0, 0] },
  ];

  // Laden der Bauteile
  const loader = new GLTFLoader();
  componentData.forEach((comp) => {
    loader.load(comp.file, function (gltf) {
      const model = gltf.scene;
      model.scale.set(0.2, 0.2, 0.2);
      model.rotation.y = THREE.MathUtils.degToRad(-15); // korrekte Ausrichtung
      model.position.set(...comp.position);
      scene.add(model);
    });
  });

  window.addEventListener('resize', onWindowResize, false);
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

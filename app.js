import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let camera, scene, renderer;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0); // leichtes Grau statt Weiß für besseren Kontrast

  // Kamera leicht näher und erhöht
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-2.5, 1.5, 2.8);
  camera.lookAt(0, 1.2, 0);

  // Licht: Kombination aus Ambient- und DirectionalLight
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Renderer mit Schatten
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const loader = new GLTFLoader();

  // Modellskalierung & Abstand
  const modelScale = 0.2;
  const spacing = 0.12;

  const parts = [
    { file: 'Steuereinheit.glb', x: 0 },
    { file: 'Daemmmatte.glb',    x: spacing * 1 },
    { file: 'Ventilatoreinheit.glb', x: spacing * 2 },
    { file: 'Patrone.glb',        x: spacing * 3 },
    { file: 'Aussenhaube.glb',    x: spacing * 4 }
  ];

  parts.forEach((part) => {
    loader.load(`models/${part.file}`, gltf => {
      const model = gltf.scene;
      model.scale.set(modelScale, modelScale, modelScale);
      model.position.set(part.x, 0, 0);
      model.rotation.y = Math.PI;

      // Optional: Materials & Schatten aktivieren
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.metalness = 0.2;  // bessere Details
          child.material.roughness = 0.6;
        }
      });

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

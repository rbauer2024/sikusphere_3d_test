import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let camera, scene, renderer;
let models = [];

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4f4f4);

  // 🔭 Fixe Endposition der Kamera – schon beim Start
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-3.5, 1.2, 3.0);
  camera.lookAt(0, 1.2, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const loader = new GLTFLoader();
  const modelScale = 0.2;

  // 🔩 Start: fast zusammen (enger Abstand)
  const initialSpacing = 0.03;
  const explodeSpacing = 0.12;

  const parts = [
    'Steuereinheit.glb',
    'Daemmmatte.glb',
    'Ventilatoreinheit.glb',
    'Patrone.glb',
    'Aussenhaube.glb'
  ];

  let loadedCount = 0;

  parts.forEach((file, i) => {
    loader.load(`models/${file}`, (gltf) => {
      const model = gltf.scene;
      model.scale.set(modelScale, modelScale, modelScale);

      // 🔩 Startposition eng zusammen (z. B. 0.03 statt 0.12)
      model.position.set(i * initialSpacing, 0, 0);
      model.rotation.y = Math.PI;

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.geometry.computeVertexNormals();
          child.material.flatShading = false;
          child.material.metalness = 0.1;
          child.material.roughness = 0.4;
          child.material.needsUpdate = true;
        }
      });

      scene.add(model);
      models[i] = model;
      loadedCount++;

      if (loadedCount === parts.length) {
        setTimeout(() => triggerExplosion(explodeSpacing), 3000);
      }
    });
  });

  window.addEventListener('resize', onWindowResize);
}

function triggerExplosion(spacing) {
  models.forEach((model, i) => {
    gsap.to(model.position, {
      x: spacing * i,
      duration: 1.5,
      ease: "power2.out"
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

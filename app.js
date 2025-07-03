import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let camera, scene, renderer;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4f4f4);

  // Kamera näher ran und leicht nach oben verschoben
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-3.0, 1.4, 2.8); // etwas näher als vorher
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

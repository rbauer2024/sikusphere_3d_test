import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let camera, scene, renderer;
const models = [];
const spacing = 0.12;
const modelScale = 0.2;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4f4f4);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-3.5, 1.2, 3);
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

  const parts = [
    { file: 'Steuereinheit.glb' },
    { file: 'Daemmmatte.glb' },
    { file: 'Ventilatoreinheit.glb' },
    { file: 'Patrone.glb' },
    { file: 'Aussenhaube.glb' }
  ];

  parts.forEach((part, index) => {
    loader.load(`models/${part.file}`, (gltf) => {
      const model = gltf.scene;
      model.scale.set(modelScale, modelScale, modelScale);
      model.rotation.y = Math.PI;
      model.position.set(0, 0, 0); // Startposition: geschlossen

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

      models[index] = model;
      scene.add(model);

      if (models.filter(Boolean).length === parts.length) {
        triggerAnimation();
      }
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

function triggerAnimation() {
  const duration = 1.5;
  const steps = 60;
  let frame = 0;

  const startCam = { x: -3.5, y: 1.2, z: 3 };
  const endCam = { x: -2.5, y: 1.3, z: 2.4 };

  const startPositions = models.map(() => 0);
  const endPositions = models.map((_, i) => spacing * i);

  const animateStep = () => {
    const t = frame / steps;

    camera.position.set(
      lerp(startCam.x, endCam.x, t),
      lerp(startCam.y, endCam.y, t),
      lerp(startCam.z, endCam.z, t)
    );
    camera.lookAt(0, 1.2, 0);

    models.forEach((model, i) => {
      model.position.x = lerp(startPositions[i], endPositions[i], t);
    });

    frame++;
    if (frame <= steps) requestAnimationFrame(animateStep);
  };

  setTimeout(() => {
    animateStep();
  }, 3000);
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

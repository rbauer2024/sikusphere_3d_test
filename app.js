import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { gsap } from './libs/gsap.min.js';

let camera, scene, renderer;
const models = [];

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
  const modelScale = 0.2;
  const spacing = 0.12;

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
      model.position.set(0, 0, 0); // initial geschlossen
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

      model.userData.targetX = index * spacing; // Zielposition speichern
      scene.add(model);
      models.push(model);
    });
  });

  window.addEventListener('resize', onWindowResize);

  // 🔁 Explosion nach 3 Sekunden starten
  setTimeout(() => {
    models.forEach((model) => {
      gsap.to(model.position, {
        x: model.userData.targetX,
        duration: 1.5,
        ease: "power2.out"
      });
    });
  }, 3000);
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

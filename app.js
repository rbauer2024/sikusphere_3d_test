import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let camera, scene, renderer;
const parts = []; // Hier speichern wir jedes geladene Modell mit Zielposition

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4f4f4); // leichtes Grau

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-3.2, 1.3, 2.5); // neue, leicht gedrehte und nähere Position
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

  const partFiles = [
    'Steuereinheit.glb',
    'Daemmmatte.glb',
    'Ventilatoreinheit.glb',
    'Patrone.glb',
    'Aussenhaube.glb'
  ];

  partFiles.forEach((file, index) => {
    loader.load(`models/${file}`, gltf => {
      const model = gltf.scene;
      model.scale.set(modelScale, modelScale, modelScale);
      model.position.set(0, 0, 0); // Start: geschlossen
      model.rotation.y = Math.PI;

      model.traverse(child => {
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

      // Speichern der Zielposition
      parts.push({
        model: model,
        targetX: spacing * index
      });
    });
  });

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('scroll', onScroll);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onScroll() {
  const scrollY = window.scrollY || 0; // Sicherheitsabfrage
  const maxScroll = 300;
  const factor = Math.min(scrollY / maxScroll, 1);

  parts.forEach(part => {
    const newX = THREE.MathUtils.lerp(0, part.targetX, factor);
    part.model.position.x = newX;
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

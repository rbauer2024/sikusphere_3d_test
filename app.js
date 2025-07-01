import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

const scene = new THREE.Scene();

// Kamera: Beibehaltung der bewährten Position und Rotation
// Kamera: flacherer Winkel
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-3.5, 1.1, 3.5); // etwas mehr seitlich      // X = 0 (zentral), Y = 0.4 (etwas über dem Boden), Z = 4.5 (Abstand)
camera.lookAt(0, 0.15, 0);             // Blickpunkt bleibt leicht nach oben gerichtet

// Renderer mit hoher Schärfe
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
document.body.appendChild(renderer.domElement);

// Licht für Details
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

// GLB-Modelle laden
const loader = new GLTFLoader();
const modelPaths = [
  'models/Steuereinheit.glb',
  'models/Daemmmatte.glb',
  'models/Ventilatoreinheit.glb',
  'models/Patrone.glb',
  'models/Aussenhaube.glb',
];

const spacing = 0.18; // bereits optimierter Abstand (30% reduziert)
const scale = 0.2;
const yRotation = -Math.PI * 1.05; // ~189° Drehung

modelPaths.forEach((path, index) => {
  loader.load(path, (gltf) => {
    const model = gltf.scene;
    model.scale.set(scale, scale, scale);
    model.rotation.y = yRotation;
    model.position.x = index * spacing;

    model.traverse((child) => {
      if (child.isMesh) {
        child.material.metalness = 0.1;
        child.material.roughness = 0.4;
        child.material.needsUpdate = true;
      }
    });

    scene.add(model);
  });
});

// Render-Schleife
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

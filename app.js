import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

const scene = new THREE.Scene();

// Kamera mit besserem Winkel
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-2.5, 1.2, 2); // Blick leicht von links oben
camera.lookAt(0, 0, 0);

// Renderer mit Qualitätseinstellungen
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// Lichtquellen
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

// Hintergrundfarbe
renderer.setClearColor(0xf5f5f5, 0); // hellgrau oder transparent

// Komponenten laden
const loader = new GLTFLoader();
const components = [
  { file: 'models/Steuereinheit.glb', x: -0.90 },
  { file: 'models/Daemmmatte.glb', x: -0.55 },
  { file: 'models/Ventilatoreinheit.glb', x: -0.20 },
  { file: 'models/Patrone.glb', x:  0.15 },
  { file: 'models/Aussenhaube.glb', x:  0.50 }
];

components.forEach(({ file, x }) => {
  loader.load(file, (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.rotation.y = THREE.MathUtils.degToRad(-30); // leicht geneigt
    model.position.set(x, 0, 0);
    scene.add(model);
  });
});

// Animation / Rendering
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

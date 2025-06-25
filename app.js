// app.js
import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2, 1, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0.2, 0);
controls.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const parts = [
  { file: 'Steuereinheit.glb', offset: 0,        title: 'INNENHAUBE',     text: 'Bedienfeld zur Steuerung der Betriebsarten' },
  { file: 'Daemmmatte.glb',     offset: 0.25,     title: 'SCHALLSCHUTZ',   text: 'Hohe Straßenlärmunterdrückung' },
  { file: 'Ventilatoreinheit.glb', offset: 0.5,  title: 'VENTILATOR MIT STRÖMUNGSRICHTER', text: 'Garantiert einen idealen Luftstrom und -austausch' },
  { file: 'Patrone.glb',         offset: 0.75,    title: 'WÄRMETAUSCHER',   text: 'Entnimmt gespeicherte Kälte und Feuchtigkeit und reinigt die Luft' },
  { file: 'Aussenhaube.glb',     offset: 1.0,     title: 'AUSSENHAUBE',     text: 'Kein Eindringen von Wasser oder Fremdkörpern. Erhältlich in verschiedenen RAL-Farben.' },
];

const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const interactive = [];

const infoBox = document.createElement('div');
infoBox.style.position = 'absolute';
infoBox.style.bottom = '20px';
infoBox.style.left = '20px';
infoBox.style.padding = '12px';
infoBox.style.backgroundColor = 'white';
infoBox.style.border = '1px solid #ccc';
infoBox.style.borderRadius = '8px';
infoBox.style.display = 'none';
infoBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
document.body.appendChild(infoBox);

parts.forEach(({ file, offset, title, text }) => {
  loader.load(
    file,
    (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(0.22);
      model.rotation.y = -Math.PI / 2; // 90 Grad Drehung nach links
      model.position.set(offset, 0, 0);
      model.userData = { title, text };
      scene.add(model);
      interactive.push(model);
    },
    undefined,
    (error) => {
      console.error(`Fehler beim Laden von ${file}:`, error);
    }
  );
});

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', onMouseMove);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactive, true);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    let root = object;
    while (root.parent && !root.userData.title) {
      root = root.parent;
    }

    if (root.userData.title) {
      root.traverse((child) => {
        if (child.isMesh) {
          child.material.emissive = new THREE.Color(0x0077ff);
        }
      });
      infoBox.innerHTML = `<strong style="color: #0077ff">${root.userData.title}</strong><br>${root.userData.text}`;
      infoBox.style.display = 'block';
    }
  } else {
    infoBox.style.display = 'none';
    interactive.forEach((model) => {
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.emissive = new THREE.Color(0x000000);
        }
      });
    });
  }

  renderer.render(scene, camera);
}

animate();

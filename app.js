import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';

const models = [
  { file: 'Steuereinheit.glb', name: 'INNENHAUBE', desc: 'Bedienfeld zur Steuerung der Betriebsarten' },
  { file: 'Daemmmatte.glb', name: 'SCHALLSCHUTZ', desc: 'Hohe Straßenlärmunterdrückung' },
  { file: 'Ventilatoreinheit.glb', name: 'VENTILATOR MIT STRÖMUNGRICHTER', desc: 'Garantiert einen idealen Luftstrom' },
  { file: 'Filterhalterung.glb', name: 'FILTERHALTERUNG', desc: 'Für den optionalen F7 Feinstaubfilter' },
  { file: 'Patrone.glb', name: 'WÄRMETAUSCHER', desc: 'Entnimmt gespeicherte Kälte und Feuchtigkeit und reinigt die Luft' },
  { file: 'Aussenhaube.glb', name: 'AUSSENHAUBE', desc: 'Kein Eindringen von Wasser oder Fremdkörpern. Erhältlich in verschiedenen RAL-Farben' }
];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 0.6);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
dirLight.position.set(5, 5, 5);
scene.add(light, dirLight);

const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const loaded = [];

models.forEach((m, i) => {
  loader.load(m.file, gltf => {
    const obj = gltf.scene;
    obj.position.x = i * 1.5 - 4;
    obj.name = m.name;
    obj.userData = { description: m.desc };
    scene.add(obj);
    loaded.push(obj);
  });
});

camera.position.z = 10;

const infoBox = document.getElementById('infoBox');
const infoTitle = document.getElementById('infoTitle');
const infoText = document.getElementById('infoText');

window.addEventListener('mousemove', e => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(loaded, true);
  if (intersects.length > 0) {
    const obj = intersects[0].object.parent;
    infoBox.style.display = 'block';
    infoTitle.innerText = obj.name;
    infoText.innerText = obj.userData.description;
  } else {
    infoBox.style.display = 'none';
  }
  renderer.render(scene, camera);
}

animate();

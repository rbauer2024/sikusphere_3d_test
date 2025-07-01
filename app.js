import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let scene, camera, renderer, raycaster, mouse;
const componentFiles = [
  { file: 'Aussenhaube.glb', position: [1.3, 0, 0], name: 'AUSSENHAUBE' },
  { file: 'Patrone.glb', position: [0.9, 0, 0], name: 'WÄRMETAUSCHER' },
  { file: 'Ventilatoreinheit.glb', position: [0.5, 0, 0], name: 'VENTILATOR MIT STRÖMUNGSRICHTER' },
  { file: 'Daemmmatte.glb', position: [0.1, 0, 0], name: 'SCHALLSCHUTZ' },
  { file: 'Steuereinheit.glb', position: [-0.3, 0, 0], name: 'INNENHAUBE' }
];

const infoText = {
  'AUSSENHAUBE': 'Kein Eindringen von Wasser oder Fremdkörpern. Erhältlich in verschiedenen RAL-Farben.',
  'WÄRMETAUSCHER': 'Entnimmt gespeicherte Kälte und Feuchtigkeit und reinigt die Luft',
  'VENTILATOR MIT STRÖMUNGSRICHTER': 'Garantiert einen idealen Luftstrom und -austausch',
  'SCHALLSCHUTZ': 'Hohe Straßenlärmunterdrückung',
  'INNENHAUBE': 'Bedienfeld zur Steuerung der Betriebsarten.'
};

const highlightColor = 0x007BFF;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Kamera exakt nach Vorlage
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-2.2, 0.6, 1.6);
  camera.lookAt(0, 0.2, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Licht
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // Interaktion
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);

  loadModels();
  createInfoBox();
}

function loadModels() {
  const loader = new GLTFLoader();
  componentFiles.forEach(component => {
    loader.load(`models/${component.file}`, gltf => {
      const model = gltf.scene;
      model.position.set(...component.position);
      model.name = component.name;
      model.scale.set(0.2, 0.2, 0.2);
      model.rotation.y = -Math.PI / 12; // ~-15°
      scene.add(model);
    });
  });
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  let intersectedComponent = null;

  intersects.forEach(intersect => {
    if (intersect.object.parent && infoText[intersect.object.parent.name]) {
      intersectedComponent = intersect.object.parent;
    }
  });

  scene.children.forEach(obj => {
    if (infoText[obj.name]) {
      obj.traverse(child => {
        if (child.isMesh) {
          child.material.emissive && (child.material.emissive.setHex(obj === intersectedComponent ? highlightColor : 0x000000));
        }
      });
    }
  });

  if (intersectedComponent) {
    document.getElementById('infoBox').style.display = 'block';
    document.getElementById('infoBox').innerHTML =
      `<strong style="color:#007BFF;">${intersectedComponent.name}</strong><br>${infoText[intersectedComponent.name]}`;
  } else {
    document.getElementById('infoBox').style.display = 'none';
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function createInfoBox() {
  const infoBox = document.createElement('div');
  infoBox.id = 'infoBox';
  infoBox.style.position = 'absolute';
  infoBox.style.bottom = '20px';
  infoBox.style.left = '20px';
  infoBox.style.padding = '12px 16px';
  infoBox.style.backgroundColor = 'rgba(255,255,255,0.95)';
  infoBox.style.border = '1px solid #007BFF';
  infoBox.style.borderRadius = '8px';
  infoBox.style.color = '#000';
  infoBox.style.fontFamily = 'Arial, sans-serif';
  infoBox.style.fontSize = '14px';
  infoBox.style.display = 'none';
  infoBox.style.zIndex = '100';
  document.body.appendChild(infoBox);
}

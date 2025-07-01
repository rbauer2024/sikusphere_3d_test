// app.js
import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let scene, camera, renderer;

init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Kamera-Position aus SikuSphere3D_neu.glb übernommen
  camera.position.set(-4.2, 1.0, 2.0);
  camera.lookAt(0, 0.1, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  loadComponent('Aussenhaube.glb', new THREE.Vector3(-2.0, 0, 0), 0);
  loadComponent('Patrone.glb', new THREE.Vector3(-1.2, 0, 0), 0);
  loadComponent('Ventilatoreinheit.glb', new THREE.Vector3(-0.4, 0, 0), 0);
  loadComponent('Daemmmatte.glb', new THREE.Vector3(0.4, 0, 0), 0);
  loadComponent('Steuereinheit.glb', new THREE.Vector3(1.2, 0, 0), 0);
}

function loadComponent(filename, position, yRotationDeg) {
  const loader = new GLTFLoader();
  loader.load(`models/${filename}`, function (gltf) {
    const object = gltf.scene;
    object.scale.set(0.2, 0.2, 0.2);
    object.position.copy(position);
    object.rotation.y = THREE.MathUtils.degToRad(yRotationDeg);
    scene.add(object);
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

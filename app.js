import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let camera, scene, renderer;

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(-2.5, 1.0, 2.5);  // leicht von links oben, schaut schräg hinein
    camera.lookAt(0.5, 0.2, 0); // Zielpunkt: zentral auf Achse

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const loader = new GLTFLoader();

    const files = [
        { file: 'Aussenhaube.glb', x: 0.00 },
        { file: 'Patrone.glb',     x: 0.12 },
        { file: 'Ventilatoreinheit.glb', x: 0.24 },
        { file: 'Daemmmatte.glb',  x: 0.36 },
        { file: 'Steuereinheit.glb', x: 0.48 },
    ];

    files.forEach(({ file, x }) => {
        loader.load(`models/${file}`, function (gltf) {
            const model = gltf.scene;
            model.scale.set(0.2, 0.2, 0.2);
            model.rotation.y = -Math.PI / 12; // ca. -15 Grad
            model.position.set(x, 0, 0);
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

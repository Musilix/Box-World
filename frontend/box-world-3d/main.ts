import * as THREE from "three";

/* Setup */
const gameObjects: THREE.Mesh[] = [];

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const light = new THREE.AmbientLight(0xffaaff);
light.position.set(1, 1, 1);
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, innerHeight);

document.body.appendChild(renderer.domElement);

/* Utils */
const animate = function () {
  renderer.render(scene, camera);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  camera.position.z += 0.01;
};

const makeCube = (scene) => {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geo, material);

  scene.add(cube);

  return cube;
};

/* Execution */
const cube = makeCube(scene);

renderer.setAnimationLoop(animate);
// makeCube();
// makeCube();

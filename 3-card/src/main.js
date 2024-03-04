import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'lil-gui';
import Card from './card-mesh.js';

window.addEventListener('load', function () {
  init();
});

async function init() {
  // GUI
  const gui = new GUI();

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  // 씬
  const scene = new THREE.Scene();

  // 카메라
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500,
  );
  camera.position.set(0, 1, 25);
  
  // OrbitControls
  new OrbitControls(camera, renderer.domElement);


  // 조명
  const amLight = new THREE.AmbientLight(0xffffff, Math.PI);
  amLight.position.set(-5,-5,-5);
  scene.add(amLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
  const dirLight2 = dirLight1.clone();
  dirLight1.position.set(1,1,3);
  dirLight2.position.set(-1,1,-3);
  scene.add(dirLight1, dirLight2);

  


  // 카드
  const card = new Card({
    width: 10,
    height: 15.8,
    radius: 0.5,
    color: '#0077ff',
  });

  scene.add(card.mesh);


  const cardFolder = gui.addFolder('Card');
    cardFolder
      .add(card.mesh.material, 'roughness')
      .min(0)
      .max(1)
      .step(0.01)
      .name('material.roughness');
    cardFolder
      .add(card.mesh.material, 'metalness')
      .min(0)
      .max(1)
      .step(0.01)
      .name('material.metalness');


  // 렌더
  render();
  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  // 리사이즈
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }
  window.addEventListener('resize', handleResize);
}
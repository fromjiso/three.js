import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'lil-gui';
import Card from './card-mesh.js';
import { gsap } from 'gsap';

window.addEventListener('load', function () {
  init();
});

async function init() {
  // GUI
  const gui = new GUI();

  // 버튼 컬러 배열
  const colors = ['#ff6e6e', '#31e0c1', '#006fff', '#ffd722'];


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
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.5;
  controls.rotateSpeed = 0.75;
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.minPolarAngle = Math.PI / 2 - Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 2 + Math.PI / 3;


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
    color: colors[0],
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

  card.mesh.rotation.z = Math.PI * 0.1;

  // 렌더
  render();
  function render() {
    controls.update();
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



  // 버튼넣기
  const container = document.querySelector('.container');

  colors.forEach(color => {
    const btn = document.createElement('button');
    btn.style.backgroundColor = color;
    btn.addEventListener('click', ()=>{
      card.mesh.material.color = new THREE.Color(color);
      gsap.to(card.mesh.rotation, {y: card.mesh.rotation.y - Math.PI/2, duration: 1, ease: 'back.out(2.5)'});
    })
    container.appendChild(btn);
  });

  gsap.to(card.mesh.rotation, {y: -Math.PI * 4, duration: 2.5, ease: 'back.out(2.5)'});
}
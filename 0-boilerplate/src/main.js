import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'lil-gui';

window.addEventListener('load', function () {
  init();
});

async function init() {
  // GUI
  const gui = new GUI();

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
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
  camera.position.set(0, 1, 5);

  // OrbitControls
  // controls = new OrbitControls(camera, renderer.domElement);



  // 렌더
  render();
  function render() {
    // controls.update();
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
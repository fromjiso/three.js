import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'lil-gui';

window.addEventListener('load', function(){
  init();
});

function init() {


  const options = {
    color: 0xcc0000,
  };


  // 렌더러 추가
  const renderer = new THREE.WebGLRenderer({
    // alpha: true, // 캔버스 배경 설정, false는 블랙
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight); // 캔버스 크기 설정
  document.body.appendChild(renderer.domElement); // 캔버스를 DOM에 넣기

  // 리사이즈 시 반응형 만들기
  function handleResize(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }
  window.addEventListener('resize', handleResize);

  // 씬 추가
  const scene = new THREE.Scene(); // three.js 기본 인자를 설정하기


  // 카메라 설정
  const camera = new THREE.PerspectiveCamera(
    75, // FOV 시야각
    window.innerWidth / window.innerHeight, // 카메라 종횡비
    1, // near
    500, // far
  );
  


  // 박스 지오메트리, 스탠다드 머티리얼 설정
  const geometry = new THREE.BoxGeometry(2,2,2); // 박스의 높이 너비 깊이 설정하기
  const standardMaterial = new THREE.MeshStandardMaterial({
    color: 0xcc0000, // 머티리얼 컬러 0xcc0000 or '#cc0000' or 'rgb(x,x,x)'  // MeshBasicMaterial은 조명에 영향 받지 않고 플랫함
    // transparent: true,
    // opacity: 0.5,
    // visible: false,
    // wireframe: true,
    // side: THREE.DoubleSide,
  }); 
  // standardMaterial.color = new THREE.Color(0xffffff);
  const cube = new THREE.Mesh(geometry, standardMaterial); // 박스 지오메트리와 머티리얼을 속성으로 갖는 메시 생성
  // scene.add(cube);      // 생성한 메시를 씬에 추가



  // 토러스 지오메트리, 퐁 머티리얼 설정
  // const torusGeometry = new THREE.TorusKnotGeometry(1,0.2,512,256,4,10);
  // const phongMaterial = new THREE.MeshPhongMaterial({
  //   color: 0xcc0000,
  // })
  // const torus = new THREE.Mesh(torusGeometry, phongMaterial);
  // scene.add(torus);


  // 다면체 추가
  const objGeometry = new THREE.IcosahedronGeometry(1,0);
  const objMaterial = new THREE.MeshPhongMaterial({
    color: 0xcc0000,
  })
  const icoObj = new THREE.Mesh( objGeometry, objMaterial );
  scene.add(icoObj);




  // 와이어프레임 다면체 추가
  const wireGeometry = new THREE.IcosahedronGeometry(4,0);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.2,
  })
  const wire = new THREE.Mesh( wireGeometry, wireMaterial );
  scene.add(wire);



  // 카메라
  camera.position.set(3,4,5); // 카메라 포지션 x y z
  // camera.lookAt(icoObj.position); // 카메라가 오브젝트를 바라보기



  
  
  // 조명
  const directionalLight = new THREE.DirectionalLight(0xffffff, 5); // 조명 추가하기
  directionalLight.position.set(-1,2,3);
  scene.add(directionalLight);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  ambientLight.position.set(3,2,1);
  scene.add(ambientLight);



  // 렌더
  // renderer.render(scene, camera); // 설정한 인자를 캔버스에 불러오기



  // OrbitControls 추가
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.minDistance = 2;
  controls.maxDistance = 20;
  // controls.maxPolarAngle = 2;
  controls.autoRotate = true;
  controls.autoRotationSpeed = 30;
  controls.enableDamping = true;
  // controls.dampingFfactor = 0.01;

  // AxesHelper
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);


  function animate() {        // 매 프레임마다 움직이게 하고 그걸 매번 렌더
    requestAnimationFrame(animate);

    // torus.rotation.y += 0.01;
    // wire.rotation.x -= 0.01;
    // wire.rotation.y += 0.01;
    // torus.rotation.y += THREE.MathUtils.degToRad(45)/100;
    // torus.scale.x = Math.cos(torus.rotation.y);


    controls.update();
    renderer.render(scene, camera);
  };
  animate();




  const gui = new GUI();
  gui.add(icoObj.position, 'y', -3,3,0.1);

  gui
    .add(icoObj.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01);
  
  gui.add(icoObj, 'visible');

  gui
  .addColor(options, 'color')
  .onChange((value) => {
    icoObj.material.color.set(value);
  });
}


// import { Application } from '@splinetool/runtime';

// const canvas = document.getElementById('canvas3d');
// const app = new Application(canvas);
// app.load('https://prod.spline.design/4-xTCc9qQf66-6hH/scene.splinecode');




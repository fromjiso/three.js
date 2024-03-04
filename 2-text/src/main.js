import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import GUI from 'lil-gui';
// import typeface from 'three/examples/fonts/helvetiker_bold.typeface.json';

window.addEventListener('load', function () {
  init();
});

async function init() {
  // GUI
  const gui = new GUI();

  // 렌더러
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
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    500,
  );
  camera.position.set(0,0,8);
  // camera.lookAt(text.position);

  
  // AxesHelper
  const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);


  // 컨트롤
  new OrbitControls(camera, renderer.domElement);
  
  
  // 앰비언트 조명
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  
  
  // 포인트 조명
  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(0,2,2);
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
  gui
  .add(pointLight.position, 'x')
  .min(-3)
  .max(3)
  .step(0.1);
  // scene.add(pointLight, pointLightHelper);
  
  

  // 스팟라이트
  const spotLight = new THREE.SpotLight(0xffffff, 2.5, 30, Math.PI * 0.15, 0.5);
  spotLight.position.set(0,0,3);
  spotLight.target.position.set(0,0,-3);
  scene.add(spotLight, spotLight.target);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.radius = 20;


  const textureLoader = new THREE.TextureLoader().setPath('./assets/textures/');
  const spotLightTexture = textureLoader.load('gradient.jpg');
  spotLightTexture.encoding = THREE.SRGBColorSpace;
  spotLight.map = spotLightTexture;


  // 마우스이벤트
  window.addEventListener('mousemove', event => {
    const x = ((event.clientX / window.innerWidth) - 0.5) * 5;
    const y = -((event.clientY / window.innerHeight) - 0.5) * 5;

    spotLight.target.position.set(x,y,-3);

  });


  // 스팟라이트 헬퍼
  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  // scene.add(spotLightHelper);

  const spotLightFolder = gui.addFolder('SpotLight');
  spotLightFolder
    .add(spotLight, 'angle')
    .min(0)
    .max(Math.PI / 2)
    .step(0.01);
  spotLightFolder
    .add(spotLight.position, 'z')
    .min(1)
    .max(10)
    .step(0.01)
    .name('position.z');
  spotLightFolder
    .add(spotLight, 'distance')
    .min(1)
    .max(30)
    .step(0.01);
  spotLightFolder
    .add(spotLight, 'decay')
    .min(0)
    .max(10)
    .step(0.01);
  spotLightFolder
    .add(spotLight, 'penumbra')
    .min(0)
    .max(1)
    .step(0.01);
  spotLightFolder
    .add(spotLight.shadow, 'radius')
    .min(1)
    .max(20)
    .step(0.01)
    .name('shadow.radius');


  // 배경
  const planeGeo = new THREE.PlaneGeometry(2000,2000);
  const planeMat = new THREE.MeshPhongMaterial({ color:0x000000});
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.position.z = -10;

  plane.receiveShadow = true;

  scene.add(plane);


  //폰트
  const fontLoader = new FontLoader();

  const font = await fontLoader.loadAsync('./assets/fonts/The Jamsil 3 Regular_Regular.json');

  const textGeometry = new TextGeometry('Hello Creators', {
    font,
    size: 0.5,
    height: 0.1,
    bevelEnabled: true,
    bevelSegments: 36,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  const textMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
  
  const text = new THREE.Mesh(textGeometry, textMaterial);
  
  text.castShadow = true;

  scene.add(text);
    

  //텍스쳐
  const textTexture = textureLoader.load('holographic.jpeg');
  textMaterial.map = textTexture;





  // 바운딩박스 활용한 중앙 정렬 ( 바운딩박스 크기를 구하고 반으로 나눠 축에서 마이너스로 이동 )
  // textGeometry.computeBoundingBox();
  // console.log('textGeometry.boundingBox', textGeometry.boundingBox);
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x)*0.5,
  //   -(textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y)*0.5,
  //   -(textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z)*0.5,
  // );

  textGeometry.center();


  // 후처리
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 1, 0);
  composer.addPass(unrealBloomPass);
  const unrealBloomPassFolder = gui.addFolder('UnrealBloomPass');

  unrealBloomPassFolder
    .add(unrealBloomPass, 'strength')
    .min(0)
    .max(3)
    .step(0.01);
  unrealBloomPassFolder
    .add(unrealBloomPass, 'radius')
    .min(0)
    .max(1)
    .step(0.01);
  unrealBloomPassFolder
    .add(unrealBloomPass, 'threshold')
    .min(0)
    .max(1)
    .step(0.01);


  // 렌더
  render();
  function render() {
    composer.render();
    // renderer.render(scene, camera);
    // spotLightHelper.update();
    requestAnimationFrame(render);
  }



  // 리사이즈
  function handleResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }
  window.addEventListener('resize', handleResize);
}
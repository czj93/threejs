import * as THREE from "three";
// 导入动画库
import gsap from "gsap";

import * as dat from "dat.gui";

// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import doorColorRes from '@/assets/textures/door/color.jpg'
import doorAmbientRes from '@/assets/textures/door/ambient.jpg'
import doorAlphaRes from '@/assets/textures/door/alpha.jpg'
import doorHeightRes from '@/assets/textures/door/height.jpg'
import doorMetalRes from '@/assets/textures/door/metal.jpg'
import doorNormalRes from '@/assets/textures/door/normal.jpg'
import doorRoughRes from '@/assets/textures/door/rough.jpg'

// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.set(0, 1, 2);
// 场景中添加相机
scene.add(camera);


// ============================ //
// =========== 纹理 ============ //
// ============================ //

// 加载纹理
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load(doorColorRes)
const doorAlphaTexture = textureLoader.load(doorAlphaRes)
const doorAmbientTexture = textureLoader.load(doorAmbientRes)
const doorHeightTexture = textureLoader.load(doorHeightRes)
const doorMetalTexture = textureLoader.load(doorMetalRes)
const doorRoughTexture = textureLoader.load(doorRoughRes)
const doorNormalTexture = textureLoader.load(doorNormalRes)


const textures = [doorColorTexture, doorAlphaTexture, doorAmbientTexture, doorHeightTexture, doorRoughTexture, doorMetalTexture, doorNormalTexture]

const material = new THREE.MeshStandardMaterial({
  color: '#ffff00',
  // map: doorColorTexture,
  // alphaMap: doorAlphaTexture,
  // transparent: true,
  // aoMap: doorAmbientTexture,
  // displacementMap: doorHeightTexture,
  displacementScale: 0.1,
  roughness: 0,
  // roughnessMap: doorRoughTexture,
  metalness: 0,
  // metalnessMap: doorMetalTexture,
  // normalMap: doorNormalTexture

})
const planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(0, 0.5, 0)

scene.add(plane)


// GUI
let gui: dat.GUI
// keyof THREE.Material
function updateTexture( material: THREE.Material, materialKey: string, textureIndex: number ) {

  return function (value: Boolean) {
    if (value) {
      // @ts-ignore  TODO: 以后再解决
      material[ materialKey ] = textures[ textureIndex ];
      material.needsUpdate = true;
    } else {
      // @ts-ignore 
      material[ materialKey ] = null
    }
    material.needsUpdate = true
  };

}

function initGui() {
  // 添加 GUI 操作面板
  gui = new dat.GUI();

  const params = {
    hasMap: false,
    hasAlphaMap: false,
    hasAoMap: false,
    hasDisplacementMap: false,
    hasRoughMap: false,
    hasMetal: false,
    hasNormal: false,
  };

  gui.add(params, "hasMap").name("颜色纹理").onChange(updateTexture(material, 'map', 0));
  gui.add(params, "hasAlphaMap").name("透明纹理").onChange(updateTexture(material, 'alphaMap', 1));
  gui.add(params, "hasAoMap").name("AO纹理").onChange(updateTexture(material, 'aoMap', 2));
  gui.add(material, 'displacementScale', 0, 0.1);
  gui.add(params, "hasDisplacementMap").name("Displace纹理").onChange(updateTexture(material, 'displacementMap', 3));
  gui.add(material, 'roughness', 0, 1 );
  gui.add(params, "hasRoughMap").name("粗糙纹理").onChange(updateTexture(material, 'roughnessMap', 4));
  gui.add(material, 'metalness', 0, 1);
  gui.add(params, "hasMetal").name("金属纹理").onChange(updateTexture(material, 'metalnessMap', 5));
  gui.add(params, "hasNormal").name("法线纹理").onChange(updateTexture(material, 'normalMap', 6));
}


// ============================ //
// =========== 纹理 ============ //
// ============================ //

const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)

const directionLight = new THREE.DirectionalLight(0xffffff, 0.5)

directionLight.position.set(10, 10, 10)

scene.add(directionLight)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 控制器设置 阻尼 使体验更真实, render 中同时要执行 update 方法
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

let __root__;

// 监听屏幕大小变化
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setPixelRatio(window.devicePixelRatio);
});

// 双击全屏功能
window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

export function render(wrap: HTMLElement) {
  __root__ = wrap;

  initGui()

  function _render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(_render);
  }
  // 将 canvas 添加到 dom 中
  wrap.appendChild(renderer.domElement);
  // 渲染场景
  _render();
}

export function destroy() {
  if(gui) gui.destroy()
  renderer.dispose()
}

import * as THREE from "three";
// 导入动画库
import gsap from "gsap";

import * as dat from "dat.gui";

// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import pointTextureRes from '@/assets/textures/particles/1.png'

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
camera.position.set(2.5, 5, 5);

// 场景中添加相机
scene.add(camera);

// ========================= //
// ======== 用点创建球形 ===== //
// ========================= //

// 创建球型
// const sphereGeometry = new THREE.SphereGeometry(3, 30, 30)

// // 创建点材质
// const pointMaterial = new THREE.PointsMaterial()
// pointMaterial.size = 0.1
// // 设置颜色
// pointMaterial.color.set(0x00ffff)
// // 设置透视
// pointMaterial.sizeAttenuation = true
// pointMaterial.blending = THREE.AdditiveBlending;

// const points = new THREE.Points(sphereGeometry, pointMaterial)

// scene.add(points)

// ========================= //
// ======== 用点创建球形 ===== //
// ========================= //

const params = {
  size: 0.1,
  count: 10000,
  branch: 6,
  // color: 0x00ffff,
  rotate: 0.3
}

let points: THREE.Points

function generateGalaxy() {
  const geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(params.count * 3)

  for (let i = 0; i <= params.count; i++) {
    const idx = i * 3
    const currentBranch = i % params.branch;
    const currentAngle = currentBranch * ((Math.PI * 2) / params.branch)

    const distance = Math.random() * 5 * Math.pow(Math.random(), 3)

    // const rx = Math.random()
    // const ry = Math.random()
    // const rz = Math.random()

    const rx = Math.pow(Math.random() * 2 - 1, 3) * (5 - distance) * 0.2
    const ry = Math.pow(Math.random() * 2 - 1, 3) * (5 - distance) * 0.2
    const rz = Math.pow(Math.random() * 2 - 1, 3) * (5 - distance) * 0.2

    positions[idx] = distance * Math.cos(currentAngle + distance * params.rotate) + rx
    positions[idx + 1] = 0 + ry
    positions[idx + 2] = distance * Math.sin(currentAngle + distance * params.rotate) + rz
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const textureLoader = new THREE.TextureLoader()

  const texture = textureLoader.load(pointTextureRes)

  const material = new THREE.PointsMaterial({
    size: params.size,
    // color: params.color,
    map: texture,
    alphaMap: texture,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    transparent: true,
    // vertexColors: true,
  })



  points = new THREE.Points(geometry, material)

  scene.add(points)

}

generateGalaxy()



// ========================= //
// ======== 用点创建星云 ===== //
// ========================= //







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

let gui: dat.GUI

function initGui() {
  // 添加 GUI 操作面板
  gui = new dat.GUI();
}

export function render(wrap: HTMLElement) {
  __root__ = wrap;

  initGui()

  function _render() {
    controls.update();
    points.rotation.y += 0.001
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

import * as THREE from "three";
// 导入动画库
import gsap from "gsap";

import * as dat from "dat.gui";

// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// @ts-ignore
import vertexShader from './program/vertex.glsl'
// @ts-ignore
import fragmentShader from './program/fragment.glsl'

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
camera.position.set(0, 0, 10);
// 场景中添加相机
scene.add(camera);

const params = {
  uWaresFrequency: 30,
  uScale: 0.1,
  uXzScale: 1.5,
  uNoiseFrequency: 10,
  uNoiseScale: 1.5,
  uLowColor: "#ff0000",
  uHighColor: "#ffff00",
  uXspeed: 1,
  uZspeed: 1,
  uNoiseSpeed: 1,
  uOpacity: 1,
};

// 添加物体
// 创建几何物体
const planeGeometry = new THREE.PlaneGeometry(3, 3, 512, 512)
// const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// 根据几何体和材质创建物体
// const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  transparent: true,
  uniforms: {
    uWaresFrequency: {
      value: params.uWaresFrequency,
    },
    uScale: {
      value: params.uScale,
    },
  }
})

// 将几何体添加到场景中
const plane = new THREE.Mesh(planeGeometry, shaderMaterial);
plane.rotateX(Math.PI/2)

// 将几何体添加到场景中
scene.add(plane);

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

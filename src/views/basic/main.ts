import * as THREE from "three";
// 导入动画库
import gsap from "gsap";

import * as dat from "dat.gui";

// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

// 添加物体
// 创建几何物体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// 根据几何体和材质创建物体
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// 将几何体添加到场景中
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// 复制一个物体
const cube2 = cube.clone();
const cube3 = cube.clone();
// 将几何体添加到场景中
scene.add(cube);
scene.add(cube2);
scene.add(cube3);

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

// 使用 gsap 添加动画
gsap.to(cube2.position, { y: 4, duration: 5, repeat: -1 });
gsap.to(cube2.rotation, { y: 3 * Math.PI, duration: 5, repeat: -1 });

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

// 添加 GUI 操作面板
const gui = new dat.GUI();
gui.add(cube3.scale, "x").min(0).max(5).step(0.01).name("X轴缩放");

const colorParams = {
  color: "#ffff00",
};
gui
  .addColor(colorParams, "color")
  .name("颜色")
  .onChange((value) => {
    // cube 被clone 后， 引用的是统一个 material, 3个cube会同时被修改颜色
    cube3.material.color.set(value);
  });
// visible 是 boolean 类型， gui 会自动给分配一个 check 类型
gui.add(cube3, "visible").name("是否显示");

export function render(wrap: HTMLElement) {
  __root__ = wrap;

  function _render() {
    controls.update();
    // 移动物体
    cube.position.x += 0.01;
    // 绕 x 轴旋转
    cube.rotation.x += 0.01;
    if (cube.position.x >= 5) {
      cube.position.x = 0;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(_render);
  }
  // 将 canvas 添加到 dom 中
  wrap.appendChild(renderer.domElement);
  // 渲染场景
  _render();
}

export function destroy() {}

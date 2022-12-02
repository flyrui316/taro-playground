import Taro from '@tarojs/taro';
import { decode } from 'base64-arraybuffer';
import {Image} from '@tarojs/components'
import {View3D, Renderer} from 'taro-3d/build/main';
import {ExpoWebGLRenderingContext} from 'taro-3d/build/main/lib/View3D.types';
import {     Mesh,
  PerspectiveCamera,
  Scene,
  MeshBasicMaterial,
  CameraHelper,
  OrthographicCamera,
  Group,
  SphereGeometry,
  BufferGeometry,
  MathUtils,
  Float32BufferAttribute,
  PointsMaterial,
  Points,
  AmbientLight,
  PointLight,
  TextureLoader,
  RepeatWrapping,
  MeshPhongMaterial,
  DoubleSide,
  IcosahedronGeometry,
  OctahedronGeometry,
  TetrahedronGeometry,
  PlaneGeometry,
  BoxGeometry,
  CircleGeometry,
  RingGeometry,
  CylinderGeometry,
  Vector2,
  LatheGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  Texture,
  ImageLoader,
  BoxBufferGeometry,
  MeshStandardMaterial,
  SpotLight, } from 'three';

import * as THREE from '../../../libs/three.weapp';


export default function TabOneScreen() {
let timeout
  return (
    <>
    <View3D
      style={{ flex: 1, height: Taro.getSystemInfoSync().windowHeight, with: Taro.getSystemInfoSync().windowWidth }}
      onContextCreate={async (gl: ExpoWebGLRenderingContext, taroCanvas: HTMLCanvasElement) => {
        let canvasId = taroCanvas._canvasId
        const { drawingBufferWidth: SCREEN_WIDTH, drawingBufferHeight: SCREEN_HEIGHT } = gl;
        const canvas = THREE.global.registerCanvas(canvasId, taroCanvas)
        

        const camera = new THREE.PerspectiveCamera(70, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000);
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xAAAAAA);

        const renderer = new THREE.WebGLRenderer({ context: gl, antialias: true,  });
        // renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      
        // const controls = new OrbitControls(camera, renderer.domElement);
        // controls.enableDamping = true;
        // controls.dampingFactor = 0.25;
        // controls.enableZoom = false;
        camera.position.set(0,0,20);
        // controls.update();
        const geometry = new BoxGeometry(5.0, 5.0, 5.0);
      
        const texture = new THREE.TextureLoader().load('./pikachu.png');
        const material = new THREE.MeshBasicMaterial({ map: texture });
      
        // const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        camera.lookAt(mesh.position);

        function update() {
          mesh.rotation.y += 0.02;
          mesh.rotation.x += 0.015;
        }
        // renderer.setPixelRatio(wx.getSystemInfoSync().pixelRatio);
        // renderer.setSize(canvas.width, canvas.height);
      
        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(canvas.width, canvas.height);
        }
        function render() {
          canvas.requestAnimationFrame(render);
          // mesh.rotation.x += 0.005;
          // mesh.rotation.y += 0.01;
          // controls.update();
          update()
          renderer.render(scene, camera);
          gl.endFrameEXP();
        }

        render()
      }}
    />
    </>
  );
}
class IconMesh extends Mesh {
  constructor() {
    super(
      new BoxGeometry(1.0, 1.0, 1.0),
      new MeshStandardMaterial({
        map:new THREE.TextureLoader().load('./pikachu.png'),
        // color: 0xff0000
      })
    );
  }
}

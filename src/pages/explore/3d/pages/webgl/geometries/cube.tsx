import Taro from '@tarojs/taro';
import {
    PerspectiveCamera,
    Scene,
    AmbientLight,
    PointLight,
    Fog,
    GridHelper,
    SpotLight,
    Mesh,
    MeshStandardMaterial,
    BoxGeometry,
    
} from 'three';
import {View3D, Renderer, TextureLoader} from 'taro-3d/build/main'
import {ExpoWebGLRenderingContext} from 'taro-3d/build/main/lib/View3D.types';



export default function TabOneScreen() {

  return (
    <>
    <View3D
      style={{ flex: 1, height: Taro.getSystemInfoSync().windowHeight, with: Taro.getSystemInfoSync().windowWidth }}
      onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const sceneColor = 0x6ad6f0;

        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        renderer.setClearColor(sceneColor);

        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(2, 5, 4);

        const scene = new Scene();
        scene.fog = new Fog(sceneColor, 1, 10000);

        const ambientLight = new AmbientLight(0x101010);
        scene.add(ambientLight);

        const pointLight = new PointLight(0xffffff, 2, 1000, 1);
        pointLight.position.set(0, 200, 200);
        scene.add(pointLight);

        const spotLight = new SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 500, 100);
        spotLight.lookAt(scene.position);
        scene.add(spotLight);

        const cube = new IconMesh();
        scene.add(cube);

        camera.lookAt(cube.position);

        function update() {
          cube.rotation.y += 0.05;
          cube.rotation.x += 0.025;
        }

        // Setup an animation loop
        const render = () => {
          requestAnimationFrame(render);
          update();
          renderer.render(scene, camera);
          gl.endFrameEXP();
        };
        render();
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
        map: new TextureLoader().load('https://pic1.58cdn.com.cn/nowater/frs/n_v3574a49f429d142c3bee2469e9528e470.jpg'),
        // color: 0xff0000
      })
    );
  }
}

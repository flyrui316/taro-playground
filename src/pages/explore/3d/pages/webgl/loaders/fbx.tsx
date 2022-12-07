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
    AnimationMixer,
    Clock,
    Group,
    
} from 'three';
import {View3D, Renderer, TextureLoader, loadAsync} from 'taro-3d/build/main'
import {ExpoWebGLRenderingContext} from 'taro-3d/build/main/lib/View3D.types';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';


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

        const camera = new PerspectiveCamera(75, width / height, 0.01, 1000);
        camera.position.set(2, 5, 5);

        const scene = new Scene();
        scene.fog = new Fog(sceneColor, 200, 1000);
        const grid = new GridHelper(20, 20, 0x000000, 0x000000)
        grid.material.alphaTest = 0.5;
        grid.material.transparent = true;
        scene.add(grid);

        const ambientLight = new AmbientLight(0x101010);
        scene.add(ambientLight);

        const pointLight = new PointLight(0xffffff, 2, 1000, 1);
        pointLight.position.set(0, 200, 200);
        scene.add(pointLight);

        const spotLight = new SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 500, 100);
        spotLight.lookAt(scene.position);
        scene.add(spotLight);
        
        const Floader = new FBXLoader();
        const loadFile = (loader, url):Promise<Group> => {
            return new Promise((resolve, reject)=>{
                loader.load(url, res=>resolve(res), ()=>{}, error=>reject(error))
            })
        }
        const fbxFileUrl = 'https://wos2.58cdn.com.cn/DeFazYxWvDti/frsupload/9a80489e046f0d3e164a6f0955a8df98_SambaDancing.fbx'
        let object:Group = await loadAsync(Floader, fbxFileUrl)
        console.log(11111222, object)
        
        // let object:Group = null;
        // const dancingFbx = require('../assets/models/dancing.fbx');
        // if(Platform.OS === 'web'){
        //   const asset = Asset.fromModule(dancingFbx);
        //   await asset.downloadAsync();
        //   object = await loader.loadAsync(asset.localUri!)
        // } else {
        //   const uri = (await resolveAsync(dancingFbx)).localUri ?? null;
        //   const base64 = await FileSystem.readAsStringAsync( uri!, {
        //     encoding: FileSystem.EncodingType.Base64,
        //   });
        //   const arrayBuffer = decode(base64);
        //   object = loader.parse(arrayBuffer, '');
        // }

        const mixer = new AnimationMixer(object);
          const action = mixer.clipAction(object.animations[0]);
          action.play();
          object.scale.set(0.015, 0.015, 0.015)
          scene.add(object)
          camera.lookAt(object.position)
          object.traverse(function (child) {
            if (child?.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          const clock = new Clock();
          function update() {
            mixer.update(clock.getDelta())
          }
          
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

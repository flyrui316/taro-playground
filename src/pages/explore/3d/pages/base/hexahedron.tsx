import { useCallback, useEffect, useState } from 'react';
import { ExpoWebGLRenderingContext } from 'expo-gl';
import {Text, Button} from '@tarojs/components'
import {
    AmbientLight,
    Fog,
    GridHelper,
    Mesh,
    PerspectiveCamera,
    PointLight,
    Scene,
    SpotLight,
    BoxGeometry,
    MeshBasicMaterial
} from 'three';
import {View3D, Renderer} from '../../../../../../node_modules/taro-3d/build/main'


export default function TabOneScreen() {
  let timeout:number;

  const [height, setHeight] = useState(500)

  useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  const heightClick = useCallback(()=>{
    setHeight(height + 100)
  },[height]);

  return (
    <>
    <View3D
      style={{ flex: 1, height, with: 500 }}
      onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const sceneColor = 0x6ad6f0;

        // Create a WebGLRenderer without a DOM element
        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        renderer.setClearColor(sceneColor);

        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(2, 5, 5);

        const scene = new Scene();
        scene.fog = new Fog(sceneColor, 1, 10000);
        scene.add(new GridHelper(10, 10));

        const ambientLight = new AmbientLight(0x101010);
        scene.add(ambientLight);

        const pointLight = new PointLight(0xffffff, 2, 1000, 1);
        pointLight.position.set(0, 200, 200);
        scene.add(pointLight);

        const spotLight = new SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 500, 100);
        spotLight.lookAt(scene.position);
        scene.add(spotLight);

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);

        const material = new MeshBasicMaterial({color: 0x44aa88});  // greenish blue

        const cube = new Mesh(geometry, material);
        scene.add(cube);

        camera.lookAt(cube.position);

        function update() {
          cube.rotation.y += 0.05;
          cube.rotation.x += 0.025;
        }

        // Setup an animation loop
        const render = () => {
          timeout = requestAnimationFrame(render);
          update();
          renderer.render(scene, camera);
          gl.endFrameEXP();
        };
        render();
      }}
    />
    <Button onClick={heightClick}><Text>点击增加3d区域高度</Text></Button>
    </>
  );
}
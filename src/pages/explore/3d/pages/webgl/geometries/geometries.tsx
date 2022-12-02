import Taro from '@tarojs/taro';
import { decode } from 'base64-arraybuffer';
import {Image} from '@tarojs/components'
import {
    Mesh,
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
} from 'three';
import {View3D, Renderer} from 'taro-3d/build/main'
import {ExpoWebGLRenderingContext} from 'taro-3d/build/main/lib/View3D.types';

interface FileSuccessCallbackResult {
  filePath:	string;//	用户文件路径。传入 filePath 时会返回，跟传入的 filePath 一致
statusCode:	number;//	开发者服务器返回的 HTTP 状态码
tempFilePath:	string;//	临时文件路径。没传入 filePath 指定文件存储路径时会返回，下载后的文件会存储到一个临时文件
errMsg:	string;//	调用结果
}

const downloadFile = ({url}):Promise<FileSuccessCallbackResult>=>{
  return new Promise((resolve, reject)=>{
    const downloadTask = Taro.downloadFile({
      url,
      success: (res:FileSuccessCallbackResult)=>{
        res.localUri = res.tempFilePath
        resolve(res)
      },
      fail: (error)=> {
        reject(error)
      }
    })
  })
}
class ITextureLoader extends TextureLoader {
  load(asset, onLoad?, onProgress?, onError?) {
      if (!asset) {
          throw new Error('ExpoTHREE.TextureLoader.load(): Cannot parse a null asset');
      }
      const texture = new Texture();
      const loader = new ImageLoader(this.manager);
      loader.setCrossOrigin(this.crossOrigin);
      loader.setPath(this.path);
      (async () => {
          const nativeAsset = await downloadFile({url: asset});
          console.log(111, nativeAsset)
          function parseAsset(image) {
              texture.image = image;
              texture.needsUpdate = true;
              if (onLoad !== undefined) {
                  onLoad(texture);
              }
          }
          if (false) {
              loader.load(nativeAsset.tempFilePath, image => {
                  parseAsset(image);
              }, onProgress, onError);
          }
          else {
              if (!nativeAsset.width || !nativeAsset.height) {
                  const {width, height} = await new Promise((resolve, reject) => {
                    Taro.getImageInfo({
                      src: nativeAsset.tempFilePath, 
                      success:(res)=>{
                        console.log()
                        resolve({width: res.width, height: res.height})
                    }});
                  });
                  nativeAsset.width = width;
                  nativeAsset.height = height;
              }
              const base64 = Taro.getFileSystemManager().readFileSync(nativeAsset.tempFilePath, 'base64')
              const arrayBuffer = decode(base64)
              texture['isDataTexture'] = true; // Forces passing to `gl.texImage2D(...)` verbatim
              texture.needsUpdate = true;
              // texture.format = 1022
              console.log(1223, texture, arrayBuffer, Array.from(arrayBuffer))
              parseAsset({
                  data: arrayBuffer,
                  width: nativeAsset.width,
                  height: nativeAsset.height,
              });
          }
      })();
      return texture;
  }
}

export default function TabOneScreen() {

  return (
    <>
    <View3D
      style={{ flex: 1, height: Taro.getSystemInfoSync().windowHeight, with: Taro.getSystemInfoSync().windowWidth }}
      onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
        const { drawingBufferWidth: SCREEN_WIDTH, drawingBufferHeight: SCREEN_HEIGHT } = gl;
        const sceneColor = 0x000000;
        const camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.y = 400;

				const scene = new Scene();

				let object;

				const ambientLight = new AmbientLight( 0xcccccc, 0.4 );
				scene.add( ambientLight );

				const pointLight = new PointLight( 0xffffff, 0.8 );
				camera.add( pointLight );
				scene.add( camera );
        let map
        if(process.env.TARO_ENV === 'h5'){
          map = new TextureLoader().load( '//pic5.58cdn.com.cn/nowater/frs/n_v3da1c2ed4d5854d5f9fcd3969a01f811c.jpg' );
        }else if(process.env.TARO_ENV === 'weapp'){
          map = new ITextureLoader().load( 'https://pic5.58cdn.com.cn/nowater/frs/n_v3da1c2ed4d5854d5f9fcd3969a01f811c.jpg' )
        }
        console.log(222222)
				map.wrapS = map.wrapT = RepeatWrapping;
				map.anisotropy = 16;

				const material = new MeshPhongMaterial( { map: map, side: DoubleSide } );

				//

				object = new Mesh( new SphereGeometry( 75, 20, 10 ), material );
				object.position.set( - 300, 0, 200 );
				scene.add( object );

				object = new Mesh( new IcosahedronGeometry( 75, 1 ), material );
				object.position.set( - 100, 0, 200 );
				scene.add( object );

				object = new Mesh( new OctahedronGeometry( 75, 2 ), material );
				object.position.set( 100, 0, 200 );
				scene.add( object );

				object = new Mesh( new TetrahedronGeometry( 75, 0 ), material );
				object.position.set( 300, 0, 200 );
				scene.add( object );

				//

				object = new Mesh( new PlaneGeometry( 100, 100, 4, 4 ), material );
				object.position.set( - 300, 0, 0 );
				scene.add( object );

				object = new Mesh( new BoxGeometry( 100, 100, 100, 4, 4, 4 ), material );
				object.position.set( - 100, 0, 0 );
				scene.add( object );

				object = new Mesh( new CircleGeometry( 50, 20, 0, Math.PI * 2 ), material );
				object.position.set( 100, 0, 0 );
				scene.add( object );

				object = new Mesh( new RingGeometry( 10, 50, 20, 5, 0, Math.PI * 2 ), material );
				object.position.set( 300, 0, 0 );
				scene.add( object );

				//

				object = new Mesh( new CylinderGeometry( 25, 75, 100, 40, 5 ), material );
				object.position.set( - 300, 0, - 200 );
				scene.add( object );

				const points = [];

				for ( let i = 0; i < 50; i ++ ) {

					points.push( new Vector2( Math.sin( i * 0.2 ) * Math.sin( i * 0.1 ) * 15 + 50, ( i - 5 ) * 2 ) );

				}

				object = new Mesh( new LatheGeometry( points, 20 ), material );
				object.position.set( - 100, 0, - 200 );
				scene.add( object );

				object = new Mesh( new TorusGeometry( 50, 20, 20, 20 ), material );
				object.position.set( 100, 0, - 200 );
				scene.add( object );

				object = new Mesh( new TorusKnotGeometry( 50, 10, 50, 20 ), material );
				object.position.set( 300, 0, - 200 );
				scene.add( object );

				//


				const renderer = new Renderer({ gl, antialias: true});
				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				renderer.autoClear = false;
        renderer.setClearColor(sceneColor);

                function animate() {

                    requestAnimationFrame( animate );
    
                    render();
    
                }
    
                function render() {
    
                  const timer = Date.now() * 0.0001;

                  camera.position.x = Math.cos( timer ) * 800;
                  camera.position.z = Math.sin( timer ) * 800;
          
                  camera.lookAt( scene.position );
          
                  scene.traverse( function ( object ) {
          
                    if ( object.isMesh === true ) {
          
                      object.rotation.x = timer * 5;
                      object.rotation.y = timer * 2.5;
          
                    }
          
                  } );
          
                  renderer.render( scene, camera );
                    gl.endFrameEXP();
                }
                animate()
      }}
    />
    </>
  );
}


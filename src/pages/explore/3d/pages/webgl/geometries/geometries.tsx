import Taro from '@tarojs/taro';
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
} from 'three';
import {View3D, Renderer} from 'taro-3d/build/main'
import {ExpoWebGLRenderingContext} from 'taro-3d/build/main/lib/View3D.types';



export default function TabOneScreen() {

  return (
    <>
    <View3D
      style={{ flex: 1, height: Taro.getSystemInfoSync().windowHeight, with: Taro.getSystemInfoSync().windowWidth }}
      onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
        const { drawingBufferWidth: SCREEN_WIDTH, drawingBufferHeight: SCREEN_HEIGHT } = gl;
        const sceneColor = 0x000000;

        const renderer = new Renderer({ gl });
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.setClearColor(sceneColor);

        const camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.y = 400;

				const scene = new Scene();

				let object;

				const ambientLight = new AmbientLight( 0xcccccc, 0.4 );
				scene.add( ambientLight );

				const pointLight = new PointLight( 0xffffff, 0.8 );
				camera.add( pointLight );
				scene.add( camera );
        const map = new TextureLoader().load( 'https://pic5.58cdn.com.cn/nowater/frs/n_v3da1c2ed4d5854d5f9fcd3969a01f811c.jpg' );
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


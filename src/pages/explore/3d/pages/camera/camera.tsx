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
} from 'three';
import {View3D, Renderer} from 'taro-3d/build/main'


export default function TabOneScreen() {

  return (
    <>
    <View3D
      style={{ flex: 1, height: Taro.getSystemInfoSync().windowHeight, with: Taro.getSystemInfoSync().windowWidth }}
      onContextCreate={async (gl: any) => {
        const { drawingBufferWidth: SCREEN_WIDTH, drawingBufferHeight: SCREEN_HEIGHT } = gl;
        const sceneColor = 0x000000;
        const frustumSize = 600;
        let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
                const scene = new Scene();
				const camera = new PerspectiveCamera( 50, 0.5 * aspect, 1, 10000 );
				camera.position.z = 2500;

				const cameraPerspective = new PerspectiveCamera( 50, 0.5 * aspect, 150, 1000 );

				const cameraPerspectiveHelper = new CameraHelper( cameraPerspective );
				scene.add( cameraPerspectiveHelper );

				//
				const cameraOrtho = new OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 150, 1000 );

				const cameraOrthoHelper = new CameraHelper( cameraOrtho );
				scene.add( cameraOrthoHelper );

				//

				const activeCamera = cameraPerspective;
				const activeHelper = cameraPerspectiveHelper;


				// counteract different front orientation of cameras vs rig

				cameraOrtho.rotation.y = Math.PI;
				cameraPerspective.rotation.y = Math.PI;

				const cameraRig = new Group();

				cameraRig.add( cameraPerspective );
				cameraRig.add( cameraOrtho );

				scene.add( cameraRig );

				//

				const mesh = new Mesh(
					new SphereGeometry( 100, 16, 8 ),
					new MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
				);
				scene.add( mesh );

				const mesh2 = new Mesh(
					new SphereGeometry( 50, 16, 8 ),
					new MeshBasicMaterial( { color: 0x00ff00, wireframe: true } )
				);
				mesh2.position.y = 150;
				mesh.add( mesh2 );

				const mesh3 = new Mesh(
					new SphereGeometry( 5, 16, 8 ),
					new MeshBasicMaterial( { color: 0x0000ff, wireframe: true } )
				);
				mesh3.position.z = 150;
				cameraRig.add( mesh3 );

				//

				const geometry = new BufferGeometry();
				const vertices = [];

				for ( let i = 0; i < 10000; i ++ ) {

					vertices.push( MathUtils.randFloatSpread( 2000 ) ); // x
					vertices.push( MathUtils.randFloatSpread( 2000 ) ); // y
					vertices.push( MathUtils.randFloatSpread( 2000 ) ); // z

				}

				geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );

				const particles = new Points( geometry, new PointsMaterial( { color: 0x888888 } ) );
				scene.add( particles );

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
    
                    const r = Date.now() * 0.0005;
    
                    mesh.position.x = 700 * Math.cos( r );
                    mesh.position.z = 700 * Math.sin( r );
                    mesh.position.y = 700 * Math.sin( r );
    
                    mesh.children[ 0 ].position.x = 70 * Math.cos( 2 * r );
                    mesh.children[ 0 ].position.z = 70 * Math.sin( r );
    
                    if ( activeCamera === cameraPerspective ) {
    
                        cameraPerspective.fov = 35 + 30 * Math.sin( 0.5 * r );
                        cameraPerspective.far = mesh.position.length();
                        cameraPerspective.updateProjectionMatrix();
    
                        cameraPerspectiveHelper.update();
                        cameraPerspectiveHelper.visible = true;
    
                        cameraOrthoHelper.visible = false;
    
                    } else {
    
                        cameraOrtho.far = mesh.position.length();
                        cameraOrtho.updateProjectionMatrix();
    
                        cameraOrthoHelper.update();
                        cameraOrthoHelper.visible = true;
    
                        cameraPerspectiveHelper.visible = false;
    
                    }
    
                    cameraRig.lookAt( mesh.position );
    
                    renderer.clear();
    
                    activeHelper.visible = false;
    
                    renderer.setViewport( 0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
                    renderer.render( scene, activeCamera );
    
                    activeHelper.visible = true;
    
                    renderer.setViewport( SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
                    renderer.render( scene, camera );
                    gl.endFrameEXP();
                }
                animate()
      }}
    />
    </>
  );
}


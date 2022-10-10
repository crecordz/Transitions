import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import {gsap} from 'gsap';

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const pict = textureLoader.load('/textures/2.jpg')
const pict2 = textureLoader.load('/textures/3.png')
/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100)

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)

for(let i = 0; i < count; i++ )
{
    randoms[i] = Math.random()
}

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
var uMouse = new THREE.Vector2(0,0)
// Material
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    wireframe: true,
    // lights: true,
    uniforms:
    {
        blend: { type: 'f', value: 0.0 },
        uTime: { value: 0},
        uMouse: { value: new THREE.Vector2(0,0) },
        uTexture: { value: pict},
        uTexture2: { value: pict2},
        uResolution: {type: 'v2', value: new THREE.Vector2(sizes.width,sizes.height) }
    },
    side: THREE.DoubleSide,

    

})

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)





window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(-0.2, -0.1, 0.9)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

scene.destination = {x: 0, y:0}
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let x,y
function mousemove(e){
    x = (e.clientX - sizes.width/2)/ (sizes.width/2)
    y = -(e.clientY - sizes.height/2)/ (sizes.height/2)
    scene.destination.x = x*0.2
    scene.destination.y = y*0.2
    uMouse.x = ( (e.clientX / window.innerWidth))   ;
    uMouse.y = 1 -( e.clientY/ window.innerHeight );
  
}
document.addEventListener('mousemove', mousemove)




const Sound = new Audio('/1.mp3')
function effect(){
    if (material.uniforms.blend.value == 0.0){
      gsap.
      to(material.uniforms.blend, 2.5,{value:1, 
        ease: "elastic.out(1, 0.2)"
    
    },0) 
    }
    else{
      gsap.
      to(material.uniforms.blend, 2.5,{value:0,
        ease: "elastic.out(1, 0.2)"},1) 
    }
    Sound.currentTime =0
   Sound.play()
}

renderer.domElement.addEventListener('click', () => {
    if (material.uniforms.blend.value == 0.0 || material.uniforms.blend.value == 1.0){
        effect()
    }
        
        
})

debugObject.Next = () => {
  effect()
}  
gui.add(debugObject, 'Next')


const directionalLight = new THREE.DirectionalLight( 0xff0000, 40 );
scene.add( directionalLight );

directionalLight.position.set(1, 1, 2)

console.log(geometry)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    material.uniforms.uTime.value = elapsedTime
    // Update controls
    controls.update()

    mesh.rotation.y += (scene.destination.x - mesh.rotation.y)* 0.5
    mesh.rotation.x -= (scene.destination.y + mesh.rotation.x)* 0.5
    

    material.uniforms.uMouse.value = uMouse;
    console.log(uMouse)
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
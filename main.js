import * as THREE from 'three';
import { comparePositions } from './helper_functions.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var mouse = new THREE.Vector2()

const controls = new OrbitControls(camera, renderer.domElement)

const default_camera_position = new THREE.Vector3(-192.185633513088, 129.31783555216967, 133.80998272738674)
const cell_position = new THREE.Vector3(0, 0, 0);
var camera_focus = cell_position

camera.position.set(default_camera_position.x, default_camera_position.y, default_camera_position.z);
controls.update();

//Light

const light = new THREE.AmbientLight(0x404040, 1.5); // soft white light
scene.add(light);

const skylight = new THREE.DirectionalLight(0xffffff, 0.5);
skylight.position.set(0, 100, 0)
scene.add(skylight);

const cameralight = new THREE.DirectionalLight(0xffffff, 0.1);
scene.add(cameralight);

const cell_light = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(cell_light)

controls.addEventListener('change', light_update);

function light_update() {
    cameralight.position.copy(camera.position);
}

//Notes

const numberTexture = new THREE.CanvasTexture(
    document.querySelector("#number")
);

const spriteMaterial = new THREE.SpriteMaterial({
    map: numberTexture,
    alphaTest: 0.5,
    transparent: true,
    depthTest: false,
    depthWrite: false
});




// Objects in space
const loader = new GLTFLoader();

loader.load('3D_models/full_cell_model.glb', function(full_cell_model) {

    const cell_model = full_cell_model.scene

    cell_model.position.setX(0);
    cell_model.position.setY(0);
    cell_model.position.setZ(0);

    cell_model.scale.set(50, 50, 50)

    cell_model.name = 'cell'

    scene.add(cell_model);

}, undefined, function(error) {

    console.error(error);

});

//Annotation 
const map = new THREE.TextureLoader().load('annotation_point.png');
const annotation_material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });

function set_up_sprite(sprite, x, y, z) {
    sprite.scale.set(10, 10, 1)
    sprite.position.set(x, y, z)
    scene.add(sprite)
}

const sprite_nucleous = new THREE.Sprite(annotation_material);
set_up_sprite(sprite_nucleous, -20, 21, -18)

const sprite_rough_ER = new THREE.Sprite(annotation_material);
set_up_sprite(sprite_rough_ER, -55.5, 10, 57)

const sprite_golgi_body = new THREE.Sprite(annotation_material);
set_up_sprite(sprite_golgi_body, 53, 9, 91)

const sprite_centrioles = new THREE.Sprite(annotation_material);
set_up_sprite(sprite_centrioles, -85, -2, 122)

const sprite_mitochondria = new THREE.Sprite(annotation_material);
set_up_sprite(sprite_mitochondria, -12, 13, 162)

const sprite_smooth_ER = new THREE.Sprite(annotation_material);
set_up_sprite(sprite_smooth_ER, -27, 2, 102)

const sprite_lysosome = new THREE.Sprite(annotation_material);
set_up_sprite(sprite_lysosome, -130, 8, 60)

const sprite_membrane = new THREE.Sprite(annotation_material);
set_up_sprite(sprite_membrane, -150, 4, -50)

const sprite_cytsol = new THREE.Sprite(annotation_material);
set_up_sprite(sprite_cytsol, -100, 1, 80)


function update_annotation() {
    const title = document.querySelector('#title');

    console.log(title)

    title.innerHTML = "<strong> Nucleous </strong>"

}

renderer.domElement.addEventListener('click', onClick, false);

function onClick() {

    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObject(sprite_nucleous, true);

    console.log(intersects)

    if (intersects.length > 0) {

        update_annotation()

        console.log("works")

    }
}


// Camera moving functions

document.querySelector("#camNucelous").onclick = function() {
    toObject(sprite_nucleous)
}

document.querySelector("#camOverview").onclick = function() {
    toDefault()

}

document.querySelector("#printCameraPosition").onclick = function() {
    printCameraPosition()

}

function printCameraPosition() {
    console.log(camera.position);
}


function toDefault() {
    var aabb = new THREE.Box3().setFromObject(sprite_nucleous);

    var pl = gsap.timeline();

    pl.to(camera.position, {
        //delay: 1.3,
        duration: 2,
        ease: "power4.out",
        // ease: "slow (0.7, 0.1, false)",    
        x: default_camera_position.x,
        y: default_camera_position.y,
        z: default_camera_position.z,
        onUpdate: function() {
            controls.update();
        }
    });
    console.log("Default");
    annotation_material.opacity = 1;
    camera_focus = cell_position;
    console.log(camera.position);
}

function toObject(annotation) {
    var aabb = new THREE.Box3().setFromObject(annotation);
    var center = aabb.getCenter(new THREE.Vector3());

    var camPosition = camera.position.clone();
    var targPosition = annotation.position.clone();
    var distance = camPosition.sub(targPosition);
    var direction = distance.normalize();
    var offset = distance.clone().sub(direction.multiplyScalar(2));
    var newPos = annotation.position.clone().sub(offset);
    newPos.y = camera.position.y;


    var pl = gsap.timeline();
    pl.to(camera.position, {
        duration: 2.5,
        ease: "power3.in",
        x: newPos.x,
        y: center.y,
        z: newPos.z + 20,
        onUpdate: function() {
            controls.update();
        },
        onComplete: function() {
            annotation.material.opacity = 0;
        }
    });

    camera_focus = targPosition;
    console.log(camera.position);
}

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    camera.lookAt(camera_focus);
    // update_annotation

    renderer.render(scene, camera);
}

animate();
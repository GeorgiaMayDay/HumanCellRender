import * as THREE from 'three';
import { comparePositions } from './helper_functions.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Annotation_point, points_visible } from './annotation_points.js';

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
const sprite_nucleous = new Annotation_point([-20, 21, -18]);
scene.add(sprite_nucleous.sprite)

const sprite_rough_ER = new Annotation_point([-55.5, 10, 57]);
scene.add(sprite_rough_ER.sprite)

const sprite_golgi_body = new Annotation_point([53, 9, 91]);
scene.add(sprite_golgi_body.sprite)

const sprite_centrioles = new Annotation_point([-85, -2, 122]);
scene.add(sprite_centrioles.sprite)

const sprite_mitochondria = new Annotation_point([-12, 13, 162]);
scene.add(sprite_mitochondria.sprite)

const sprite_smooth_ER = new Annotation_point([-27, 2, 102]);
scene.add(sprite_smooth_ER.sprite)

const sprite_lysosome = new Annotation_point([-130, 8, 60]);
scene.add(sprite_lysosome.sprite)

const sprite_membrane = new Annotation_point([-150, 4, -50]);
scene.add(sprite_membrane.sprite)

const sprite_cytsol = new Annotation_point([-100, 1, 80]);
scene.add(sprite_cytsol.sprite)

const sprite_nuclear_pore = new Annotation_point([-70, 30, -33]);
scene.add(sprite_nuclear_pore.sprite)

function update_annotation() {
    const title = document.querySelector('#title');
    const details = document.querySelector('#details');

    title.innerHTML = "<strong> Nucleous </strong>"
    details.innerHTML = "The mitochondria is the powerhouse of the cell"

}

renderer.domElement.addEventListener('click', onClick, false);

function onClick() {

    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const arrayOfObjects = [sprite_nucleous.getPoint(), sprite_mitochondria.getPoint()]

    var intersects = raycaster.intersectObjects(arrayOfObjects, true);

    console.log(intersects)
    console.log(sprite_nucleous.sprite.isObject3D)

    if (intersects.length > 0) {

        update_annotation()
        toObject(sprite_nucleous.getPoint())

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
    console.log(sprite_golgi_body.position)
}


function toDefault() {
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
    camera_focus = cell_position;
    points_visible(true);
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
            points_visible(false);
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
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)

const default_camera_position = new THREE.Vector3(0, 3.061616997868383e-15, 50);

// Helper functions

function comparePosition(i, j) {
    if (i.x == j.x && i.y == j.y && i.z == j.z) {
        return true;
    }
    return false;

}

camera.position.set(default_camera_position.x, default_camera_position.y, default_camera_position.z);
controls.update();

const light = new THREE.AmbientLight(0x404040, 1.5); // soft white light
scene.add(light);

const skylight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(skylight);

const cameralight = new THREE.DirectionalLight(0xffffff, 0.1);
scene.add(cameralight);

controls.addEventListener('change', light_update);

function light_update() {
    cameralight.position.copy(camera.position);
}


// Objects in space
const geometry = new THREE.SphereGeometry(30);
const material = new THREE.MeshLambertMaterial({ color: 0xADD8F9, transparent: true, opacity: 0.5 });
const cell_membrane = new THREE.Mesh(geometry, material);
scene.add(cell_membrane);

const test_g = new THREE.SphereGeometry(10);
const basic_red = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const example_orb = new THREE.Mesh(test_g, basic_red);
scene.add(example_orb);

// Camera moving functions
document.querySelector("#camMove").onclick = function() {
    var camPosition = camera.position.clone();
    if (comparePosition(camPosition, default_camera_position)) {
        toObject()
    } else {
        toDefault()
    }

}



function toObject() {
    var aabb = new THREE.Box3().setFromObject(example_orb);
    var center = aabb.getCenter(new THREE.Vector3());
    var size = aabb.getSize(new THREE.Vector3());

    var camPosition = camera.position.clone();
    var targPosition = example_orb.position.clone();
    var distance = camPosition.sub(targPosition);
    var direction = distance.normalize();
    var offset = distance.clone().sub(direction.multiplyScalar(1.75));
    var newPos = example_orb.position.clone().sub(offset);
    newPos.y = camera.position.y;

    var pl = gsap.timeline();

    pl.to(controls.target, {
            duration: 1,
            x: center.x - 10,
            y: center.y - 10,
            z: center.z - 10,
            // ease: "power4.in",
            ease: "circ.in",
            onUpdate: function() {
                controls.update();
            }
        })
        .to(camera.position, {
            //delay: 1.3,
            duration: 2,
            ease: "power4.out",
            // ease: "slow (0.7, 0.1, false)",    
            x: newPos.x,
            y: center.y,
            z: newPos.z,
            onUpdate: function() {
                controls.update();
            }
        });
    console.log(camera.position);
}

function toDefault() {
    console.log("To do next");
    console.log(camera.position);
}

function animate() {
    requestAnimationFrame(animate);

    // not_void.rotation.x += 0.01;
    // not_void.rotation.y += 0.01;

    controls.update();

    renderer.render(scene, camera);
}
animate();
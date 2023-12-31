import * as THREE from 'three';
import { comparePositions, compareClickWithPoint } from './helper_functions.js';
import {
    mitochondria_basic,
    mitochondria_adv,
    cell_membrane_basic,
    cell_membrane_adv,
    nucleolus_basic,
    nucleolus_adv,
    lysosome_adv,
    lysosome_basic,
    golgi_body_basic,
    golgi_body_adv,
    rough_ER_basic,
    rough_ER_adv,
    smooth_ER_basic,
    smooth_ER_adv,
    centrioles_basic,
    centrioles_adv,
    nuclear_envelope_basic,
    nuclear_envelope_adv,
    nucleus_basic,
    nucleus_adv,
    cytsol_basic,
    cytsol_adv,
    ribosome_basic,
    ribosome_adv
} from './descriptions.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Annotation_point, points_visible } from './annotation_points.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight - 40, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let mouse = new THREE.Vector2()

const controls = new OrbitControls(camera, renderer.domElement)

const default_camera_position = new THREE.Vector3(-192.185633513088, 129.31783555216967, 133.80998272738674)
const cell_position = new THREE.Vector3(0, 0, 0);
let camera_focus = cell_position

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

loader.load('3D_models/3D_cell_model_ribosomes.glb', function(full_cell_model) {

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

const raycaster = new THREE.Raycaster();
//Annotation 

let Annotation_List = []
let Sprite_List = []

function annotation_set_up(sprite_class) {
    Annotation_List.push(sprite_class)
    scene.add(sprite_class.sprite)
    Sprite_List.push(sprite_class.getPoint())
}
const sprite_nucleolus = new Annotation_point([-20, 21, -18], "Nucleolus",
    nucleolus_basic, nucleolus_adv, 0);
annotation_set_up(sprite_nucleolus)

const sprite_rough_ER = new Annotation_point([-55.5, 10, 57], "Rough Endoplasmic Recticulum", rough_ER_basic, rough_ER_adv, [-57, 41, 69]);
annotation_set_up(sprite_rough_ER)

const sprite_golgi_body = new Annotation_point([53, 9, 91], "Golgi Body", golgi_body_basic, golgi_body_adv, 0);
annotation_set_up(sprite_golgi_body)

const sprite_centrioles = new Annotation_point([-85, -2, 122], "Centrioles", centrioles_basic, centrioles_adv, 0);
annotation_set_up(sprite_centrioles)

const sprite_mitochondria = new Annotation_point([-12, 13, 162], "Mitochondria", mitochondria_basic, mitochondria_adv, 0);
annotation_set_up(sprite_mitochondria)

const sprite_smooth_ER = new Annotation_point([-35, 7, 102], "Smooth Endoplasmic Recticulum", smooth_ER_basic, smooth_ER_adv, 0);
annotation_set_up(sprite_smooth_ER)

const sprite_lysosome = new Annotation_point([-130, 8, 60], "Lysosome", lysosome_basic, lysosome_adv, 0);
annotation_set_up(sprite_lysosome)

const sprite_membrane = new Annotation_point([-150, 4, -50], "Membrane", cell_membrane_basic, cell_membrane_adv, 0);
annotation_set_up(sprite_membrane);

const sprite_nucleus = new Annotation_point([0, 30, -25], "Nucleus", nucleus_basic, nucleus_adv, 0);
annotation_set_up(sprite_nucleus);

const sprite_ribosome = new Annotation_point([-100, 1, 80], "Ribosome", ribosome_basic, ribosome_adv, 0);
annotation_set_up(sprite_ribosome);

const sprite_cytsol = new Annotation_point([-60, 2, 158], "Cytsol", cytsol_basic, cytsol_adv, 0);
annotation_set_up(sprite_cytsol);

const sprite_nuclear_envelope = new Annotation_point([-70, 30, -33], "Nuclear Envelope", nuclear_envelope_basic, nuclear_envelope_adv, [-101, 41, -24]);
annotation_set_up(sprite_nuclear_envelope)

function update_annotation(sprite, quickclick = false) {
    const title = document.querySelector('#title');
    const details = document.querySelector('#details');
    let k_level = document.getElementById('knowledge_level').checked;
    if (quickclick) {
        k_level = !k_level;
    }

    if (typeof sprite == "undefined") {
        title.innerHTML = "<strong>" + "Cell Model" + "</strong>";
        details.innerHTML = "This is a cell model for you to play around with. Feel free to click on any of the points to learn more about them.";
        return 0;
    }
    let information = sprite.information.description;
    if (k_level) {
        information = sprite.information.advanced_description;
    }
    title.innerHTML = "<strong>" + sprite.information.title + "</strong>";
    details.innerHTML = " <br>" + information;
}

function knowledge_level() {
    for (let p of Annotation_List) {
        if (compareClickWithPoint(camera_focus, p.getPosition())) {

            console.log(p.getName())

            update_annotation(p, true)
            break
        } else {
            console.log(p.getName())
        }
    }
}

const test = document.getElementById('overview');

renderer.domElement.addEventListener('click', onClick, false);

test.addEventListener("mouseover", (event) => {
    console.log("Cheedle")
});

test.addEventListener('click', knowledge_level);

function onClick() {

    event.preventDefault();
    let headerHeight = document.getElementById('header').offsetHeight
    let renderHeight = window.innerHeight + headerHeight

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(Sprite_List, true);
    if (intersects.length != 0) {
        for (let p of Annotation_List) {
            if (compareClickWithPoint(intersects[0].point, p.getPosition())) {

                console.log(p.getName())

                update_annotation(p)
                    // toObject(p.getPoint())
                toViewPosition(p);
                break
            } else {
                console.log(p.getName())
            }
        }
    }
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
    let pl = gsap.timeline();

    pl.to(camera.position, {
        overwrite: "auto",
        duration: 2,
        ease: "power4.out",
        x: default_camera_position.x,
        y: default_camera_position.y,
        z: default_camera_position.z,
        onUpdate: function() {
            controls.update();
        }
    });
    console.log("Default");
    camera_focus = cell_position;
    update_annotation();
    points_visible(true);
}

function toObject(annotation) {
    let aabb = new THREE.Box3().setFromObject(annotation);
    let center = aabb.getCenter(new THREE.Vector3());

    let camPosition = camera.position.clone();
    let targPosition = annotation.position.clone();
    let distance = camPosition.sub(targPosition);
    let direction = distance.normalize();
    let offset = distance.clone().sub(direction.multiplyScalar(2));
    let newPos = annotation.position.clone().sub(offset);
    newPos.y = camera.position.y;


    let pl = gsap.timeline();
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
    console.log(targPosition);
}

function toViewPosition(annotation) {
    const viewpoint = annotation.getViewPoint();
    console.log(viewpoint);

    let pl = gsap.timeline();
    pl.to(camera.position, {
        duration: 2.5,
        ease: "power3.in",
        x: viewpoint[0],
        y: viewpoint[1],
        z: viewpoint[2],
        onUpdate: function() {
            controls.update();
            camera.lookAt(annotation.getPosition());
        },
        onComplete: function() {
            points_visible(false);
        }
    }).to(camera.position, {
        duration: 10,
        ease: "power1.out",
        x: viewpoint[0] + 10,
        y: viewpoint[1] + 10,
    })



    let organelle_pos = annotation.getPosition();
    camera_focus = new THREE.Vector3(organelle_pos[0], organelle_pos[1], organelle_pos[2])
    console.log("The camera is : ");
    console.log(camera_focus);
}


window.addEventListener("resize", onWindowResize, false);

addEventListener("load", onWindowResize);

function onWindowResize() {
    let headerHeight = document.getElementById('header').offsetHeight
    let renderHeight = window.innerHeight - headerHeight

    let annotation_box = document.getElementById('annotation_box')
    annotation_box.style.top = headerHeight.toString() + "px"

    camera.aspect = window.innerWidth / renderHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, renderHeight);
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    camera.lookAt(camera_focus);

    renderer.render(scene, camera);
}

animate();
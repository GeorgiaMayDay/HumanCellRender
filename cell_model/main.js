import * as three from 'https://unpkg.com/three/build/three.module.js';
import { compareClickWithPoint } from './helper_functions.js';
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
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';
import { Annotation_point, points_visible } from './annotation_points.js';
import { Quiz } from './questions.js';
import { BasicTour } from './tour.js';

const scene = new three.Scene();

const camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight - 40, 0.1, 1000);

const renderer = new three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let mouse = new three.Vector2()

const controls = new OrbitControls(camera, renderer.domElement)

const default_camera_position = new three.Vector3(-192.185633513088, 129.31783555216967, 133.80998272738674)
const cell_position = new three.Vector3(-10, -10, -10);
let camera_focus = cell_position

controls.minDistance = 70;
controls.maxDistance = 500;

camera.position.set(default_camera_position.x, default_camera_position.y, default_camera_position.z);
controls.update();

//Light

const light = new three.AmbientLight(0x404040, 1.5); // soft white light
scene.add(light);

const skylight = new three.DirectionalLight(0xffffff, 0.5);
skylight.position.set(0, 100, 0)
scene.add(skylight);

const cameralight = new three.DirectionalLight(0xffffff, 0.1);
scene.add(cameralight);

const cell_light = new three.DirectionalLight(0xffffff, 0.5);
scene.add(cell_light)

controls.addEventListener('change', light_update);

function light_update() {
    cameralight.position.copy(camera.position);
}
// Objects in space
const loader = new GLTFLoader();

loader.load('3D_models/3D_cell_model_ribosomes.glb', function(full_cell_model) {

    const cell_model = full_cell_model.scene

    cell_model.position.setX(10);
    cell_model.position.setY(0);
    cell_model.position.setZ(-10);

    cell_model.scale.set(50, 50, 50)

    cell_model.name = 'cell'

    scene.add(cell_model);

}, undefined, function(error) {

    console.error(error);

});

const raycaster = new three.Raycaster();

//Annotations

let Annotation_List = []
let Sprite_List = []

function annotation_set_up(sprite_class) {
    Annotation_List.push(sprite_class)
    scene.add(sprite_class.sprite)
    Sprite_List.push(sprite_class.getPoint())
}

const sprite_nucleolus = new Annotation_point([-10, 21, -28], "Nucleolus",
    nucleolus_basic, nucleolus_adv, 0, false, [20, 40]);
annotation_set_up(sprite_nucleolus)

const sprite_rough_ER = new Annotation_point([-45.5, 10, 47], "Rough Endoplasmic Recticulum", rough_ER_basic, rough_ER_adv, [-57, 41, 69], false, [10, 10]);
annotation_set_up(sprite_rough_ER)

const sprite_golgi_body = new Annotation_point([63, 9, 81], "Golgi Body", golgi_body_basic, golgi_body_adv, 0, false, [10, 10]);
annotation_set_up(sprite_golgi_body)

const sprite_centrioles = new Annotation_point([-75, -2, 112], "Centrioles", centrioles_basic, centrioles_adv, 0, false, [10, 10]);
annotation_set_up(sprite_centrioles)

const sprite_mitochondria = new Annotation_point([-2, 13, 152], "Mitochondria", mitochondria_basic, mitochondria_adv, 0, true, [10, 10]);
annotation_set_up(sprite_mitochondria)

const sprite_smooth_ER = new Annotation_point([-25, 7, 92], "Smooth Endoplasmic Recticulum", smooth_ER_basic, smooth_ER_adv, 0, false, [10, 10]);
annotation_set_up(sprite_smooth_ER)

const sprite_lysosome = new Annotation_point([-120, 8, 50], "Lysosome", lysosome_basic, lysosome_adv, 0, false, [10, 10]);
annotation_set_up(sprite_lysosome)

const sprite_membrane = new Annotation_point([-140, 4, -60], "Membrane", cell_membrane_basic, cell_membrane_adv, 0, true, [10, 10]);
annotation_set_up(sprite_membrane);

const sprite_nucleus = new Annotation_point([10, 30, -35], "Nucleus", nucleus_basic, nucleus_adv, 0, true, [30, 10]);
annotation_set_up(sprite_nucleus);

const sprite_ribosome = new Annotation_point([-90, 1, 70], "Ribosome", ribosome_basic, ribosome_adv, 0, true, [10, 10]);
annotation_set_up(sprite_ribosome);

const sprite_cytsol = new Annotation_point([-50, 2, 148], "Cytsol", cytsol_basic, cytsol_adv, 0, true, [10, 10]);
annotation_set_up(sprite_cytsol);

const sprite_nuclear_envelope = new Annotation_point([-60, 30, -43], "Nuclear Envelope", nuclear_envelope_basic, nuclear_envelope_adv, [-101, 41, -24], false, [10, 10]);
annotation_set_up(sprite_nuclear_envelope)

// Decides what happens when you're clicking
function onClick() {
    event.preventDefault();
    let headerHeight = document.getElementById('header').offsetHeight
    let renderHeight = window.innerHeight + headerHeight
    let quiz_mode = document.getElementById('quiz_button').checked;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(Sprite_List, true);
    if (intersects.length != 0) {
        for (let p of Annotation_List) {
            if (compareClickWithPoint(intersects[0].point, p.getPosition())) {
                if (quiz_mode) {
                    update_annotation(p)
                    toViewPosition(p);
                    break;
                } else {
                    checkAnswer(p.getName());
                    break;
                }
            }
        }
    }
}

function toggle_mascot(mood) {
    let mascot = document.querySelector('#Mascot');
    if (mood = "happy") {
        mascot.src = "images/ribecca_happy.png";
    } else {
        mascot.src = "images/ribecca_neutral_right.png";
    }

}


function default_annotation() {
    const title = document.querySelector('#title');
    const details = document.querySelector('#details');
    let quiz_button = document.querySelector('#quiz_sensor');
    let tour_button = document.querySelector('#tour_sensor');
    let tour_mode = document.getElementById('tour_button').checked;

    quiz_button.style.visibility = "";
    tour_button.style.visibility = "";
    console.log(tour_mode);
    if (!tour_mode) {
        points_visible(true);
    }
    title.innerHTML = "<strong>" + "Animal Cell Model" + "</strong>";
    details.innerHTML = "This is a cell model for you to play around with. Feel free to click on any of the points to learn more about them." +
        "<br> You can answer some questions in Quiz mode by switching over the learning toggle";
    return 0;
}

function update_annotation(sprite, quickclick = false) {
    const title = document.querySelector('#title');
    const details = document.querySelector('#details');
    let k_level = document.getElementById('knowledge_level').checked;
    let tour_mode = document.getElementById('tour_button').checked;

    if (quickclick) {
        k_level = !k_level;
    }

    if (typeof sprite == "undefined") {
        return default_annotation();
    }
    let information = sprite.information.description;
    if (k_level) {
        information = sprite.information.advanced_description;
    }
    if (tour_mode) {
        information = sprite.information.basic_tour;
    }

    title.innerHTML = "<strong>" + sprite.information.title + "</strong>";
    details.innerHTML = " <br>" + information;
    hide_buttons();
}

function hide_buttons() {
    let quiz_button = document.querySelector('#quiz_sensor');
    let tour_button = document.querySelector('#tour_sensor');

    quiz_button.style.visibility = "hidden";
    tour_button.style.visibility = "hidden";
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

const knowledge_button = document.getElementById('knowledge_sensor');

knowledge_button.addEventListener('click', knowledge_level);

// Tour

let tour = new BasicTour();

const tour_button = document.getElementById('tour_sensor');

tour_button.addEventListener('click', tour_switch);

function tour_switch() {

    let tour_mode = document.getElementById('tour_button').checked;

    if (tour_mode) {
        destory_tour_sprites();
        default_annotation();
        points_visible(true);
    } else {
        set_up_tour();
    }
}

function destory_tour_sprites() {
    for (let p of tour.get_sprite_list()) {
        scene.remove(p);
    }
}

function set_up_tour() {
    let title = document.querySelector('#title');
    let details = document.querySelector('#details');
    title.innerHTML = "<strong> Welcome to Tour Mode! Click on the organelle's in order <strong>";
    details.innerHTML = "This is the GSCE tour, it'll goes through the key organelle needed for the exams and their functions";
    points_visible(false);
    for (let p of Annotation_List) {
        if (p.inTour()) {
            let tour_sprite = tour.add_tour_sprite(p);
            p.tour_sprite = tour_sprite;
            scene.add(tour_sprite);
        }
    }
}


// Quiz 

let current_quiz;

const quiz_button = document.getElementById('quiz_sensor');

quiz_button.addEventListener('click', quiz_switch);

function checkAnswer(answer) {
    let title = document.querySelector('#title');
    let details = document.querySelector('#details');
    let results_blurb = current_quiz.checkAnswerAndIncreaseScore(answer);
    details.innerHTML = results_blurb;
    if (current_quiz.checkIfQuizOver()) {
        set_up_question();
    } else {
        title.innerHTML = "<strong> Animal Cell model <strong>"
        details.innerHTML = "Well done!" +
            " You've finished the quiz with a score of: <br> <h3>" +
            current_quiz.getScore() + "/5 <h3> <br>" +
            "If you want to try the quiz again, then flip the toggle back to Quiz mode."
        $("#quiz_button").bootstrapToggle('on');
    }
}

function set_up_question() {
    let title = document.querySelector('#title');
    let details = document.querySelector('#details');

    let question = current_quiz.generateNewQuestion();

    title.innerHTML = "<strong>" + question.getQuestion() + "<strong>";
    details.innerHTML = details.innerHTML + " <br> <h3> Score <br>" + current_quiz.getScore() + "/5 <h3>"
}

function quiz_switch() {

    let quiz_mode = document.getElementById('quiz_button').checked;

    if (quiz_mode) {
        current_quiz = new Quiz();
        details.innerHTML = "There are 5 questions in this quiz."
        set_up_question();
    } else {
        default_annotation();
    }
}

//Basic and set up Navigation

function toViewPosition(annotation) {
    const viewpoint = annotation.getViewPoint();
    const pan_position = annotation.getPanPosition();

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
        x: viewpoint[0] + pan_position[0],
        y: viewpoint[1] + pan_position[1],
    })

    let organelle_pos = annotation.getPosition();
    camera_focus = new three.Vector3(organelle_pos[0], organelle_pos[1], organelle_pos[2])
    console.log("The camera is : ");
    console.log(camera_focus);
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
}

renderer.domElement.addEventListener('click', onClick, false);

document.querySelector("#camOverview").onclick = function() {
    toDefault()
}

window.addEventListener("resize", onWindowResize, false);

window.addEventListener("load", onWindowResize);


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
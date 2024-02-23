import * as THREE from 'https://unpkg.com/three/build/three.module.js';

const map = new THREE.TextureLoader().load('./images/annotation_point.png');
const annotation_material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });

export function points_visible(isVisible = true) {
    if (isVisible == true) {
        annotation_material.opacity = 1;
    } else {
        annotation_material.opacity = 0;
    }
}

export class Annotation_point {
    constructor(position, name, description, advanced_description, view_point, in_tour, pan_position, sprite) {
        this.position = position;
        this.name = name;
        this.view_point = view_point;
        this.information = new Annotation_Information(name, description, advanced_description);
        this.in_tour = in_tour;
        this.pan_position = pan_position;

        sprite = new THREE.Sprite(annotation_material);
        sprite.scale.set(15, 15, 1);
        sprite.position.set(position[0], position[1], position[2]);
        this.sprite = sprite;
    }
    getPoint() {
        return this.sprite;
    }

    inTour() {
        return this.in_tour;
    }

    getViewPoint() {
        if (this.view_point != 0) {
            return this.view_point;
        }
        return [this.position[0], this.position[1], this.position[2] + 20];
    }
    getName() {
        return this.name;
    }
    getPosition() {
        return this.position;
    }

    getPanPosition() {
        return this.pan_position;
    }

    setBasicTourDescriptionForPoint(des) {
        this.information.setBasicTourDescription(des);
    }
}

export class Annotation_Information {
    constructor(title, description, adv) {
        this.title = title;
        this.description = description;
        this.advanced_description = adv;
        this.basic_tour = "";
    }

    setBasicTourDescription(des) {
        this.basic_tour = des;
    }
}
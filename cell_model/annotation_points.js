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
    constructor(position, name, description, advanced_description, view_point, sprite) {
        this.position = position;
        this.name = name;
        this.view_point = view_point;
        this.information = new Annotation_Information(name, description, advanced_description)

        sprite = new THREE.Sprite(annotation_material);
        sprite = sprite;
        this.sprite = sprite;

        sprite.scale.set(15, 15, 1);
        sprite.position.set(position[0], position[1], position[2]);
    }
    getPoint() {
        return this.sprite;
    }
    getViewPoint() {
        console.log(this.view_point);
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
}

export class Annotation_Information {
    constructor(title, description, adv) {
        this.title = title;
        this.description = description;
        this.advanced_description = adv;
    }
}
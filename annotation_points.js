import * as THREE from 'three';

const map = new THREE.TextureLoader().load('annotation_point.png');
const annotation_material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });

export function points_visible(isVisible = true) {
    if (isVisible == true) {
        annotation_material.opacity = 1;
    } else {
        annotation_material.opacity = 0;
    }
}

export class Annotation_point {
    constructor(position, name, description, sprite) {
        this.position = position;
        this.name = name;
        this.information = new Annotation_Information(name, description)

        sprite = new THREE.Sprite(annotation_material);
        this.sprite = sprite;

        sprite.scale.set(10, 10, 1);
        sprite.position.set(position[0], position[1], position[2]);
    }
    getPoint() {
        return this.sprite;
    }
    getName() {
        return this.name;
    }
    getPosition() {
        return this.position;
    }
}

export class Annotation_Information {
    constructor(title, description) {
        this.title = title;
        this.description = description;
    }
}
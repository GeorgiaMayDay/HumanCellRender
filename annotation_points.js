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
    constructor(position, sprite) {
        this.position = position;

        sprite = new THREE.Sprite(annotation_material);
        this.sprite = sprite;

        sprite.scale.set(10, 10, 1);
        sprite.position.set(position[0], position[1], position[2]);
    }

    getPoint() {
        return this.sprite
    }
}
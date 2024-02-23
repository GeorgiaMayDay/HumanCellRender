import * as THREE from 'https://unpkg.com/three/build/three.module.js';

class Tour {
    constructor(type, organelles, tour_sprites) {
        this.type = type;
        this.organelles = organelles;
        this.tour_sprites = tour_sprites
    }
    get_Organelle_list() {
        return this.organelles;
    }
    get_Organelle_for_stage(stage_number) {
        return this.organelles[stage_number];
    }
    get_sprite_list() {
        return this.tour_sprites;
    }

}

export class BasicTour extends Tour {
    constructor() {
        let tour_sprites_list = [];
        for (let i = 0; i < 5; i++) {
            let png_number = i + 1;
            let map = new THREE.TextureLoader().load('./images/numbered_annotation_points/' + png_number + '.png');
            let tour_material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });
            let set_up_tour_sprite = new THREE.Sprite(tour_material);
            set_up_tour_sprite.scale.set(15, 15, 1);
            tour_sprites_list[i] = set_up_tour_sprite;
        }
        super("Basic", ["Nucleus", "Cytsol", "Ribosome", "Mitochondria", "Membrane"], tour_sprites_list);
    }

    add_tour_sprite(point) {
        let stage = this.organelles.indexOf(point.getName());
        console.log(point.getName());
        if (stage == -1) {
            throw new Error('There\'s something wrong with the stage names or the sprite names!');
        }
        console.log(this.tour_sprites);
        let tour_sprite = this.tour_sprites[stage];

        let position = point.getPosition();
        tour_sprite.position.set(position[0], position[1], position[2]);
        return tour_sprite;
    }
}
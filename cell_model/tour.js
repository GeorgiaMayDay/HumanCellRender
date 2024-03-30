import * as THREE from 'https://unpkg.com/three/build/three.module.js';

class Tour {
    constructor(type, organelles, tour_sprites, stage_description) {
        this.type = type;
        this.organelles = organelles;
        this.tour_sprites = tour_sprites
        this.stage_description = stage_description;
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
    get_description_list() {
        return this.stage_description;
    }

}

export class BasicTour extends Tour {
    constructor() {
        let tour_sprites_list = [];
        for (let i = 0; i < 5; i++) {
            let png_number = i + 1;
            let map = new THREE.TextureLoader().load('./images/numbered_annotation_points/' + png_number + '.png');
            let tour_material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, depthTest: false });
            let set_up_tour_sprite = new THREE.Sprite(tour_material);
            set_up_tour_sprite.scale.set(15, 15, 1);
            tour_sprites_list[i] = set_up_tour_sprite;
        }
        const stage_1_description = "This is the Nucleus! It stores and protects the cells DNA. This DNA is stored as chromosomes, which are normally found in pairs. It sends out messages from the DNA to the other organelles, so they know what to do!";
        const stage_2_description = "This is the Cytoplasm. Is is the liquid that fills the space in-between the organelle and provides structure for the cell. It’s a solvent, so chemicals produced by the cell can dissolve within it. Many crucial reactions happen within it and it helps move messages from the DNA around the cell.";
        const stage_3_description = "This is a Ribosome. They synthesize proteins. They do this by <br> 1. Reading messages from the DNA, which tell them what to build <br> 2. Then gathering amino acids floating in the cytoplasm <br> 3. Then stringing those amino acids together. <p> They are found both free floating in the cell and within embedded in the Endoplasmic Reticulum. </p>";
        const stage_4_description = "This is the Mitochondria. It creates energy for the cell by performing aerobic respiration. If a cell needs lots of energy, like a muscle, it normally has lots of mitochondria. ";
        const stage_5_description = "<p> This is the Cell Membrane; it holds the cell together and controls the movement of substances in and out of the cell. </p><p> It does this through active transport, active transport against the concentration gradient, and diffusion, the passive movement of cells from an area of higher concentration to an area of lower concentration. <br> Active transport requires energy produced by the Mitochondria .</p>";

        const stage_description = [stage_1_description, stage_2_description, stage_3_description, stage_4_description, stage_5_description];

        super("Basic", ["Nucleus", "Cytsol", "Ribosome", "Mitochondria", "Membrane"], tour_sprites_list, stage_description);
    }

    add_tour_sprite(point) {
        let stage = this.organelles.indexOf(point.getName());
        if (stage == -1) {
            throw new Error('There\'s something wrong with the stage names or the sprite names!');
        }

        point.setBasicTourDescriptionForPoint(this.stage_description[stage]);

        let tour_sprite = this.tour_sprites[stage];
        let position = point.getPosition();
        tour_sprite.position.set(position[0], position[1], position[2]);
        return tour_sprite;
    }
}
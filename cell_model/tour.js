class Tour {
    constructor(type, organelles) {
        this.type = type;
        this.organelles = organelles;
    }
    get_Organelle_list() {
        return this.organelles;
    }
    get_Organelle_for_stage(stage_number) {
        return this.organelles[stage_number];
    }

}

export class BasicTour extends Tour {
    constructor() {
        super("Basic", ["Nucleus", "Cytoplasm", "Ribosome", "Mitochondria", "Membrane"]);
    }
}
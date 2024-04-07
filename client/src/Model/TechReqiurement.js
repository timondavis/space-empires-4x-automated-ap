import TechList from "./TechList";

export class TechRequirement {
    class = '';
    level = 0;

    constructor( className = '', level = 0 ) {
        this.class = className;
        this.level = level;
    }
}

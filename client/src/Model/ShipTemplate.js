export class ShipTemplate {
    constructor( type, name, cpCost, atkPhase, atkStr, defStr, hull, requiredTech = [] ) {
        this.type = type;
        this.name = name;
        this.cpCost = cpCost;
        this.attackPhase = atkPhase;
        this.attackStrength = atkStr;
        this.defenseStrength = defStr;
        this.hullSize = hull;
        this.requiredTech = requiredTech;
    }

    type = '';
    name = '';
    cpCost = 0;
    attackPhase = '';
    attackStrength = 0;
    defenseStrength = 0;
    hullSize = 0;
    requiredTech = [];
}
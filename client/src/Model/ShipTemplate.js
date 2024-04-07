export class ShipTemplate {
    constructor( type, name, cpCost, atkPhase, atkStr, defStr, hull, requiredTech = [], maxAttack = 0, maxDefense = 0) {
        this.type = type;
        this.name = name;
        this.cpCost = cpCost;
        this.attackPhase = atkPhase;
        this.attackStrength = atkStr;
        this.defenseStrength = defStr;
        this.hullSize = hull;
        this.requiredTech = requiredTech;
        this.maxAttack = maxAttack;
        this.maxDefense = maxDefense;
    }

    type = '';
    name = '';
    cpCost = 0;
    attackPhase = '';
    attackStrength = 0;
    defenseStrength = 0;
    hullSize = 0;
    requiredTech = [];
    maxAttack = 0;
    maxDefense = 0;
}
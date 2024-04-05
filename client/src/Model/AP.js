import {AppliedTech} from "./AppliedTech";
import {ApFleet} from "./ApFleet";

export class AP {
    color = '';
    econTurn = 0;
    econRolls = 0;
    extraEcon = 0;
    fleet = 0;
    tech = 0;
    defense = 0;
    purchasedTech = [ new AppliedTech() ];
    currentFleets = [ new ApFleet() ];
    difficultyIncrement = 0;

    constructor() {
        this.purchasedTech = [];
        this.currentFleets = [];
    }
}
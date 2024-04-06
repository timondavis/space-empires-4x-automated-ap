import {AppliedTech} from "./AppliedTech";
import {ApFleet} from "./ApFleet";
import {PendingEconAddition} from "./PendingEconAddition";

export class AP {
    color = '';
    econTurn = 0;
    fleet = 0;
    tech = 0;
    defense = 0;
    purchasedTech = [ new AppliedTech() ];
    currentFleets = [ new ApFleet() ];
    difficultyIncrement = 0;
    fleets = [ new ApFleet ];
    addEconOnRound = [new PendingEconAddition()];


    constructor( difficultyIncrement = 5) {
        this.purchasedTech = [];
        this.currentFleets = [];
        this.fleets = [];
        this.addEconOnRound = [];
        this.difficultyIncrement = difficultyIncrement;
    }
}
import {AppliedTech} from "./AppliedTech";
import {ApFleet} from "./ApFleet";
import {PendingEconAddition} from "./PendingEconAddition";

export class AP {
    id = 0;
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


    /**
     *
     * @param id : number Incremental ID
     * @param difficultyIncrement Multiple of 5.  5 = Easy, 10 = Medium, 15 = Hard.
     */
    constructor( id, difficultyIncrement = 5) {
        this.id = id;
        this.purchasedTech = [];
        this.currentFleets = [];
        this.fleets = [];
        this.addEconOnRound = [];
        this.difficultyIncrement = difficultyIncrement;
    }
}
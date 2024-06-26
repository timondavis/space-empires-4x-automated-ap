import {AppliedTech} from "./AppliedTech";
import {ApFleet} from "./ApFleet";
import {PendingEconAddition} from "./PendingEconAddition";
import {ApQuery} from "../Service/ApQuery/ApQuery";

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
    addEconOnRound = [new PendingEconAddition()];

    /**
     *
     * @param id : number Incremental ID
     * @param difficultyIncrement Multiple of 5.  5 = Easy, 10 = Medium, 15 = Hard.
     * @param color : string
     */
    constructor( id, difficultyIncrement = 5, color = 'green') {
        this.id = id;
        this.purchasedTech = [];
        this.currentFleets = [];
        this.addEconOnRound = [];
        this.difficultyIncrement = difficultyIncrement;
        this.color = color;

        const apq = ApQuery.getInstance();
        apq.setApTechLevel( 'mines', 1, this );
        apq.setApTechLevel( 'move', 1, this );
        apq.setApTechLevel( 'ship_size', 1, this);
    }
}
import {ShipCount} from "./ShipCount";

export class ApFleet {
    id = 0;
    cp = 0;
    isRaider = false;
    ships = [ new ShipCount() ];

    constructor() {
        this.ships = [];
    }
}
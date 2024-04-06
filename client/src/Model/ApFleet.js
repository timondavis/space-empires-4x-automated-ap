import {ShipCount} from "./ShipCount";

export class ApFleet {
    cp = 0;
    isRaider = false;
    ships = [ new ShipCount() ];

    constructor() {
        this.ships = [];
    }
}
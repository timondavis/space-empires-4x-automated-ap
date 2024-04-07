import {ShipCount} from "./ShipCount";
import {ShipTemplate} from "./ShipTemplate";

export class ApFleet {
    cp = 0;
    isRaider = false;
    ships = [new ShipTemplate()];

    constructor() {
        this.ships = [];
    }
}
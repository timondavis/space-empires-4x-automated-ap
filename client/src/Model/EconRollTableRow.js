import {DieRange} from "./DieRange";

export class EconRollTableRow {
    econRolls = 0;
    extraEcon = 0;
    econ = new DieRange();
    fleet = new DieRange();
    tech = new DieRange();
    def = new DieRange();

    constructor( econRolls, fleetRange, techRange, defRange = null, econRange = null ) {
        this.econRolls = econRolls;
        this.econ = econRange;
        this.fleet = fleetRange;
        this.tech = techRange;
        this.def = defRange;
        this.extraEcon = 0;
    }
}
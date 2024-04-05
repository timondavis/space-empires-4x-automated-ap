import {DieRange} from "./DieRange";

export class EconRollTableRow {
    econ = new DieRange();
    fleet = new DieRange();
    tech = new DieRange();
    def = new DieRange();

    constructor( fleetRange, techRange, defRange = null, econRange = null ) {
        this.econ = econRange;
        this.fleet = fleetRange;
        this.tech = techRange;
        this.def = defRange;
    }
}
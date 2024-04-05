import {DieRange} from "./DieRange";

export class FleetLaunchTable {
    rows = [ new DieRange() ];

    constructor() {
        this.rows = [];
        this.rows[0] = null;
        this.rows[1] = new DieRange( 1, 10 );
        this.rows[2] = new DieRange( 1, 10 );
        this.rows[3] = new DieRange( 1, 5 );
        this.rows[4] = new DieRange( 1, 3 );
    }
}
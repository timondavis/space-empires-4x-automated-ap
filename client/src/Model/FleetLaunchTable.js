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
        this.rows[5] = new DieRange( 1, 4 );
        this.rows[6] = new DieRange( 1, 4 );
        this.rows[7] = new DieRange( 1, 4 );
        this.rows[8] = new DieRange( 1, 5 );
        this.rows[9] = new DieRange( 1, 5 );
        this.rows[10] = new DieRange( 1, 3 );
        this.rows[11] = new DieRange( 1, 3 );
        this.rows[12] = new DieRange( 1, 3 );
        this.rows[13] = new DieRange( 1, 10 );
        this.rows[14] = new DieRange( 1, 3 );
        this.rows[15] = new DieRange( 1, 10 );
        this.rows[16] = new DieRange( 1, 3 );
        this.rows[17] = new DieRange( 1, 10 );
        this.rows[18] = new DieRange( 1, 3 );
        this.rows[19] = new DieRange( 1, 10 );
    }
}
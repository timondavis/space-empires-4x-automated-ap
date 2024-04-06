import {DieRange} from "./DieRange";
import {EconRollTableRow} from "./EconRollTableRow";

export class EconRollTable {
    rows = [ new EconRollTableRow( new DieRange(), new DieRange() ) ]

    constructor() {
        this.rows = [];
        this.rows[0] = new EconRollTableRow( 1, new DieRange(), new DieRange(3,10), new DieRange(), new DieRange(1,2));
        this.rows[1] = new EconRollTableRow( 1, new DieRange(2,3), new DieRange(4,8), new DieRange(), new DieRange(1,1));
        this.rows[2] = new EconRollTableRow( 2, new DieRange(2,4), new DieRange(5,8), new DieRange(9,10), new DieRange(1,1));
        this.rows[3] = new EconRollTableRow( 2, new DieRange(2,5), new DieRange(6,8), new DieRange(9,10), new DieRange(1,1));
        this.rows[4] = new EconRollTableRow( 2, new DieRange(2,5), new DieRange(6,9), new DieRange(10), new DieRange(1,1));
        this.rows[5] = new EconRollTableRow( 3, new DieRange(2,6), new DieRange(7,9), new DieRange(10), new DieRange(1,1));
        this.rows[6] = new EconRollTableRow( 3, new DieRange(1,5), new DieRange(6,9), new DieRange(10));
        this.rows[7] = new EconRollTableRow( 3, new DieRange(1,5), new DieRange(6,9), new DieRange(10));
        this.rows[8] = new EconRollTableRow( 3, new DieRange(1,6), new DieRange(6,9), new DieRange(10));
        this.rows[9] = new EconRollTableRow( 4, new DieRange(1,6), new DieRange(7,9), new DieRange(10));
        this.rows[10] = new EconRollTableRow( 4, new DieRange(1,6), new DieRange(7,9), new DieRange(10));
        this.rows[11] = new EconRollTableRow( 4, new DieRange(1,6), new DieRange(7,9), new DieRange(10));
        this.rows[12] = new EconRollTableRow( 4, new DieRange(1,6), new DieRange(7,10));
        this.rows[13] = new EconRollTableRow( 4, new DieRange(1,6), new DieRange(7,10));
        this.rows[14] = new EconRollTableRow( 5, new DieRange(1,7), new DieRange(8,10));
        this.rows[15] = new EconRollTableRow( 5, new DieRange(1,7), new DieRange(8,10));
        this.rows[16] = new EconRollTableRow( 5, new DieRange(1,8), new DieRange(9,10));
        this.rows[17] = new EconRollTableRow( 5, new DieRange(1,8), new DieRange(9,10));
        this.rows[18] = new EconRollTableRow( 5, new DieRange(1,9), new DieRange(10,10));
        this.rows[19] = new EconRollTableRow( 5, new DieRange(1,9), new DieRange(10,10));
    }
}
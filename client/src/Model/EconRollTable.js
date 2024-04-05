import {DieRange} from "./DieRange";
import {EconRollTableRow} from "./EconRollTableRow";

export class EconRollTable {
    rows = [ new EconRollTableRow( new DieRange(), new DieRange() ) ]

    constructor() {
        this.rows = [];
        this.rows[0] = new EconRollTableRow( new DieRange(), new DieRange(3,10), new DieRange(), new DieRange(1,2) );
        this.rows[1] = new EconRollTableRow( new DieRange(2,3), new DieRange(4,10), new DieRange(9,10), new DieRange(1,1) );
        this.rows[2] = new EconRollTableRow( new DieRange(2,4), new DieRange(5,8), new DieRange(9,10), new DieRange(1,1) );
        this.rows[3] = new EconRollTableRow( new DieRange(2,5), new DieRange(6,8), new DieRange(9,10), new DieRange(1,1) );
        this.rows[4] = new EconRollTableRow( new DieRange(2,6), new DieRange(7,9), new DieRange(10), new DieRange(1,1) );
    }
}
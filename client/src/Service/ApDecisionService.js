import {PendingEconAddition} from "../Model/PendingEconAddition";
import {ApFleet} from "../Model/ApFleet";
import {ApQuery} from "./ApQuery";
import {TechRequirement} from "../Model/TechReqiurement";
import {TechService} from "./TechService";
import {DieRange} from "../Model/DieRange";

let _instance = null;
export class ApDecisionService {

    static getInstance() {
        if (!_instance) {
            _instance = new ApDecisionService();
        }

        return _instance;
    }

    nd10 = (n) => {
        return Math.floor(Math.random() * 10 ) + 1;
    }

    d10 = () => {
        return this.nd10(1);
    }

    adjustedRowIndex = ( index ) => {

        if ( index < 0 ) {
            index = 0;
        }

        if ( index > 19 ) {
            index = ( index % 2 ) ? 18 : 19;
        }

        return index;
    }

    /**
     * Is rolled number in die range?
     *
     * @param number
     * @param dieRange : DieRange
     */
    isNumberInRange = ( number, dieRange ) => {
        if ( ! dieRange ) {
            return false;
        }

        return (number >= dieRange.min && number <= dieRange.max );
    }

    /**
     * Roll the AP Econ and return the adjusted model.
     * @param ap : AP
     * @param econRollTable : EconRollTable
     *
     * @return AP
     */
     rollEcon = ( ap, econRollTable ) => {

         const econRow = econRollTable.rows[this.adjustedRowIndex(ap.econTurn)];

         let numberOfRolls = econRow.econRolls + econRow.extraEcon;
         let econResults = 0;
         let fleetResults = 0;
         let techResults = 0;
         let defResults = 0;
         let roll = 0;

         for( let i = 0 ; i < numberOfRolls ; i++ ) {
             roll = this.d10();

             econResults += this.isNumberInRange(roll, econRow.econ ) ? 1 : 0;
             fleetResults += this.isNumberInRange(roll, econRow.fleet) ? 1 : 0;
             techResults += this.isNumberInRange(roll, econRow.tech) ? 1 : 0;
             defResults += this.isNumberInRange(roll, econRow.def) ? 1 : 0;
         }

         if ( econResults > 0 ) {

             const pending = new PendingEconAddition();
             pending.points = econResults;
             pending.round = ap.econTurn + 3;

             ap.addEconOnRound.push( pending );
         }

         ap.fleet   += fleetResults * ap.difficultyIncrement;
         ap.tech    += techResults  * ap.difficultyIncrement;
         ap.defense += defResults   * ap.difficultyIncrement * 2;

         return ap;
    }

    /**
     * Roll the fleet die for AP and, if necessary, generate fleet.  Checks for move tech upgrade as well.
     * @param ap : AP
     * @param fleetLaunchTable : FleetLaunchTable
     */
    rollFleet = (ap, fleetLaunchTable) => {
        debugger;
        const fleetLaunchRow = fleetLaunchTable.rows[this.adjustedRowIndex(ap.econTurn)];
        const roll = this.d10();

        if ( !fleetLaunchRow?.min ) { return ap; }

        if ( this.isNumberInRange(roll, new DieRange(fleetLaunchRow.min, fleetLaunchRow.max)) && ap.fleet >= 6) {

            const fleet = new ApFleet();

            fleet.cp = ap.fleet;
            ap.fleet = 0;
            ap.currentFleets.push(fleet);

            const currentLevel = ApQuery.getInstance().getApTechLevel('move', ap);
            const newLevel     = currentLevel + 1;
            const key  = new TechRequirement();

            key.class = 'move';
            key.level = newLevel;
            const newLevelDetails = TechService.getInstance().findTech( key );

            if (this.isNumberInRange(this.d10(), new DieRange(1,4)) && newLevel <= 7 && ap.tech >= newLevelDetails.cost) {
                ApQuery.getInstance().setApTechLevel('move', currentLevel + 1, ap);
                ap.tech -= newLevelDetails.cost;
            }
        }

        return ap;
    }
}
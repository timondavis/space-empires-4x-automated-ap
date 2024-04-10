import {PendingEconAddition} from "../Model/PendingEconAddition";
import {ApFleetHelper} from "../Helper/ApFleetHelper";
import {ApAndHumanComparisonHelper} from "../Helper/ApAndHumanComparisonHelper";
import {DieHelper} from "../Helper/DieHelper";
import {EconRollResults} from "../Model/EconRollResults";
import {ApDefenseFleetHelper} from "../Helper/ApDefenseFleetHelper";
import {ApTechHelper} from "../Helper/ApTechHelper";

let _instance = null;

const humanCompareHelper = new ApAndHumanComparisonHelper();
const dieHelper = new DieHelper();

export class ApDecisionService {

    static getInstance() {
        if (!_instance) {
            _instance = new ApDecisionService();
        }

        return _instance;
    }

    /**
     * After the 20th turn, continue rotation between 19th and 20th rows on the Econ table.
     * @param index
     * @returns {number}
     */
    adjustedRowIndex = ( index ) => {

        if ( index < 0 ) {
            index = 0;
        }

        if ( index > 19 ) {
            index = ( index % 2 ) ? 19 : 18;
        }

        return index;
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
         const econRollResults = new EconRollResults();

         let numberOfRolls = econRow.econRolls + econRow.extraEcon;
         let roll = 0;

         for( let i = 0 ; i < numberOfRolls ; i++ ) {
             roll = dieHelper.d10();

             econRollResults.econ += dieHelper.isNumberInRange(roll, econRow.econ ) ? 1 : 0;
             econRollResults.fleet += dieHelper.isNumberInRange(roll, econRow.fleet) ? 1 : 0;
             econRollResults.tech += dieHelper.isNumberInRange(roll, econRow.tech) ? 1 : 0;
             econRollResults.def += dieHelper.isNumberInRange(roll, econRow.def) ? 1 : 0;
         }

         if ( econRollResults.econ > 0 ) {

             const pending = new PendingEconAddition();
             pending.points = econRollResults.econ;
             pending.round = ap.econTurn + 3;

             ap.addEconOnRound.push( pending );
         }

         ap.fleet   += econRollResults.fleet * ap.difficultyIncrement;
         ap.tech    += econRollResults.tech  * ap.difficultyIncrement;
         ap.defense += econRollResults.def   * ap.difficultyIncrement * 2;

         return ap;
    }

    /**
     * Roll the fleet die for AP and, if necessary, generate fleet.  Checks for move tech upgrade as well.
     * @param ap : AP
     * @param fleetLaunchTable : FleetLaunchTable
     * @param humanState : HumanState
     */
    rollFleet = (ap, fleetLaunchTable, humanState ) => {
        const fleetHelper = new ApFleetHelper();
        const fleetLaunchRange = fleetLaunchTable.rows[this.adjustedRowIndex(ap.econTurn)];
        let roll = dieHelper.d10();

        // Reduce roll by 2 if ap has superior Fighters against human Point Defense & sufficient fleet size.
        if ( humanCompareHelper.isHumanPointDefenseInferiorToApFighters(ap, humanState) && ap.fleet >= 25 ) {
            roll = Math.max(1, roll - 2);
        }

        // Reduce roll by 2 if ap has superior cloaking compared to human scanner tech & sufficient fleet size.
        if ( humanCompareHelper.isHumanScannersInferiorToApCloaking(ap, humanState) && ap.fleet >= 12) {
            roll = Math.max(1, roll -2 );
        }

        if ( !fleetLaunchRange?.min ) { return ap; }

        if ( dieHelper.isNumberInRange(roll, fleetLaunchRange) && ap.fleet >= 6) {
            fleetHelper.generateNewFleet( ap, humanState, humanCompareHelper, dieHelper );
        }

        return ap;
    }

    /**
     * Upgrade tech, pick out ships, inform the user and release the fleet.
     *
     * @param fleetIndex : number
     * @param humanState : HumanState
     * @param ap : AP
     *
     * @return {AP}
     */
    releaseFleet = (fleetIndex, humanState, ap) => {
        const fleetHelper = new ApFleetHelper();
        const techHelper = new ApTechHelper();
        const fleet = ap.currentFleets[fleetIndex];
        let updatedAp = techHelper.upgradeApTech( humanState, { ...ap } );
        updatedAp = fleetHelper.buyShips( fleet, humanState, updatedAp, { ...ap } );
        updatedAp.currentFleets[fleetIndex] = fleet;
        updatedAp.fleet += fleet.cp;

        return updatedAp;
    }

    /**
     * Generate a Defense Fleet
     * @param humanState : HumanState
     * @param ap : AP
     */
    releaseDefenseFleet( humanState, ap ) {
        const comparisonHelper = new ApAndHumanComparisonHelper();
        const dieHelper = new DieHelper();
        const defenseHelper = new ApDefenseFleetHelper();
        const fleetHelper = new ApFleetHelper();
        const techHelper = new ApTechHelper();

        const fleet = defenseHelper.generateNewFleet(ap, humanState, comparisonHelper, dieHelper);
        techHelper.upgradeApTech(humanState, ap, true);
        defenseHelper.launchDefensiveFleet(ap, fleet, dieHelper);
        fleetHelper.buyShips(fleet, humanState, ap, null, false );

        ap.currentFleets.push(fleet);
    }
}
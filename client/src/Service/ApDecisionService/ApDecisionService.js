import {PendingEconAddition} from "../../Model/PendingEconAddition";
import {ApFleetHelper} from "../../Helper/ApFleetHelper/ApFleetHelper";
import {ApAndHumanComparisonHelper} from "../../Helper/ApAndHumanComparisonHelper/ApAndHumanComparisonHelper";
import {DieHelper} from "../../Helper/DieHelper/DieHelper";
import {EconRollResults} from "../../Model/EconRollResults";
import {ApDefenseFleetHelper} from "../../Helper/ApDefenseFleetHelper/ApDefenseFleetHelper";
import {ApTechHelper} from "../../Helper/ApTechHelper/ApTechHelper";
import {DieRange} from "../../Model/DieRange";
import {ApQuery} from "../ApQuery/ApQuery";

let _instance = null;

const humanCompareHelper = new ApAndHumanComparisonHelper();

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
     * @param dieHelper : DieHelper
     *
     * @return AP
     */
     rollEcon = ( ap, econRollTable, dieHelper ) => {

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

             for( let i = pending.round ; i < econRollTable.rows.length ; i++ ){
                 econRollTable.rows[i].extraEcon += pending.points;
             }
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
     * @param dieHelper : DieHelper
     * @param fleetHelper : ApFleetHelper
     * @param humanCompareHelper : ApAndHumanComparisonHelper
     *
     * @return boolean // Return TRUE if fleet created, FALSE if not.
     */
    rollFleet = (ap,
                 fleetLaunchTable,
                 humanState,
                 dieHelper ,
                 fleetHelper,
                 humanCompareHelper ) => {
        const fleetLaunchRange = fleetLaunchTable.rows[this.adjustedRowIndex(ap.econTurn)]?.fleet;
        let roll = dieHelper.d10();

        // Reduce roll by 2 if ap has superior Fighters against human Point Defense & sufficient fleet size.
        if ( humanCompareHelper.isHumanPointDefenseInferiorToApFighters(ap, humanState) && ap.fleet >= 25 ) {
            roll = Math.max(1, roll - 2);
        }

        // Reduce roll by 2 if ap has superior cloaking compared to human scanner tech & sufficient fleet size.
        if ( humanCompareHelper.isHumanScannersInferiorToApCloaking(ap, humanState) && ap.fleet >= 12) {
            roll = Math.max(1, roll -2 );
        }

        if ( !fleetLaunchRange?.min ) { return false; }

        if ( dieHelper.isNumberInRange(roll, fleetLaunchRange) && ap.fleet >= 6) {
            fleetHelper.generateNewFleet( ap, humanState, humanCompareHelper, dieHelper );
            return true;
        }

        return false;
    }

    /**
     * Check for movement upgrade.  AP will consider this movement tech upgrade,specfically,
     * whenever it makes a fleet roll.
     * @param ap : AP
     * @param dieHelper : DieHelper
     */
    rollForMovementUpgrade = (ap, dieHelper) => {

        if (dieHelper.isNumberInRange(dieHelper.d10(), new DieRange(1,4))) {
            ApQuery.getInstance().buyApTechUpgrade('move', ap);
        }
    }

    /**
     * Upgrade tech, pick out ships, inform the user and release the fleet.
     *
     * @param fleetIndex : number
     * @param humanState : HumanState
     * @param ap : AP
     * @param fleetHelper : ApFleetHelper
     * @param techHelper : ApTechHelper
     *
     * @return {AP}
     */
    releaseFleet = (fleetIndex, humanState, ap, fleetHelper, techHelper) => {
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
     * @param dieHelper : DieHelper
     */
    releaseDefenseFleet( humanState, ap, dieHelper, comparisonHelper, defenseHelper, fleetHelper, techHelper ) {

        const fleet = defenseHelper.generateNewFleet(ap, humanState, comparisonHelper, dieHelper);
        techHelper.upgradeApTech(humanState, ap, true);
        defenseHelper.launchDefensiveFleet(ap, fleet, dieHelper);
        fleetHelper.buyShips(fleet, humanState, ap, null, false );

        ap.currentFleets.push(fleet);
    }
}
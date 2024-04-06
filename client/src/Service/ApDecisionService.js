import {PendingEconAddition} from "../Model/PendingEconAddition";

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
         let econRowIndex = ap.econTurn;

         if ( ap.econTurn < 0 ) {
             econRowIndex = 0;
         }

         if ( ap.econTurn > 19 ) {
             econRowIndex = ( ap.econTurn % 2 ) ? 18 : 19;
         }

         const econRow = econRollTable.rows[econRowIndex];

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
}
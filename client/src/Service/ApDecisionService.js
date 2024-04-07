import {PendingEconAddition} from "../Model/PendingEconAddition";
import {ApFleet} from "../Model/ApFleet";
import {ApQuery} from "./ApQuery";
import {TechRequirement} from "../Model/TechReqiurement";
import {TechService} from "./TechService";
import {DieRange} from "../Model/DieRange";

let _instance = null;

/**
 * Are the human's demonstrated Point Defense systems tech inferior to the AP's Fighting Systems?
 *
 * @param ap : AP
 * @param humanState : HumanState
 *
 * @reutrn boolean
 */
const isHumanPointDefenseInferiorToApFighters = (ap, humanState) => {

    const apFighterLevel = ApQuery.getInstance().getApTechLevel( 'fighter', ap )
    if (  apFighterLevel > 0 ) {
        if ( !humanState.isHumanShowedPointDefense ) {
            return true;
        }
        else if (humanState.humanPointDefenseLevel < apFighterLevel ) {
            return true;
        }
    }

    return false;
}

/**
 * Are the Human's demonstrated Scanner abilities inferior to the cloaking abilities of the AP?
 *
 * @param ap : AP
 * @param humanState : HumanState
 *
 * @return boolean
 */
const isHumanScannersInferiorToApCloaking = (ap, humanState) => {

    const apCloakingLevel = ApQuery.getInstance().getApTechLevel( 'cloaking', ap );

    if (apCloakingLevel > 0) {
        if (!humanState.isHumanHasScannerTech) {
            return true;
        } else if ( humanState.humanScannerLevel < apCloakingLevel ) {
            return true;
        }
    }

    return false;
}

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
            index = ( index % 2 ) ? 19 : 18;
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
     * @param humanState : HumanState
     */
    rollFleet = (ap, fleetLaunchTable, humanState ) => {
        const fleetLaunchRange = fleetLaunchTable.rows[this.adjustedRowIndex(ap.econTurn)];
        let roll = this.d10();

        // Reduce roll by 2 if ap has superior Fighters against human Point Defense & sufficient fleet size.
        if ( isHumanPointDefenseInferiorToApFighters(ap, humanState) && ap.fleet >= 25 ) {
            roll = Math.max(1, roll - 2);
        }

        // Reduce roll by 2 if ap has superior cloaking compared to human scanner tech & sufficient fleet size.
        if ( isHumanScannersInferiorToApCloaking(ap, humanState) && ap.fleet >= 12) {
            roll = Math.max(1, roll -2 );
        }

        if ( !fleetLaunchRange?.min ) { return ap; }

        if ( this.isNumberInRange(roll, fleetLaunchRange) && ap.fleet >= 6) {

            // Prepare new fleet
            const fleet = new ApFleet();

            fleet.cp = ap.fleet;
            ap.fleet = 0;
            fleet.isRaider = (isHumanScannersInferiorToApCloaking(ap, humanState) && fleet.cp >= 12);
            ap.currentFleets.push(fleet);

            const currentLevel = ApQuery.getInstance().getApTechLevel('move', ap);
            const newLevel     = currentLevel + 1;
            const key  = new TechRequirement();

            // 2 in 5 chance that move tech is upgraded on fleet launch.
            key.class = 'move';
            key.level = newLevel;
            if (this.isNumberInRange(this.d10(), new DieRange(1,4))) {
                ApQuery.getInstance().buyApTechUpgrade('move', ap);
            }
        }

        return ap;
    }

    /**
     * Upgrade tech, pick out ships, inform the user and release the fleet.
     *
     * @param fleet : ApFleet
     * @param humanState : HumanState
     * @param ap : AP
     *
     * @return AP
     */
    releaseFleet = (fleet, humanState, ap) => {
        ap = this.upgradeApTech( humanState, ap );
        return ap;
    }

    /**
     * Upgrade AP Tech.  Designed for use on fleet release.
     *
     * @param humanState : HumanState
     * @param ap : AP
     *
     * @return AP
     */
    upgradeApTech = (humanState, ap) => {
        const q = ApQuery.getInstance();
        const t = TechService.getInstance();
        const apPointDefenseLevel = q.getApTechLevel('point_defense', ap);
        const apMineSweepLevel = q.getApTechLevel('mine_sweep', ap);
        const apScannersLevel = q.getApTechLevel( 'scanner', ap);
        const apFighterLevel = q.getApTechLevel( 'fighter', ap);

        if ( humanState.isHumanShowedRaiders && apPointDefenseLevel === 0) {
            q.buyApTechUpgrade('point_defense', ap );
        }

        if ( humanState.isHumanUsedMines && apMineSweepLevel === 0 ) {
            q.buyApTechUpgrade('mine_sweep',  ap );
        }

        if ( humanState.isHumanShowedRaiders && humanState.humanRaiderLevel >= apScannersLevel ) {
            if( this.isNumberInRange(this.d10(), new DieRange(1,4))) {
               q.buyApTechUpgrade( 'scanner' );
            }
        }

        this.maybeUpgradeApShipSize(ap);

        if (apFighterLevel > 0 && humanState.isHumanShowedPointDefense === false) {
            if ( this.isNumberInRange(this.d10(), new DieRange(1,6))) {
                q.buyApTechUpgrade( 'fighter', ap );
            }
        }

        const candidateTech = ['attack', 'defense', 'tactics', 'cloaking', 'scanner', 'fighter', 'point_defense', 'mine_sweep' ]
        let affordableTech = q.getAvailableTechForTechNameList(candidateTech, ap);
        let techRoll = 0;
        let techChoice = '';

        while (affordableTech.length > 0) {
            techRoll = this.d10();
            techChoice = '';

            switch(techRoll) {
                case(1):
                case(2):
                    if (t.isTechInList(affordableTech, 'attack')) {
                        techChoice = 'attack;'
                        break;
                    }
                case(3):
                case(4):
                    if (t.isTechInList(affordableTech, 'defense')) {
                        techChoice = 'defense';
                        break;
                    }
                case(5):
                    if (
                        q.getApTechLevel('attack', ap) <= 2 &&
                        t.isTechInList(affordableTech, 'attack')
                    ) {
                        techChoice = 'attack';
                        break;
                    } else if (
                        q.getApTechLevel('defense', ap) <= 2 &&
                        t.isTechInList(affordableTech, 'attack')
                    ) {
                        techChoice = 'defense';
                        break;
                    } else if (t.isTechInList(affordableTech, 'tactics')) {
                        techChoice = 'tactics'
                        break;
                    }
                case(6):
                    if (
                        t.isTechInList(affordableTech, 'cloak') &&
                        !humanState.isHumanHasScannerTech &&
                        !humanState.humanScannerLevel >= 2
                    ) {
                        techChoice = 'cloaking';
                        break;
                    }
                case(7):
                    if (t.isTechInList(affordableTech, 'scanner')) {
                        techChoice = 'scanner';
                        break;
                    }
                case(8):
                    if (t.isTechInList(affordableTech, 'fighter')) {
                        techChoice = 'fighter';
                        break;
                    }
                case(9):
                    if (t.isTechInList(affordableTech, 'point_defense')) {
                        techChoice = 'point_defense'
                        break;
                    }
                case(10):
                    if (t.isTechInList(affordableTech, 'mine_sweep')) {
                        techChoice = 'mine_sweep';
                        break;
                    }
                default:
                    techChoice = 'reroll';
                    break;
            }

            if ( techChoice == 'reroll' ) {
                continue;
            }

            q.buyApTechUpgrade( techChoice, ap );
            affordableTech = q.getAvailableTechForTechNameList(candidateTech, ap);
        }

        return ap;
    }

    /**
     * Consider upgrading ship size and, if appropriate, execute upgrade.
     * @param ap : AP
     */
    maybeUpgradeApShipSize = (ap) => {
        const q = ApQuery.getInstance();
        const apShipSizeLevel = q.getApTechLevel('ship_size', ap);

        if ( apShipSizeLevel <= 6 ) {
            let shipUpgradeRange = new DieRange();
            switch( apShipSizeLevel ) {
                case 1:
                    shipUpgradeRange = new DieRange(1,10);
                    break;
                case 2:
                    shipUpgradeRange = new DieRange(1,7);
                    break;
                case 3:
                    shipUpgradeRange = new DieRange(1,6);
                    break;
                case 4:
                    shipUpgradeRange = new DieRange(1,5);
                    break;
                case 5:
                    shipUpgradeRange = new DieRange(1,3);
                    break;
                default:
                    shipUpgradeRange = null;
                    break;
            }

            if ( shipUpgradeRange && this.isNumberInRange(this.d10(), shipUpgradeRange)) {
                ApQuery.getInstance().buyApTechUpgrade('ship_size', ap);
            }
        }
    }
}
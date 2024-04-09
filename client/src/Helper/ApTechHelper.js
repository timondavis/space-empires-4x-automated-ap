import {ApQuery} from "../Service/ApQuery";
import {TechService} from "../Service/TechService";
import {DieHelper} from "./DieHelper";
import {DieRange} from "../Model/DieRange";

const dieHelper = new DieHelper();
const apq = ApQuery.getInstance();
const ts = TechService.getInstance();
const defaultTechCandidates = ['attack', 'defense', 'tactics', 'cloaking', 'scanner', 'fighter', 'point_defense', 'mine_sweep' ];

export class ApTechHelper {

    /**
     * Use the Die Table to determine which tech upgrade to apply, and purchase.
     *
     * @param ap : AP
     * @param humanState : HumanState
     *
     * @return boolean Returns FALSE if inability to buy more tech was detected, TRUE otherwise.
     */
    buyTechUpgradeFromTable(ap, humanState) {
        let techRoll = dieHelper.d10();
        let techChoice = '';
        const affordableTech = apq.getAvailableTechForTechNameList(defaultTechCandidates, ap);

        if ( ! affordableTech || affordableTech.length === 0 ) { return false; }

        switch (techRoll) {
            case(1):
            case(2):
                if (ts.isTechInList(affordableTech, 'attack')) {
                    techChoice = 'attack;'
                    break;
                }
            case(3):
            case(4):
                if (ts.isTechInList(affordableTech, 'defense')) {
                    techChoice = 'defense';
                    break;
                }
            case(5):
                if (
                    apq.getApTechLevel('attack', ap) <= 2 &&
                    ts.isTechInList(affordableTech, 'attack')
                ) {
                    techChoice = 'attack';
                    break;
                } else if (
                    apq.getApTechLevel('defense', ap) <= 2 &&
                    ts.isTechInList(affordableTech, 'attack')
                ) {
                    techChoice = 'defense';
                    break;
                } else if (ts.isTechInList(affordableTech, 'tactics')) {
                    techChoice = 'tactics'
                    break;
                }
            case(6):
                if (
                    ts.isTechInList(affordableTech, 'cloak') &&
                    !humanState.isHumanHasScannerTech &&
                    !humanState.humanScannerLevel >= 2
                ) {
                    techChoice = 'cloaking';
                    break;
                }

                if (affordableTech.length === 1) {
                    techChoice = 'cloaking';
                }
            case(7):
                if (ts.isTechInList(affordableTech, 'scanner')) {
                    techChoice = 'scanner';
                    break;
                }
            case(8):
                if (ts.isTechInList(affordableTech, 'fighter')) {
                    techChoice = 'fighter';
                    break;
                }
            case(9):
                if (ts.isTechInList(affordableTech, 'point_defense')) {
                    techChoice = 'point_defense'
                    break;
                }
            case(10):
                if (ts.isTechInList(affordableTech, 'mine_sweep')) {
                    techChoice = 'mine_sweep';
                    break;
                }
            default: break;
        }

        if (techChoice) {
            apq.buyApTechUpgrade(techChoice, ap);
        }

        return true;
    }

    /**
     *  Purchase Point Defense systems if pre-requisites are met.
     *
     * @param ap : AP
     * @param humanState : HumanState
     */
    maybeBuyPointDefense = (ap, humanState) => {
        if (humanState.isHumanShowedRaiders && apq.getApTechLevel('point_defense', ap) === 0) {
            apq.buyApTechUpgrade('point_defense', ap);
        }
    }

    /**
     * Purchase Mine Sweeper systems if pre-requisites are met.
     *
     * @param ap : AP
     * @param humanState : HumanState
     */
    maybeBuyMineSweep = (ap, humanState) => {
        if (humanState.isHumanUsedMines && apq.getApTechLevel('mine_sweep', ap) === 0) {
            apq.buyApTechUpgrade('mine_sweep', ap);
        }
    }

    /**
     * Purchase Scanner systems if pre-requisites are met.
     *
     * @param ap
     * @param humanState
     */
    maybeBuyScanners = (ap, humanState) => {
        if (humanState.isHumanShowedRaiders && humanState.humanRaiderLevel >= apq.getApTechLevel('scanner', ap)) {
            if (dieHelper.isNumberInRange(dieHelper.d10(), new DieRange(1, 4))) {
                apq.buyApTechUpgrade('scanner');
            }
        }
    }

    /**
     * Consider upgrading ship size and, if appropriate, execute upgrade.
     *
     * @param ap : AP
     */
    maybeBuyShipSizeUpgrade = (ap) => {
        const apShipSizeLevel = apq.getApTechLevel('ship_size', ap);

        if (apShipSizeLevel <= 6) {
            let shipUpgradeRange = new DieRange();
            switch (apShipSizeLevel) {
                case 1:
                    shipUpgradeRange = new DieRange(1, 10);
                    break;
                case 2:
                    shipUpgradeRange = new DieRange(1, 7);
                    break;
                case 3:
                    shipUpgradeRange = new DieRange(1, 6);
                    break;
                case 4:
                    shipUpgradeRange = new DieRange(1, 5);
                    break;
                case 5:
                    shipUpgradeRange = new DieRange(1, 3);
                    break;
                default:
                    shipUpgradeRange = null;
                    break;
            }

            if (shipUpgradeRange && dieHelper.isNumberInRange(dieHelper.d10(), shipUpgradeRange)) {
                apq.buyApTechUpgrade('ship_size', ap);
            }
        }
    }

    /**
     *
     * @param ap : AP
     * @param humanState : HumanState
     */
    maybeBuyFighterUpgrade = (ap, humanState) => {
        if (apq.getApTechLevel('fighter', ap) > 0 && humanState.isHumanShowedPointDefense === false) {
            if ( dieHelper.isNumberInRange(dieHelper.d10(), new DieRange(1,6))) {
                apq.buyApTechUpgrade( 'fighter', ap );
            }
        }
    }
}
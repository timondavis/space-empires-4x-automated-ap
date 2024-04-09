import {PendingEconAddition} from "../Model/PendingEconAddition";
import {ApFleet} from "../Model/ApFleet";
import {ApQuery} from "./ApQuery";
import {TechRequirement} from "../Model/TechReqiurement";
import {DieRange} from "../Model/DieRange";
import {ShipService} from "./ShipService";
import {ApTechHelper} from "../Helper/ApTechHelper";
import {ApFleetHelper} from "../Helper/ApFleetHelper";
import {ApAndHumanComparisonHelper} from "../Helper/ApAndHumanComparisonHelper";
import {DieHelper} from "../Helper/DieHelper";

let _instance = null;

const humanCompareHelper = new ApAndHumanComparisonHelper();
const fleetHelper = new ApFleetHelper();
const techHelper = new ApTechHelper();
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

         let numberOfRolls = econRow.econRolls + econRow.extraEcon;
         let econResults = 0;
         let fleetResults = 0;
         let techResults = 0;
         let defResults = 0;
         let roll = 0;

         for( let i = 0 ; i < numberOfRolls ; i++ ) {
             roll = dieHelper.d10();

             econResults += dieHelper.isNumberInRange(roll, econRow.econ ) ? 1 : 0;
             fleetResults += dieHelper.isNumberInRange(roll, econRow.fleet) ? 1 : 0;
             techResults += dieHelper.isNumberInRange(roll, econRow.tech) ? 1 : 0;
             defResults += dieHelper.isNumberInRange(roll, econRow.def) ? 1 : 0;
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

            // Prepare new fleet
            const fleet = new ApFleet();

            fleet.cp = ap.fleet;
            ap.fleet = 0;
            fleet.isRaider = (humanCompareHelper.isHumanScannersInferiorToApCloaking(ap, humanState) && fleet.cp >= 12);
            ap.currentFleets.push(fleet);

            const currentLevel = ApQuery.getInstance().getApTechLevel('move', ap);
            const newLevel     = currentLevel + 1;
            const key  = new TechRequirement();

            // 2 in 5 chance that move tech is upgraded on fleet launch.
            key.class = 'move';
            key.level = newLevel;
            if (dieHelper.isNumberInRange(dieHelper.d10(), new DieRange(1,4))) {
                ApQuery.getInstance().buyApTechUpgrade('move', ap);
            }
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
     * @return ApFleet
     */
    releaseFleet = (fleetIndex, humanState, ap) => {
        const fleet = ap.currentFleets[fleetIndex];
        let updatedAp = this.upgradeApTech( humanState, { ...ap } );
        updatedAp = this.buyShips( fleet, humanState, updatedAp, { ...ap } );
        updatedAp.currentFleets[fleetIndex] = fleet;

        return updatedAp;
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
        techHelper.maybeBuyPointDefense(ap, humanState);
        techHelper.maybeBuyMineSweep(ap, humanState);
        techHelper.maybeBuyScanners(ap, humanState);
        techHelper.maybeBuyShipSizeUpgrade(ap);
        techHelper.maybeBuyFighterUpgrade(ap, humanState);

        try {
            let keepPurchasing = false;
            let loopEscape = 0;
            do {
                keepPurchasing = techHelper.buyTechUpgradeFromTable( ap, humanState );
                loopEscape++;

                if ( loopEscape >= 100 ) {
                    throw 'Infinite Loop Error';
                }
            } while ( keepPurchasing);
        } catch( ex ) {
            console.warn( 'Tech Upgrade Loop exceeded escape threshold.' );
        }

        return ap;
    }

    /**
     * Ship purchase routine, associated with Fleet Release
     *
     * @param fleet : ApFleet
     * @param humanState : HumanState
     * @param ap : AP
     * @param oldAp : AP
     */
    buyShips( fleet, humanState, ap, oldAp  ) {
        const ss = ShipService.getInstance();
        const apq = ApQuery.getInstance();
        let isCarrierFleet = false;

        if (fleet.isRaider) {
           return this.buyAllRaiders(fleet, ap);
        }

        if (apq.getApTechLevel( 'fighter', ap ) > 0) {
            const carrier = ss.getShipByCode('CV');
            const fighter = ss.getShipByCode('F');
            if ( ! humanState.isHumanShowedPointDefense || dieHelper.isNumberInRange(dieHelper.d10(), new DieRange(1,4))) {
               while ( fleet.cp >= (carrier.cpCost + (fighter.cpCost * 3)) ) {
                   apq.buyApShip(carrier, ap, fleet);
                   apq.buyApShip(fighter, ap, fleet);
                   apq.buyApShip(fighter, ap, fleet);
                   apq.buyApShip(fighter, ap, fleet);
                   isCarrierFleet = true;
               }
            }
        }

        if ( ! isCarrierFleet && fleet.cp >= 12 ) {
            if (
                apq.getApTechLevel('cloaking', oldAp) === 0 &&
                apq.getApTechLevel( 'cloaking', ap ) > humanState.humanScannerLevel
            ) {
                return this.buyAllRaiders(fleet, ap);
            }
        }

        this.buyMostExpensiveShipAvailable(fleet, ap);

        let roll = dieHelper.d10();
        let oneOffScoutsAssessed = false;
        while( fleet.cp >= 6 ) {

            if ( !oneOffScoutsAssessed && humanState.isHumanHasUsedFighters && apq.getApTechLevel('point_defense') > 0) {
                oneOffScoutsAssessed = true;
                roll -= 2;
                roll = Math.max(roll, 1);

                if (roll >= 4) {
                    const cvs = apq.countShipsInFleet( 'CV', fleet );
                    const fighters = apq.countShipsInFleet( 'F', fleet );

                    if ( cvs < 1 || fighters < 3 ) {
                        const scout = ss.getShipByCode('SC');
                        apq.buyApShip( scout, ap, fleet );
                        apq.buyApShip( scout, ap, fleet );
                    }
                }
            }

            switch(roll) {
                case(1):
                case(2):
                case(3):
                    this.buyLargestFleet(fleet, ap);
                    break;
                case(4):
                case(5):
                case(6):
                    this.buyBalancedFleet(fleet, ap);
                    break;
                case(7):
                case(8):
                case(9):
                case(10):
                    this.buyMostExpensiveFleet(fleet, ap);
                    break;
                default:
                    throw 'Bad State in Ship Purchase Loop';
            }
        }

        return ap;
    }

    /**
     * Buy All Raider Ships for AP
     *
     * @param fleet : ApFleet
     * @param ap : AP
     */
    buyAllRaiders( fleet, ap ) {
        const ss = ShipService.getInstance();
        const apq = ApQuery.getInstance();

        const raider = ss.getShipByCode( 'R' );

        while( fleet.cp > raider.cpCost ) {
            apq.buyApShip( raider, ap, fleet );
        }

        return ap;
    }

    /**
     * Buy the largest fleet possible for the AP (ie spend all avilable money on smallest ships)
     *
     * @param fleet
     * @param ap
     */
    buyLargestFleet = ( fleet, ap ) => {
        const ss = ShipService.getInstance();
        const apq = ApQuery.getInstance();

        let candidates = ss.filterToApFleetShips();
        candidates = apq.getApEligibleShipsOnList(candidates, ap, fleet.cp);
        const leastExpensiveShip = ss.getLeastExpensiveOnList( candidates );

        while( leastExpensiveShip && fleet.cp >= leastExpensiveShip.cpCost ) {
            apq.buyApShip( leastExpensiveShip, ap, fleet);
        }
    }

    /**
     * Buy a balanced fleet for the AP
     *
     * @param fleet : ApFleet
     * @param ap : AP
     */
    buyBalancedFleet = ( fleet, ap ) => {
        const ss = ShipService.getInstance();
        const apq = ApQuery.getInstance();

        const apAttack = apq.getApTechLevel( 'attack', ap );
        const apDefense = apq.getApTechLevel( 'defense', ap );

        let candidates = ss.filterToApFleetShips();
        candidates = apq.getApEligibleShipsOnList( candidates, ap, fleet.cp );
        candidates = candidates.filter((ship) => {
            return ship.maxAttack >= apAttack && ship.maxDefense >= apDefense;
        })

        let mostExpensiveShip = null;
        while ( candidates && candidates.length > 0 ) {
            mostExpensiveShip = ss.getMostExpensiveOnList(candidates);
            apq.buyApShip(mostExpensiveShip, ap, fleet);
            candidates = apq.getApEligibleShipsOnList( candidates, ap, fleet.cp );
            candidates = candidates.filter((ship) => {
                return ship.maxAttack >= apAttack && ship.maxDefense >= apDefense;
            })
        }

        if ( fleet.cp >= 6 ) {
            this.buyMostExpensiveFleet(fleet, ap);
        }
    }

    /**
     * Buy the most expensive fleet
     *
     * @param fleet : ApFleet
     * @param ap : AP
     */
    buyMostExpensiveFleet( fleet, ap ) {
        const ss = ShipService.getInstance();
        const apq = ApQuery.getInstance();

        let candidates = ss.filterToApFleetShips();
        let mostExpensiveShip = null;
        candidates = apq.getApEligibleShipsOnList(candidates, ap, fleet.cp)

        while( candidates.length > 0) {
            mostExpensiveShip = ss.getMostExpensiveOnList( candidates );
            apq.buyApShip(mostExpensiveShip, ap, fleet );
            candidates = apq.getApEligibleShipsOnList(candidates, ap, fleet.cp)
        }
    }

    /**
     * Buy the most expensive ship available to the AP
     *
     * @param fleet : ApFleet
     * @param ap : AP
     */
    buyMostExpensiveShipAvailable = (fleet, ap) => {
        const ss = ShipService.getInstance();
        const apq = ApQuery.getInstance();

        let candidates = ss.filterToApFleetShips();
        candidates = apq.getApEligibleShipsOnList(candidates, ap, fleet.cp);
        const mostExpensiveShip = ss.getMostExpensiveOnList( candidates );

        if ( mostExpensiveShip ) {
            apq.buyApShip(mostExpensiveShip, ap, fleet);
        }
    }
}
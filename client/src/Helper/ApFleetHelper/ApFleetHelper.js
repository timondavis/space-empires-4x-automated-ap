import {ApFleet} from "../../Model/ApFleet";
import {ApQuery} from "../../Service/ApQuery/ApQuery";
import {TechRequirement} from "../../Model/TechReqiurement";
import {DieRange} from "../../Model/DieRange";
import {ApAndHumanComparisonHelper} from "../ApAndHumanComparisonHelper/ApAndHumanComparisonHelper";
import {ShipService} from "../../Service/ShipService/ShipService";
import {DieHelper} from "../DieHelper/DieHelper";

const dieHelper = new DieHelper();

export class ApFleetHelper {

    /**
     * Generate a new fleet
     * @param ap : AP
     * @param humanState : HumanState
     * @param humanCompareHelper : ApAndHumanComparisonHelper
     * @param dieHelper : DieHelper
     */
    generateNewFleet = (ap, humanState, humanCompareHelper, dieHelper) => {
        // Prepare new fleet
        const fleet = new ApFleet();

        fleet.cp = ap.fleet;
        ap.fleet = 0;
        fleet.isRaider = (humanCompareHelper.isHumanScannersInferiorToApCloaking(ap, humanState) && fleet.cp >= 12);

        ap.currentFleets.push(fleet);
    }

    /**
     * Ship purchase routine, associated with Fleet Release
     *
     * @param fleet : ApFleet
     * @param humanState : HumanState
     * @param ap : AP
     * @param oldAp : AP
     * @param isRaidersAllowed : boolean
     */
    buyShips( fleet, humanState, ap, oldAp, isRaidersAllowed = true ) {
        let isCarrierFleet = false;

        if (this.maybeBuyAllRaiders(ap, oldAp, fleet, humanState, isCarrierFleet, isRaidersAllowed)) {
            return;
        }

        isCarrierFleet = this.maybeBuyFighters(ap, fleet, humanState);

        // Reconsider raiders after considering carrier fleet.
        if ( this.maybeBuyAllRaiders(ap, oldAp, fleet, humanState, isCarrierFleet, isRaidersAllowed)) {
            return;
        }

        this.buyMostExpensiveShipAvailable(ap, fleet);

        let roll = dieHelper.d10();
        this.maybeBuyBonusScouts(ap, fleet, humanState, roll)
        this.buyRemainderOfShipsByStrategy(ap, fleet, roll);

        return ap;
    }

    /**
     * Based on die roll, execute a given strategy for buying the remainder of ships for the fleet.
     *
     * @param ap : AP
     * @param fleet : ApFleet
     * @param roll : number
     */
    buyRemainderOfShipsByStrategy = (ap, fleet, roll) => {
        switch(roll) {
            case(1):
            case(2):
            case(3):
                this.buyLargestFleet(ap, fleet);
                break;
            case(4):
            case(5):
            case(6):
                this.buyBalancedFleet(ap, fleet);
                break;
            case(7):
            case(8):
            case(9):
            case(10):
                this.buyMostExpensiveFleet(ap, fleet);
                break;
            default:
                throw 'Bad State in Ship Purchase Loop';
        }
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
     * @param ap : AP
     * @param fleet ApFleet
     */
    buyLargestFleet = ( ap, fleet ) => {
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
     * @param ap : AP
     * @param fleet : ApFleet
     */
    buyBalancedFleet = ( ap, fleet ) => {
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
            this.buyMostExpensiveFleet(ap, fleet);
        }
    }

    /**
     * Buy the most expensive fleet
     *
     * @param ap : AP
     * @param fleet : ApFleet
     */
    buyMostExpensiveFleet( ap, fleet ) {
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
     * @param ap : AP
     * @param fleet : ApFleet
     */
    buyMostExpensiveShipAvailable = (ap, fleet) => {
        const ss = ShipService.getInstance();
        const apq = ApQuery.getInstance();

        let candidates = ss.filterToApFleetShips();
        candidates = apq.getApEligibleShipsOnList(candidates, ap, fleet.cp);
        const mostExpensiveShip = ss.getMostExpensiveOnList( candidates );

        if ( mostExpensiveShip ) {
            apq.buyApShip(mostExpensiveShip, ap, fleet);
        }
    }

    /**
     * Buy carriers and fighters if pre-requisites are met.
     *
     * @param ap : AP
     * @param fleet : ApFleet
     * @param humanState : HumanState
     *
     * @returns {boolean}
     */
    maybeBuyFighters = (ap, fleet, humanState) => {
        const ss = ShipService.getInstance();
        const apq = ApQuery.getInstance();

        let isCarrierFleet = false;

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

        return isCarrierFleet;
    }

    /**
     * Consider conditions for raider fleet.  If conditions met, buy all raider fleet.
     * @param ap : AP
     * @param oldAp : AP
     * @param fleet : ApFleet
     * @param humanState : HumanState
     * @param isCarrierFleet : boolean
     * @param isRaidersAllowed : boolean
     * @returns {boolean}
     */
    maybeBuyAllRaiders( ap, oldAp, fleet, humanState, isCarrierFleet , isRaidersAllowed) {
        const apq = ApQuery.getInstance();

        if ( !isRaidersAllowed ) { return false; }

        if (fleet.isRaider) {
            this.buyAllRaiders(fleet, ap);
            return true;
        }

        if ( ! isCarrierFleet && fleet.cp >= 12 ) {
            if (
                apq.getApTechLevel('cloaking', oldAp) === 0 &&
                apq.getApTechLevel( 'cloaking', ap ) > humanState.humanScannerLevel
            ) {
                this.buyAllRaiders(fleet, ap);
                return true;
            }
        }

        return false;
    }

    /**
     * If pre-conditions are met, buy a couple of scout ships.
     *
     * @param ap : AP
     * @param fleet : ApFleet
     * @param humanState : HumanState
     * @param roll : number
     */
    maybeBuyBonusScouts = (ap, fleet, humanState, roll) => {
        const ss = ShipService.getInstance();
        const apq = ApQuery.getInstance();

        if ( humanState.isHumanHasUsedFighters && apq.getApTechLevel('point_defense', ap) > 0) {
            roll -= - 2;
            roll = Math.max(roll, 1);

            if (roll <= 4) {
                const cvs = apq.countShipsInFleet( 'CV', fleet );
                const fighters = apq.countShipsInFleet( 'F', fleet );

                if ( cvs < 1 || fighters < 3 ) {
                    const scout = ss.getShipByCode('SC');
                    apq.buyApShip( scout, ap, fleet );
                    apq.buyApShip( scout, ap, fleet );
                }
            }
        }
    }
}
import {ApFleet} from "../../Model/ApFleet";
import {ShipService} from "../../Service/ShipService/ShipService";

export class ApDefenseFleetHelper {

    /**
     *
     * @param ap : AP
     * @param humanState : HumanState
     * @param humanCompareHelper : ApAndHumanComparisonHelper
     * @param dieHelper : DieHelper
     *
     * @return {ApFleet}
     */
    generateNewFleet = (ap, humanState, humanCompareHelper, dieHelper) => {
        const fleet = new ApFleet();

        fleet.cp = ap.fleet;
        ap.fleet = 0;
        fleet.isRaider = false;

        return fleet;
    }

    /**
     * Launch a defense-only fleet. Presumably this is appended by a classic fleet (barring raiders).
     * @param ap : AP
     * @param fleet : ApFleet
     * @param dieHelper : DieHelper
     */
    launchDefensiveFleet = ( ap, fleet, dieHelper ) => {
        let roll = dieHelper.d10();
        this.launchShipsByStrategy(ap, fleet, roll);
    }

    /**
     * Launch defense ships by strategy (based on die roll)
     *
     * @param ap : AP
     * @param fleet : ApFleet
     * @param roll : number
     */
    launchShipsByStrategy = (ap, fleet, roll) => {
        switch(roll) {
            case (1):
            case (2):
            case (3):
                this.buyAllMines(ap, fleet);
                break;
            case (4):
            case (5):
            case (6):
            case (7):
                this.buyBalanced(ap, fleet);
                break;
            case (8):
            case (9):
            case (10):
                this.buyBasesThenMines(ap, fleet);
                break;
            default: break;
        }
    }

    /**
     * Spend all available AP Defense funds on mines.
     *
     * @param ap : AP
     * @param fleet : ApFleet
     */
    buyAllMines = (ap, fleet) => {
        const ss = ShipService.getInstance();
        const mines = ss.getShipByCode( 'Mines' );
        while (ap.defense >= mines.cpCost ) {
            fleet.ships.push( mines );
            ap.defense -= mines.cpCost;
        }
    }

    /**
     * Spend all available AP Defense funds on Mines and Bases, in maximum balance.
     *
     * @param ap : AP
     * @param fleet : ApFleet
     */
    buyBalanced = (ap, fleet) => {

        const ss = ShipService.getInstance();
        const mines = ss.getShipByCode( 'Mines' );
        const base = ss.getShipByCode( 'Base' );
        while (ap.defense >= mines.cpCost) {
            if (ap.defense >= base.cpCost) {
                fleet.ships.push(base);
                ap.defense -= base.cpCost;
            }
            if ( ap.defense >= mines.cpCost) {
                fleet.ships.push(mines);
                ap.defense -= mines.cpCost;
            }
        }
    }

    /**
     * Spend all money possible on bases, then the remainder on mines.
     *
     * @param ap : AP
     * @param fleet : ApFleet
     */
    buyBasesThenMines = (ap, fleet) => {
        const ss = ShipService.getInstance();
        const mines = ss.getShipByCode( 'Mines' );
        const base = ss.getShipByCode( 'Base' );

        while (ap.defense >= base.cost) {
            fleet.ships.push(base);
            ap.defense -= base.cpCost;
        }

        while (ap.defense >= mines.cost) {
            fleet.ships.push(mines);
            ap.defense -= mines.cost;
        }
    }
}
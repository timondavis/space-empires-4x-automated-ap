import {ShipList} from "../../Model/ShipList";

let _instance = null;
const shipList  = ShipList;

const buildTypeIndex = () => {
    const index = {};

    shipList.forEach((ship) => {
        index[ship.type] = ship;
    });

    return index;
}

const indexByType = buildTypeIndex();

export class ShipService {

    /**
     * @returns ShipService
     */
    static getInstance = () => {

        if ( ! _instance ) {
            _instance = new ShipService();
        }

        return _instance;
    }

    /**
     * Get a sublist of all listed ships within budget.
     *
     * @param budget : number
     * @param list : ShipTemplate[]
     * @returns {ShipTemplate[]}
     */
    getShipsInBudget = ( budget , list= null) => {
        list = (list) ? list : shipList;
        return list.filter((item) => item.cpCost <= budget );
    }

    /**
     * Get a sublist of all listed ships available to AP for fleet purchases.
     * @param list : ShipTemplate[]
     * @return {ShipTemplate[]}
     */
    filterToApFleetShips = ( list = null ) => {
        list = ( list ) ? list : shipList;
        const candidates = [ 'SC', 'DD', 'CA', 'BC', 'BB', 'DN' ];
        return list.filter((item) => candidates.includes(item.type) ) ;
    }

    /**
     * Get a sublist of all listed ships available to AP for Defense purchases.
     * @param list
     * @returns {ShipTemplate[]}
     */
    filterToApDefenseShips = ( list = null ) => {
        list = ( list ) ? list : shipList;
        const candidates = ['Mines', 'Base']
        return list.filter((item) => candidates.includes(item.type));
    }

    /**
     * Get the most expensive ship on the list
     * @param list : ShipTemplate[]
     * @returns ShipTemplate;
     */
    getLeastExpensiveOnList = (list = null) => {
        list = (list) ? list : shipList;

        list.sort((a, b) => {
            if ( a.cpCost > b.cpCost ) { return 1;}
            if ( a.cpCost < b.cpCost ) { return -1;}
            return 0;
        })

        return list[0];
    }

    /**
     * Get the least expensive ship on the list
     * @param list : ShipTemplate[]
     * @returns ShipTemplate;
     */
    getMostExpensiveOnList = (list = null) => {
        list = (list) ? list : shipList;

        list.sort((a, b) => {
            if ( a.cpCost > b.cpCost ) { return -1;}
            if ( a.cpCost < b.cpCost ) { return 1;}
            return 0;
        })

        return list[0];
    }

    /**
     * Get a ship by its code.
     *
     * @param code : string
     * @returns {ShipTemplate|null}
     */
    getShipByCode = ( code ) => {
        if (code in indexByType) {
            return indexByType[code];
        }

        return null;
    }
}
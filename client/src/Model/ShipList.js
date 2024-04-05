import {ShipTemplate} from "./ShipTemplate";

export class ShipList {
    sc = new ShipTemplate('SC', 'Scout', 6, 'E', 3, 0, 1);
    dd = new ShipTemplate('DD', 'Destroyer', 9, 'D', 4 , 0, 1 );
    ca = new ShipTemplate('CA', 'Cruiser', 12, 'C', 4, 1, 2 );
    bc = new ShipTemplate('BC', 'Battlecruiser', 15, 'B', 5, 1 , 2)

}
import {ShipTemplate} from "./ShipTemplate";

export class ShipList {
    sc = new ShipTemplate('SC', 'Scout', 6, 'E', 3, 0, 1,
        [{class: 'ship_size', level: 1} ]);
    dd = new ShipTemplate('DD', 'Destroyer', 9, 'D', 4 , 0, 1,
        [{class: 'ship_size', level: 2}]);
    ca = new ShipTemplate('CA', 'Cruiser', 12, 'C', 4, 1, 2,
        [{class: 'ship_size', level: 3}]);
    bc = new ShipTemplate('BC', 'Battlecruiser', 15, 'B', 5, 1 , 2,
        [{class: 'ship_size', level: 4}]);
    bb = new ShipTemplate( 'BB', 'Battleship', 20, 'A', 5, 2, 3,
        [{class: 'ship_size', level: 5}]);
    dn = new ShipTemplate( 'DN', 'Dreadnaught', 24, 'A', 6, 3, 3,
       [{class: 'ship_size', level: 6}]);
    co = new ShipTemplate( 'CO', 'Colony Ship', 8, '', 0, 0, 1,
        [{class: 'ship_size', level: 1}]);
    base = new ShipTemplate( 'Base', 'Base', 12, 'A', 7, 2, 3,
        [{class: 'ship_size', level: 1}]);
    miner = new ShipTemplate( 'Miner', 'Miner', 5, '', 0, 0, 1,
        [{class: 'ship_size', level: 1}]);
    decoy = new ShipTemplate( 'Decoy', 'Decoy', 1, '', 0, 0, 0,
        [{class: 'ship_size', level: 0}]);
    sy = new ShipTemplate( 'SY', 'Ship Yard', 6, 'C', 3, 0, 1,
        [{class: 'ship_size', level: 1}]);

    r = new ShipTemplate( 'R', 'Raider', 12, 'D', 4, 0, 2,
        [{class: 'cloaking', level: 1}]);
    cv = new ShipTemplate( 'CV', 'Carrier', 12, 'E', 3, 0, 1,
        [{class: 'fighter', level: 1}]);
    f = new ShipTemplate( 'F', 'Fighter', 5, 'B', 5, 0, 1,
        [{class: 'fighter', level: 1}]);
    ms_pipeline = new ShipTemplate( 'MS Pipeline', 'MS Pipeline', 3, '', 0, 0, 1,
        [{class: 'ship_size', level: 1}]);
    mines = new ShipTemplate( 'Mines', 'Mines', 5, '', 0, 0, 1,
        [{class: 'mines', level: 1}]);
    sw = new ShipTemplate('SW', 'Mine Sweeper', 6, 'E', 1, 0, 1,
        [{class: 'mine_sweeper', level: 1}]);
}
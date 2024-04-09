import {Tech} from "./Tech";
/**
 * @type {Tech[]}
 */
export const TechList = [
    Object.assign( new Tech(),{ label : 'Ship Size 1', class: 'ship_size', level: 1, cost: 0  }),
    Object.assign( new Tech(), { label : 'Ship Size 2', class: 'ship_size', level: 2, cost: 10 }),
    Object.assign( new Tech(), { label : 'Ship Size 3', class: 'ship_size', level: 3, cost: 15 }),
    Object.assign( new Tech(), { label : 'Ship Size 4', class: 'ship_size', level: 4, cost: 20 }),
    Object.assign( new Tech(), { label : 'Ship Size 5', class: 'ship_size', level: 5, cost: 20 }),
    Object.assign( new Tech(), { label : 'Ship Size 6', class: 'ship_size', level: 6, cost: 20 }),

    Object.assign( new Tech(), { label : 'Attack 0', class: 'attack', level: 0, cost: 0 }),
    Object.assign( new Tech(), { label : 'Attack 1', class: 'attack', level: 1, cost: 20 }),
    Object.assign( new Tech(), { label : 'Attack 2', class: 'attack', level: 2, cost: 30 }),
    Object.assign( new Tech(), { label : 'Attack 3', class: 'attack', level: 3, cost: 25 }),

    Object.assign( new Tech(), { label : 'Defense 0', class: 'defense', level: 0, cost: 0 }),
    Object.assign( new Tech(), { label : 'Defense 1', class: 'defense', level: 1, cost: 20 }),
    Object.assign( new Tech(), { label : 'Defense 2', class: 'defense', level: 2, cost: 30 }),
    Object.assign( new Tech(), { label : 'Defense 3', class: 'defense', level: 3, cost: 25 }),

    Object.assign( new Tech(),  { label : 'Tactics 0', class: 'tactics', level: 0, cost: 0 }),
    Object.assign( new Tech(),  { label : 'Tactics 1', class: 'tactics', level: 1, cost: 15 }),
    Object.assign( new Tech(),  { label : 'Tactics 2', class: 'tactics', level: 2, cost: 15 }),
    Object.assign( new Tech(),  { label : 'Tactics 3', class: 'tactics', level: 3, cost: 15 }),

    Object.assign( new Tech(), { label : 'Move 1', class: 'move', level: 1, cost: 0 }),
    Object.assign( new Tech(), { label : 'Move 2', class: 'move', level: 2, cost: 20 }),
    Object.assign( new Tech(), { label : 'Move 3', class: 'move', level: 3, cost: 25 }),
    Object.assign( new Tech(), { label : 'Move 4', class: 'move', level: 4, cost: 25 }),
    Object.assign( new Tech(), { label : 'Move 5', class: 'move', level: 5, cost: 25 }),
    Object.assign( new Tech(), { label : 'Move 6', class: 'move', level: 6, cost: 20 }),
    Object.assign( new Tech(),      { label : 'Move 7', class: 'move', level: 7, cost: 20 }),

    Object.assign( new Tech(),      { label : 'Terraform 0', class: 'terraform', level: 0, cost: 0 }),
    Object.assign( new Tech(),      { label : 'Terraform 1', class: 'terraform', level: 1, cost: 20 }),

    Object.assign( new Tech(),      { label : 'Exploration 0', class: 'exploration', level: 0, cost: 0 }),
    Object.assign( new Tech(),      { label : 'Exploration 1', class: 'exploration', level: 1, cost: 15 }),

    Object.assign( new Tech(),     { label : 'SY 1', class: 'ship_yard', level: 1, cost: 0 }),
    Object.assign( new Tech(),     { label : 'SY 2', class: 'ship_yard', level: 2, cost: 20 }),
    Object.assign( new Tech(),     { label : 'SY 4', class: 'ship_yard', level: 3, cost: 25 }),

    Object.assign( new Tech(),      { label : 'Fighter 0', class: 'fighter', level: 0, cost: 0 }),
    Object.assign( new Tech(),      { label : 'Fighter 1', class: 'fighter', level: 1, cost: 25 }),
    Object.assign( new Tech(),      { label : 'Fighter 2', class: 'fighter', level: 2, cost: 25 }),
    Object.assign( new Tech(),      { label : 'Fighter 3', class: 'fighter', level: 3, cost: 25 }),

    Object.assign( new Tech(),      { label : 'Point Defense 0', class: 'point_defense', level: 0, cost: 0 }),
    Object.assign( new Tech(),      { label : 'Point Defense 1', class: 'point_defense', level: 1, cost: 20 }),
    Object.assign( new Tech(),      { label : 'Point Defense 2', class: 'point_defense', level: 2, cost: 20 }),
    Object.assign( new Tech(),      { label : 'Point Defense 3', class: 'point_defense', level: 3, cost: 20 }),

    Object.assign( new Tech(), { label : 'Cloaking 0', class: 'cloaking', level: 0, cost: 0 }),
    Object.assign( new Tech(), { label : 'Cloaking 1', class: 'cloaking', level: 1, cost: 30 }),
    Object.assign( new Tech(), { label : 'Cloaking 2', class: 'cloaking', level: 2, cost: 30 }),

    Object.assign( new Tech(), { label : 'Scanner 0', class: 'scanner', level: 0, cost: 0 }),
    Object.assign( new Tech(), { label : 'Scanner 1', class: 'scanner', level: 1, cost: 20 }),
    Object.assign( new Tech(), { label : 'Scanner 2', class: 'scanner', level: 2, cost: 20 }),

    Object.assign( new Tech(), { label : 'Mines 0', class: 'mines', level: 0, cost: 0 }),
    Object.assign( new Tech(), { label : 'Mines 1', class: 'mines', level: 1, cost: 30 }),

    Object.assign( new Tech(), { label : 'Mine Sweep 0', class: 'mine_sweep', level: 0, cost: 0 }),
    Object.assign( new Tech(), { label : 'Mine Sweep 1', class: 'mine_sweep', level: 1, cost: 10 }),
    Object.assign( new Tech(), { label : 'Mine Sweep 2', class: 'mine_sweep', level: 2, cost: 15 }),
];
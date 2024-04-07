import {TechList} from "../Model/TechList";

let _instance = null;
const techList = TechList;

const indexTechList = () => {
    const list = {};
    let row = null;

    Object.keys(techList).forEach((key) => {
        row = list[key];
        if ( ! costsByClass.hasOwnProperty(row.class)) {
            costsByClass[row.class] = {levels: []}
        }
        costsByClass[row.class].levels[row.level] = row;
    });

    return list;
}

const indexedList = indexTechList();

export class TechService {

    /**
     * @returns TechService
     */
    static getInstance() {
        if ( ! _instance ) {
            _instance = new TechService();
        }

        return _instance;
    }

    /**
     * @param techRequirement : TechRequirement
     */
    findTech = (techRequirement) => {
        const level = techRequirement.level;
        const name = techRequirement.class;

        if (name in indexedList && level in indexedList[name].levels) {
            return indexedList[techRequirement.class].levels[level]
        }

        return null;
    }

    /**
     * @param list : {Object[]}
     * @param list[].label : string
     * @param list[].class : string
     * @param list[].level : number
     * @param list[].cost : number
     * @param budget : number
     */
    filterTechListForAffordability = ( list, budget ) => {
        return list.filter(item => item.cost <= budget);
    }

    /**
     * @param list : {Object[]}
     * @param list[].label : string
     * @param list[].class : string
     * @param list[].level : number
     * @param list[].cost : number
     * @param className : string
     */
    isTechInList( list, className ) {
        let found = false;
        list.forEach((item) => {
            if ( className === item.class ) {
                found = true;
            }
        })

        return found;
    }
}
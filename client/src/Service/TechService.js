import {TechList} from "../Model/TechList";

let _instance = null;
const techList = TechList;

export class TechService {

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
        const found = Object.keys(techList).filter((key, idx) => {
            if (techList[key].class === techRequirement.class &&  techList[key].level === techRequirement.level ) {
                return techList[key]
            }
        });

        if (found.length === 1 ) {
            return techList[found[0]];
        }
    }
}
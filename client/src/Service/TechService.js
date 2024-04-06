import TechList from "../Model/TechList";

let _instance = null;
export class TechService {

    static getInstance() {
        if ( ! _instance ) {
            _instance = new TechService();
        }

        return _instance;
    }

    /**
     * @param techRequirement : TechRequirement
     * @returns {
     */
    findTech(techRequirement) {
        const found = Object.keys(TechList).map((key, idx) => {
            if (TechList[key].class === techRequirement.class &&  TechList[key].level === techRequirement.level ) {
                return TechList[key]
            }
        });

        if (found.length === 0 ) {
            return found[0];
        }
    }
}
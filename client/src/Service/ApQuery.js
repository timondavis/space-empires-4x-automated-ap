import {AppliedTech} from "../Model/AppliedTech";

let _instance = null;
export class ApQuery {

    static getInstance() {
        if (!_instance) {
            _instance = new ApQuery();
        }

        return _instance;
    }

    /**
     * Does the AP Have the required Tech
     *
     * @param requirement : TechRequirement
     * @param ap : AP
     */
    hasApPurchasedTech = ( requirement, ap ) => {
        let found = false;

        ap.purchasedTech.forEach((entry) => {
            if ( entry.name === requirement.class ) {
                found = entry.level >= requirement.level;
            }
        });
    }

    /**
     * Get the AP's level for indicated tech.
     * @param name : string
     * @param ap : AP
     * @returns {number}
     */
    getApTechLevel = ( name, ap ) => {
        let level = 0;

        ap.purchasedTech.forEach(( entry ) => {
            if ( entry.name === name ) {
               level = entry.level;
            }
        });

        return level;
    }

    /**
     * Set/Update tech level for a given tech for the AP
     *
     * @param name : string
     * @param level : number
     * @param ap : AP
     */
    setApTechLevel = ( name, level, ap ) => {
        let techIndex = -1;

        ap.purchasedTech.forEach(( entry, index ) => {
              if ( entry.name === name ) {
                    techIndex = index;
              }
        })

        if ( techIndex >= 0 ) {
            ap.purchasedTech[techIndex].level = level;
        } else {
            const tech = new AppliedTech();
            tech.level = level;
            tech.name = name;
            ap.purchasedTech.push( tech );
        }
    }

}
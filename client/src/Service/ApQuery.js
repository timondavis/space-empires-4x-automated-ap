import {AppliedTech} from "../Model/AppliedTech";
import {TechRequirement} from "../Model/TechReqiurement";
import {TechService} from "./TechService";

let _instance = null;
export class ApQuery {

    /**
     * @returns ApQuery
     */
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
     * Upgrade Ap Tech Level. Costs will be observed.  Upgrade will only go through if funds are available.
     *
     * @param name
     * @param ap
     */
    buyApTechUpgrade = ( name, ap ) => {
        // Get current Tech level for AP
        const nextLevel = this.getNextLevelAvailable(name, ap)

        if ( nextLevel ) {
            ap.tech -= nextLevel.cost;
            this.setApTechLevel(name, nextLevel.level, ap);
        }
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

    /**
     * Get a list of all techs that are available to AP.
     *
     * @param techNameList : string[]
     * @param ap : AP
     */
    getAvailableTechForTechNameList( techNameList, ap ) {
        const result = [];
        let tech = null;
        techNameList.forEach((techName) => {
            tech = TechService.getInstance().findTech(new TechRequirement(techName, this.getApTechLevel(name, ap) + 1))
            if ( tech && ap.tech > tech.cost ) {
                result.push(tech);
            }
        });

        return result;
    }

    isNextLevelAvailable = ( className, ap ) => {
        return !! this.getNextLevelAvailable(className, ap);
    }

    getNextLevelAvailable = ( className, ap ) => {
        const techRequirement = new TechRequirement();
        techRequirement.class = className;
        techRequirement.level = this.getApTechLevel(className, ap) + 1;
        const target = TechService.getInstance().findTech( techRequirement );

        if ( target && ap.tech >= target.cost ) {
            return target;
        }

        return null;
    }
}
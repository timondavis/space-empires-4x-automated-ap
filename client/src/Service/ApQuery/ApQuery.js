import {AppliedTech} from "../../Model/AppliedTech";
import {TechRequirement} from "../../Model/TechReqiurement";
import {TechService} from "../TechService/TechService";
import {ApTechHelper} from "../../Helper/ApTechHelper/ApTechHelper";

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
     *
     * @param ship : ShipTemplate
     * @param ap : AP
     * @param fleet : ApFleet
     */
    buyApShip = ( ship, ap, fleet ) => {
        if ( fleet.cp >= ship.cpCost && this.doesApHaveRequiredTechForShip(ship, ap)) {
            fleet.cp -= ship.cpCost;
            fleet.ships.push( ship );
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
        const ts = TechService.getInstance();
        let tech = null;
        techNameList.forEach((techName) => {
            tech = ts.findTech(
                new TechRequirement(techName, this.getApTechLevel(techName, ap) + 1))
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

    /**
     * Does the AP have the technology required for the given ship?
     *
     * @param ship : ShipTemplate
     * @param ap : AP
     * @return boolean
     */
    doesApHaveRequiredTechForShip( ship, ap ) {
        let qualified = true;
        ship.requiredTech.forEach((requirement) => {
            let found = false;
            ap.purchasedTech.forEach((purchasedTech) => {
                if ( purchasedTech.name === requirement.class && purchasedTech.level >= requirement.level ) {
                    found = true;
                }
            })

            if ( ! found ) {
                qualified = false;
            }
        });

        return qualified;
    }

    /**
     * Given a sublist of ships.  Given a list,
     * filter for ships that the AP can AFFORD and that the AP is TECH QUALIFIED for.
     * @param list : ShipTemplate[]
     * @param ap : AP
     * @param budget : number
     * @return {ShipTemplate[]}
     */
    getApEligibleShipsOnList = ( list, ap , budget) => {
        return list.filter((ship) =>
            this.doesApHaveRequiredTechForShip( ship, ap ) &&
            ship.cpCost <= budget
        );
    }

    /**
     * Get a count of a given type of ship in a given fleet.
     * @param shipType : string
     * @param fleet : ApFleet
     */
    countShipsInFleet = (shipType, fleet) => {
        let ships = 0;
        fleet.ships.forEach((ship) => {
           if ( ship.name === shipType ) {
               ships++;
           }
        });

        return ships;
    }
}
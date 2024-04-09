import {ApQuery} from "../Service/ApQuery";

export class ApAndHumanComparisonHelper {
    /**
     * Are the human's demonstrated Point Defense systems tech inferior to the AP's Fighting Systems?
     *
     * @param ap : AP
     * @param humanState : HumanState
     *
     * @reutrn boolean
     */
    isHumanPointDefenseInferiorToApFighters = (ap, humanState) => {

        const apFighterLevel = ApQuery.getInstance().getApTechLevel( 'fighter', ap )
        if (  apFighterLevel > 0 ) {
            if ( !humanState.isHumanShowedPointDefense ) {
                return true;
            }
            else if (humanState.humanPointDefenseLevel < apFighterLevel ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Are the Human's demonstrated Scanner abilities inferior to the cloaking abilities of the AP?
     *
     * @param ap : AP
     * @param humanState : HumanState
     *
     * @return boolean
     */
    isHumanScannersInferiorToApCloaking = (ap, humanState) => {

        const apCloakingLevel = ApQuery.getInstance().getApTechLevel( 'cloaking', ap );

        if (apCloakingLevel > 0) {
            if (!humanState.isHumanHasScannerTech) {
                return true;
            } else if ( humanState.humanScannerLevel < apCloakingLevel ) {
                return true;
            }
        }

        return false;
    }
}
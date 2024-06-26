import {useContext, useState} from "react";
import {ApDecisionService} from "../../../Service/ApDecisionService/ApDecisionService";
import {FleetModalContext} from "../../../Context/FleetModalContext";
import {BsChevronBarExpand, BsChevronBarContract} from "react-icons/bs";
import "./ApFleets.css";
import {ApFleetHelper} from "../../../Helper/ApFleetHelper/ApFleetHelper";
import {ApTechHelper} from "../../../Helper/ApTechHelper/ApTechHelper";


export function ApFleets({humanState, ap, apUpdateCallback}) {

    const {setApAndFleet} = useContext(FleetModalContext);
    const [isFolded, setIsFolded] = useState(false);

    const toggleFolded = () => {
        setIsFolded( ! isFolded );
    }

    /**
     * Upgrade tech, pick out ships, inform the user and release the fleet.
     *
     * @param fleet : ApFleet
     * @param humanState : HumanState
     * @param ap : AP
     * @param fleetIndex : number
     */
    const releaseFleet = (fleet, humanState, ap, fleetIndex) => {
        const fleetHelper = new ApFleetHelper();
        const techHelper = new ApTechHelper();
        const adjustedAp = ApDecisionService.getInstance().releaseFleet( fleetIndex, humanState, { ...ap }, fleetHelper, techHelper );
        setApAndFleet({ap: adjustedAp, fleet: fleet});
        adjustedAp.currentFleets.splice(fleetIndex, 1);
        apUpdateCallback(adjustedAp);
    }

    return (
        <div className={"ap-fleets container-fluid mt-4"}>

            <div className={"row"}>
                <div className={"col-12 pointer d-inline-flex justify-content-start align-items-center"} onClick={toggleFolded}>
                    { ( isFolded ) ?
                        <BsChevronBarExpand className={"pointer-icon"}></BsChevronBarExpand> :
                        <BsChevronBarContract className={"pointer-icon"}></BsChevronBarContract>
                    }
                    <button className={'button-toggle'}><h3 className={'ms-2'}>Fleets</h3></button>
                </div>
            </div>

            {!isFolded && (
                <div className={"row"}>
                    <div className={"col-12"}>
                        <div>
                            {ap.currentFleets.length > 0 && ap.currentFleets.map((fleet, index) =>
                                (
                                    <button key={index} className="btn btn-warning m-1" onClick={() => releaseFleet(fleet, humanState, ap, index)}>
                                        #{index + 1} - {fleet.cp} CP {fleet.isRaider && <span>- *RAIDERS*</span>}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
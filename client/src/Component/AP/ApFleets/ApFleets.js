import {useContext, useState} from "react";
import {ApDecisionService} from "../../../Service/ApDecisionService";
import {FleetModalContext} from "../../../Context/FleetModalContext";
import {BsChevronBarExpand, BsChevronBarContract} from "react-icons/bs";
import "./ApFleets.css";


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
        const adjustedAp = ApDecisionService.getInstance().releaseFleet( fleetIndex, humanState, { ...ap } );
        setApAndFleet({ap: adjustedAp, fleet: fleet});
        adjustedAp.currentFleets.splice(fleetIndex, 1);
        apUpdateCallback(adjustedAp);
    }

    return (
        <div className={"container-fluid mt-4"}>

            <div className={"row"}>
                <div className={"col-12 pointer d-inline-flex justify-content-start align-items-center"} onClick={toggleFolded}>
                    { ( isFolded ) ?
                        <BsChevronBarExpand className={"pointer-icon"}></BsChevronBarExpand> :
                        <BsChevronBarContract className={"pointer-icon"}></BsChevronBarContract>
                    }
                    <h3 className={'ms-2'}>Fleets</h3>
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
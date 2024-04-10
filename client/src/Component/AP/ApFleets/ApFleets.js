import {useContext} from "react";
import {ApDecisionService} from "../../../Service/ApDecisionService";
import {FleetModalContext} from "../../../Context/FleetModalContext";


export function ApFleets({humanState, ap, apUpdateCallback}) {

    const {setApAndFleet} = useContext(FleetModalContext);

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
        <div>
            <h3>Fleets</h3>
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>CP</th>
                    <th>Raider</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>

                {ap.currentFleets.length > 0 && ap.currentFleets.map((fleet, index) =>
                    (
                        <tr key={index} >
                            <td>{index + 1}</td>
                            <td>{fleet.cp}</td>
                            {fleet.isRaider ? (<td>Y</td>) : (<td>N</td>)}
                            <td><button onClick={() => releaseFleet(fleet, humanState, ap, index)}>Release</button></td>
                        </tr>
                    )
                )}

                </tbody>
            </table>
        </div>
    );
}
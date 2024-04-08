import {FleetModalContext} from "../../Context/FleetModalContext";
import {useContext} from "react";
import "./FleetModal.css";

/**
 * @param apId : number
 * @returns {JSX.Element}
 * @constructor
 */
export function FleetModal({apId}) {

    const {apAndFleet, setApAndFleet} = useContext(FleetModalContext);

    /**
     * @returns {{name: string, type: string, count: number}[]}
     */
    const ships = () => {
        const countedFleet = [];
        if ( !apAndFleet ) return [];
        apAndFleet.fleet.ships.forEach((ship) => {
            const existingShip = countedFleet.find((s) => s.name === ship.name);
            if (existingShip) {
                existingShip.count++;
            } else {
                countedFleet.push({name: ship.name, type: ship.type, count: 1});
            }
        });

        return countedFleet;
    }

    const showModal = () => {
        return apAndFleet && apAndFleet.ap?.id === apId;
    }

    const closeModal = () => {
        setApAndFleet({ap: null, fleet: null});
    }

    return(
        showModal() && <div className="fleet-modal">
            <h3>Ships Launching</h3>
            <ul>
                {ships().map((ship) =>
                    <li key={ship.type}> {ship.name} ({ship.type}) - {ship.count}</li>
                )}
            </ul>
            <button className={"close-button"} onClick={() => closeModal()}>Close</button>
        </div>
    );
}
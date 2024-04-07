import {Component} from "react";

export class ApFleets extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * Upgrade tech, pick out ships, inform the user and release the fleet.
     *
     * @param fleet : ApFleet
     * @param humanState : HumanState
     * @param ap : AP
     * @param fleetIndex : number
     */
    releaseFleet = (fleet, humanState, ap, fleetIndex) => {

    }

    render = () => {
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

                    {this.props.ap.currentFleets.length > 0 && this.props.ap.currentFleets.map((fleet, index) =>
                        (
                            <tr key={index} >
                                <td>{index}</td>
                                <td>{fleet.cp}</td>
                                {fleet.isRaider ? (<td>Y</td>) : (<td>N</td>)}
                                <td><button onClick={() => this.releaseFleet(fleet, this.props.humanState, this.props.ap, index)}>Release</button></td>
                            </tr>
                        )
                    )}

                    </tbody>
                </table>
            </div>
        );
    }
}
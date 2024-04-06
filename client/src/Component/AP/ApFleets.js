import {Component} from "react";

export class ApFleets extends Component {

    constructor(props) {
        super(props);
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
                    </tr>
                    </thead>
                    <tbody>

                    </tbody>
                    {this.props.ap.currentFleets.length > 0 && this.props.ap.currentFleets.map((fleet, index) =>
                        (
                            <tr>
                                <td>{index}</td>
                                <td>{fleet.cp}</td>
                                {fleet.isRaider ? (<td>Y</td>) : (<td>N</td>)}
                            </tr>
                        )
                    )}
                </table>
            </div>
        );
    }
}
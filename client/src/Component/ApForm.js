import {Component} from "react";
import {AP} from "../Model/AP";
import {EconRollTable} from "../Model/EconRollTable"
import {FleetLaunchTable} from "../Model/FleetLaunchTable";
import {ShowDiceRange} from "./ShowDiceRange";

const initialState = {
    ap: new AP(),
    econTable : new EconRollTable(),
    launchTable : new FleetLaunchTable()
}

const reducer = (state, action) => {
        switch (action.type) {
            case 'increment_round':
                return {
                    ...state,
                    ap: {
                        ...state.ap,
                        econTurn: state.ap.econTurn + 1
                    },
                }
            case 'decrement_round':
                if (state.round > 0) {
                    return {
                        ...state,
                        ap: {
                            ...state.ap,
                            econTurn: state.ap.econTurn - 1
                        },
                    }
                }

                return {...state};

            default: break;
        }

        throw( "Invalid Action" );
    }

export class ApForm extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    dispatch = (action) => {
        this.setState(prevState => reducer(prevState, action));
    }

    render() {
        debugger;
       return(
            <table>
                <thead>
                <tr>
                    <th>Econ Turn</th>
                    <th>Econ Rolls</th>
                    <th>Extra Econ</th>
                    <th>Fleet</th>
                    <th>Tech</th>
                    <th>Defense</th>
                    <th>Fleet Launch</th>
                    <th>Econ</th>
                    <th>Fleet</th>
                    <th>Tech</th>
                    <th>Def</th>
                    <th>All Techs Purchased</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{this.state.ap.econTurn}</td>
                    <td>{this.state.ap.econRolls}</td>
                    <td>{this.state.ap.extraEcon}</td>
                    <td>{this.state.ap.fleet}</td>
                    <td>{this.state.ap.tech}</td>
                    <td>{this.state.ap.defense}</td>
                    <td>
                        <ShowDiceRange
                            min={this.state.launchTable.rows[this.state.ap.econTurn]?.min}
                            max={this.state.launchTable.rows[this.state.ap.econTurn]?.max}>
                        </ShowDiceRange>
                    </td>
                    <td>
                        <ShowDiceRange
                            min={this.state.econTable.rows[this.state.ap.econTurn]?.econ?.min}
                            max={this.state.econTable.rows[this.state.ap.econTurn]?.econ?.max}
                        >
                        </ShowDiceRange>
                    </td>
                    <td>
                        <ShowDiceRange
                            min={this.state.econTable.rows[this.state.ap.econTurn]?.fleet?.min}
                            max={this.state.econTable.rows[this.state.ap.econTurn]?.fleet?.max}
                        >
                        </ShowDiceRange>
                    </td>
                    <td>
                        <ShowDiceRange
                            min={this.state.econTable.rows[this.state.ap.econTurn]?.tech?.min}
                            max={this.state.econTable.rows[this.state.ap.econTurn]?.tech?.max}
                        >
                        </ShowDiceRange>
                    </td>
                    <td>
                        <ShowDiceRange
                            min={this.state.econTable.rows[this.state.ap.econTurn]?.def?.min}
                            max={this.state.econTable.rows[this.state.ap.econTurn]?.def?.max}
                        >
                        </ShowDiceRange>
                    </td>
                </tr>
                </tbody>
            </table>
       );
    }
}
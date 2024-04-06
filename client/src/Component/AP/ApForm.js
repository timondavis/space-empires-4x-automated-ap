import {Component} from "react";
import {AP} from "../../Model/AP";
import {EconRollTable} from "../../Model/EconRollTable"
import {FleetLaunchTable} from "../../Model/FleetLaunchTable";
import {ApFormRow} from "./ApFormRow";
import {ApDecisionService} from "../../Service/ApDecisionService";

const gameLength = 20;

const initialState = {
    apHistory: [],
    ap: null,
    econTable : new EconRollTable(),
    launchTable : new FleetLaunchTable(),
    showHistory: false,
    showFuture: false
}

const reducer = (state, action) => {
        let history = [];
        switch (action) {
            case 'hide_history': {
                return {
                    ...state,
                    showHistory: false
                };
            }
            case 'show_history': {
                return {
                    ...state,
                    showHistory: true
                };
            }
            case 'hide_future':  {
                return {
                    ...state,
                    showFuture: false
                }
            }
            case 'show_future': {
                return {
                    ...state,
                    showFuture: true
                }
            }
            case 'increment_round':

                history = [ ...state.apHistory ];
                history.push( { ...state.ap } );

                const newAp = { ...state.ap };

                const newEconTurn = newAp.econTurn + 1;
                newAp.econTurn = newEconTurn;

                return {
                    ...state,
                    ap: newAp,
                    apHistory: history
                }

            case 'decrement_round':
                history = [ ...state.apHistory ];
                const lastRecord = history.pop();
                if (state.ap.econTurn > 0) {
                    return {
                        ...state,
                        ap: lastRecord,
                        apHistory: history
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
        this.state = { ...initialState, ap: props.ap };
    }

    adjustedRowIndex = () => {
        if ( this.state.ap.econTurn < 20 ) {
            return this.state.ap.econTurn;
        }

        return ( this.state.ap.econTurn % 2 ) ? 19 : 18;
    }

    dispatch = async (action) => {
        this.setState(prevState => reducer(prevState, action));
    }

    history = () => {
        const components = [];
        for( let i = 0 ; i < this.state.ap.econTurn ; i++ ) {
            components.push(
                <ApFormRow
                    key={"turn-id-" + i}
                    ap={this.state.apHistory[i]}
                    launchRow={this.state.launchTable.rows[i]}
                    econRow={this.state.econTable.rows[i]}
                />
            );
        }

        return components;
    }

    upcoming = () => {
        const components = [];
        for ( let i = this.state.ap.econTurn + 1 ; i < gameLength ; i++ ) {
            const ap = new AP();
            ap.econTurn = i;
            components.push(
                <ApFormRow
                    key={"turn-id-" + i}
                    ap={ap}
                    launchRow={this.state.launchTable.rows[i]}
                    econRow={this.state.econTable.rows[i]}
                />
            );
        }

        return components;
    }

    rollEcon = () => {
        const adjustedAp =
            ApDecisionService.getInstance().rollEcon({...this.state.ap}, this.state.econTable);

        const adjustedEconTable = {...this.state.econTable};

        if (adjustedAp.addEconOnRound.length > 0) {
            let count = 0;
            adjustedAp.addEconOnRound.forEach((val) => {
                for (let i = val.round; i < gameLength; i++) {
                    adjustedEconTable.rows[i].extraEcon += val.points;
                    console.log(val.points);
                }
            })

            adjustedAp.addEconOnRound = [];
        }

        this.setState({ ap: adjustedAp }, () => {
            this.setState( { econTable: adjustedEconTable }, () => {
                this.props.apUpdateCallback(this.state.ap);
            });
        });
    }

    rollFleet = () => {
        let adjustedAp = Object.assign(new AP(), {...this.state.ap});
        adjustedAp = ApDecisionService.getInstance().rollFleet( adjustedAp, this.state.launchTable);
        this.setState({ ap: adjustedAp });
        this.props.apUpdateCallback(this.state.ap);
    }

    render() {
        return(
            <div>
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
                    {this.state.showHistory && this.history()}
                    < tr >
                        <td colSpan="11">
                            <button onClick={() => this.dispatch((this.state.showHistory) ? 'hide_history' : 'show_history')}>
                                {this.state.showHistory && <>Hide History</>}
                                {!this.state.showHistory && <>Show History</>}
                            </button>
                        </td>
                    </tr>
                    <ApFormRow
                        key={"turn-id-" + this.state.ap.econTurn}
                        ap={this.state.ap}
                        launchRow={this.state.launchTable.rows[this.adjustedRowIndex()]}
                        econRow={this.state.econTable.rows[this.adjustedRowIndex()]}
                    ></ApFormRow>
                    <tr>
                        <td colSpan="11">
                            <button onClick={() => this.dispatch((this.state.showFuture) ? 'hide_future' : 'show_future')}>
                               {this.state.showFuture && <>Hide Later Turns</>}
                               {!this.state.showFuture && <>Show Later Turns</>}
                            </button>
                        </td>
                    </tr>
                    {this.state.showFuture && this.upcoming()}
                    </tbody>
                </table>

                <div className={"buttons"}>
                    <button onClick={() => this.dispatch('decrement_round')}>&lt; PREV</button>
                    <button onClick={() => this.dispatch('increment_round')}>NEXT &gt;</button>
                    <button onClick={() => this.rollEcon()}>Roll Econ</button>
                    <button onClick={() => this.rollFleet()}>Roll Fleet</button>
                </div>

           </div>
       );
    }
}
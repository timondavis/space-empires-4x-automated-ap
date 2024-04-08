import {Component} from "react";
import {AP} from "../../../Model/AP";
import {EconRollTable} from "../../../Model/EconRollTable"
import {FleetLaunchTable} from "../../../Model/FleetLaunchTable";
import {ApFormRow} from "../ApFormRow/ApFormRow";
import {ApDecisionService} from "../../../Service/ApDecisionService";
import {FleetModal} from "../../FleetModal/FleetModal";
import "./ApForm.css";
import {ApFormReducer} from "./ApFormReducer";

const gameLength = 20;

const initialState = {
    apHistory: [],
    ap: null,
    econTable : new EconRollTable(),
    launchTable : new FleetLaunchTable(),
    showHistory: false,
    showFuture: false,
    isModalVisible : false,
}

const reducerHelper = new ApFormReducer();

export class ApForm extends Component {

    dispatch = reducerHelper.dispatch;

    constructor(props) {
        super(props);
        this.state = { ...initialState, ap: props.ap };
    }

    /**
     * When the row # exceeds 20 (the limit of what's provided by the game manual), repeat rows 19 and 20 infinitely.
     * This method provides the 'adjusted' row number to respect this rule when provided with the round number.
     *
     * @returns {number}
     */
    adjustedRowIndex = () => {
        if ( this.props.ap.econTurn < 20 ) {
            return this.props.ap.econTurn;
        }

        return ( this.props.ap.econTurn % 2 ) ? 19 : 18;
    }

    /**
     * Generate the history display, which is composed of previous AP states.
     *
     * @returns {*[]}
     */
    historyDisplay = () => {
        const components = [];
        for( let i = 0 ; i < this.props.ap.econTurn ; i++ ) {
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

    /**
     * Generate the upcoming rounds state predictions. Based on current values.
     * @returns {*[]}
     */
    upcomingTurnDisplay = () => {
        const components = [];
        for ( let i = this.props.ap.econTurn + 1 ; i < gameLength ; i++ ) {
            const ap = new AP(i);
            ap.econTurn = i;
            ap.econ = this.props.ap.econ;
            ap.tech = this.props.ap.tech;
            ap.fleet = this.props.ap.fleet;
            ap.purchasedTech = this.props.ap.purchasedTech;
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

    /**
     * Execute an AP Economy Roll and adjust state accordingly.
     */
    rollEcon = () => {
        const adjustedAp =
            ApDecisionService.getInstance().rollEcon({...this.props.ap}, this.state.econTable);

        const adjustedEconTable = {...this.state.econTable};

        // If Economy points were added, those points are applied to the econ table 3 turns from now.
        if (adjustedAp.addEconOnRound.length > 0) {
            let count = 0;
            adjustedAp.addEconOnRound.forEach((val) => {
                for (let i = val.round; i < gameLength; i++) {
                    adjustedEconTable.rows[i].extraEcon += val.points;
                }
            })

            adjustedAp.addEconOnRound = [];
        }

        this.setState( { econTable: adjustedEconTable }, () => {
            this.props.apUpdateCallback(adjustedAp);
        });
    }

    /**
     * Execute the fleet roll for the AP.
     */
    rollFleet = () => {
        let adjustedAp = Object.assign(new AP(), {...this.props.ap});
        adjustedAp = ApDecisionService.getInstance().rollFleet( adjustedAp, this.state.launchTable, this.props.humanState );
        this.props.apUpdateCallback(this.props.ap);
        this.props.apUpdateCallback(adjustedAp);
    }

    /**
     * Move back in time by decrementing the round, thereby restoring the previous AP state.
     */
    decrementRound = () => {
        const history = [ ...this.state.apHistory ];
        const lastRecord = history.pop();
        if (this.props.ap.econTurn > 0) {
            this.setState( { apHistory: history} );
            this.props.apUpdateCallback(lastRecord);
        }
    }

    render() {
        return(
            <div className={"ApForm"}>
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
                    {this.state.showHistory && this.historyDisplay()}
                    < tr>
                        <td colSpan="11">
                            <button
                                onClick={() => this.dispatch((this.state.showHistory) ? 'hide_history' : 'show_history', this)}>
                                {this.state.showHistory && <>Hide History</>}
                                {!this.state.showHistory && <>Show History</>}
                            </button>
                        </td>
                    </tr>
                    <ApFormRow
                        key={"turn-id-" + this.props.ap.econTurn}
                        ap={this.props.ap}
                        launchRow={this.state.launchTable.rows[this.adjustedRowIndex()]}
                        econRow={this.state.econTable.rows[this.adjustedRowIndex()]}
                    ></ApFormRow>
                    <tr>
                        <td colSpan="11">
                            <button
                                onClick={() => this.dispatch((this.state.showFuture) ? 'hide_future' : 'show_future', this)}>
                                {this.state.showFuture && <>Hide Later Turns</>}
                                {!this.state.showFuture && <>Show Later Turns</>}
                            </button>
                        </td>
                    </tr>
                    {this.state.showFuture && this.upcomingTurnDisplay()}
                    </tbody>
                </table>

                <div className={"buttons"}>
                    <button onClick={() => this.decrementRound()}>&lt; PREV</button>
                    <button onClick={() => this.dispatch('increment_round', this)}>NEXT &gt;</button>
                    <button onClick={() => this.rollEcon()}>Roll Econ</button>
                    <button onClick={() => this.rollFleet()}>Roll Fleet</button>
                </div>
                <FleetModal apId={this.props.ap.id}></FleetModal>
            </div>
        );
    }
}
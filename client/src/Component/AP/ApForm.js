import {Component} from "react";
import {AP} from "../../Model/AP";
import {EconRollTable} from "../../Model/EconRollTable"
import {FleetLaunchTable} from "../../Model/FleetLaunchTable";
import {ApFormRow} from "./ApFormRow";
import {ShowDiceRange} from "../ShowDiceRange";

const gameLength = 20;

const initialState = {
    apHistory: [],
    ap: new AP(),
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
                return {
                    ...state,
                    ap: {
                        ...state.ap,
                        econTurn: state.ap.econTurn + 1
                    },
                    apHistory: history
                }
            case 'decrement_round':
                history = [ ...state.apHistory ];
                history.pop();
                if (state.ap.econTurn > 0) {
                    return {
                        ...state,
                        ap: {
                            ...state.ap,
                            econTurn: state.ap.econTurn - 1
                        },
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
        this.state = initialState;
    }

    dispatch = (action) => {
        this.setState(prevState => reducer(prevState, action));
    }

    history = () => {
        const components = [];
        for( let i = 0 ; i < this.state.ap.econTurn ; i++ ) {
            components.push(
                <ApFormRow
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
                    ap={ap}
                    launchRow={this.state.launchTable.rows[i]}
                    econRow={this.state.econTable.rows[i]}
                />
            );
        }

        return components;
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
                       ap={this.state.ap}
                       launchRow={this.state.launchTable.rows[this.state.ap.econTurn]}
                       econRow={this.state.econTable.rows[this.state.ap.econTurn]}
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
               </div>

           </div>
       );
    }
}
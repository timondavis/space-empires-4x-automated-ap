import "./ApForm.css";
import {useContext, useEffect, useState} from "react";
import {AP} from "../../../Model/AP";
import {EconRollTable} from "../../../Model/EconRollTable"
import {FleetLaunchTable} from "../../../Model/FleetLaunchTable";
import {ApFormRow} from "../ApFormRow/ApFormRow";
import {ApDecisionService} from "../../../Service/ApDecisionService";
import {FleetModal} from "../../FleetModal/FleetModal";
import {FleetModalContext} from "../../../Context/FleetModalContext";

const gameLength = 20;

export function ApForm({humanState, ap, apUpdateCallback}) {

    const launchTable = new FleetLaunchTable();
    const {setApAndFleet} = useContext(FleetModalContext);

    const [apHistory, setApHistory] = useState([]);
    const [econTable, setEconTable] = useState(new EconRollTable());
    const [showHistory, setShowHistory] = useState(false);
    const [showFuture, setShowFuture] = useState(false);
    const [adjustedAp, setAdjustedAp] = useState(ap);

    useEffect(() => apUpdateCallback(adjustedAp), [econTable, adjustedAp]);

    /**
     * When the row # exceeds 20 (the limit of what's provided by the game manual), repeat rows 19 and 20 infinitely.
     * This method provides the 'adjusted' row number to respect this rule when provided with the round number.
     *
     * @returns {number}
     */
    const adjustedRowIndex = () => {
        if ( ap.econTurn < 20 ) {
            return ap.econTurn;
        }

        return ( ap.econTurn % 2 ) ? 19 : 18;
    }

    /**
     * Generate the history display, which is composed of previous AP states.
     *
     * @returns {*[]}
     */
    const historyDisplay = () => {
        const components = [];
        for( let i = 0 ; i < ap.econTurn ; i++ ) {
            components.push(
                <ApFormRow
                    key={"turn-id-" + i}
                    ap={apHistory[i]}
                    launchRow={launchTable.rows[i]}
                    econRow={econTable.rows[i]}
                />
            );
        }

        return components;
    }

    /**
     * Generate the upcoming rounds state predictions. Based on current values.
     * @returns {*[]}
     */
    const upcomingTurnDisplay = () => {
        const components = [];
        for ( let i = ap.econTurn + 1 ; i < gameLength ; i++ ) {
            const apNext = new AP(i);
            apNext.econTurn = i;
            apNext.econ = ap.econ;
            apNext.tech = ap.tech;
            apNext.fleet = ap.fleet;
            apNext.purchasedTech = ap.purchasedTech;
            components.push(
                <ApFormRow
                    key={"turn-id-" + i}
                    ap={apNext}
                    launchRow={launchTable.rows[i]}
                    econRow={econTable.rows[i]}
                />
            );
        }

        return components;
    }

    /**
     * Execute an AP Economy Roll and adjust state accordingly.
     */
    const rollEcon = () => {
        const newAp = ( ApDecisionService.getInstance().rollEcon({...ap}, econTable) );
        const adjustedEconTable = {...econTable};
        const history = [ ...apHistory ];

        history.push({
            ...ap,
            purchasedTech: [...ap.purchasedTech]
        });

        // If Economy points were added, those points are applied to the econ table 3 turns from now.
        if (newAp.addEconOnRound.length > 0) {
            newAp.addEconOnRound.forEach((val) => {
                for (let i = val.round; i < gameLength; i++) {
                    adjustedEconTable.rows[i].extraEcon += val.points;
                }
            })

            newAp.addEconOnRound = [];
        }

        ApDecisionService.getInstance().rollFleet( newAp, launchTable, humanState );
        newAp.econTurn = ap.econTurn + 1;

        setApHistory(history);
        setAdjustedAp(newAp);
        setEconTable(adjustedEconTable);
    }


    const raiseDefenseFleet = () => {
        let nextAp  = Object.assign( new AP(ap.id, ap.difficultyIncrement), {...ap});
        ApDecisionService.getInstance().releaseDefenseFleet(humanState, nextAp );
        const fleet = nextAp.currentFleets.pop();
        setApAndFleet({ap: nextAp, fleet: fleet});
        setAdjustedAp(nextAp);
    }

    /**
     * Move back in time by decrementing the round, thereby restoring the previous AP state.
     */
    const decrementRound = () => {
        const history = [ ...apHistory ];
        const lastRecord = history.pop();
        if (ap.econTurn > 0) {
            setApHistory(history);
            setAdjustedAp(lastRecord);
        }
    }

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
                {showHistory && historyDisplay()}
                < tr>
                    <td colSpan="11">
                        <button
                            onClick={() => (showHistory) ? setShowHistory(false) : setShowHistory(true)}>
                            {showHistory && <>Hide History</>}
                            {!showHistory && <>Show History</>}
                        </button>
                    </td>
                </tr>
                <ApFormRow
                    key={"turn-id-" + ap.econTurn}
                    ap={ap}
                    launchRow={launchTable.rows[adjustedRowIndex()]}
                    econRow={econTable.rows[adjustedRowIndex()]}
                ></ApFormRow>
                <tr>
                    <td colSpan="11">
                        <button
                            onClick={() => (showFuture) ? setShowFuture(false) : setShowFuture(true)}>
                            {showFuture && <>Hide Later Turns</>}
                            {!showFuture && <>Show Later Turns</>}
                        </button>
                    </td>
                </tr>
                {showFuture && upcomingTurnDisplay()}
                </tbody>
            </table>

            <div className={"buttons"}>
                <button onClick={() => decrementRound()}>&lt; UNDO</button>
                <button onClick={() => rollEcon()}>Roll Econ</button>
                <button onClick={() => raiseDefenseFleet()}>Raise Defense Fleet</button>
            </div>
            <FleetModal apId={ap.id}></FleetModal>
        </div>
    );
}
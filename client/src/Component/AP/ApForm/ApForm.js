import "./ApForm.css";
import {useContext, useEffect, useState} from "react";
import {AP} from "../../../Model/AP";
import {EconRollTable} from "../../../Model/EconRollTable"
import {FleetLaunchTable} from "../../../Model/FleetLaunchTable";
import {ApFormRow} from "../ApFormRow/ApFormRow";
import {ApDecisionService} from "../../../Service/ApDecisionService/ApDecisionService";
import {FleetModal} from "../../FleetModal/FleetModal";
import {FleetModalContext} from "../../../Context/FleetModalContext";
import {ApTabs} from "../ApTabs/ApTabs";
import {ApRoutingContext} from "../../../Context/ApRoutingContext";
import {DefeatApModal} from "../../DefeatApModal/DefeatApModal";
import {DieHelper} from "../../../Helper/DieHelper/DieHelper";

const gameLength = 20;

export function ApForm({humanState, ap, apUpdateCallback}) {

    const {currentAp, dispatch} = useContext(ApRoutingContext);

    const launchTable = new FleetLaunchTable();
    const {setApAndFleet, setDefeatAp} = useContext(FleetModalContext);

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
        const newAp = ( ApDecisionService.getInstance().rollEcon({...ap}, econTable, new DieHelper()) );
        const history = [ ...apHistory ];

        history.push({
            ...ap,
            purchasedTech: [...ap.purchasedTech]
        });

        ApDecisionService.getInstance().rollFleet( newAp, launchTable, humanState, new DieHelper() );
        newAp.econTurn = ap.econTurn + 1;

        setApHistory(history);
        setAdjustedAp(newAp);
        setEconTable(econTable);
        dispatch({type: 'advance_ap_turn'});
    }

    const raiseDefenseFleet = () => {
        let nextAp  = Object.assign( new AP(ap.id, ap.difficultyIncrement), {...ap});
        ApDecisionService.getInstance().releaseDefenseFleet(humanState, nextAp, new DieHelper() );
        const fleet = nextAp.currentFleets.pop();
        setApAndFleet({ap: nextAp, fleet: fleet});
        setAdjustedAp(nextAp);
    }

    const hopToCurrent = () => {
        dispatch({type: 'feature_ap', value: {ap: currentAp}});
    }

    const defeatAp = () => {
        setDefeatAp(ap);
    }

    return(
        <div className={"ApForm"}>
            <div className={"container-fluid"}>
                <div className={"row"}>
                    <div className={"col-12"}>
                        <ApTabs></ApTabs>
                    </div>
                    <div className={"col-12"}>
                        <div className={"d-flex align-items-start align-items-center"}>
                            <img className="chit-image me-3 mt-3" alt={ap.color + " game chit"}
                                 src={"/assets/images/" + ap.color + "-chit.png"}></img>
                            <h1 className="mt-4">{ap.color}</h1>
                        </div>
                    </div>
                </div>
                {showHistory && historyDisplay()}
                <div className={"row d-none"}>
                    <div className={"col-3"}>
                    <button
                            onClick={() => (showHistory) ? setShowHistory(false) : setShowHistory(true)}>
                            {showHistory && <>Hide History</>}
                            {!showHistory && <>Show History</>}
                        </button>
                    </div>
                </div>
                <ApFormRow
                    key={"turn-id-" + ap.econTurn}
                    ap={ap}
                    launchRow={launchTable.rows[adjustedRowIndex()]}
                    econRow={econTable.rows[adjustedRowIndex()]}
                ></ApFormRow>
                <div className={"row d-none"}>
                    <div className={"col-3"}>
                        <button
                            onClick={() => (showFuture) ? setShowFuture(false) : setShowFuture(true)}>
                            {showFuture && <>Hide Later Turns</>}
                            {!showFuture && <>Show Later Turns</>}
                        </button>
                    </div>
                </div>
                {showFuture && upcomingTurnDisplay()}
            </div>

            <div className={"row buttons"}>
                <div className={"col-12"}>
                    <div className={"w-100 d-flex justify-content-end align-items-center"}>
                        <button className="btn btn-danger m-1" onClick={() => defeatAp()}>Defeat AP</button>
                        <button className="btn btn-secondary m-1 " onClick={() => raiseDefenseFleet()}>Raise Defense Fleet
                        </button>

                        {currentAp?.id === ap?.id ?
                            (<button className="btn btn-primary m-1" onClick={() => rollEcon()}>Roll Econ</button>) :
                            (<button className="btn btn-outline-primary m-1" onClick={() => hopToCurrent()}>Next AP &gt;</button>)
                        }

                    </div>
                </div>
            </div>

            <FleetModal apId={ap.id}></FleetModal>
            <DefeatApModal ap={ap}></DefeatApModal>
        </div>
    );
}
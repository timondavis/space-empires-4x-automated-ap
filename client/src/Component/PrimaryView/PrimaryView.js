import {useContext, useState} from "react";
import {HumanState} from "../../Model/HumanState";
import {ApRoutingContext} from "../../Context/ApRoutingContext";
import {FleetModalProvider} from "../../Provider/FleetModalProvider/FleetModalProvider";
import {ApForm} from "../AP/ApForm/ApForm";
import {ApFleets} from "../AP/ApFleets/ApFleets";
import {HumanStateForm} from "../HumanStateForm/HumanStateForm";
import {GameStart} from "../GameStart/GameStart";
import {AP} from "../../Model/AP";
import {GameRestart} from "../GameRestart/GameRestart";
import {RestartGameModal} from "../RestartGameModal/RestartGameModal";

export const PrimaryView = () => {

    const [humanState, setHumanState] = useState(new HumanState());
    const {dispatch, apCollection, featuredAp, currentAp, isGameStarted} = useContext(ApRoutingContext);

    const startGame = () => {
        dispatch({type: 'start_game'});
    }

    /**
     * Update an AP State
     *
     * @param ap : AP
     */
    const updateAp = (ap) => {
        dispatch({type: 'update_ap', value: {ap: ap}});
    }

    const getApForms = () => {

        return apCollection.map((ap) => (
            (featuredAp.id === ap.id) &&
            <>
                <ApForm
                    key={`ap-form-${ap.id}`}
                    humanState={humanState}
                    ap={ap}
                    apUpdateCallback={(data) => updateAp(data)}>
                </ApForm>
                <ApFleets key={`ap-fleets-${ap.id}`} humanState={humanState} ap={apCollection[ap.id]}
                          apUpdateCallback={(data) => updateAp(data)}>
                </ApFleets>
                <RestartGameModal></RestartGameModal>
            </>));
    }

    return (
        <>
            {! isGameStarted && <GameStart startGame={startGame}></GameStart>}
            <FleetModalProvider>
                { isGameStarted && getApForms()}
                { isGameStarted && <HumanStateForm key="human-state-form" humanState={humanState} formUpdateCallback={(data) => setHumanState(data)}>
                </HumanStateForm>
                }
                { isGameStarted && <GameRestart></GameRestart>}
            </FleetModalProvider>
        </>
    );
}
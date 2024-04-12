import {useContext, useState} from "react";
import {HumanState} from "../../Model/HumanState";
import {ApRoutingContext} from "../../Context/ApRoutingContext";
import {FleetModalProvider} from "../../Provider/FleetModalProvider";
import {ApForm} from "../AP/ApForm/ApForm";
import {ApFleets} from "../AP/ApFleets/ApFleets";
import {HumanStateForm} from "../HumanStateForm/HumanStateForm";
import {GameStart} from "../GameStart/GameStart";
import {AP} from "../../Model/AP";

export const PrimaryView = () => {

    const [humanState, setHumanState] = useState(new HumanState());
    const {dispatch, apCollection, featuredAp, currentAp} = useContext(ApRoutingContext);
    const [gameStarted, setGameStarted] = useState(false);

    const startGame = () => {
        setGameStarted(true);
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

        return apCollection.map((ap, idx) => (
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
            </>));
    }

    return (
        <>
            {! gameStarted && <GameStart startGame={startGame}></GameStart>}
            <FleetModalProvider>
                { gameStarted && getApForms()}
                { gameStarted && <HumanStateForm key="human-state-form" humanState={humanState} formUpdateCallback={(data) => setHumanState(data)}>
                </HumanStateForm>}
            </FleetModalProvider>
        </>
    );
}
import {useContext} from "react";
import {ApRoutingContext} from "../../Context/ApRoutingContext";
import {ApSelector} from "./ApSelector/ApSelector";
import {AP} from "../../Model/AP";

export const GameStart = ({startGame}) => {

    const {dispatch, apCollection, featuredAp, currentAp} = useContext(ApRoutingContext);

    const validated = () => {
        return (apCollection?.length >= 1 && apCollection[0]?.color !== 'none' && apCollection[1]?.color !== 'none');
    }

    const startGameButtonClass = () => {
        const classes = ['btn', 'btn-success'];
        if ( !validated()) {
            classes.push('disabled');
        }

        return classes.join(" ");
    }

    const onStateChange = (data) => {
        const ap = new AP(data?.id, data?.difficulty, data?.color);

        if (data?.color === 'none' && ap.id < apCollection.length  - 1) {
            dispatch({type: 'remove_ap', value: {ap: ap}});
        } else {
            dispatch({type: 'update_ap', value: {ap: ap}});
        }

        dispatch({type: 'add_ap'});
    }

    const onStartGame = () => {

        apCollection.forEach(ap => {
            if ( ap.color === 'none' ) {
                dispatch({type: 'remove_ap', value: {ap: ap}});
            }
        });

        dispatch({type: 'feature_ap', value: {ap: apCollection[0]}});
        startGame();
    }

    const participatingColors = () => {
        const colors = [];
        apCollection.forEach((ap) => {
            if (ap.color !== 'none') {
                colors.push(ap.color);
            }
        })
        return colors;
    }

    return(
        <div className={"GameStart container-fluid"}>
            <div className={"row"}>
                <div className={"col-12"}>
                    <h1>Set Opponents</h1>
                </div>
            </div>

            {apCollection.map((ap) =>
                <div key={ap.id} className={"row"}>
                    <div className={"col-12"}>
                        <ApSelector exclude={participatingColors()} onSelect={onStateChange} ap={ap}></ApSelector>
                    </div>
                </div>
            )}


            <div className={"row"}>
                <div className={"col-12 d-flex justify-content-end"}>
                    <button className={startGameButtonClass()} onClick={() => validated() && onStartGame()}>Start Game</button>
                </div>
            </div>
        </div>
    );
}

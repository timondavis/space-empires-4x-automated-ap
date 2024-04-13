import {useContext} from "react";
import {ApRoutingContext} from "../../Context/ApRoutingContext";
import "./RestartGameModal.css";

export const RestartGameModal = ({ap}) => {

    const {dispatch, isResetGameProposed} = useContext(ApRoutingContext);

    const restart = () => dispatch({type: 'reset'});

    const cancel = () =>dispatch({type: 'cancel_reset'});

    return (
        isResetGameProposed && <div className={'restart-game-modal'}>
            <div className={"container"}>
                <div className={"row mb-3"}>
                    <div className={"col-12"}>
                        Are you sure you wish to restart the game?
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-12"}>
                        <div className={"buttons d-flex justify-content-end align-items-end w-100"}>
                            <button className="btn btn-danger m-1" onClick={restart}>
                                Yes, restart the game
                            </button>
                            <button className="btn btn-secondary m-1" onClick={cancel}>No, cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
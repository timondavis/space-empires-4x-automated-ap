import {useContext, useState} from "react";
import {BsChevronBarContract, BsChevronBarExpand} from "react-icons/bs";
import {ApRoutingContext} from "../../Context/ApRoutingContext";
import "./GameRestart.css";

export const GameRestart = () => {

    const {dispatch} = useContext(ApRoutingContext);

    const [showDetails, setShowDetails] = useState(false);

    const toggleDetail = () => setShowDetails( !showDetails );

    const restartGame = () => {
        dispatch({type: 'propose_reset'});
    }

    return (
        <div className="game-restart container-fluid mt-4">
            <div className={"row"}>
                <div onClick={toggleDetail} className={"col-12 d-flex align-items-center justify-content-start pointer"}>
                    {showDetails ?
                        (<BsChevronBarContract className={"toggle"}></BsChevronBarContract>) :
                        (<BsChevronBarExpand className={"toggle"}></BsChevronBarExpand>)}
                    <button className={"button-toggle"}><h3 className={"ms-2"}>Reset Game</h3></button>
                </div>
            </div>
            { showDetails && (
                <div className={"col-12"}>
                    <div className={"container-fluid"}>
                        <div className={"row my-4"}>
                            <div className={"col-12 d-flex justify-content-end"}>
                                <button className={"btn btn-danger"} onClick={restartGame}>Reset Game</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import {useContext} from "react";
import {FleetModalContext} from "../../Context/FleetModalContext";
import "./DefeatApModal.css";

export const DefeatApModal = ({ap}) => {

    const {defeatAp, setDefeatAp, confirmDefeatAp} = useContext(FleetModalContext);

    const defeat = () => confirmDefeatAp(ap);

    const cancel = () => setDefeatAp(null);

    return (
        (defeatAp?.id === ap.id) &&
        <div className={'defeat-ap-modal'}>
            <div className={"container"}>
                <div className={"row mb-3"}>
                    <div className={"col-12"}>
                        Are you sure you wish to defeat the <span className={"capitalize"}>{ap.color}</span> AP?
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-12"}>
                        <div className={"buttons d-flex justify-content-end align-items-end w-100"}>
                            <button className="btn btn-danger m-1" onClick={defeat}>
                                Yes, defeat <span className={"uppercase"}>{ap.color}</span> AP
                            </button>
                            <button className="btn btn-secondary m-1" onClick={cancel}>No, cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
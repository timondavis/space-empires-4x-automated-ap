import {useEffect, useState} from "react";
import {BsChevronBarExpand, BsChevronBarContract} from "react-icons/bs";
import "./HumanStateForm.css";

export function HumanStateForm({humanState, formUpdateCallback}) {

    const [formState, setFormState] = useState(humanState);
    const [showDetails, setShowDetails] = useState(false);

    useEffect( () => formUpdateCallback(formState), [formState]);

    const handleValueChange = (event) => {
        const name = event.target.id;
        const value = event.target.value;
        updateFormData(name, value);
    }

    const handleCbxChange = (event) => {
        const name = event.target.id;
        const value = event.target.checked;
        updateFormData(name, value);
    }

    const updateFormData = (name, value) => {
        const newFormState = { ...formState };
        newFormState[name] = value;
        setFormState( newFormState );
    }

    const toggleDetail = () => {
        setShowDetails( ! showDetails );
    }

    return (
        <div className="container-fluid mt-4">
            <div className={"row"}>
                <div onClick={toggleDetail} className={"col-12 d-flex align-items-center justify-content-start pointer"}>
                    {showDetails ?
                        (<BsChevronBarContract className={"toggle"}></BsChevronBarContract>) :
                        (<BsChevronBarExpand className={"toggle"}></BsChevronBarExpand>)}
                    <h3 className={"ms-2"}>Human Progress Status</h3>
                </div>
            </div>
            {showDetails && (
                <div className={"container-fluid"}>
                    <div className={"row my-4"}>
                        <form className={"col-12"}>
                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <h4>Ships & Mines</h4>
                                    <div className="mb-3 form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isHumanShowedRaiders"
                                            checked={humanState.isHumanShowedRaiders}
                                            onChange={handleCbxChange}
                                        />
                                        <label className="form-check-label" htmlFor="isHumanShowedRaiders">
                                            Raiders have been revealed
                                        </label>
                                    </div>
                                    {formState.isHumanShowedRaiders &&
                                        <div className="col-12 mb-3 ms-1">
                                            <select
                                                className="form-select"
                                                aria-label="Select a Human Raider Level"
                                                id="humanRaiderLevel"
                                                onChange={handleValueChange}
                                                value={humanState.humanRaiderLevel}
                                            >
                                                <option value="0">Last Revealed Raider Level</option>
                                                <option value="1">1 - Raider 1 Revealed</option>
                                                <option value="2">2 - Raider 2 Revealed</option>
                                            </select>
                                        </div>
                                    }
                                    <div className="mb-3 form-check">
                                        <input
                                            className="form-check-input"
                                            type={"checkbox"}
                                            id={"isHumanUsedMines"}
                                            checked={humanState.isHumanUsedMines}
                                            onChange={handleCbxChange}
                                        />
                                        <label className={"form-check-label"} htmlFor={"isHumanUsedMines"}>Mines have
                                            been revealed</label>
                                    </div>
                                </div>
                                <div className={"col-12"}>
                                    <h4>Technology</h4>
                                    <div className={"mb-3 form-check"}>
                                        <label className={"form-check-label"} htmlFor={"isHumanHasUsedFighters"}>Fighters
                                            have been revealed</label>
                                        <input
                                            className={"form-check-input"}
                                            type={"checkbox"}
                                            id={"isHumanHasUsedFighters"}
                                            checked={humanState.isHumanHasUsedFighters}
                                            onChange={handleCbxChange}
                                        />
                                    </div>
                                    <div className={"mb-3 form-check"}>
                                        <label className={"form-check-label"} htmlFor={"isHumanShowedPointDefense"}>Point
                                            Defense Tech has been revealed</label>
                                        <input
                                            className={"form-check-input"}
                                            type={"checkbox"}
                                            id={"isHumanShowedPointDefense"}
                                            checked={humanState.isHumanShowedPointDefense}
                                            onChange={handleCbxChange}/>
                                    </div>
                                    {formState.isHumanShowedPointDefense &&
                                        <div className={"mb-3 ms-1"}>
                                            <select className={"form-select"}
                                                    aria-label={"Select the Human's level of Point Defense Technology"}
                                                    id={"humanPointDefenseLevel"}
                                                    onChange={handleValueChange}
                                                    value={humanState.humanPointDefenseLevel}
                                            >
                                                <option value="0">Last Revealed Point Defense Level</option>
                                                <option value="1">1 - Point Defense 1 Revealed</option>
                                                <option value="2">2 - Point Defense 2 Revealed</option>
                                                <option value="3">3 - Point Defense 3 Revealed</option>
                                            </select>
                                        </div>
                                    }
                                    <div className={"mb-3 form-check"}>
                                        <label className={"form-check-label"} htmlFor={"isHumanHasScannerTech"}>Scanner
                                            Tech has been purchased</label>
                                        <input
                                            className={"form-check-input"}
                                            type={"checkbox"}
                                            id={"isHumanHasScannerTech"}
                                            checked={humanState.isHumanHasScannerTech}
                                            onChange={handleCbxChange}
                                        />
                                    </div>
                                    {formState.isHumanHasScannerTech &&
                                        <div className={"mb-3 ms-1"}>
                                            <select className={"form-select"}
                                                    aria-label={"Select the Human's level of Scanner Technology"}
                                                    id={"humanScannerLevel"}
                                                    onChange={handleValueChange}
                                                    value={humanState.humanScannerLevel}
                                            >
                                                <option value="0">Current Scanner Level</option>
                                                <option value="1">1 - Scanner 1 Purchased</option>
                                                <option value="2">2 - Scanner 2 Purchased</option>
                                            </select>
                                        </div>
                                    }
                                </div>
                            </div>
                        </form>
                    </div>
                </div>)
            }
        </div>
    );
}
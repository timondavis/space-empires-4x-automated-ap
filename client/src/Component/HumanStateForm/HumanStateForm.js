import {useEffect, useState} from "react";
import {BsChevronBarExpand, BsChevronBarContract} from "react-icons/bs";

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
        <div className="container">
            <button onClick={toggleDetail}  className={"pointer toggle"}>
            {showDetails ?
                ( <BsChevronBarContract className={"pointer"} ></BsChevronBarContract> ) :
                ( <BsChevronBarExpand className={"pointer"}></BsChevronBarExpand> ) }
            &nbsp; Human Progress Status
            </button>
            {showDetails && (
                <div className={"container-fluid"}>
                    <div className={"row my-4"}>
                        <form className={"col-12"}>
                            <div className="mb-3 form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="isHumanShowedRaiders"
                                    checked={humanState.isHumanShowedRaiders}
                                    onChange={handleCbxChange}
                                />
                                <label className="form-check-label" htmlFor="isHumanShowedRaiders">
                                    Human Showed Raiders
                                </label>
                            </div>
                            {formState.isHumanShowedRaiders &&
                                <div className="mb-3 ms-1">
                                    <label className="form-label" htmlFor="humanRaiderLevel">Human Raider Level</label>
                                    <select
                                        className="form-select"
                                        aria-label="Select a Human Raider Level"
                                        id="humanRaiderLevel"
                                        onChange={handleValueChange}
                                        value={humanState.humanRaiderLevel}
                                    >
                                        <option value="0">Select Raider Level</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
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
                                <label className={"form-check-label"} htmlFor={"isHumanUsedMines"}>Human Used Mines</label>
                            </div>
                            <div className={"mb-3 form-check"}>
                                <label className={"form-check-label"} htmlFor={"isHumanShowedPointDefense"}>Human Showed Point
                                    Defense</label>
                                <input
                                    className={"form-check-input"}
                                    type={"checkbox"}
                                    id={"isHumanShowedPointDefense"}
                                    checked={humanState.isHumanShowedPointDefense}
                                    onChange={handleCbxChange}/>
                            </div>
                            {formState.isHumanShowedPointDefense &&
                                <div className={"mb-3 ms-1"}>
                                    <label className={"form-label"} htmlFor={"humanPointDefenseLevel"}>Human Point Defense
                                        Level</label>
                                    <select className={"form-select"}
                                            aria-label={"Select the Human's level of Point Defense Technology"}
                                            id={"humanPointDefenseLevel"}
                                            onChange={handleValueChange}
                                            value={humanState.humanPointDefenseLevel}
                                    >
                                        <option value="0">Select Point Defense Level</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>
                                </div>
                            }
                            <div className={"mb-3 form-check"}>
                                <label className={"form-check-label"} htmlFor={"isHumanHasScannerTech"}>Human Has Scanner
                                    Tech</label>
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
                                    <label className={"form-label"} htmlFor={"humanScannerLevel"}>Human Scanner Tech
                                        Level</label>
                                    <select className={"form-select"}
                                            aria-label={"Select the Human's level of Scanner Technology"}
                                            id={"humanScannerLevel"}
                                            onChange={handleValueChange}
                                            value={humanState.humanScannerLevel}
                                    >
                                        <option value="0">Select Scanner Level</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                    </select>
                                </div>
                            }
                            <div className={"mb-3 form-check"}>
                                <label className={"form-check-label"} htmlFor={"isHumanHasUsedFighters"}>Human Has Used Fighters</label>
                                <input
                                    className={"form-check-input"}
                                    type={"checkbox"}
                                    id={"isHumanHasUsedFighters"}
                                    checked={humanState.isHumanHasUsedFighters}
                                    onChange={handleCbxChange}
                                />
                            </div>
                        </form>
                    </div>
                </div>)
            }
        </div>
    );
}
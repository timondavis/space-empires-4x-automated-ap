import {Component, useReducer, useState} from "react";
import {HumanState} from "../Model/HumanState";

export class HumanStateForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formState: new HumanState()
        };
    }

    handleValueChange = (event) => {
        const name = event.target.id;
        const value = event.target.value;
        this.updateFormData(name, value);
    }

    handleCbxChange = (event) => {
        const name = event.target.id;
        const value = event.target.checked;
        this.updateFormData(name, value);
    }

    updateFormData = (name, value) => {
        this.setState( {formState: { ...this.state.formState, [name]: value }},
            () => this.props.formUpdateCallback && this.props.formUpdateCallback(this.state.formState));
    }

    render() {
        return (
            <div className="container">
                <form>
                    <div className="mb-3 form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="isHumanShowedRaiders"
                            checked={this.state.formState.isHumanShowedRaiders}
                            onChange={this.handleCbxChange}
                        />
                        <label className="form-check-label" htmlFor="isHumanShowedRaiders">
                            Human Showed Raiders
                        </label>
                    </div>
                    { this.state.formState.isHumanShowedRaiders &&
                        <div className="mb-3 ms-1">
                            <label className="form-label" htmlFor="humanRaiderLevel">Human Raider Level</label>
                            <select
                                className="form-select"
                                aria-label="Select a Human Raider Level"
                                id="humanRaiderLevel"
                                onChange={this.handleValueChange}
                                value={this.state.formState.humanRaiderLevel}
                            >
                                <option value="0">0</option>
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
                            checked={this.state.formState.isHumanUsedMines}
                            onChange={this.handleCbxChange}
                            />
                        <label className={"form-check-label"} htmlFor={"isHumanUsedMines"}>Human Used Mines</label>
                    </div>
                    <div className={"mb-3 form-check"}>
                        <label className={"form-check-label"} htmlFor={"isHumanShowedPointDefense"}>Human Showed Point Defense</label>
                        <input
                            className={"form-check-input"}
                            type={"checkbox"}
                            id={"isHumanShowedPointDefense"}
                            checked={this.state.formState.isHumanShowedPointDefense}
                            onChange={this.handleCbxChange}/>
                    </div>
                    {this.state.formState.isHumanShowedPointDefense &&
                        <div className={"mb-3 ms-1"}>
                            <label className={"form-label"} htmlFor={"humanPointDefenseLevel"}>Human Point Defense
                                Level</label>
                            <select className={"form-select"}
                                    aria-label={"Select the Human's level of Point Defense Technology"}
                                    id={"humanPointDefenseLevel"}
                                    onChange={this.handleValueChange}
                                    value={this.state.formState.humanPointDefenseLevel}
                            >
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                    }
                    <div className={"mb-3 form-check"}>
                        <label className={"form-check-label"} htmlFor={"isHumanHasScannerTech"}>Human Has Scanner Tech</label>
                        <input
                            className={"form-check-input"}
                            type={"checkbox"}
                            id={"isHumanHasScannerTech"}
                            checked={this.state.formState.isHumanHasScannerTech}
                            onChange={this.handleCbxChange}
                        />
                    </div>
                    {this.state.formState.isHumanHasScannerTech &&
                        <div className={"mb-3 ms-1"}>
                            <label className={"form-label"} htmlFor={"humanScannerLevel"}>Human Scanner Tech Level</label>
                            <select className={"form-select"}
                                    aria-label={"Select the Human's level of Scanner Technology"}
                                    id={"humanScannerLevel"}
                                    onChange={this.handleValueChange}
                                    value={this.state.formState.humanScannerLevel}
                            >
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                            </select>
                        </div>
                    }
                </form>
            </div>
        );
    }
}
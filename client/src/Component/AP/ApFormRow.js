import {ShowDiceRange} from "../ShowDiceRange";
import {Component} from "react";

export class ApFormRow extends Component {

    render() {
        return (
            <tr>
                <td>{this.props.ap.econTurn + 1}</td>
                <td>{this.props.ap.econRolls}</td>
                <td>{this.props.ap.extraEcon}</td>
                <td>{this.props.ap.fleet}</td>
                <td>{this.props.ap.tech}</td>
                <td>{this.props.ap.defense}</td>
                <td>
                    <ShowDiceRange
                        min={this.props.launchRow?.min}
                        max={this.props.launchRow?.max}>
                    </ShowDiceRange>
                </td>
                <td>
                    <ShowDiceRange
                        min={this.props.econRow?.econ?.min}
                        max={this.props.econRow?.econ?.max}
                    >
                    </ShowDiceRange>
                </td>
                <td>
                    <ShowDiceRange
                        min={this.props.econRow?.fleet?.min}
                        max={this.props.econRow?.fleet?.max}
                    >
                    </ShowDiceRange>
                </td>
                <td>
                    <ShowDiceRange
                        min={this.props.econRow?.tech?.min}
                        max={this.props.econRow?.tech?.max}
                    >
                    </ShowDiceRange>
                </td>
                <td>
                    <ShowDiceRange
                        min={this.props.econRow?.def?.min}
                        max={this.props.econRow?.def?.max}
                    >
                    </ShowDiceRange>
                </td>
            </tr>
        )
    }
}
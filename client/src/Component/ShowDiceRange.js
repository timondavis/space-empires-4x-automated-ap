import {Component} from "react";

export class ShowDiceRange extends Component {

    render() {

        const min = (this.props.min) ? this.props.min : null;
        const max = (this.props.max) ? this.props.max : null;

        return (

            <>
                <span>{min}</span>
                {min && max && min !== max && <span>, </span>}
                {min !== max && <span>{max}</span>}
            </>
        )
    }
}
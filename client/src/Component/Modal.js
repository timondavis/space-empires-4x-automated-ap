import {Component} from "react";

export class Modal extends Component {

    render = () => {
        return(
            <div className={"modal"}>
                {this.props.content}
            </div>
        );
    }
}
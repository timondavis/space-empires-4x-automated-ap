import logo from './logo.svg';
import "./font.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {HumanStateForm} from "./Component/HumanStateForm/HumanStateForm";
import {ApForm} from "./Component/AP/ApForm/ApForm";
import {useContext, useState} from "react";
import {AP} from "./Model/AP";
import {ApFleets} from "./Component/AP/ApFleets/ApFleets";
import {HumanState} from "./Model/HumanState";
import {FleetModalProvider} from "./Provider/FleetModalProvider";
import {ApRoutingContext} from "./Context/ApRoutingContext";
import {ApRoutingProvider} from "./Provider/ApRoutingProvider";
import {PrimaryView} from "./Component/PrimaryView/PrimaryView";
import {GameStart} from "./Component/GameStart/GameStart";

function App() {

    return (
        <div className="App">
            <ApRoutingProvider>
                <PrimaryView></PrimaryView>
            </ApRoutingProvider>
        </div>
    );
}

export default App;

import logo from './logo.svg';
import './App.css';
import {HumanStateForm} from "./Component/HumanStateForm/HumanStateForm";
import {ApForm} from "./Component/AP/ApForm/ApForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from "react";
import {AP} from "./Model/AP";
import {ApFleets} from "./Component/AP/ApFleets/ApFleets";
import {HumanState} from "./Model/HumanState";
import {FleetModalProvider} from "./Provider/FleetModalProvider";

function App() {

    const [humanState, setHumanState] = useState(new HumanState());
    const [apState, setApState] = useState( [
        new AP(0, 5),
        new AP(1, 5),
        new AP(2, 5)
    ])

    /**
     * Update an AP State
     *
     * @param ap : AP
     */
    const updateAp = (ap) => {
        const newApState = [...apState];

        let targetIndex= -1;
        apState.forEach((apInstance, apIndex) => {
            if( apInstance.id === ap.id ) {
                targetIndex = apIndex;
            }
        })

        newApState[targetIndex] = ap;
        setApState(newApState);
    }

    return (
        <div className="App">
            <FleetModalProvider>
                <ApForm
                    humanState={humanState}
                    ap={apState[0]}
                    apUpdateCallback={(data) => updateAp(data)
                    }></ApForm>
                <ApFleets humanState={humanState} ap={apState[0]} apUpdateCallback={(data) => updateAp(data)}></ApFleets>
            </FleetModalProvider>
            <HumanStateForm humanState={humanState} formUpdateCallback={ (data) => setHumanState(data)}></HumanStateForm>
        </div>
    );
}

export default App;

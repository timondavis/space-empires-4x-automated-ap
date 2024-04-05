import logo from './logo.svg';
import './App.css';
import {HumanStateForm} from "./Component/HumanStateForm";
import {ApForm} from "./Component/AP/ApForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from "react";

function App() {

    const [humanState, setHumanState] = useState(null);

    return (
        <div className="App">
            <HumanStateForm formUpdateCallback={ (data) => setHumanState(data)}></HumanStateForm>
            <ApForm></ApForm>
        </div>
    );
}

export default App;

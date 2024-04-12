import {useContext, useState} from "react";
import {FleetModalContext} from "../Context/FleetModalContext";
import {ApRoutingContext} from "../Context/ApRoutingContext";

export function FleetModalProvider({children}) {
    const [apAndFleet, setApAndFleet] = useState({ap : null, fleet:null});
    const [defeatAp, setDefeatAp] = useState(null);

    const {dispatch} = useContext(ApRoutingContext);

    const closeModal = () => {
        setApAndFleet({ap: null, fleet: null});
    }

    const confirmDefeatAp = () => {
        setDefeatAp(null);
        dispatch({type: 'remove_ap', value: {ap: defeatAp}});
    }

    return (<FleetModalContext.Provider value={{apAndFleet, setApAndFleet, closeModal, defeatAp, setDefeatAp, confirmDefeatAp}}>{children}</FleetModalContext.Provider>)
}

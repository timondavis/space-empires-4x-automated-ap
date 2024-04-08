import {useState} from "react";
import {FleetModalContext} from "../Context/FleetModalContext";

export function FleetModalProvider({children}) {
    const [apAndFleet, setApAndFleet] = useState({ap : null, fleet:null});

    const closeModal = () => {
        setApAndFleet({ap: null, fleet: null});
    }

    return (<FleetModalContext.Provider value={{apAndFleet, setApAndFleet, closeModal}}>{children}</FleetModalContext.Provider>)
}

import {FleetModalContext} from "../Context/FleetModalContext";
import {useContext} from "react";

export function displayFleetLaunch() {
    return useContext(FleetModalContext)
}
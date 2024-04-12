import {useContext} from "react";
import {ApRoutingContext} from "../../../Context/ApRoutingContext";
import "./ApTab.css";

export const ApTab = ({ap}) => {

   const {dispatch} = useContext(ApRoutingContext)

   const invokeAp = () => {
      dispatch({type: 'feature_ap', value:{ap: ap}});
   }

   return (
       <button className={`ap-tab`} onClick={invokeAp}>
            <img alt={`${ap.color} Alien Player Chit`} src={`./Assets/Images/${ap.color}-chit.png`} />
       </button>
   );
}
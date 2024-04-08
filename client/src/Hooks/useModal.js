import {ModalContext} from "../Context/ModalContext";
import {useContext} from "react";

export function useModal() {
    return useContext(ModalContext);
}
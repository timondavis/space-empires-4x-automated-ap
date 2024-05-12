import {ShowDiceRange} from "../../ShowDiceRange/ShowDiceRange";
import "./ApFormRow.css"
import {ApFormRowEntry} from "./ApFormRowEntry/ApFormRowEntry";
import {TechService} from "../../../Service/TechService/TechService";
import {TechRequirement} from "../../../Model/TechReqiurement";

export function ApFormRow({ap,econRow, launchRow}) {

    /**
     * Get the proper label for the AP Tech
     *
     * @param techName : string
     * @param techLevel : number
     */
    const getTechLabel = ( techName, techLevel ) => {
        const requirement = new TechRequirement(techName, techLevel);
        const tech = TechService.getInstance().findTech(requirement);
        return tech?.label;
    }

    return (
        <dl className={"ApFormRow row ap-" + ap.color }>

            <ApFormRowEntry dt={"Econ Turn"}  dd={ap.econTurn + 1}></ApFormRowEntry>
            <ApFormRowEntry dt={"Econ Rolls"} dd={econRow?.econRolls}></ApFormRowEntry>
            <ApFormRowEntry dt={"Extra Econ"} dd={econRow?.extraEcon}></ApFormRowEntry>
            <ApFormRowEntry dt={"Fleet CP"}   dd={ap.fleet}></ApFormRowEntry>
            <ApFormRowEntry dt={"Tech CP"}    dd={ap.tech}></ApFormRowEntry>
            <ApFormRowEntry dt={"Defense CP"} dd={ap.defense}></ApFormRowEntry>

            <ApFormRowEntry className={"d-none"} dt={"Fleet Launch Range"}
                            dd={
                                <ShowDiceRange
                                    min={launchRow?.min}
                                    max={launchRow?.max}>
                                </ShowDiceRange>
                            }>
            </ApFormRowEntry>

            <ApFormRowEntry className={"d-none"}
                            dt={"Econ Range"}
                            dd={
                                <ShowDiceRange
                                    min={econRow?.econ?.min}
                                    max={econRow?.econ?.max} >
                                </ShowDiceRange>
                            }>
            </ApFormRowEntry>

            <ApFormRowEntry className={"d-none"}
                            dt={"Fleet Range"}
                            dd={
                                <ShowDiceRange
                                    min={econRow?.fleet?.min}
                                    max={econRow?.fleet?.max} >
                                </ShowDiceRange>
                            }>
            </ApFormRowEntry>

            <ApFormRowEntry className={"d-none"}
                            dt={"Tech Range"}
                            dd={
                                <ShowDiceRange
                                    min={econRow?.tech?.min}
                                    max={econRow?.tech?.max}
                                >
                                </ShowDiceRange>
                            }>
            </ApFormRowEntry>

            <ApFormRowEntry className={"d-none"}
                            dt={"Defense Range"}
                            dd={
                                <ShowDiceRange
                                    min={econRow?.def?.min}
                                    max={econRow?.def?.max}
                                >
                                </ShowDiceRange>
                            }>
            </ApFormRowEntry>

            <ApFormRowEntry className={"tech-list"} isFolding={true}
                            dt={"Purchased Tech"}
                            dd={<ul>
                                {ap.purchasedTech.map((item) => {
                                    return (<li key={item.name}>{getTechLabel(item.name, item.level)}</li>)
                                })}
                            </ul> }>
            </ApFormRowEntry>
        </dl>
    );
}
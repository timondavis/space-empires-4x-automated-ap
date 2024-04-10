import {ShowDiceRange} from "../../ShowDiceRange/ShowDiceRange";
import {Component} from "react";
import "./ApFormRow.css"

export function ApFormRow({ap,econRow, launchRow}) {

    return (
        <dl className={"ApFormRow row"}>

            <div>
                <dt className={"col-6"}>Econ Turn</dt>
                <dd className={"col-6"}>{ap.econTurn + 1}</dd>
            </div>

            <div>
                <dt className={"col-6"}>Econ Rolls</dt>
                <dd className={"col-6"}>{econRow?.econRolls}</dd>
            </div>

            <div>
                <dt className={"col-6"}>Extra Econ</dt>
                <dd className={"col-6"}>{econRow?.extraEcon}</dd>
            </div>

            <div>
                <dt className={"col-6"}>Fleet CP</dt>
                <dd className={"col-6"}>{ap.fleet}</dd>
            </div>

            <div>
                <dt className={"col-6"}>Tech CP</dt>
                <dd className={"col-6"}>{ap.tech}</dd>
            </div>

            <div>
                <dt className={"col-6"}>Defense CP</dt>
                <dd className={"col-6"}>{ap.defense}</dd>
            </div>

            <div className={"d-none"}>
                <dt className={"col-6"}>Fleet Launch Range</dt>
                <dd className={"col-6"}>
                    <ShowDiceRange
                        min={launchRow?.min}
                        max={launchRow?.max}>
                    </ShowDiceRange>
                </dd>
            </div>

            <div className={"d-none"}>
                <dt className={"col-6"}>Econ Range</dt>
                <dd className={"col-6"}>
                    <ShowDiceRange
                        min={econRow?.econ?.min}
                        max={econRow?.econ?.max}
                    >
                    </ShowDiceRange>
                </dd>
            </div>

            <div className={"d-none"}>
                <dt className={"col-6"}>Fleet Range</dt>
                <dd className={"col-6"}>
                    <ShowDiceRange
                        min={econRow?.fleet?.min}
                        max={econRow?.fleet?.max}
                    >
                    </ShowDiceRange>
                </dd>
            </div>

            <div className={"d-none"}>
                <dt className={"col-6"}>Tech Range</dt>
                <dd className={"col-6"}>
                    <ShowDiceRange
                        min={econRow?.tech?.min}
                        max={econRow?.tech?.max}
                    >
                    </ShowDiceRange>
                </dd>
            </div>

            <div className={"d-none"}>
                <dt className={"col-6"}>Defense Range</dt>
                <dd className={"col-6"}>
                    <ShowDiceRange
                        min={econRow?.def?.min}
                        max={econRow?.def?.max}
                    >
                    </ShowDiceRange>
                </dd>
            </div>

            <div className={"tech-list"}>
                <dt className={"col-6"}>Purchased Tech</dt>
                <dd className={"col-6"}>
                    <ul>
                        {ap.purchasedTech.map((item) =>
                            (<li key={item.name}>{item.name} - {item.level}</li>)
                        )}
                    </ul>
                </dd>
            </div>
        </dl>
    );
}
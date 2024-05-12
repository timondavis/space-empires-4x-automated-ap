import {useEffect, useState} from "react";

export const ApSelector = ({ap, exclude, onSelect}) => {

    const update = (key, value) => {
        const update = {
            id: ap.id,
            color: ap.color,
            difficulty: ap.difficulty
        };

        update[key] = value;
        onSelect(update);
    }

    return(
        <div className="row mb-5">
            <div className={"col-12"}>
                <div className={"form-group"}>
                    <label htmlFor={ap.id + "-ap-color"}>
                        Opponent {ap.id + 1}
                        <select id={ap.id + "-ap-color"} value={ap.color} className={"form-select"} onChange={(e) => update('color', e.target.value)} aria-label={`Select Opponent ${ap.id + 1}`}>
                            <option value="none">No Opponent</option>
                            {(!exclude || !exclude.includes("green") || ap.color === "green") && <option value="green">Green</option>}
                            {(!exclude || !exclude.includes("blue") || ap.color === "blue") && <option value="blue">Blue</option>}
                            {(!exclude || !exclude.includes("red") || ap.color === "red") && <option value="red">Red</option>}
                            {(!exclude || !exclude.includes("yellow") || ap.color === "yellow") && <option value="yellow">Yellow</option>}
                        </select>
                    </label>
                </div>
                {ap.color !== 'none' &&
                <div className={"form-group"}>
                    <label htmlFor={ap.id + "-ap-difficulty"}>
                        Opponent {ap.id + 1} Difficulty
                        <select className={"form-select"} value={ap.difficulty} onChange={(e => update('difficulty', e.target.value))} aria-label={`Select opponent ${ap.id + 1} difficulty`}>
                            <option value={5}>Easy</option>
                            <option value={10}>Medium</option>
                            <option value={15}>Hard</option>
                        </select>
                    </label>
                </div>
                }
            </div>
        </div>
    );
}
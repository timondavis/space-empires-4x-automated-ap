import {BsChevronBarExpand, BsChevronBarContract} from "react-icons/bs";
import {useState} from "react";
import "./ApFormRowEntry.css";

export function ApFormRowEntry({dt, dd, className, isFolding}) {

    const [isFolded, setIsFolded] = useState(false);

    const toggleFolding = () => {
        setIsFolded( ! isFolded );
    }

    return (
        (isFolded) ?
            (<div className={`mt-2 ${className}`}>
                <dt className={"col-6 pt-2"}>{dt}</dt>
                <dd className={"col-6 pt-2"}>
                    <BsChevronBarExpand className="pointer toggle-folding" onClick={toggleFolding}></BsChevronBarExpand>
                </dd>
            </div>) :
            (<div className={`mt-2 ${className}`}>
                <dt className={"col-6 pt-2"}>{dt}</dt>
                <dd className={"col-6 pt-2"}>
                    {dd}
                    {isFolding &&
                        <BsChevronBarContract className="pointer toggle-folding" onClick={toggleFolding}></BsChevronBarContract>
                    }
                </dd>
            </div>)
    )
}
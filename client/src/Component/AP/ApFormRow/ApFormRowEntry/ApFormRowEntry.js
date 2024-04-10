export function ApFormRowEntry({dt, dd, className}) {
    return (
        <div className={`mt-2 ${className}`}>
            <dt className={"col-6 pt-2"}>{dt}</dt>
            <dd className={"col-6 pt-2"}>{dd}</dd>
        </div>
    )
}
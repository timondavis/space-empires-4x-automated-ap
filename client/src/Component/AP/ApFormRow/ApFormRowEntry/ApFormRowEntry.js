export function ApFormRowEntry({dt, dd, className}) {
    return (
        <div className={className}>
            <dt className={"col-6"}>{dt}</dt>
            <dd className={"col-6"}>{dd}</dd>
        </div>
    )
}
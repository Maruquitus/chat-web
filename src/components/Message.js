export function Message(props) {
    const date = new Date(parseInt(props.time));
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return (
        <div className={"mt-0.5 shadow-md w-fit max-w-96 h-fit rounded-md p-1 break-words ".concat(props.sender == 1 ? 'bg-main-color ml-2 rounded-bl-none' : 'bg-secondary-color ml-auto mr-2 rounded-br-none')}>
            <h2 className="pr-8">{props.msg}</h2>
            <p className={"text-xs w-full text-right -mt-3"}>{time}</p>
        </div>
    )
}
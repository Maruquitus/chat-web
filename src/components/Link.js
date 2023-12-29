export function Link(props) {
    return (
        <a onClick={props.onClick} className={"text-blue-500 hover:text-blue-400 duration-300 ease-in-out cursor-pointer " + props.className} href={props.destination}>{props.text}</a>
    )
}
export function Link(props) {
    return (
        <a className={"text-blue-500 hover:text-blue-400 duration-300 ease-in-out cursor-pointer " + props.className} href={props.destination}>{props.text}</a>
    )
}
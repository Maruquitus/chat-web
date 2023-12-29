export function IconButton(props) {
  return (
    <div onClick={props.action} className="relative text-center">
      <span className="cursor-pointer text-white py-2 px-4 rounded-full inline-block transition bg-secondary-color font-bold hover:scale-105 hover:bg-blue-400 ease-in-out duration-300">
        {props.text}
        <i className={`fa-solid fa-${props.icon} ml-2`} />
      </span>
    </div>
  );
}

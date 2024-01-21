export function IconButton(props) {
  let disabled = props.disabled == undefined ? false : props.disabled;
  return (
    <div onClick={disabled ? () => {} : props.action} className="relative text-center">
      <span className={`w-56 cursor-pointer text-white py-2 px-4 rounded-full inline-block transition font-bold ${disabled ? 'bg-gray-400' : 'bg-secondary-color hover:scale-105 hover:bg-blue-400'} ease-in-out duration-300`}>
        {props.text}
        {disabled}
        <i className={`fa-solid fa-${props.icon} ml-2`} />
      </span>
    </div>
  );
}

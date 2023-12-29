export function Chat(props) {
  const date = new Date(parseInt(props.time));
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return (
      <div className={`${props.selected ? 'bg-zinc-100' : 'bg-white'} border-b border-gray-100 h-20 px-6 py-2 w-full rounded-sm z-20 cursor-pointer hover:translate-x-2 hover:shadow-sm hover:shadow-gray-100 duration-300 flex`}>
          <img src={props.photo} className="w-12 h-12 mr-2 -ml-2 mt-1.5 rounded-full inline-flex"/>
          <div className="lg:w-full md:w-11/12 w-10/12 mt-2">
            <h1 className={"text-black ".concat(props.lastMessage ? '' : 'mt-2')}>{props.name}</h1>
            <h2 className="text-gray-500 text-sm w-80 truncate ...">{props.lastMessage}</h2>
            {!isNaN(hours) && <p className={"text-gray-500 z-50 w-fit text-xs float-right -mt-10 md:mr-3 lg:mr-8 xl:-mr-2"}>{time}</p>}
          </div>
      </div>
    );
  }
import { processDate } from "@/app/dateCalculator";
export function Chat(props) {
  const date = new Date(parseInt(props.time));
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const processedDate = processDate(date);
    const text = processedDate == 'Hoje' ? time : processedDate;
     
    let data = props.lastMessage;
    let lastMessage;
    let seen;
    if (data) {
      if (data.sender == props.user) { //Checar se a mensagem foi vista por todos
        seen = true;
        Object.keys(data.seenBy).map((user) => {
            if (!data.seenBy[user]) {
                seen = false;
            }
        })
      }
      lastMessage = `${data.sender == props.user ? 'Você:' : props.isGroup ? `${props.name}:` : ''} ${data.msg}`;
    }
    
    return (
      <div className={`${props.selected ? 'bg-zinc-100' : 'bg-white'} border-b border-gray-100 h-20 px-6 py-2 w-full rounded-sm z-30 cursor-pointer hover:translate-x-2 hover:shadow-sm hover:shadow-gray-100 duration-300 flex`}>
          <img src={props.photo} className="w-12 h-12 mr-2 -ml-2 mt-1.5 rounded-full inline-flex"/>
          <div className="lg:w-full md:w-11/12 w-10/12 mt-2">
            <h1 className={"text-black truncate md:w-full ".concat(props.lastMessage ? 'w-5/12' : 'mt-2 w-full')}>{props.name}</h1>
            <div className="flex">
              {seen != undefined && (
                <i
                  className={`fa-solid text-sm fa-${
                    seen ? "check-double text-blue-500 mt-0.5" : "check text-gray-500"
                  } mr-1 mt-1`}
                />
              )}
                <h2 className="text-gray-500 text-sm w-80 truncate">{lastMessage}</h2>
            </div>
            {!isNaN(hours) && <p className={"text-gray-500 z-50 w-fit text-xs float-right -mt-10 md:mr-3 lg:mr-8 xl:-mr-2"}>{text}</p>}
            {(!isNaN(hours) && props.unseen > 0) && (
              <div>
                <div className="w-5 h-5 rounded-full float-right -mt-5 md:mr-3 lg:mr-8 xl:-mr-1.5 bg-secondary-color">
                <p className={"text-white font-bold z-50 text-small w-full text-center "}>{props.unseen}</p>
              </div>
              </div>
            )}
          </div>
      </div>
    );
  }
import { MessageInput } from "./MessageInput";
import { Message } from "./Message";

export function OpenChat(props) {
    let messages = props.chat.messages;
    let sortedMessages = messages ? Object.keys(messages) : [];
    sortedMessages.sort(x => parseInt(x));

    return (
        <div className="w-full bg-blue-50 overflow-y-scroll mb-14">
            <div className="w-full pt-2 pb-2 ">
                {sortedMessages.map((m, ind) => {
                    
                    let data = messages[m];
                    let showHeader = false;
                    if (props.isGroup) {
                        if (ind == 0) showHeader = true;
                        else if (messages[sortedMessages[ind-1]].sender != data.sender) showHeader = true;
                    }
                    
                    return (
                        <>
                            {showHeader && <h1 className={'text-gray-500 '.concat(data.sender != props.user ? 'text-left ml-2' : 'text-right mr-2')}>{props.users[data.sender].name}</h1>} 
                            <Message time={m} sender={data.sender == props.user ? 0 : 1} msg={data.msg}/>
                        </>
                    
                    )

                })}
            </div>
            <div className="bg-white">
                <MessageInput user={props.user} chat={props.chatID}/>
            </div>
        </div>
    )
}
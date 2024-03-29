import { MessageInput } from "./MessageInput";
import { Message } from "./Message";
import { ref, set } from "firebase/database";
import { db } from "../app/firebase.js";
import { DateHeader } from "./DateHeader";


export function OpenChat(props) {
    let messages = props.chat.messages;
    let sortedMessages = messages ? Object.keys(messages) : [];
    sortedMessages.sort(x => parseInt(x));

    function checkDifferentDay(time1, time2) {
        const oneDay = 1000 * 60 * 60 * 24;
        const diffInMs = time2 - time1;
        return Math.round(diffInMs / oneDay) >= 1;
    }

    return (
        <div className="w-full bg-blue-50 overflow-y-scroll mb-14">
            <div className="w-full pt-2 pb-2 ">
                {sortedMessages.map((m, ind) => {
                    let data = messages[m];
                    let seen;
                    if (data.sender == props.user) { //Checar se a mensagem foi vista por todos
                        seen = true;
                        Object.keys(data.seenBy).map((user) => {
                            if (!data.seenBy[user]) {
                                seen = false;
                            }
                        })
                    }
                    else {
                        if (!data.seenBy[props.user]) { //Atualizar status de visto
                            const chatRef = ref(db, "Chats/" + props.chatID);
                            let chatData = props.chat;
                            messages[m].seenBy[props.user] = true;
                            chatData.messages = messages;
                            set(chatRef, chatData);

                        }
                    }
                    let showLabel = false;

                    if (props.isGroup) { // Calcular quando o header do remetente da mensagem deve ser exibido
                        if (ind == 0) showLabel = true;
                        else if (messages[sortedMessages[ind-1]].sender != data.sender) showLabel = true;
                    }
                    return (
                        <>
                            {(ind == 0 || checkDifferentDay(parseInt(sortedMessages[ind-1]), parseInt(sortedMessages[ind]))) && <DateHeader date={new Date(parseInt(sortedMessages[ind]))}/>}
                            {showLabel && <h1 className={'text-gray-500 '.concat(data.sender != props.user ? 'text-left ml-2' : 'text-right mr-2')}>{props.users[data.sender].name}</h1>} 
                            <Message messages={messages} chatData={props.chat} chatID={props.chatID} msgID={sortedMessages[ind]} seen={seen} time={m} sender={data.sender == props.user ? 0 : 1} msg={data.msg}/>
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
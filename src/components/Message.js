import { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../app/firebase.js";

export function Message(props) {
  const [deleteVisible, setVisible] = useState(false);
  const [deleteState, setState] = useState(0);
  const date = new Date(parseInt(props.time));
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const time = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  async function deleteMessage() {
    const chatRef = ref(db, "Chats/" + props.chatID);
    let chatData = props.chatData;
    let messages = props.messages;
    delete messages[props.msgID];
    chatData.messages = messages;
    set(chatRef, chatData);
  }

  return (
    <div
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => {
        setVisible(false);
        setState(0);
      }}
    >
      <div
        className={"w-fit flex ".concat(
          props.sender == 1 ? "ml-2" : "ml-auto mr-2"
        )}
      >
        {deleteVisible && props.sender === 0 && (
          <>
            {deleteState === 0 && (
              <i
                onClick={() => setState(1)}
                className={`fa-solid fa-trash-can text-slate-400 duration-300 hover:scale-100 scale-95 cursor-pointer block mt-3 mr-3 `}
              />
            )}
            {deleteState === 1 && (
              <div className="mt-2 flex">
                <p className="text-gray-500 bg-none">Tem certeza?</p>
                <i
                  onClick={() => deleteMessage()}
                  className={`fa-solid fa-circle-check text-slate-400 duration-300 hover:scale-100 scale-95 cursor-pointer block mt-1 ml-1 mr-3 `}
                />
              </div>
            )}
          </>
        )}

        <div
          className={"mt-0.5 shadow-md w-fit max-w-96 h-fit rounded-md p-1 break-words ".concat(
            props.sender == 1
              ? "bg-main-color ml-2 rounded-bl-none"
              : "bg-secondary-color ml-auto mr-2 rounded-br-none"
          )}
        >
          <h2
            className={`${props.seen != undefined ? "pr-12" : "pr-9"} inline-b`}
          >
            {props.msg}
          </h2>
          <div className="text-xs text-right -mt-3 flex">
            <span className={"block text-right w-full -mr-1"}>{time}</span>
            {props.seen != undefined && (
              <i
                className={`fa-solid fa-${
                  props.seen ? "check-double" : "check"
                } ml-2 mt-0.5`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

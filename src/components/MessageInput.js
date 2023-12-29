import { ref, set, get } from "firebase/database";
import { db } from "../app/firebase.js";

export function MessageInput(props) {
  async function sendMessage() {
    let input = document.getElementById("messageInput");
    let message = input.value;
    if (message.length > 0) {
      const chatRef = ref(db, "Chats/" + props.chat);

      let dados = await get(chatRef).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          return [];
        }
      });
      if (dados) {
        console.log(dados);
        let messages = dados.messages;
        let time = Date.now();
        if (!messages) messages = {};
        messages[time] = {
          msg: message,
          sender: props.user,
        };
        dados.messages = messages;
        input.value = "";
        set(chatRef, dados);
      }
    }
  }

  return (
    <>
      <div className="bg-sky-100 w-2/3 h-14 absolute bottom-0 right-0 shadow-md flex-column">
        <input
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              sendMessage();
            }
          }}
          id="messageInput"
          placeholder="Sua mensagem aqui"
          className="outline-0 h-10 mt-2 pl-2 ml-3.5 text-black bg-white rounded-md shadow-sm w-11/12 inline-flex"
        ></input>
        <button
          onClick={() => sendMessage()}
          className="bg-secondary-color rounded-full h-9 w-9 cursor-pointer inline-flex ml-2 absolute top-3"
        >
          <i className="fa-solid fa-paper-plane text-white scale-125 ml-2 mt-2.5"></i>
        </button>
      </div>
    </>
  );
}

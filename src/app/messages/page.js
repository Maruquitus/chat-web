"use client";
import { auth, db, storage } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, get, set } from "firebase/database";
import { useEffect, useState } from "react";
import { Link } from "@/components/Link.js";
import { Chat } from "@/components/Chat.js";
import { OpenChat } from "@/components/OpenChat.js";
import { IconButton } from "@/components/IconButton.js";
import { Loader } from "@/components/Loader.js";
import { User } from "@/components/User.js";

function generateUid () {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

async function newChat(chats, user1, user2) {
  let foundChat;
  if (chats) {
    Object.keys(chats).map((chat) => {
    if (chats[chat].participants.includes(user1) && chats[chat].participants.includes(user2) && !chats[chat].isGroup) {
      foundChat = chat;
      return null;
    }
  })
}
  if (foundChat) return foundChat;

  const uid = generateUid();
  const chatRef = ref(db, "Chats/" + uid);
  await set(chatRef, {
    isGroup: false,
    messages: {},
    name: "Chat",
    participants: { 0: user1, 1: user2 },
    photo: "https://cdn-icons-png.flaticon.com/512/6387/6387947.png",
  });

  return uid;
}

let firstLoad = true;
export default function Messages() {
  const [user, userLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState({});
  const [selectedChat, setChat] = useState(null);
  const [users, setUsers] = useState(null);
  const [photo, setPhoto] = useState();
  const [newChatVisible, setNewChatVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  async function getPhoto() {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      var file = e.target.files[0];
      setPhoto(file);
      //Enviar foto de perfil para o Firebase
      let filename = user.email;
      let storageRef = storage.ref("pfps/" + filename);
      let uploadTask = storageRef.put(file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        () => {
          //Caso aconteça algum erro
          alert("Algo deu errado, tente enviar a imagem novamente.");
        },
        async () => {
          // Se o upload tiver funcionado
          let url = await uploadTask.snapshot.ref.getDownloadURL();

          //Atualizar dados na bd
          await updateBdPfp(url);
        }
      );

      //alert("Foto alterada com sucesso!");
    };
    input.click();
  }

  async function updateBdPfp(url) {
    const pfp =
      url ||
      "https://cdn.vectorstock.com/i/preview-1x/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg";
    const u = users[user.uid];

    const userRef = ref(db, "Users/" + user.uid);
    await set(userRef, {
      email: u.email,
      name: u.name,
      pfp: pfp,
    });
    users[user.uid].pfp = pfp;
    await loadData();
    setTimeout(closeModal, 700);
  }

  function closeModal() {
    setModalVisible(false);
  }

  function closeNewChat() {
    let div = document.getElementById("newChat");
    div.className = div.className.replace("InLeft", "OutLeft");
    setTimeout(() => setNewChatVisible(false), 800);
  }

  function loadData() {
    if (!user) return null;
    //Informações dos usuários
    const usersRef = ref(db, "Users/");
    get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {
        let val = snapshot.val();
        setUsers(val);
        setPhoto(val[user.uid].pfp);
      } else {
        setUsers({});
      }
    });

    //Informações dos chats
    let chatRef = ref(db, "Chats/");
    get(chatRef).then((snapshot) => {
      if (snapshot.exists()) {
        const dados = snapshot.val();

        const chats = dados || [];
        let userChats = Object.keys(chats).filter((chat) =>
          Object.values(chats[chat].participants).includes(user.uid)
        );

        userChats.sort((chatA, chatB) => {
          const lastMessageA = Object.keys(chats[chatA].messages).slice(-1)[0];
          const lastMessageB = Object.keys(chats[chatB].messages).slice(-1)[0];
        
          return parseInt(lastMessageB) - parseInt(lastMessageA);
        });
        

        let outputChats = {};
        userChats.forEach((c) => {
          outputChats[c] = chats[c];
        });
        setChats(outputChats);
      }
      setTimeout(loadData, 500);
      setLoading(false);
    });
  }

  //Carregar dados do usuário
  useEffect(() => {
    if (user && firstLoad) {
      firstLoad = false;
      loadData();
    }
  });

  if (!userLoading && !user) {
    document.location.href = "/login";
  }

  //Exibir tela de loading enquanto carrega
  if (userLoading || loading) {
    return (
      <div className="flex flex-col h-screen w-screen text-2xl">
        <div className="mx-auto mt-60">
          {/*<h1 className="text-gray-500 font-bold mx-auto ml-2 mb-2">Carregando...</h1>*/}
          <Loader />
        </div>
      </div>
    );
  }

  

  let chatPicture, chatName, chatParticipants, chatIsGroup, unseen;
  if (selectedChat && chats) {
    if (chats[selectedChat]) {
      [chatName, chatPicture, unseen] = processChat(selectedChat);
      chatIsGroup = chats[selectedChat].isGroup;
      chatParticipants = [
        ...chats[selectedChat].participants.map((p) => users[p].name),
      ];
    }
  }

  function processChat(chat) {
    let chatPicture, chatName, otherUser, unseen;

    if (user && chats[chat]) {
      otherUser = users[chats[chat].participants.filter((u) => u != user.uid)[0]];
      chatPicture = chats[chat].isGroup ? chats[chat].photo : otherUser.pfp;
      chatName = chats[chat].isGroup ? chats[chat].name : otherUser.name;

      let messages = chats[chat].messages;
      if (messages) {
        unseen = Object.keys(messages).filter(
          (m) => !messages[m].seenBy[user.uid] && user.uid != messages[m].sender
        ).length;
      }

    }

    return [chatName, chatPicture, unseen];
  }

  if (user == null) {
    return <div></div>;
  }

  //Renderizar página
  return (
    <>
      <div className="flex w-full">
        {/* Página principal*/}
        <div
          className={`${
            modalVisible ? "blur-sm" : ""
          } absolute w-full h-full flex`}
        >
          {/* Nova conversa */}
          {newChatVisible && (
            <div
              id="newChat"
              className="animate__animated animate__faster animate__slideInLeft top-0 h-full bg-slate-50 w-4/12 z-50 absolute"
            >
              {/* Header */}
              <div className="bg-secondary-color shadow-md shadow-custom flex pt-10 pl-4 pb-4 z-20">
                <i
                  onClick={() => {
                    closeNewChat();
                  }}
                  class="fa-solid fa-arrow-left text-white text-2xl cursor-pointer hover:scale-105 duration-300"
                ></i>
                <h1 className="ml-4 -translate-y-0.5 text-xl font-bold text-white">
                  Nova conversa
                </h1>
              </div>

              {/* Lista de usuários */}
              {Object.keys(users).map((uid) => {
                if (uid == user.uid) return null;
                const userData = users[uid];
                return (
                  <div key={uid} onClick={async () => {
                    let chatId = await newChat(chats, uid, user.uid);
                    await loadData();
                    closeNewChat();
                    setChat(chatId);
                  }}>
                    <User
                      name={userData.name}
                      photo={userData.pfp}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="w-1/3 h-full bg-slate-50 flex border-r border-gray-200">
            {/* Header à esquerda */}
            <header className="bg-gray-100 z-40 h-14 absolute top-0 left-0 w-1/3 shadow-md shadow-custom border-r border-gray-200">
              <div className="flex">
                <img
                  onClick={() => setModalVisible(true)}
                  src={users[user.uid].pfp}
                  className="h-10 w-10 rounded-full ml-4 my-auto cursor-pointer hover:scale-105 duration-300 inline-flex mt-2"
                />
                <h1 className="text-black mt-4 ml-2 font-medium truncate w-5/12 md:w-full">
                  {users[user.uid].name}
                </h1>
                <div
                  onClick={() => setNewChatVisible(true)}
                  className="inline-flex mt-4 ml-auto mr-4 hover:scale-105 duration-300 cursor-pointer"
                >
                  <span class="">
                    <svg
                      viewBox="0 0 24 24"
                      height="26"
                      width="26"
                      preserveAspectRatio="xMidYMid meet"
                      class=""
                      fill="none"
                    >
                      <title>Nova conversa</title>
                      <path
                        d="M9.53277 12.9911H11.5086V14.9671C11.5086 15.3999 11.7634 15.8175 12.1762 15.9488C12.8608 16.1661 13.4909 15.6613 13.4909 15.009V12.9911H15.4672C15.9005 12.9911 16.3181 12.7358 16.449 12.3226C16.6659 11.6381 16.1606 11.0089 15.5086 11.0089H13.4909V9.03332C13.4909 8.60007 13.2361 8.18252 12.8233 8.05119C12.1391 7.83391 11.5086 8.33872 11.5086 8.991V11.0089H9.49088C8.83941 11.0089 8.33411 11.6381 8.55097 12.3226C8.68144 12.7358 9.09947 12.9911 9.53277 12.9911Z"
                        fill="#666"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0.944298 5.52617L2.99998 8.84848V17.3333C2.99998 18.8061 4.19389 20 5.66665 20H19.3333C20.8061 20 22 18.8061 22 17.3333V6.66667C22 5.19391 20.8061 4 19.3333 4H1.79468C1.01126 4 0.532088 4.85997 0.944298 5.52617ZM4.99998 8.27977V17.3333C4.99998 17.7015 5.29845 18 5.66665 18H19.3333C19.7015 18 20 17.7015 20 17.3333V6.66667C20 6.29848 19.7015 6 19.3333 6H3.58937L4.99998 8.27977Z"
                        fill="#666"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>
            </header>

            {/* Lista de conversas */}
            <div className="mt-14 w-full h-11/12 overflow-x-visible pt-1 z-20">
              {chats &&
                Object.keys(chats).map((c) => {
                  let data = chats[c];
                  let messages = data.messages || null;
                  let lastMessage;
                  let sortedMessages = false;
                  let time;
                  if (messages) {
                    sortedMessages = messages ? Object.keys(messages) : [];
                    sortedMessages.sort((x) => -parseInt(x));
                    time = sortedMessages[0];
                    if (messages[sortedMessages[0]])
                      lastMessage = messages[sortedMessages[0]];
                  }

                  let [chatName, chatPicture, unseen] = processChat(c);

                  return (
                    <div
                      key={c}
                      onClick={() => setChat(c)}
                      className="cursor-pointer"
                    >
                      <Chat
                        isGroup={data.isGroup}
                        user={user.uid}
                        unseen={unseen}
                        selected={c == selectedChat}
                        time={time}
                        photo={chatPicture}
                        lastMessage={lastMessage}
                        name={chatName}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="w-2/3 h-full bg-slate-100 flex">
            {/* Header à direita */}
            <header className="bg-gray-100 z-30 h-14 absolute top-0 right-0 w-2/3 shadow-md shadow-custom">
              {(selectedChat && chats[selectedChat]) && (
                <div className="w-full h-full absolute">
                  <div className="flex">
                    <img
                      className="rounded-full w-10 h-10 mt-2 ml-2"
                      src={chatPicture}
                    />
                    <div className="flex-col flex h-full ml-2 mb-2 mt-1.5">
                      <h1
                        className={"text-black ".concat(
                          chatIsGroup ? "" : "mt-2"
                        )}
                      >
                        {chatName}
                      </h1>
                      {chatIsGroup && (
                        <h2 className="text-gray-500 -mt-1">
                          {chatParticipants.join(", ")}
                        </h2>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <Link
                className="font-bold right-5 top-4 absolute"
                onClick={() => {
                  auth.signOut();
                  document.location.href = "/login";
                }}
                text="Sair da conta"
              />
            </header>

            {/* Placeholder pra quando não existe nenhuma conversa selecionada */}
            {(!selectedChat || !chats[selectedChat]) && (
              <div className="w-full h-full mx-auto my-auto items-center justify-center">
                <img className="w-2/5 mx-auto mt-24" src="/begin chat.svg" />
                <span className="text-center text-gray-500 justify-center block mt-4">
                  Selecione uma conversa para começar!
                </span>
              </div>
            )}

            {/* Renderizar chat aberto*/}
            {(selectedChat && chats[selectedChat]) && (
              <div className="w-full flex mt-14">
                <OpenChat
                  isGroup={chatIsGroup}
                  users={users}
                  user={user.uid}
                  chatID={selectedChat}
                  chat={chats[selectedChat]}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal para trocar foto de perfil*/}
        <div
          id="modalContainer"
          onClick={() => {
            document
              .getElementById("modalContainer")
              .addEventListener("click", (e) => {
                if (!document.getElementById("modal").contains(e.target)) {
                  setModalVisible(false);
                }
              });
          }}
          className={`duration-300 ${
            modalVisible
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } w-screen h-screen absolute`}
        >
          <div
            id="modal"
            className="absolute border border-zinc-100 m-auto bg-white sm:w-1/2 w-full h-auto overflow-hidden p-10 top-14 sm:left-1/4 shadow-custom shadow-lg rounded-2xl"
          >
            <h1 className="text-black font-bold text-3xl text-center">
              Este é seu perfil!
            </h1>
            <i
              onClick={() => setModalVisible(false)}
              class="fa-solid fa-x absolute right-6 top-6 text-gray-500 text-2xl cursor-pointer hover:scale-105 duration-300"
            ></i>
            <h2 className="text-gray-500 font-semibold text-xl mx-10 mt-2 text-center">
              Caso queira, você pode trocar sua foto visível aos outros
              usuários.
            </h2>
            (
            <>
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mt-3 shadow-custom shadow-md">
                <img src={users[user.uid].pfp} />
              </div>
              <h3 className="text-center text-black text-2xl mt-2">
                {users[user.uid].name}
              </h3>
            </>
            )
            <div className="flex w-fit mx-auto gap-4">
              <IconButton
                action={() => getPhoto()}
                text="Mudar foto"
                icon="image"
              />
              {photo && (
                <IconButton
                  action={() => {
                    setPhoto(
                      "https://cdn.vectorstock.com/i/preview-1x/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg"
                    );
                    updateBdPfp();
                  }}
                  text="Remover"
                  icon="remove"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

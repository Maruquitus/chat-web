"use client";
import { auth, db, storage } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, get, set } from "firebase/database";
import { useEffect, useState } from "react";
import { Link } from "@/components/Link.js";
import { Chat } from "@/components/Chat.js";
import { OpenChat } from "@/components/OpenChat.js";
import { IconButton } from "@/components/IconButton.js";

export default function Messages(props) {
  const [user, userLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState(null);
  const [selectedChat, setChat] = useState(null);
  const [users, setUsers] = useState(null);
  const [photo, setPhoto] = useState();
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
      let url = await uploadTask.snapshot.ref.getDownloadURL();

      //Atualizar dados na bd
      await updateBdPfp(url);

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
    setTimeout(closeModal, 700)
  }
  
  function closeModal() {
    setModalVisible(false);
  }

  function loadData() {
    if (!user) return null
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
        const userChats = Object.keys(chats).filter((chat) =>
          Object.values(chats[chat].participants).includes(user.uid)
        );
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
    if (user && chats === null) {
      loadData();
    }
  });

  if (!userLoading && !user) {
    document.location.href = "/login";
  }

  //Exibir tela de loading enquanto carrega
  if (userLoading || loading) {
    return (
      <div className="flex h-screen w-screen text-2xl">
        <h1 className="text-gray-500 font-bold m-auto">Carregando...</h1>
      </div>
    );
  }

  let chatPicture, chatName, chatParticipants, chatIsGroup, unseen;
  if (selectedChat) {
    [chatName, chatPicture, unseen] = processChat(selectedChat);
    chatIsGroup = chats[selectedChat].isGroup;
    chatParticipants = [
      ...chats[selectedChat].participants.map((p) => users[p].name),
    ];
  }

  function processChat(chat) {
    let chatPicture, chatName, otherUser, unseen;
    if (user) {
      otherUser = users[chats[chat].participants.filter((u) => u != user.uid)[0]];
      chatPicture = chats[chat].isGroup ? chats[chat].photo : otherUser.pfp;
      chatName = chats[chat].isGroup ? chats[chat].name : otherUser.name;

      let messages = chats[chat].messages;
      if (messages) {
        unseen = Object.keys(messages).filter((m) => !messages[m].seenBy[user.uid] && user.uid != messages[m].sender).length
      }
    }
    

    return [chatName, chatPicture, unseen];
  }

  if (user == null) {
    return (
      <div>

      </div>
    );
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
          <div className="w-1/3 h-full bg-slate-50 flex border-r border-gray-200">
            <header className="bg-gray-100 z-40 h-14 absolute top-0 left-0 w-1/3 shadow-md shadow-custom border-r border-gray-200">
              <div className="flex">
                <img
                  onClick={() => setModalVisible(true)}
                  src={users[user.uid].pfp}
                  className="h-10 w-10 rounded-full ml-4 my-auto cursor-pointer hover:scale-105 duration-300 inline-flex mt-2"
                />
                <h1 className="text-black mt-4 ml-2 font-medium">
                  {users[user.uid].name}
                </h1>
              </div>
            </header>
            <div className="mt-14 w-full pt-1 z-20">
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
                    if (messages[sortedMessages[0]]) lastMessage = messages[sortedMessages[0]].msg;
                  }

                  let [chatName, chatPicture, unseen] = processChat(c);

                  return (
                    <div key={c} onClick={() => setChat(c)} className="cursor-pointer">
                      <Chat
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
            <header className="bg-gray-100 z-30 h-14 absolute top-0 right-0 w-2/3 shadow-md shadow-custom">
              {selectedChat && (
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
            {!selectedChat && (
              <div className="w-full h-full mx-auto my-auto items-center justify-center">
                <img className="w-2/5 mx-auto mt-24" src="/begin chat.svg" />
                <span className="text-center text-gray-500 justify-center block mt-4">
                  Selecione uma conversa para começar!
                </span>
              </div>
            )}
            {selectedChat && (
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
          onClick={(e) => {
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
            <h2 className="text-gray-500 font-semibold text-xl mx-10 mt-2 text-center">
              Caso queira, você pode trocar sua foto visível aos outros
              usuários.
            </h2>
            (
            <>
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mt-3 shadow-custom shadow-md">
                <img
                  src={
                    users[user.uid].pfp
                  }
                />
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

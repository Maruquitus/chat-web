"use client";
import { Button } from "../../components/Button.js";
import { Input } from "../../components/Input.js";
import { auth, db, storage } from "../firebase.js";
import { ref, set, get } from "firebase/database";
import { useEffect, useState } from "react";
import { erros } from "../errorMessages.js";
import { Link } from "@/components/Link.js";
import { IconButton } from "@/components/IconButton.js";

export default function SignUp() {
  const [erro, setErro] = useState("");
  const [photo, setPhoto] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [username, setName] = useState(); 
  let name, email, senha, confirmarSenha, botão;

  //Desabilitar reload do form
  useEffect(() => {
    document.querySelector("form").addEventListener("submit", function (event) {
      event.preventDefault();
    });
  }, []);

  /**
   * Checa a validade das inputs colocadas no formulário: email, senha e confirmarSenha.
   * @see checkUsernameAndEmailAvailable(name,email) Verifica se o username ou email já existe na base de dados.
   * Também checa algumas regras básicas de segurança, como a quantidade de caracteres da senha.
   * @returns {bool} Validade das inputs
   */
  async function checkInputValidity() {
    name = document.getElementById("name").value;
    setName(name);
    email = document.getElementById("email").value;
    senha = document.getElementById("senha").value;
    confirmarSenha = document.getElementById("confirmarSenha").value;
    botão = document.getElementById("botão");
    let usernameOrEmailAvailable = await checkUsernameAndEmailAvailable(
      name,
      email
    );

    if (!usernameOrEmailAvailable) {
      return false;
    }

    if (
      email.length >= 8 &&
      senha.length >= 8 &&
      name.length != 0 &&
      confirmarSenha == senha
    ) {
      setErro("");
      return true;
    } else {
      if (confirmarSenha != senha) {
        setErro(erros["senhasdiferentes"]);
      } else {
        setErro(erros["vazio"]);
      }
      return false;
    }
  }

  /**
   * Checa a disponibilidade do nome de usuário e email.
   * @param {string} username Nome do usuário.
   * @param {string} email Email do usuário.
   */
  async function checkUsernameAndEmailAvailable(username, email) {
    //Carregar informações dos usuários
    const usersRef = ref(db, "Users/");
    let result = get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          let val = snapshot.val();
          let passed = true;
          Object.keys(val).map((uid) => {
            if (val[uid].name == username) {
              setErro(erros["usuarioexiste"]);
              passed = false;
            }
            if (val[uid].email == email) {
              setErro(erros["auth/email-already-in-use"]);
              passed = false;
            }
          });

          return passed;
        } else {
          return false;
        }
      })
      .catch(() => {
        return false;
      });
    return result;
  }

  /**
 * Atualiza os dados do registro na BD.
 * @param {object} dados Dados do novo usuário.
 * @param {string} url URL da foto de perfil.
 */
  const finishSignUp = async (dados, url) => {
    //Atualizar dados na bd
    const user = dados.user;
    const userRef = ref(db, "Users/" + user.uid);
    await set(userRef, {
      email: user.email,
      name: name,
      pfp:
        url ||
        "https://cdn.vectorstock.com/i/preview-1x/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg",
    });

    setErro("");
    botão.style.cursor = "pointer";
    alert("Registro feito com sucesso!");
  };

  /**
   * Pega as informações do formulário e cria o usuário no Firebase.
   * @event Button#click
   */

  const signUp = async () => {
    //Verificação das inputs
    if (await checkInputValidity()) {
      botão.style.cursor = "wait";

      //Criar usuário no Firebase
      auth
        .createUserWithEmailAndPassword(email, senha)
        .then(async (dados) => {
          if (photo) {
            //Enviar foto de perfil
            let filename = email;
            let storageRef = storage.ref("pfps/" + filename);

            let uploadTask = storageRef.put(photo);
            setUploading(true);
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                console.log(snapshot);
              },
              () => {
                //Caso aconteça algum erro
                setUploading(false);
                setPhoto();
                alert("Algo deu errado, tente enviar a imagem novamente.");
              },
              async () => {
                // Se o upload tiver funcionado
                let url = await uploadTask.snapshot.ref.getDownloadURL();
                setUploading(false)
                finishSignUp(dados, url);
              }
            );
          } else {
            finishSignUp(dados, null);
          }
        })
        .catch((err) => {
          let mensagem = erros[err.code] ? erros[err.code] : "Algo deu errado.";
          console.log(err);
          setErro(mensagem);
          botão.style.cursor = "pointer";
        });
      setModalVisible(false);
    }
  };


  /**
   * Abre o diálogo de escolher arquivo.
   */
  function getPhoto() {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      var file = e.target.files[0];
      setPhoto(file);
    };
    input.click();
  }

  //Renderizar página
  return (
    <main className="w-full h-full flex">
      {/* Página principal*/}
      <div
        className={`${
          modalVisible ? "blur-sm" : ""
        } absolute w-full h-full flex`}
      >
        <div className="sm:w-1/3 self-center p-4 grid mx-auto mb-14 sm:ml-8">
          <img className="w-1/4 block mx-auto" src="/icon.png"></img>
          <h1 className="text-black font-bold text-2xl text-center">
            Seja bem vindo! Insira suas informações.
          </h1>
          <form className="space-y-3">
            <Input id="name" título="Nome de usuário" tipo="text" />
            <Input id="email" título="Email" tipo="text" />
            <Input
              id="senha"
              título="Senha"
              tipo={visible ? "text" : "password"}
            />
            <Input
              id="confirmarSenha"
              título="Confirme sua senha"
              tipo={visible ? "text" : "password"}
            />
            <div className="flex-row">
              <input
                type="checkbox"
                onChange={(e) => setVisible(e.target.checked)}
              ></input>
              <label className="text-gray-500 font-semibold ml-1">
                Mostrar senha
              </label>
            </div>

            <div className="justify-center grid">
              <Button
                id="botão"
                action={async () => {
                  if (await checkInputValidity()) setModalVisible(true);
                }}
                text="Cadastrar"
              />
              <span className="text-gray-500 text-center font-semibold mt-1">
                Já tem uma conta?
                <Link
                  className="ml-1"
                  text="Faça login!"
                  destination="/login"
                />
              </span>
            </div>
          </form>
          <span className="text-red-500 text-center font-semibold">{erro}</span>
        </div>
        <div className="hidden absolute right-0 top-20 sm:inline-flex w-2/3">
          <img
            className="w-3/5 mx-auto align-middle mt-14"
            src="/sign up.svg"
          ></img>
        </div>
      </div>

      {/* Modal para adicionar foto de perfil*/}
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
          className="absolute border border-zinc-100 m-auto bg-white w-1/2 h-auto p-10 top-14 left-1/4 shadow-custom shadow-lg rounded-2xl"
        >
          <i
            onClick={() => setModalVisible(false)}
            class="fa-solid fa-x absolute right-6 top-6 text-gray-500 text-2xl cursor-pointer hover:scale-105 duration-300"
          ></i>
          <h1 className="text-black font-bold text-3xl text-center">
            Quase lá!
          </h1>
          <h2 className="text-gray-500 font-semibold text-xl mx-10 mt-2 text-center">
            Opcionalmente, você pode adicionar uma foto de perfil para ser
            mostrada a todos!
          </h2>
          <>
            <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mt-3 shadow-custom shadow-md">
              <img
                src={
                  photo
                    ? URL.createObjectURL(photo)
                    : "https://cdn.vectorstock.com/i/preview-1x/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg"
                }
              />
            </div>
            <h3 className="text-center text-black text-2xl mt-2 mb-3">{username}</h3>
          </>
          <div className="flex w-11/12 mx-auto justify-around">
            <IconButton
              action={() => getPhoto()}
              text="Adicionar foto"
              icon="image"
            />
            <IconButton
              disabled={uploading}
              action={() => signUp()}
              text="Finalizar cadastro"
              icon="circle-check"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

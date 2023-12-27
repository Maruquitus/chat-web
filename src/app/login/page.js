'use client';
import { Button } from "../../components/Button.js";
import { Input } from "../../components/Input.js";
import { auth } from "../firebase.js";
import { useEffect, useState } from "react";
import { erros } from "../errorMessages.js";
import { Link } from "@/components/Link.js";

export default function Login(props) {
    const [erro, setErro] = useState("");
  
    useEffect(() => {
      document.querySelector('form').addEventListener('submit', function(event) { 
        event.preventDefault();
    })}, []);
  
    const realizarLogin = async () => {
      let email = document.getElementById('email').value;
      let senha = document.getElementById('senha').value;
      let botão = document.getElementById('botão');
      if (email.length != 0 && senha.length != 0) {
        botão.style.cursor = 'wait';
        auth
          .signInWithEmailAndPassword(email, senha)
          .then(async (data) => {
            setErro('');
            botão.style.cursor = 'pointer';
            console.log(auth.currentUser)
            document.location.href = '/messages';
          })
          .catch((err) => {
            let mensagem = erros[err.code] ? erros[err.code] : "Algo deu errado.";
            console.log(err.code);
            setErro(mensagem);
            botão.style.cursor = 'pointer';
          });
      } else {
        setErro(erros["vazio"]);
      }
    }
  
    return (
      <main className='w-full h-full flex'>
        <div className='sm:w-1/3 self-center p-4 grid mx-auto mb-32 sm:ml-8'>
          <img className='w-1/4 block mx-auto' src='/icon.png'></img>
          <h1 className='text-black font-bold text-2xl text-center'>Olá! Entre na sua conta.</h1>
          <form className='space-y-3'>
            <Input id='email' título='Email' tipo='text'/>
            <Input id='senha' título='Senha' tipo='password'/>
            <div class="flex justify-center">
              <Button id='botão' action={() => realizarLogin()} text='Entrar'/>
            </div>
          </form>
          <span className="text-gray-500 text-center font-semibold mt-1">Ainda não tem uma conta? 
            <Link className='ml-1' text='Registre-se!' destination='/signup'/>
          </span>
          <span className="text-red-500 text-center font-semibold">{erro}</span>
        </div>
        <div className='hidden absolute right-0 top-20 sm:inline-flex w-2/3'>
          <img className='w-3/4 mx-auto align-middle' src='/login.svg'></img>
        </div>
      </main>
    )
  }
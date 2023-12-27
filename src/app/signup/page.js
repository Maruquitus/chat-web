'use client';
import { Button } from "../../components/Button.js";
import { Input } from "../../components/Input.js";
import { auth } from "../firebase.js";
import { useEffect, useState } from "react";
import { erros } from "../errorMessages.js";
import { Link } from '@/components/Link.js';

export default function SignUp(props) {
    const [erro, setErro] = useState("");
  
    useEffect(() => {
      document.querySelector('form').addEventListener('submit', function(event) { 
        event.preventDefault();
    })}, []);
  
    const realizarSignUp = async () => {
      let email = document.getElementById('email').value;
      let senha = document.getElementById('senha').value;
      let confirmarSenha = document.getElementById('confirmarSenha').value;
      let botão = document.getElementById('botão');
      if (email.length != 0 && senha.length != 0 && confirmarSenha == senha) {
        botão.style.cursor = 'wait';
        auth
          .createUserWithEmailAndPassword(email, senha)
          .then(async () => {
            setErro('');
            botão.style.cursor = 'pointer';
            alert('Registro feito com sucesso!')
          })
          .catch((err) => {
            let mensagem = erros[err.code] ? erros[err.code] : "Algo deu errado.";
            console.log(err.code);
            setErro(mensagem);
            botão.style.cursor = 'pointer';
          });
      } else {
        if (confirmarSenha != senha)
        {
          setErro(erros['senhasdiferentes']);
        }
        else {
          setErro(erros["vazio"]);
        }
      }
    }
  
    return (
      <main className='w-full h-full flex'>
        <div className='sm:w-1/3 self-center p-4 grid mx-auto mb-14 sm:ml-8'>
          <img className='w-1/4 block mx-auto' src='/icon.png'></img>
          <h1 className='text-black font-bold text-2xl text-center'>Seja bem vindo! Insira suas informações.</h1>
          <form className='space-y-3'>
            <Input id='email' título='Email' tipo='text'/>
            <Input id='senha' título='Senha' tipo='password'/>
            <Input id='confirmarSenha' título='Confirme sua senha' tipo='password'/>
            <div class="justify-center grid">
              <Button id='botão' action={() => realizarSignUp()} text='Cadastrar'/>
              <span className="text-gray-500 text-center font-semibold mt-1">Já tem uma conta?
                <Link className='ml-1' text='Faça login!' destination='/login'/>
              </span>
            </div>
          </form>
          <span className="text-red-500 text-center font-semibold">{erro}</span>
        </div>
        <div className='hidden absolute right-0 top-20 sm:inline-flex w-2/3'>
          <img className='w-3/5 mx-auto align-middle mt-14' src='/sign up.svg'></img>
        </div>
      </main>
    )
  }
  
'use client';
import { Button } from "@/components/Button";
export default function Erro404() {
    return (
    <div className="items-center grid">
        <h1 className='text-black text-center mx-auto text-3xl mt-14 text-bold font-bold'>Ops! Algo deu errado.</h1>
        <span className='text-gray-600 text-center mx-auto text-xl w-2/3 text-medium'>Não conseguimos encontrar a página que estava procurando. Se quiser, pode voltar à tela de login ou tentar novamente mais tarde.</span>
        <div className="flex mt-4">
            <Button text='Fazer login' action={() => document.location.href='/login'} />
        </div>
        <img className="mx-auto sm:w-2/5 w-4/5 mt-5" src="/404.svg"/>
    </div>
    );
}
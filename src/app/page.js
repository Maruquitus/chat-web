'use client';
import { redirect } from 'next/navigation';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase.js";


export default function App() {
    const [user, userLoading] = useAuthState(auth);

    //Redirecionar usuários para a tela de login ou mensagens dependendo da autenticação
    if (!userLoading) {
        if (user) redirect('/messages');
        else redirect('/login');
    }
}

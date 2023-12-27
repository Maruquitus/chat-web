'use client';
import { auth } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Messages(props) {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return (
            <div className='flex h-screen w-screen text-2xl'>
                <h1 className="text-gray-500 font-bold m-auto">
                    Carregando...
                </h1>
            </div>
            
        )
    }
    else {
        if (!user) {
            document.location.href = '/login';
        }
    }
    
    return (
        <>
            <div className="bg-gray-100 h-14 absolute top-0 left-0 w-full">
                    <a className="font-bold text-cyan-500 cursor-pointer hover:" onClick={() => auth.signOut()}>Sair da conta</a>
            </div>
            <div className="flex w-full h-screen">
                <div className="w-1/3 h-full bg-slate-100 flex">

                </div>
                <div className="w-2/3 h-full bg-slate-200 flex">

                </div>
            </div>
        </>
        
    )
}